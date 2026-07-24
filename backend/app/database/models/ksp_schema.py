from sqlalchemy import Column, Integer, String, DateTime, Date, Numeric, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.database.base import Base

class State(Base):
    __tablename__ = "state"
    StateID = Column(Integer, primary_key=True)
    StateName = Column(String(100), nullable=False)
    NationalityID = Column(Integer, default=1)
    Active = Column(Boolean, default=True)

class District(Base):
    __tablename__ = "district"
    DistrictID = Column(Integer, primary_key=True)
    DistrictName = Column(String(100), nullable=False)
    StateID = Column(Integer, ForeignKey("state.StateID"))
    Active = Column(Boolean, default=True)

class UnitType(Base):
    __tablename__ = "unit_type"
    UnitTypeID = Column(Integer, primary_key=True)
    UnitTypeName = Column(String(100), nullable=False)
    CityDistState = Column(String(100))
    Hierarchy = Column(Integer)
    Active = Column(Boolean, default=True)

class Unit(Base):
    __tablename__ = "unit"
    UnitID = Column(Integer, primary_key=True)
    UnitName = Column(String(150), nullable=False)
    TypeID = Column(Integer, ForeignKey("unit_type.UnitTypeID"))
    ParentUnit = Column(Integer, nullable=True)
    NationalityID = Column(Integer, default=1)
    StateID = Column(Integer, ForeignKey("state.StateID"))
    DistrictID = Column(Integer, ForeignKey("district.DistrictID"))
    Active = Column(Boolean, default=True)

class Rank(Base):
    __tablename__ = "rank"
    RankID = Column(Integer, primary_key=True)
    RankName = Column(String(100), nullable=False)
    Hierarchy = Column(Integer)
    Active = Column(Boolean, default=True)

class Designation(Base):
    __tablename__ = "designation"
    DesignationID = Column(Integer, primary_key=True)
    DesignationName = Column(String(100), nullable=False)
    Active = Column(Boolean, default=True)
    SortOrder = Column(Integer)

class Employee(Base):
    __tablename__ = "employee"
    EmployeeID = Column(Integer, primary_key=True)
    DistrictID = Column(Integer, ForeignKey("district.DistrictID"))
    UnitID = Column(Integer, ForeignKey("unit.UnitID"))
    RankID = Column(Integer, ForeignKey("rank.RankID"))
    DesignationID = Column(Integer, ForeignKey("designation.DesignationID"))
    KGID = Column(String(50), unique=True)
    FirstName = Column(String(100), nullable=False)
    EmployeeDOB = Column(Date)
    GenderID = Column(Integer)
    BloodGroupID = Column(Integer)
    PhysicallyChallenged = Column(Boolean, default=False)
    AppointmentDate = Column(Date)

class OccupationMaster(Base):
    __tablename__ = "occupation_master"
    OccupationID = Column(Integer, primary_key=True)
    OccupationName = Column(String(100), nullable=False)

class ReligionMaster(Base):
    __tablename__ = "religion_master"
    ReligionID = Column(Integer, primary_key=True)
    ReligionName = Column(String(100), nullable=False)

class CasteMaster(Base):
    __tablename__ = "caste_master"
    caste_master_id = Column(Integer, primary_key=True)
    caste_master_name = Column(String(100), nullable=False)

class CaseCategory(Base):
    __tablename__ = "case_category"
    CaseCategoryID = Column(Integer, primary_key=True)
    LookupValue = Column(String(50), nullable=False)

class GravityOffence(Base):
    __tablename__ = "gravity_offence"
    GravityOffenceID = Column(Integer, primary_key=True)
    LookupValue = Column(String(100), nullable=False)

class CrimeHead(Base):
    __tablename__ = "crime_head"
    CrimeHeadID = Column(Integer, primary_key=True)
    CrimeGroupName = Column(String(150), nullable=False)
    Active = Column(Boolean, default=True)

class CrimeSubHead(Base):
    __tablename__ = "crime_sub_head"
    CrimeSubHeadID = Column(Integer, primary_key=True)
    CrimeHeadID = Column(Integer, ForeignKey("crime_head.CrimeHeadID"))
    CrimeHeadName = Column(String(150), nullable=False)
    SeqID = Column(Integer)

class CaseStatusMaster(Base):
    __tablename__ = "case_status_master"
    CaseStatusID = Column(Integer, primary_key=True)
    CaseStatusName = Column(String(100), nullable=False)

class Court(Base):
    __tablename__ = "court"
    CourtID = Column(Integer, primary_key=True)
    CourtName = Column(String(150), nullable=False)
    DistrictID = Column(Integer, ForeignKey("district.DistrictID"))
    StateID = Column(Integer, ForeignKey("state.StateID"))
    Active = Column(Boolean, default=True)

class Act(Base):
    __tablename__ = "act"
    ActCode = Column(String(50), primary_key=True)
    ActDescription = Column(String(255), nullable=False)
    ShortName = Column(String(50))
    Active = Column(Boolean, default=True)

class Section(Base):
    __tablename__ = "section"
    SectionID = Column(Integer, primary_key=True, autoincrement=True)
    ActCode = Column(String(50), ForeignKey("act.ActCode"))
    SectionCode = Column(String(50), nullable=False)
    SectionDescription = Column(String(255))
    Active = Column(Boolean, default=True)

class CrimeHeadActSection(Base):
    __tablename__ = "crime_head_act_section"
    ID = Column(Integer, primary_key=True, autoincrement=True)
    CrimeHeadID = Column(Integer, ForeignKey("crime_head.CrimeHeadID"))
    ActCode = Column(String(50), ForeignKey("act.ActCode"))
    SectionCode = Column(String(50))

class CaseMaster(Base):
    __tablename__ = "case_master"
    CaseMasterID = Column(Integer, primary_key=True)
    CrimeNo = Column(String(50), nullable=False, unique=True)
    CaseNo = Column(String(50), nullable=False)
    CrimeRegisteredDate = Column(DateTime, nullable=False)
    PolicePersonID = Column(Integer, ForeignKey("employee.EmployeeID"))
    PoliceStationID = Column(Integer, ForeignKey("unit.UnitID"))
    CaseCategoryID = Column(Integer, ForeignKey("case_category.CaseCategoryID"))
    GravityOffenceID = Column(Integer, ForeignKey("gravity_offence.GravityOffenceID"))
    CrimeMajorHeadID = Column(Integer, ForeignKey("crime_head.CrimeHeadID"))
    CrimeMinorHeadID = Column(Integer, ForeignKey("crime_sub_head.CrimeSubHeadID"))
    CaseStatusID = Column(Integer, ForeignKey("case_status_master.CaseStatusID"))
    CourtID = Column(Integer, ForeignKey("court.CourtID"))
    IncidentFromDate = Column(DateTime)
    IncidentToDate = Column(DateTime)
    InfoReceivedPSDate = Column(DateTime)
    latitude = Column(Float)
    longitude = Column(Float)
    BriefFacts = Column(Text)

    # Relationships
    complainants = relationship("ComplainantDetails", back_populates="case")
    victims = relationship("Victim", back_populates="case")
    accused_list = relationship("Accused", back_populates="case")
    arrests = relationship("ArrestSurrender", back_populates="case")
    act_sections = relationship("ActSectionAssociation", back_populates="case")
    chargesheet = relationship("ChargesheetDetails", back_populates="case", uselist=False)

class ComplainantDetails(Base):
    __tablename__ = "complainant_details"
    ComplainantID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    ComplainantName = Column(String(150), nullable=False)
    AgeYear = Column(Integer)
    OccupationID = Column(Integer, ForeignKey("occupation_master.OccupationID"))
    ReligionID = Column(Integer, ForeignKey("religion_master.ReligionID"))
    CasteID = Column(Integer, ForeignKey("caste_master.caste_master_id"))
    GenderID = Column(Integer)

    case = relationship("CaseMaster", back_populates="complainants")

class Victim(Base):
    __tablename__ = "victim"
    VictimMasterID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    VictimName = Column(String(150), nullable=False)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    VictimPolice = Column(String(1), default="0")

    case = relationship("CaseMaster", back_populates="victims")

class Accused(Base):
    __tablename__ = "accused"
    AccusedMasterID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    AccusedName = Column(String(150), nullable=False)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    PersonID = Column(String(50), nullable=False)  # Repeat offender identifier A1, A2...

    case = relationship("CaseMaster", back_populates="accused_list")

class ArrestSurrender(Base):
    __tablename__ = "arrest_surrender"
    ArrestSurrenderID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    ArrestSurrenderTypeID = Column(Integer)
    ArrestSurrenderDate = Column(DateTime)
    ArrestSurrenderStateId = Column(Integer, ForeignKey("state.StateID"))
    ArrestSurrenderDistrictId = Column(Integer, ForeignKey("district.DistrictID"))
    PoliceStationID = Column(Integer, ForeignKey("unit.UnitID"))
    IOID = Column(Integer, ForeignKey("employee.EmployeeID"))
    CourtID = Column(Integer, ForeignKey("court.CourtID"))
    AccusedMasterID = Column(Integer, ForeignKey("accused.AccusedMasterID"))
    IsAccused = Column(Boolean, default=True)
    IsComplainantAccused = Column(Boolean, default=False)

    case = relationship("CaseMaster", back_populates="arrests")

class InvArrestSurrenderAccused(Base):
    __tablename__ = "inv_arrestsurrenderaccused"
    ID = Column(Integer, primary_key=True, autoincrement=True)
    ArrestSurrenderID = Column(Integer, ForeignKey("arrest_surrender.ArrestSurrenderID"))
    AccusedMasterID = Column(Integer, ForeignKey("accused.AccusedMasterID"))

class ActSectionAssociation(Base):
    __tablename__ = "act_section_association"
    ID = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    ActID = Column(String(50), ForeignKey("act.ActCode"))
    SectionID = Column(Integer, ForeignKey("section.SectionID"))
    ActOrderID = Column(Integer, default=1)
    SectionOrderID = Column(Integer, default=1)

    case = relationship("CaseMaster", back_populates="act_sections")

class ChargesheetDetails(Base):
    __tablename__ = "chargesheet_details"
    CSID = Column(Integer, primary_key=True)
    CaseMasterID = Column(Integer, ForeignKey("case_master.CaseMasterID"))
    csdate = Column(DateTime)
    cstype = Column(String(1)) # A->Chargesheet, B->False Case, C->Undetected
    PolicePersonID = Column(Integer, ForeignKey("employee.EmployeeID"))

    case = relationship("CaseMaster", back_populates="chargesheet")
