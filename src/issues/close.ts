import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { moveIssueOnBoard } from ".";
import { config } from "../config";
import * as core from "@actions/core";

export async function close(context: Context): Promise<void> {
    const notion = new Client({ auth: config.apiKey });
    const link = githubLinkFromIssue(context);
    core.info(`Received close event for issue ${link}...`);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, config.pageId, link);
    issuePageIds.forEach(async issuePageId => {
        core.debug(`Updating notion page ${issuePageId}...`);
        await moveIssueOnBoard(notion, issuePageId, config.boardColumnDoneVal);
    })
}
