// app/terms-and-conditions/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | DevPath",
  description:
    "Terms and Conditions governing the use of DevPath and its services.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto max-w-5xl px-6 py-16">
      <div className="space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms & Conditions
          </h1>

          <p className="text-sm text-muted-foreground">
            Last Updated: June 4, 2026
          </p>

          <p className="text-muted-foreground leading-relaxed">
            These Terms & Conditions ("Terms") govern your access to and use of
            DevPath, including our website, applications, content,
            documentation, and related services (collectively, the "Platform").
            By accessing or using the Platform, you agree to be bound by these
            Terms. If you do not agree to these Terms, you must not use the
            Platform.
          </p>
        </header>

        {/* Eligibility */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Eligibility</h2>

          <p>
            You must be legally capable of entering into a binding agreement
            under applicable law to use the Platform. If you are using the
            Platform on behalf of an organization, company, or institution, you
            represent and warrant that you have the authority to bind that
            entity to these Terms.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            2. User Responsibilities & Acceptable Use
          </h2>

          <p>
            You agree to use the Platform responsibly, ethically, and in
            compliance with all applicable laws and regulations.
          </p>

          <p>You agree that you will not:</p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Accounts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            3. Accounts & Service Usage
          </h2>

          <p>Certain features may require registration or account creation.</p>

          <p>When creating an account, you agree to:</p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            4. Intellectual Property & Content Ownership
          </h2>

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

          <p>You may not:</p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Third Party */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            5. Third-Party Services & Links
          </h2>

          <p>
            The Platform may contain links to third-party websites, services,
            repositories, advertisements, or resources.
          </p>

          <p>
            DevPath does not control and is not responsible for the content,
            policies, practices, or availability of any third-party service.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            6. Disclaimer of Warranties
          </h2>

          <p>
            THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.
          </p>

          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEVPATH DISCLAIMS ALL
            WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE,
            INCLUDING:
          </p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Liability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>

          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, DEVPATH, ITS OWNERS,
            CONTRIBUTORS, PARTNERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE
            LIABLE FOR:
          </p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Indemnification */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Indemnification</h2>

          <p>
            You agree to indemnify, defend, and hold harmless DevPath, its
            affiliates, contributors, employees, and partners from claims,
            liabilities, damages, losses, costs, and expenses arising from:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Your use of the Platform.</li>
            <li>Your violation of these Terms.</li>
            <li>Your violation of applicable laws.</li>
            <li>Your infringement of third-party rights.</li>
          </ul>
        </section>

        {/* Suspension */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            9. Suspension & Termination
          </h2>

          <p>
            We reserve the right to suspend, restrict, or terminate access to
            the Platform at any time, with or without notice, if:
          </p>

          <ul className="list-disc pl-6 space-y-2">
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
        </section>

        {/* Service Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Changes to the Service</h2>

          <p>
            We may modify, discontinue, replace, remove, or update any aspect of
            the Platform at any time without prior notice.
          </p>

          <p>
            We are not obligated to maintain any specific feature, integration,
            API, functionality, or service level.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">11. Changes to These Terms</h2>

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
        </section>

        {/* Governing Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Governing Law</h2>

          <p>
            These Terms shall be governed by and construed in accordance with
            the applicable laws of the jurisdiction in which DevPath operates,
            without regard to conflict of law principles.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">13. Contact Information</h2>

          <p>
            For legal, policy, compliance, copyright, or Terms & Conditions
            inquiries, please contact:
          </p>

          <div className="rounded-lg border p-5 bg-muted/30">
            <p className="font-semibold">DevPath Legal Team</p>
            <p>Email: legal@devpath.com</p>
            <p>Support: support@devpath.com</p>
          </div>

          <p className="text-sm text-muted-foreground">
            We will make reasonable efforts to respond to legitimate inquiries
            in a timely manner.
          </p>
        </section>
      </div>
    </main>
  );
}
