import type { NextRequest, NextFetchEvent } from "next/server";
import { collectData } from "./lib/collect-data";
import { ChainItem } from "./lib/types";
import { formatResponse } from "./lib/format-response";
export { FinalNextResponse } from "./lib/final-next-response";

export const chain = (middlewares: ChainItem[]) => async (req: NextRequest, event: NextFetchEvent) => {
    const summary = await collectData(req, event, middlewares);
    const next = formatResponse(summary);

    return next;
};

export default chain;
