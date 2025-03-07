import { NextResponse, type NextFetchEvent } from "next/server";
import { type Logger } from "./logger";
import { type ChainItem, type Middleware, type ChainNextResponse, type Summary, type BaseRequest } from "./types";
import { FinalSymbol } from "./final-next-response";
import { INTERNAL_HEADERS } from "./constants";

export const collectData = async <RequestType extends BaseRequest, ResponseType extends Response>(
    req: RequestType,
    event: NextFetchEvent,
    chainItems: ChainItem<RequestType, ResponseType>[],
    logger: Logger,
) => {
    const summary: Summary = {
        type: "none",
        destination: req.nextUrl,
        cookies: new Map(),
        headers: new Headers(),
        status: 200,
        body: undefined,
    };

    for await (const chainItem of chainItems) {
        let middleware: Middleware<RequestType, ResponseType>;
        if (Array.isArray(chainItem)) {
            const [itemMiddleware, itemRules] = chainItem;
            if (
                itemRules &&
                ((itemRules.include && !itemRules.include?.test(req.nextUrl.pathname)) ||
                    itemRules.exclude?.test(req.nextUrl.pathname))
            ) {
                continue;
            }
            middleware = itemMiddleware;
        } else {
            middleware = chainItem;
        }
        const middlewareNext = await middleware(Object.assign(req, { summary: Object.freeze({ ...summary }) }), event);

        if (!middlewareNext) continue;

        let next: ChainNextResponse<ResponseType>;
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
                logger.log(
                    `Changing destination between middlewares: ${summary.destination} (${summary.type}) -> ${destination} (redirect)`,
                );
            } else if (summary.type === "json") {
                logger.log(`Changing response type between middlewares: json -> redirect`);
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
                logger.log(
                    `Changing destination between middlewares: ${summary.destination} (${summary.type}) -> ${destination} (rewrite)`,
                );
            } else if (summary.type === "json") {
                logger.log(`Changing response type between middlewares: json -> rewrite`);
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
                logger.log(`Changing body between middlewares`);
            } else {
                logger.log(`Changing response type between middlewares: ${summary.type} -> json`);
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
        if (next[FinalSymbol]) break;
    }

    return summary;
};
