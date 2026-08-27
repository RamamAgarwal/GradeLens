export const QUESTION_EXTRACTION_SYSTEM = `You are an exam-paper parser. You read scanned/photographed question papers,
page by page, and output every question in printed order with perfect fidelity
to the original numbering. You never invent questions and never skip any,
including short ones like "Define X" or instructions embedded as a numbered item.`;

export function questionExtractionPrompt(pageCount: number): string {
  return `You are given ${pageCount} page image(s) of a question paper, in printed order (page 1 first).

Extract every question as a flat, ordered JSON array. Rules:
- Preserve the exact printed numbering as "displayNumber" (e.g. "1", "2.", "11 (a)", "Q.5", "III").
- If a question has labelled sub-parts (a), (b), (i), (ii), etc., emit each sub-part as its OWN separate entry, with "parentNumber" set to the parent question's number (e.g. parentNumber "11" for displayNumber "11 (a)"). If a question has no sub-parts, parentNumber equals displayNumber's leading number/label.
- Keep the array in the exact order the questions are printed, top to bottom, page by page.
- "text" is the full question text (the instruction/prompt itself), cleaned up but not paraphrased or shortened.
- "maxMarks" is a number if marks are printed for that question/sub-part (e.g. "[5]", "(10 marks)"), otherwise null. Do not guess marks that are not printed.
- "page" is the 1-indexed page number this question appears on (the page where its text begins).
- Ignore headers, footers, instructions to candidates, and page numbers — those are not questions.
- If the paper has sections (Section A, Section B) that's fine, just keep flattening into one ordered list.

Respond with ONLY a JSON object of this exact shape, no commentary:
{
  "questions": [
    { "displayNumber": string, "parentNumber": string, "text": string, "maxMarks": number | null, "page": number }
  ]
}`;
}

export const ANSWER_EXTRACTION_SYSTEM = `You are an expert at reading messy handwritten student exam answer sheets,
including cross-outs, margin notes, arrows indicating continuation, and answers
written out of order. You segment the sheet into distinct answer blocks and
transcribe each one as faithfully as possible, noting exactly where on the
page image each block is located.`;

export function answerExtractionPrompt(pageCount: number): string {
  return `You are given ${pageCount} page image(s) of one student's handwritten answer sheet, in physical order (page 1 first).

Segment the handwriting into distinct answer blocks — a new block starts whenever the student
begins answering what looks like a different question (usually signalled by a written label like
"Q3", "3.", "Ans 11(b)", a horizontal rule, or a clear topic change). Rules:
- "rawLabel": the question number/label AS WRITTEN by the student for that block (e.g. "3", "Q.11 (b)", "11b"). If the student wrote no discernible label for a block, set this to null — do not guess which question it answers.
- "transcription": your best-effort transcription of the handwritten text in that block. If largely illegible, transcribe what you can and append "[illegible portion]".
- "bbox": the block's bounding box on its page image, normalized to 0..1 of that image's width/height, as {"x": left, "y": top, "w": width, "h": height}. Estimate generously enough to contain the full block including the label, but don't include neighboring unrelated blocks. Coordinates are fractions (e.g. x=0.08 means 8% in from the left edge).
- "page": the 1-indexed page number this region is on.
- If a single answer clearly continues onto a later page (e.g. "contd. on next page", or the same numbered answer resumes after other content), represent it as ONE block with multiple entries in "regions" (each with its own page and bbox), not as two separate blocks.
- Preserve the order blocks appear on the sheet (top to bottom, page by page) in the array — this may NOT match question order, since students often answer out of sequence.
- Do not attempt to grade or match anything to the question paper here — only segment and transcribe.

Respond with ONLY a JSON object of this exact shape, no commentary:
{
  "segments": [
    {
      "rawLabel": string | null,
      "transcription": string,
      "regions": [ { "page": number, "bbox": { "x": number, "y": number, "w": number, "h": number } } ]
    }
  ]
}`;
}

export const SEMANTIC_MATCH_SYSTEM = `You are matching unlabeled or ambiguously-labeled handwritten answer
segments to the question they most likely answer, based on content alone.
You are careful and conservative: if a segment does not clearly correspond
to any listed question, you say so rather than forcing a match.`;

export function semanticMatchPrompt(
  questions: { id: string; displayNumber: string; text: string }[],
  segments: { id: string; rawLabel: string | null; transcription: string }[]
): string {
  return `Here are the questions from the question paper that still need an answer match
(questions already matched by label are not included):

${JSON.stringify(questions, null, 2)}

Here are the answer segments that could not be matched by their written label alone
(either the label was missing, unreadable, or didn't correspond to any known question):

${JSON.stringify(segments, null, 2)}

For each segment, decide which question id it most likely answers based on its content, or
"NONE" if it doesn't plausibly answer any of the listed questions (e.g. it's a rough-work
scratch pad, a duplicate/extra note, or clearly about something not asked). A question may
receive at most one additional segment from this step. Be conservative — prefer "NONE" over
a weak guess.

Respond with ONLY a JSON object of this exact shape, no commentary:
{
  "matches": [ { "segmentId": string, "questionId": string | "NONE", "confidence": number } ]
}`;
}

export const GRADING_SYSTEM = `You are an experienced, fair exam grader. You grade strictly against what the
question asks, give partial credit where reasoning is partly correct, and write
brief, specific, constructive feedback a student could actually learn from.
You never fabricate a model answer key beyond what a subject-matter expert
would reasonably expect for the question as written.`;

export function gradingPrompt(
  items: { questionId: string; displayNumber: string; questionText: string; maxMarks: number | null; answerText: string | null }[]
): string {
  return `Grade each of the following question/answer pairs. If "answerText" is null, the
student did not answer — score 0 (or null if maxMarks is null) and verdict "unanswered", with
feedback simply noting it was not attempted.

For answered questions:
- "score": a number from 0 to maxMarks (if maxMarks is null, use a 0-10 scale instead and still return maxMarks as null in your response context).
- "verdict": "correct" (fully meets what was asked), "partial" (some correct content, but incomplete or with errors), or "incorrect" (does not answer what was asked / substantively wrong).
- "feedback": 1-3 sentences, specific to this answer, addressed to the student.

Items:
${JSON.stringify(items, null, 2)}

After grading all items, also write a short overall summary (2-4 sentences) of the student's
performance across the whole sheet, mentioning strengths and the most important gaps.

Respond with ONLY a JSON object of this exact shape, no commentary:
{
  "grades": [ { "questionId": string, "score": number | null, "verdict": "correct" | "partial" | "incorrect" | "unanswered", "feedback": string } ],
  "overallFeedback": string
}`;
}
