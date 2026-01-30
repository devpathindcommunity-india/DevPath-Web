"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <main
            style={{
                position: "relative",
                // zIndex: 1, // Removed to prevent stacking context issue with modals
                paddingTop: isHome ? 0 : "150px",
            }}
        >
            {children}
        </main>
    );
}
