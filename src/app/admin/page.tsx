'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Shield, LogOut, Users, Plus, Trash2, Award } from 'lucide-react';

const ROLES = [
  'Founder',
  'Core Admin',
  'Technical Lead',
  'City Leads Manager',
  'Operations Lead',
  'Community Lead',
  'Learning Lead',
  'Marketing & Creative Lead',
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
    <div className="min-h-screen bg-surface-deep text-slate-200">
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        {!session ? (
          <AdminLogin onLogin={(s) => { setSession(s); localStorage.setItem('devpath_admin_session', JSON.stringify(s)); }} />
        ) : (
          <AdminDashboard 
            role={session.role} 
            onLogout={() => { setSession(null); localStorage.removeItem('devpath_admin_session'); }} 
          />
        )}
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (s: { role: string; key: string }) => void }) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const docRef = doc(db, 'admin_keys', selectedRole);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().key === keyInput) {
        onLogin({ role: selectedRole, key: keyInput });
      } else {
        setError('Invalid role or access key.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to verify key. Check connection and permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-surface-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 border border-indigo-500/30">
          <Shield className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
        <p className="text-slate-400 text-sm mt-2">Sign in using your role and secure key.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Secure Key</label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Enter your key..."
          />
        </div>

        {error && <p className="text-rose-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold transition-colors"
        >
          {loading ? 'Verifying...' : 'Authenticate'}
        </button>
      </form>
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
      alert('Failed to load members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const canManageAll = role === 'Founder' || role === 'Core Admin';
  const canManageTech = canManageAll || role === 'Technical Lead';
  const canManageCity = canManageAll || role === 'City Leads Manager';

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-dark border border-white/10 rounded-2xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Logged in as: <span className="text-indigo-400 font-semibold">{role}</span></p>
        </div>
        <button 
          onClick={onLogout}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 rounded-xl transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading directory...</div>
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
  const [points, setPoints] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !points) return;
    
    setAssigning(true);
    try {
      const member = members.find(m => m.id === selectedMember);
      if (!member) throw new Error('Member not found');

      const pts = parseInt(points, 10);
      if (isNaN(pts)) throw new Error('Invalid points');

      const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
      let newMonthly = member.monthlyPoints || 0;
      
      // Monthly Reset Logic
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
      
      alert(`Successfully added ${pts} points to ${member.name}!`);
      setPoints('');
      setSelectedMember('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to assign points.');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Award className="text-emerald-400" size={20} /> Assign Points: {title}
      </h2>
      
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">Select Member</label>
          <select 
            value={selectedMember} 
            onChange={e => setSelectedMember(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
            required
          >
            <option value="">-- Select --</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.subRole})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">Points to Add</label>
          <input 
            type="number" 
            value={points} 
            onChange={e => setPoints(e.target.value)} 
            placeholder="e.g. 50"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={assigning}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 font-medium disabled:opacity-50 transition-colors"
        >
          {assigning ? 'Assigning...' : 'Grant Points'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Current Leaderboard</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {[...members].sort((a,b) => (b.monthlyPoints || 0) - (a.monthlyPoints || 0)).map(m => (
            <div key={m.id} className="flex justify-between items-center text-sm p-2 rounded bg-white/5">
              <span>{m.name}</span>
              <span className="text-emerald-400 font-mono">{m.monthlyPoints || 0} pts (Mo)</span>
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
      alert('Failed to add member.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await deleteDoc(doc(db, 'team_members', id));
      onRefresh();
    } catch (err) {
      alert('Failed to delete member.');
    }
  };

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="text-indigo-400" size={20} /> Directory Management
      </h2>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Name" 
          required 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
        />
        <select 
          value={formData.role} 
          onChange={e => setFormData({...formData, role: e.target.value})}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="Technical Contributor">Tech Contributor</option>
          <option value="City Lead">City Lead</option>
        </select>
        <input 
          type="text" 
          placeholder="Domain / City (SubRole)" 
          required 
          value={formData.subRole} 
          onChange={e => setFormData({...formData, subRole: e.target.value})}
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
        />
        <button type="submit" disabled={adding} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 py-2">
          <Plus size={16} /> Add 
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400">
            <tr>
              <th className="p-3 rounded-tl-lg">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Domain/City</th>
              <th className="p-3">Total Pts</th>
              <th className="p-3 text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3 font-medium text-white">{m.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${m.role === 'City Lead' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {m.role}
                  </span>
                </td>
                <td className="p-3">{m.subRole}</td>
                <td className="p-3 font-mono">{m.points || 0}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-rose-500/20 text-rose-400 rounded transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">No members found. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
