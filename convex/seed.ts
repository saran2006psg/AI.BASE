import { internalMutation } from "./_generated/server";

// ---------------------------------------------------------------------------
// Seed — Bulk insert all mock data into Convex
// ---------------------------------------------------------------------------
// Run this ONCE via the Convex dashboard Functions tab:
//   Go to http://127.0.0.1:6790 → Functions → seed:run → Run Function
// ---------------------------------------------------------------------------

const SEED_WORKFLOWS = [
  {
    slug: "cold-email-writing-with-ai",
    title: "Cold Email Writing with AI",
    category: "Marketing",
    difficulty: "Beginner" as const,
    tools: ["ChatGPT", "Hunter.io", "Notion"],
    summary:
      "Generate high-converting cold emails using a 3-step AI pipeline that personalizes at scale.",
    saveCount: 312,
    lastTested: "2 days ago",
    status: "published" as const,
    problem:
      "Writing cold emails manually is slow, inconsistent, and rarely personalized. Most teams either send generic blasts or spend hours crafting individual emails — neither approach scales.",
    steps: [
      {
        title: "Research your prospect",
        content:
          "Use Hunter.io to find verified contact emails. Pull LinkedIn bios or company pages into Notion. The more context you feed the AI, the better the output.",
      },
      {
        title: "Build your prompt template",
        content:
          "Create a reusable prompt in Notion that includes placeholders for [Name], [Company], [Pain Point], and [Your Value Prop]. This becomes your email factory.",
      },
      {
        title: "Generate and refine with ChatGPT",
        content:
          "Paste your filled template into ChatGPT. Ask it to write 3 variations: one formal, one conversational, one ultra-short (under 60 words). Pick the best or A/B test all three.",
      },
      {
        title: "Track and iterate",
        content:
          "Log which variations get replies in Notion. Feed winning emails back into your prompt to evolve the template over time.",
      },
    ],
    prompts: [
      {
        label: "Email Generation Prompt",
        code: `You are an expert B2B copywriter. Write a cold email to:
- Name: {FirstName}
- Company: {Company}
- Their likely pain: {PainPoint}
- My offer: {ValueProp}

Rules:
- Max 120 words
- No buzzwords
- End with a soft CTA (not "schedule a call")
- Sound like a human, not a sales robot

Write 3 variations: formal, casual, ultra-short.`,
      },
      {
        label: "Follow-up Prompt",
        code: `Write a 1-sentence follow-up to this email:
"{PasteOriginalEmail}"

The follow-up should:
- Reference the original without repeating it
- Add one new insight or data point
- Be under 40 words`,
      },
    ],
    mistakes: [
      "Skipping the research step — generic emails get ignored. Spend 2 minutes on each prospect.",
      "Using ChatGPT's first output directly. Always generate at least 3 variants and edit the winner.",
      "Forgetting to track results. Without data, you can't improve the prompt.",
    ],
  },
  {
    slug: "research-summarization-pipeline",
    title: "Research Summarization Pipeline",
    category: "Research",
    difficulty: "Intermediate" as const,
    tools: ["Perplexity", "Claude", "Notion"],
    summary:
      "Turn any long document or topic into a structured research brief in minutes using a multi-step AI pipeline.",
    saveCount: 489,
    lastTested: "5 days ago",
    status: "published" as const,
    problem:
      "Reading and synthesizing long documents, papers, or web sources takes hours. Most people either skip deep research or get lost in rabbit holes without producing structured output.",
    steps: [
      {
        title: "Gather sources with Perplexity",
        content:
          "Use Perplexity AI to get an initial overview with cited sources. Ask it to 'Summarize the top 5 perspectives on [topic] with links'. Copy the sources it surfaces.",
      },
      {
        title: "Deep-read with Claude",
        content:
          "Paste full documents or long articles into Claude. Ask it to extract: key claims, supporting evidence, open questions, and counterarguments.",
      },
      {
        title: "Structure into a brief",
        content:
          "Use a Notion template with fixed sections: TL;DR, Key Findings, Conflicting Views, Gaps, and Recommended Next Steps.",
      },
      {
        title: "Validate and fill gaps",
        content:
          "Run your draft brief back through Perplexity to check for missing perspectives or newer research.",
      },
    ],
    prompts: [
      {
        label: "Document Extraction Prompt",
        code: `Extract the following from this document:

1. **Core Argument** (1 sentence)
2. **Key Evidence** (bullet list, max 5)
3. **Assumptions Made** (what must be true for this to hold)
4. **Counterarguments** (strongest objections)
5. **Open Questions** (what's still unresolved)

Document: {PasteDocument}`,
      },
    ],
    mistakes: [
      "Trusting AI summaries without checking sources. Always verify key claims against originals.",
      "Using only one AI tool. Perplexity finds, Claude synthesizes — they're complementary.",
      "Not saving your Notion template. Recreating it every time kills momentum.",
    ],
  },
  {
    slug: "code-review-automation",
    title: "Code Review Automation",
    category: "Coding",
    difficulty: "Intermediate" as const,
    tools: ["GitHub Copilot", "Claude", "VS Code"],
    summary:
      "Set up an automated code review workflow that catches bugs, security issues, and style violations before PRs reach humans.",
    saveCount: 671,
    lastTested: "1 day ago",
    status: "published" as const,
    problem:
      "Manual code review is a bottleneck. Senior engineers spend hours reviewing PRs, often catching the same class of mistakes repeatedly. Teams need a first-pass filter that handles the routine stuff.",
    steps: [
      {
        title: "Set up Claude in your editor",
        content:
          "Install the Claude VS Code extension or use the API via a custom script. Configure it to read your codebase context (style guide, patterns).",
      },
      {
        title: "Create a review prompt template",
        content:
          "Write a prompt that covers your team's specific standards: naming conventions, security patterns, error handling requirements, and performance thresholds.",
      },
      {
        title: "Automate on pre-commit or PR open",
        content:
          "Use a GitHub Action that calls Claude's API on every new PR. Post the review as a PR comment automatically.",
      },
      {
        title: "Tune based on false positives",
        content:
          "Track when engineers dismiss AI suggestions. Update your prompt to reduce noise and increase signal over time.",
      },
    ],
    prompts: [
      {
        label: "Code Review Prompt",
        code: `Review this code for:
1. **Bugs** — logic errors, edge cases, off-by-one errors
2. **Security** — SQL injection, XSS, exposed secrets, improper auth
3. **Performance** — unnecessary loops, N+1 queries, missing indexes
4. **Readability** — unclear variable names, missing comments on complex logic
5. **Style violations** — deviations from [your-style-guide]

For each issue:
- Severity: Critical / Major / Minor
- Line reference
- Suggested fix (code snippet)

Code: {PasteCode}`,
      },
    ],
    mistakes: [
      "Reviewing entire files at once. Break it into logical chunks — Claude is more accurate on smaller diffs.",
      "Ignoring AI suggestions wholesale. Even imperfect reviews catch real bugs.",
      "Not giving Claude your style guide. Without context, it defaults to generic best practices.",
    ],
  },
  {
    slug: "meeting-notes-to-action-items",
    title: "Meeting Notes → Action Items",
    category: "Productivity",
    difficulty: "Beginner" as const,
    tools: ["Otter.ai", "ChatGPT", "Notion"],
    summary:
      "Convert raw meeting transcripts into clean summaries and assigned tasks in under 2 minutes.",
    saveCount: 528,
    lastTested: "3 days ago",
    status: "published" as const,
    problem:
      "Meetings produce a wall of transcript text that nobody reads. Action items get lost, accountability is unclear, and follow-up depends on whoever has the best memory.",
    steps: [
      {
        title: "Record and transcribe with Otter.ai",
        content:
          "Enable Otter.ai in your meeting (works with Zoom, Teams, Google Meet). It auto-transcribes in real time. Export the transcript as text after the call.",
      },
      {
        title: "Run the extraction prompt",
        content:
          "Paste the transcript into ChatGPT with the extraction prompt below. It will identify decisions, action items, and owners automatically.",
      },
      {
        title: "Push to Notion",
        content:
          "Copy the structured output into your Notion meeting notes template. Tag owners, set due dates, and link to the relevant project page.",
      },
      {
        title: "Send recap email",
        content:
          "Use the recap prompt to generate a short email summary. Send within 30 minutes of the meeting while context is fresh.",
      },
    ],
    prompts: [
      {
        label: "Transcript Extraction Prompt",
        code: `From this meeting transcript, extract:

**Summary** (3 sentences max)

**Decisions Made**
- [decision] — decided by [who]

**Action Items**
- [ ] [task] — Owner: [name] — Due: [if mentioned]

**Open Questions** (unresolved, needs follow-up)

**Next Meeting** (if scheduled)

Transcript: {PasteTranscript}`,
      },
      {
        label: "Recap Email Prompt",
        code: `Write a meeting recap email from these notes:
{PasteExtractedNotes}

Format:
- Subject line: "Recap: [Meeting Name] — [Date]"
- 2 sentence intro
- Bullet list of decisions
- Bullet list of action items with owners
- Next steps / next meeting info
- Professional but warm tone`,
      },
    ],
    mistakes: [
      "Waiting too long to process the transcript — do it immediately after the call.",
      "Not assigning owners to every action item. 'Team' is not an owner.",
      "Skipping the recap email. The Notion entry is for you; the email creates accountability.",
    ],
  },
];

const SEED_TOOLS = [
  {
    name: "ChatGPT",
    category: "AI Assistant",
    description:
      "OpenAI's flagship chat model for reasoning, writing, and code generation.",
    url: "https://chat.openai.com",
    emoji: "🤖",
  },
  {
    name: "Claude",
    category: "AI Assistant",
    description:
      "Anthropic's AI — excels at long documents, nuanced reasoning, and safe outputs.",
    url: "https://claude.ai",
    emoji: "⚡",
  },
  {
    name: "Perplexity",
    category: "AI Search",
    description:
      "AI-powered search with cited sources. Best for real-time research.",
    url: "https://perplexity.ai",
    emoji: "🔍",
  },
  {
    name: "Notion AI",
    category: "Productivity",
    description:
      "AI built into Notion for summarizing, drafting, and organizing notes.",
    url: "https://notion.so",
    emoji: "📝",
  },
  {
    name: "GitHub Copilot",
    category: "Coding",
    description:
      "AI pair programmer that autocompletes code in VS Code and other editors.",
    url: "https://github.com/features/copilot",
    emoji: "💻",
  },
  {
    name: "Otter.ai",
    category: "Transcription",
    description: "Automatic meeting transcription and summary generation.",
    url: "https://otter.ai",
    emoji: "🎙️",
  },
  {
    name: "Hunter.io",
    category: "Sales",
    description:
      "Find verified professional email addresses at any company.",
    url: "https://hunter.io",
    emoji: "🎯",
  },
  {
    name: "Midjourney",
    category: "Image AI",
    description:
      "High-quality AI image generation via Discord or web interface.",
    url: "https://midjourney.com",
    emoji: "🎨",
  },
  {
    name: "Cursor",
    category: "Coding",
    description:
      "AI-native code editor built on VS Code with deep Claude/GPT-4 integration.",
    url: "https://cursor.sh",
    emoji: "🖱️",
  },
  {
    name: "ElevenLabs",
    category: "Audio AI",
    description: "Ultra-realistic AI voice generation and cloning.",
    url: "https://elevenlabs.io",
    emoji: "🔊",
  },
  {
    name: "Zapier AI",
    category: "Automation",
    description:
      "Connect apps and automate workflows with AI-powered triggers.",
    url: "https://zapier.com",
    emoji: "⚙️",
  },
  {
    name: "Runway",
    category: "Video AI",
    description:
      "AI video generation and editing. Gen-2 creates video from text or image.",
    url: "https://runwayml.com",
    emoji: "🎬",
  },
];

// ---------------------------------------------------------------------------
// Run this mutation once via the Convex dashboard:
//   http://127.0.0.1:6790 → Functions → seed:run → Run Function
// ---------------------------------------------------------------------------
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Guard: don't double-seed if data already exists
    const existing = await ctx.db.query("workflows").first();
    if (existing) {
      return { message: "Database already seeded. Skipping." };
    }

    // Insert workflows
    for (const workflow of SEED_WORKFLOWS) {
      await ctx.db.insert("workflows", workflow);
    }

    // Insert tools
    for (const tool of SEED_TOOLS) {
      await ctx.db.insert("tools", tool);
    }

    return {
      message: `Seeded ${SEED_WORKFLOWS.length} workflows and ${SEED_TOOLS.length} tools.`,
    };
  },
});
