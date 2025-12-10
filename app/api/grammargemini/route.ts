import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { grammarPrompt } from "@/constants";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { messages  } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const googleApiKey = process.env.GOOGLE_API_KEY;

    // Add this check
    if (!googleApiKey) {
      console.error('[GOOGLE_API_KEY] Missing API key');
      return new NextResponse("API key not configured", { status: 500 });
    } 

    const genAI = new GoogleGenerativeAI(googleApiKey!);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite"});

    const result = await model.generateContent(grammarPrompt + messages[0].content);
    const response = await result.response;
    const text = response.text();
  
    const json = {
      role: 'assistant',
      content: text,
    };

    return NextResponse.json(json);

  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};