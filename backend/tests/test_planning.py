import unittest
import asyncio
from app.planning.goal import InvestigationGoal
from app.planning.plan import InvestigationPlan, PlannedTask
from app.planning.constraints import PlanningConstraints
from app.planning.strategy import StrategyRegistry
from app.planning.types import TaskCapability, PlanningStrategyType, PlanStatus
from app.planning.validation import PlanValidator
from app.planning.planner import CognitivePlanner
from app.planning.exceptions import (
    CircularDependencyError,
    MissingGoalError,
    ConstraintViolationError,
    InvalidPlanError
)
from app.agents.context import AgentContext
from app.agents.state import InvestigationState
from app.agents.planner.agent import PlannerAgent

class TestCognitivePlanningEngine(unittest.TestCase):

    def setUp(self):
        self.planner = CognitivePlanner()

    def test_goal_creation(self):
        goal = self.planner.create_goal("Show me all burglary cases in Bengaluru involving repeat offenders.")
        self.assertIsNotNone(goal.goal_id)
        self.assertIn("burglary", goal.description.lower())
        self.assertEqual(goal.confidence, 0.95)

    def test_strategy_selection(self):
        goal_comp = InvestigationGoal(title="Comparative analysis of suspects", description="Compare suspect A versus suspect B")
        strat_comp = StrategyRegistry.select_strategy(goal_comp)
        self.assertEqual(strat_comp.strategy_type, PlanningStrategyType.COMPARATIVE_INVESTIGATION)

        goal_trend = InvestigationGoal(title="Crime trend analysis", description="Repeat offenders trend over time")
        strat_trend = StrategyRegistry.select_strategy(goal_trend)
        self.assertEqual(strat_trend.strategy_type, PlanningStrategyType.TREND_ANALYSIS)

    def test_plan_generation_and_validation(self):
        prompt = "Show me all burglary cases in Bengaluru involving repeat offenders."
        plan = self.planner.plan(prompt)

        self.assertIsNotNone(plan.plan_id)
        self.assertEqual(plan.status, PlanStatus.VALIDATED)
        self.assertGreater(len(plan.tasks), 0)
        self.assertGreater(len(plan.execution_order), 0)
        self.assertEqual(len(plan.execution_order), len(plan.tasks))

    def test_circular_dependency_detection(self):
        goal = InvestigationGoal(title="Test Goal", description="Test Description")
        t1 = PlannedTask(task_id="task-1", title="Task 1", required_capability=TaskCapability.DATABASE_QUERY, dependencies=["task-2"])
        t2 = PlannedTask(task_id="task-2", title="Task 2", required_capability=TaskCapability.EVIDENCE_ANALYSIS, dependencies=["task-1"])
        
        plan = InvestigationPlan(goal=goal, tasks=[t1, t2])
        
        with self.assertRaises(CircularDependencyError):
            PlanValidator.validate(plan)

    def test_constraint_violation(self):
        goal = InvestigationGoal(title="Test Goal", description="Test Description")
        tasks = [
            PlannedTask(task_id=f"task-{i}", title=f"Task {i}", required_capability=TaskCapability.DATABASE_QUERY)
            for i in range(10)
        ]
        plan = InvestigationPlan(goal=goal, tasks=tasks)
        constraints = PlanningConstraints(max_tasks=5)

        with self.assertRaises(ConstraintViolationError):
            PlanValidator.validate(plan, constraints)

    def test_missing_goal_validation(self):
        plan = InvestigationPlan(goal=InvestigationGoal(title=""), tasks=[])
        with self.assertRaises(MissingGoalError):
            PlanValidator.validate(plan)

    def test_planner_agent_integration(self):
        async def run_async():
            agent = PlannerAgent()
            await agent.initialize()
            
            state = InvestigationState()
            state.context["prompt"] = "Investigate financial fraud network in Tech Park"
            ctx = AgentContext(state=state)

            result = await agent.execute(ctx)
            self.assertTrue(result.success)
            self.assertIn("investigation_plan", ctx.state.context)
            self.assertEqual(result.output["status"], "plan_generated")

            await agent.shutdown()

        asyncio.run(run_async())

if __name__ == '__main__':
    unittest.main()
