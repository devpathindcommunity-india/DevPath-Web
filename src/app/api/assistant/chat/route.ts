import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are the DevPath Assistant, a helpful AI embedded in the DevPath platform. 
DevPath is an open-source platform that helps developers (especially beginners) find open-source projects, build skills, and contribute.
Your goal is to answer questions about DevPath, guide users to relevant sections (like the Roadmap, Profile, or Open Source Dashboard), and provide helpful coding or learning advice.
Keep responses concise, friendly, and tailored to junior developers and open source contributors.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[AI Chat API Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
