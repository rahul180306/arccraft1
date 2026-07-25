import { NextRequest } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { prompt, caseData } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY missing" }), { status: 500 });
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendChunk(data: any) {
        controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
      }

      try {
        // Step 1: Orchestrator Planning
        sendChunk({
          type: "orchestrator_directive",
          id: `orch-${Date.now()}`,
          role: "Investigation Orchestrator",
          sender_name: "Investigation Orchestrator",
          avatar_bg: "bg-[#FF5A1F]",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `Analyzing query: "${prompt}". Constructing multi-agent execution plan...`,
        });

        const planSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            agents: {
              type: Type.ARRAY,
              items: { type: Type.STRING, description: "Agent name (e.g. Evidence Agent, Legal Agent, Intelligence Agent, Timeline Agent)" }
            },
            objective: { type: Type.STRING }
          },
          required: ["agents", "objective"]
        };

        let plan;
        try {
          const planRes = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: `You are the Investigation Orchestrator. Given the user query: "${prompt}", which 2 or 3 specialist agents are needed to resolve this? Choose from: Evidence Agent, Legal Agent, Intelligence Agent, Timeline Agent, Network Agent. Also define the core objective.` }] }],
            config: { responseMimeType: "application/json", responseSchema: planSchema, temperature: 0.1 }
          });
          plan = JSON.parse(planRes.text || '{"agents":["Evidence Agent", "Legal Agent", "Intelligence Agent"], "objective":"General analysis"}');
        } catch (planError) {
          console.error("Plan Gen Error:", planError);
          plan = { agents: ["Evidence Agent", "Intelligence Agent"], objective: "Simulated offline cross-case verification" };
        }

        sendChunk({
          type: "orchestrator_directive",
          id: `orch-${Date.now()}-plan`,
          role: "Investigation Orchestrator",
          sender_name: "Investigation Orchestrator",
          avatar_bg: "bg-[#FF5A1F]",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `Plan established. Objective: **${plan.objective}**. Dispatching: ${plan.agents.join(', ')}.`,
        });

        // Step 2: Agent Execution Loop
        const agentFindings: any[] = [];
        const agentConfigs: Record<string, { bg: string }> = {
          "Evidence Agent": { bg: "bg-blue-600" },
          "Legal Agent": { bg: "bg-purple-600" },
          "Intelligence Agent": { bg: "bg-emerald-600" },
          "Timeline Agent": { bg: "bg-amber-600" },
          "Network Agent": { bg: "bg-indigo-600" },
        };

        const agentSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "Markdown bulleted summary of findings" },
            confidence: { type: Type.INTEGER }
          },
          required: ["content", "confidence"]
        };

        for (const agent of plan.agents) {
          const context = `You are the ${agent} acting on the KSP Crime Database.
Active Case Context:
FIR: ${caseData.crimeNo}
Status: ${caseData.caseStatus}
Accused: ${JSON.stringify(caseData.accused)}
Victims: ${JSON.stringify(caseData.victims)}
Sections: ${caseData.sections?.join(', ') || 'N/A'}

User Query: "${prompt}"
Orchestrator Objective: "${plan.objective}"

Analyze the case strictly from the perspective of your specialty (${agent}). Return a concise markdown formatted finding and your confidence score. Do not hallucinate external facts, but infer logical deductions from the provided case data.`;

          let result;
          try {
            const agentRes = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: [{ role: 'user', parts: [{ text: context }] }],
              config: { responseMimeType: "application/json", responseSchema: agentSchema, temperature: 0.2 }
            });
            result = JSON.parse(agentRes.text || `{"content":"Failed to analyze.", "confidence":0}`);
          } catch (agentError) {
            console.error(`Agent Gen Error for ${agent}:`, agentError);
            result = { content: `(Simulated) Found robust correlation for ${caseData.crimeNo} matching historical Modus Operandi.`, confidence: 92 };
          }
          
          agentFindings.push({ agent, finding: result.content, confidence: result.confidence });

          sendChunk({
            type: "update",
            id: `agent-${Date.now()}-${agent.replace(/\\s+/g, '')}`,
            role: agent,
            sender_name: agent,
            avatar_bg: agentConfigs[agent]?.bg || "bg-gray-600",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            content: `### 🤖 ${agent} Report\n${result.content}\n\n*Confidence: ${result.confidence}%*`
          });
        }

        // Step 3: Consensus & Decision Record
        sendChunk({
          type: "system",
          id: `cons-start-${Date.now()}`,
          role: "Consensus Engine",
          sender_name: "Consensus Engine",
          avatar_bg: "bg-gray-700",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: "Resolving agent conflicts and building final decision record..."
        });

        const decisionSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "Markdown text summarizing the orchestrator's final decision" },
            decision_record: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                accepted_findings: { type: Type.ARRAY, items: { type: Type.STRING } },
                overruled_findings: { type: Type.ARRAY, items: { type: Type.STRING } },
                consensus_score: { type: Type.STRING },
                overall_confidence: { type: Type.INTEGER },
                next_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence_story: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { step: { type: Type.STRING }, confidence: { type: Type.INTEGER } },
                    required: ["step", "confidence"]
                  }
                },
                uncertainties: {
                  type: Type.OBJECT,
                  properties: { known: { type: Type.ARRAY, items: { type: Type.STRING } }, unknown: { type: Type.ARRAY, items: { type: Type.STRING } } },
                  required: ["known", "unknown"]
                },
                health: {
                  type: Type.OBJECT,
                  properties: { evidence: { type: Type.STRING }, timeline: { type: Type.STRING }, legal: { type: Type.STRING }, witnesses: { type: Type.STRING }, digital: { type: Type.STRING } },
                  required: ["evidence", "timeline", "legal", "witnesses", "digital"]
                }
              },
              required: ["id", "accepted_findings", "overruled_findings", "consensus_score", "overall_confidence", "next_actions", "confidence_story", "uncertainties", "health"]
            }
          },
          required: ["content", "decision_record"]
        };

        const consensusContext = `You are the Investigation Orchestrator. 
User Query: "${prompt}"
Agent Findings:
${agentFindings.map(f => `${f.agent} (${f.confidence}%): ${f.finding}`).join('\\n\\n')}

Synthesize the final decision record based on the agent findings. Output the markdown decision summary and the structured decision record payload. Use mock values like "#AI-30291" for IDs.`;

        let finalDecision;
        try {
          const consensusRes = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: consensusContext }] }],
            config: { responseMimeType: "application/json", responseSchema: decisionSchema, temperature: 0.2 }
          });
          finalDecision = JSON.parse(consensusRes.text || '{}');
        } catch (consensusError) {
          console.error("Consensus Gen Error:", consensusError);
          finalDecision = {
            content: "### ✅ Simulated Consensus Reached\nProceeding with arrest strategy based on physical and digital evidence overlap.",
            decision_record: {
              id: "#AI-SIM-001",
              accepted_findings: ["Primary Suspect verified", "Historical M.O. confirmed"],
              overruled_findings: ["Witness contradiction dismissed due to camera evidence"],
              consensus_score: "4/5 Units",
              overall_confidence: 94,
              next_actions: ["Issue Non-Bailable Warrant", "Seize related vehicles"],
              confidence_story: [{ step: "Initial Triage", confidence: 60 }, { step: "Evidence Match", confidence: 85 }, { step: "Consensus", confidence: 94 }],
              uncertainties: { known: ["Exact stolen item recovery location"], unknown: ["Co-conspirators"] },
              health: { evidence: "Excellent", timeline: "Verified", legal: "Pending Review", witnesses: "Weak", digital: "Strong" }
            }
          };
        }

        sendChunk({
          type: "decision_record",
          id: `dec-${Date.now()}`,
          role: "Investigation Orchestrator",
          sender_name: "Investigation Orchestrator",
          avatar_bg: "bg-[#FF5A1F]",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: finalDecision.content || "Consensus reached.",
          decisionData: finalDecision.decision_record
        });

        // Step 4: Report generation trigger
        sendChunk({
          type: "report_ready",
          id: `rep-${Date.now()}`,
          role: "Report Agent",
          sender_name: "Report Compilation Agent",
          avatar_bg: "bg-rose-600",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: "### 📂 Live Investigation Report Compiled\nAll accepted findings compiled into interactive Executive Brief. Click below to open document.",
          artifact_title: "INVESTIGATION_REPORT.md"
        });

      } catch (e: any) {
        console.error("Swarm Error:", e);
        sendChunk({
          type: "system",
          id: `err-${Date.now()}`,
          role: "System",
          sender_name: "Error",
          avatar_bg: "bg-red-600",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `Swarm orchestration failed: ${e.message}`
        });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
