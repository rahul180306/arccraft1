import unittest
from app.domain.entities import CaseMaster, Victim, Accused, Employee, ArrestSurrender
from app.domain.value_objects import CrimeNumber, GPSLocation
from app.domain.enums import CaseCategoryCode, ChargesheetType
from app.domain.exceptions import InvalidCrimeNumberError, InvalidGPSCoordinateError

class TestDomainLayer(unittest.TestCase):

    def test_crime_number_value_object(self):
        # Valid 18-digit KSP crime number
        cn = CrimeNumber(raw_number="104430006202600001")
        self.assertEqual(cn.category_code, 1)
        self.assertEqual(cn.district_id, 443)
        self.assertEqual(cn.police_station_id, 6)
        self.assertEqual(cn.year, 2026)
        self.assertEqual(cn.running_serial, 1)
        self.assertEqual(cn.case_no, "202600001")

        # Invalid crime numbers
        with self.assertRaises(InvalidCrimeNumberError):
            CrimeNumber(raw_number="invalid123")

        with self.assertRaises(InvalidCrimeNumberError):
            CrimeNumber(raw_number="12345")  # Too short

    def test_gps_location_value_object(self):
        loc = GPSLocation(latitude=12.9716, longitude=77.5946)
        self.assertEqual(loc.latitude, 12.9716)

        with self.assertRaises(InvalidGPSCoordinateError):
            GPSLocation(latitude=100.0, longitude=77.5946)

    def test_case_master_entity(self):
        case = CaseMaster(
            case_master_id=101,
            crime_no="104430006202600001",
            case_no="202600001",
            crime_registered_date="2026-01-15",
            brief_facts="Burglary reported at residential building in Indiranagar."
        )
        self.assertEqual(case.entity_id(), 101)
        self.assertEqual(case.brief_facts, "Burglary reported at residential building in Indiranagar.")
        self.assertIn("case_master_id", case.to_dict())

    def test_victim_and_accused_entities(self):
        victim = Victim(victim_master_id=1, case_master_id=101, victim_name="Ramesh Kumar", age_year=45)
        accused = Accused(accused_master_id=2, case_master_id=101, accused_name="Suresh Alias Bullet", person_id="A1")

        self.assertEqual(victim.victim_name, "Ramesh Kumar")
        self.assertEqual(accused.person_id, "A1")

if __name__ == '__main__':
    unittest.main()
