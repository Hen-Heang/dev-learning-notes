import { NextRequest, NextResponse } from "next/server";
import { generateStructuredStudyOutput } from "@/lib/openai-study";

type AskNoteResponse = {
  answer: string;
  takeaways: string[];
};

const ASK_NOTE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "takeaways"],
  properties: {
    answer: { type: "string" },
    takeaways: {
      type: "array",
      minItems: 3,
      maxItems: 3,
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
Keep the explanation concrete, beginner-friendly, and technically correct.
If the note does not fully answer the question, say that clearly instead of inventing details.
Write concise English.`,
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
