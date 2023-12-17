import { config as config_local } from './config_local'
import { config as config_action } from './config_action'
import * as core from '@actions/core'

export type Config = {
  ghToken: string
  pageId: string
  apiKey: string
  labelPropName: string
  linkPropName: string
  assigneePropName: string
  boardColumnPropName: string
  boardColumnDefaultVal: string
  boardColumnDoneVal: string
  boardColumnReopenedVal: string
  issueIcon: string
  relationPropName: string
  relatedPage: string
  ghNotionUserMap: Record<string, string>
}

let configTmp: Config
if (process.argv.find(x => x === '--local') !== undefined) {
  configTmp = config_local()
} else {
  core.info('Using action configuration...')
  configTmp = config_action()
}

export const config = configTmp

core.info(JSON.stringify(configTmp))
