import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { setPageLabels, getPageLabels } from ".";
import { config } from "src/config";
import * as core from "@actions/core";

export async function label(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const labelName = await updateDBLabels(notion, context);
    core.info(`Received label event for label ${labelName} for issue ${link}...`);

    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    issuePageIds.forEach(async issuePageId => {
        core.debug(`Updating notion page {issuePageId}...`);
        await updatePageLabels(notion, issuePageId, labelName);
    })
}

async function updateDBLabels(notion: Client, context: Context): Promise<string> {
    const options = await getDBLabels(notion);
    const labelName = context.payload.label.name;
    if (options.find((elem: any) => elem["name"] === labelName) === null) {
        options.push({
            name: labelName,
        })
        const response = await notion.databases.update({
            database_id: pageId,
            properties: {
                labelPropName: {
                    multi_select: {
                        options: options
                    }
                }
            }
        });
        console.log(response);
    }
    return labelName;
}

async function getDBLabels(notion: Client): Promise<any> {
    const response = await notion.databases.retrieve({ database_id: pageId });
    return (response.properties[config.labelPropName] as any)["multi_select"]["options"];
}

async function updatePageLabels(notion: Client, pageId: string, labelName: string): Promise<void> {
    const labels = await getPageLabels(notion, pageId);
    labels.push({ name: labelName });
    await setPageLabels(notion, pageId, labels);
}
