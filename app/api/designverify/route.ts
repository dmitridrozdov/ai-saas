import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const prompt = `Please analyze the design and user interface of the following React TypeScript component and provide a detailed assessment. Focus on aspects such as:

* **Visual Hierarchy and Consistency:** Evaluate the use of typography, spacing, and visual grouping. Are elements logically organized and easy to navigate? Is there a consistent design language throughout the page?
* **User Experience (UX):** Assess the usability of interactive elements (buttons, input fields, dropdowns, checkboxes, radio buttons, textarea). Is the feedback clear and intuitive? Are loading and error states handled effectively?
* **Accessibility:** Consider accessibility standards (e.g., proper labeling, keyboard navigation, color contrast).
* **Responsiveness:** Evaluate how well the design adapts to different screen sizes.
* **Code Quality (from a design perspective):** Comment on the use of Tailwind CSS classes and the overall structure of the JSX. Are there any opportunities for improvement in terms of componentization or code readability?
* **Sliding Panel Design:** Assess the visual design and user experience of the sliding panel for AI-generated unit tests. Is the feedback clear and informative?

Based on your analysis, provide a summary assessment of the design using one of the following tags: <result>Good</result>, <result>Bad</result>, or <result>Poor</result>. If the design falls between these categories, provide a more nuanced description within the <result> tag.

Here is the code of the file for your analysis:`;

export async function POST(req: Request) {
  try {
    // const { text } = await req.json();
    const filePath = path.join(
      process.cwd(),
      'app',
      '(dashboard)',
      '(routes)',
      'agents',
      'page.tsx'
    );

    // Read the current content of the page.tsx file
    const currentContent = fs.readFileSync(filePath, 'utf-8');

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

    const result = await model.generateContent(prompt + currentContent + "\`\`\`");
    const response = await result.response;
    const text = response.text();
  
    const json = {
      role: 'assistant',
      content: text,
    };

    return NextResponse.json(json);

  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}