import unittest
import asyncio
from app.agents.types import AgentType, AgentStatus, TaskStatus, TaskPriority, EventType
from app.agents.exceptions import AgentExecutionError, AgentRegistrationError
from app.agents.lifecycle import AgentLifecycle
from app.agents.events import AgentEvent
from app.agents.task import InvestigationTask
from app.agents.result import AgentResult
from app.agents.state import InvestigationState
from app.agents.context import AgentContext
from app.agents.registry import AgentRegistry
from app.agents.factory import AgentFactory
from app.agents.queue import TaskQueue
from app.agents.orchestrator import OrchestrationGraph
from app.agents.supervisor.agent import SupervisorAgent
from app.agents.planner.agent import PlannerAgent
from app.agents.memory.agent import MemoryAgent

class TestMultiAgentFoundation(unittest.TestCase):

    def test_lifecycle_transitions(self):
        lifecycle = AgentLifecycle()
        self.assertEqual(lifecycle.status, AgentStatus.CREATED)
        
        lifecycle.transition_to(AgentStatus.INITIALIZED)
        self.assertEqual(lifecycle.status, AgentStatus.INITIALIZED)
        
        lifecycle.transition_to(AgentStatus.READY)
        self.assertEqual(lifecycle.status, AgentStatus.READY)

        with self.assertRaises(AgentExecutionError):
            # Invalid transition: Ready -> Shutdown directly or invalid transition
            lifecycle.transition_to(AgentStatus.CREATED)

    def test_investigation_state_v2(self):
        state = InvestigationState(case_id="case-101", user_id="user-01")
        self.assertEqual(state.case_id, "case-101")
        self.assertEqual(state.user_id, "user-01")
        self.assertIsNotNone(state.request_id)
        self.assertIn("created_at", state.timestamps)

    def test_investigation_task(self):
        task = InvestigationTask(title="Analyze Evidence", priority=TaskPriority.HIGH)
        self.assertEqual(task.status, TaskStatus.PENDING)
        task.mark_completed({"output": "sample"})
        self.assertEqual(task.status, TaskStatus.COMPLETED)
        self.assertEqual(task.result, {"output": "sample"})

    def test_agent_event_immutable(self):
        event = AgentEvent(
            event_type=EventType.AGENT_STARTED,
            source_agent="Supervisor",
            payload={"action": "start"}
        )
        self.assertEqual(event.source_agent, "Supervisor")
        with self.assertRaises(Exception):
            event.source_agent = "Modified"  # Frozen model

    def test_task_queue_decoupling(self):
        state = InvestigationState()
        queue = TaskQueue(state)
        task1 = InvestigationTask(title="Decompose Goal", assigned_agent="Planner")
        task2 = InvestigationTask(title="Snapshot Context", assigned_agent="Memory")

        queue.enqueue(task1)
        queue.enqueue(task2)

        self.assertEqual(queue.size(), 2)
        popped = queue.dequeue(assigned_agent="Planner")
        self.assertIsNotNone(popped)
        self.assertEqual(popped.title, "Decompose Goal")
        self.assertEqual(queue.size(), 1)

    def test_orchestration_graph_flow(self):
        async def run_async():
            factory = AgentFactory()
            registry = AgentRegistry()

            sup = await factory.create_agent(AgentType.SUPERVISOR)
            plan = await factory.create_agent(AgentType.PLANNER)
            mem = await factory.create_agent(AgentType.MEMORY)

            registry.register_agent(sup)
            registry.register_agent(plan)
            registry.register_agent(mem)

            graph = OrchestrationGraph(registry)
            state = InvestigationState()
            ctx = AgentContext(state=state)
            queue = TaskQueue(state)

            # Enqueue task for Planner without Supervisor knowing implementation
            task = InvestigationTask(title="Decompose Investigation Goal", assigned_agent="Planner")
            queue.enqueue(task)

            result = await graph.step(ctx, queue)
            self.assertTrue(result.success)
            self.assertEqual(len(state.completed_tasks), 1)

            await registry.shutdown_all()

        asyncio.run(run_async())

    def test_agent_registry_and_factory(self):
        async def run_async():
            factory = AgentFactory()
            registry = AgentRegistry()

            sup = await factory.create_agent(AgentType.SUPERVISOR)
            plan = await factory.create_agent(AgentType.PLANNER)
            mem = await factory.create_agent(AgentType.MEMORY)

            registry.register_agent(sup)
            registry.register_agent(plan)
            registry.register_agent(mem)

            self.assertEqual(len(registry.list_agents()), 3)
            self.assertEqual(registry.get_agent("Supervisor"), sup)
            self.assertEqual(registry.get_agent("Planner"), plan)
            self.assertEqual(registry.get_agent("Memory"), mem)

            health = await registry.get_health_all()
            self.assertEqual(health["supervisor"]["status"], "ready")

            # Execution test
            ctx = AgentContext(state=InvestigationState())
            res = await sup.execute(ctx)
            self.assertTrue(res.success)
            self.assertEqual(res.agent, "Supervisor")

            # Cleanup
            await registry.shutdown_all()

        asyncio.run(run_async())

if __name__ == '__main__':
    unittest.main()
