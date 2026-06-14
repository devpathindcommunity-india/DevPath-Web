export default function CookiesPage() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)] text-gray-900 dark:text-white px-6 md:px-12 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">Cookies Policy</h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {lastUpdated}
        </p>

        {/* Intro */}
        <section className="space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            This Cookies Policy explains how <b>cookies</b> and similar tracking
            technologies are used on this website and related services operated
            by <b>{`{Your Brand Name}`}</b>. It explains what cookies are, how
            we use them, and how you can control them.
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">1. What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device (computer,
              tablet, or mobile) when you visit a website. They are widely used
              to make websites work efficiently and provide reporting
              information.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              2. Types of cookies we use
            </h2>

            <p className="mb-3">
              We use different types of cookies for various purposes:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <b>Essential Cookies:</b> Required for core functionality such
                as authentication, security, and basic navigation.
              </li>

              <li>
                <b>Performance & Analytics Cookies:</b> Help us understand how
                users interact with the site (e.g., page views, traffic sources,
                user behavior).
              </li>

              <li>
                <b>Functional Cookies:</b> Remember your preferences such as
                theme, language, or region settings.
              </li>

              <li>
                <b>Security Cookies:</b> Used to detect fraud, abuse, and
                unauthorized access.
              </li>

              <li>
                <b>Advertising Cookies (if enabled):</b> Used to deliver
                relevant ads and measure campaign performance.
              </li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              3. How we use cookies
            </h2>
            <p>We use cookies to:</p>

            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Ensure the website functions correctly</li>
              <li>Improve performance and user experience</li>
              <li>Remember user preferences and settings</li>
              <li>Analyze traffic and usage patterns</li>
              <li>Improve content, features, and services</li>
              <li>Enhance security and prevent abuse</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              4. Third-party cookies
            </h2>
            <p>
              Some cookies may be placed by third-party services that appear on
              our pages. These include tools such as:
            </p>

            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                Analytics providers (e.g., Google Analytics or alternatives)
              </li>
              <li>Authentication or login providers</li>
              <li>Embedded content providers (e.g., videos, maps, widgets)</li>
              <li>Performance monitoring tools</li>
            </ul>

            <p className="mt-3">
              These third parties may collect data in accordance with their own
              privacy policies.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              5. Why cookies are important
            </h2>
            <p>
              Cookies help us provide a smoother and more personalized
              experience. Without cookies, some features may not work properly,
              and you may need to re-enter information repeatedly.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              6. How you can control cookies
            </h2>

            <p>
              You have full control over cookies and can manage them in several
              ways:
            </p>

            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Adjust browser settings to block or delete cookies</li>
              <li>Set preferences to accept or reject certain cookies</li>
              <li>Use “Do Not Track” options if supported by your browser</li>
            </ul>

            <p className="mt-3">
              Please note that disabling cookies may affect website
              functionality.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">7. Cookie retention</h2>
            <p>
              Cookies may be stored either temporarily (session cookies) or for
              longer periods (persistent cookies). Session cookies are deleted
              when you close your browser, while persistent cookies remain until
              they expire or are deleted manually.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              8. Data collected through cookies
            </h2>
            <p>Cookies may collect information such as:</p>

            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                IP address (anonymized or partial depending on configuration)
              </li>
              <li>Browser type and device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Interaction patterns (clicks, navigation flow)</li>
              <li>Login/session status (if applicable)</li>
            </ul>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              9. Legal basis for cookies
            </h2>
            <p>Where applicable, we use cookies based on:</p>

            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Your consent (for non-essential cookies)</li>
              <li>
                Legitimate interest (for essential functionality and security)
              </li>
              <li>Contractual necessity (for logged-in services)</li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              10. Updates to this policy
            </h2>
            <p>
              We may update this Cookies Policy from time to time to reflect
              changes in technology, legal requirements, or our services.
              Updates will be posted on this page with a revised “Last Updated”
              date.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-xl font-semibold mb-2">11. Contact us</h2>
            <p>
              If you have any questions about this Cookies Policy, you can
              contact us at:
            </p>

            <p className="mt-2 font-medium">
              support@yourdomain.com (replace with your real email)
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
