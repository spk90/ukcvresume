export type AiProvider = 'openai';

interface SuggestSummaryParams {
  cv: any;
  apiKey: string;
}

interface SuggestBulletsParams {
  experience: {
    jobTitle: string;
    company?: string;
    description?: string;
    location?: string;
  };
  cv: any;
  apiKey: string;
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

async function openaiChat(apiKey: string, messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, maxTokens = 400) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.3,
      max_tokens: maxTokens,
      messages,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'AI request failed');
  }
  const json = await res.json();
  const content: string = json.choices?.[0]?.message?.content ?? '';
  return content.trim();
}

export async function suggestSummary({ cv, apiKey }: SuggestSummaryParams): Promise<string[]> {
  const user = `You are an expert CV writer for UK market. Create 2 concise professional summaries (2-3 sentences each) based strictly on the user's data. Avoid first-person. Use strong action verbs, highlight outcomes and domain strengths. Keep each option under 400 characters.

User data (JSON):\n${JSON.stringify(cv, null, 2)}`;
  const content = await openaiChat(apiKey, [
    { role: 'system', content: 'You produce ATS-friendly, quantified resume content.' },
    { role: 'user', content: user },
  ], 500);
  return content
    .split(/\n\s*\n|\n-\s|^-/gm)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function suggestBullets({ experience, cv, apiKey }: SuggestBulletsParams): Promise<string[]> {
  const user = `You are an expert CV writer for UK market. Create 6 succinct bullet points for the role below. Start each bullet with a strong action verb, avoid pronouns, include outcomes and metrics (%, £, time). Keep each bullet under 160 characters. Do not invent technologies not present in context.

Role context (JSON):\n${JSON.stringify(experience, null, 2)}\n\nUser skills/context (JSON):\n${JSON.stringify({ skills: cv?.skills, summary: cv?.professionalSummary }, null, 2)}`;
  const content = await openaiChat(apiKey, [
    { role: 'system', content: 'You write ATS-friendly, quantified resume bullets.' },
    { role: 'user', content: user },
  ], 600);
  return content
    .split(/\n+/)
    .map((s) => s.replace(/^[-•]\s*/, '').trim())
    .filter((s) => s.length > 0)
    .slice(0, 8);
}





