import { Context } from '@actions/github/lib/context'
import { Client } from '@notionhq/client'
import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints'
import { markdownToBlocks } from '@tryfabric/martian'
import { githubLinkFromIssue } from '../main'
import { config } from '../config'
import * as core from '@actions/core'
import { updateDBLabels } from '.'

export async function open(context: Context): Promise<void> {
  const link = githubLinkFromIssue(context)
  core.info(`Creating a new issue for ${link}...`)
  const notion = new Client({ auth: config.apiKey })
  const issue = context.payload.issue
  // get the labels
  const labels = await updateDBLabels(notion, context)

  const newPage = await notion.pages.create({
    parent: {
      database_id: config.pageId
    },
    icon: {
      external: {
        url: config.issueIcon
      }
    },
    properties: {
      title: {
        title: [{ text: { content: issue?.['title'] ?? '' } }]
      },
      [config.linkPropName]: {
        url: githubLinkFromIssue(context)
      },
      [config.boardColumnPropName]: {
        status: { name: config.boardColumnDefaultVal }
      },
      [config.assigneePropName]: {
        people:
          issue?.assignees.map((user: { login: string }) => {
            return { id: config.ghNotionUserMap[user.login] }
          }) ?? {}
      },
      [config.labelPropName]: {
        multi_select: labels.map(name => {
          return { name }
        })
      },
      [config.relationPropName]: {
        relation: [{ id: config.relatedPage }]
      }
    },
    children: markdownToBlocks(issue?.body ?? '') as BlockObjectRequest[]
  })
  core.info(`Page created: ${newPage.id}`)
}
