import { NextRequest, NextResponse } from "next/server";
import { chain } from "@nimpl/middleware-chain";

export const middleware = chain([
    async (request: NextRequest) => {
        const next = NextResponse.next({ headers: new Headers({ "x-pathname": request.nextUrl.pathname }) });
        next.cookies.set("test", "cookie", { domain: "localhost", secure: true });

        return next;
    },
    async (request: NextRequest) => {
        return NextResponse.rewrite(new URL("/rewritten", request.url));
    },
]);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
