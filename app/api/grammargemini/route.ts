import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();
    const { messages  } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

    const grammarPrompt = `You are a professional writing assistant.
      I will provide you with a sentence, and you will perform the following actions:

      1. Correct the original sentence for grammar and spelling.
      2. Improve the corrected sentence to be more clear and impactful.
      3. Shorten the corrected sentence while maintaining its core meaning.
      4. Rephrase the sentence in two different tones:
          - A friendly and casual tone.
          - A formal and professional tone.

      Present the output in the following XML format:

      <corrected_sentence>[Corrected sentence here]</corrected_sentence>

      <improved_sentence>[Improved sentence here]</improved_sentence>

      <shortened_sentence>[Shortened sentence here]</shortened_sentence>

      <rephrased_versions>
          <friendly_tone>[Friendly version here]</friendly_tone>
          <formal_tone>[Formal version here]</formal_tone>
      </rephrased_versions>

      The sentence to process is: `;

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