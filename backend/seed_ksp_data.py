import asyncio
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.database.models import (
    State, District, UnitType, Unit, Rank, Designation, Employee,
    OccupationMaster, ReligionMaster, CasteMaster, CaseCategory, GravityOffence,
    CrimeHead, CrimeSubHead, CaseStatusMaster, Court, Act, Section,
    CaseMaster, ComplainantDetails, Victim, Accused, ArrestSurrender,
    ActSectionAssociation, ChargesheetDetails
)

DB_URL = "sqlite:///./ksp_crime.db"

def seed_database():
    engine = create_engine(DB_URL, echo=False)
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    print("Seeding KSP State, District & Police Units...")
    # 1. State
    karnataka = State(StateID=29, StateName="Karnataka", Active=True)
    session.add(karnataka)

    # 2. Districts
    bengaluru_dist = District(DistrictID=4430, DistrictName="Bengaluru City", StateID=29, Active=True)
    mysuru_dist = District(DistrictID=4444, DistrictName="Mysuru City", StateID=29, Active=True)
    session.add_all([bengaluru_dist, mysuru_dist])

    # 3. Unit Types
    ps_type = UnitType(UnitTypeID=1, UnitTypeName="Police Station", CityDistState="District", Hierarchy=3, Active=True)
    session.add(ps_type)

    # 4. Units (Police Stations)
    anekal_ps = Unit(UnitID=6, UnitName="Anekal Police Station", TypeID=1, StateID=29, DistrictID=4430, Active=True)
    devaraja_ps = Unit(UnitID=8, UnitName="Devaraja Police Station", TypeID=1, StateID=29, DistrictID=4444, Active=True)
    session.add_all([anekal_ps, devaraja_ps])

    # 5. Ranks & Designations
    rank_inspector = Rank(RankID=10, RankName="Police Inspector", Hierarchy=4, Active=True)
    rank_psi = Rank(RankID=11, RankName="Sub-Inspector (PSI)", Hierarchy=5, Active=True)
    desig_io = Designation(DesignationID=1, DesignationName="Investigating Officer (IO)", Active=True)
    session.add_all([rank_inspector, rank_psi, desig_io])

    # 6. Employees (Police Personnel)
    io_arjun = Employee(
        EmployeeID=1001, DistrictID=4430, UnitID=6, RankID=10, DesignationID=1,
        KGID="KSP20180091", FirstName="Arjun Kumar", EmployeeDOB=datetime(1985, 4, 12).date(),
        GenderID=1, AppointmentDate=datetime(2018, 6, 1).date()
    )
    io_priya = Employee(
        EmployeeID=1002, DistrictID=4444, UnitID=8, RankID=11, DesignationID=1,
        KGID="KSP20200142", FirstName="Priya R.", EmployeeDOB=datetime(1990, 8, 22).date(),
        GenderID=2, AppointmentDate=datetime(2020, 1, 15).date()
    )
    session.add_all([io_arjun, io_priya])

    # 7. Lookups (Occupation, Religion, Caste, Category, Gravity)
    occ_business = OccupationMaster(OccupationID=1, OccupationName="Businessman")
    occ_it = OccupationMaster(OccupationID=2, OccupationName="Software Engineer")
    occ_unemployed = OccupationMaster(OccupationID=3, OccupationName="Unemployed / Criminal History")
    session.add_all([occ_business, occ_it, occ_unemployed])

    rel_hindu = ReligionMaster(ReligionID=1, ReligionName="Hindu")
    rel_muslim = ReligionMaster(ReligionID=2, ReligionName="Muslim")
    session.add_all([rel_hindu, rel_muslim])

    caste_gen = CasteMaster(caste_master_id=101, caste_master_name="General / Unreserved")
    caste_obc = CasteMaster(caste_master_id=102, caste_master_name="OBC - Category 2A")
    session.add_all([caste_gen, caste_obc])

    cat_fir = CaseCategory(CaseCategoryID=1, LookupValue="FIR")
    cat_udr = CaseCategory(CaseCategoryID=2, LookupValue="UDR")
    session.add_all([cat_fir, cat_udr])

    grav_heinous = GravityOffence(GravityOffenceID=1, LookupValue="Heinous Crime")
    grav_non_heinous = GravityOffence(GravityOffenceID=2, LookupValue="Non-Heinous Crime")
    session.add_all([grav_heinous, grav_non_heinous])

    # 8. Crime Major / Minor Heads
    ch_property = CrimeHead(CrimeHeadID=100, CrimeGroupName="Crimes Against Property", Active=True)
    ch_cyber = CrimeHead(CrimeHeadID=200, CrimeGroupName="Cyber Crime & Financial Fraud", Active=True)
    session.add_all([ch_property, ch_cyber])

    csh_burglary = CrimeSubHead(CrimeSubHeadID=1001, CrimeHeadID=100, CrimeHeadName="Night Housebreaking & Commercial Burglary", SeqID=1)
    csh_fraud = CrimeSubHead(CrimeSubHeadID=2001, CrimeHeadID=200, CrimeHeadName="Organized Bank Transaction Fraud", SeqID=1)
    session.add_all([csh_burglary, csh_fraud])

    # 9. Case Status & Courts
    cs_investigation = CaseStatusMaster(CaseStatusID=1, CaseStatusName="Under Investigation")
    cs_chargesheeted = CaseStatusMaster(CaseStatusID=2, CaseStatusName="Chargesheeted")
    session.add_all([cs_investigation, cs_chargesheeted])

    court_bengaluru = Court(CourtID=501, CourtName="1st ACMM Court Bengaluru", DistrictID=4430, StateID=29, Active=True)
    court_mysuru = Court(CourtID=502, CourtName="JMFC Court Mysuru", DistrictID=4444, StateID=29, Active=True)
    session.add_all([court_bengaluru, court_mysuru])

    # 10. Legal Acts & Sections
    act_ipc = Act(ActCode="IPC", ActDescription="Indian Penal Code 1860", ShortName="IPC", Active=True)
    act_bns = Act(ActCode="BNS", ActDescription="Bharatiya Nyaya Sanhita 2023", ShortName="BNS", Active=True)
    act_it = Act(ActCode="IT_ACT", ActDescription="Information Technology Act 2000", ShortName="IT Act", Active=True)
    session.add_all([act_ipc, act_bns, act_it])

    sec_380 = Section(SectionID=1, ActCode="IPC", SectionCode="380", SectionDescription="Theft in dwelling house", Active=True)
    sec_457 = Section(SectionID=2, ActCode="IPC", SectionCode="457", SectionDescription="Lurking house-trespass by night", Active=True)
    sec_305 = Section(SectionID=3, ActCode="BNS", SectionCode="305", SectionDescription="Snatching / Aggravated Theft", Active=True)
    sec_66d = Section(SectionID=4, ActCode="IT_ACT", SectionCode="66D", SectionDescription="Cheating by personation using computer resource", Active=True)
    session.add_all([sec_380, sec_457, sec_305, sec_66d])

    session.commit()

    print("Seeding Case Master Datasets...")
    # --- DATASET 1: Commercial Burglary in Anekal, Bengaluru ---
    case1 = CaseMaster(
        CaseMasterID=100001,
        CrimeNo="104430006202600001",
        CaseNo="202600001",
        CrimeRegisteredDate=datetime(2026, 2, 10, 8, 30),
        PolicePersonID=1001, # Inspector Arjun
        PoliceStationID=6,   # Anekal PS
        CaseCategoryID=1,    # FIR
        GravityOffenceID=1, # Heinous Crime
        CrimeMajorHeadID=100,# Property
        CrimeMinorHeadID=1001, # Burglary
        CaseStatusID=2,      # Chargesheeted
        CourtID=501,         # 1st ACMM Bengaluru
        IncidentFromDate=datetime(2026, 2, 9, 23, 15),
        IncidentToDate=datetime(2026, 2, 10, 2, 45),
        InfoReceivedPSDate=datetime(2026, 2, 10, 7, 0),
        latitude=12.8087,
        longitude=77.6961,
        BriefFacts="Night break-in at Lakshmi Jewelry Store on Anekal Main Road. Safes breached using gas cutters. Gold worth ₹45 Lakhs stolen. CCTV footage shows two suspects fleeing in a red stolen hatchback."
    )

    # --- DATASET 2: Cyber Financial Fraud in Devaraja, Mysuru ---
    case2 = CaseMaster(
        CaseMasterID=100002,
        CrimeNo="104440008202600002",
        CaseNo="202600002",
        CrimeRegisteredDate=datetime(2026, 2, 18, 11, 0),
        PolicePersonID=1002, # PSI Priya
        PoliceStationID=8,   # Devaraja PS
        CaseCategoryID=1,    # FIR
        GravityOffenceID=1, # Heinous Crime
        CrimeMajorHeadID=200,# Cyber & Financial
        CrimeMinorHeadID=2001, # Bank Fraud
        CaseStatusID=1,      # Under Investigation
        CourtID=502,         # JMFC Mysuru
        IncidentFromDate=datetime(2026, 2, 17, 14, 0),
        IncidentToDate=datetime(2026, 2, 17, 18, 30),
        InfoReceivedPSDate=datetime(2026, 2, 18, 10, 0),
        latitude=12.3052,
        longitude=76.6551,
        BriefFacts="Phishing and fraudulent ATM SIM-swap transactions routing ₹18.5 Lakhs from victims' State Bank accounts into mule accounts linked to organized robbery networks."
    )
    session.add_all([case1, case2])
    session.commit()

    # Complainants
    comp1 = ComplainantDetails(ComplainantID=1, CaseMasterID=100001, ComplainantName="Ramesh Kumar", AgeYear=45, OccupationID=1, ReligionID=1, CasteID=101, GenderID=1)
    comp2 = ComplainantDetails(ComplainantID=2, CaseMasterID=100002, ComplainantName="Priya Sharma", AgeYear=29, OccupationID=2, ReligionID=1, CasteID=101, GenderID=2)
    session.add_all([comp1, comp2])

    # Victims
    vic1 = Victim(VictimMasterID=1, CaseMasterID=100001, VictimName="Ramesh Kumar (Lakshmi Store)", AgeYear=45, GenderID=1, VictimPolice="0")
    vic2 = Victim(VictimMasterID=2, CaseMasterID=100002, VictimName="Priya Sharma", AgeYear=29, GenderID=2, VictimPolice="0")
    session.add_all([vic1, vic2])

    # Accused (CROSS-LINKED REPEAT OFFENDER: Suresh K. / PersonID A1)
    acc1 = Accused(AccusedMasterID=1, CaseMasterID=100001, AccusedName="Suresh K. (Alias Chotte)", AgeYear=34, GenderID=1, PersonID="A1")
    acc2 = Accused(AccusedMasterID=2, CaseMasterID=100001, AccusedName="Manjunath V. (Alias Chinna)", AgeYear=31, GenderID=1, PersonID="A2")
    acc3 = Accused(AccusedMasterID=3, CaseMasterID=100002, AccusedName="Suresh K. (Alias Chotte)", AgeYear=34, GenderID=1, PersonID="A1") # Same PersonID A1!
    acc4 = Accused(AccusedMasterID=4, CaseMasterID=100002, AccusedName="Imran Khan", AgeYear=28, GenderID=1, PersonID="A3")
    session.add_all([acc1, acc2, acc3, acc4])

    # Arrests
    arr1 = ArrestSurrender(
        ArrestSurrenderID=1, CaseMasterID=100001, ArrestSurrenderTypeID=1,
        ArrestSurrenderDate=datetime(2026, 2, 15), ArrestSurrenderStateId=29,
        ArrestSurrenderDistrictId=4430, PoliceStationID=6, IOID=1001, CourtID=501,
        AccusedMasterID=1, IsAccused=True, IsComplainantAccused=False
    )
    arr2 = ArrestSurrender(
        ArrestSurrenderID=2, CaseMasterID=100002, ArrestSurrenderTypeID=2,
        ArrestSurrenderDate=datetime(2026, 2, 20), ArrestSurrenderStateId=29,
        ArrestSurrenderDistrictId=4444, PoliceStationID=8, IOID=1002, CourtID=502,
        AccusedMasterID=3, IsAccused=True, IsComplainantAccused=False
    )
    session.add_all([arr1, arr2])

    # Act Section Associations
    asa1 = ActSectionAssociation(CaseMasterID=100001, ActID="IPC", SectionID=1) # IPC 380
    asa2 = ActSectionAssociation(CaseMasterID=100001, ActID="IPC", SectionID=2) # IPC 457
    asa3 = ActSectionAssociation(CaseMasterID=100001, ActID="BNS", SectionID=3) # BNS 305
    asa4 = ActSectionAssociation(CaseMasterID=100002, ActID="IT_ACT", SectionID=4) # IT Act 66D
    session.add_all([asa1, asa2, asa3, asa4])

    # Chargesheet Details
    cs1 = ChargesheetDetails(CSID=501, CaseMasterID=100001, csdate=datetime(2026, 3, 1), cstype="A", PolicePersonID=1001)
    session.add(cs1)

    session.commit()
    session.close()
    print("✅ KSP Database successfully seeded with 2 complete FIR datasets!")

if __name__ == "__main__":
    seed_database()
