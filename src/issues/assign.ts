import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { getAssignee, setAssignees, notionUserFromGithubUsername } from ".";

export async function assign(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    const notionUser = notionUserFromGithubUsername[context.payload.assignee.login];
    issuePageIds.forEach(async issuePageId => {
        await updateAssignee(notion, issuePageId, notionUser);
    });
}

async function updateAssignee(notion: Client, pageId: string, notionUserId: string): Promise<void> {
    const assignee = await getAssignee(notion, pageId);
    if (assignee["id"] === notionUserId) {
        return;
    }
    await setAssignees(notion, pageId, [{ "id": notionUserId }]);
}
