// TEST DATA ONLY (placeholder text). Delete this file, and the import in
// assistantApi.js, once the real backend works.

const BASE = "https://www.peopleforanimals.org/care";

const TOPICS = [
  {
    keywords: ["vaccin", "shot", "rabies", "puppy"],
    answer:
      "Indie puppies are usually vaccinated against distemper, hepatitis, parvovirus and parainfluenza starting at about 6 to 8 weeks, with boosters every 3 to 4 weeks until about 16 weeks [1].\n- Rabies vaccine is given from about 12 weeks, then yearly or as your vet advises [2]\n- Keep puppies away from other dogs until the series is complete\n- Ask your vet to set a schedule for your dog",
    sources: [
      { title: "Core vaccines for dogs", url: `${BASE}/dog-vaccination` },
      { title: "Rabies vaccination basics", url: `${BASE}/rabies` },
    ],
  },
  {
    keywords: ["tick", "flea", "fever"],
    answer:
      "Ticks are a big concern for indie dogs, because they can spread tick fever [1].\n- Use a vet-recommended tick and flea preventive on a regular schedule\n- Check ears, neck, armpits and between the toes after outdoor time\n- Wash bedding often\nPale gums, fever or a sudden drop in energy need a vet visit the same day.",
    sources: [{ title: "Ticks and tick fever in dogs", url: `${BASE}/ticks` }],
  },
  {
    keywords: ["limp", "joint", "pain", "injur"],
    answer:
      "A limp that lasts more than a day or two can point to an injury, something stuck in the paw, or a joint problem [1]. Rest your dog and avoid jumping and stairs.\nI can't diagnose the cause, so please book a visit with your vet if the limp continues.",
    sources: [{ title: "Signs of joint pain and limping in dogs", url: `${BASE}/dog-joint-health` }],
  },
  {
    keywords: ["food", "feed", "eat", "diet", "chocolate", "onion"],
    answer:
      "Adult dogs do best on a balanced diet of 2 meals a day [1]. Never feed chocolate, onions, garlic, grapes or raisins, or cooked bones [2].\n- Always keep fresh water available\n- Change foods slowly over about a week",
    sources: [
      { title: "Feeding an adult dog", url: `${BASE}/dog-feeding` },
      { title: "Foods that are toxic to dogs", url: `${BASE}/toxic-foods` },
    ],
  },
];

// Used when no topic matches. Tests that the bot refuses instead of guessing.
const NO_ANSWER = {
  answer:
    "I couldn't find that in the People For Animals care guides, so I don't want to guess. Try rephrasing your question, or ask your vet.",
  sources: [],
};

// Same shape as the real API. Type "error" to test the failure state.
export function mockReply({ message, conversationId, signal }) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (message.trim().toLowerCase() === "error") {
        reject(new Error("The assistant is unavailable right now. Please try again."));
        return;
      }
      const text = message.toLowerCase();
      const hit = TOPICS.find((t) => t.keywords.some((k) => text.includes(k))) || NO_ANSWER;
      resolve({ conversationId: conversationId || "mock", answer: hit.answer, sources: hit.sources });
    }, 900);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}