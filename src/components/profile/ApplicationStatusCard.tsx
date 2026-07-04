'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserApplication } from '@/lib/applicationService';
import { CommunityApplication } from '@/types/application';
import { FileText, CheckCircle2, Clock, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApplicationStatusCard() {
  const { user } = useAuth() as any;
  const router = useRouter();
  const [application, setApplication] = useState<CommunityApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (user?.uid) {
        try {
          const app = await getUserApplication(user.uid);
          setApplication(app);
        } catch (error) {
          console.error("Error fetching application status:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchApp();
  }, [user]);

  if (loading) {
    return <div className="bg-card border border-border rounded-xl p-6 h-32 animate-pulse"></div>;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileText className="text-primary" size={20} /> My Application
        </h3>
        {!application && (
          <button onClick={() => router.push('/join')} className="text-sm px-4 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-medium">
            Apply Now
          </button>
        )}
      </div>

      {!application ? (
        <div className="text-center py-6">
          <p className="text-gray-400 mb-4">You haven't submitted a community application yet.</p>
          <button onClick={() => router.push('/join')} className="px-6 py-2 bg-primary text-white rounded-lg font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
            Start Application
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <div className="flex items-center gap-2 font-semibold text-lg">
                {application.status === 'Pending' && <><Clock className="text-yellow-500 w-5 h-5" /> <span className="text-yellow-500">Pending Review</span></>}
                {application.status === 'Approved' && <><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="text-green-500">Approved</span></>}
                {application.status === 'Rejected' && <><XCircle className="text-red-500 w-5 h-5" /> <span className="text-red-500">Rejected</span></>}
                {application.status === 'Need More Information' && <><AlertCircle className="text-orange-500 w-5 h-5" /> <span className="text-orange-500">Action Required</span></>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Submitted On</p>
              <p className="font-medium">
                {application.submittedAt?.seconds 
                  ? new Date(application.submittedAt.seconds * 1000).toLocaleDateString()
                  : 'Recently'}
              </p>
            </div>
          </div>

          {application.notes && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-semibold text-blue-400 mb-1">Reviewer Note:</p>
              <p className="text-sm text-gray-300">{application.notes}</p>
            </div>
          )}

          {application.communityRoles && application.communityRoles.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Applied Roles</p>
              <div className="flex flex-wrap gap-2">
                {application.communityRoles.map(role => (
                  <span key={role} className="px-3 py-1 bg-secondary text-xs rounded-md border border-border">{role}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
