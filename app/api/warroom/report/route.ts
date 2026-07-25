import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { activeCase, prompt, chatContext, decisionRecord } = await req.json();
    console.log("Incoming activeCase:", activeCase?.crimeNo || "Undefined");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const model = "gemini-2.5-pro";

    const systemInstruction = `You are ArcCraft AI Report Compiler, the official Law Enforcement Document Generation Engine for Karnataka State Police (KSP CCTNS System).

Your job is to synthesize all active intelligence (Swarm Agent chat history, Orhcestrator Decision Records, and FIR details) into a highly structured JSON Executive Brief. Ensure no markdown formatting is included in the raw text fields unless requested. Follow the schema exactly.`;

    const userPrompt = `Generate comprehensive KSP investigation structured report for case ${activeCase?.crimeNo || 'Unknown FIR'}.
    
Context:
Prompt: ${prompt || 'Compile full dossier.'}
FIR & Investigation Data: ${JSON.stringify(activeCase || {})}
Decision Record: ${JSON.stringify(decisionRecord || {})}
Swarm Chat Logs: ${JSON.stringify((chatContext || []).map((c: any) => c.content))}
`;

    const reportSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "Section type: e.g. executive_summary, incident_reconstruction, evidence_ledger, timeline, legal_review, contradictions, recommendations, etc." },
              title: { type: Type.STRING, description: "Human readable title for the section" },
              content: { type: Type.STRING, description: "Markdown formatted rich text content for this section" },
              data: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    // Timeline fields
                    time: { type: Type.STRING },
                    event: { type: Type.STRING },
                    
                    // Evidence fields
                    id: { type: Type.STRING },
                    description: { type: Type.STRING },
                    
                    // Legal review fields
                    section: { type: Type.STRING },
                    compliance_status: { type: Type.STRING },
                    
                    // Shared fields
                    confidence: { type: Type.INTEGER },
                    type: { type: Type.STRING },
                    
                    // Cross case fields
                    related_case: { type: Type.STRING },
                    relevance: { type: Type.STRING },
                    
                    // Generic fallback string
                    value: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["type", "title"]
          }
        },
        provenance: {
          type: Type.OBJECT,
          properties: {
            generated_by: { type: Type.STRING },
            generated_at: { type: Type.STRING },
            grounded_from: { type: Type.ARRAY, items: { type: Type.STRING } },
            tokens_used: { type: Type.INTEGER },
            reasoning_confidence: { type: Type.STRING },
            sources_used: { type: Type.INTEGER }
          },
          required: ["generated_by", "generated_at", "grounded_from"]
        }
      },
      required: ["title", "sections", "provenance"]
    };

    let reportData;
    try {
      let response;
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: reportSchema,
            temperature: 0.2
          }
        });
      } catch (firstError: any) {
        if (firstError.status === 429 || String(firstError).includes('429')) {
          console.warn("Gemini 2.5 Pro quota exceeded (429). Falling back to gemini-2.5-flash...");
          response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
              systemInstruction: systemInstruction,
              responseMimeType: "application/json",
              responseSchema: reportSchema,
              temperature: 0.2
            }
          });
        } else {
          throw firstError;
        }
      }

      console.log("Gemini raw response:", response.text);

      if (response.text) {
        reportData = JSON.parse(response.text);
      } else {
        throw new Error("No response text");
      }
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      return NextResponse.json(
        { error: "Failed to generate AI dossier", details: String(apiError) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      report_data: reportData
    });

  } catch (error: any) {
    console.error("Error generating structured report:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
