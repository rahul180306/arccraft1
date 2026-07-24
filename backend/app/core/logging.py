import logging
import sys
from app.core.config import settings

def setup_logging():
    """
    Configure enterprise logging.
    Supports API Requests, Agent Calls, Execution Time, Errors, Warnings.
    """
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

logger = logging.getLogger("ArcCraft")
