import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const prompt = `
You are an expert API test developer using Axios. Your task is to generate comprehensive and reliable API tests for a set of API endpoints.

Here is the context of the API and the component that uses it:

[Insert the API context, and/or the component code that uses the API. The code will be provided separately.]

Based on the provided API context, and/or component code, generate API tests that cover the following aspects:

* **Successful Requests:**
    * Test that successful requests (e.g., HTTP 200 OK) return the expected data and status codes.
* **Error Handling:**
    * Test that the API handles errors correctly (e.g., HTTP 400 Bad Request, 404 Not Found, 500 Internal Server Error) and returns appropriate error messages and status codes.
* **Request Methods:**
    * Test different HTTP request methods (GET, POST, PUT, DELETE, etc.) to ensure they function as expected.
* **Request Headers:**
    * Test that the API handles request headers correctly (e.g., Content-Type, Authorization).
* **Request Parameters:**
    * Test that the API handles request parameters (query parameters, path parameters, request body) correctly.
* **Response Data:**
    * Test the structure and content of the API response data.
* **Authentication/Authorization:**
    * If the API requires authentication or authorization, test that it is handled correctly.
* **Edge Cases:**
    * Include tests for edge cases and boundary conditions.
* **Asynchronous Operations:**
    * Handle asynchronous operations correctly using async/await.

**Specific Instructions:**

* Use Axios for making HTTP requests.
* Use Jest or Mocha for the testing framework.
* Use TypeScript syntax.
* Organize tests into logical groups using \`describe\` blocks.
* Use \`test\` or \`it\` blocks for individual test cases.
* Use \`expect\` assertions to verify test results.
* Include proper comments to explain the purpose of each test.
* Return the full API test file as a string.
* Do not include any additional information outside of the code block.

**Example Test Structure:**

\`\`\`typescript
import axios from 'axios';
import { describe, test, expect } from '@jest/globals';

describe('API Endpoints', () => {
  test('GET /api/data returns data', async () => {
    const response = await axios.get('/api/data');
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    // ... more assertions ...
  });

  test('POST /api/process returns result', async () => {
    const response = await axios.post('/api/process', { input: 'test' });
    expect(response.status).toBe(200);
    expect(response.data.result).toBe('test result');
    // ... more assertions ...
  });

  // ... more tests ...
});
\`\`\`

Generate Axios API tests based on the provided API context.
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

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