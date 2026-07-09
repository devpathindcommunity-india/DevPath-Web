'use client';

import { useState } from 'react';
import { Share2, CheckCircle2, Link as LinkIcon, BookOpen, Users, Presentation, Terminal, Shield, Lightbulb, CheckSquare, Award } from 'lucide-react';
import ApplicationModal from '@/components/community/ApplicationModal';

const tasks = [
  {
    icon: <BookOpen className="text-blue-500" size={24} />,
    title: "1. Technical Learning Resources",
    description: "Write articles, tutorials, or share verified learning materials. All resources must be shared in the official Technical Contributors WhatsApp group to be logged and reviewed for points."
  },
  {
    icon: <Users className="text-emerald-500" size={24} />,
    title: "2. Mentorship & Support",
    description: "Actively mentor junior developers in the community, answer technical queries, and guide them through complex bugs."
  },
  {
    icon: <Presentation className="text-purple-500" size={24} />,
    title: "3. Event Organization & Speaking",
    description: "Host technical workshops, seminars, or speak at community-led events to share your expertise."
  },
  {
    icon: <Terminal className="text-amber-500" size={24} />,
    title: "4. Open Source & Projects",
    description: "Contribute code to official DevPath repositories or guide the community in building open-source projects."
  },
  {
    icon: <Shield className="text-rose-500" size={24} />,
    title: "5. System Admin & Tech Infrastructure",
    description: "Help maintain the community's digital infrastructure, Discord servers, and technical operations."
  },
  {
    icon: <Lightbulb className="text-cyan-500" size={24} />,
    title: "6. Innovation & Research",
    description: "Research new technologies and build proof-of-concepts that can benefit the DevPath Bharat network."
  },
  {
    icon: <CheckSquare className="text-indigo-500" size={24} />,
    title: "7. Quality Assurance (QA)",
    description: "Test community projects, report bugs, and ensure the quality of resources shared by others."
  },
  {
    icon: <Award className="text-fuchsia-500" size={24} />,
    title: "8. Miscellaneous & Spot Awards",
    description: "Exceptional ad-hoc contributions recognized directly by the Leadership Council."
  }
];

export default function ApplyPage() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://devpath-website.web.app/apply');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Become a <span className="text-indigo-600">Technical Contributor</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Join the elite technical network of DevPath Bharat. Share your expertise, mentor the next generation, and climb the ranks through our merit-based points system.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Apply Now
            </button>
            <button
              onClick={handleCopyLink}
              className="px-6 py-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
            >
              {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Share2 size={20} />}
              {copied ? 'Link Copied!' : 'Copy Invite Link'}
            </button>
          </div>
        </div>

        {/* WhatsApp Group Notice */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 mb-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-indigo-900 mb-3">How to Earn Points</h2>
          <p className="text-indigo-700 mb-6 max-w-2xl mx-auto">
            Once accepted, all Technical Contributors must share their verified resources, tutorials, and proof of work in our official WhatsApp group to be logged by the Leadership Council and earn points.
          </p>
          <a
            href="https://chat.whatsapp.com/DZYIBdbyBZhCIFdsLTymLN"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
          >
            <LinkIcon size={18} /> Join the Official WhatsApp Group
          </a>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
            Contributor Framework & Tasks
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tasks.map((task, idx) => (
              <div key={idx} className="flex gap-4 items-start group">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
                  {task.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{task.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ApplicationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
