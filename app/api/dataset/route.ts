import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Force static generation: this route is pre-built at build time as a static JSON file.
// At runtime, Catalyst serves it as a plain static asset — no serverless function involved.
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const jsonPath = path.join(process.cwd(), 'ksp_dataset_extracted.json');
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const result = {
    allCases: raw.allCases ?? raw.representativeCases ?? [],
    allCrimesLite: raw.allCrimesLite ?? [],
    statusCounts: raw.statusCounts ?? {},
    crimeHeadCounts: raw.crimeHeadCounts ?? {},
    districtCounts: raw.districtCounts ?? {},
    gravityCounts: raw.gravityCounts ?? {},
    lookup: raw.lookup ?? {},
  };

  return NextResponse.json(result);
}
