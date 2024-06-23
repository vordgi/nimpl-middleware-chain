import { default as nextAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { chain, FinalNextResponse } from "@nimpl/middleware-chain";

const intlMiddleware = createMiddleware({
    locales: ["en", "dk"],
    defaultLocale: "en",
});

export default chain([
    [intlMiddleware, { exclude: /^\/private(\/.*)?$/ }],
    (req) => {
        if (req.summary.type === "redirect") return FinalNextResponse.next();
    },
    [nextAuth, { include: /^\/private(\/.*)?$/ }],
]);

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
