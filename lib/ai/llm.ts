type LlmMessage = { role: "user" | "assistant" | "system"; content: string };

export type LlmProvider = "groq" | "gemini" | "anthropic" | "openai";

export type LlmResult = {
  content: string;
  provider: LlmProvider;
};

export async function callLlm(
  systemPrompt: string,
  userPrompt: string
): Promise<LlmResult | null> {
  const provider = (process.env.AI_PROVIDER ?? "auto").toLowerCase();
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if ((provider === "groq" || (provider === "auto" && groqKey)) && groqKey) {
    const content = await callGroq(groqKey, systemPrompt, userPrompt);
    return content ? { content, provider: "groq" } : null;
  }

  if (
    (provider === "gemini" || (provider === "auto" && geminiKey)) &&
    geminiKey
  ) {
    const content = await callGemini(geminiKey, systemPrompt, userPrompt);
    return content ? { content, provider: "gemini" } : null;
  }

  if (
    (provider === "anthropic" || (provider === "auto" && anthropicKey)) &&
    anthropicKey
  ) {
    const content = await callAnthropic(anthropicKey, systemPrompt, userPrompt);
    return content ? { content, provider: "anthropic" } : null;
  }

  if ((provider === "openai" || provider === "auto") && openaiKey) {
    const content = await callOpenAI(openaiKey, systemPrompt, userPrompt);
    return content ? { content, provider: "openai" } : null;
  }

  return null;
}

async function callGroq(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const messages: LlmMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) {
    console.error("[Groq] API error:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? null;
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    }),
  });

  if (!res.ok) {
    console.error("[Gemini] API error:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  if (data.error?.message) {
    console.error("[Gemini]", data.error.message);
    return null;
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

async function callAnthropic(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const block = data.content?.find((c) => c.type === "text");
  return block?.text ?? null;
}

async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const messages: LlmMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? null;
}

export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.GROQ_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.OPENAI_API_KEY
  );
}
