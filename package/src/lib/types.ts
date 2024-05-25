import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type NextURL } from "next/dist/server/web/next-url";
import { type NextRequest, type NextResponse } from "next/server";

export type NextType = "rewrite" | "redirect" | "json" | "none" | undefined;

export type Summary = {
    type: NextType;
    destination?: string | NextURL;
    body?: ReadableStream<Uint8Array>;
    cookies: Map<string, ResponseCookie>;
    headers: Headers;
    status: number;
    statusText?: string;
};

export interface ChainNextRequest extends NextRequest {
    summary: Readonly<Summary>;
}

export type MiddlewareResult = NextResponse | Response | void | undefined | null | Promise<MiddlewareResult>;

export type Middleware = (req: ChainNextRequest) => MiddlewareResult;
