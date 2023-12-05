import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";

export async function deletePage(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    issuePageIds.forEach(async issuePageId => {
        const response = await notion.pages.update({
            page_id: issuePageId,
            archived: true,
        });
        console.log(response);
    })
}
