import unittest
import asyncio
from typing import Optional, List, Dict, Any
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.repositories.metadata import RepositoryMetadata
from app.repositories.validator import RepositoryValidator
from app.repositories.registry import RepositoryRegistry
from app.repositories.factory import RepositoryFactory
from app.repositories.exceptions import (
    RepositoryValidationError,
    RepositoryRegistrationError,
    EntityNotFoundError
)
from app.repositories.interfaces.case_repository import ICaseRepository
from app.domain.entities.case import CaseMaster

class MockCaseRepository(ICaseRepository):
    """In-memory mock implementation of ICaseRepository for contract verification."""

    def __init__(self):
        self._store: Dict[int, CaseMaster] = {}

    async def find_by_id(self, entity_id: Any) -> Optional[CaseMaster]:
        return self._store.get(int(entity_id))

    async def find_all(self, context: Optional[RepositoryContext] = None) -> RepositoryResult[CaseMaster]:
        items = list(self._store.values())
        return RepositoryResult(success=True, items=items, total_count=len(items))

    async def save(self, entity: CaseMaster) -> CaseMaster:
        RepositoryValidator.validate_entity(entity)
        self._store[entity.case_master_id] = entity
        return entity

    async def delete(self, entity_id: Any) -> bool:
        if int(entity_id) in self._store:
            del self._store[int(entity_id)]
            return True
        return False

    async def exists(self, entity_id: Any) -> bool:
        return int(entity_id) in self._store

    async def count(self, context: Optional[RepositoryContext] = None) -> int:
        return len(self._store)

    def metadata(self) -> RepositoryMetadata:
        return RepositoryMetadata(
            name="MockCaseRepository",
            description="Mock repository for testing CaseMaster interface.",
            entity_name="CaseMaster",
            capabilities=["find_by_crime_no", "search_cases"]
        )

    async def find_by_crime_no(self, crime_no: str) -> Optional[CaseMaster]:
        for case in self._store.values():
            if case.crime_no == crime_no:
                return case
        return None

    async def find_cases_by_station(
        self,
        police_station_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        matched = [c for c in self._store.values() if c.police_station_id == police_station_id]
        return RepositoryResult(success=True, items=matched, total_count=len(matched))

    async def find_cases_by_status(
        self,
        case_status_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        matched = [c for c in self._store.values() if c.case_status_id == case_status_id]
        return RepositoryResult(success=True, items=matched, total_count=len(matched))

    async def search_cases(
        self,
        query: str,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        matched = [c for c in self._store.values() if query.lower() in c.brief_facts.lower()]
        return RepositoryResult(success=True, items=matched, total_count=len(matched))

class TestRepositoryContracts(unittest.TestCase):

    def test_repository_context_and_validation(self):
        ctx = RepositoryContext(limit=10, offset=0, filters={"status": 1})
        self.assertEqual(ctx.limit, 10)
        RepositoryValidator.validate_context(ctx)

        with self.assertRaises(RepositoryValidationError):
            RepositoryValidator.validate_context(RepositoryContext(limit=5000))

        with self.assertRaises(RepositoryValidationError):
            RepositoryValidator.validate_entity(None)

    def test_repository_registry_and_factory(self):
        registry = RepositoryRegistry()
        mock_repo = MockCaseRepository()

        registry.register("case", mock_repo)
        self.assertTrue(registry.has("case"))

        retrieved = registry.get("case")
        self.assertEqual(retrieved.metadata().name, "MockCaseRepository")

        factory = RepositoryFactory(registry)
        factory_repo = factory.get_repository("case")
        self.assertEqual(factory_repo.metadata().entity_name, "CaseMaster")

        with self.assertRaises(RepositoryRegistrationError):
            registry.get("nonexistent")

    def test_mock_case_repository_operations(self):
        async def run_async():
            repo = MockCaseRepository()
            case = CaseMaster(
                case_master_id=201,
                crime_no="104430006202600001",
                case_no="202600001",
                crime_registered_date="2026-02-10",
                police_station_id=6,
                brief_facts="Chain snatching near MG Road metro station."
            )

            # Test Save & Exists
            saved = await repo.save(case)
            self.assertEqual(saved.case_master_id, 201)
            self.assertTrue(await repo.exists(201))

            # Test Find by ID
            found = await repo.find_by_id(201)
            self.assertIsNotNone(found)
            self.assertEqual(found.case_no, "202600001")

            # Test Find by Crime No
            found_crime = await repo.find_by_crime_no("104430006202600001")
            self.assertIsNotNone(found_crime)

            # Test Search
            search_res = await repo.search_cases("chain snatching")
            self.assertEqual(len(search_res.items), 1)

            # Test Delete
            deleted = await repo.delete(201)
            self.assertTrue(deleted)
            self.assertFalse(await repo.exists(201))

        asyncio.run(run_async())

if __name__ == '__main__':
    unittest.main()
