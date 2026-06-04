import Hero from '@/components/home/Hero';
import { SectionDivider } from '@/components/SectionDivider';
import { SectionEntrance } from '@/components/ui/SectionEntrance';
import { FloatingParticles } from '@/components/FloatingParticles';
import dynamic from 'next/dynamic';
import BackToTop from '@/components/BackToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import NextBestActionWidget from '@/components/NextBestActionWidget';
const Sponsors = dynamic(() => import('@/components/home/Sponsors'));
const Mission = dynamic(() => import('@/components/home/Mission'));
const CodingNews = dynamic(() => import('@/components/home/CodingNews'));
const PastCollaborations = dynamic(() => import('@/components/home/PastCollaborations'));
export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <FloatingParticles />
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <NextBestActionWidget />
        </div>
        <Hero />
        <SectionDivider />
        <ErrorBoundary>
          <SectionEntrance>
            <Sponsors />
          </SectionEntrance>
          <SectionEntrance>
            <Mission />
          </SectionEntrance>
          <SectionEntrance>
            <CodingNews />
          </SectionEntrance>
          <SectionEntrance>
            <PastCollaborations />
          </SectionEntrance>
        </ErrorBoundary>
        <BackToTop />
      </main>
    </>
  );
}
