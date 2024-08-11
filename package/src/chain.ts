import type { NextRequest, NextFetchEvent } from "next/server";
import { collectData } from "./lib/collect-data";
import { ChainItem } from "./lib/types";
import { formatResponse } from "./lib/format-response";
import { Logger } from "./lib/logger";
export { FinalNextResponse } from "./lib/final-next-response";

type ChainConfig = {
    logger?: Logger | boolean | null;
};

export const chain =
    (middlewares: ChainItem[], config?: ChainConfig) => async (req: NextRequest, event: NextFetchEvent) => {
        const logger = new Logger(config?.logger);
        const summary = await collectData(req, event, middlewares, logger);
        const next = formatResponse(summary);

        return next;
    };

export default chain;
