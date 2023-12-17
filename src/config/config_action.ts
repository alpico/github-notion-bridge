//! Loads in data from the Github Action API

import { Config } from '.'
import * as core from '@actions/core'

export function config(): Config {
  return {
    ghToken: core.getInput('gh_token'),
    pageId: core.getInput('notion_page_id'),
    apiKey: core.getInput('notion_api_key'),
    labelPropName: core.getInput('gh_label_prop_name'),
    linkPropName: core.getInput('gh_link_prop_name'),
    assigneePropName: core.getInput('gh_assignee_prop_name'),
    boardColumnPropName: core.getInput('board_column_prop_name'),
    boardColumnDefaultVal: core.getInput('board_column_default_val'),
    boardColumnDoneVal: core.getInput('board_column_done_val'),
    boardColumnReopenedVal: core.getInput('board_column_reopened_val'),
    relationPropName: core.getInput('relation_prop_name'),
    relatedPage: core.getInput('related_page'),
    ghNotionUserMap: JSON.parse(core.getInput('gh_notion_user_map')),
    issueIcon: core.getInput('notion_issue_icon_url')
  }
}
