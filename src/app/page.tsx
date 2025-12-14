import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Community from '@/components/home/Community';
import Projects from '@/components/home/Projects';
import LearningPaths from '@/components/home/LearningPaths';
import Events from '@/components/home/Events';
import Leaderboard from '@/components/home/Leaderboard';
import Resources from '@/components/home/Resources';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Community />
      <Projects />
      <LearningPaths />
      <Events />
      <Leaderboard />
      <Resources />
    </main>
  );
}
