from typing import Dict, Any, Optional
from app.tools.metadata import ToolMetadata
from app.tools.context import ToolContext
from app.tools.result import ToolResult
from app.tools.exceptions import ToolValidationError, ToolConfigurationError

class ToolValidator:
    """
    Validates tool configuration, input parameter schema, output result schema,
    and execution context permissions prior to and following execution.
    """

    @classmethod
    def validate_config(cls, metadata: ToolMetadata) -> None:
        """Validate tool metadata configuration."""
        if not metadata.name or not metadata.name.strip():
            raise ToolConfigurationError("Tool metadata must specify a valid non-empty name.")
        if not metadata.version or not metadata.version.strip():
            raise ToolConfigurationError("Tool metadata must specify a valid version string.")

    @classmethod
    def validate_input(cls, metadata: ToolMetadata, kwargs: Dict[str, Any], context: ToolContext) -> None:
        """Validate tool invocation inputs against metadata specs and context constraints."""
        if context.is_cancelled():
            raise ToolValidationError(f"Execution cancelled prior to tool '{metadata.name}' invocation.")

        # Validate required inputs specified in metadata supported_inputs
        supported = metadata.supported_inputs
        for req_param, param_spec in supported.items():
            if isinstance(param_spec, dict) and param_spec.get("required", False):
                if req_param not in kwargs:
                    raise ToolValidationError(
                        f"Missing required parameter '{req_param}' for tool '{metadata.name}'."
                    )

    @classmethod
    def validate_output(cls, metadata: ToolMetadata, result: ToolResult) -> None:
        """Validate output ToolResult structure."""
        if not isinstance(result, ToolResult):
            raise ToolValidationError(
                f"Tool '{metadata.name}' produced invalid result object type: {type(result)}."
            )
        if not result.success and not result.errors:
            result.errors.append(f"Tool '{metadata.name}' marked failed without explicit error details.")
