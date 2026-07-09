'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Users, 
  Plus, 
  Trash2, 
  Award, 
  KeyRound, 
  Cpu, 
  Activity, 
  Crown,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const ROLES = [
  'Founder & Community Lead',
  'Operations Lead (COO)',
  'Community & Inclusion Lead',
  'Women in Tech Lead',
  'Technology Lead (Discord Head)',
  'Learning & Programs Lead',
  'Marketing & Brand Lead',
  'Partnerships & Outreach Lead',
  'Growth & Analytics Lead',
  'City Leads (Network Head)'
];

interface TeamMember {
  id: string;
  name: string;
  role: 'Technical Contributor' | 'City Lead';
  subRole: string;
  
  points: number; // Lifetime Points
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

const POINTS_FRAMEWORK = {
  '1. Technical Learning Resources': [
    { label: 'High-quality tutorial/article', maxPoints: 20 },
    { label: 'Good technical resource', maxPoints: 15 },
    { label: 'Useful documentation/resource', maxPoints: 10 },
    { label: 'Beginner-friendly guide', maxPoints: 15 },
    { label: 'Cheat sheet/reference', maxPoints: 10 }
  ],
  '2. Open Source Contributions': [
    { label: 'High-quality GitHub repository', maxPoints: 20 },
    { label: 'Open-source contribution (PR/Merged)', maxPoints: 25 },
    { label: 'Useful developer tool', maxPoints: 20 },
    { label: 'Starter template/boilerplate', maxPoints: 15 }
  ],
  '3. Career Opportunities': [
    { label: 'Internship opportunity', maxPoints: 10 },
    { label: 'Job opportunity', maxPoints: 10 },
    { label: 'Hackathon', maxPoints: 15 },
    { label: 'Fellowship', maxPoints: 15 },
    { label: 'Scholarship', maxPoints: 15 },
    { label: 'Certification opportunity', maxPoints: 10 }
  ],
  '4. Community Support': [
    { label: 'Helping members solve technical issues', maxPoints: 10 },
    { label: 'Detailed explanation to a question', maxPoints: 15 },
    { label: 'Mentoring another member', maxPoints: 15 },
    { label: 'Conducting an AMA/Q&A session', maxPoints: 20 }
  ],
  '5. Educational Content': [
    { label: 'Original technical blog', maxPoints: 25 },
    { label: 'Original tutorial', maxPoints: 20 },
    { label: 'Project walkthrough', maxPoints: 20 },
    { label: 'System Design explanation', maxPoints: 20 },
    { label: 'AI/ML research summary', maxPoints: 20 },
    { label: 'Android/Web development guide', maxPoints: 20 }
  ],
  '6. DevPath Contributions': [
    { label: 'Creating documentation', maxPoints: 15 },
    { label: 'Improving GitHub repositories', maxPoints: 20 },
    { label: 'Suggesting valuable improvements', maxPoints: 10 },
    { label: 'Helping organize technical events', maxPoints: 20 },
    { label: 'Creating reusable technical resources', maxPoints: 20 }
  ],
  '7. Bonus Points': [
    { label: 'Resource gets exceptionally high engagement', maxPoints: 10 },
    { label: 'Featured by DevPath', maxPoints: 10 },
    { label: 'Exceptional quality contribution', maxPoints: 10 },
    { label: 'Multiple members report it as useful', maxPoints: 5 }
  ],
  '8. Penalties': [
    { label: 'Duplicate resource', maxPoints: 0 },
    { label: 'Incorrect information', maxPoints: -10 },
    { label: 'Misleading information', maxPoints: -15 },
    { label: 'Spam/irrelevant content', maxPoints: -20 },
    { label: 'AI-generated content without verification', maxPoints: -10 },
    { label: 'Plagiarized content', maxPoints: -25 },
    { label: 'Offensive/inappropriate content', maxPoints: -30 }
  ]
};

export default function AdminPage() {
  const [session, setSession] = useState<{ role: string; key: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('devpath_admin_session');
    if (stored) setSession(JSON.parse(stored));
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-100 blur-[150px] rounded-full " />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-100 blur-[150px] rounded-full " />
      </div>

      <div className="container mx-auto px-4 py-20 max-w-6xl relative z-10">
        <AnimatePresence mode="wait">
          {!session ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AdminLogin onLogin={(s) => { 
                setSession(s); 
                localStorage.setItem('devpath_admin_session', JSON.stringify(s)); 
              }} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <AdminDashboard 
                role={session.role} 
                onLogout={() => { 
                  setSession(null); 
                  localStorage.removeItem('devpath_admin_session'); 
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (s: { role: string; key: string }) => void }) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsScanning(true);

    try {
      const docRef = doc(db, 'admin_keys', selectedRole);
      const docSnap = await getDoc(docRef);
      
      await new Promise(r => setTimeout(r, 800));

      // Quick dev bypass or real check
      if ((docSnap.exists() && docSnap.data().key === keyInput) || keyInput === 'AKDP') {
        onLogin({ role: selectedRole, key: keyInput });
      } else {
        setError('ACCESS DENIED. INVALID CREDENTIALS.');
      }
    } catch (err: any) {
      console.error(err);
      setError('SYSTEM ERROR. UNABLE TO VERIFY CLEARANCE.');
    } finally {
      setLoading(false);
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 animate-pulse" />
        
        <div className="relative bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mb-6 border-2 border-cyan-200 relative"
            >
              <Cpu className="w-10 h-10 text-cyan-600" />
              {isScanning && (
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
              )}
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600 tracking-widest uppercase">
              LEADERSHIP COUNCIL
            </h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em] mt-3">
              Secure Terminal Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} /> Identity Designation
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-cyan-500 transform rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <KeyRound size={14} /> Security Clearance Key
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:text-slate-400"
                placeholder="ENTER SECURE KEY"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-600 text-xs font-mono uppercase bg-rose-50 border border-rose-200 p-3 rounded text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full group overflow-hidden rounded-lg disabled:opacity-50"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-4 py-3 font-mono text-sm uppercase tracking-widest text-white font-bold flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Activity className="w-4 h-4 animate-pulse" /> Verifying...
                  </>
                ) : (
                  'Authorize'
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ role, onLogout }: { role: string; onLogout: () => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'team_members'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
      setMembers(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load system architecture.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const isFounder = role === 'Founder & Community Lead';
  const isCoreAdmin = role === 'Operations Lead (COO)';
  const canManageAll = isFounder || isCoreAdmin;
  const canManageTech = canManageAll || role === 'Technology Lead (Discord Head)';
  const canManageCity = canManageAll || role === 'City Leads (Network Head)';

  return (
    <div className="space-y-8">
      {/* Header Dashboard */}
      <div className="relative overflow-hidden bg-white backdrop-blur-md border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-600 to-fuchsia-600" />
        
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {isFounder ? <Crown className="w-8 h-8 text-amber-500" /> : <Shield className="w-8 h-8 text-cyan-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">Core Terminal</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-500 text-sm font-mono">Logged in as: <span className="text-cyan-600 font-semibold">{role}</span></p>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="group flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-all font-mono text-sm uppercase tracking-wider"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Disconnect
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Activity className="w-10 h-10 text-slate-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-500 font-mono uppercase tracking-widest text-sm">Synchronizing Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {(canManageAll) && (
            <div className="w-full">
              <ManagementPanel members={members} onRefresh={fetchMembers} />
            </div>
          )}

          {canManageTech && (
            <PointsAssignmentPanel 
              title="Technical Contributors"
              members={members.filter(m => m.role === 'Technical Contributor')}
              onRefresh={fetchMembers}
            />
          )}

          {canManageCity && (
            <PointsAssignmentPanel 
              title="City Leads"
              members={members.filter(m => m.role === 'City Lead')}
              onRefresh={fetchMembers}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PointsAssignmentPanel({ title, members, onRefresh }: { title: string, members: TeamMember[], onRefresh: () => void }) {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('1. Technical Learning Resources');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [customPoints, setCustomPoints] = useState<number>(0);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setCustomPoints(selectedTask.maxPoints);
      if (selectedTask.maxPoints < 0) {
        setActionType('approve'); // Penalties are automatically applied
      }
    }
  }, [selectedTask]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedTask) return;
    
    setAssigning(true);
    try {
      const member = members.find(m => m.id === selectedMember);
      if (!member) throw new Error('Member not found');

      const isPenalty = selectedTask.maxPoints < 0;
      const isReject = actionType === 'reject';
      
      const ptsToAward = isReject ? 0 : customPoints;
      
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      const isNewMonth = member.lastUpdatedMonth !== currentMonthStr;

      const currentMonthlyPoints = isNewMonth ? 0 : (member.monthlyPoints || 0);
      const currentQualityEarned = isNewMonth ? 0 : (member.qualityPointsEarned || 0);
      const currentQualityPossible = isNewMonth ? 0 : (member.qualityPointsPossible || 0);
      const currentSubmits = isNewMonth ? 0 : (member.resourcesSubmitted || 0);
      const currentApproves = isNewMonth ? 0 : (member.resourcesApproved || 0);
      const currentRejects = isNewMonth ? 0 : (member.resourcesRejected || 0);

      const updates: any = {
        lastUpdatedMonth: currentMonthStr,
        lastContributionDate: new Date().toISOString()
      };

      if (isPenalty) {
        // Direct deduction
        updates.monthlyPoints = currentMonthlyPoints + ptsToAward;
        updates.points = (member.points || 0) + ptsToAward;
      } else {
        // Normal submission
        updates.resourcesSubmitted = currentSubmits + 1;
        
        if (isReject) {
          updates.resourcesRejected = currentRejects + 1;
        } else {
          updates.resourcesApproved = currentApproves + 1;
          updates.monthlyPoints = currentMonthlyPoints + ptsToAward;
          updates.points = (member.points || 0) + ptsToAward;
          updates.qualityPointsEarned = currentQualityEarned + ptsToAward;
          updates.qualityPointsPossible = currentQualityPossible + selectedTask.maxPoints;
        }
      }

      await updateDoc(doc(db, 'team_members', member.id), updates);
      
      if (isReject) alert(`[REJECTED] Submission marked rejected for ${member.name}.`);
      else if (isPenalty) alert(`[PENALTY] ${ptsToAward} EXP applied to ${member.name}.`);
      else alert(`[APPROVED] ${ptsToAward} EXP granted to ${member.name}.`);
      
      setSelectedMember('');
      setSelectedTask(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('[ERROR] Operation Failed.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-wider font-mono">
        <Award className="text-indigo-600" size={20} /> Evaluate {title}
      </h2>
      
      <form onSubmit={handleAssign} className="space-y-6">
        {/* Step 1: Member */}
        <div>
          <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">1. Target Identity</label>
          <select 
            value={selectedMember} 
            onChange={e => setSelectedMember(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 transition-colors"
            required
          >
            <option value="">-- Select Member --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} [{m.subRole}]</option>)}
          </select>
        </div>

        {/* Step 2: Category & Task */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">2. Contribution Category</label>
            <select 
              value={selectedCategory} 
              onChange={e => {
                setSelectedCategory(e.target.value);
                setSelectedTask(null);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 transition-colors"
            >
              {Object.keys(POINTS_FRAMEWORK).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">3. Specific Task</label>
            <select 
              value={selectedTask?.label || ''} 
              onChange={e => {
                const task = (POINTS_FRAMEWORK as any)[selectedCategory].find((t: any) => t.label === e.target.value);
                setSelectedTask(task);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-400 transition-colors"
              required
            >
              <option value="">-- Select Task --</option>
              {(POINTS_FRAMEWORK as any)[selectedCategory].map((task: any) => (
                <option key={task.label} value={task.label}>
                  {task.label} ({task.maxPoints > 0 ? '+' : ''}{task.maxPoints})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 3: Action & Points */}
        {selectedTask && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">Finalize Action</h3>
            
            {selectedTask.maxPoints > 0 ? (
              <>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${actionType === 'approve' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="action" checked={actionType === 'approve'} onChange={() => setActionType('approve')} className="hidden" />
                    <CheckCircle2 size={18} /> Approve
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${actionType === 'reject' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" name="action" checked={actionType === 'reject'} onChange={() => setActionType('reject')} className="hidden" />
                    <XCircle size={18} /> Reject
                  </label>
                </div>
                
                {actionType === 'approve' && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Points to Award (Max: {selectedTask.maxPoints})</label>
                    <input 
                      type="number" 
                      value={customPoints}
                      onChange={e => setCustomPoints(Number(e.target.value))}
                      max={selectedTask.maxPoints}
                      min={1}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 font-mono"
                    />
                    <p className="text-xs text-slate-400 mt-1 italic">Technical Leads may adjust points down based on quality.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-200">
                <AlertTriangle size={24} />
                <div>
                  <p className="font-bold">Applying Penalty</p>
                  <p className="text-sm">This will deduct {Math.abs(selectedTask.maxPoints)} points from the member.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={assigning || !selectedTask}
          className="w-full bg-indigo-600 text-white rounded-lg py-3.5 font-bold uppercase tracking-widest text-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors"
        >
          {assigning ? 'Processing...' : 'Execute Transaction'}
        </button>
      </form>
    </div>
  );
}

function ManagementPanel({ members, onRefresh }: { members: TeamMember[], onRefresh: () => void }) {
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Technical Contributor', subRole: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      await addDoc(collection(db, 'team_members'), {
        name: formData.name,
        role: formData.role,
        subRole: formData.subRole,
        points: 0,
        monthlyPoints: 0,
        qualityPointsEarned: 0,
        qualityPointsPossible: 0,
        resourcesSubmitted: 0,
        resourcesApproved: 0,
        resourcesRejected: 0,
        monthsActive: 0,
        lastUpdatedMonth: currentMonthStr,
        lastContributionDate: ''
      });
      setFormData({ name: '', role: 'Technical Contributor', subRole: '' });
      onRefresh();
    } catch (err) {
      alert('Failed to register identity.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('WARNING: Initiate irreversible deletion protocol for this identity?')) return;
    try {
      await deleteDoc(doc(db, 'team_members', id));
      onRefresh();
    } catch (err) {
      alert('Failed to terminate record.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest font-mono">
        <Users className="text-indigo-500" size={24} /> Network Registry
      </h2>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Identity Name" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors"
        />
        <select 
          value={formData.role} 
          onChange={e => setFormData({...formData, role: e.target.value})}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors"
        >
          <option value="Technical Contributor">Tech Contributor</option>
          <option value="City Lead">City Lead</option>
        </select>
        <input 
          type="text" 
          placeholder="Designation (e.g. AIML / Pune)" 
          required 
          value={formData.subRole} 
          onChange={e => setFormData({...formData, subRole: e.target.value})}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors"
        />
        <button 
          type="submit" 
          disabled={adding} 
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center gap-2 py-2.5 font-bold uppercase tracking-wider text-sm transition-all"
        >
          <Plus size={16} /> Register
        </button>
      </form>

      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-slate-50">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-slate-500 font-mono text-xs uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Identity</th>
              <th className="p-4">Classification</th>
              <th className="p-4">EXP</th>
              <th className="p-4">Quality %</th>
              <th className="p-4">Approval %</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map(m => {
              const quality = m.qualityPointsPossible ? Math.round((m.qualityPointsEarned / m.qualityPointsPossible) * 100) : 0;
              const approval = m.resourcesSubmitted ? Math.round((m.resourcesApproved / m.resourcesSubmitted) * 100) : 0;
              
              return (
                <tr key={m.id} className="hover:bg-white transition-colors">
                  <td className="p-4 font-semibold text-slate-800">
                    {m.name}
                    <div className="text-xs text-slate-400 font-normal">{m.subRole}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider border bg-slate-100 text-slate-600 border-slate-300">
                      {m.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-indigo-600">{m.points || 0}</td>
                  <td className="p-4 font-mono text-slate-600">{quality}%</td>
                  <td className="p-4 font-mono text-slate-600">{approval}%</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-rose-100 text-rose-500 rounded transition-colors" title="Terminate Record">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {members.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-mono uppercase tracking-widest text-xs">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
