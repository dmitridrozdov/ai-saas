import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const prompt = `
You are an expert UI test developer using Playwright. Your task is to generate comprehensive and reliable UI tests for a React component. 

Here's the React component code:

[Insert the React component code here. The code will be provided separately.]

Based on the provided component code, generate Playwright tests that cover the following aspects:

* **Component Rendering:** Verify that the component renders correctly with its initial state and props.
* **User Interactions:** Test all interactive elements (buttons, input fields, dropdowns, checkboxes, radio buttons, etc.) to ensure they function as expected.
* **Data Fetching and Display:** If the component fetches data, test that the data is fetched correctly and displayed appropriately.
* **State Changes:** Test that the component's state changes correctly in response to user interactions.
* **Error Handling:** If the component handles errors (e.g., during data fetching), test that errors are displayed correctly.
* **Accessibility:** Include basic accessibility checks (e.g., proper labels, keyboard navigation).
* **Visual Validation (Optional):** If applicable, include visual regression tests to ensure the component's appearance remains consistent.
* **Edge Cases:** Include tests for edge cases and boundary conditions.
* **Asynchronous Operations:** Handle asynchronous operations (e.g., data fetching, animations) correctly using Playwright's 'await' and 'waitFor' methods.

**Specific Instructions:**

* Use Playwright's TypeScript syntax.
* Organize tests into logical groups using 'describe' blocks.
* Use 'test' blocks for individual test cases.
* Use 'expect' assertions to verify test results.
* Use appropriate Playwright locators (e.g., 'getByRole', 'getByTestId', 'getByText') to select elements.
* Use data-testid attributes whenever possible to make tests more robust.
* Include proper comments to explain the purpose of each test.
* Return the full Playwright test file as a string.
* Do not include any additional information outside of the code block.

**Example Test Structure:**

\`\`\`typescript
import { test, expect } from '@playwright/test';

describe('ComponentName', () => {
  test('renders correctly', async ({ page }) => {
    // ... test logic ...
    await expect(page.locator('[data-testid="some-element"]')).toBeVisible();
  });

  test('handles user input', async ({ page }) => {
    // ... test logic ...
    await page.locator('[data-testid="input-field"]').fill('test input');
    await page.locator('[data-testid="submit-button"]').click();
    await expect(page.locator('[data-testid="output-element"]')).toHaveText('test input result');
  });

  // ... more tests ...
});
\`\`\`

Generate Playwright UI tests based on the provided React component code.
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