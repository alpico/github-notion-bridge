export { open } from './open';
export { edit } from './edit'
export { deletePage } from './delete';
export { close } from './close';
export { reopen } from './reopen';
export { assign } from './assign'
export { unassign } from './unassign'
export { label } from './label'
export { unlabel } from './unlabel'
import { config } from '../config';
import { Client } from "@notionhq/client";
import * as core from "@actions/core";
import { Context } from '@actions/github/lib/context';

export async function moveIssueOnBoard(notion: Client, pageId: string, newStatus: string): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            [config.boardColumnPropName]: {
                status: { name: newStatus }
            }
        }
    });
    core.debug(JSON.stringify(response));
}

export async function updateDBLabels(notion: Client, context: Context): Promise<string[]> {
    const options = await getDBLabels(notion);
    const labelNames = context.payload.labels.map((label: any) => label.name);
    labelNames.forEach((labelName: string) => {
        if (options.find((elem: any) => elem["name"] === labelName) === null) {
            options.push({
                name: labelName,
            })
        }
    });
    const response = await notion.databases.update({
        database_id: config.pageId,
        properties: {
            labelPropName: {
                multi_select: {
                    options: options
                }
            }
        }
    });
    core.debug(JSON.stringify(response));
    return labelNames;
}

export async function getDBLabels(notion: Client): Promise<any> {
    const response = await notion.databases.retrieve({ database_id: config.pageId });
    return (response.properties[config.labelPropName] as any)["multi_select"]["options"];
}

export async function getPageLabels(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: config.labelPropName
    }) as any;
    core.debug(JSON.stringify(response));
    return response["multi_select"];
}

export async function setPageLabels(notion: Client, pageId: string, labels: any): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            [config.labelPropName]: {
                multi_select: labels,
            }
        }
    })
    core.debug(JSON.stringify(response));
}

// For some reason we only ever get one assignee instead of an array
export async function getAssignee(notion: Client, pageId: string): Promise<any> {
    const response = await notion.pages.properties.retrieve({
        page_id: pageId,
        property_id: config.assigneePropName
    }) as any;
    core.debug(response.results);

    return response.results[0]?.people ?? [];
}

export async function setAssignees(notion: Client, pageId: string, assignees: any): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            [config.assigneePropName]: {
                people: assignees,
            }
        }
    })
    core.debug(JSON.stringify(response));
}
