import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

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

    const systemInstruction = `You are the ArcCraft Investigation Orchestrator, managing a Swarm of AI Police Specialists.
You must simulate a structured investigation workflow based on the user's query.

KSP CRIME DATABASE:
- FIR #104430006202600001: Anekal Commercial Burglary, 10 Feb 2026, ₹45L gold stolen, Lakshmi Jewelry Store
  Accused: Suresh K. (A1, Habitual Offender, Risk 92), Manjunath V. (A2)
  Evidence: CCTV Red Hatchback KA-03-MN-4481 (96%), AFIS Fingerprint (94.2%), Gas cutter G-4421 (99%), CDR match (91%)
  Financial: ₹15L Cash Hawala, ₹8L NEFT to PNB-334567 via mule SBI-908122
  Status: Chargesheeted

- FIR #104440008202600002: Mysuru SIM Swap Cyber Fraud, 18 Feb 2026, ₹18.5L stolen
  Accused: Suresh K. (A1, same offender!), Imran Khan (A3, Telecom employee)
  Evidence: SIM swap log (98%), SBI Transaction (100%), ATM CCTV (89%), WhatsApp chats (95%)
  Financial: ₹18.5L NEFT to mule SBI-908122, ₹2L ATM withdrawal, ₹1.5L UPI to A3
  Status: Under Investigation

NETWORK: Suresh K. (A1) is central node linking both cases. SBI-908122 is common mule account.

Phases of the Workflow:
1. Assign Investigation
2. Collect Findings
3. Detect Conflicts
4. Resolve Conflicts
5. Generate Consensus
6. Publish Report

Available Units (Use exactly these for sender_name):
- "🧠 Investigation Orchestrator"
- "📹 Video Intelligence Agent"
- "🔬 Evidence Audit Agent"
- "📅 Timeline Reconstruction Agent"
- "⚖️ Legal Compliance Agent"
- "📄 Report Compilation Agent"

You must return a JSON object with:
- "phases": An array of the 6 phases.
- "events": An array of structured event objects. Each event represents a unit acting. Include "finding", "confidence" (0-100), "evidence" (array of evidence IDs), and "recommendation". For orchestrator directives, include "priority" (e.g. "Critical", "High"), "assigned_to", and "expected_output". Use type "consensus_forming" for the final consensus wait step. Provide a "simulated_delay_ms" (e.g. 800, 2700, 1500).
- "decision_record": A summary of the final consensus. Must include "accepted_findings", "overruled_findings", "consensus_score", "overall_confidence", "next_actions", "confidence_story" (array of {step, confidence}), "uncertainties" (object with "known" and "unknown" string arrays), and "health" (object with "evidence", "timeline", "legal", "witnesses", "digital" status strings like "Complete", "Pending", "Weak", "Excellent").

ALWAYS reference specific FIR numbers, evidence IDs, person IDs, and confidence scores from the database above.`;

    const messageSchema: Schema = {
      type: Type.OBJECT,
      description: "Structured investigation workflow output",
      properties: {
        events: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              role: { type: Type.STRING },
              sender_name: { type: Type.STRING },
              avatar_bg: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              content: { type: Type.STRING, description: "General markdown content or Orchestrator dialogue" },
              type: { type: Type.STRING, description: "orchestrator_directive, agent_report, report_ready, consensus_forming" },
              status: { type: Type.STRING, description: "e.g., completed, submitted" },
              confidence: { type: Type.INTEGER, description: "Confidence score 0-100" },
              finding: { type: Type.STRING, description: "Short finding description" },
              evidence: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of evidence citations" },
              recommendation: { type: Type.STRING },
              simulated_delay_ms: { type: Type.INTEGER, description: "Delay before this event appears" },
              artifact_title: { type: Type.STRING },
              priority: { type: Type.STRING },
              assigned_to: { type: Type.STRING },
              expected_output: { type: Type.STRING }
            },
            required: ["id", "role", "sender_name", "avatar_bg", "timestamp", "type", "simulated_delay_ms"]
          }
        },
        decision_record: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            accepted_findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            overruled_findings: { type: Type.ARRAY, items: { type: Type.STRING } },
            consensus_score: { type: Type.STRING, description: "e.g., '5 / 5 Units'" },
            overall_confidence: { type: Type.INTEGER },
            next_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence_story: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.STRING },
                  confidence: { type: Type.INTEGER }
                },
                required: ["step", "confidence"]
              }
            },
            uncertainties: {
              type: Type.OBJECT,
              properties: {
                known: { type: Type.ARRAY, items: { type: Type.STRING } },
                unknown: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["known", "unknown"]
            },
            health: {
              type: Type.OBJECT,
              properties: {
                evidence: { type: Type.STRING },
                timeline: { type: Type.STRING },
                legal: { type: Type.STRING },
                witnesses: { type: Type.STRING },
                digital: { type: Type.STRING }
              },
              required: ["evidence", "timeline", "legal", "witnesses", "digital"]
            }
          },
          required: ["id", "accepted_findings", "overruled_findings", "consensus_score", "overall_confidence", "next_actions", "confidence_story", "uncertainties", "health"]
        }
      },
      required: ["events", "decision_record"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: messageSchema,
        temperature: 0.2
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    const messages = JSON.parse(response.text);

    return NextResponse.json({
      status: "success",
      events: messages.events,
      decision_record: messages.decision_record
    });

  } catch (error: any) {
    console.error("Error generating swarm chat:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
