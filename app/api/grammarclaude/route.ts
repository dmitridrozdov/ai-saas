// app/api/claude/route.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    
    const completion = await anthropic.completions.create({
      model: "claude-3-opus-20240229",
      prompt: `\n\nCorrect English sentence and rephrase 3 time:  ${prompt}`,
      max_tokens_to_sample: 1000,
    });
    
    return NextResponse.json({ response: completion.completion });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}