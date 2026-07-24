from typing import Dict, Any, List, Optional
from app.agents.queue import TaskQueue
from app.agents.registry import AgentRegistry
from app.agents.context import AgentContext
from app.agents.result import AgentResult
from app.agents.state import InvestigationState
from app.agents.task import InvestigationTask
from app.agents.types import AgentType, TaskStatus
from app.agents.exceptions import AgentExecutionError
from app.core.logging import logger

class OrchestrationGraph:
    """
    Decoupled Orchestration Graph for ArcCraft Multi-Agent System.
    
    Architecture Loop:
    Supervisor -> Task Queue -> Worker Agent (Planner/Memory/Investigator/SQL) -> Memory -> Supervisor
    
    Guarantees:
    - Supervisor never calls Planner or specialized agents directly.
    - Planner never calls Memory or other agents directly.
    - Every agent consumes work from TaskQueue and posts outputs back to state/memory.
    - Plug-and-play extensibility for new agents.
    """

    def __init__(self, registry: AgentRegistry):
        self.registry = registry

    async def step(self, context: AgentContext, queue: TaskQueue) -> AgentResult:
        """
        Executes a single step in the orchestration loop:
        1. If tasks are pending in TaskQueue, route to assigned worker agent.
        2. Worker executes task and updates Memory/State.
        3. Memory agent synthesizes updated state.
        4. Control returns to Supervisor to review progress or enqueue new tasks.
        """
        # Step 1: Check TaskQueue for pending work
        if not queue.is_empty():
            task = queue.dequeue()
            if task and task.assigned_agent:
                try:
                    worker = self.registry.get_agent(task.assigned_agent)
                    logger.info(f"Orchestrator: Routing task '{task.title}' to worker '{worker.name()}' via TaskQueue.")
                    
                    # Worker executes task independently
                    worker_result = await worker.execute(context)
                    
                    if worker_result.success:
                        queue.mark_task_completed(task, worker_result.output)
                    else:
                        queue.mark_task_failed(task, "; ".join(worker_result.errors))
                    
                    # Step 2: Pass through Memory Agent to update state context
                    try:
                        memory_agent = self.registry.get_agent(AgentType.MEMORY.value)
                        await memory_agent.execute(context)
                    except Exception as mem_err:
                        logger.warning(f"Memory Agent post-processing warning: {mem_err}")

                    return worker_result
                except Exception as e:
                    queue.mark_task_failed(task, str(e))
                    raise AgentExecutionError(f"Worker task execution failed: {e}")

        # Step 3: When queue is empty, route back to Supervisor to assess overall goal or generate new tasks
        supervisor = self.registry.get_agent(AgentType.SUPERVISOR.value)
        logger.info("Orchestrator: TaskQueue empty or completed; returning control to Supervisor.")
        sup_result = await supervisor.execute(context)
        return sup_result

    async def run_until_complete(
        self,
        context: AgentContext,
        queue: TaskQueue,
        max_steps: int = 10
    ) -> InvestigationState:
        """
        Runs the orchestration loop until TaskQueue is depleted and Supervisor marks execution completed.
        """
        steps = 0
        while steps < max_steps:
            steps += 1
            context.state.execution_metrics["orchestration_steps"] = steps
            await self.step(context, queue)

            # Check if all tasks completed and supervisor done
            if queue.is_empty() and context.state.current_agent == "Supervisor":
                break

        return context.state
