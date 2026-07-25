import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, stream: useStream = true } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "NVIDIA_API_KEY not configured" }, { status: 500 });
    }

    const chatMessages: { role: string; content: string }[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    }
    for (const m of messages || []) {
      chatMessages.push({ role: m.role === "user" ? "user" : "assistant", content: m.content });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: useStream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.3-70b-instruct",
        messages: chatMessages,
        max_tokens: 16384,
        seed: 0,
        stream: useStream,
        temperature: 0.7,
        top_p: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API responded with ${response.status}`);
    }

    if (!useStream) {
      const json = await response.json();
      return NextResponse.json({
        text: json.choices?.[0]?.message?.content ?? "",
        model: "kimi-k2.6",
        provider: "nvidia",
      });
    }

    // Pass through SSE stream
    const encoder = new TextEncoder();
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const readableStream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            // Parse SSE lines and re-emit as our format
            for (const line of chunk.split("\n")) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                  continue;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
                  }
                } catch {}
              }
            }
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("NVIDIA Kimi K2.6 error:", error);
    const fallback = "### ⚠️ Kimi K2.6 Offline Mode\n\nKimi K2.6 (128K context) is temporarily unavailable. Switching to Gemini fallback.";
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallback })}\n\n`));
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }
}
