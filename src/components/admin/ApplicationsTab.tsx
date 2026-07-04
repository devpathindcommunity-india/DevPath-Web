'use client';

import React, { useState, useEffect } from 'react';
import { CommunityApplication } from '@/types/application';
import { getAllApplications } from '@/lib/applicationService';
import { Loader2, Search, Filter } from 'lucide-react';
import ApplicationReviewModal from './ApplicationReviewModal';

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<CommunityApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  const [selectedApp, setSelectedApp] = useState<CommunityApplication | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.personalInfo.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.personalInfo.discordUsername.toLowerCase().includes(search.toLowerCase()) ||
      app.personalInfo.collegeOrCompany.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Community Applications</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search name, discord..." 
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm w-full sm:w-64 outline-none focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative flex items-center">
            <Filter className="absolute left-3 text-gray-400 w-4 h-4" />
            <select 
              className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm appearance-none outline-none focus:border-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Need More Information">Action Required</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Applicant</th>
                <th className="px-4 py-3">Roles Applied</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredApps.map(app => (
                <tr key={app.applicationId} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{app.personalInfo.fullName}</p>
                    <p className="text-xs text-gray-400">@{app.personalInfo.discordUsername}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {app.communityRoles.slice(0, 2).map(r => (
                        <span key={r} className="px-2 py-0.5 bg-background border border-border rounded text-[10px] truncate">{r}</span>
                      ))}
                      {app.communityRoles.length > 2 && <span className="px-2 py-0.5 bg-background border border-border rounded text-[10px]">+{app.communityRoles.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {app.personalInfo.city}, {app.personalInfo.state}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {app.submittedAt?.seconds ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                      app.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                      app.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedApp && (
        <ApplicationReviewModal 
          application={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          onUpdated={() => {
            setSelectedApp(null);
            fetchApps();
          }} 
        />
      )}
    </div>
  );
}
