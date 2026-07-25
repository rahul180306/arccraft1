import zipfile, xml.etree.ElementTree as ET, json
from datetime import datetime, timedelta

ns = {'ss': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def parse(z, n, m=5000):
    xml_data = z.read(f'xl/worksheets/sheet{n}.xml')
    root = ET.fromstring(xml_data)
    rows = []
    for row in root.findall('.//ss:row', ns):
        cells = []
        for c in row.findall('ss:c', ns):
            is_t = c.find('ss:is/ss:t', ns)
            if is_t is not None: cells.append(is_t.text or ''); continue
            v = c.find('ss:v', ns)
            cells.append(v.text if v is not None else '')
        rows.append(cells)
        if len(rows) >= m: break
    return rows

def excel_date(n):
    try:
        n = float(n)
        base = datetime(1899, 12, 30)
        return (base + timedelta(days=n)).strftime('%Y-%m-%d')
    except:
        return ''

def to_list(z, sheet_num):
    rows = parse(z, sheet_num)
    if len(rows) < 2: return []
    headers = rows[1]
    return [dict(zip(headers, r)) for r in rows[2:] if r and r[0]]

with zipfile.ZipFile('Police_FIR_Combined_Dataset_Final.xlsx') as z:
    cases = to_list(z, 2)
    accused = to_list(z, 6)
    victims = to_list(z, 5)
    complainants = to_list(z, 3)
    arrests = to_list(z, 7)
    acts_sections = to_list(z, 4)
    acts = to_list(z, 8)
    sections = to_list(z, 9)
    crime_heads = to_list(z, 11)
    crime_subheads = to_list(z, 12)
    districts = to_list(z, 18)
    units = to_list(z, 20)
    employees = to_list(z, 24)
    case_status = to_list(z, 16)
    case_category = to_list(z, 25)
    gravity = to_list(z, 26)
    chargesheet = to_list(z, 27)

crime_head_map = {ch['CrimeHeadID']: ch['CrimeGroupName'] for ch in crime_heads}
crime_subhead_map = {cs['CrimeSubHeadID']: cs['CrimeHeadName'] for cs in crime_subheads}
district_map = {d['DistrictID']: d['DistrictName'] for d in districts}
unit_map = {u['UnitID']: u['UnitName'] for u in units}
status_map = {s['CaseStatusID']: s['CaseStatusName'] for s in case_status}
gravity_map = {g['GravityOffenceID']: g['LookupValue'] for g in gravity}
cat_map = {c['CaseCategoryID']: c['LookupValue'] for c in case_category}
emp_map = {e['EmployeeID']: e for e in employees}
act_map = {a['ActCode']: a['ActDescription'] for a in acts}
section_map = {(s['ActCode'], s['SectionCode']): s['SectionDescription'] for s in sections}
unit_district_map = {u['UnitID']: district_map.get(u.get('DistrictID',''), 'Unknown') for u in units}

accused_by_case = {}
for a in accused:
    accused_by_case.setdefault(a['CaseMasterID'], []).append(a)

victim_by_case = {}
for v in victims:
    victim_by_case.setdefault(v['CaseMasterID'], []).append(v)

complainant_by_case = {}
for c in complainants:
    complainant_by_case.setdefault(c['CaseMasterID'], []).append(c)

act_section_by_case = {}
for a in acts_sections:
    act_section_by_case.setdefault(a['CaseMasterID'], []).append(a)

arrest_by_case = {}
for a in arrests:
    arrest_by_case.setdefault(a['CaseMasterID'], []).append(a)

chargesheet_by_case = {}
for c in chargesheet:
    cid = c.get('CaseMasterID', '')
    chargesheet_by_case.setdefault(cid, []).append(c)

enriched = []
for c in cases:
    cid = c['CaseMasterID']
    major = crime_head_map.get(c.get('CrimeMajorHeadID', ''), 'Unknown')
    minor = crime_subhead_map.get(c.get('CrimeMinorHeadID', ''), 'Unknown')
    ps = unit_map.get(c.get('PoliceStationID', ''), 'Police Station')
    status = status_map.get(c.get('CaseStatusID', ''), 'Unknown')
    grav = gravity_map.get(c.get('GravityOffenceID', ''), 'Unknown')
    cat = cat_map.get(c.get('CaseCategoryID', ''), 'FIR')

    case_acts = act_section_by_case.get(cid, [])
    section_strs = []
    for a in case_acts:
        act_code = a.get('ActID', a.get('ActCode', ''))
        sec_code = a.get('SectionID', a.get('SectionCode', ''))
        desc = section_map.get((act_code, sec_code), sec_code)
        section_strs.append(f"{act_code} Sec {sec_code} ({desc})")

    io_id = c.get('PolicePersonID', '')
    emp = emp_map.get(io_id, {})
    io_name = emp.get('FirstName', 'Officer')
    io_kgid = emp.get('KGID', 'KSP000000')

    acc_list = [{'name': a.get('AccusedName','Unknown'), 'age': int(a.get('AgeYear',0) or 0),
                 'gender': 'Male' if a.get('GenderID','').upper()=='M' else 'Female',
                 'personId': a.get('PersonID','A1')} for a in accused_by_case.get(cid, [])]

    vic_list = [{'name': v.get('VictimName','Unknown'), 'age': int(v.get('AgeYear',0) or 0),
                 'gender': 'Male' if v.get('GenderID','').lower() in ('m','1') else 'Female'} for v in victim_by_case.get(cid, [])]

    comps = complainant_by_case.get(cid, [])
    comp_name = comps[0].get('ComplainantName', 'Unknown') if comps else 'Unknown'
    dist = unit_district_map.get(c.get('PoliceStationID',''), 'Unknown')

    arr = arrest_by_case.get(cid, [])
    arr_date = excel_date(arr[0].get('ArrestSurrenderDate','')) if arr else ''

    enriched.append({
        'caseId': cid, 'crimeNo': c.get('CrimeNo',''), 'caseNo': c.get('CaseNo',''),
        'registrationDate': excel_date(c.get('CrimeRegisteredDate','')),
        'incidentDate': excel_date(c.get('IncidentFromDate','')),
        'policeStation': ps, 'policeStationId': c.get('PoliceStationID',''),
        'district': dist, 'crimeHead': major, 'crimeSubHead': minor,
        'crimeHeadId': c.get('CrimeMajorHeadID',''), 'caseStatus': status,
        'caseStatusId': c.get('CaseStatusID',''), 'gravity': grav, 'category': cat,
        'lat': float(c.get('latitude',0) or 0), 'lng': float(c.get('longitude',0) or 0),
        'briefFacts': c.get('BriefFacts',''), 'sections': section_strs,
        'ioName': io_name, 'ioKgid': io_kgid, 'accused': acc_list, 'victims': vic_list,
        'complainant': comp_name, 'hasChargesheet': cid in chargesheet_by_case,
        'hasArrest': cid in arrest_by_case, 'arrestDate': arr_date
    })

total = len(enriched)
status_counts = {}
crime_head_counts = {}
district_counts = {}
gravity_counts = {}

for c in enriched:
    status_counts[c['caseStatus']] = status_counts.get(c['caseStatus'],0) + 1
    crime_head_counts[c['crimeHead']] = crime_head_counts.get(c['crimeHead'],0) + 1
    district_counts[c['district']] = district_counts.get(c['district'],0) + 1
    gravity_counts[c['gravity']] = gravity_counts.get(c['gravity'],0) + 1

used_heads = set()
representative = []
for head_id in ['1','2','3','4','5','6','7','8']:
    for c in enriched:
        if c['crimeHeadId'] == head_id and head_id not in used_heads and c['accused'] and c['victims']:
            representative.append(c); used_heads.add(head_id); break
extras = [c for c in enriched if c not in representative and c['accused'] and c['victims']][:17]
representative.extend(extras)
representative = representative[:25]

output = {
    'total': total, 'statusCounts': status_counts, 'crimeHeadCounts': crime_head_counts,
    'districtCounts': district_counts, 'gravityCounts': gravity_counts,
    'allCases': enriched,
    'representativeCases': representative,
    'allCrimesLite': [{'id': c['caseId'], 'crimeNo': c['crimeNo'], 'crimeHead': c['crimeHead'],
                       'crimeSubHead': c['crimeSubHead'], 'status': c['caseStatus'],
                       'lat': c['lat'], 'lng': c['lng'], 'incidentDate': c['incidentDate'],
                       'gravity': c['gravity'], 'policeStation': c['policeStation'],
                       'district': c['district'], 'hasArrest': c['hasArrest']} for c in enriched],
    'lookup': {'crimeHeads': crime_head_map, 'crimeSubHeads': crime_subhead_map,
               'districts': district_map, 'policeStations': unit_map,
               'caseStatuses': status_map, 'acts': act_map}
}

with open('ksp_dataset_extracted.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"SUCCESS: {total} cases extracted")
print(f"Status: {status_counts}")
print(f"CrimeHeads: {crime_head_counts}")
print(f"Districts: {sorted(district_counts.items(), key=lambda x:-x[1])[:8]}")
print(f"Representative cases: {len(representative)}")
