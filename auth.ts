import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '@/server/db';
import { env } from "@/env";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, multiSession } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "pg" or "mysql"
    }),
    user: {
        additionalFields: {
            onboard: {
                type: "number",
                required: false,
                input: false,
                fieldName: "onboard",
                unique: false,
            },
        }
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET, 
        },
    },
    plugins: [
        nextCookies(),
        multiSession({
            maximumSessions: 2,
        }),
    ]
});


export const getSession = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session as Session;
});

export const validateSession = cache(async () => {
    const session = await getSession();
    if (!session) redirect('/login');
    return session as Session;
});


export type Session = typeof auth.$Infer.Session;
