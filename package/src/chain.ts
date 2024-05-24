import { type NextRequest } from "next/server";
import { collectData } from "./lib/collect-data";
import { Middleware } from "./lib/types";
import { formatResponse } from "./lib/format-response";
export { FinalNextResponse } from "./lib/final-next-response";

export const chain = (middlewares: Middleware[]) => async (req: NextRequest) => {
    const summary = await collectData(req, middlewares);
    const next = formatResponse(summary);

    return next;
};

export default chain;
