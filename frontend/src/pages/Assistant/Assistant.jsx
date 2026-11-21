import { useEffect, useRef, useState } from "react";
import { sendMessage } from "./assistantApi";
import "./Assistant.css";

const GREETING = {
  id: "greeting",
  role: "assistant",
  text: "Hi, ask me about feeding, training, grooming, or settling in your indie dog.",
  sources: [],
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

/* ---------- Page ---------- */
export default function Assistant() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const conversationId = useRef(null);
  const abortRef = useRef(null);
  const endRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  // Cancel any request still running when the page closes.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(text) {
    const controller = new AbortController();
    abortRef.current = controller;
    setSending(true);
    try {
      const reply = await sendMessage({
        message: text,
        conversationId: conversationId.current,
        signal: controller.signal,
      });
      conversationId.current = reply.conversationId;
      setMessages((m) => [
        ...m,
        { id: newId(), role: "assistant", text: reply.answer, sources: reply.sources },
      ]);
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages((m) => [
        ...m,
        {
          id: newId(),
          role: "assistant",
          text: err.message || "Something went wrong. Please try again.",
          sources: [],
          error: true,
          retryText: text,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function submit() {
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { id: newId(), role: "user", text }]);
    setInput("");
    ask(text);
  }

  function retry(msg) {
    setMessages((m) => m.filter((x) => x.id !== msg.id));
    ask(msg.retryText);
  }

  function onKeyDown(e) {
    // Enter sends; Shift+Enter adds a new line.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  function onChange(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  }

  return (
    <div className="pfa-chat">
      <header className="pfa-head">
        <h1>Pet-care assistant</h1>
        <p>Answers based on People For Animals care guides.</p>
      </header>

      <div className="pfa-thread" role="log" aria-live="polite">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} onRetry={retry} />
        ))}
        {sending && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      <div className="pfa-composer">
        <div className="pfa-box">
          <textarea
            rows={1}
            value={input}
            maxLength={1000}
            placeholder="Ask a pet-care question…"
            aria-label="Your question"
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className="pfa-send"
            onClick={submit}
            disabled={sending || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12L20 4l-7 16-2-7-7-1z" />
            </svg>
          </button>
        </div>
        <p className="pfa-fine">General pet-care guidance only. It isn't a substitute for a veterinarian.</p>
      </div>
    </div>
  );
}

/* ---------- Pieces ---------- */
function Message({ message, onRetry }) {
  if (message.role === "user") {
    return (
      <div className="pfa-row pfa-user">
        <div className="pfa-bubble">{message.text}</div>
      </div>
    );
  }
  return (
    <div className="pfa-row">
      <Avatar />
      <div className={`pfa-bubble${message.error ? " pfa-error" : ""}`}>
        {renderBody(message.text)}
        {message.error && (
          <button type="button" className="pfa-retry" onClick={() => onRetry(message)}>
            Try again
          </button>
        )}
        <Sources sources={message.sources} />
      </div>
    </div>
  );
}

function Sources({ sources }) {
  const safe = (sources || []).filter((s) => s && s.title && isSafeUrl(s.url));
  if (!safe.length) return null;
  return (
    <div className="pfa-sources">
      <h3>Sources</h3>
      {safe.map((s, i) => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
          <span className="pfa-num">{i + 1}</span>
          <span className="pfa-src-text">
            <b>{s.title}</b>
            <small>{s.url.replace(/^https?:\/\/(www\.)?/, "")}</small>
          </span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </a>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="pfa-row">
      <Avatar />
      <div className="pfa-bubble pfa-typing" aria-label="Assistant is typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="pfa-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s2-5 5-7c1.5-1 2.5.5 1.5 2 2.5-1 5.5-5 7.5-5 1 2-.5 4-.5 4 1.5.5 2.5 1.5 2.5 3 0 0-3.5 1-5.5.5-1 2-3.5 3-5.5 3" />
      </svg>
    </div>
  );
}

/* ---------- Helpers ---------- */
// Only http(s) links are shown, in case a bad URL comes back from the backend.
function isSafeUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

// "[1]" becomes a superscript marker. Everything else stays plain text
// (React escapes it), so model output can never inject HTML.
function renderInline(text) {
  return text
    .split(/(\[\d+\])/g)
    .map((part, i) => (/^\[\d+\]$/.test(part) ? <sup key={i}>{part}</sup> : part));
}

// Lines starting with "- " become bullets; other lines become paragraphs.
function renderBody(text) {
  const blocks = [];
  let bullets = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`}>
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ul>
    );
    bullets = [];
  };
  text.split("\n").forEach((line) => {
    if (line.startsWith("- ")) {
      bullets.push(line.slice(2));
    } else if (line.trim()) {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
    }
  });
  flush();
  return blocks;
}