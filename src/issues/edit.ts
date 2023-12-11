import { Context } from "@actions/github/lib/context";
import { Client } from "@notionhq/client"
import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { notionPageIdsFromGithubLink, githubLinkFromIssue } from "../main";
import { config } from "../config";
import { markdownToBlocks } from "@tryfabric/martian";
import * as core from "@actions/core";

export async function edit(context: Context): Promise<void> {
    const notion = new Client({ auth: config.apiKey });
    const link = githubLinkFromIssue(context);
    core.info(`Received edit event for issue ${link}...`);
    const issuePageIds = await notionPageIdsFromGithubLink(notion, config.pageId, link);

    issuePageIds.forEach(async issuePageId => {
        core.debug(`Updating notion page {issuePageId}...`);
        if (context.payload.changes.title?.from) {
            await updateTitle(notion, issuePageId, context.payload.issue?.["title"] ?? "");
        }
        if (context.payload.changes.body?.from) {
            await updateBody(notion, issuePageId, context.payload.issue?.body ?? "")
        }
    })
}

async function updateTitle(notion: Client, pageId: string, new_title: string): Promise<void> {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            "title": {
                title: [{ text: { content: new_title } }]
            }
        },
    })
    console.log(response);
}

async function updateBody(notion: Client, pageId: string, newBody: string): Promise<void> {
    await deleteChildBlocks(notion, pageId);
    const response = await notion.blocks.children.append({
        block_id: pageId,
        children: markdownToBlocks(newBody) as Array<BlockObjectRequest>,
    })
    console.log(response);
}

async function deleteChildBlocks(notion: Client, pageId: string): Promise<void> {
    // Get child blocks
    const childBlocks = await notion.blocks.children.list({ block_id: pageId });
    // Remove all child blocks. Use for loop to ensure synchronicity because
    // otherwise we get 409s.
    for (const block of childBlocks.results) {
        await notion.blocks.delete({ block_id: block.id });
    };
}
