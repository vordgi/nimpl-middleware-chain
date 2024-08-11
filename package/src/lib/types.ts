import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type NextURL } from "next/dist/server/web/next-url";
import { type NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { type FinalNextResponse, type FinalSymbol } from "./final-next-response";
import { type Logger } from "./logger";

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

export type Middleware = (req: ChainNextRequest, event: NextFetchEvent) => MiddlewareResult;

export type ChainItem = Middleware | [Middleware, { include?: RegExp; exclude?: RegExp }?];

export type ChainConfig = {
    logger?: Logger | boolean | null;
};
