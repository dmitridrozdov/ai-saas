// created as example, not using it

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { textrequest, fileContent } = body;

    if (!textrequest || !fileContent) {
      return new NextResponse("Both parameters (param1 and param2) are required", {
        status: 400,
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${textrequest} Provide only the code, enclosed in triple backticks, based on the following file content: ${fileContent}. Do not include any explanatory text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const json = {
      role: "assistant",
      content: text,
    };

    return NextResponse.json(json);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}