# Postel agent plugin

This folder is a portable [Agent Plugins v1](https://agent-plugins.org) package for [Postel](https://www.postel.app/?utm_source=agent-plugins&utm_medium=readme&utm_campaign=agent-distribution): `plugin.json`, `mcp.json` and one skill. It works in Hermes Agent and in other clients that read the format, such as Perplexity Computer custom plugins and NanoClaw.

Postel finds posts that went viral in your niche, writes your version in your own voice, and schedules or publishes it to X (Twitter), LinkedIn, Bluesky, Mastodon, YouTube and TikTok after you approve.

## What's included

- **Postel's hosted MCP server**, `https://www.postel.app/api/mcp` (Streamable HTTP). 17 tools: viral post research, drafts and threads, media from URLs, LinkedIn first comments, up to 25 posts per call, scheduling and publishing.
- **The `postel-writing` skill**, which teaches the agent the order of work: research, draft, confirm text, network and time with you, then schedule.

The package has no code of its own. It is configuration plus one Markdown skill.

## Hermes Agent

1. Install the plugin:

   ```
   hermes plugins install postel --enable
   ```

   If your Hermes doesn't list it yet, step 2 on its own still gives you all of Postel's tools.

2. Sign in to Postel:

   ```
   hermes mcp add postel --url https://www.postel.app/api/mcp --auth oauth --connect-timeout 300
   ```

   Hermes opens Postel's sign-in in your browser. Without signing in, `search-viral-tweets` still works; every other tool asks you to connect an account.

3. Start a new session and ask: "What's going viral about cold email this month? Write my take for LinkedIn."

If a tool later asks you to reconnect, run `hermes mcp login postel`. Scheduled and unattended runs can't open a browser, so they report it instead of hanging.

The package marks the `postel` server as untrusted, so Hermes asks you before every tool that isn't read-only (saving, scheduling, publishing or deleting a post) and blocks those tools in unattended runs.

## Perplexity Computer

Plugins, **Add custom**, then paste `https://github.com/robinfaraj/postel-mcp` (or upload a zip of this folder). Perplexity signs in to Postel with OAuth.

## NanoClaw

Copy this folder into your NanoClaw templates, or install just the skill with `npx skills add robinfaraj/postel-mcp`. NanoClaw keeps API keys in its credentials proxy, never in this package.

## Data and privacy

- Every tool call goes to Postel's server at `www.postel.app`, signed in as you. The tool list comes from that server at run time, so a pinned commit of this package doesn't cover it.
- Research results (posts from Postel's viral library) and your drafts, voice profiles and schedule join the conversation, so they reach the model provider your agent uses.
- Write tools change your Postel workspace: `create-post`, `create-posts`, `update-post`, `attach-media` and `delete-post` change drafts; `schedule-post` and `publish-post` post to your connected networks. `generate-post` and `refine-post` use 1 Postel AI credit each.
- Postel posts only through each network's official API. It doesn't read your feed or messages, and it doesn't like, reply or follow.
- Your agent stores and refreshes the OAuth tokens. The package stores nothing.

To disconnect, run `hermes mcp remove postel` and `hermes plugins disable postel`.

[Privacy policy](https://www.postel.app/legal/privacy-policy) · [Terms](https://www.postel.app/legal/terms) · Help: robin.faraj@postel.app

MIT licensed. Maintained by Postel; this folder mirrors `skills/postel-writing` at the repository root (`node scripts/sync-skill-copies.mjs`).
