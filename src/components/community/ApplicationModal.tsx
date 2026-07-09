import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, Send, User, Link as LinkIcon, Github, Code2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Artificial Intelligence',
  'Android',
  'Web Development',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'Programming',
  'Open Source',
  'Career & Placements',
  'Hackathons',
  'Learning Resources',
  'Tools & Productivity',
  'Other'
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    expertise: CATEGORIES[0],
    motivation: '',
    bestWork: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'technical_applications'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          email: '',
          linkedinUrl: '',
          githubUrl: '',
          expertise: CATEGORIES[0],
          motivation: '',
          bestWork: ''
        });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Application failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {success ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <Send size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Sent!</h2>
            <p className="text-slate-500 text-lg">Thank you for applying to be a Technical Contributor. The Leadership Council will review your profile shortly.</p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Technical Contributor Application</h2>
                <p className="text-sm text-slate-500 mt-1">Join the DevPath Bharat network and start leading.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><User size={16} className="text-indigo-500"/> Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><MessageSquare size={16} className="text-indigo-500"/> Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><LinkIcon size={16} className="text-indigo-500"/> LinkedIn URL</label>
                  <input
                    required
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Github size={16} className="text-indigo-500"/> GitHub URL</label>
                  <input
                    required
                    type="url"
                    value={formData.githubUrl}
                    onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Code2 size={16} className="text-indigo-500"/> Area of Expertise</label>
                <select
                  required
                  value={formData.expertise}
                  onChange={e => setFormData({...formData, expertise: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Why do you want to join DevPath Bharat as a Technical Contributor?</label>
                <textarea
                  required
                  rows={3}
                  value={formData.motivation}
                  onChange={e => setFormData({...formData, motivation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="Share your motivation..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Links to your best work (Projects, Articles, PRs)</label>
                <textarea
                  required
                  rows={3}
                  value={formData.bestWork}
                  onChange={e => setFormData({...formData, bestWork: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                  placeholder="Paste links here..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'} <Send size={20} />
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
