# Github Notion Bridge

Event-based management of Github issues on Notion.

## Why?

Other exporters of Github issues into Notion gather __all__ issues on Github, then gather __all__ issues which have been synced from Github on Notion and try to find the differences between these.
This method is excessive since the Github event can tell you exactly what changed.

Another pain point is that specific Notion issue board formats are required, tools going as far as to offer templates, so their tool works.
The only assumption we make for your issue board is that it has a property which defines the columns, the rest can be configured but also offers sane defaults.

## Setup

It is strongly encouraged to do an initial setup by using the

### Notion

- [Create an integration](https://www.notion.so/my-integration)
- Create an issue board. Any further changes to the board needed will be performed automatically, so don't worry about matching a template or anything.
- [Find out the user IDs of the people on the issue board](https://developers.notion.com/reference/get-users)
- Create a relation to separate the different repositories you're adding issues from in your issue board. Take note of the ID of the page holding the issues for this specific repository.

### Github

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
          -
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
