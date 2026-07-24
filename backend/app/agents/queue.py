from typing import List, Dict, Any, Optional
from collections import deque
import asyncio
from app.agents.task import InvestigationTask
from app.agents.types import TaskStatus, TaskPriority
from app.agents.state import InvestigationState
from app.agents.exceptions import AgentExecutionError

class TaskQueue:
    """
    Decoupled Task Queue for multi-agent orchestration.
    Acts as an intermediate buffer between Supervisor, Planner, Memory, and specialized domain agents.
    Allows Supervisor to post work without knowing worker implementations,
    and workers to execute tasks without knowing upstream sources or downstream consumers.
    """

    def __init__(self, state: Optional[InvestigationState] = None):
        self._queue: deque[InvestigationTask] = deque()
        self._state = state
        if state and state.pending_tasks:
            for task_dict in state.pending_tasks:
                task = InvestigationTask(**task_dict)
                self._queue.append(task)

    def enqueue(self, task: InvestigationTask) -> None:
        """Enqueue a new task into the queue and synchronize state."""
        task.status = TaskStatus.PENDING
        self._queue.append(task)
        if self._state:
            # Sync with state pending_tasks
            self._state.pending_tasks.append(task.model_dump())
            self._state.update_timestamp()

    def enqueue_batch(self, tasks: List[InvestigationTask]) -> None:
        """Enqueue multiple tasks."""
        for t in tasks:
            self.enqueue(t)

    def dequeue(self, assigned_agent: Optional[str] = None) -> Optional[InvestigationTask]:
        """
        Pop the next pending task from the queue.
        If assigned_agent is specified, filter for tasks assigned to that agent or unassigned tasks.
        """
        if not self._queue:
            return None

        # Sort/Filter by priority if needed
        for i, task in enumerate(self._queue):
            if task.status == TaskStatus.PENDING:
                if assigned_agent is None or task.assigned_agent is None or task.assigned_agent.lower() == assigned_agent.lower():
                    del self._queue[i]
                    task.status = TaskStatus.IN_PROGRESS
                    if self._state:
                        self._sync_state_task_status(task)
                    return task
        return None

    def peek(self) -> Optional[InvestigationTask]:
        """Inspect the next pending task without removing it."""
        for task in self._queue:
            if task.status == TaskStatus.PENDING:
                return task
        return None

    def mark_task_completed(self, task: InvestigationTask, result_data: Optional[Dict[str, Any]] = None) -> None:
        """Mark task completed and move from pending to completed in state."""
        task.mark_completed(result_data)
        if self._state:
            # Remove from pending_tasks and add to completed_tasks
            self._state.pending_tasks = [t for t in self._state.pending_tasks if t.get("task_id") != task.task_id]
            self._state.completed_tasks.append(task.model_dump())
            self._state.update_timestamp()

    def mark_task_failed(self, task: InvestigationTask, error_message: str) -> None:
        """Mark task failed and move from pending to failed in state."""
        task.mark_failed(error_message)
        if self._state:
            self._state.pending_tasks = [t for t in self._state.pending_tasks if t.get("task_id") != task.task_id]
            self._state.failed_tasks.append(task.model_dump())
            self._state.update_timestamp()

    def _sync_state_task_status(self, task: InvestigationTask) -> None:
        if not self._state:
            return
        for i, t_dict in enumerate(self._state.pending_tasks):
            if t_dict.get("task_id") == task.task_id:
                self._state.pending_tasks[i] = task.model_dump()
                break

    def is_empty(self) -> bool:
        return len([t for t in self._queue if t.status == TaskStatus.PENDING]) == 0

    def size(self) -> int:
        return len([t for t in self._queue if t.status == TaskStatus.PENDING])
