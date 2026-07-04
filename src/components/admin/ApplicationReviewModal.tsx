'use client';

import React, { useState } from 'react';
import { CommunityApplication, ApplicationStatus } from '@/types/application';
import { updateApplicationStatus } from '@/lib/applicationService';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Props {
  application: CommunityApplication;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ApplicationReviewModal({ application, onClose, onUpdated }: Props) {
  const { user } = useAuth() as any;
  const [notes, setNotes] = useState(application.notes || '');
  const [processing, setProcessing] = useState(false);

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    setProcessing(true);
    try {
      await updateApplicationStatus(application.uid, status, notes, user.uid || user.email);

      // If approved, update the member's profile with roles and achievements
      if (status === 'Approved') {
        const memberRef = doc(db, 'members', application.uid);
        const rolesToAssign = application.communityRoles;
        
        await updateDoc(memberRef, {
          communityRole: rolesToAssign[0] || 'Member', // Set primary role to the first one applied for
          roles: arrayUnion(...rolesToAssign), // Add all to a roles array
        });
      }

      onUpdated();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update application status.');
    } finally {
      setProcessing(false);
    }
  };

  const renderSection = (title: string, data: Record<string, any>) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => {
          if (value === undefined || value === '' || value === false) return null;
          
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const isUrl = typeof value === 'string' && value.startsWith('http');
          
          return (
            <div key={key} className="bg-background p-3 rounded-lg border border-border">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              {isUrl ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline flex items-center gap-1">
                  View Link <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm font-medium">{value.toString()}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-border shadow-2xl animate-in zoom-in-95">
        
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold">Review Application</h2>
            <p className="text-sm text-gray-400">Applicant: {application.personalInfo.fullName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {renderSection('Personal Info', application.personalInfo)}
          {renderSection('Social Links', application.socialLinks)}
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Interests & Roles</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-2">Technology Interests</p>
                <div className="flex flex-wrap gap-2">
                  {application.interests.map(i => <span key={i} className="px-2 py-1 bg-secondary text-xs rounded border border-border">{i}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Applied Roles</p>
                <div className="flex flex-wrap gap-2">
                  {application.communityRoles.map(i => <span key={i} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded border border-primary/30 font-medium">{i}</span>)}
                </div>
              </div>
            </div>
          </div>

          {application.womenInTech?.isFemale && renderSection('Women in Tech', application.womenInTech)}
          {application.cityLead && renderSection('City Lead', application.cityLead)}
          {application.technicalContributor && renderSection('Technical Contributor', application.technicalContributor)}
          
          {renderSection('Final Notes', {
            whyJoinDevPath: application.whyJoinDevPath,
            anythingElse: application.anythingElse
          })}

          <div className="mt-8 border-t border-border pt-6">
            <h4 className="text-sm font-semibold mb-3">Admin Notes (Visible to applicant)</h4>
            <textarea 
              className="w-full p-3 rounded-lg bg-background border border-border outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="Enter reasons for rejection, or requests for more info..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex justify-between items-center">
          <p className="text-sm text-gray-400">Current Status: <strong className="text-foreground">{application.status}</strong></p>
          <div className="flex gap-2">
            <button 
              disabled={processing}
              onClick={() => handleUpdateStatus('Need More Information')}
              className="px-4 py-2 bg-orange-500/20 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-colors"
            >
              Request Info
            </button>
            <button 
              disabled={processing}
              onClick={() => handleUpdateStatus('Rejected')}
              className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors"
            >
              Reject
            </button>
            <button 
              disabled={processing}
              onClick={() => handleUpdateStatus('Approved')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-colors flex items-center shadow-lg shadow-green-500/20"
            >
              {processing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Approve
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
