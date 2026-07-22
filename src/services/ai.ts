"use server";

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import {AiSummaryInput} from "@/src/util/converters";

type ActivityStats = {
    parks: number;
    cities: number;
    segments: number;
};

export async function generateShortActivitySummary(
    stats: ActivityStats[],
): Promise<string> {
    const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `
You are writing a short summary for a GPX route analysis application.

The analysis has already been completed. Do not describe future activities.

You will receive JSON containing only these fields:
- parks
- cities
- segments

Instructions:
- Sentence 1: Summarize the statistics.
- Sentence 2: Encourage the user to continue exploring.
- Maximum 40 words.
- Mention only the numbers that are provided.
- Do not invent locations, terrain, landmarks, achievements, or future plans.
- Do not mention statistics that are zero unless all statistics are zero.
- Do not use Markdown.
- Keep the tone factual.

Forbidden:
- Do not exaggerate.
- Do not use words like "epic", "unforgettable", "amazing", or "hidden gems".
- Do not guess what kind of activity it was.
- Do not mention mountains, forests, roads, weather, scenery, or landmarks unless they are explicitly provided.

Statistics:
${JSON.stringify(stats)}
`,
    });

    return text;
}


export async function generateActivitySummary(
    stats: AiSummaryInput,
): Promise<string> {
    const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        temperature: 0,
        prompt: `
You are an assistant for a GPX exploration app.

Generate a factual summary of the user's activity.

The input contains pre-calculated exploration data.
You MUST use only the values provided.
Do not calculate, estimate, infer, or guess missing information.

Rules:
- totalCities is the authoritative number of cities visited.
- totalParks is the authoritative number of parks visited.
- If totalCities is 0, do not say the user explored any city.
- If totalParks is 0, do not mention any parks.
- Never infer a park or city from a street name.
- Never infer a location from names in the data.
- Do not mention places unless they appear explicitly in the input.
- If you mention city always mention at least one street
- If you mention park always mention at least one trail

Writing rules:
- Write 2-3 sentences.
- Be encouraging but factual.
- Mention exploration progress, not generic adventure.
- Do not use words like "epic", "unforgettable", "completed", or "amazing".
- Do not invent landmarks, terrain, scenery, or history.

Input:
${JSON.stringify(stats)}
`,
    });

    return text;
}