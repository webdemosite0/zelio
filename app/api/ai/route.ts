import OpenAI from "openai";
import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { routeSpecialist, specialistInstructions, SPECIALISTS, type SpecialistId } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY is not configured.", { status: 503 });
  }

  let body: { message?: string; specialist?: SpecialistId };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) return new Response("Message is required.", { status: 400 });
  if (message.length > 12000) return new Response("Message is too long.", { status: 413 });

  const specialist = body.specialist && body.specialist in SPECIALISTS
    ? body.specialist
    : routeSpecialist(message);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(`event: specialist\ndata: ${JSON.stringify({ id: specialist, name: SPECIALISTS[specialist] })}\n\n`));

        const response = await client.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-6-luna",
          reasoning: { effort: "low" },
          input: [
            { role: "developer", content: specialistInstructions(specialist) },
            { role: "user", content: message },
          ],
          tools: [{ type: "web_search" }],
          stream: true,
          store: true,
        });

        for await (const event of response) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(`event: delta\ndata: ${JSON.stringify({ delta: event.delta })}\n\n`));
          } else if (event.type === "response.completed") {
            controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
          } else if (event.type === "error") {
            controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "The AI request failed." })}\n\n`));
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "The AI request failed.";
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
