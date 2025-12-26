"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
    const pathname = usePathname();
    const isWiki = pathname?.startsWith('/wiki');

    if (isWiki) return null;

    return <Footer />;
}
