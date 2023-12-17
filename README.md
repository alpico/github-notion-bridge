# GitHub Notion Bridge

Event-based management of GitHub issues on Notion.

## Why?

Other exporters of GitHub issues into Notion gather __all__ issues on GitHub, then gather __all__ issues which have been synced from GitHub on Notion and try to find the differences between these.
This method is excessive since the GitHub event can tell you exactly what changed.

Another pain point is that specific Notion issue board formats are required, tools going as far as to offer templates, so their tool works.
The only assumption we make for your issue board is that it has a property which defines the columns, the rest can be configured but also offers sane defaults.

## Setup

It is strongly encouraged to do an initial setup by using the [issue importer](https://github.com/alpico/github-notion-importer).

### Notion

- [Create an integration](https://www.notion.so/my-integration)
- Create an issue board.
- [Find out the user IDs of the people on the issue board](https://developers.notion.com/reference/get-users)
- Create a relation to separate the different repositories you're adding issues from in your issue board. Take note of the ID of the page holding the issues for this specific repository.
- Any further changes to the board needed will be performed automatically, so don't worry about matching a template or anything.

### GitHub

- [Create an access token with read permissions on the repository you want to export issues from](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## Usage

You can use the tool as an action, but also run it locally.

### Action

Include the following in your workflow file:

```yaml
jobs:
  bridge:
    runs-on: ubuntu-latest
    steps:
      - uses: "alpico/github-notion-bridge"
        with:
          gh_token: ${{ secrets.GH_TOKEN }}
          notion_page_id: "83fbbd2006ec436fa76579837e795bab"
          # Make sure this is one line, otherwise GitHub doesn't parse it correctly
          gh_notion_user_map: '{"aSillyName":"3ab2cd1ef-aaaa-bbbb", "someoneElse": "aaaabbbb-cccc-0000"}'
          board_column_prop_name: "Status"
          relation_prop_name: "Project"
          related_page: "1ab345890abcdef"
```

### Local

Make sure you have the `.env` set up correctly.

If you want to test out the different kinds of events, there are sample events in the `src/sample_events` folder.
Feel free to edit these and you can then see what happens when you trigger these events by using:

```text
ts-node src/index.ts --local [eventType]
```

where `eventType` can be any of the following:

- assigned
- closed
- comment_created
- comment_deleted
- comment_edited
- deleted
- edit_body
- edit_title
- labeled
- opened
- reopened
- unassigned
- unlabeled

## Limitations

### The GitHub Notion user map needs to be written in one line

This is a GitHub limitation and can't be fixed inside this action, unfortunately.

### Race Conditions when emitting many similar events at once

GitHub runs all actions in parallel, so if you open an issue and add some labels, then there will be issues with the labels attempting to overwrite each other.

Therefore, we don't get the labels and the assignees from the event, but instead fetch them from the issue object and make sure to write all of them at once.

You shouldn't see any issues with this but this is the reason why the open event also writes as much data as it can.
