/**
 * Client for Landon's digital twin on Render.
 *
 * Live host (Gradio 6): POST /gradio_api/call/respond + SSE on the event_id.
 * Gradio gives every /call request a fresh session_hash, so the widget sends
 * its own visitor id as an extra input; the twin keys its memory on that id.
 * Optional FastAPI host (Project-Portfolio twin-api): POST /chat/stream SSE.
 */

export const DEFAULT_TWIN_ORIGIN = "https://digital-twin-69dv.onrender.com";

export type TwinMode = "gradio" | "fastapi";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type GradioMessage = {
  role: ChatRole;
  metadata: null;
  content: { text: string; type: "text" }[];
  options: null;
};

const THINKING_HTML = /<div class="thinking-bubble">[\s\S]*?<\/div>/gi;

export function twinOrigin(): string {
  const raw = (
    process.env.NEXT_PUBLIC_TWIN_API_URL || DEFAULT_TWIN_ORIGIN
  ).trim();
  if (!raw) return DEFAULT_TWIN_ORIGIN;
  return raw.replace(/\/$/, "");
}

export function forcedTwinMode(): TwinMode | null {
  const mode = (process.env.NEXT_PUBLIC_TWIN_API_MODE || "").trim().toLowerCase();
  if (mode === "gradio" || mode === "fastapi") return mode;
  return null;
}

export function newMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `m-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function toGradioHistory(messages: ChatMessage[]): GradioMessage[] {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role,
      metadata: null,
      content: [{ text: m.content, type: "text" as const }],
      options: null,
    }));
}

function assistantTextFromHistory(history: unknown): string {
  if (!Array.isArray(history) || history.length === 0) return "";
  const last = history[history.length - 1] as {
    role?: string;
    content?: unknown;
  };
  if (!last || last.role !== "assistant") return "";
  const content = last.content;
  let text = "";
  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    text = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text || "");
        }
        return "";
      })
      .join("");
  }
  return text.replace(THINKING_HTML, "").replace(/^\s+/, "");
}

async function parseSse(
  res: Response,
  signal: AbortSignal,
  onEvent: (event: string, data: string) => void | boolean,
): Promise<void> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response stream from the twin.");

  const decoder = new TextDecoder();
  let buffer = "";

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const lines = chunk.split("\n");
      let event = "message";
      const dataLines: string[] = [];
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
      }
      const data = dataLines.join("\n");
      if (!data || data === "null") continue;
      const stop = onEvent(event, data);
      if (stop) {
        await reader.cancel().catch(() => undefined);
        return;
      }
    }
  }
}

export async function detectTwinMode(
  origin: string,
  signal?: AbortSignal,
): Promise<TwinMode> {
  const forced = forcedTwinMode();
  if (forced) return forced;

  try {
    const res = await fetch(`${origin}/health`, {
      method: "GET",
      credentials: "omit",
      signal,
    });
    if (res.ok) {
      const body = (await res.json()) as { service?: string; status?: string };
      if (body.service === "digital-twin" || body.status === "ok") {
        return "fastapi";
      }
    }
  } catch {
    /* live Render host is Gradio; /health is 404 */
  }
  return "gradio";
}

async function postEventId(
  url: string,
  body: unknown,
  signal: AbortSignal,
): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "omit",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Twin API error (${res.status})`);
  }
  const payload = (await res.json()) as { event_id?: string };
  if (!payload.event_id) throw new Error("Twin did not return an event id.");
  return payload.event_id;
}

export async function streamGradioChat(
  origin: string,
  message: string,
  history: GradioMessage[],
  visitorId: string,
  onToken: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const eventId = await postEventId(
    `${origin}/gradio_api/call/respond`,
    { data: [message, history, visitorId] },
    signal,
  );

  const stream = await fetch(`${origin}/gradio_api/call/respond/${eventId}`, {
    method: "GET",
    credentials: "omit",
    signal,
  });
  if (!stream.ok) {
    throw new Error(`Twin stream error (${stream.status})`);
  }

  let last = "";
  await parseSse(stream, signal, (event, data) => {
    if (event === "error") {
      try {
        const parsed = JSON.parse(data) as { error?: string } | string;
        const msg =
          typeof parsed === "string"
            ? parsed
            : parsed.error || "Twin stream error";
        throw new Error(msg);
      } catch (err) {
        if (err instanceof SyntaxError) {
          throw new Error(data || "Twin stream error");
        }
        throw err;
      }
    }
    if (event !== "generating" && event !== "complete" && event !== "message") {
      return;
    }
    try {
      const parsed = JSON.parse(data) as unknown;
      const hist = Array.isArray(parsed) ? parsed[0] : parsed;
      const text = assistantTextFromHistory(hist);
      if (text && text !== last) {
        last = text;
        onToken(text);
      }
    } catch (err) {
      if (err instanceof SyntaxError) return;
      throw err;
    }
    return event === "complete";
  });
}

export async function resetGradioChat(
  origin: string,
  visitorId: string,
  signal?: AbortSignal,
): Promise<void> {
  const controller = signal ?? new AbortController().signal;
  try {
    const eventId = await postEventId(
      `${origin}/gradio_api/call/new_chat`,
      { data: [visitorId] },
      controller,
    );
    await fetch(`${origin}/gradio_api/call/new_chat/${eventId}`, {
      method: "GET",
      credentials: "omit",
      signal: controller,
    });
  } catch {
    /* local clear is enough */
  }
}

export async function streamFastapiChat(
  origin: string,
  message: string,
  sessionId: string | null,
  onSession: (id: string) => void,
  onToken: (delta: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch(`${origin}/chat/stream`, {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message, session_id: sessionId }),
    signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Twin API error (${res.status})`);
  }

  await parseSse(res, signal, (event, data) => {
    try {
      const parsed = JSON.parse(data) as {
        session_id?: string;
        delta?: string;
        error?: string;
      };
      if (event === "session" && parsed.session_id) {
        onSession(parsed.session_id);
      } else if (event === "token" && parsed.delta) {
        onToken(parsed.delta);
      } else if (event === "error") {
        throw new Error(parsed.error || "Stream error");
      }
      return event === "done";
    } catch (err) {
      if (err instanceof SyntaxError) return;
      throw err;
    }
  });
}

export async function resetFastapiChat(
  origin: string,
  sessionId: string | null,
): Promise<void> {
  if (!sessionId) return;
  try {
    await fetch(`${origin}/chat/reset`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });
  } catch {
    /* local clear is enough */
  }
}
