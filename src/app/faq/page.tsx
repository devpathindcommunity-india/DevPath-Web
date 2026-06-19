import {
  HelpCircle,
  ChevronDown,
  Trophy,
  Users,
  Award,
  Calendar,
  Github,
  BookOpen,
} from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { MagneticText } from '@/components/ui/magnetic-text';

const faqCategories = [
  {
    title: 'About DevPath',
    icon: HelpCircle,
    questions: [
      {
        question: 'What is DevPath?',
        answer:
          'DevPath is the complete ecosystem for ambitious developers. It combines structured learning pathways, real-world projects, community collaboration, open source contributions, events, and a rewarding gamified experience to accelerate your career.',
      },
      {
        question: 'Is DevPath free to use?',
        answer:
          'Yes. Core features including learning resources, pathways, community access, and basic rewards are completely free. Premium physical rewards and advanced mentorships require Dev Points earned through participation.',
      },
      {
        question: 'Do you have mobile apps?',
        answer:
          'Yes! DevPath is available on both iOS and Android. Track your progress, join discussions, and participate in events on the go.',
      },
    ],
  },
  {
    title: 'Pathway & Progression',
    icon: Trophy,
    questions: [
      {
        question: 'What is the DevPath Pathway?',
        answer:
          'The DevPath Pathway is our gamified learning journey. You earn Dev Points, climb ranks (Shishya → Abhyasi → Sanrakshak), and progress through structured roadmaps from foundations to advanced full-stack and specialized domains.',
      },
      {
        question: 'How does the ranking and leaderboard work?',
        answer:
          'You earn points through daily logins, streaks, project submissions, community contributions, hackathon wins, and more. The leaderboard showcases top developers. Higher ranks unlock better rewards and recognition.',
      },
      {
        question: 'What are the different ranks?',
        answer:
          'Ranks include Shishya (beginner), Abhyasi (intermediate), and Sanrakshak (ultimate stewardship role). Each rank represents your growth and commitment in the DevPath ecosystem.',
      },
    ],
  },
  {
    title: 'Rewards & Points',
    icon: Award,
    questions: [
      {
        question: 'How can I earn Dev Points?',
        answer:
          'Points are earned via daily login streaks, community engagement, project submissions, event participation, hackathon wins, gaining followers, and more.',
      },
      {
        question: 'What rewards can I redeem?',
        answer:
          'You can redeem points for digital rewards (certificates, badges, roadmaps, mentorship) and physical items like sticker packs, T-shirts, coffee cups, mouse pads, backpacks, and premium hardware.',
      },
      {
        question: 'What is Community Spotlight and Verified Builder Badge?',
        answer:
          'These are prestigious rewards for outstanding contributors and project builders. They showcase your work and boost your credibility in the community.',
      },
    ],
  },
  {
    title: 'Events & Opportunities',
    icon: Calendar,
    questions: [
      {
        question: 'What is HackFiesta?',
        answer:
          'HackFiesta is our flagship hackathon. Participants receive official certificates that can be instantly downloaded after verification.',
      },
      {
        question: 'How does the Internship Calendar work?',
        answer:
          'The 2026 Internship Calendar helps you track upcoming opportunities, application deadlines, and eligibility criteria from top tech companies.',
      },
    ],
  },
  {
    title: 'Resources & Learning',
    icon: BookOpen,
    questions: [
      {
        question: 'Where can I find roadmaps and learning materials?',
        answer:
          'Visit the Resources section for curated roadmaps (Frontend, Backend, Full Stack, ML & AI, DevOps, etc.), practice sets, notes, and guided projects.',
      },
      {
        question: 'What domains are covered?',
        answer:
          'We cover Frontend, Backend, Full Stack, DevOps, Machine Learning & AI, System Design, and more. All roadmaps are regularly updated.',
      },
    ],
  },
  {
    title: 'Community & Open Source',
    icon: Users,
    questions: [
      {
        question: 'How can I join the community?',
        answer:
          'Go to the Community Hub to participate in discussions, showcase projects, connect with 500+ active developers, and collaborate.',
      },
      {
        question: 'How can I contribute to DevPath?',
        answer:
          'Connect your GitHub account and contribute to our website, CLI tools, learning resources, or documentation. Top contributors get featured and rewarded.',
      },
      {
        question: 'What are the major open source platforms supported?',
        answer:
          'We support GitHub, GitLab, and Bitbucket. You can connect any of these accounts to showcase your contributions.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-16">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl">
              <HelpCircle size={56} />
            </div>
          </div>
          <MagneticText
            text="Frequently Asked Questions"
            hoverText="FAQ"
            className="text-5xl md:text-6xl font-bold tracking-tighter mb-4"
          />
          <p className="text-xl text-gray-400 max-w-md mx-auto">
            Everything you need to know about the DevPath ecosystem
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex}>
              <div className="flex items-center gap-4 mb-8">
                <category.icon className="w-8 h-8 text-cyan-500" />
                <h2 className="text-3xl font-semibold tracking-tight">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-[#12121a] border border-gray-800 hover:border-cyan-500/30 rounded-3xl transition-all duration-200"
                  >
                    <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                      <h3 className="text-xl font-medium pr-8 text-left">
                        {faq.question}
                      </h3>
                      <ChevronDown className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-8 pb-8 text-gray-400 leading-relaxed text-[17px]">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-20 text-center bg-[#12121a] border border-gray-800 rounded-3xl p-12">
          <h3 className="text-3xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Our community and support team are ready to help you on your DevPath
            journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-2xl font-medium transition-all"
            >
              Email Support
            </a>
            <a
              href="/community"
              className="inline-flex items-center justify-center gap-3 border border-gray-700 hover:border-white px-10 py-4 rounded-2xl font-medium transition-all"
            >
              <Users size={20} />
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
