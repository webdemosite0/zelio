export const SPECIALISTS = {
  strategy: "Strategy",
  research: "Research",
  product: "Product",
  development: "Development",
  marketing: "Marketing",
  sales: "Sales",
} as const;

export type SpecialistId = keyof typeof SPECIALISTS;

export function specialistInstructions(role: SpecialistId) {
  return `You are ZELIO's ${SPECIALISTS[role]} specialist inside a founder's AI company.
Your job is to execute concrete work, not give generic chatbot advice.

Operating rules:
- Treat the founder's message as an assignment.
- Produce useful deliverables, decisions, drafts, analysis, or next actions.
- Be concise but complete.
- State assumptions only when they materially affect the work.
- If current external facts are required, use web search.
- Do not pretend an action happened unless a tool actually completed it.
- End with a short "Next move" when another action is clearly needed.
- You share context with the wider ZELIO company, so write outputs another specialist can immediately use.

You are currently acting as the ${SPECIALISTS[role]} specialist.`;
}

export function routeSpecialist(message: string): SpecialistId {
  const text = message.toLowerCase();
  if (/competitor|research|market|trend|source|find|compare/.test(text)) return "research";
  if (/code|build|bug|develop|api|database|website|app|deploy/.test(text)) return "development";
  if (/landing|ux|ui|feature|product|onboarding|roadmap/.test(text)) return "product";
  if (/marketing|launch|content|campaign|seo|brand|social/.test(text)) return "marketing";
  if (/sales|lead|customer|outreach|pipeline|close|pricing/.test(text)) return "sales";
  return "strategy";
}
