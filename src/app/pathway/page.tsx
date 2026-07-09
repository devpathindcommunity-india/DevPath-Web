'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Trophy, Code, MapPin, Loader2, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: 'Technical Contributor' | 'City Lead';
  subRole: string;
  
  points: number; 
  monthlyPoints: number;
  lastUpdatedMonth: string;
  
  qualityPointsEarned: number;
  qualityPointsPossible: number;
  
  resourcesSubmitted: number;
  resourcesApproved: number;
  resourcesRejected: number;
  
  lastContributionDate: string;
  monthsActive: number;
  achievements: string[];
  remarks: string;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
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
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TeamMember);
        
        const validMembers = data.filter(m => m.name !== 'Application Pending' && m.name.trim() !== '');

        const tech = validMembers
          .filter(m => m.role === 'Technical Contributor')
          .sort((a, b) => (b.monthlyPoints || 0) - (a.monthlyPoints || 0));

        const city = validMembers
          .filter(m => m.role === 'City Lead')
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
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500/30 pb-24">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full " />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 blur-[120px] rounded-full " />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.01] mix-blend-overlay" />
      </div>

      <div className="relative z-10 pt-32 px-4 md:px-8">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-md"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">Monthly Leaderboards</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tighter leading-tight"
            >
              Recognizing our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">
                Top Contributors
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Celebrating the exceptional efforts of Technical Contributors and City Leads driving the DevPath Bharat community forward this month.
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
                iconColor="text-emerald-600"
                members={techContributors} 
                showMetrics={true}
              />
              <LeaderboardPanel 
                title="City Leads" 
                icon={MapPin} 
                iconColor="text-sky-600"
                members={cityLeads} 
                showMetrics={false}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function LeaderboardPanel({ title, icon: Icon, iconColor, members, showMetrics }: { title: string; icon: any; iconColor: string; members: TeamMember[], showMetrics: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-xl bg-slate-50 border border-slate-200 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      </div>

      {members.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-400">
          <Trophy className="w-12 h-12 mb-4 opacity-20" />
          <p>No participants ranked yet this month.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            {members.map((member, index) => {
              const quality = member.qualityPointsPossible ? Math.round((member.qualityPointsEarned / member.qualityPointsPossible) * 100) : 0;
              const approval = member.resourcesSubmitted ? Math.round((member.resourcesApproved / member.resourcesSubmitted) * 100) : 0;
              const isEligibleForPromotion = (member.monthlyPoints || 0) >= 500 && quality >= 90 && approval >= 90;

              return (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-8 pt-1 text-center font-bold text-xl ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-400'}`}>
                      #{index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 truncate">
                          <p className="font-bold text-slate-900 truncate text-lg">{member.name}</p>
                          {index === 0 && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full whitespace-nowrap hidden sm:inline-block">Contributor of the Month</span>}
                        </div>
                        <div className="text-right pl-4">
                          <p className="font-mono text-xl font-bold text-indigo-600">{member.monthlyPoints || 0} <span className="text-xs text-slate-400 font-sans">pts</span></p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-500 truncate mb-3">{member.subRole}</p>

                      {showMetrics && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs text-slate-600 font-medium">Quality: <span className="font-bold">{quality}%</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs text-slate-600 font-medium">Approval: <span className="font-bold">{approval}%</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                            <TrendingUp className={`w-3.5 h-3.5 ${isEligibleForPromotion ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <span className="text-xs text-slate-600 font-medium">Eligible: <span className={`font-bold ${isEligibleForPromotion ? 'text-indigo-600' : 'text-slate-500'}`}>{isEligibleForPromotion ? 'Yes' : 'No'}</span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
