# Grade Lens - Answer Sheet Grader

Upload a question paper and one student's handwritten answer sheet (PDF or images).
The app extracts every question in printed order, segments and transcribes the
student's answers, maps each answer to the question it belongs to, highlights the
exact region on the answer sheet when you click a question, and produces a first-pass
grade with feedback per question and overall.

## How it works

```
Upload → render pages to images (client-side)
      → extract questions            [Gemini vision]  /api/extract-questions
      → extract answer segments      [Gemini vision]  /api/extract-answers
      → match segments to questions  [rules, then Gemini text for leftovers]  /api/map-and-grade
      → grade each mapped answer     [Gemini text]     /api/map-and-grade
```

- **Sub-parts** ("11 (a)", "11 (b)") are extracted as separate question entries, in printed order.
- **Out-of-order answers** are matched by the label the student wrote (normalized - "Q11b", "11 (b)", "11-b" all match), not by position on the sheet.
- **Unlabeled/ambiguous answers** fall back to a semantic match against the remaining unmatched questions; if nothing fits, they're shown separately as "answers with no matching question" instead of being forced onto the wrong one.
- **Unanswered questions** are simply questions no segment ever matched - shown with a "not answered" badge and graded as 0.
- **Multi-page answers** are represented as one segment with multiple highlighted regions (one per page), so clicking the question highlights all of them.
- Everything is kept in memory for the request/session only - no database, no auth.

## Setup

```bash
npm install
cp .env.example .env.local
```

Get a **free** Gemini API key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and put it in `.env.local`:

```
GEMINI_API_KEY=your-key-here
```

Then run it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                 main UI: upload flow, question list, answer viewer
  api/extract-questions/   Gemini vision call → ordered Question[]
  api/extract-answers/     Gemini vision call → AnswerSegment[] with bounding boxes
  api/map-and-grade/       label matching (lib/matching.ts) + semantic fallback + grading
components/                Uploader, ProgressSteps, QuestionList, AnswerViewer, SummaryPanel
lib/
  types.ts                 shared data contracts for the whole pipeline
  pdf.ts                   client-side PDF/image → downscaled page images
  gemini.ts                Gemini REST client
  prompts.ts               all prompt text, in one place
  matching.ts              question-number normalization + rule-based matching
```

## Known limitations / things to improve with more time

- Grading is a single automatic pass meant as a first draft for the teacher to
  review, not a final grade - it's shown as such in the UI.
- Very poor handwriting or low-quality photos will degrade both transcription
  and bounding-box accuracy; a higher-resolution scan helps a lot.
- The semantic-matching and grading calls are single Gemini requests batching all
  questions; for very long papers you may want to chunk them to stay under
  per-request token limits.
