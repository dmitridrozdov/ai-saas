import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { grammarPrompt } from "@/constants";

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
    const genAI = new GoogleGenerativeAI(googleApiKey!);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

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