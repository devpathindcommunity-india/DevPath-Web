import { siteConfig } from '@/config/siteConfig';

export const metadata = {
  title: `Copyright Notice | ${siteConfig.name}`,
  description: `Copyright Notice for ${siteConfig.name}`,
};

export default function CopyrightPage() {
  return (
    <main className="container mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold">Copyright Notice</h1>

      <div className="space-y-6">
        <p className="font-semibold text-lg">
          &copy; 2026 DevPath Bharat Community.
          <br />
          All Rights Reserved.
        </p>

        <p className="leading-7 text-gray-700 dark:text-gray-300">
          Unless otherwise specified:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Website design</li>
          <li>UI/UX</li>
          <li>Graphics</li>
          <li>Documentation</li>
          <li>Educational material</li>
          <li>Blog articles</li>
          <li>Community resources</li>
          <li>Original code written specifically for DevPath</li>
        </ul>

        <p className="leading-7 text-gray-700 dark:text-gray-300">
          are copyrighted works of the DevPath Bharat Community.
        </p>

        <p className="leading-7 text-gray-700 dark:text-gray-300">
          Community members may view and contribute according to the repository
          license.
        </p>

        <p className="leading-7 text-gray-700 dark:text-gray-300 font-medium">
          The DevPath name, logo and branding may not be reused without
          permission.
        </p>
      </div>
    </main>
  );
}
