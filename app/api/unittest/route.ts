import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const prompt = `You are an expert software developer specializing in generating unit tests for React components written in TypeScript.

I will provide you with the content of a React component file (\`page.tsx\`). Your task is to generate a comprehensive unit test file (\`page.test.tsx\`) for this component using \`@testing-library/react\` and Jest.

**Instructions:**

1.  **Analyze the Component:** Carefully examine the provided \`page.tsx\` file to understand its functionality, state management, props, API calls, and user interactions.
2.  **Generate Unit Tests:** Create a \`page.test.tsx\` file that includes unit tests covering the following aspects:
    * Rendering of initial elements.
    * State updates and changes.
    * Handling of user interactions (e.g., button clicks, input changes).
    * API call simulations (using \`jest.mock('axios')\` or similar).
    * Loading and error states.
    * Side effects (e.g., \`useEffect\` hooks).
    * Accessibility considerations.
    * Any other relevant test cases.
3.  **Use \`@testing-library/react\`:** Employ \`@testing-library/react\` for rendering components and simulating user interactions.
4.  **Use Jest:** Use Jest for writing and running the tests.
5.  **Mock Axios:** If the component makes API calls using Axios, mock the Axios module using \`jest.mock('axios')\`.
6.  **Use data-testid:** Use \`data-testid\` attributes to select elements for testing.
7.  **Clear Assertions:** Use clear and concise assertions to verify the expected behavior.
8.  **Type Safety:** Ensure that the generated tests are type-safe and compatible with TypeScript.
9.  **Do not include any explanations or other text. Only provide the content of the \`page.test.tsx\` file.**
10. **Ensure that the generated test file can be used directly without any modifications.**

**Here is the content of the \`page.tsx\` file:**

\`\`\`tsx
`;

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

    // console.log('unit tests: ', text);
  
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