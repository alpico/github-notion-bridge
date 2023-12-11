export { open } from './open';
export { edit } from './edit'
export { deletePage } from './delete';
export { close } from './close';
export { reopen } from './reopen';
export { assign } from './assign'
export { unassign } from './unassign'
export { label } from './label'
export { unlabel } from './unlabel'
import { config } from 'src/config';
import { Client } from "@notionhq/client";

export async function moveIssueOnBoard(notion: Client, pageId: string, newStatus: string): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            [config.boardColumnPropName]: {
                status: { name: newStatus }
            }
        }
    });
    console.log(response);
}

export async function getPageLabels(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: config.linkPropName
    }) as any;
    return response["multi_select"];
}

export async function setPageLabels(notion: Client, pageId: string, labels: any): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            linkPropName: {
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
        property_id: config.assigneePropName
    }) as any;
    console.log(response.results);

    return response.results[0].people;
}

export async function setAssignees(notion: Client, pageId: string, assignees: any): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            assigneePropName: {
                people: assignees,
            }
        }
    })
    console.log(response);
}
