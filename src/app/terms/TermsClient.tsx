'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'eligibility', title: '1. Eligibility' },
  { id: 'responsibilities', title: '2. User Responsibilities & Acceptable Use' },
  { id: 'accounts', title: '3. Accounts & Service Usage' },
  { id: 'intellectual-property', title: '4. Intellectual Property & Content Ownership' },
  { id: 'third-party', title: '5. Third-Party Services & Links' },
  { id: 'disclaimer', title: '6. Disclaimer of Warranties' },
  { id: 'liability', title: '7. Limitation of Liability' },
  { id: 'indemnification', title: '8. Indemnification' },
  { id: 'suspension', title: '9. Suspension & Termination' },
  { id: 'service-changes', title: '10. Changes to the Service' },
  { id: 'terms-changes', title: '11. Changes to These Terms' },
  { id: 'governing-law', title: '12. Governing Law' },
];

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState('eligibility');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -70% 0px', // active when section passes upper-middle viewport
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // safe clearance for top sticky nav + mobile bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Sticky Section Navigator */}
      <div className="sticky top-16 z-30 lg:hidden w-full bg-background/95 backdrop-blur-md border-b border-border/50 py-3 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Section
          </span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-secondary text-secondary-foreground rounded-md border border-border/50 hover:bg-secondary/80 transition-colors"
            >
              <span>
                {SECTIONS.find((s) => s.id === activeSection)?.title.split('. ')[1] || 'Select Section'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto rounded-lg border border-border bg-popover p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        scrollTo(section.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`block w-full text-left text-xs px-3 py-2.5 rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 md:pb-24">
        {/* Header */}
        <header className="border-b border-border/50 pb-10 mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
              Community Agreement
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs font-medium">8 min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
            Terms & <span className="text-primary">Conditions</span>
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Last Updated: June 4, 2026
          </p>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
            These Terms & Conditions ("Terms") govern your access to and use of
            DevPath, including our website, applications, content,
            documentation, and related services (collectively, the "Platform").
            By accessing or using the Platform, you agree to be bound by these
            Terms. If you do not agree to these Terms, you must not use the
            Platform.
          </p>
        </header>

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Table of Contents Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-border/30 pr-8">
            <div className="sticky top-28 space-y-5">
              <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                On This Page
              </h3>
              <nav className="space-y-3">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`block w-full text-left text-sm transition-all duration-200 py-1 hover:text-foreground ${
                      activeSection === section.id
                        ? 'font-semibold text-primary border-l-2 border-primary pl-4 -ml-4'
                        : 'text-muted-foreground border-l border-transparent pl-4 -ml-[1px]'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Legal Content */}
          <div className="flex-1 max-w-3xl space-y-6">
            {/* Eligibility */}
            <section id="eligibility" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                1. Eligibility
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  You must be legally capable of entering into a binding agreement
                  under applicable law to use the Platform. If you are using the
                  Platform on behalf of an organization, company, or institution, you
                  represent and warrant that you have the authority to bind that
                  entity to these Terms.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section id="responsibilities" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                2. User Responsibilities & Acceptable Use
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  You agree to use the Platform responsibly, ethically, and in
                  compliance with all applicable laws and regulations.
                </p>
                <p>
                  You agree that you will not:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Violate any local, national, or international law.</li>
                  <li>
                    Upload, distribute, or transmit unlawful, abusive, defamatory,
                    threatening, hateful, fraudulent, or harmful content.
                  </li>
                  <li>
                    Introduce malware, viruses, ransomware, or other malicious
                    software.
                  </li>
                  <li>
                    Attempt unauthorized access to accounts, systems, servers, or
                    networks.
                  </li>
                  <li>
                    Interfere with or disrupt platform functionality, security, or
                    performance.
                  </li>
                  <li>Impersonate another person, organization, or entity.</li>
                  <li>
                    Use automated systems to scrape, harvest, or extract data without
                    authorization.
                  </li>
                  <li>
                    Circumvent security measures, licensing controls, or access
                    restrictions.
                  </li>
                  <li>
                    Use the Platform for illegal, deceptive, or fraudulent purposes.
                  </li>
                </ul>
                <p>
                  We reserve the right to investigate violations and take appropriate
                  action, including content removal, account suspension, or legal
                  proceedings.
                </p>
              </div>
            </section>

            {/* Accounts */}
            <section id="accounts" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                3. Accounts & Service Usage
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  Certain features may require registration or account creation.
                </p>
                <p>
                  When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Provide accurate and current information.</li>
                  <li>Maintain the confidentiality of your login credentials.</li>
                  <li>Immediately notify us of unauthorized account access.</li>
                  <li>
                    Accept responsibility for activities conducted under your account.
                  </li>
                </ul>
                <p>
                  We may impose usage limits, storage restrictions, rate limits, or
                  feature limitations to ensure service reliability and security.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                4. Intellectual Property & Content Ownership
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  The Platform and all associated content, including but not limited
                  to software, source code, documentation, designs, logos, graphics,
                  branding, text, and functionality, are owned by DevPath or its
                  licensors and are protected under applicable intellectual property
                  laws.
                </p>
                <p>
                  Subject to these Terms, DevPath grants you a limited, non-exclusive,
                  revocable, non-transferable license to access and use the Platform
                  for its intended purposes.
                </p>
                <p>
                  You may not:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    Copy, reproduce, distribute, or modify protected materials without
                    authorization.
                  </li>
                  <li>
                    Remove copyright notices, trademarks, or proprietary markings.
                  </li>
                  <li>
                    Reverse engineer or attempt to derive source code where prohibited
                    by law.
                  </li>
                  <li>
                    Commercially exploit platform content without written permission.
                  </li>
                </ul>
                <p>
                  You retain ownership of content you submit, upload, or publish
                  ("User Content"). By submitting User Content, you grant DevPath a
                  worldwide, non-exclusive, royalty-free license to host, store,
                  display, process, and distribute such content solely for operating
                  and improving the Platform.
                </p>
              </div>
            </section>

            {/* Third Party */}
            <section id="third-party" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                5. Third-Party Services & Links
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  The Platform may contain links to third-party websites, services,
                  repositories, advertisements, or resources.
                </p>
                <p>
                  DevPath does not control and is not responsible for the content,
                  policies, practices, or availability of any third-party service.
                </p>
              </div>
            </section>

            {/* Disclaimer */}
            <section id="disclaimer" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                6. Disclaimer of Warranties
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
                </p>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEVPATH DISCLAIMS ALL
                  WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE,
                  INCLUDING:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Merchantability.</li>
                  <li>Fitness for a particular purpose.</li>
                  <li>Non-infringement.</li>
                  <li>Accuracy or completeness of information.</li>
                  <li>Availability or uninterrupted access.</li>
                  <li>Security and reliability of the Platform.</li>
                </ul>
                <p>
                  We do not guarantee that the Platform will always be available,
                  secure, error-free, or free of harmful components.
                </p>
              </div>
            </section>

            {/* Liability */}
            <section id="liability" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                7. Limitation of Liability
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, DEVPATH, ITS OWNERS,
                  CONTRIBUTORS, PARTNERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE
                  LIABLE FOR:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Indirect damages.</li>
                  <li>Incidental damages.</li>
                  <li>Special damages.</li>
                  <li>Consequential damages.</li>
                  <li>Loss of profits.</li>
                  <li>Loss of revenue.</li>
                  <li>Loss of business opportunities.</li>
                  <li>Loss of data.</li>
                  <li>Service interruptions.</li>
                </ul>
                <p>
                  This limitation applies regardless of the legal theory under which
                  liability is asserted and even if DevPath has been advised of the
                  possibility of such damages.
                </p>
              </div>
            </section>

            {/* Indemnification */}
            <section id="indemnification" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                8. Indemnification
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  You agree to indemnify, defend, and hold harmless DevPath, its
                  affiliates, contributors, employees, and partners from claims,
                  liabilities, damages, losses, costs, and expenses arising from:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>Your use of the Platform.</li>
                  <li>Your violation of these Terms.</li>
                  <li>Your violation of applicable laws.</li>
                  <li>Your infringement of third-party rights.</li>
                </ul>
              </div>
            </section>

            {/* Suspension */}
            <section id="suspension" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                9. Suspension & Termination
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  We reserve the right to suspend, restrict, or terminate access to
                  the Platform at any time, with or without notice, if:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>You violate these Terms.</li>
                  <li>We detect suspicious, abusive, or fraudulent activity.</li>
                  <li>
                    Security, legal, or operational concerns require such action.
                  </li>
                  <li>Required by applicable law.</li>
                </ul>
                <p>
                  Upon termination, your right to access and use the Platform
                  immediately ceases.
                </p>
              </div>
            </section>

            {/* Service Changes */}
            <section id="service-changes" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                10. Changes to the Service
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  We may modify, discontinue, replace, remove, or update any aspect of
                  the Platform at any time without prior notice.
                </p>
                <p>
                  We are not obligated to maintain any specific feature, integration,
                  API, functionality, or service level.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section id="terms-changes" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                11. Changes to These Terms
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  We may revise these Terms from time to time to reflect legal,
                  technical, operational, or business changes.
                </p>
                <p>
                  Updated versions will be posted on this page with a revised "Last
                  Updated" date.
                </p>
                <p>
                  Continued use of the Platform after changes become effective
                  constitutes acceptance of the revised Terms.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="scroll-mt-28 py-6 border-b border-border/20 last:border-0 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight border-l-2 border-primary/50 pl-4">
                12. Governing Law
              </h2>
              <div className="pl-4 text-muted-foreground leading-relaxed text-base space-y-4">
                <p>
                  These Terms shall be governed by and construed in accordance with
                  the applicable laws of the jurisdiction in which DevPath operates,
                  without regard to conflict of law principles.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
