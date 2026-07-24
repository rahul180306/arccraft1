from typing import List, Dict, Set
from collections import defaultdict, deque
from app.planning.plan import InvestigationPlan, PlannedTask
from app.planning.constraints import PlanningConstraints
from app.planning.types import PlanStatus, TaskCapability
from app.planning.exceptions import (
    InvalidPlanError,
    CircularDependencyError,
    MissingGoalError,
    ConstraintViolationError,
)

class PlanValidator:
    """
    Validates generated InvestigationPlan against integrity rules and planning constraints.
    Checks:
    - Goal existence
    - Circular dependency detection
    - Duplicate task identification
    - Valid execution order resolution (Topological Sort)
    - Capability completeness
    - Constraint bounds enforcement
    """

    @classmethod
    def validate(
        cls,
        plan: InvestigationPlan,
        constraints: PlanningConstraints = PlanningConstraints()
    ) -> List[str]:
        """
        Validate plan. Returns list of resolved topological execution order of task_ids if valid.
        Raises specific PlanningError subclasses if validation fails.
        """
        # 1. Goal Check
        if not plan.goal or not plan.goal.title:
            raise MissingGoalError("InvestigationPlan lacks a valid InvestigationGoal.")

        # 2. Constraint Checks
        if len(plan.tasks) > constraints.max_tasks:
            raise ConstraintViolationError(
                f"Plan task count ({len(plan.tasks)}) exceeds maximum constraint ({constraints.max_tasks})."
            )

        if not plan.tasks:
            raise InvalidPlanError("InvestigationPlan contains zero tasks.")

        # 3. Duplicate Task ID Check & Capability Check
        task_map: Dict[str, PlannedTask] = {}
        for t in plan.tasks:
            if t.task_id in task_map:
                raise InvalidPlanError(f"Duplicate task_id detected: '{t.task_id}'.")
            if not isinstance(t.required_capability, TaskCapability):
                raise InvalidPlanError(f"Task '{t.title}' has missing or invalid capability: '{t.required_capability}'.")
            task_map[t.task_id] = t

        # 4. Dependency & Topological Sort (Cycle Detection)
        in_degree: Dict[str, int] = {t_id: 0 for t_id in task_map}
        adj_list: Dict[str, List[str]] = defaultdict(list)

        for t_id, task in task_map.items():
            for dep_id in task.dependencies:
                if dep_id not in task_map:
                    raise InvalidPlanError(
                        f"Task '{task.title}' references non-existent dependency task_id: '{dep_id}'."
                    )
                adj_list[dep_id].append(t_id)
                in_degree[t_id] += 1

        # Kahn's Algorithm for Topological Sort
        queue: deque = deque([t_id for t_id, deg in in_degree.items() if deg == 0])
        execution_order: List[str] = []

        while queue:
            curr = queue.popleft()
            execution_order.append(curr)
            for neighbor in adj_list[curr]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(execution_order) != len(task_map):
            raise CircularDependencyError("Circular dependency detected in InvestigationPlan task graph.")

        plan.execution_order = execution_order
        plan.status = PlanStatus.VALIDATED
        return execution_order
