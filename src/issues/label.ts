import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { apiKey, pageId } from "../main";
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from ".";

export async function label(context: Context): Promise<void> {
    const notion = new Client({ auth: apiKey });
    const link = githubLinkFromIssue(context);
    const labelName = await updateDBLabels(notion, context);

    const issuePageIds = await notionPageIdsFromGithubLink(notion, pageId, link);
    issuePageIds.forEach(async issuePageId => {
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
                "Github Labels": {
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
    return (response.properties["Github Labels"] as any)["multi_select"]["options"];
}

async function updatePageLabels(notion: Client, pageId: string, labelName: string): Promise<void> {
    const labels = await getPageLabels(notion, pageId);
    labels.push({ name: labelName });
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            "Github Labels": {
                multi_select: labels,
            }
        }
    })
    console.log(response);
}

async function getPageLabels(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: "Github Labels"
    }) as any;
    return response["multi_select"];
}
