import { type NextRequest, type NextFetchEvent } from "next/server";
import { type ChainItem, type ChainConfig } from "./lib/types";
import { collectData } from "./lib/collect-data";
import { formatResponse } from "./lib/format-response";
import { Logger } from "./lib/logger";

export { FinalNextResponse } from "./lib/final-next-response";

export const chain =
    (middlewares: ChainItem[], config?: ChainConfig) => async (req: NextRequest, event: NextFetchEvent) => {
        const logger = new Logger(config?.logger);
        const summary = await collectData(req, event, middlewares, logger);
        const next = formatResponse(summary);

        return next;
    };

export default chain;
