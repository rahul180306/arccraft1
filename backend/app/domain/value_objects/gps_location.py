from pydantic import BaseModel, Field, field_validator
from app.domain.exceptions import InvalidGPSCoordinateError

class GPSLocation(BaseModel):
    """
    Value object representing incident GPS coordinates.
    """
    latitude: float
    longitude: float

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise InvalidGPSCoordinateError(f"Latitude {v} is out of bounds (-90 to +90).")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise InvalidGPSCoordinateError(f"Longitude {v} is out of bounds (-180 to +180).")
        return v
