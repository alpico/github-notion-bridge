import * as core from '@actions/core';
import contextObject from './sample_events/labeled.json';
import { Context } from '@actions/github/lib/context';
import * as issues from './issues';
import { config } from "dotenv";

config();
export const pageId = process.env.NOTION_PAGE_ID!;
export const apiKey = process.env.NOTION_API_KEY!;

type IssuesAction =
  "opened"
  | "edited"
  | "deleted"
  | "transferred"
  | "pinned"
  | "unpinned"
  | "closed"
  | "reopened"
  | "assigned"
  | "unassigned"
  | "labeled"
  | "unlabeled"
  | "locked"
  | "unlocked"
  | "milestoned"
  | "demilestoned";

type IssueCommentAction = "created" | "edited" | "deleted";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // const context = github.context
    const context = Object.assign(new Context(), contextObject);
    if (context.eventName === "issues") {
      await handleIssuesEvent(context);
    } else if (context.eventName == "issue_comment") {
      await handleIssueCommentEvent(context);
    } else {
      throw new Error("Support for '${context.eventName}' events is not planned to be implemented.");
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function handleIssuesEvent(context: Context): Promise<void> {
  switch (context.payload.action as IssuesAction) {
    case "opened": {
      await issues.open(context);
      break;
    }
    case "edited": {
      await issues.edit(context)
      break;
    }
    case "deleted": {
      await issues.deletePage(context);
      break;
    }
    case "transferred": throw new Error("`transferred` events are not yet implemented");
    case "pinned": throw new Error("`pinned` events are not yet implemented");
    case "unpinned": throw new Error("`unpinned` events are not yet implemented");
    case "closed": {
      await issues.close(context);
      break;
    }
    case "reopened": {
      await issues.reopen(context);
      break;
    }
    case "assigned": {
      await issues.assign(context);
      break;
    }
    case "unassigned": {
      await issues.unassign(context);
      break;
    }
    case "labeled": {
      await issues.label(context);
      break;
    }
    case "unlabeled": {
      await issues.unlabel(context);
      break;
    }
    case "locked": throw new Error("`locked` events are not yet implemented")
    case "unlocked": throw new Error("`unlocked` events are not yet implemented")
    case "milestoned": throw new Error("`milestoned` events are not yet implemented")
    case "demilestoned": throw new Error("`demilestoned` events are not yet implemented")
  }
}

async function handleIssueCommentEvent(context: Context): Promise<void> {
  throw new Error("Issue comment events are still a todo");
}
