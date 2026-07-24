import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { case_no, prompt } = await req.json();

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

    const model = "gemini-2.0-flash";

    const systemInstruction = `You are ArcCraft AI Report Compiler, the official Law Enforcement Document Generation Engine for Karnataka State Police (KSP CCTNS System).

Generate a formal, highly structured Google Docs Investigation Dossier in Markdown format.

Include these exact sections:
# 🛡️ KARNATAKA STATE POLICE — OFFICIAL CASE DOSSIER
**CCTNS Crime Analytics Engine | Confidential Law Enforcement Document**

## 1. FIR Context & Administrative Metadata
- **FIR Number**: FIR 104430006202600001
- **Police Station**: Anekal Police Station, Bengaluru City
- **Registration Date**: 10 Feb 2026, 08:30 AM
- **Investigating Officer**: Inspector Arjun (KGID KSP20180091)
- **Primary Suspect**: Suresh K. (Alias "Chotte", PersonID A1 - Repeat Offender)

## 2. Executive Summary & Incident Timeline
On 10 Feb 2026 at 02:14 AM, an armed night break-in occurred at Lakshmi Jewelry Store, Anekal Main Road. Gold ornaments valued at ₹45 Lakhs were stolen using gas cutter tools.

## 3. Specialist Police Unit Findings
- **📹 Digital Evidence Unit**: CCTV Exit Gate Cam #14 Frame 291 confirmed getaway vehicle as Red Stolen Hatchback (KA-03-MN-4481) at 02:14 AM (96% Confidence).
- **🔬 Forensic Analysis Unit**: Latent AFIS Fingerprint #FP-01 matched Suresh K. (94.2% match).
- **🕸 Criminal Intelligence Unit**: Suspect PersonID A1 cross-linked to Mysuru SIM-swap fraud FIR 104440008202600002.
- **⚖️ Legal Compliance Unit**: BNS Sec 305 & 331 charges validated. BNSS Sec 35 notice required.

## 4. Auditable Decision Record #AI-30291
- **Conflict Resolution**: CCTV Video 96% confidence vs Witness Statement #02 (Blue Bike 72%).
- **Accepted Rationale**: CCTV video & ANPR registration match accepted; witness statement overruled due to low night visibility.

## 5. Next Best Investigative Actions
1. Issue Non-Bailable Arrest Warrant under BNSS Section 35.
2. Execute seizure memo under BSA for gas cutter tools and ₹45L gold.
`;

    const userPrompt = prompt || `Generate comprehensive KSP investigation report for case ${case_no || 'FIR 104430006202600001'}`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
      }
    });

    const reportText = response.text || systemInstruction;

    return NextResponse.json({
      status: "success",
      report_md: reportText
    });

  } catch (error: any) {
    console.error("Error generating Gemini report:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
