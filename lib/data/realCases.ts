/**
 * ArcCraft KSP Crime Database — Type Definitions & Lookup Maps
 * Data is now loaded dynamically from Police_FIR_Combined_Dataset_Final.xlsx
 * via GET /api/dataset → Zustand store (fetchDataset action)
 * DO NOT add hardcoded data arrays here.
 */

// ── Types ────────────────────────────────────────────────────────────────

export interface KSPCase {
  caseId: string;
  crimeNo: string;
  caseNo: string;
  registrationDate: string;
  incidentDate: string;
  policeStation: string;
  policeStationId: string;
  district: string;
  crimeHead: string;
  crimeSubHead: string;
  crimeHeadId: string;
  caseStatus: string;
  caseStatusId: string;
  gravity: string;
  category: string;
  lat: number;
  lng: number;
  briefFacts: string;
  sections: string[];
  ioName: string;
  ioKgid: string;
  accused: { name: string; age: number; gender: string; personId: string }[];
  victims: { name: string; age: number; gender: string }[];
  complainant: string;
  hasChargesheet: boolean;
  hasArrest: boolean;
  arrestDate: string;
}

export interface CaseLite {
  id: string;
  crimeNo: string;
  crimeHead: string;
  crimeSubHead: string;
  status: string;
  lat: number;
  lng: number;
  incidentDate: string;
  gravity: string;
  policeStation: string;
  district: string;
  hasArrest: boolean;
}

// ── Lookup Maps (static enumerations from CCTNS schema) ──────────────────

export const CRIME_HEAD_MAP: Record<string, string> = {
  "1": "Crimes Against Body",
  "2": "Crimes Against Property",
  "3": "Crimes Against Women",
  "4": "Crimes Against Children",
  "5": "Economic Offences",
  "6": "Cyber Crimes",
  "7": "Crimes Against Public Order",
  "8": "Special & Local Laws Offences",
  "9": "Special, Local & Procedural Laws",
  "10": "Traffic & Motor Vehicle Offences"
};

export const CRIME_SUB_HEAD_MAP: Record<string, string> = {
  "1": "Murder", "2": "Attempt to Murder", "3": "Theft", "4": "Burglary",
  "5": "Molestation", "6": "Dowry Death", "7": "Kidnapping of Minor",
  "8": "POCSO Offence", "9": "Cheating", "10": "Criminal Breach of Trust",
  "11": "Cyber Fraud", "12": "Online Harassment", "13": "Rioting",
  "14": "Unlawful Assembly", "15": "NDPS Offence", "16": "Excise Offence",
  "17": "Animal", "18": "Arson", "19": "Attempting To Commit Offences",
  "20": "Cases Of Hurt", "21": "Children Act", "22": "Communal / Religion",
  "23": "Consumer", "24": "Crimes Related To Women", "25": "Criminal Conspiracy",
  "26": "Criminal Intimidation", "27": "Criminal Trespass", "28": "Cruelty By Husband",
  "29": "Crpc", "30": "Dacoity", "31": "Deaths Due To Rashness/Negligence",
  "32": "Election", "33": "Explosives", "34": "Exposure And Abandonment Of Child",
  "35": "Forgery", "36": "Insulting Modesty Of Women (Eve Teasing)",
  "37": "Karnataka Police Act 1963", "38": "Kidnapping And Abduction",
  "39": "Karnataka State Local Act", "40": "Mischief", "41": "Missing Person",
  "42": "Motor Vehicle Accidents Fatal", "43": "Motor Vehicle Accidents Non-Fatal",
  "44": "Narcotic Drugs & Pshycotropic Substances", "45": "Negligent Act",
  "46": "Offences Against Public Servants (Public Servant Is A Victim)",
  "47": "Prevention Of Damage To Public Property Act 1984",
  "48": "Public Safety", "49": "Representation Of People Act 1951 & 1988",
  "50": "Riots", "51": "Robbery",
  "52": "Scheduled Caste And The Scheduled Tribes",
  "53": "Suicide", "511": "Rape", "512": "Simple Hurt", "513": "Grievous Hurt"
};

export const DISTRICT_MAP: Record<string, string> = {
  "1": "Bengaluru Urban", "2": "Bengaluru Rural", "3": "Mysuru",
  "4": "Dakshina Kannada", "5": "Belagavi", "6": "Hubballi-Dharwad",
  "7": "Kalaburagi", "8": "Ballari", "9": "Tumakuru", "10": "Shivamogga",
  "11": "Davanagere", "12": "Vijayapura", "13": "Raichur", "14": "Udupi",
  "21": "Bagalkot"
};

export const CASE_STATUS_MAP: Record<string, string> = {
  "1": "Under Investigation", "2": "Charge Sheeted", "3": "Closed",
  "4": "Pending Trial", "5": "Convicted", "6": "Acquitted",
  "7": "Abated", "8": "BoundOver", "9": "Compounded", "10": "Dis/Acq",
  "11": "False Case", "12": "Other Disposal", "13": "Traced",
  "14": "Un Traced", "15": "Undetected"
};

export const ACTS_MAP: Record<string, string> = {
  "IPC": "Indian Penal Code, 1860",
  "NDPS": "Narcotic Drugs and Psychotropic Substances Act, 1985",
  "POCSO": "Protection of Children from Sexual Offences Act, 2012",
  "ITACT": "Information Technology Act, 2000",
  "ARMS": "The Arms Act, 1959",
  "MVACT": "Motor Vehicles Act, 1988",
  "POCA": "Prevention of Corruption Act, 1988",
  "KEA": "Karnataka Excise Act, 1965",
  "KPA": "Karnataka Police Act, 1963",
  "MMDR": "Mines and Minerals (Regulation & Development) Act, 1957",
  "CRPC": "Code of Criminal Procedure, 1973",
  "PCMA": "Prohibition of Child Marriage Act, 2006",
  "DPA": "Dowry Prohibition Act, 1961",
  "SCST": "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act"
};
