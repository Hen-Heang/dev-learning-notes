import { NextRequest, NextResponse } from "next/server";
import { generateStructuredStudyOutput } from "@/lib/openai-study";

type AskNoteSection = {
  title: string;
  body: string;
};

type AskNoteResponse = {
  summary: string;
  sections: AskNoteSection[];
  takeaways: string[];
};

const ASK_NOTE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "sections", "takeaways"],
  properties: {
    summary: { type: "string" },
    sections: {
      type: "array",
      minItems: 2,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body"],
        properties: {
          title: { type: "string" },
          body: { type: "string" },
        },
      },
    },
    takeaways: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: { type: "string" },
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const { title, content, question } = await req.json();

    if (!content || !question) {
      return NextResponse.json(
        { error: "Note content and question are required" },
        { status: 400 }
      );
    }

    const result = await generateStructuredStudyOutput<AskNoteResponse>({
      schemaName: "ask_note_response",
      schema: ASK_NOTE_SCHEMA,
      instructions: `You are a senior study coach for a developer learning Java, Spring Boot, MyBatis, SQL, JSP, jQuery, and Korean enterprise application patterns.
Answer only from the supplied note content.
Organize the answer for easy study.
Use short plain-English explanations.
Do not write markdown markers like ###, **, or bullet symbols inside the text fields.
If the note does not fully answer the question, say that clearly instead of inventing details.

Output format rules:
- summary: 2 to 4 short sentences
- sections: 2 to 4 sections with a short title and a compact body
- takeaways: 3 to 4 short actionable reminders`,
      input: `Note title: ${title}

Learner question:
${question}

Note content:
${String(content).slice(0, 12000)}`,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Ask note error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
