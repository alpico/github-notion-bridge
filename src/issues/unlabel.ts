import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId, githubLinkFromIssue, notionPageIdsFromGithubLink } from "../main";
import { getPageLabels, setPageLabels } from ".";

export async function unlabel(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const labelName = context.payload.label.name;
    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    issuePageIds.forEach(async issuePageId => {
        const labels = await getPageLabels(notion, issuePageId).then(labels => labels.filter((elem: any) => elem["name"] !== labelName));
        await setPageLabels(notion, issuePageId, labels);
    })
}
