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
