// app/api/ai-opinion/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      'Based on this meeting transcript, what would you say are the 2-3 most important points covered? Please provide your analysis and insights: ' + 
      messages[0].content
    );
    
    const response = await result.response;
    const text = response.text();

    const json = {
      role: 'assistant',
      content: text,
    };

    return NextResponse.json(json);
  } catch (error) {
    console.log('[AI_OPINION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}