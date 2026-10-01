# Postel MCP server

Draft, schedule and publish X (Twitter) and LinkedIn posts from Claude, Cursor and other MCP clients.

[Postel](https://www.postel.app) is a writing and scheduling tool for people who post as themselves: founders, consultants and creators. Its hosted MCP server lets an AI assistant research high-performing X posts, draft posts and threads in your saved voice, and schedule or publish them to your X account and your personal LinkedIn profile once you approve.

This repository holds the public metadata for that server: the Claude plugin, the MCP Registry entry and setup instructions. The server itself is hosted by Postel; there is nothing to run locally.

| | |
|---|---|
| Server URL | `https://www.postel.app/api/mcp` |
| Transport | Streamable HTTP |
| Authentication | OAuth 2.1 with dynamic client registration, or an API key as a bearer token |
| Registry name | `app.postel/postel` |

## Setup

You need a Postel account. Connect your X account, your LinkedIn profile or both under Settings > Channels.

### Claude Code plugin

```
/plugin marketplace add robinfaraj/postel-mcp
/plugin install postel@postel
```

Then run `/mcp` and sign in to Postel. The plugin adds the server and a `postel-writing` skill that teaches Claude the drafting and scheduling workflow.

### Claude Code without the plugin

```bash
claude mcp add --transport http postel https://www.postel.app/api/mcp
```

Run `/mcp` to sign in. To use an API key instead:

```bash
claude mcp add --transport http postel https://www.postel.app/api/mcp --header "Authorization: Bearer pstl_YOUR_API_KEY"
```

### Claude (web and desktop)

Open Customize > Connectors, click **+**, choose **Add custom connector**, enter `https://www.postel.app/api/mcp` and sign in to Postel when asked.

### Cursor

Add this to your MCP settings (`~/.cursor/mcp.json` or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "postel": {
      "url": "https://www.postel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer pstl_YOUR_API_KEY"
      }
    }
  }
}
```

Create the key in Postel under Settings > API Keys. Keys start with `pstl_` and are scoped to one workspace.

### Other clients

Any client that supports remote MCP servers over Streamable HTTP works. Point it at the server URL above and either let it run the OAuth sign-in or send `Authorization: Bearer pstl_YOUR_API_KEY`.

## Tools

### Posts

| Tool | What it does |
|---|---|
| `list-posts` | Lists posts, with an optional status filter |
| `get-post` | Returns one post by ID |
| `create-post` | Saves text as a new draft |
| `update-post` | Edits a draft |
| `delete-post` | Deletes a post and cancels its schedule |
| `schedule-post` | Schedules a draft for a future time |
| `publish-post` | Publishes a draft now |

### Writing and research

| Tool | What it does |
|---|---|
| `generate-post` | Writes an X post, an X thread or a LinkedIn post in your voice and saves it as a draft |
| `refine-post` | Suggests a rewrite of a draft from your instructions |
| `search-viral-tweets` | Finds high-performing X posts by topic in Postel's library |

### Context

| Tool | What it does |
|---|---|
| `list-brands` | Lists your brands and topics |
| `get-brand-sources` | Returns background sources for a brand |
| `get-x-profiles` | Returns your voice profiles |
| `get-schedule` | Returns your weekly posting slots and timezone |
| `get-usage` | Shows usage and plan limits |

## Example prompts

- "Find viral posts about bootstrapping a SaaS and tell me what the best hooks have in common."
- "Draft a LinkedIn post about the pricing change we shipped this week."
- "Write a thread about what we learned from our last launch."
- "Show me what is scheduled for next week."
- "Schedule that post for Tuesday at 9am Berlin time."

## What it does not do

- It does not read your X timeline, mentions or DMs, or your LinkedIn feed or messages.
- It does not like, reply, follow, comment or send connection requests.
- LinkedIn posts go to personal profiles only, not company pages.
- Images, video, documents and LinkedIn first comments are added in the Postel editor, not through MCP.
- Research searches Postel's indexed library of X posts, not live X.

## Plans and limits

- Drafting, research and reading posts work on any plan. AI generation counts against your monthly quota.
- Scheduling and publishing need a paid plan or trial. See [pricing](https://www.postel.app/#pricing).
- API keys are limited to 60 requests per minute.

## Links

- [Setup guide and FAQ](https://www.postel.app/postel-mcp-server)
- [LinkedIn MCP server](https://www.postel.app/linkedin-mcp-server)
- [X MCP server](https://www.postel.app/x-mcp-server)
- [Connect Claude to LinkedIn](https://www.postel.app/connect-claude-to-linkedin)
- [Privacy policy](https://www.postel.app/en/legal/privacy-policy) · [Terms](https://www.postel.app/en/legal/terms)
- Support: [contact form](https://www.postel.app/en/contact)

## License

The files in this repository are released under the [MIT License](LICENSE). The Postel service is covered by its own terms.
