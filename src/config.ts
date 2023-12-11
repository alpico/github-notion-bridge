//! Loads in the data from the .env

import { config } from "dotenv";

config();

const ghTokenTmp = process.env.GITHUB_API_TOKEN;
if (!ghTokenTmp) {
    throw new Error("Please add a Github access token to your .env file");
}
export const ghToken = ghTokenTmp!;
const pageIdTmp = process.env.NOTION_PAGE_ID;
if (!pageIdTmp) {
    throw new Error("Please add a pageId to your .env file");
}
export const pageId = pageIdTmp!;
const apiKeyTmp = process.env.NOTION_API_KEY!;
if (!apiKeyTmp) {
    throw new Error("Please add a notion API key to your .env file");
}
export const apiKey = apiKeyTmp!;
export const labelPropName = process.env.GH_LABEL_PROP_NAME ?? "Github Labels";
export const linkPropName = process.env.GH_LINK_PROP_NAME ?? "Github Link";
export const repoPropName = process.env.GH_REPO_PROP_NAME ?? "Repository";
export const assigneePropName = process.env.ASSIGNEE_PROP_NAME ?? "Assignees";
export const boardColumnPropName = process.env.BOARD_COLUMN_PROP_NAME ?? "Status";
export const boardColumnDefaultVal = process.env.BOARD_COLUMN_DEFAULT_VAL ?? "Backlog";
export const boardColumnDoneVal = process.env.BOARD_COLUMN_DONE_VAL ?? "Done";
export const boardColumnReopenedVal = process.env.BOARD_COLUMN_REOPENED_VAL ?? "In Progress";
export const ghNotionUserMap = JSON.parse(process.env.GITHUB_NOTION_USER_MAP ?? "");
export const issueIcon = process.env.NOTION_ISSUE_ICON ?? "https://www.notion.so/images/external_integrations/github-icon.png";
