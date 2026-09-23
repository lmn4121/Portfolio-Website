"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { TwinMarkdown } from "@/components/TwinMarkdown";
import {
  detectTwinMode,
  newMessageId,
  resetFastapiChat,
  resetGradioChat,
  streamFastapiChat,
  streamGradioChat,
  toGradioHistory,
  twinOrigin,
  type ChatMessage,
  type TwinMode,
} from "@/lib/twin";

const SESSION_KEY = "landon-twin-session-id";
const OPEN_EVENT = "landon-open-twin";

const STARTERS = [
  "What projects have you worked on?",
  "What skills do you bring?",
  "How can I get in touch?",
];

function readSessionId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionId(id: string) {
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    /* ignore */
  }
}

export function ChatWidget() {
  const titleId = useId();
  const origin = twinOrigin();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [waking, setWaking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const modeRef = useRef<TwinMode | null>(null);
  // Gradio twin memory is keyed on this id: one per page load (messages aren't
  // persisted either), replaced on "New chat".
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    setMounted(true);
    setSessionId(readSessionId());
  }, []);

  useEffect(() => {
    const openPanel = () => setOpen(true);
    const clearTwinHash = () => {
      if (window.location.hash !== "#twin") return;
      const url = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", url || "/");
      window.scrollTo(0, 0);
    };
    const onHash = () => {
      if (window.location.hash !== "#twin") return;
      setOpen(true);
      clearTwinHash();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.('a[href="#twin"]');
      if (!link) return;
      event.preventDefault();
      setOpen(true);
      clearTwinHash();
    };
    window.addEventListener(OPEN_EVENT, openPanel);
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    onHash();
    return () => {
      window.removeEventListener(OPEN_EVENT, openPanel);
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, open, waking]);

  const persistSession = useCallback((id: string) => {
    setSessionId(id);
    writeSessionId(id);
  }, []);

  const resolveMode = useCallback(
    async (signal: AbortSignal): Promise<TwinMode> => {
      if (modeRef.current) return modeRef.current;
      const resolved = await detectTwinMode(origin, signal);
      modeRef.current = resolved;
      return resolved;
    },
    [origin],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setError(null);
      setInput("");
      const userMsg: ChatMessage = {
        id: newMessageId(),
        role: "user",
        content: trimmed,
      };
      const assistantId = newMessageId();
      const historyForGradio = toGradioHistory(messages);

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setBusy(true);
      setThinking(true);
      setWaking(false);

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      const wakeTimer = window.setTimeout(() => {
        if (!ac.signal.aborted) setWaking(true);
      }, 2500);

      let gotToken = false;
      const applyFull = (full: string) => {
        if (!gotToken) {
          gotToken = true;
          setThinking(false);
          setWaking(false);
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: full } : m)),
        );
      };
      const applyDelta = (delta: string) => {
        if (!gotToken) {
          gotToken = true;
          setThinking(false);
          setWaking(false);
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + delta } : m,
          ),
        );
      };

      try {
        const resolved = await resolveMode(ac.signal);
        if (resolved === "fastapi") {
          await streamFastapiChat(
            origin,
            trimmed,
            sessionId,
            persistSession,
            applyDelta,
            ac.signal,
          );
        } else {
          visitorIdRef.current ||= newMessageId();
          await streamGradioChat(
            origin,
            trimmed,
            historyForGradio,
            visitorIdRef.current,
            applyFull,
            ac.signal,
          );
        }
        if (!gotToken) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: "I didn't get a response. Please try again.",
                  }
                : m,
            ),
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    m.content ||
                    "Sorry — I couldn't reach the twin right now. The Render host may be waking up; try again in a moment.",
                }
              : m,
          ),
        );
      } finally {
        window.clearTimeout(wakeTimer);
        setThinking(false);
        setWaking(false);
        setBusy(false);
      }
    },
    [busy, messages, origin, persistSession, resolveMode, sessionId],
  );

  const reset = useCallback(async () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setThinking(false);
    setWaking(false);
    setBusy(false);

    const resolved = modeRef.current;
    if (resolved === "fastapi") {
      await resetFastapiChat(origin, sessionId || readSessionId());
    } else if (visitorIdRef.current) {
      const previousId = visitorIdRef.current;
      visitorIdRef.current = newMessageId();
      await resetGradioChat(origin, previousId);
    }
  }, [origin, sessionId]);

  if (!mounted) return null;

  return (
    <div className="twin-root" data-open={open ? "true" : "false"}>
      <button
        type="button"
        className="twin-launcher"
        aria-expanded={open}
        aria-controls="twin-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="twin-launcher-dot" aria-hidden="true" />
        <span>Ask Landon’s twin</span>
      </button>

      <div
        id="twin-panel"
        className="twin-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        hidden={!open}
      >
        <header className="twin-header">
          <div>
            <p className="twin-kicker">Digital twin</p>
            <h2 id={titleId} className="twin-title">
              Chat with Landon
            </h2>
          </div>
          <div className="twin-header-actions">
            <a
              className="twin-full"
              href={origin}
              target="_blank"
              rel="noreferrer"
            >
              Full twin
            </a>
            <button
              type="button"
              className="twin-reset"
              onClick={() => void reset()}
              disabled={busy}
            >
              New chat
            </button>
            <button
              type="button"
              className="twin-reset"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </header>

        <div className="twin-body" ref={listRef}>
          {messages.length === 0 && !thinking && (
            <div className="twin-empty">
              <p>
                Ask about projects, skills, or how to get in touch. Answers are
                grounded in the resume and project knowledge base.
              </p>
              <div className="twin-starters">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="twin-starter"
                    onClick={() => void send(s)}
                    disabled={busy}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`twin-bubble twin-bubble-${m.role}`}
              data-empty={
                m.role === "assistant" && !m.content ? "true" : "false"
              }
            >
              {m.role === "assistant" && !m.content && thinking ? (
                <span className="twin-thinking">
                  {waking ? "Waking the twin" : "Thinking"}
                  <span className="twin-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
              ) : m.role === "assistant" ? (
                <TwinMarkdown text={m.content} />
              ) : (
                m.content
              )}
            </div>
          ))}
        </div>

        {error && <p className="twin-error">{error}</p>}

        <form
          className="twin-composer"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label className="visually-hidden" htmlFor="twin-input">
            Message
          </label>
          <textarea
            id="twin-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about background, skills, projects…"
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
          />
          <button
            type="submit"
            className="twin-send"
            disabled={busy || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
