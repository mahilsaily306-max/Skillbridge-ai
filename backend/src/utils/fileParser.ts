import * as fs from 'fs';

export async function parseFileContent(filePath: string, fileType: string): Promise<string> {
  const ext = fileType.toLowerCase();

  if (ext === 'txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === 'pdf') {
    try {
      const pdfParse = require('pdf-parse');
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    } catch (err: any) {
      console.error('PDF parsing error:', err.message);
      return `[PDF content extracted from ${filePath} - ${err.message}]`;
    }
  }

  if (ext === 'docx') {
    try {
      const mammoth = require('mammoth');
      const buffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (err: any) {
      console.error('DOCX parsing error:', err.message);
      return `[DOCX content extracted from ${filePath} - ${err.message}]`;
    }
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}
