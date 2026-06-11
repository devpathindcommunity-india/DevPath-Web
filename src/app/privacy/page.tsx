import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}`,
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

      <p className="mb-10 text-sm text-gray-500 dark:text-gray-400">
        Last Updated: June 2026
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>

          <p className="leading-7 text-gray-700 dark:text-gray-300">
            {siteConfig.name} ("we", "our", or "us") is committed to protecting
            your privacy. This Privacy Policy explains how we collect, use,
            store, and safeguard your information when you use our website,
            mobile applications, and related services.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            2. Information We Collect
          </h2>

          <p className="mb-4">
            We may collect the following categories of information:
          </p>

          <h3 className="mb-2 text-lg font-medium">Account Information</h3>

          <ul className="mb-4 list-disc pl-6 space-y-2">
            <li>Name or username</li>
            <li>Email address</li>
            <li>Profile information you voluntarily provide</li>
          </ul>

          <h3 className="mb-2 text-lg font-medium">Usage Information</h3>

          <ul className="mb-4 list-disc pl-6 space-y-2">
            <li>Pages visited</li>
            <li>Features used</li>
            <li>Session activity</li>
            <li>Device and browser information</li>
            <li>IP address</li>
            <li>Diagnostic and performance data</li>
          </ul>

          <h3 className="mb-2 text-lg font-medium">User-Generated Content</h3>

          <ul className="list-disc pl-6 space-y-2">
            <li>Comments and discussions</li>
            <li>Feedback and bug reports</li>
            <li>Support requests</li>
            <li>Content submitted through platform features</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            3. How We Use Your Information
          </h2>

          <p className="mb-4">
            We use collected information for the following purposes:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our services</li>
            <li>Create and manage user accounts</li>
            <li>Improve website performance and user experience</li>
            <li>Respond to support requests</li>
            <li>Monitor platform security and prevent abuse</li>
            <li>Analyze usage trends and service performance</li>
            <li>Send important service notifications</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            4. Data Storage and Security
          </h2>

          <p className="mb-4">
            We implement industry-standard security measures to protect personal
            information against unauthorized access, disclosure, alteration, or
            destruction.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS/TLS encrypted connections</li>
            <li>Secure authentication systems</li>
            <li>Access controls and permissions</li>
            <li>Routine monitoring and maintenance</li>
            <li>Protected hosting infrastructure</li>
          </ul>

          <p className="mt-4">
            While we strive to protect your information, no internet-based
            service can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            5. Third-Party Services and Integrations
          </h2>

          <p className="mb-4">
            We may use trusted third-party providers to support our platform.
            These services may process limited information necessary to perform
            their functions.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Cloud hosting providers</li>
            <li>Analytics services</li>
            <li>Authentication providers</li>
            <li>Customer support systems</li>
            <li>Content delivery networks (CDNs)</li>
            <li>Payment processors (if applicable)</li>
          </ul>

          <p className="mt-4">
            Each third-party provider is responsible for its own privacy and
            data handling practices.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            6. Your Rights Regarding Your Data
          </h2>

          <p className="mb-4">
            Depending on your location and applicable laws, you may have the
            right to:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to certain processing activities</li>
            <li>Request a copy of your data</li>
            <li>Withdraw previously provided consent</li>
          </ul>

          <p className="mt-4">
            Requests will be reviewed and processed in accordance with
            applicable laws and operational requirements.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            7. Cookies and Tracking Technologies
          </h2>

          <p>
            We may use cookies and similar technologies to maintain
            functionality, remember preferences, improve performance, and
            analyze usage patterns. You can manage cookie preferences through
            your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">8. Children's Privacy</h2>

          <p>
            Our services are not intended for children under the age required by
            applicable law. We do not knowingly collect personal information
            from children without proper consent.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            9. Changes to This Privacy Policy
          </h2>

          <p>
            We may update this Privacy Policy periodically. Any changes will be
            posted on this page with an updated revision date. Continued use of
            the service after changes become effective constitutes acceptance of
            the updated policy.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            10. Contact Information
          </h2>

          <p className="mb-4">
            For privacy-related questions, concerns, or requests regarding your
            personal information, please contact us:
          </p>

          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <p className="font-semibold">{siteConfig.name}</p>
            <p>Email: {siteConfig.contact.email}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
