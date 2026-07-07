import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `Community Guidelines | ${siteConfig.name}`,
  description: `Community Guidelines for ${siteConfig.name}`,
};

export default function GuidelinesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Community Guidelines</h1>

      <div className="space-y-8 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Be Respectful and Inclusive
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-7">
            Treat everyone with respect. Harassment, hate speech, sexism,
            racism, or exclusionary jokes are not tolerated. We are committed to
            providing a friendly, safe, and welcoming environment for all,
            regardless of level of experience, gender identity and expression,
            sexual orientation, disability, personal appearance, body size,
            race, ethnicity, age, religion, nationality, or other similar
            characteristics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Collaborate and Help Others
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-7">
            This is a learning community. Share your knowledge, help answer
            questions, and provide constructive feedback. If you disagree with
            someone, do so politely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. No Spam or Self-Promotion
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-7">
            Do not spam the community with unsolicited links, self-promotion, or
            repetitive messages. Share relevant resources only when they add
            value to the ongoing conversation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Protect Privacy</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-7">
            Do not share personal information of others without their explicit
            consent. Respect the privacy of community members.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Follow the Code of Conduct
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-7">
            These guidelines are a supplement to our official Code of Conduct.
            Please read and adhere to our{' '}
            <a href="/conduct" className="text-primary hover:underline">
              Code of Conduct
            </a>{' '}
            at all times.
          </p>
        </section>
      </div>
    </main>
  );
}
