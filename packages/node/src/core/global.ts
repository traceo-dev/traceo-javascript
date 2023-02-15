import { Client } from "../client";

export const getGlobalClientData = (): Client => global["__TRACEO__"];
