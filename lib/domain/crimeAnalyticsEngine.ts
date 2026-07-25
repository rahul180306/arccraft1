import { KSPCase } from '@/lib/data/realCases';

export interface InvestigationMetrics {
  totalFIRs: number;
  underInvestigation: number;
  pendingTrial: number;
  convicted: number;
  chargesheeted: number;
  acquitted: number;
  closed: number;
  heinousCases: number;
  nonHeinousCases: number;
  pettyCases: number;
  crimeAgainstBody: number;
  crimeAgainstProperty: number;
  crimeAgainstWomen: number;
  crimeAgainstChildren: number;
  cyberCrimes: number;
  economicOffences: number;
  trafficOffences: number;
  specialLocalLaws: number;
  topDistrict: string;
  topDistrictCount: number;
}

export function computeInvestigationMetrics(cases: KSPCase[]): InvestigationMetrics {
  const metrics: InvestigationMetrics = {
    totalFIRs: cases.length,
    underInvestigation: 0,
    pendingTrial: 0,
    convicted: 0,
    chargesheeted: 0,
    acquitted: 0,
    closed: 0,
    heinousCases: 0,
    nonHeinousCases: 0,
    pettyCases: 0,
    crimeAgainstBody: 0,
    crimeAgainstProperty: 0,
    crimeAgainstWomen: 0,
    crimeAgainstChildren: 0,
    cyberCrimes: 0,
    economicOffences: 0,
    trafficOffences: 0,
    specialLocalLaws: 0,
    topDistrict: 'Unknown',
    topDistrictCount: 0
  };

  const districtCounts: Record<string, number> = {};

  cases.forEach((c) => {
    // Status
    if (c.caseStatus === 'Under Investigation') metrics.underInvestigation++;
    else if (c.caseStatus === 'Pending Trial') metrics.pendingTrial++;
    else if (c.caseStatus === 'Convicted') metrics.convicted++;
    else if (c.caseStatus === 'Charge Sheeted' || c.caseStatus === 'Chargesheeted') metrics.chargesheeted++;
    else if (c.caseStatus === 'Acquitted') metrics.acquitted++;
    else if (c.caseStatus === 'Closed') metrics.closed++;

    // Gravity
    if (c.gravity === 'Heinous') metrics.heinousCases++;
    else if (c.gravity === 'Non-Heinous' || c.gravity === 'Non Heinous') metrics.nonHeinousCases++;
    else if (c.gravity === 'Petty') metrics.pettyCases++;

    // Crime Heads
    if (c.crimeHead === 'Crimes Against Body') metrics.crimeAgainstBody++;
    else if (c.crimeHead === 'Crimes Against Property') metrics.crimeAgainstProperty++;
    else if (c.crimeHead === 'Crimes Against Women') metrics.crimeAgainstWomen++;
    else if (c.crimeHead === 'Crimes Against Children') metrics.crimeAgainstChildren++;
    else if (c.crimeHead === 'Cyber Crimes') metrics.cyberCrimes++;
    else if (c.crimeHead === 'Economic Offences') metrics.economicOffences++;
    else if (c.crimeHead === 'Traffic & Motor Vehicle Offences') metrics.trafficOffences++;
    else if (
      c.crimeHead === 'Special & Local Laws Offences' || 
      c.crimeHead === 'Special, Local & Procedural Laws'
    ) {
      metrics.specialLocalLaws++;
    }

    // District
    districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
  });

  // Calculate top district
  let maxCount = 0;
  let topDist = 'Unknown';
  for (const [dist, count] of Object.entries(districtCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topDist = dist;
    }
  }

  metrics.topDistrict = topDist;
  metrics.topDistrictCount = maxCount;

  return metrics;
}

export function computeCaseRiskScore(kspCase: KSPCase): number {
  let score = 0;
  if (kspCase.gravity === 'Heinous') score += 50;
  else if (kspCase.gravity === 'Non-Heinous') score += 20;

  if (kspCase.caseStatus === 'Under Investigation') score += 30;
  if (kspCase.hasArrest) score -= 10;
  
  return Math.min(Math.max(score, 0), 100);
}

export function computeOfficerWorkload(cases: KSPCase[], ioName: string): number {
  return cases.filter(c => c.ioName === ioName && c.caseStatus === 'Under Investigation').length;
}

export function computeInvestigationHealth(kspCase: KSPCase): number {
  let health = 100;
  if (kspCase.gravity === 'Heinous' && !kspCase.hasArrest) health -= 40;
  if (kspCase.caseStatus === 'Pending Trial' && !kspCase.hasChargesheet) health -= 30;
  return Math.max(health, 0);
}

export function computeComplianceScore(kspCase: KSPCase): number {
  let score = 100;
  if (kspCase.sections.length === 0) score -= 20; // Missing legal sections
  if (kspCase.victims.length === 0 && kspCase.crimeHead === 'Crimes Against Body') score -= 30;
  if (kspCase.accused.length === 0 && (kspCase.hasArrest || kspCase.hasChargesheet)) score -= 50;
  return Math.max(score, 0);
}
