import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `Code of Conduct | ${siteConfig.name}`,
  description: `Code of Conduct for ${siteConfig.name}`,
};

export default function ConductPage() {
  const conductPath = path.join(process.cwd(), 'CODE_OF_CONDUCT.md');
  let content = 'Code of Conduct file not found.';
  try {
    content = fs.readFileSync(conductPath, 'utf8');
  } catch (error) {
    console.error('Failed to read CODE_OF_CONDUCT.md:', error);
  }

  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold">Code of Conduct</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </main>
  );
}
