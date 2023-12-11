import { config as config_local } from "./config_local";
import { config as config_action } from "./config_action"

export type Config = {
    ghToken: string,
    pageId: string,
    apiKey: string,
    labelPropName: string,
    linkPropName: string,
    repoPropName: string,
    assigneePropName: string,
    boardColumnPropName: string,
    boardColumnDefaultVal: string,
    boardColumnDoneVal: string,
    boardColumnReopenedVal: string,
    issueIcon: string,
    ghNotionUserMap: Record<string, string>,
}

export let config: Config;
if (process.argv.find(x => x === "--local") !== null) {
    config = config_local();
} else {
    config = config_action();
}
