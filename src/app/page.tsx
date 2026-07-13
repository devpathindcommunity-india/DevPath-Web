import Hero from '@/components/home/Hero';
import { SectionDivider } from '@/components/SectionDivider';
import { SectionEntrance } from '@/components/ui/SectionEntrance';
import { FloatingParticles } from '@/components/FloatingParticles';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieConsent from '@/components/CookieConsent';


const Sponsors = dynamic(() => import('@/components/home/Sponsors'));
const Mission = dynamic(() => import('@/components/home/Mission'));
const CodingNews = dynamic(() => import('@/components/home/CodingNews'));
const PastCollaborations = dynamic(
  () => import('@/components/home/PastCollaborations')
);

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-background">

        <Hero />
        <SectionDivider />

        <ErrorBoundary>
          <SectionEntrance>
            <Mission />
          </SectionEntrance>

          <SectionEntrance>
            <CodingNews />
          </SectionEntrance>

          <SectionEntrance>
            <PastCollaborations />
          </SectionEntrance>


          <SectionEntrance>
            <Sponsors />
          </SectionEntrance>
        </ErrorBoundary>

        {/* COOKIE CONSENT GLOBAL POPUP */}
        <CookieConsent />
      </main>
    </>
  );
}
