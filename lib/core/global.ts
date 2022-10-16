import { Client } from "../node/client";

export const getGlobalClientData = (): Client => global["__TRACEO__"];
