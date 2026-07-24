# ArcCraft Agent Lifecycle Specification

## Overview
Every agent in ArcCraft follows a strict deterministic lifecycle managed by `AgentLifecycle`.

## State Diagram
```
Created -> Initialized -> Ready -> Running -> Completed -> Shutdown
                                 |         -> Failed
                                 |         -> Cancelled
                                 |         -> TimedOut
```

## Lifecycle States
1. **CREATED**: Agent instantiated via `AgentFactory`.
2. **INITIALIZED**: Configs and dependencies loaded (`initialize()`).
3. **READY**: Ready to accept execution requests.
4. **RUNNING**: Currently executing workload (`execute()`).
5. **COMPLETED**: Task execution succeeded.
6. **FAILED**: Exception or validation failure encountered.
7. **CANCELLED**: Cancellation token triggered.
8. **TIMED_OUT**: Execution deadline exceeded.
9. **SHUTDOWN**: Resources released (`shutdown()`).
