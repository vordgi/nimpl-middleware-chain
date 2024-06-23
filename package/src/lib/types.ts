import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type NextURL } from "next/dist/server/web/next-url";
import { NextResponse, type NextRequest } from "next/server";
import { FinalNextResponse, FinalSymbol } from "./final-next-response";

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

export type ChainNextResponse = FinalNextResponse | (NextResponse & { [FinalSymbol]?: undefined });

export type MiddlewareResult = ChainNextResponse | Response | void | undefined | null | Promise<MiddlewareResult>;

export type Middleware = (req: ChainNextRequest) => MiddlewareResult;

export type ChainItem = Middleware | [Middleware, { include?: RegExp; exclude?: RegExp }?];
