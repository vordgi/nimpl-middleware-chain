import { NextResponse, type NextRequest } from "next/server";
import { type Middleware, type Summary } from "./types";
import { FinalNextResponse } from "./final-next-response";
import { INTERNAL_HEADERS } from "./constants";

export const collectData = async (req: NextRequest, middlewares: Middleware[]) => {
    const summary: Summary = {
        type: "none",
        destination: req.nextUrl,
        cookies: new Map(),
        headers: new Headers(),
        status: 200,
        body: undefined,
    };

    for await (const middleware of middlewares) {
        const middlewareNext = await middleware(Object.assign(req, { summary: Object.freeze({ ...summary }) }));

        if (!middlewareNext) continue;

        let next: NextResponse;
        if (middlewareNext instanceof NextResponse) {
            next = middlewareNext;
        } else if (middlewareNext instanceof Response) {
            next = new NextResponse(middlewareNext.body, middlewareNext);
        } else {
            throw new Error("Invalid middleware response");
        }

        if (next.headers.has("Location")) {
            const destination = next.headers.get("Location") as string;
            if (summary.destination !== destination || summary.type === "rewrite") {
                console.log(
                    `Changing destination between middlewares: ${summary.destination} (${summary.type}) -> ${destination} (redirect)`,
                );
            } else if (summary.type === "json") {
                console.log(`Changing response type between middlewares: json -> redirect`);
            }
            Object.assign(summary, {
                type: "redirect",
                destination,
                status: next.status,
                statusText: summary.statusText,
                body: undefined,
            });
        } else if (next.headers.has("x-middleware-rewrite")) {
            const destination = next.headers.get("x-middleware-rewrite") as string;
            if (summary.destination !== destination || summary.type === "redirect") {
                console.log(
                    `Changing destination between middlewares: ${summary.destination} (${summary.type}) -> ${destination} (rewrite)`,
                );
            } else if (summary.type === "json") {
                console.log(`Changing response type between middlewares: json -> rewrite`);
            }
            Object.assign(summary, {
                type: "rewrite",
                destination,
                status: next.status,
                statusText: summary.statusText,
                body: undefined,
            });
        } else if (next.body) {
            if (summary.type === "json") {
                console.log(`Changing body between middlewares`);
            } else {
                console.log(`Changing response type between middlewares: ${summary.type} -> json`);
            }
            Object.assign(summary, {
                type: "custom",
                destination: undefined,
                status: next.status,
                statusText: summary.statusText,
                body: next.body,
            });
        }

        next.cookies.getAll().forEach((cookie) => {
            summary.cookies.set(cookie.name, cookie);
        });
        next.headers.forEach((value, key) => {
            if (!INTERNAL_HEADERS.includes(key.toLowerCase())) {
                summary.headers.set(key, value);
            }
        });
        if (next instanceof FinalNextResponse) break;
    }

    return summary;
};
