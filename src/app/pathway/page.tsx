'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Trophy, Code, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: 'Technical Contributor' | 'City Lead';
  subRole: string;
  points: number;
  monthlyPoints: number;
  lastUpdatedMonth: string;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

export default function PathwayPage() {
  const [techContributors, setTechContributors] = useState<TeamMember[]>([]);
  const [cityLeads, setCityLeads] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'team_members'));
        const data = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as TeamMember
        );

        // Filter out placeholders
        const validMembers = data.filter(
          (m) => m.name !== 'Application Pending' && m.name.trim() !== ''
        );

        // We sort by monthlyPoints descending
        const tech = validMembers
          .filter((m) => m.role === 'Technical Contributor')
          .sort((a, b) => (b.monthlyPoints || 0) - (a.monthlyPoints || 0));

        const city = validMembers
          .filter((m) => m.role === 'City Lead')
          .sort((a, b) => (b.monthlyPoints || 0) - (a.monthlyPoints || 0));

        setTechContributors(tech);
        setCityLeads(city);
      } catch (error) {
        console.error('Error fetching leaderboards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 selection:bg-indigo-500/30 pb-24">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 pt-32 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">
                Monthly Leaderboards
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-tight"
            >
              Recognizing our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Top Contributors
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Celebrating the exceptional efforts of Technical Contributors and
              City Leads driving the DevPath Bharat community forward this
              month.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-indigo-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p>Loading leaderboards...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <LeaderboardPanel
                title="Technical Contributors"
                icon={Code}
                iconColor="text-emerald-400"
                members={techContributors}
              />
              <LeaderboardPanel
                title="City Leads"
                icon={MapPin}
                iconColor="text-sky-400"
                members={cityLeads}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaderboardPanel({
  title,
  icon: Icon,
  iconColor,
  members,
}: {
  title: string;
  icon: any;
  iconColor: string;
  members: TeamMember[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 md:p-8 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`p-3 rounded-xl bg-white/5 border border-white/10 ${iconColor}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      {members.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-500">
          <Trophy className="w-12 h-12 mb-4 opacity-20" />
          <p>No participants ranked yet this month.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-white/10">
            <div className="w-8 text-center">Rank</div>
            <div>Contributor</div>
            <div className="text-right">Monthly Pts</div>
          </div>

          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex items-center gap-4 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-colors"
              >
                <div
                  className={`w-8 text-center font-bold text-lg ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-600'}`}
                >
                  {index + 1}
                </div>

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-indigo-200">
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {member.subRole}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-indigo-300">
                    {member.monthlyPoints || 0}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Total: {member.points || 0}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
