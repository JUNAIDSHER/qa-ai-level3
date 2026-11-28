
import { APIResponse } from '@playwright/test';

/**
 * Reads an API response as text, detects challenge pages,
 * and parses valid JSON without relying on Content-Type.
 */
export async function getApiJsonResponse(
  response: APIResponse,
  apiName: string
): Promise<any> {
  const contentType = response.headers()['content-type'] ?? '';
  const responseText = await response.text();
  const trimmedBody = responseText.trimStart();

  console.log(`\n========== ${apiName} ==========`);
  console.log('HTTP STATUS:', response.status());
  console.log('URL:', response.url());
  console.log('CONTENT-TYPE:', contentType);
  console.log('================================\n');

  const isCloudflareChallenge =
    /one moment, please|please wait while your request is being verified|cf-chl|checking your browser/i.test(
      responseText
    );

  if (isCloudflareChallenge) {
    throw new Error(
      `EXTERNAL_DEPENDENCY_FAILURE: ${apiName} received an anti-bot/challenge response instead of the expected API JSON. ` +
      `HTTP status: ${response.status()}. URL: ${response.url()}. ` +
      `Content-Type: ${contentType}.`
    );
  }

  const isHtml =
    /^<!doctype\s+html\b/i.test(trimmedBody) ||
    /^<html\b/i.test(trimmedBody) ||
    /^<(?:head|body)\b/i.test(trimmedBody);

  if (isHtml) {
    throw new Error(
      `UNEXPECTED_HTML_RESPONSE: ${apiName} received HTML instead of JSON. ` +
      `HTTP status: ${response.status()}. URL: ${response.url()}. ` +
      `Content-Type: ${contentType}.`
    );
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(
      `INVALID_API_JSON: ${apiName} returned a non-JSON response. ` +
      `HTTP status: ${response.status()}. URL: ${response.url()}. ` +
      `Content-Type: ${contentType}.`
    );
  }
}
