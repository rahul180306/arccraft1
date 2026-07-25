import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// ── Real KSP Dataset Summary (from Police_FIR_Combined_Dataset_Final.xlsx) ────
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

CRIME HEAD BREAKDOWN:
- Special, Local & Procedural Laws: 513 (47.5%)
- Traffic & Motor Vehicle Offences: 220 (20.4%)
- Crimes Against Body (Murder/Attempt): 83 (7.7%)
- Crimes Against Women (Molestation/Dowry): 80 (7.4%)
- Crimes Against Children (POCSO): 67 (6.2%)
- Crimes Against Property (Theft/Burglary): 57 (5.3%)
- Economic Offences (Cheating/CBT): 23 (2.1%)
- Crimes Against Public Order (Rioting): 16 (1.5%)
- Special & Local Laws Offences: 11 (1.0%)
- Cyber Crimes (Fraud/Online Harassment): 9 (0.8%)

DISTRICTS COVERED: Bagalkot (999+), Dakshina Kannada (21), Tumakuru (11), Bengaluru Urban (11), Vijayapura (10), Kalaburagi (9), Shivamogga (9), Davanagere (5) and 13 others

KEY ACTS IN DATABASE: IPC (Indian Penal Code), NDPS Act, POCSO Act, IT Act (Sec 66/67), Arms Act, Motor Vehicles Act, POCA, Karnataka Excise Act, PCMA, MMDR Act

SAMPLE ACTIVE FIRs:
1. FIR 800010005202600001 — Murder (IPC 302) | Yeshwanthpur PS, Bengaluru Urban | Accused: Raju Murthy (18M), Anitha Achar (36F) | Victim: Anil Pillai (60M) | Charge Sheeted | IO: Ramesh (KGID100003)
2. FIR 800120015202500001 — Theft | KR Puram PS | Accused: Sowmya Naik (44F) | Charge Sheeted
3. FIR 100090013202600001 — POCSO Offence | Bengaluru Urban | Pending Trial
4. FIR 300100003202500001 — Cheating/Economic Offence | Davanagere | Under Investigation
5. FIR 100070019202400001 — Cyber Fraud (IT Act Sec 66) | Shivamogga | Acquitted

APPLICABLE SECTIONS ACROSS DATABASE:
IPC: 302 (Murder), 307 (Attempt), 376 (Rape), 420 (Cheating), 354 (Molestation), 406 (CBT)
POCSO: Sec 4 (Penetrative), Sec 6 (Aggravated)
IT Act: Sec 66 (Cyber offences), Sec 67 (Obscene content)
NDPS: Sec 20 (Cannabis), Sec 21 (Manufactured drugs)
Arms Act: Sec 25 | MV Act: Sec 185 | ARMS: Sec 27

POLICE STATIONS (Sample): Whitefield PS, Indiranagar PS, Jayanagar PS, Rajajinagar PS, Yeshwanthpur PS, Malleshwaram PS, Basavanagudi PS, KR Puram PS, Vijayanagar PS, Banashankari PS (510 total units)
`;

const SYSTEM_INSTRUCTION = `You are ArcCraft AI Copilot, the primary Law Enforcement Intelligence & Legal Copilot for Karnataka State Police (KSP CCTNS System).

Your role is to act as an active, analytical, generative Copilot for Investigating Officers and Police Supervisors. You answer queries in **English** or **Kannada (ಕನ್ನಡ)** based on the language used by the officer.

**CRITICAL RULE FOR GREETINGS**: If the user's input is a simple greeting (e.g., "Hi", "Hello", "ನಮಸ್ಕಾರ"), respond with a single professional sentence acknowledging the officer and asking how you can assist with KSP crime intelligence today.

${KSP_DATASET_CONTEXT}

**GENERATIVE COPILOT RESPONSE STRUCTURE**:
Format your response into clean, highly scannable Markdown with these exact sections:

### 🧠 Copilot Cognitive Assessment
- **Intent**: [e.g. Criminal Network Link Analysis / Modus Operandi Profiling / Legal Code Guidance / Case Status Query]
- **Urgency & Risk**: [CRITICAL | HIGH | MEDIUM | LOW]
- **Language**: [English | Kannada (ಕನ್ನಡ)]
- **Dataset Decision**: [Which FIRs, case IDs, or sections were referenced]

### 📊 Case Intelligence & Correlation Engine
- [Detailed findings cross-referencing the KSP database, with specific FIR numbers, crime heads, sections, and district data]

### 🕸️ Criminal Network & Pattern Analysis
- [Links between accused, locations, crime types, and patterns across the 1,079 cases]

### ⚖️ Tactical & Legal Action Plan (IPC / POCSO / IT Act / NDPS)
- [Step-by-step actionable advice under applicable Indian legal sections present in the CCTNS database]

### 📈 Risk Assessment & Recommendations
- [Predictive insights, case prioritization, and next investigative steps]

Maintain a crisp, authoritative, precise law-enforcement tone. Always cite specific FIR numbers, crime categories, applicable sections, and real data from the KSP CCTNS database. Provide concrete, actionable intelligence.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, useSearch, useThinking, useFast, useNvidia, nvidiaModel, systemPrompt: clientSystemPrompt } = await req.json();

    const combinedSystemPrompt = clientSystemPrompt 
      ? `${SYSTEM_INSTRUCTION}\n\n${clientSystemPrompt}`
      : SYSTEM_INSTRUCTION;

    // ── Route to NVIDIA if requested ──────────────────────────────────────────
    if (useNvidia && nvidiaModel) {
      const modelRoute = nvidiaModel === 'kimi' ? 'kimi' : nvidiaModel === 'minimax' ? 'minimax' : 'glm';
      const nvidiaRes = await fetch(new URL(`/api/nvidia/${modelRoute}`, req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          systemPrompt: combinedSystemPrompt,
          stream: true
        }),
      });
      return new Response(nvidiaRes.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    }

    // ── Gemini route ──────────────────────────────────────────────────────────
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
    let model = "gemini-2.5-flash";
    if (useFast) {
      model = "gemini-2.5-flash-lite";
    } else if (useThinking && !hasAudio) {
      model = "gemini-2.5-pro";
    }

    let config: any = {
      systemInstruction: combinedSystemPrompt,
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

    let responseStream;
    try {
      responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });
    } catch (genError: any) {
      console.error("Gemini API connection failed, using offline fallback:", genError);
      // Provide an offline fallback stream
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const fallbackMsg = "### ⚠️ Offline Demonstration Mode\n\n*ArcCraft AI Copilot is currently running in offline fallback mode due to network unavailability. Below is a simulated response based on the KSP CCTNS dataset.*\n\n### 🧠 Copilot Cognitive Assessment\n- **Intent**: Criminal Network Link Analysis\n- **Urgency & Risk**: HIGH\n- **Language**: English\n- **Dataset Decision**: Cross-referencing 1,079 KSP FIRs — focusing on Crimes Against Body (83 cases) and Crimes Against Property (57 cases)\n\n### 📊 Case Intelligence & Correlation Engine\n- The KSP CCTNS database contains **1,079 FIRs** across Karnataka.\n- **477 cases** are currently Pending Trial — the largest backlog category.\n- **220 cases** have resulted in Convictions — a 20.4% conviction rate.\n- Bagalkot district has the highest concentration of recorded cases.\n\n### 🕸️ Criminal Network & Pattern Analysis\n- **Crimes Against Body** (Murder/Attempt) — 83 cases — predominantly in Bengaluru Urban and Dakshina Kannada.\n- **Crimes Against Women** — 80 cases — including Molestation (IPC 354) and Dowry Death.\n- **POCSO Offences** — 67 cases — crimes against children requiring expedited investigation.\n\n### ⚖️ Tactical & Legal Action Plan\n- For Pending Trial cases: Ensure all charge sheets are filed within BNSS timelines.\n- For POCSO cases (Sec 4/6): Special child-friendly courts apply. Victim testimony via video conference.\n- For Cyber Crimes (IT Act Sec 66/67): Issue preservation notices to platform providers within 48 hours.\n\n### 📈 Risk Assessment & Recommendations\n- **CRITICAL**: 10 cases currently Under Investigation require active IO follow-up within 7 days.\n- **HIGH PRIORITY**: 38 Undetected cases warrant fresh forensic review.\n- **RECOMMENDATION**: Cross-link Crimes Against Property (57 cases) with Motor Vehicle Act violations for repeat offender profiling.";
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackMsg })}\n\n`));
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        }
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

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
  } catch (err: any) {
    console.error("Gemini Copilot API Error:", err);
    const fallbackMsg = "### ⚠️ ArcCraft Copilot Offline\n\nThe AI system encountered an error connecting to the intelligence models. Please verify your API keys or check network connectivity.\n\n" + (err.message || 'Unknown error');
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackMsg })}\n\n`));
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    });
    
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
    });
  }
}
