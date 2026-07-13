'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Code, MapPin, Star, Shield, Users } from 'lucide-react';
import { teamMembers, TeamMember, TeamCategory } from '@/data/team';

// Utility for creating initials
const getInitials = (name: string) => {
  if (name === 'Application Pending') return '?';
  const parts = name.split(' ');
  return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
};

const RoleIcon = ({ category }: { category: TeamCategory }) => {
  switch (category) {
    case 'Founder':
      return <Star className="w-5 h-5 text-amber-400" />;
    case 'Core Leadership':
      return <Shield className="w-5 h-5 text-indigo-400" />;
    case 'Technical Lead':
      return <Code className="w-5 h-5 text-emerald-400" />;
    case 'City Lead':
      return <MapPin className="w-5 h-5 text-sky-400" />;
    default:
      return <Users className="w-5 h-5 text-slate-400" />;
  }
};

const SocialLink = ({ href, icon: Icon }: { href: string; icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 hover:text-white"
  >
    <Icon className="w-4 h-4" />
  </a>
);

const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const isPending = member.name === 'Application Pending';
  const delay = (index % 10) * 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative flex flex-col items-center bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04]"
    >
      {/* Background Glow */}
      <div className="absolute -inset-24 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" />

      {/* Avatar */}
      <div className="relative w-28 h-28 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
        <div className="relative w-full h-full rounded-full border-2 border-white/10 overflow-hidden bg-slate-800">
          {member.image && !isPending ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-white/50">
              {getInitials(member.name)}
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 rounded-full border border-white/10 shadow-xl shadow-black/50">
          <RoleIcon category={member.category} />
        </div>
      </div>

      {/* Details */}
      <div className="text-center z-10 w-full">
        <h3 className={`text-lg font-semibold tracking-tight ${isPending ? 'text-slate-400 italic' : 'text-white'}`}>
          {member.name}
        </h3>
        <p className="text-indigo-300 font-medium text-sm mt-1">{member.role}</p>
        {member.subRole && (
          <span className="inline-block mt-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-medium tracking-wide">
            {member.subRole}
          </span>
        )}
      </div>

      {/* Socials */}
      {!isPending && member.socials && (
        <div className="flex items-center gap-3 mt-6 z-10">
          {member.socials.github && <SocialLink href={member.socials.github} icon={Github} />}
          {member.socials.linkedin && <SocialLink href={member.socials.linkedin} icon={Linkedin} />}
          {member.socials.instagram && <SocialLink href={member.socials.instagram} icon={Instagram} />}
        </div>
      )}
    </motion.div>
  );
};

const Section = ({ title, description, members }: { title: string; description?: string; members: TeamMember[] }) => {
  if (members.length === 0) return null;

  return (
    <div className="py-16 md:py-24 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          >
            {title}
          </motion.h2>
          {description && (
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-slate-400 text-lg leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {members.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function NewTeamPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const founder = teamMembers.filter((m) => m.category === 'Founder');
  const coreLeadership = teamMembers.filter((m) => m.category === 'Core Leadership');
  const technicalLeads = teamMembers.filter((m) => m.category === 'Technical Lead');
  const cityLeads = teamMembers.filter((m) => m.category === 'City Lead');

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  return (
    <main className="min-h-screen bg-[#0A0A0B] selection:bg-indigo-500/30 overflow-hidden pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-sky-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">DevPath Bharat</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[1.1]"
          >
            Meet the minds <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
              behind the mission
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            A collective of passionate developers, leaders, and innovators dedicated to empowering the next generation of tech talent across Bharat.
          </motion.p>
        </div>
      </div>

      {/* Sections */}
      <div className="relative z-10">
        <Section 
          title="Founder" 
          description="The visionary guiding DevPath Bharat towards an inclusive and sustainable future."
          members={founder} 
        />
        <Section 
          title="Core Leadership" 
          description="Strategic drivers ensuring operational excellence and continuous growth across all domains."
          members={coreLeadership} 
        />
        <Section 
          title="Technical Leads" 
          description="Architects and mentors driving our technological infrastructure and engineering standards."
          members={technicalLeads} 
        />
        <Section 
          title="City Leads" 
          description="Regional leaders building thriving local developer communities across India."
          members={cityLeads} 
        />
      </div>
    </main>
  );
}
