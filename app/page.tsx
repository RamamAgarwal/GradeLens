'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import UploadStage from '@/components/UploadStage';
import LoadingStage from '@/components/LoadingStage';
import QuestionList from '@/components/QuestionList';
import AnswerViewer from '@/components/AnswerViewer';
import SummaryPanel from '@/components/SummaryPanel';
import { filesToPageImages } from '@/lib/pdf';
import type { AnswerSegment, GradeResult, Mapping, OverallSummary, PageImage, ProcessingStage, Question } from '@/lib/types';

export default function Page() {
  const [questionFiles, setQuestionFiles] = useState<File[]>([]);
  const [answerFiles, setAnswerFiles] = useState<File[]>([]);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [segments, setSegments] = useState<AnswerSegment[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [grades, setGrades] = useState<GradeResult[]>([]);
  const [summary, setSummary] = useState<OverallSummary | null>(null);
  const [answerPages, setAnswerPages] = useState<PageImage[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const isProcessing = !['idle', 'done', 'error'].includes(stage);
  const canStart = questionFiles.length > 0 && answerFiles.length > 0 && !isProcessing;
  const hasResults = stage === 'done' && questions.length > 0;

  async function postJSON<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Request to ${url} failed.`);
    return json as T;
  }

  async function handleStart() {
    setError(null);
    setSelectedId(null);
    setSummaryOpen(false);
    try {
      setStage('rendering-pages');
      const [questionPages, answerPageImages] = await Promise.all([
        filesToPageImages(questionFiles),
        filesToPageImages(answerFiles)
      ]);
      setAnswerPages(answerPageImages);

      setStage('extracting-questions');
      const { questions: extractedQuestions } = await postJSON<{ questions: Question[] }>('/api/extract-questions', {
        pages: questionPages.map((p) => ({ mimeType: p.mimeType, base64: p.base64 }))
      });
      setQuestions(extractedQuestions);

      setStage('extracting-answers');
      const { segments: extractedSegments } = await postJSON<{ segments: AnswerSegment[] }>('/api/extract-answers', {
        pages: answerPageImages.map((p) => ({ mimeType: p.mimeType, base64: p.base64 }))
      });
      setSegments(extractedSegments);

      setStage('mapping');
      const mapResult = await postJSON<{ mappings: Mapping[]; grades: GradeResult[]; summary: OverallSummary }>(
        '/api/map-and-grade',
        { questions: extractedQuestions, segments: extractedSegments }
      );
      setStage('grading');
      setMappings(mapResult.mappings);
      setGrades(mapResult.grades);
      setSummary(mapResult.summary);

      setStage('done');
      if (extractedQuestions.length > 0) setSelectedId(extractedQuestions[0].id);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Something went wrong while processing the sheets.');
      setStage('error');
    }
  }

  function handleReset() {
    setQuestionFiles([]);
    setAnswerFiles([]);
    setStage('idle');
    setError(null);
    setQuestions([]);
    setSegments([]);
    setMappings([]);
    setGrades([]);
    setSummary(null);
    setAnswerPages([]);
    setSelectedId(null);
    setSummaryOpen(false);
  }

  const unmatchedSegments = segments.filter((s) => {
    const mapping = mappings.find((m) => m.segmentIds.includes(s.id));
    return mapping ? mapping.questionId === null : false;
  });

  const [userCollapsed, setUserCollapsed] = useState(false);
  const sidebarCollapsed = isProcessing || hasResults || userCollapsed;

  return (
    <div className="flex h-screen bg-[#F6F7F9]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setUserCollapsed((prev) => !prev)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar breadcrumb="Exams" onBack={hasResults || isProcessing ? handleReset : undefined} />



        {stage === 'idle' || stage === 'error' ? (
          <UploadStage
            questionFiles={questionFiles}
            answerFiles={answerFiles}
            onQuestionFilesChange={setQuestionFiles}
            onAnswerFilesChange={setAnswerFiles}
            onStart={handleStart}
            canStart={canStart}
            error={error}
          />
        ) : isProcessing ? (
          <LoadingStage stage={stage} />
        ) : (
          <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(300px,380px)_1fr]">
            <div className="border-b border-gray-200 md:border-b-0 md:border-r">
              <QuestionList
                questions={questions}
                mappings={mappings}
                grades={grades}
                unmatchedSegments={unmatchedSegments}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onShowSummary={() => setSummaryOpen(true)}
              />
            </div>
            <AnswerViewer pages={answerPages} segments={segments} mappings={mappings} questions={questions} selectedId={selectedId} />
          </div>
        )}
      </div>

      {summary && (
        <SummaryPanel summary={summary} grades={grades} questions={questions} open={summaryOpen} onClose={() => setSummaryOpen(false)} />
      )}
    </div>
  );
}
