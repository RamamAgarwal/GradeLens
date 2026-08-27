// Thin wrapper around the Gemini "generateContent" REST endpoint.
// Uses the free-tier-eligible Flash model by default; override with GEMINI_MODEL
// if Google renames/retires it after this was written (check ai.google.dev for
// the current free-tier model name).

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface ImagePart {
  mimeType: string;
  base64: string;
}

interface GeminiCallOptions {
  systemInstruction: string;
  prompt: string;
  images?: ImagePart[];
  temperature?: number;
  maxOutputTokens?: number;
}

export class GeminiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

/**
 * Calls Gemini with an optional set of images plus a text prompt, and asks
 * for a JSON-only response. Returns the parsed JSON value (typed by caller).
 */
export async function callGeminiJSON<T>(opts: GeminiCallOptions): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError(
      'GEMINI_API_KEY is not set on the server. Add it to your environment (see .env.example).'
    );
  }

  const parts: Record<string, unknown>[] = [];
  for (const img of opts.images ?? []) {
    parts.push({ inline_data: { mime_type: img.mimeType, data: img.base64 } });
  }
  parts.push({ text: opts.prompt });

  const body = {
    system_instruction: { parts: [{ text: opts.systemInstruction }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: opts.temperature ?? 0.1,
      maxOutputTokens: opts.maxOutputTokens ?? 8192,
      responseMimeType: 'application/json'
    }
  };

  const res = await fetch(`${API_BASE}/${DEFAULT_MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new GeminiError(`Gemini request failed (${res.status}): ${errText.slice(0, 500)}`, res.status);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';

  if (!text) {
    const finishReason = json?.candidates?.[0]?.finishReason;
    throw new GeminiError(`Gemini returned no content (finishReason: ${finishReason ?? 'unknown'})`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // Some responses can wrap JSON in fences despite responseMimeType; strip and retry.
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch (e) {
      throw new GeminiError(`Could not parse Gemini JSON output: ${(e as Error).message}. Raw: ${text.slice(0, 300)}`);
    }
  }
}
