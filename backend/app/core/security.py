# Security-related interfaces for Phase 1.
# Prepared for JWT authentication, RBAC interfaces, Permission middleware.
# No implementation as per requirements.

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed one."""
    raise NotImplementedError("Security implementation deferred.")

def get_password_hash(password: str) -> str:
    """Generate a password hash."""
    raise NotImplementedError("Security implementation deferred.")

def create_access_token(data: dict) -> str:
    """Create a JWT access token."""
    raise NotImplementedError("Security implementation deferred.")
