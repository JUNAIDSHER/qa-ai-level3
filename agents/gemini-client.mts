import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing from .env file');
}

// Initialize Gemini AI
export const gemini = new GoogleGenAI({
  apiKey,
  httpOptions: { timeout: 30000 }
});
