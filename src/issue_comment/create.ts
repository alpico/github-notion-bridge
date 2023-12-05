import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, notionPageIdsFromGithubLink, githubLinkFromIssue } from "../main";
import { markdownToRichText } from "@tryfabric/martian";

export async function create(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    const login = context.payload.comment?.user.login ?? "";
    const author_url = context.payload.comment?.user.html_url ?? "";
    const url = context.payload.comment?.html_url ?? "";
    const header = `[@${login}](${author_url}) [commented](${url}): `;
    const body = context.payload.comment?.body ?? "";

    issuePageIds.forEach(async issuePageId => {
        await notion.comments.create({
            parent: { page_id: issuePageId },
            rich_text: markdownToRichText(header + body)
        })
    })
}
