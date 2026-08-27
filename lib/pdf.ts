'use client';

import type { PageImage } from './types';

const RENDER_SCALE = 1.6; // balances legibility of handwriting vs. payload size
const MAX_DIMENSION = 1800; // longest edge, px — keeps per-page JPEGs well under ~1MB
const JPEG_QUALITY = 0.85;

function canvasToScaledJpeg(source: HTMLCanvasElement | HTMLImageElement, srcW: number, srcH: number) {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcW, srcH));
  const outW = Math.max(1, Math.round(srcW * scale));
  const outH = Math.max(1, Math.round(srcH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outW, outH);
  ctx.drawImage(source, 0, 0, outW, outH);

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  return { dataUrl, width: outW, height: outH };
}

async function fileToImagePage(file: File, pageOffset: number): Promise<PageImage> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = rawDataUrl;
  });

  const { dataUrl, width, height } = canvasToScaledJpeg(img, img.naturalWidth, img.naturalHeight);
  const base64 = dataUrl.split(',')[1];

  return {
    page: pageOffset + 1,
    dataUrl,
    base64,
    mimeType: 'image/jpeg',
    width,
    height
  };
}

async function pdfToImagePages(file: File, pageOffset: number): Promise<PageImage[]> {
  // Lazy-load pdfjs only when a PDF actually needs rendering, and point it at
  // the worker file that's copied into /public at build time.
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: PageImage[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });

    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = Math.ceil(viewport.width);
    renderCanvas.height = Math.ceil(viewport.height);
    const ctx = renderCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context while rendering PDF page');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const { dataUrl, width, height } = canvasToScaledJpeg(renderCanvas, renderCanvas.width, renderCanvas.height);
    const base64 = dataUrl.split(',')[1];

    pages.push({
      page: pageOffset + i,
      dataUrl,
      base64,
      mimeType: 'image/jpeg',
      width,
      height
    });
  }

  return pages;
}

/**
 * Accepts a list of uploaded files (PDFs and/or images, in the order the
 * teacher selected them) and flattens them into a single ordered list of
 * page images ready to send to the extraction API.
 */
export async function filesToPageImages(files: File[]): Promise<PageImage[]> {
  const allPages: PageImage[] = [];
  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pages = await pdfToImagePages(file, allPages.length);
      allPages.push(...pages);
    } else if (file.type.startsWith('image/')) {
      const page = await fileToImagePage(file, allPages.length);
      allPages.push(page);
    } else {
      throw new Error(`Unsupported file type: ${file.name} (${file.type || 'unknown'})`);
    }
  }
  return allPages;
}
