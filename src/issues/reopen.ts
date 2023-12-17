import { Context } from '@actions/github/lib/context'
import { Client } from '@notionhq/client'
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from '../main'
import { config } from '../config'
import { moveIssueOnBoard } from '.'
import * as core from '@actions/core'

export async function reopen(context: Context): Promise<void> {
  const notion = new Client({ auth: config.apiKey })
  const link = githubLinkFromIssue(context)
  core.info(`Reopening issue ${link}...`)
  const issuePageIds = await notionPageIdsFromGithubLink(
    notion,
    config.pageId,
    link
  )
  for (const issuePageId of issuePageIds) {
    core.debug(`Updating notion page ${issuePageId}...`)
    await moveIssueOnBoard(notion, issuePageId, config.boardColumnReopenedVal)
  }
}
