import ApplicationForm from '@/components/application/ApplicationForm';
import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `Join Community | ${siteConfig.name}`,
  description: `Apply to join the DevPath Bharat community, become a contributor, mentor, or city lead.`,
};

export default function JoinPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Join DevPath Bharat
          </h1>
          <p className="text-gray-400 text-lg">
            Apply to become part of our growing community of developers.
          </p>
        </div>
        
        <ApplicationForm />
      </div>
    </main>
  );
}
