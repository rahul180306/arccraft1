import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, stream: useStream = true } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "NVIDIA_API_KEY not configured" }, { status: 500 });
    }

    const client = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey,
    });

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    }
    for (const m of messages || []) {
      chatMessages.push({ role: m.role === "user" ? "user" : "assistant", content: m.content });
    }

    if (!useStream) {
      const completion = await client.chat.completions.create({
        model: "z-ai/glm-5.2",
        messages: chatMessages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 16384,
        seed: 42,
        stream: false,
      });
      return NextResponse.json({
        text: completion.choices[0]?.message?.content ?? "",
        model: "glm-5.2",
        provider: "nvidia",
      });
    }

    // Streaming
    const completion = await client.chat.completions.create({
      model: "z-ai/glm-5.2",
      messages: chatMessages,
      temperature: 0.7,
      top_p: 1,
      max_tokens: 16384,
      seed: 42,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
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
    console.error("NVIDIA GLM-5.2 error:", error);

    // Offline fallback
    const fallback = "### ⚠️ GLM-5.2 Offline Mode\n\nNVIDIA GLM-5.2 is currently unavailable. Please check your NVIDIA API key or network connection.\n\n*Tip: Verify that `NVIDIA_API_KEY` is set in your `.env` file and that you have quota remaining.*";
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
