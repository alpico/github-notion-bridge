import { Context } from '@actions/github/lib/context'
import { Client } from '@notionhq/client'
import { notionPageIdsFromGithubLink, githubLinkFromIssue } from '../main'
import { config } from '../config'
import { markdownToRichText } from '@tryfabric/martian'
import * as core from '@actions/core'

export async function create(context: Context): Promise<void> {
  const notion = new Client({ auth: config.apiKey })
  const link = githubLinkFromIssue(context)
  core.info(`Received create comment event for issue ${link}...`)
  const issuePageIds = await notionPageIdsFromGithubLink(
    notion,
    config.pageId,
    link
  )
  const login = context.payload.comment?.user.login ?? ''
  const author_url = context.payload.comment?.user.html_url ?? ''
  const url = context.payload.comment?.html_url ?? ''
  const header = `[@${login}](${author_url}) [commented](${url}): `
  const body = context.payload.comment?.body ?? ''

  for (const issuePageId of issuePageIds) {
    core.debug(`Updating notion page ${issuePageId}...`)
    await notion.comments.create({
      parent: { page_id: issuePageId },
      rich_text: markdownToRichText(header + body)
    })
  }
}
