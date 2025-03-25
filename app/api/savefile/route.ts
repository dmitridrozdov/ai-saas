// /app/api/savefile/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { fileContent, fileName } = await req.json();
    const filePath = path.join(process.cwd(), '__tests__', fileName); // construct the file path.

    await fs.writeFile(filePath, fileContent, 'utf-8');

    return NextResponse.json({ message: 'File saved successfully!' });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}