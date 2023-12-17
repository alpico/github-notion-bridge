import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { setPageLabels, getPageLabels, updateDBLabels } from ".";
import { config } from "../config";
import * as core from "@actions/core";

export async function label(context: Context): Promise<void> {
    const notion = new Client({ auth: config.apiKey });
    const link = githubLinkFromIssue(context);
    const labelNames = await updateDBLabels(notion, context);
    core.info(`Received label event for label ${labelNames} for issue ${link}...`);

    const issuePageIds = await notionPageIdsFromGithubLink(notion, config.pageId, link);
    issuePageIds.forEach(async issuePageId => {
        core.debug(`Updating notion page ${issuePageId}...`);
        await updatePageLabels(notion, issuePageId, labelNames);
    })
}

async function updatePageLabels(notion: Client, pageId: string, labelNames: string[]): Promise<void> {
    const labels = await getPageLabels(notion, pageId);
    let noLabelsAdded = true;
    console.log(typeof labelNames);
    labelNames.forEach(label => {
        if (!labels.find((x: any) => x.name === label)) {
            noLabelsAdded = false;
            labels.push({ name: label });
        }
    });
    if (noLabelsAdded) {
        core.info(`All labels already set for page ${pageId}`);
        return;
    }
    await setPageLabels(notion, pageId, labels);
}
