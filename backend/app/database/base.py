from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, DateTime, String, Boolean
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class UUIDMixin:
    """Mixin to add a UUID primary key to a model."""
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

class TimestampMixin:
    """Mixin to add creation and update timestamps to a model."""
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

class SoftDeleteMixin:
    """Mixin to support soft deletes."""
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class AuditMixin:
    """Mixin to support audit tracking (created by, updated by)."""
    created_by = Column(String(36), nullable=True)
    updated_by = Column(String(36), nullable=True)

class BaseModel(Base, UUIDMixin, TimestampMixin):
    """Base model incorporating UUID and Timestamps."""
    __abstract__ = True
