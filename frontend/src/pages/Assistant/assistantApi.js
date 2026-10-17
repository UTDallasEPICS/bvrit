import { mockReply } from "./assistantMockData";

/* ---------------- Settings: the only things to change ---------------- */
const USE_MOCK = true;           // true = test data, false = real backend
const API_URL = "/api/chat";     // your Express route (use a full origin if the API is on another domain)
const AUTH_TOKEN_KEY = "token";  // localStorage key for your login token; null if you only use cookies

/*
  Backend contract
  POST API_URL
    request : { message: string, conversationId: string | null }
    response: { conversationId: string,
                answer: string,   // [1], [2] mark sources; lines starting "- " become bullets
                sources: [{ title: string, url: string }] }   // [] if nothing was retrieved
    errors  : any non-2xx, optionally { error: "message shown to the user" }
*/
export async function sendMessage({ message, conversationId, signal }) {
  if (USE_MOCK) return mockReply({ message, conversationId, signal });

  const headers = { "Content-Type": "application/json" };
  const token = readToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ message, conversationId: conversationId ?? null }),
    signal,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).error || "";
    } catch {
      /* no JSON body */
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return {
    conversationId: data.conversationId ?? conversationId ?? null,
    answer: String(data.answer ?? ""),
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}

function readToken() {
  try {
    return AUTH_TOKEN_KEY ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  } catch {
    return null;
  }
}