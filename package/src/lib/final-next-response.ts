import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

export const FinalSymbol = Symbol("FinalNextResponse");

export class FinalNextResponse<Body = unknown> extends NextResponse<Body> {
    [FinalSymbol]?: boolean;

    static json<JsonBody, NextResponseType = NextResponse>(body: JsonBody, init?: ResponseInit) {
        const next: FinalNextResponse<JsonBody> = super.json(body, init);
        next[FinalSymbol] = true;
        return next as NextResponseType;
    }

    static redirect<NextResponseType = NextResponse>(url: string | NextURL | URL, init?: number | ResponseInit) {
        const next: FinalNextResponse<unknown> = super.redirect(url, init);
        next[FinalSymbol] = true;
        return next as NextResponseType;
    }

    static rewrite<NextResponseType = NextResponse>(destination: string | NextURL | URL, init?: ResponseInit) {
        const next: FinalNextResponse<unknown> = super.rewrite(destination, init);
        next[FinalSymbol] = true;
        return next as NextResponseType;
    }

    static next<NextResponseType = NextResponse>(init?: ResponseInit) {
        const next: FinalNextResponse<unknown> = super.next(init);
        next[FinalSymbol] = true;
        return next as NextResponseType;
    }
}
