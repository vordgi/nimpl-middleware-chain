import { type NextRequest, NextResponse } from "next/server";
import { chain } from "@nimpl/middleware-chain";

async function middleware1(): Promise<NextResponse> {
    console.log("a");
    return NextResponse.json({});
}

export const middleware = chain<NextRequest, NextResponse>(
    [
        middleware1,
        async (request) => {
            const next = NextResponse.next({ headers: new Headers({ "x-pathname": request.nextUrl.pathname }) });
            next.cookies.set("test", "cookie", { domain: "localhost", secure: true });

            return next;
        },
        async (request) => {
            return NextResponse.rewrite(new URL("/rewritten", request.url));
        },
    ],
    {
        logger: {
            log: (msg) => console.log(`Info: ${msg}`),
            warn: (msg) => console.warn(`Warning: ${msg}`),
            error: (msg) => console.error(`Error: ${msg}`),
        },
    },
);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
