# dsh-postel

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin for [Postel](https://www.postel.app/?utm_source=deepseek-harness&utm_medium=readme&utm_campaign=agent-distribution). It connects the agent to Postel's hosted MCP server, so it can search a library of posts that went viral in your niche, write your version in your own voice, and save, schedule or publish posts to X (Twitter), LinkedIn, Bluesky and Mastodon after you approve them.

## Install

From GitHub:

```bash
dsh plugin --profile web add "github:robinfaraj/postel-mcp#path:/plugins/dsh-postel"
```

Or from npm:

```bash
dsh plugin --profile web add dsh-postel
```

Restart the profile. Research works right away, without an account: ask *"What's going viral about cold email this month?"*

To draft, schedule and publish, create an API key in Postel under **Settings > API Keys** and export it before starting dsh, or put it in `$DSH_HOME/.env`:

```bash
export POSTEL_API_KEY=pstl_your_key
dsh web
```

Keys start with `pstl_` and belong to one Postel workspace. Connect your networks in Postel under **Settings > Channels** before your first post.

## What you get

The bundle mounts two rows:

| Row | Package | Role |
|---|---|---|
| `postel` | `dsh-postel` (this package) | Reads the optional API key, exposes `ctx.postel` (`url`, `headers`), and registers the `postel-writing` skill. |
| `postel-mcp` | `@deepseek-ai/dsh-mcp-client` (ships with dsh) | Connects to `https://www.postel.app/api/mcp` over Streamable HTTP and registers the server's tools. |

The model sees Postel's 17 tools as `mcp__postel__*`:

| Tool | What it does |
|---|---|
| `search-viral-tweets` | Search Postel's library of X posts that went viral, by topic (no account needed) |
| `generate-post`, `refine-post` | Write a post or X thread in your saved voice, or suggest a rewrite (1 AI credit each) |
| `create-post`, `create-posts`, `update-post`, `delete-post`, `attach-media` | Save and edit drafts, up to 25 per call, with images or video from URLs and LinkedIn first comments |
| `schedule-post`, `publish-post` | Schedule a draft for a time, or post it now |
| `list-posts`, `get-post`, `get-schedule` | Read drafts, scheduled posts, your timezone and posting slots |
| `list-brands`, `get-brand-sources`, `get-x-profiles`, `get-usage` | Your topics, saved sources, voice profiles, plan and credits |

The tool list comes from the server at connect time, so new Postel tools appear without a plugin update.

The `postel-writing` skill teaches the order of work: research, draft, then confirm the exact text, network and time with you before anything is scheduled or published. It is the same skill as [`skills/postel-writing`](../../skills/postel-writing/SKILL.md) in this repository.

## Configuration

Override the `postel` row in your profile's `cordis.patch.yml` (`$DSH_HOME/profiles/web/cordis.patch.yml`). A bare `id:` configures the existing row:

```yaml
- id: postel
  config:
    apiKeyEnv: POSTEL_API_KEY          # env var that holds the key (default)
    skill: true                        # register the postel-writing skill
```

| Field | Default | Description |
|---|---|---|
| `apiKeyEnv` | `POSTEL_API_KEY` | Environment variable read at boot for the API key. |
| `apiKey` | `''` | Inline key. Prefer the env var; this exists for patch-level overrides. |
| `baseUrl` | `https://www.postel.app` | Postel host. The MCP endpoint is `<baseUrl>/api/mcp`. |
| `skill` | `true` | Register the `postel-writing` skill on `ctx.skills`. |

Without a key the `postel-mcp` row connects anonymously: research works and the account tools reply that a Postel account is needed.

## Network and data

- Every tool call goes to `https://www.postel.app/api/mcp`, with your API key as a bearer token when one is set. The plugin makes no other network calls and has no install scripts.
- Write tools change your Postel workspace, and `schedule-post` and `publish-post` post to the networks you connected. Postel posts only through each network's official API.
- What the tools return (viral posts, your drafts, voice profiles and schedule) joins the conversation and reaches the model provider your profile uses.

## Development

```bash
cd plugins/dsh-postel
npm install
npm test
```

Link a local checkout into a profile:

```bash
dsh plugin --profile web add /absolute/path/to/postel-mcp/plugins/dsh-postel
```

After editing `skills/postel-writing/SKILL.md` at the repository root, run `node scripts/sync-skill-copies.mjs` to update the copy in this package.

## License

MIT, same as the rest of this repository.
