export { open } from './open';
export { edit } from './edit'
export { deletePage } from './delete';
export { close } from './close';
export { reopen } from './reopen';
export { assign } from './assign'
export { unassign } from './unassign'
export { label } from './label'
export { unlabel } from './unlabel'
import { Client } from "@notionhq/client";
import { Context } from '@actions/github/lib/context';

export const notionUserFromGithubUsername: Record<string, string> = {
    "aDogCalledSpot": "30486824-964a-49ae-a41b-a4640bcf8721",
    "s1lken": "341ec851-6b7d-4c51-a3fd-5749dde48c4a",
    "vmmon": "2be252ea-83d1-418e-b4fb-ce130654bf63",
    "tpotie": "1f8bdbea-1aca-48f8-9801-7937c1ab7e4c",
}


// Ideally this would only return one result, but we might as well return
// all of them to make sure we do everything correctly.
export async function notionPageIdsFromGithubLink(notion: Client, databaseId: string, link: string): Promise<string[]> {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "Github Link",
            url: { equals: link },
        }
    })
    return response.results.map(x => x.id);
}

export function githubLinkFromIssue(context: Context): string {
    return context.payload.issue?.html_url ?? "";
}

export async function moveIssueOnBoard(notion: Client, pageId: string, newStatus: string): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            "Tags": {
                status: { name: newStatus }
            }
        }
    });
    console.log(response);
}

export async function getPageLabels(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: "Github Labels"
    }) as any;
    return response["multi_select"];
}

export async function setPageLabels(notion: Client, pageId: string, labels: any): Promise<void> {
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

// For some reason we only ever get one assignee instead of an array
export async function getAssignee(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: "Assignees"
    }) as any;
    console.log(response.results);

    return response.results[0].people;
}

export async function setAssignees(notion: Client, pageId: string, assignees: any): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            "Assignees": {
                people: assignees,
            }
        }
    })
    console.log(response);
}
