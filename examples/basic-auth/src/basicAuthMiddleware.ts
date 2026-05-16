import { NextRequest, NextResponse } from "next/server";

const BASIC_AUTH_COOKIE_NAME = "__basic_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function createAuthHash(username: string, password: string): string {
    return Buffer.from(`${username}:${password}`).toString("base64");
}

export const basicAuthMiddleware = async (request: NextRequest) => {
    if (!process.env.BASIC_AUTH) {
        return;
    }

    const basicAuthParts = process.env.BASIC_AUTH.split(":");
    if (basicAuthParts.length !== 2 || !basicAuthParts[0] || !basicAuthParts[1]) {
        console.error('Server misconfiguration: BASIC_AUTH must be in "username:password" format');
        return new Response("Server misconfiguration", {
            status: 500,
        });
    }
    const [username, password] = basicAuthParts;
    const expectedAuthHash = createAuthHash(username, password);

    // Fast path: check cookie first (covers all subsequent requests including RSC/prefetch)
    const authCookie = request.cookies.get(BASIC_AUTH_COOKIE_NAME);
    if (authCookie?.value === expectedAuthHash) {
        return;
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
        const base64Credentials = authHeader.split(" ")[1];
        if (base64Credentials) {
            const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
            const [inputUsername, inputPassword] = credentials.split(":");

            if (inputUsername === username && inputPassword === password) {
                // Set the auth cookie for subsequent requests and proceed to the next proxy handler
                const nextResponse = NextResponse.next();
                nextResponse.cookies.set(BASIC_AUTH_COOKIE_NAME, expectedAuthHash, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: COOKIE_MAX_AGE,
                    path: "/",
                });
                return nextResponse;
            }
        }
    }
    return new Response("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Auth"',
        },
    });
};
