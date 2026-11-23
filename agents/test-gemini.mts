import { gemini } from './gemini-client.mjs';

async function main() {
  const response = await gemini.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'Reply with exactly: Gemini connection successful'
  });

  console.log(response.text);
}

main().catch((error) => {
  console.error('Gemini test failed:', error.message);
  process.exitCode = 1;
});