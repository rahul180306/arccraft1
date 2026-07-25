import { useInvestigationStore } from './investigationStore';
import { computeInvestigationMetrics, InvestigationMetrics, computeCaseRiskScore, computeInvestigationHealth, computeComplianceScore } from '@/lib/domain/crimeAnalyticsEngine';
import { KSPCase } from '@/lib/data/realCases';
import { useMemo } from 'react';

export const useDashboardMetrics = (): InvestigationMetrics => {
  const cases = useInvestigationStore(state => state.cases);
  const selectedDistrict = useInvestigationStore(state => state.selectedDistrict);

  return useMemo(() => {
    let filteredCases = cases;
    if (selectedDistrict) {
      filteredCases = cases.filter(c => c.district === selectedDistrict);
    }
    return computeInvestigationMetrics(filteredCases);
  }, [cases, selectedDistrict]);
};

export const useActiveCaseRisk = (): number => {
  const activeCase = useInvestigationStore(state => state.activeCase);
  return activeCase ? computeCaseRiskScore(activeCase) : 0;
};

export const useActiveCaseHealth = (): number => {
  const activeCase = useInvestigationStore(state => state.activeCase);
  return activeCase ? computeInvestigationHealth(activeCase) : 0;
};

export const useActiveCaseCompliance = (): number => {
  const activeCase = useInvestigationStore(state => state.activeCase);
  return activeCase ? computeComplianceScore(activeCase) : 0;
};
