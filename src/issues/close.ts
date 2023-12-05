import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { moveIssueOnBoard } from ".";

export async function close(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    issuePageIds.forEach(async issuePageId => {
        await moveIssueOnBoard(notion, issuePageId, "Done");
    })
}
