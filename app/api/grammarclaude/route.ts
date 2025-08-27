import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { grammarPrompt } from "@/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages  } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const grammartPromptWithInput = grammarPrompt + messages[0].content;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: grammartPromptWithInput
        }
      ]
    });
    
    //DEBUG
    // console.log('stringified response:', JSON.stringify(response, null, 2));

    let textContent = "";
    if (response.content && response.content.length > 0) {
      for (const block of response.content) {
        if (block.type === "text") {
          textContent += block.text;
        }
      }
    }

    // Return just the text string
    return NextResponse.json({ response: textContent });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}