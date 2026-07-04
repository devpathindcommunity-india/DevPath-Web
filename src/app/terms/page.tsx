// app/terms/page.tsx

import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms & Conditions | DevPath',
  description:
    'Terms and Conditions governing the use of DevPath and its services.',
};

export default function TermsAndConditionsPage() {
  return <TermsClient />;
}
