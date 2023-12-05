import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { getAssignee, setAssignees, notionUserFromGithubUsername } from ".";

export async function unassign(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    const notionUser = notionUserFromGithubUsername[context.payload.assignee.login];
    issuePageIds.forEach(async issuePageId => {
        const assignee = await getAssignee(notion, issuePageId);
        if (assignee["id"] !== notionUser) {
            return;
        }
        await setAssignees(notion, issuePageId, []);
    })
}
