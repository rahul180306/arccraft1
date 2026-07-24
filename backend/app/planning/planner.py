import uuid
from typing import Optional, Dict, Any, List
from app.planning.goal import InvestigationGoal
from app.planning.plan import InvestigationPlan, PlannedTask
from app.planning.strategy import StrategyRegistry, StrategyDefinition
from app.planning.constraints import PlanningConstraints
from app.planning.validation import PlanValidator
from app.planning.types import TaskCapability, PlanStatus, PlanningStrategyType
from app.planning.exceptions import PlanningError
from app.core.logging import logger

class PlannerPromptsPlaceholder:
    """Placeholder interface for Planner prompt loading."""
    GOAL_EXTRACTION_PROMPT: str = "Extract structured InvestigationGoal from user prompt."
    TASK_DECOMPOSITION_PROMPT: str = "Decompose InvestigationGoal into ordered PlannedTask steps."

class CognitivePlanner:
    """
    Cognitive Planning Engine for ArcCraft.
    Decomposes natural language requests into structured, validated InvestigationPlan objects.
    
    Principles:
    - Does NOT solve investigations or run database/SQL queries.
    - ONLY creates structured investigation strategies and task plans.
    - Never returns plain conversational text or markdown explanations.
    """

    def __init__(
        self,
        constraints: Optional[PlanningConstraints] = None,
        prompts: Optional[PlannerPromptsPlaceholder] = None
    ):
        self.constraints = constraints or PlanningConstraints()
        self.prompts = prompts or PlannerPromptsPlaceholder()

    def create_goal(
        self,
        prompt: str,
        case_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> InvestigationGoal:
        """
        Converts user natural language request into an InvestigationGoal.
        """
        title = prompt.strip()[:80] or "General Investigation Goal"
        goal = InvestigationGoal(
            title=title,
            description=prompt,
            intent="investigate_request",
            scope={"case_id": case_id} if case_id else {},
            requested_outputs=["investigation_summary", "evidence_list", "timeline"],
            confidence=0.95
        )
        logger.info(f"Goal Created: '{goal.goal_id}' - {goal.title}")
        return goal

    def plan(
        self,
        request: str | InvestigationGoal,
        case_id: Optional[str] = None,
        custom_constraints: Optional[PlanningConstraints] = None
    ) -> InvestigationPlan:
        """
        Main entrypoint: Generates a validated InvestigationPlan from prompt or goal.
        """
        constraints = custom_constraints or self.constraints

        # Step 1: Ensure InvestigationGoal
        if isinstance(request, str):
            goal = self.create_goal(request, case_id=case_id)
        elif isinstance(request, InvestigationGoal):
            goal = request
        else:
            raise PlanningError("Invalid planning request. Expected prompt string or InvestigationGoal.")

        # Step 2: Strategy Selection
        strategy = StrategyRegistry.select_strategy(goal)
        logger.info(f"Strategy Selected: '{strategy.name}' for Goal '{goal.title}'")

        # Step 3: Task Decomposition
        tasks = self._decompose_tasks(goal, strategy)

        # Step 4: Construct InvestigationPlan
        required_caps = list({t.required_capability for t in tasks})
        plan = InvestigationPlan(
            goal=goal,
            tasks=tasks,
            estimated_steps=len(tasks),
            required_capabilities=required_caps,
            status=PlanStatus.DRAFT,
            metadata={
                "strategy": strategy.strategy_type.value,
                "strategy_name": strategy.name
            }
        )
        logger.info(f"Plan Generated: '{plan.plan_id}' with {len(tasks)} tasks.")

        # Step 5: Plan Validation
        try:
            PlanValidator.validate(plan, constraints)
            logger.info(f"Validation Passed for Plan '{plan.plan_id}'")
        except Exception as e:
            logger.error(f"Validation Failed for Plan '{plan.plan_id}': {e}")
            plan.status = PlanStatus.FAILED
            raise

        return plan

    def _decompose_tasks(
        self,
        goal: InvestigationGoal,
        strategy: StrategyDefinition
    ) -> List[PlannedTask]:
        """
        Decomposes goal into a logical sequence of PlannedTasks based on selected strategy.
        """
        tasks: List[PlannedTask] = []
        t1_id = str(uuid.uuid4())
        t2_id = str(uuid.uuid4())
        t3_id = str(uuid.uuid4())
        t4_id = str(uuid.uuid4())

        # Step A: Primary Data Search & Retrieval
        task1 = PlannedTask(
            task_id=t1_id,
            title=f"Query Database for {goal.title}",
            description=f"Query primary database for records matching: {goal.description}",
            purpose="Retrieve raw case/FIR/incident records.",
            required_capability=TaskCapability.DATABASE_QUERY,
            priority="high",
            dependencies=[],
            expected_output="Raw database records and incident files."
        )
        tasks.append(task1)

        # Step B: Evidence or Pattern Analysis (depends on Task 1)
        if TaskCapability.EVIDENCE_ANALYSIS in strategy.recommended_capabilities:
            task2 = PlannedTask(
                task_id=t2_id,
                title="Analyze Retrieved Evidence & Documents",
                description="Perform forensic analysis on retrieved documents, statements, and attachments.",
                purpose="Extract key evidence entities, suspect mentions, and forensic findings.",
                required_capability=TaskCapability.EVIDENCE_ANALYSIS,
                priority="high",
                dependencies=[t1_id],
                expected_output="Extracted entities and forensic findings."
            )
            tasks.append(task2)
            prev_dep = t2_id
        elif TaskCapability.PATTERN_DETECTION in strategy.recommended_capabilities:
            task2 = PlannedTask(
                task_id=t2_id,
                title="Detect Criminal Patterns and Modus Operandi",
                description="Cross-analyze retrieved incidents to identify repeating criminal patterns.",
                purpose="Group incidents by modus operandi and suspect signatures.",
                required_capability=TaskCapability.PATTERN_DETECTION,
                priority="medium",
                dependencies=[t1_id],
                expected_output="Identified criminal patterns and clusters."
            )
            tasks.append(task2)
            prev_dep = t2_id
        else:
            prev_dep = t1_id

        # Step C: Timeline or Link Analysis (depends on previous step)
        if TaskCapability.TIMELINE_CONSTRUCTION in strategy.recommended_capabilities:
            task3 = PlannedTask(
                task_id=t3_id,
                title="Construct Investigation Chronological Timeline",
                description="Order all extracted events and incidents chronologically.",
                purpose="Establish clear event sequence and suspect timeline.",
                required_capability=TaskCapability.TIMELINE_CONSTRUCTION,
                priority="medium",
                dependencies=[prev_dep],
                expected_output="Chronological timeline of events."
            )
            tasks.append(task3)
            prev_dep = t3_id

        # Step D: Final Synthesis & Visualization/Report
        task4 = PlannedTask(
            task_id=t4_id,
            title="Generate Investigation Report and Visualizations",
            description="Synthesize all findings into structured report output.",
            purpose="Produce final investigation deliverable for decision-making.",
            required_capability=TaskCapability.REPORT_GENERATION,
            priority="low",
            dependencies=[prev_dep],
            expected_output="Structured investigation report."
        )
        tasks.append(task4)

        return tasks
