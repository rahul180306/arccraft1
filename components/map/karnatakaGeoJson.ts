import { FeatureCollection } from 'geojson';

// Accurate simplified GeoJSON FeatureCollection for Karnataka State Districts
export const KARNATAKA_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'bengaluru_urban',
        name: 'Bengaluru Urban',
        code: 'BLRU',
        riskScore: 96,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.45, 13.12],
            [77.78, 13.15],
            [77.82, 12.85],
            [77.65, 12.72],
            [77.38, 12.82],
            [77.45, 13.12]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'bengaluru_rural',
        name: 'Bengaluru Rural',
        code: 'BLRR',
        riskScore: 71,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.20, 13.40],
            [77.85, 13.48],
            [77.92, 13.15],
            [77.45, 13.12],
            [77.20, 13.40]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mysuru',
        name: 'Mysuru',
        code: 'MYS',
        riskScore: 87,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.12, 12.55],
            [77.10, 12.45],
            [77.12, 12.05],
            [76.35, 11.95],
            [75.95, 12.25],
            [76.12, 12.55]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'belagavi',
        name: 'Belagavi',
        code: 'BGM',
        riskScore: 84,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.05, 16.58],
            [75.25, 16.62],
            [75.18, 15.45],
            [74.35, 15.35],
            [74.05, 15.80],
            [74.05, 16.58]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'kalaburagi',
        name: 'Kalaburagi',
        code: 'KLB',
        riskScore: 78,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.40, 17.75],
            [77.45, 17.65],
            [77.38, 16.90],
            [76.50, 16.95],
            [76.40, 17.75]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'dakshina_kannada',
        name: 'Dakshina Kannada',
        code: 'DKN',
        riskScore: 89,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.65, 13.20],
            [75.58, 13.15],
            [75.62, 12.45],
            [74.85, 12.60],
            [74.65, 13.20]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'dharwad',
        name: 'Dharwad',
        code: 'DWD',
        riskScore: 81,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.85, 15.65],
            [75.42, 15.60],
            [75.38, 15.15],
            [74.80, 15.20],
            [74.85, 15.65]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'shivamogga',
        name: 'Shivamogga',
        code: 'SMG',
        riskScore: 65,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.90, 14.35],
            [75.95, 14.28],
            [75.90, 13.65],
            [75.05, 13.52],
            [74.90, 14.35]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'tumakuru',
        name: 'Tumakuru',
        code: 'TMK',
        riskScore: 82,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.45, 14.15],
            [77.40, 14.05],
            [77.35, 12.85],
            [76.60, 12.95],
            [76.45, 14.15]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ballari',
        name: 'Ballari',
        code: 'BLR',
        riskScore: 83,
        crimeDensity: 'High'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.38, 15.82],
            [77.35, 15.75],
            [77.25, 14.75],
            [76.45, 14.85],
            [76.38, 15.82]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'vijayapura',
        name: 'Vijayapura',
        code: 'VJP',
        riskScore: 68,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.25, 17.48],
            [76.42, 17.35],
            [76.25, 16.32],
            [75.20, 16.40],
            [75.25, 17.48]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'bidar',
        name: 'Bidar',
        code: 'BDR',
        riskScore: 62,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.85, 18.45],
            [77.68, 18.25],
            [77.62, 17.60],
            [76.80, 17.70],
            [76.85, 18.45]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'uttara_kannada',
        name: 'Uttara Kannada',
        code: 'UKN',
        riskScore: 48,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.05, 15.35],
            [74.80, 15.20],
            [74.88, 13.92],
            [74.12, 13.95],
            [74.05, 15.35]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'udupi',
        name: 'Udupi',
        code: 'UDP',
        riskScore: 58,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.55, 13.90],
            [75.18, 13.82],
            [75.12, 13.15],
            [74.65, 13.20],
            [74.55, 13.90]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'kolar',
        name: 'Kolar',
        code: 'KLR',
        riskScore: 69,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.85, 13.48],
            [78.58, 13.42],
            [78.52, 12.80],
            [77.82, 12.85],
            [77.85, 13.48]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'chikkaballapura',
        name: 'Chikkaballapura',
        code: 'CBP',
        riskScore: 59,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.40, 14.05],
            [78.20, 13.95],
            [78.18, 13.40],
            [77.42, 13.45],
            [77.40, 14.05]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'kodagu',
        name: 'Kodagu',
        code: 'KDG',
        riskScore: 42,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.40, 12.62],
            [76.05, 12.58],
            [76.02, 11.92],
            [75.35, 12.02],
            [75.40, 12.62]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'chamarajanagara',
        name: 'Chamarajanagara',
        code: 'CMR',
        riskScore: 47,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.60, 12.20],
            [77.48, 12.10],
            [77.42, 11.60],
            [76.55, 11.65],
            [76.60, 12.20]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'mandya',
        name: 'Mandya',
        code: 'MND',
        riskScore: 60,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.35, 12.85],
            [77.22, 12.80],
            [77.15, 12.22],
            [76.32, 12.28],
            [76.35, 12.85]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'ramanagara',
        name: 'Ramanagara',
        code: 'RMG',
        riskScore: 66,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.02, 12.98],
            [77.55, 12.92],
            [77.48, 12.35],
            [77.00, 12.40],
            [77.02, 12.98]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'hassan',
        name: 'Hassan',
        code: 'HSN',
        riskScore: 63,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.55, 13.32],
            [76.42, 13.25],
            [76.35, 12.52],
            [75.50, 12.60],
            [75.55, 13.32]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'chikkamagaluru',
        name: 'Chikkamagaluru',
        code: 'CKM',
        riskScore: 49,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.05, 13.82],
            [76.15, 13.75],
            [76.10, 13.08],
            [75.00, 13.15],
            [75.05, 13.82]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'chitradurga',
        name: 'Chitradurga',
        code: 'CTA',
        riskScore: 64,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.82, 14.72],
            [76.88, 14.65],
            [76.82, 13.82],
            [75.78, 13.88],
            [75.82, 14.72]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'davanagere',
        name: 'Davanagere',
        code: 'DVG',
        riskScore: 61,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.48, 14.88],
            [76.22, 14.82],
            [76.18, 14.12],
            [75.42, 14.18],
            [75.48, 14.88]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'haveri',
        name: 'Haveri',
        code: 'HVR',
        riskScore: 56,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.02, 15.18],
            [75.82, 15.12],
            [75.78, 14.45],
            [74.98, 14.52],
            [75.02, 15.18]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'koppal',
        name: 'Koppal',
        code: 'KPL',
        riskScore: 59,
        crimeDensity: 'Medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.72, 15.82],
            [76.45, 15.75],
            [76.40, 15.02],
            [75.68, 15.08],
            [75.72, 15.82]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'gadag',
        name: 'Gadag',
        code: 'GDG',
        riskScore: 44,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.32, 15.88],
            [75.98, 15.82],
            [75.92, 15.08],
            [75.28, 15.15],
            [75.32, 15.88]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'bagalkote',
        name: 'Bagalkote',
        code: 'BGK',
        riskScore: 52,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.12, 16.52],
            [76.22, 16.45],
            [76.18, 15.82],
            [75.08, 15.88],
            [75.12, 16.52]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 'yadgir',
        name: 'Yadgir',
        code: 'YDG',
        riskScore: 45,
        crimeDensity: 'Low'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.50, 16.95],
            [77.42, 16.85],
            [77.35, 16.32],
            [76.42, 16.40],
            [76.50, 16.95]
          ]
        ]
      }
    }
  ]
};
