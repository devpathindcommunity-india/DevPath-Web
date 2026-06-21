import React from 'react';
import OpportunityDashboard from '@/components/features/OpportunityDashboard';

export const metadata = {
  title: 'Opportunities Hub | DevPath',
  description:
    'Explore career opportunities, developer internships, and hackathons with deadline countdowns and dynamic bookmarking.',
};

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Heading banner */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Career & Developer{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-primary">
              Opportunities
            </span>
          </h1>
          <p className="text-slate-400 text-md max-w-2xl mx-auto leading-relaxed">
            Apply to top-tier internship openings, hackathons, and fellowship
            cohorts. Pin key dates and visualize live deadline countdowns below.
          </p>
        </div>

        {/* Dashboard Component */}
        <OpportunityDashboard />
      </div>
    </div>
  );
}
