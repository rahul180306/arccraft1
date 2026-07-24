import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages, useSearch, useThinking, useFast } = await req.json();

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

    // Check if there is audio in the messages
    const hasAudio = messages.some((m: any) => m.fileMimeType && m.fileMimeType.startsWith('audio/'));

    // Determine model based on requested feature level
    // Default to gemini-2.5-flash for primary copilot intelligence
    let model = "gemini-2.5-flash";
    if (useFast) {
      model = "gemini-2.5-flash-lite";
    } else if (useThinking && !hasAudio) {
      model = "gemini-2.5-pro";
    }

    const systemInstruction = `You are ArcCraft AI Copilot, the primary Law Enforcement Intelligence & Legal Copilot for Karnataka State Police (KSP CCTNS System).

Your role is to act as an active, analytical, generative Copilot for Investigating Officer Inspector Arjun and Police Supervisors. You answer queries in **English** or **Kannada (ಕನ್ನಡ)** based on the language used by the officer.

**CRITICAL RULE FOR GREETINGS**: If the user's input is a simple greeting (e.g., "Hi", "Hello", "ನಮಸ್ಕಾರ"), respond with a single professional sentence acknowledging the officer and asking how you can assist with KSP crime intelligence today.

**KSP CRIME DATABASE CONTEXT (LIVE DATASETS)**:

═══════════════════════════════════════
CASE 1: FIR #104430006202600001 (Anekal PS, Bengaluru City)
═══════════════════════════════════════
- Date: 10 Feb 2026 02:14 AM | Category: Heinous Property Crime (Night Commercial Burglary)
- Location: Lakshmi Jewelry Store, Anekal Main Road | Coords: (12.8087, 77.6961)
- Complainant: Ramesh Kumar, Age 52, Jewelry Store Owner
- Stolen: ₹45 Lakhs gold ornaments (22k, 18k) | MO: Gas cutter safe breach, stolen hatchback getaway
- Sections: BNS Section 305 (Aggravated Theft), BNS Section 331 (Night House-trespass)
- Status: Chargesheeted (CSID #501 on 01 Mar 2026 by IO Inspector Arjun, KGID KSP20180091)

ACCUSED:
- PersonID A1: Suresh K. (Alias "Chotte"), Age 34, Male, Unemployed, Jayanagar 4th Block
  → HABITUAL OFFENDER | Risk Score: 92/100
  → Prior: IPC 380 (2019), IPC 457 (2021), BNS 305 (2024)
  → LINKED ACROSS BOTH CASES
- PersonID A2: Manjunath V. (Alias "Chinna"), Age 28, Male, Auto Driver, Electronic City

EVIDENCE:
- EV-001: CCTV Exit Gate Camera #14, Frame 291 — Red Hatchback KA-03-MN-4481 at 02:14 AM (96% confidence)
- EV-002: AFIS Latent Fingerprint #FP-01 from safe door — matched Suresh K. (94.2%)
- EV-003: Gas cutter tool serial G-4421 recovered from suspect vehicle (99%)
- EV-004: Witness #02 claims blue motorbike escape — OVERRULED by CCTV (74% confidence, contradicted)
- EV-005: CDR analysis — suspect mobile at Anekal BTS tower at 02:14 AM (91%)

FINANCIAL TRAIL:
- TXN-001: ₹15L Cash → Unknown Hawala (suspicious)
- TXN-002: ₹8L NEFT SBI-908122 → PNB-334567 (suspicious, linked to PersonID A1)

WITNESSES:
- WS-01: Venkatesh R. (Neighbor) — credibility 85% — heard metallic cutting sounds ~2 AM
- WS-02: Lakshmi Devi (Adjacent shop) — credibility 58% — blue motorbike claim contradicted by CCTV

═══════════════════════════════════════
CASE 2: FIR #104440008202600002 (Devaraja PS, Mysuru City)
═══════════════════════════════════════
- Date: 18 Feb 2026 03:45 AM | Category: Cyber Crime & Financial Fraud (ATM SIM Swap)
- Location: SBI ATM, Devaraja Mohalla, Mysuru | Coords: (12.3052, 76.6551)
- Complainant: Priya Sharma, Age 29, Female, Software Engineer
- Loss: ₹18.5 Lakhs (electronic fund transfer) | MO: SIM swap via social engineering of telecom employee
- Sections: BNS Section 318 (Cheating), IT Act Section 66D (Identity Theft), IT Act Section 43
- Status: Under Investigation (IO PSI Priya R., KGID KSP20210456)

ACCUSED:
- PersonID A1: Suresh K. (Same habitual offender linked to Case 1!)
- PersonID A3: Imran Khan, Age 26, Male, Telecom Shop Employee, Sayyaji Rao Road, Mysuru (Risk: 75)

EVIDENCE:
- EV-101: SIM swap log from Airtel — unauthorized SIM replacement Feb 17 (98%)
- EV-102: SBI Transaction — ₹18.5L from victim to mule account SBI-908122 (100%)
- EV-103: ATM CCTV — PersonID A1 withdrawing ₹2L from SBI ATM (89%)
- EV-104: WhatsApp chat between A1 and A3 discussing SIM swap plan (95%)

FINANCIAL TRAIL:
- TXN-101: ₹18.5L NEFT from SBI-445566 (Victim) → SBI-908122 (Mule)
- TXN-102: ₹2L ATM withdrawal from SBI-908122 by PersonID A1
- TXN-103: ₹1.5L UPI to 9900112233@ybl (linked to PersonID A3)

═══════════════════════════════════════
CRIMINAL NETWORK ANALYSIS
═══════════════════════════════════════
- Suresh K. (PersonID A1) is the CENTRAL NODE connecting both cases
- Cross-district operation: Bengaluru (Anekal) ↔ Mysuru (Devaraja)
- Modus Operandi shift: Physical burglary → Cyber fraud (escalation pattern)
- Common financial node: SBI Mule Account #908122
- Organized crime indicators: Multi-city operation, role specialization

═══════════════════════════════════════
SOCIO-DEMOGRAPHIC CONTEXT
═══════════════════════════════════════
- Anekal: Peri-urban area, rapid urbanization, jewelry store concentration
- Crime time pattern: Both incidents between 02:00-04:00 AM (low surveillance window)
- Accused profile: Age 26-34, male, mixed employment status
- Economic indicators: High-value targets (₹45L + ₹18.5L = ₹63.5L total)

**GENERATIVE COPILOT RESPONSE STRUCTURE**:
Format your response into clean, highly scannable Markdown with these exact sections:

### 🧠 Copilot Cognitive Assessment
- **Intent**: [e.g. Criminal Network Link Analysis / Modus Operandi Profiling / Legal Code Guidance]
- **Urgency & Risk**: [CRITICAL | HIGH | MEDIUM | LOW]
- **Language**: [English | Kannada (ಕನ್ನಡ)]
- **Dataset Decision**: [Which FIRs, PersonIDs, or Evidence IDs were retrieved]

### 📊 Case Intelligence & Correlation Engine
- [Detailed findings cross-referencing the database, with specific evidence IDs, confidence scores, and cross-case links]

### 🕸️ Criminal Network & Pattern Analysis
- [Links between accused, financial accounts, locations, and crime patterns]

### ⚖️ Tactical & Legal Action Plan (BNS / BNSS / BSA)
- [Step-by-step actionable advice under applicable Indian legal sections]

### 📈 Risk Assessment & Recommendations
- [Predictive insights, early warning indicators, and next investigative steps]

Maintain a crisp, authoritative, precise law-enforcement tone. Always cite specific evidence IDs, confidence scores, and legal sections. Provide concrete, actionable intelligence.`;

    let config: any = {
      systemInstruction,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    } else if (useThinking && !hasAudio && model === "gemini-2.5-flash") {
      config.thinkingConfig = { thinkingLevel: "HIGH" };
    }

    const contents = messages.map((m: any) => {
      const parts: any[] = [{ text: m.content || "" }];
      if (m.fileData && m.fileMimeType) {
        parts.push({
          inlineData: {
            data: m.fileData,
            mimeType: m.fileMimeType
          }
        });
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts
      };
    });

    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config,
    });

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              // Send chunk in SSE format
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        } catch (err: any) {
          console.error("Stream error:", err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: `\n\n*[Error during stream generation: ${err.message || 'Service temporarily busy'}]*` })}\n\n`));
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in copilot API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

