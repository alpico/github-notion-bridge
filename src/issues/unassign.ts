import { Context } from '@actions/github/lib/context'
import { Client } from '@notionhq/client'
import { githubLinkFromIssue, notionPageIdsFromGithubLink } from '../main'
import { config } from '../config'
import { getAssignee, setAssignees } from '.'
import * as core from '@actions/core'

export async function unassign(context: Context): Promise<void> {
  const notion = new Client({ auth: config.apiKey })
  const link = githubLinkFromIssue(context)
  const issuePageIds = await notionPageIdsFromGithubLink(
    notion,
    config.pageId,
    link
  )
  const ghUser = context.payload.assignee.login
  core.info(`Unassigning user ${ghUser} from issue ${link}...`)
  const notionUser = config.ghNotionUserMap[ghUser]
  issuePageIds.forEach(async issuePageId => {
    const assignee = await getAssignee(notion, issuePageId)
    if (assignee['id'] !== notionUser) {
      return
    }
    await setAssignees(notion, issuePageId, [])
  })
}
