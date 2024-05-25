import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";

export const FinalSymbol = Symbol("FinalNextResponse");

export class FinalNextResponse<T = unknown> extends NextResponse<T> {
    [FinalSymbol]?: boolean;

    static json<JsonBody>(body: JsonBody, init?: ResponseInit): FinalNextResponse<JsonBody> {
        const next: FinalNextResponse<JsonBody> = super.json(body, init);
        next[FinalSymbol] = true;
        return next;
    }

    static redirect(url: string | NextURL | URL, init?: number | ResponseInit): NextResponse<unknown> {
        const next: FinalNextResponse<unknown> = super.redirect(url, init);
        next[FinalSymbol] = true;
        return next;
    }

    static rewrite(destination: string | NextURL | URL, init?: ResponseInit): NextResponse<unknown> {
        const next: FinalNextResponse<unknown> = super.rewrite(destination, init);
        next[FinalSymbol] = true;
        return next;
    }

    static next(init?: ResponseInit): NextResponse<unknown> {
        const next: FinalNextResponse<unknown> = super.next(init);
        next[FinalSymbol] = true;
        return next;
    }
}
