import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `License | ${siteConfig.name}`,
  description: `Repository License for ${siteConfig.name}`,
};

export default function LicensePage() {
  const licensePath = path.join(process.cwd(), 'LICENSE');
  let content = 'License file not found.';
  try {
    content = fs.readFileSync(licensePath, 'utf8');
  } catch (error) {
    console.error('Failed to read LICENSE:', error);
  }

  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold">License</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none rounded-lg border border-border bg-secondary/50 p-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </main>
  );
}
