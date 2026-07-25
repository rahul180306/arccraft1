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

    const compactChat = (chatContext || [])
      .slice(-20)
      .map((c: any) => `${c.sender_name || c.role || 'Agent'}: ${c.content}`)
      .join("\n");

    const userPrompt = `Generate comprehensive KSP investigation structured report for case ${activeCase?.crimeNo || 'Unknown FIR'}.
    
Context:
Prompt: ${prompt || 'Compile full dossier.'}
FIR & Investigation Data: ${JSON.stringify(activeCase || {})}
Decision Record: ${JSON.stringify(decisionRecord || {})}
Swarm Chat Logs:
${compactChat}
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
                    label: { type: Type.STRING },
                    value: { type: Type.STRING }
                  },
                  required: ["label", "value"]
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
    } catch (apiError: any) {
      console.error("Gemini API error, using offline fallback:", apiError);
      reportData = {
        title: "Offline Fallback Executive Brief",
        sections: [
          {
            type: "executive_summary",
            title: "Executive Summary (Offline Mode)",
            content: "ArcCraft AI Reasoning Engine is currently running in offline fallback mode because the Gemini API is unreachable (likely due to network proxy or DNS issues). This is a simulated executive brief.",
            data: []
          },
          {
            type: "timeline",
            title: "Reconstructed Timeline",
            content: "",
            data: [
              { label: "22:30", value: "Suspect entered the premises." },
              { label: "22:45", value: "CCTV connection lost." }
            ]
          },
          {
            type: "evidence_ledger",
            title: "Evidence Ledger",
            content: "",
            data: [
              { label: "Physical", value: "Fingerprints on window frame (Match Pending)" },
              { label: "Digital", value: "Cell tower ping puts suspect at scene" }
            ]
          },
          {
            type: "legal_review",
            title: "Legal Strategy & Compliance",
            content: "",
            data: [
              { label: "IPC 380 (Theft)", value: "Verified via witness statements and CCTV" },
              { label: "IPC 447 (Criminal Trespass)", value: "Needs corroboration from secondary witness" }
            ]
          },
          {
            type: "recommendations",
            title: "Tactical Recommendations",
            content: "Please check your network connectivity or API key configuration to restore full AI capabilities.",
            data: []
          }
        ],
        provenance: {
          generated_by: "ArcCraft Offline Fallback",
          generated_at: new Date().toISOString(),
          grounded_from: ["Local Dataset Cache"],
          tokens_used: 0,
          reasoning_confidence: "Simulated",
          sources_used: 1
        }
      };
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
