"use client";

import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function AuthProvider({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const supabase = createClient();

        async function init() {
            // await supabase.auth.signOut();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                await supabase.auth.signInAnonymously();
            }
        }

        init().then(() => {
            console.log('initialized');
        });
    }, []);

    return <>{children}</>;
}