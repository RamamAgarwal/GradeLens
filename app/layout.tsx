import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grade Lens - Answer Sheet Grader',
  description: 'Upload a question paper and a handwritten answer sheet to extract, map, and grade answers automatically.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
