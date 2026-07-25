import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const KSP_DATASET_CONTEXT = `
═══════════════════════════════════════════════════
KARNATAKA STATE POLICE — CCTNS LIVE CRIME DATABASE
═══════════════════════════════════════════════════
DATASET: Police_FIR_Combined_Dataset_Final.xlsx
TOTAL FIRs IN SYSTEM: 1,079

CASE STATUS BREAKDOWN:
- Pending Trial: 477 cases
- Convicted: 220 cases
- BoundOver: 103 cases
- Dis/Acq: 40 | False Case: 40 | Undetected: 38
- Abated: 25 | Compounded: 28 | Traced: 35
- Charge Sheeted: 18 | Closed: 13 | Acquitted: 17
- Under Investigation: 10 | Un Traced: 7
`;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query, graphContext } = await req.json();

    const prompt = `
    You are an AI analyst working on a police intelligence graph workspace.
    
    Database Context:
    ${KSP_DATASET_CONTEXT}
    
    Current Graph Snapshot:
    ${JSON.stringify(graphContext, null, 2)}
    
    User Query: "${query}"
    
    Your job is to interpret the user's natural language command and map it to a structured JSON action that the UI can execute.
    
    Available Actions:
    1. { "action": "filter", "target": "<entity_type>", "message": "Filtered view" } - Use when user asks to show or hide specific entity types (e.g. 'person', 'vehicle', 'location', 'evidence', 'all').
    2. { "action": "highlight", "target": "<node_id>", "message": "Highlighted node" } - Use when user wants to focus on a specific person or location. Look at the Graph Snapshot to find the correct node_id.
    3. { "action": "expand_unknown", "target": "<node_id>", "evidence": "String", "confidence": 85, "message": "Added via CDR" } - Use when user wants to expand unknown/suspected links or run CDR/tower dump analysis. Set target to the focal node ID.
    4. { "action": "none", "message": "Feedback message" } - Default if no action is needed.
    
    Output ONLY valid JSON. No markdown wrappers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    const rawText = response.text || "{}";
    const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (e) {
      parsedData = { action: 'none', message: 'Failed to parse AI response' };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("AI Query Error:", error);
    return NextResponse.json({ action: 'none', message: 'Internal server error' }, { status: 500 });
  }
}
