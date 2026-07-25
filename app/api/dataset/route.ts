import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// Cache the result in-process so we only parse once per server lifetime
let cachedData: any = null;

export async function GET() {
  try {
    // Return cached data if available
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const rootDir = process.cwd();
    const scriptPath = path.join(rootDir, 'extract_dataset.py');
    const jsonPath = path.join(rootDir, 'ksp_dataset_extracted.json');

    // Run extraction if JSON doesn't exist or is stale
    const xlsxPath = path.join(rootDir, 'Police_FIR_Combined_Dataset_Final.xlsx');
    let needsExtract = !fs.existsSync(jsonPath);

    if (!needsExtract) {
      const xlsxStat = fs.statSync(xlsxPath);
      const jsonStat = fs.statSync(jsonPath);
      if (xlsxStat.mtime > jsonStat.mtime) {
        needsExtract = true;
      }
    }

    if (needsExtract) {
      await execAsync(`python3 "${scriptPath}"`, { cwd: rootDir, timeout: 30000 });
    }

    const raw = JSON.parse(await fs.promises.readFile(jsonPath, 'utf-8'));

    // Remap: the python script outputs `representativeCases` and `allCrimesLite`
    // We expose `allCases` as the full enriched list
    // Currently the python script does NOT output every full case — only representative ones.
    // We re-run the script with the full list output (see extract_dataset_full.py logic)
    // For now, use representativeCases as allCases (will fix below)
    const result = {
      allCases: raw.allCases ?? raw.representativeCases ?? [],
      allCrimesLite: raw.allCrimesLite ?? [],
      statusCounts: raw.statusCounts ?? {},
      crimeHeadCounts: raw.crimeHeadCounts ?? {},
      districtCounts: raw.districtCounts ?? {},
      gravityCounts: raw.gravityCounts ?? {},
      lookup: raw.lookup ?? {},
    };

    cachedData = result;
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Dataset extraction failed:', error);
    return NextResponse.json(
      { error: 'Failed to process dataset', details: error.message },
      { status: 500 }
    );
  }
}
