import { config as config_local } from "./config_local";
import { config as config_action } from "./config_action"
import * as core from "@actions/core";

export type Config = {
    ghToken: string,
    pageId: string,
    apiKey: string,
    labelPropName: string,
    linkPropName: string,
    assigneePropName: string,
    boardColumnPropName: string,
    boardColumnDefaultVal: string,
    boardColumnDoneVal: string,
    boardColumnReopenedVal: string,
    issueIcon: string,
    ghNotionUserMap: Record<string, string>,
}

export let config: Config;
if (process.argv.find(x => x === "--local") !== undefined) {
    config = config_local();
} else {
    core.info("Using action configuration...");
    config = config_action();
}

core.info(JSON.stringify(config));
