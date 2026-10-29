# Postel MCP server: LinkedIn, X (Twitter), Bluesky and Mastodon

A hosted MCP server that lets Claude, Claude Code, Cursor and other MCP clients draft posts in your voice and schedule or publish them to LinkedIn, X (Twitter), Bluesky and Mastodon. It posts through each network's official API after you approve, so there are no cookies to copy, no browser automation and nothing to run locally.

[Postel](https://www.postel.app) is a writing and scheduling tool for people who post as themselves: founders, consultants and creators. This repository holds the public metadata for its MCP server: the Claude Code plugin, the MCP Registry entry and these setup instructions. The server itself is hosted by Postel.

| | |
|---|---|
| Server URL | `https://www.postel.app/api/mcp` |
| Claude connector | [Postel in Claude's connector directory](https://claude.ai/directory/connectors/www-postel-app) |
| Transport | Streamable HTTP |
| Authentication | OAuth 2.1 with dynamic client registration, or an API key as a bearer token |
| Registry name | `app.postel/postel` |

## Install

### Claude (web and desktop)

Open [Postel in Claude's connector directory](https://claude.ai/directory/connectors/www-postel-app), click **Connect** and sign in to Postel.

Or add it by hand: open Customize > Connectors, click **+**, choose **Add custom connector**, enter `https://www.postel.app/api/mcp` and sign in when asked.

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

Run `/mcp` to sign in. Add `--scope user` to use it in every project. To use an API key instead:

```bash
claude mcp add --transport http postel https://www.postel.app/api/mcp --header "Authorization: Bearer pstl_YOUR_API_KEY"
```

### Cursor, VS Code, Windsurf and other clients

Add this to your MCP config (`~/.cursor/mcp.json`, `.cursor/mcp.json`, or your client's equivalent):

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

Create the key in Postel under Settings > API Keys. Keys start with `pstl_` and are scoped to one workspace. Any client that supports remote MCP servers over Streamable HTTP works: point it at the server URL and let it run the OAuth sign-in, or send the bearer token.

Before your first post, connect your networks in Postel under Settings > Channels.

## LinkedIn MCP server

Draft LinkedIn posts in your voice and publish or schedule them to your personal LinkedIn profile through LinkedIn's official API.

- Text up to 3,000 characters
- Images or a video from public URLs (up to 20 images, or one video)
- A first comment of up to 1,250 characters, posted right after the post goes out
- Up to 25 posts in one call, each with its own date

It does not read your feed, messages or profiles, and it never asks for your LinkedIn password or cookies. Posting as a LinkedIn company Page has been submitted to LinkedIn for review; until it's approved, posts go to personal profiles. Setup guide: [LinkedIn MCP server](https://www.postel.app/linkedin-mcp-server) and [connect Claude to LinkedIn](https://www.postel.app/connect-claude-to-linkedin).

| | Postel | Browser-session LinkedIn MCP servers | Bring-your-own-app servers |
|---|---|---|---|
| How it reaches LinkedIn | Official API, hosted | Your logged-in browser session and cookies | Official API, your own developer app |
| Publishes and schedules posts | Yes | Usually not | Yes |
| Reads profiles, feed, messages | No | Yes | No |
| Account risk | Low | Their READMEs warn accounts can be restricted | Low |
| Setup | One URL | Local install and browser login | Developer app, tokens renewed every 60 days |

## X (Twitter) MCP server

Draft X posts and threads in your voice, attach media and schedule or publish them to your X account. You don't need an X developer account, API keys or X API credits.

- Single posts or full threads, scheduled as one unit
- Up to 4 images, or one video or GIF, from public URLs
- `search-viral-tweets` finds high-performing X posts by topic in Postel's library, without signing in
- Up to 25 posts in one call, each with its own date

It does not read your timeline, mentions or DMs, and it does not like, reply, repost or follow. X's own hosted MCP server is for reading and searching X with your own developer app; this one is for writing and scheduling. Setup guide: [X MCP server](https://www.postel.app/x-mcp-server) and [connect Claude to X](https://www.postel.app/connect-claude-to-x).

## Bluesky and Mastodon MCP server

The same server posts to Bluesky and Mastodon. Connect Bluesky with your handle and an app password, or Mastodon on any server, then set `platform` to `"bluesky"` or `"mastodon"` on a post.

- Bluesky: 300 characters, threads, up to 4 images (no video)
- Mastodon: your server's character limit (500 by default), threads, up to 4 images or a video or GIF
- No first comments on either

## Tools

All 17 tools. `search-viral-tweets` works without an account; the rest need a signed-in Postel account or an API key.

### Posts

| Tool | What it does |
|---|---|
| `list-posts` | Lists posts, with an optional status filter |
| `get-post` | Returns one post by ID |
| `create-post` | Saves text as a new draft for any connected network, with optional images or video from public URLs and an optional LinkedIn first comment |
| `create-posts` | Saves up to 25 posts in one call, each with its own network, media and first comment, and schedules the ones with a date |
| `attach-media` | Downloads an image or video from a public URL and adds it to a draft |
| `update-post` | Edits a draft |
| `delete-post` | Deletes a post and cancels its schedule |
| `schedule-post` | Schedules a draft for a future time, optionally setting a LinkedIn first comment |
| `publish-post` | Publishes a draft now |

### Writing and research

| Tool | What it does |
|---|---|
| `generate-post` | Writes a post or a thread in your voice and saves it as a draft (1 AI credit) |
| `refine-post` | Suggests a rewrite of a draft from your instructions (1 AI credit) |
| `search-viral-tweets` | Finds high-performing X posts by topic in Postel's library. No sign-in needed |

### Context

| Tool | What it does |
|---|---|
| `list-brands` | Lists your brands and topics |
| `get-brand-sources` | Returns background sources for a brand |
| `get-x-profiles` | Returns your X and LinkedIn voice profiles |
| `get-schedule` | Returns your weekly posting slots and timezone |
| `get-usage` | Shows your AI credit balance |

## Example prompts

- "Draft a LinkedIn post about the pricing change we shipped this week, and put the changelog link in the first comment."
- "Turn this blog post into an X thread and schedule it for Thursday at 3pm New York time."
- "Write the same announcement for X, LinkedIn and Bluesky, each in its own style."
- "Turn these five notes into posts for Monday to Friday at 9am and attach this screenshot to the first one."
- "Find viral posts about bootstrapping a SaaS and tell me what the best hooks have in common."
- "Show me what is scheduled for next week."

## What it does not do

- It does not read timelines, feeds, mentions, DMs or messages on any network.
- It does not like, reply, follow, comment on other people's posts or send connection requests.
- Images and video are added from public URLs. Local files and LinkedIn PDF carousels go in the Postel editor.
- First comments are LinkedIn only through MCP.
- Threads work on X, Bluesky and Mastodon, not LinkedIn.
- Research searches Postel's indexed library of X posts, not live X.

## Plans and limits

- The MCP server is included in every Postel plan. Plans cost $1 for the first 7 days, then from $29 a month. See [pricing](https://www.postel.app/#pricing).
- `generate-post` and `refine-post` use 1 AI credit each. Saving text your assistant wrote uses none.
- Your MCP client asks before it runs a tool that schedules or publishes, unless you turn that off. If your workspace requires approval, scheduling submits the post for an owner or admin to approve in Postel.
- API keys are limited to 60 requests per minute.

## FAQ

**Is there an official LinkedIn MCP server?** Not as of October 2026. LinkedIn hasn't published one, so every LinkedIn MCP server, this one included, is third-party.

**Can Claude post to LinkedIn or X?** Yes, with this server connected. Claude drafts the post, you approve it, and Postel publishes or schedules it.

**Do I need an X API key or a LinkedIn developer app?** No. You connect your accounts to Postel once, and the server uses those connections.

**Does it scrape LinkedIn or use my cookies?** No. Posts go out through LinkedIn's official API with the permission you grant on LinkedIn's consent screen.

## Links

- [Postel MCP server: setup guide and FAQ](https://www.postel.app/postel-mcp-server)
- [LinkedIn MCP server](https://www.postel.app/linkedin-mcp-server)
- [X MCP server](https://www.postel.app/x-mcp-server)
- [Connect Claude to LinkedIn](https://www.postel.app/connect-claude-to-linkedin)
- [Connect Claude to X](https://www.postel.app/connect-claude-to-x)
- [Privacy policy](https://www.postel.app/en/legal/privacy-policy) · [Terms](https://www.postel.app/en/legal/terms)
- Support: [contact form](https://www.postel.app/en/contact)

## License

The files in this repository are released under the [MIT License](LICENSE). The Postel service is covered by its own terms.
