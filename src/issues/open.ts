import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { markdownToBlocks } from "@tryfabric/martian";
import { githubLinkFromIssue } from '../main'
import { config } from "../config";
import * as core from "@actions/core";

export async function open(context: Context): Promise<void> {
    const link = githubLinkFromIssue(context);
    core.info(`Creating a new issue for ${link}...`);
    const notion = new Client({ auth: config.apiKey });
    const issue = context.payload.issue;
    const repoName = await updateRepoTags(notion, context);
    const newPage = await notion.pages.create({
        parent: {
            database_id: config.pageId,
        },
        "icon": {
            external: {
                url: config.issueIcon,
            }
        },
        properties: {
            "title": {
                title: [{ text: { content: issue?.["title"] ?? "" } }]
            },
            [config.linkPropName]: {
                url: githubLinkFromIssue(context)
            },
            [config.boardColumnPropName]: {
                status: { name: "Backlog" },
            },
            [config.repoPropName]: {
                select: { name: repoName }
            }
        },
        children: markdownToBlocks(issue?.body ?? "") as Array<BlockObjectRequest>,
    });
    core.info(`Page created: ${newPage.id}`);
}

async function updateRepoTags(notion: Client, context: Context): Promise<string> {
    const options = await getRepoTags(notion);
    const repoName = context.payload.repository?.name ?? "";
    if (options.find((elem: any) => elem["name"] === repoName) === null) {
        options.push({ name: repoName })
        const response = await notion.databases.update({
            database_id: config.pageId,
            properties: {
                [config.repoPropName]: {
                    select: {
                        options: options
                    }
                }
            }
        });
        core.debug(JSON.stringify(response));
    }
    return repoName;
}

async function getRepoTags(notion: Client): Promise<any> {
    const response = await notion.databases.retrieve({ database_id: config.pageId });
    const repo = response.properties[config.repoPropName] as any;
    return repo["select"]["options"];
}
