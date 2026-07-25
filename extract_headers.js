const xlsx = require('xlsx');
const path = require('path');

const filePath = '/Users/rahulkarthikt/Documents/arccraft/Police_FIR_Combined_Dataset_Final.xlsx';
const wb = xlsx.readFile(filePath);
console.log("SHEETS:", wb.SheetNames);
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
console.log("ROW 0:", data[0]);
console.log("ROW 1:", data[1]);
console.log("ROW 2:", data[2]);
console.log("ROW 3:", data[3]);
console.log("ROW 4:", data[4]);
