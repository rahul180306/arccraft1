from pydantic import BaseModel, Field, field_validator
from app.domain.exceptions import InvalidCrimeNumberError

class CrimeNumber(BaseModel):
    """
    Value object representing Karnataka Police Crime Number.
    Structure: 1 digit Case Category Code + 4 digit District ID + 4 digit PS Unit ID + 4 digit Year + 5 digit Running Serial Number (18 chars total)
    Example: 104430006202600001
    """
    raw_number: str

    @field_validator("raw_number")
    @classmethod
    def validate_crime_no(cls, v: str) -> str:
        clean = v.strip()
        if not clean.isdigit() or len(clean) != 18:
            raise InvalidCrimeNumberError(
                f"Crime Number '{v}' is invalid. Must be an 18-digit numeric string formatted according to KSP specifications."
            )
        return clean

    @property
    def category_code(self) -> int:
        return int(self.raw_number[0])

    @property
    def district_id(self) -> int:
        return int(self.raw_number[1:5])

    @property
    def police_station_id(self) -> int:
        return int(self.raw_number[5:9])

    @property
    def year(self) -> int:
        return int(self.raw_number[9:13])

    @property
    def running_serial(self) -> int:
        return int(self.raw_number[13:18])

    @property
    def case_no(self) -> str:
        """Returns generated CaseNo format: YYYY + 5-digit running serial number (Last 9 digits)."""
        return self.raw_number[9:]
