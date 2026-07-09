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
  Crown 
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
  points: number;
  monthlyPoints: number;
  lastUpdatedMonth: string;
}

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
    <div className="min-h-screen bg-[#050505] text-slate-800 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Global Futuristic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full " />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full " />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
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
      
      // Simulate a brief "scanning" delay for the high-tech feel
      await new Promise(r => setTimeout(r, 800));

      if (docSnap.exists() && docSnap.data().key === keyInput) {
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
        {/* Animated Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse" />
        
        <div className="relative bg-slate-50/90 backdrop-blur-2xl border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              animate={isScanning ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-6 border-2 border-cyan-300 relative"
            >
              <Cpu className="w-10 h-10 text-cyan-600" />
              {isScanning && (
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
              )}
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600 tracking-widest uppercase">
              LEADERSHIP COUNCIL
            </h1>
            <p className="text-slate-9000/70 text-xs font-mono uppercase tracking-[0.3em] mt-3">
              Secure Terminal Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-600 uppercase tracking-wider flex items-center gap-2">
                <Users size={14} /> Identity Designation
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
                >
                  {ROLES.map(r => <option key={r} value={r} className="bg-slate-50">{r}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <div className="w-2 h-2 border-r-2 border-b-2 border-cyan-500 transform rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-cyan-600 uppercase tracking-wider flex items-center gap-2">
                <KeyRound size={14} /> Security Clearance Key
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:text-slate-400"
                placeholder="ENTER SECURE KEY"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="text-rose-500 text-xs font-mono uppercase bg-rose-500/10 border border-rose-500/20 p-3 rounded text-center"
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
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative px-4 py-3 font-mono text-sm uppercase tracking-widest text-slate-900 font-bold flex items-center justify-center gap-2">
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
      <div className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-600 to-fuchsia-600" />
        
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            {isFounder ? <Crown className="w-8 h-8 text-amber-400" /> : <Shield className="w-8 h-8 text-cyan-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">Core Terminal</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-slate-500 text-sm font-mono">Logged in as: <span className="text-cyan-600 font-semibold">{role}</span></p>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="group flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/50 rounded-xl transition-all font-mono text-sm uppercase tracking-wider"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Disconnect
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Activity className="w-10 h-10 text-slate-9000 animate-pulse mx-auto mb-4" />
          <p className="text-slate-9000/60 font-mono uppercase tracking-widest text-sm">Synchronizing Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(canManageAll) && (
            <div className="lg:col-span-2">
              <ManagementPanel members={members} onRefresh={fetchMembers} />
            </div>
          )}

          {canManageTech && (
            <PointsAssignmentPanel 
              title="Technical Contributors"
              colorTheme="emerald"
              members={members.filter(m => m.role === 'Technical Contributor')}
              onRefresh={fetchMembers}
            />
          )}

          {canManageCity && (
            <PointsAssignmentPanel 
              title="City Leads"
              colorTheme="sky"
              members={members.filter(m => m.role === 'City Lead')}
              onRefresh={fetchMembers}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PointsAssignmentPanel({ title, colorTheme, members, onRefresh }: { title: string, colorTheme: 'emerald' | 'sky', members: TeamMember[], onRefresh: () => void }) {
  const [selectedMember, setSelectedMember] = useState('');
  const [points, setPoints] = useState('');
  const [assigning, setAssigning] = useState(false);

  const colors = {
    emerald: 'text-emerald-600 border-emerald-500/30 bg-emerald-50 focus:border-emerald-400 focus:ring-emerald-400/50 hover:bg-emerald-500/20 from-emerald-600 to-teal-600',
    sky: 'text-sky-400 border-sky-500/30 bg-sky-500/10 focus:border-sky-400 focus:ring-sky-400/50 hover:bg-sky-500/20 from-sky-600 to-blue-600'
  };
  const theme = colorTheme === 'emerald' ? colors.emerald : colors.sky;
  const textColor = colorTheme === 'emerald' ? 'text-emerald-600' : 'text-sky-400';
  const btnGradient = colorTheme === 'emerald' ? 'from-emerald-600 to-teal-600' : 'from-sky-600 to-blue-600';

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !points) return;
    
    setAssigning(true);
    try {
      const member = members.find(m => m.id === selectedMember);
      if (!member) throw new Error('Member not found');

      const pts = parseInt(points, 10);
      if (isNaN(pts)) throw new Error('Invalid points');

      const currentMonthStr = new Date().toISOString().slice(0, 7);
      let newMonthly = member.monthlyPoints || 0;
      
      if (member.lastUpdatedMonth !== currentMonthStr) {
        newMonthly = 0;
      }
      
      newMonthly += pts;
      const newTotal = (member.points || 0) + pts;

      await updateDoc(doc(db, 'team_members', member.id), {
        points: newTotal,
        monthlyPoints: newMonthly,
        lastUpdatedMonth: currentMonthStr
      });
      
      alert(`[SUCCESS] ${pts} EXP granted to ${member.name}.`);
      setPoints('');
      setSelectedMember('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('[ERROR] Operation Failed.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md border border-slate-200 rounded-2xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-gradient-to-br ${btnGradient} pointer-events-none`} />
      
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-wider font-mono">
        <Award className={textColor} size={20} /> Evaluate {title}
      </h2>
      
      <form onSubmit={handleAssign} className="space-y-5 relative z-10">
        <div>
          <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">Target Identity</label>
          <select 
            value={selectedMember} 
            onChange={e => setSelectedMember(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-white/30 transition-colors font-sans"
            required
          >
            <option value="" className="bg-slate-50">-- Select Subject --</option>
            {members.map(m => <option key={m.id} value={m.id} className="bg-slate-50">{m.name} [{m.subRole}]</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 mb-2 uppercase">EXP Value</label>
          <input 
            type="number" 
            value={points} 
            onChange={e => setPoints(e.target.value)} 
            placeholder="e.g. 50"
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-white/30 transition-colors font-mono"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={assigning}
          className={`w-full bg-gradient-to-r ${btnGradient} text-slate-900 rounded-lg py-3 font-bold uppercase tracking-widest text-sm disabled:opacity-50 hover:brightness-110 transition-all`}
        >
          {assigning ? 'Processing...' : 'Execute Protocol'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-200 relative z-10">
        <h3 className="text-xs font-mono text-slate-500 mb-4 uppercase tracking-widest">Active Leaderboard (Monthly)</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {[...members].sort((a,b) => (b.monthlyPoints || 0) - (a.monthlyPoints || 0)).map(m => (
            <div key={m.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
              <span className="font-medium text-slate-800">{m.name}</span>
              <span className={`font-mono font-bold ${textColor}`}>{m.monthlyPoints || 0}</span>
            </div>
          ))}
        </div>
      </div>
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
        lastUpdatedMonth: currentMonthStr
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
    <div className="bg-black/40 backdrop-blur-md border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 bg-indigo-500 pointer-events-none" />

      <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest font-mono">
        <Users className="text-indigo-400" size={24} /> Network Registry
      </h2>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 relative z-10">
        <input 
          type="text" 
          placeholder="Identity Name" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors placeholder:text-slate-400"
        />
        <select 
          value={formData.role} 
          onChange={e => setFormData({...formData, role: e.target.value})}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors"
        >
          <option value="Technical Contributor" className="bg-slate-50">Tech Contributor</option>
          <option value="City Lead" className="bg-slate-50">City Lead</option>
        </select>
        <input 
          type="text" 
          placeholder="Designation (e.g. AIML / Pune)" 
          required 
          value={formData.subRole} 
          onChange={e => setFormData({...formData, subRole: e.target.value})}
          className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:border-indigo-500 transition-colors placeholder:text-slate-400"
        />
        <button 
          type="submit" 
          disabled={adding} 
          className="bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-slate-900 border border-indigo-500/30 rounded-lg flex items-center justify-center gap-2 py-2.5 font-bold uppercase tracking-wider text-sm transition-all"
        >
          <Plus size={16} /> Register
        </button>
      </form>

      <div className="overflow-x-auto relative z-10 border border-slate-200 rounded-xl bg-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-slate-500 font-mono text-xs uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Identity</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Total EXP</th>
              <th className="p-4 text-right">Sys Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-slate-800">{m.name}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider border ${m.role === 'City Lead' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                    {m.role}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{m.subRole}</td>
                <td className="p-4 font-mono font-bold text-indigo-300">{m.points || 0}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-rose-500/20 text-rose-500 rounded transition-colors" title="Terminate Record">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-600 font-mono uppercase tracking-widest text-xs">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
