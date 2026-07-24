from enum import Enum, IntEnum

class CaseCategoryCode(IntEnum):
    FIR = 1
    UDR = 3
    PAR = 4
    ZERO_FIR = 8

class ChargesheetType(str, Enum):
    CHARGESHEET = "A"
    FALSE_CASE = "B"
    UNDETECTED = "C"

class GenderCode(IntEnum):
    MALE = 1
    FEMALE = 2
    TRANSGENDER = 3

class GravityLevel(IntEnum):
    NON_HEINOUS = 1
    HEINOUS = 2
    SPECIAL_REPORT = 3

class ArrestEventType(IntEnum):
    ARREST = 1
    VOLUNTARY_SURRENDER = 2
