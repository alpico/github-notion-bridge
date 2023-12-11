import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import * as core from "@actions/core";
import { config } from "../config";

export async function deletePage(context: Context): Promise<void> {
    const notion = new Client({ auth: config.apiKey });
    const link = githubLinkFromIssue(context);
    core.info(`Received delete event for issue ${link}...`);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, config.pageId, link);
    issuePageIds.forEach(async issuePageId => {
        core.debug(`Updating notion page {issuePageId}...`);
        const response = await notion.pages.update({
            page_id: issuePageId,
            archived: true,
        });
        console.log(response);
    })
}
