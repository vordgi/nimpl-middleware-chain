import { chain } from "@nimpl/proxy-chain";
import { basicAuthMiddleware } from "./basicAuthMiddleware";
import { NextResponse } from "next/server";

export default chain([
    basicAuthMiddleware,
    async (request) => {
        const next = NextResponse.next({
            headers: new Headers({ "x-client-header-set-by-middleware": "true" }),
            request: { headers: new Headers({ "x-request-pathname": request.nextUrl.pathname }) },
        });
        next.cookies.set("test", "cookie", { maxAge: 1000 * 60 * 60 * 24 * 30 });

        return next;
    },
    (req) => {
        console.log("Request summary", req.summary);
    },
]);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)"],
};
