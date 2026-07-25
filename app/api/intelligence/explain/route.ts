import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { node } = await req.json();

    const prompt = `
    You are an expert criminal intelligence analyst for the Karnataka State Police.
    
    Analyze the following entity from the intelligence graph:
    ${JSON.stringify(node, null, 2)}
    
    Provide a concise, highly professional intelligence brief in valid JSON format.
    
    Required JSON Schema:
    {
      "summary": "2-3 sentences summarizing the entity's role in the network and any risk factors.",
      "evidenceUsed": "1 sentence identifying the key dataset artifacts (e.g. FIR, sections, arrests) that support this analysis.",
      "confidence": 85, // Number between 0 and 100 representing analytical confidence
      "recommendedAction": "1 short actionable recommendation for the investigating officer."
    }
    
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
      parsedData = { 
        summary: 'Error generating AI analysis.', 
        evidenceUsed: 'N/A', 
        confidence: 0, 
        recommendedAction: 'Retry analysis.' 
      };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("AI Explain Error:", error);
    return NextResponse.json({ 
        summary: 'Internal Server Error.', 
        evidenceUsed: 'N/A', 
        confidence: 0, 
        recommendedAction: 'Check server logs.' 
    }, { status: 500 });
  }
}
