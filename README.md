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
- **Out-of-order answers** are matched by the label the student wrote (normalized — "Q11b", "11 (b)", "11-b" all match), not by position on the sheet.
- **Unlabeled/ambiguous answers** fall back to a semantic match against the remaining unmatched questions; if nothing fits, they're shown separately as "answers with no matching question" instead of being forced onto the wrong one.
- **Unanswered questions** are simply questions no segment ever matched — shown with a "not answered" badge and graded as 0.
- **Multi-page answers** are represented as one segment with multiple highlighted regions (one per page), so clicking the question highlights all of them.
- Everything is kept in memory for the request/session only — no database, no auth.

## Setup

```bash
npm install
cp .env.example .env.local
```

Get a **free** Gemini API key at <https://aistudio.google.com/app/apikey> and put it in `.env.local`:

```
GEMINI_API_KEY=your-key-here
```

Then run it:

```bash
npm run dev
```

Open <http://localhost:3000>.

> **If extraction/grading calls start failing:** Google periodically retires free-tier
> model names. Check <https://ai.google.dev/gemini-api/docs/models> for the current
> free Flash model and set `GEMINI_MODEL` in `.env.local` accordingly (defaults to
> `gemini-2.5-flash`).

## Deploying to a live URL

The easiest path is **Vercel** (free tier), since this is a standard Next.js app:

1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com/new> and import the repo.
3. In the project's **Environment Variables**, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`).
4. Deploy. Vercel builds and gives you a live `*.vercel.app` URL automatically.

Any other Node host (Render, Railway, Fly.io, a VPS with `npm run build && npm start`) works the same way — the app has no other infrastructure dependencies.

### A note on upload size

Serverless hosts (Vercel's Hobby tier included) cap request body size, typically
around 4.5 MB. Pages are auto-downscaled and re-encoded client-side (longest edge
1800px, JPEG ~85%) before upload to stay well within that for typical question
papers and answer sheets (a handful of pages each). If you're grading unusually
long answer sheets (15+ pages) and see upload errors, either lower `MAX_DIMENSION`
in `lib/pdf.ts` a bit further, or deploy somewhere without that body-size cap
(e.g. a small VPS or Railway/Render).

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
  review, not a final grade — it's shown as such in the UI.
- Very poor handwriting or low-quality photos will degrade both transcription
  and bounding-box accuracy; a higher-resolution scan helps a lot.
- The semantic-matching and grading calls are single Gemini requests batching all
  questions; for very long papers you may want to chunk them to stay under
  per-request token limits.
