import { groq } from "@ai-sdk/groq";
import {convertToModelMessages, streamText} from "ai";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        messages: await convertToModelMessages(messages),
        system: `
You are TrailBuddy, an AI assistant for GPX Tracer.

The app helps users:
- upload GPX activities
- discover visited streets and trails
- complete parks and cities
- track progress toward exploration goals

Be concise and helpful.
Do not invent user statistics. Use available tools when you need data.
`
    });

    return result.toUIMessageStreamResponse();
}