
// created as example, not using it



import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const filePath = path.join(
      process.cwd(),
      'app',
      '(dashboard)',
      '(routes)',
      'agents',
      'page.tsx'
    );

    // const newContent = `'use client';\n\nimport { Button } from '@/components/ui/button';\nimport React, { useState } from 'react';\nimport DialogComponent from './DialogComponent';\n\nconst page = () => {\n  const [dialogOpen, setDialogOpen] = useState(false);\n\n  const handleSubmitText = (text: string) => {\n    console.log('Submitted Text:', text);\n    // Handle submitted text here (e.g., send to API)\n  };\n\n  return (\n    <div>\n      <Button onClick={() => setDialogOpen(true)}>${text}</Button>\n      <DialogComponent open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmitText} />\n    </div>\n  );\n};\n\nexport default page;`;

    // Read the current content of the page.tsx file
    const currentContent = fs.readFileSync(filePath, 'utf-8');

    console.log(currentContent)

    console.log(text)

    const newContent = await modifyFile(text, currentContent);

    console.log(newContent)

    fs.writeFileSync(filePath, newContent);
    return NextResponse.json({ message: 'File updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

interface ApiResponse {
    content: string;
  }
  
  async function modifyFile(value1: any, value2: any): Promise<string> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        '/api/modify',
        {
            textrequest: value1,
            fileContent: value2,
        }
      );
      console.log('API Response:', response.data.content);
      return response.data.content;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }