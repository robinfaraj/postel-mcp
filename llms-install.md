# Installing the Postel MCP server

Postel's MCP server is hosted. There is nothing to clone, build or run; installing it means adding one remote server to the client's MCP settings.

- URL: `https://www.postel.app/api/mcp`
- Transport: Streamable HTTP
- Auth: OAuth 2.1 with dynamic client registration. The client opens Postel's sign-in page the first time a tool needs the user's account. As an alternative, the user can create an API key in Postel under Settings > API Keys (it starts with `pstl_`) and send it as `Authorization: Bearer pstl_...`.

## Cline

Add this to `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "postel": {
      "type": "streamableHttp",
      "url": "https://www.postel.app/api/mcp"
    }
  }
}
```

With an API key instead of OAuth:

```json
{
  "mcpServers": {
    "postel": {
      "type": "streamableHttp",
      "url": "https://www.postel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer pstl_YOUR_API_KEY"
      }
    }
  }
}
```

Never ask the user to paste the key into the chat; have them put it in the settings file themselves.

## Check that it works

1. List the tools. There should be 17, including `search-viral-tweets`, `create-post` and `schedule-post`.
2. Call `search-viral-tweets` with `{"query": "pricing"}`. It works without signing in and returns high-performing X posts.
3. Call `get-usage`. If it asks for sign-in, complete the OAuth flow (or add the API key) and call it again.

The user connects their X, LinkedIn, Bluesky, Mastodon, YouTube or TikTok accounts in Postel under Settings > Channels before the first post. Scheduling and publishing need a paid Postel plan or trial.

## Other clients

See the README for Claude, Claude Code, Cursor, VS Code, Gemini CLI, Codex, ChatGPT and Windsurf: https://github.com/robinfaraj/postel-mcp#install
