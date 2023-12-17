//! Loads in the data from the .env

import { config as dotconfig } from 'dotenv'
import { Config } from '.'

export function config(): Config {
  dotconfig()
  const ghTokenTmp = process.env.GITHUB_API_TOKEN
  if (!ghTokenTmp) {
    throw new Error('Please add a GitHub access token to your .env file')
  }
  const ghToken = ghTokenTmp
  const pageIdTmp = process.env.NOTION_PAGE_ID
  if (!pageIdTmp) {
    throw new Error('Please add a pageId to your .env file')
  }
  const pageId = pageIdTmp
  const apiKeyTmp = process.env.NOTION_API_KEY
  if (!apiKeyTmp) {
    throw new Error('Please add a notion API key to your .env file')
  }
  const apiKey = apiKeyTmp
  const labelPropName = process.env.GH_LABEL_PROP_NAME ?? 'GitHub Labels'
  const linkPropName = process.env.GH_LINK_PROP_NAME ?? 'GitHub Link'
  const assigneePropName = process.env.ASSIGNEE_PROP_NAME ?? 'Assignees'
  const boardColumnPropName = process.env.BOARD_COLUMN_PROP_NAME ?? 'Status'
  const boardColumnDefaultVal =
    process.env.BOARD_COLUMN_DEFAULT_VAL ?? 'Backlog'
  const boardColumnDoneVal = process.env.BOARD_COLUMN_DONE_VAL ?? 'Done'
  const boardColumnReopenedVal =
    process.env.BOARD_COLUMN_REOPENED_VAL ?? 'In progress'
  const relatedPageTmp = process.env.RELATED_PAGE
  if (!relatedPageTmp) {
    throw new Error(
      'Please specify a related page (e.g. "GithubRepo") for a cleaner database'
    )
  }
  const relatedPage = relatedPageTmp
  const relationPropNameTmp = process.env.RELATION_PROP_NAME
  if (!relationPropNameTmp) {
    throw new Error(
      'Please specify the property name on which the relation is defined'
    )
  }
  const relationPropName = relationPropNameTmp
  const ghNotionUserMap = JSON.parse(process.env.GITHUB_NOTION_USER_MAP ?? '')
  const issueIcon =
    process.env.NOTION_ISSUE_ICON ??
    'https://www.notion.so/images/external_integrations/github-icon.png'

  return {
    ghToken,
    pageId,
    apiKey,
    labelPropName,
    linkPropName,
    assigneePropName,
    boardColumnPropName,
    boardColumnDefaultVal,
    boardColumnDoneVal,
    boardColumnReopenedVal,
    relationPropName,
    relatedPage,
    issueIcon,
    ghNotionUserMap
  }
}
