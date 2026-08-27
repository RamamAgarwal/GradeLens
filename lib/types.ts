// Normalized 0..1 region on a given page image.
export interface BBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PageImage {
  page: number; // 1-indexed
  dataUrl: string; // base64 PNG/JPEG data URL, used for on-screen rendering
  base64: string; // raw base64 (no data: prefix), sent to the model
  mimeType: string;
  width: number;
  height: number;
}

export interface Question {
  id: string; // stable id, e.g. "11a"
  displayNumber: string; // printed form, e.g. "11 (a)"
  parentNumber: string; // "11" — used to keep sub-parts grouped in order
  text: string;
  maxMarks: number | null;
  page: number;
  order: number; // printed order, 0-indexed
}

export interface AnswerRegion {
  page: number;
  bbox: BBox;
}

export interface AnswerSegment {
  id: string;
  rawLabel: string | null; // what the student wrote, e.g. "Q3", "11(b)", or null if none
  transcription: string;
  regions: AnswerRegion[]; // usually one, more if it spans pages
  order: number; // order the segment appears on the sheet
}

export type MatchMethod = 'label-exact' | 'label-fuzzy' | 'semantic' | 'none';

export interface Mapping {
  questionId: string | null; // null => unmatched answer
  segmentIds: string[];
  method: MatchMethod;
  confidence: number; // 0..1
}

export type Verdict = 'correct' | 'partial' | 'incorrect' | 'unanswered' | 'ungraded';

export interface GradeResult {
  questionId: string;
  score: number | null;
  maxMarks: number | null;
  verdict: Verdict;
  feedback: string;
}

export interface OverallSummary {
  totalScore: number;
  totalMax: number;
  answeredCount: number;
  unansweredCount: number;
  unmatchedAnswerCount: number;
  overallFeedback: string;
}

export interface ProcessResult {
  questions: Question[];
  segments: AnswerSegment[];
  mappings: Mapping[];
  grades: GradeResult[];
  summary: OverallSummary;
  answerPages: { page: number; width: number; height: number }[];
}

export type ProcessingStage =
  | 'idle'
  | 'rendering-pages'
  | 'extracting-questions'
  | 'extracting-answers'
  | 'mapping'
  | 'grading'
  | 'done'
  | 'error';
