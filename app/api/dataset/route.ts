import { NextResponse } from 'next/server';
import rawDataset from '../../../ksp_dataset_extracted.json';

export async function GET() {
  try {
    const result = {
      allCases: rawDataset.allCases ?? (rawDataset as any).representativeCases ?? [],
      allCrimesLite: rawDataset.allCrimesLite ?? [],
      statusCounts: rawDataset.statusCounts ?? {},
      crimeHeadCounts: rawDataset.crimeHeadCounts ?? {},
      districtCounts: rawDataset.districtCounts ?? {},
      gravityCounts: rawDataset.gravityCounts ?? {},
      lookup: rawDataset.lookup ?? {},
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Dataset extraction failed:', error);
    return NextResponse.json(
      { error: 'Failed to process dataset', details: error.message },
      { status: 500 }
    );
  }
}
