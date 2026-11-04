/**
 * dsh-postel provider plugin.
 *
 * Provides the `postel` service so the bundle's cordis.patch.yml can point one
 * `@deepseek-ai/dsh-mcp-client` row at Postel's hosted MCP server without
 * putting an API key in configuration: the mcp-client row injects `postel` and
 * reads `ctx.postel.url` / `ctx.postel.headers` in its `!!js` config.
 *
 * Without a key the server still answers: `search-viral-tweets` (research)
 * works anonymously, and the account tools reply that a Postel account must be
 * connected.
 *
 * It also registers the `postel-writing` skill on `ctx.skills` (when a skills
 * service is mounted) so the agent follows the research, draft, confirm,
 * schedule order and never publishes without the user's go-ahead.
 *
 * Named exports only (no default export): a stray default export makes the
 * Loader collapse the namespace and drop `inject`/`apply`.
 */
import z from '@deepseek-ai/schemastery'
import { SKILL_CONTENT, SKILL_DESCRIPTION, SKILL_NAME } from './skill.js'

/** Stable Cordis plugin name. */
export const name = 'dsh-postel'

/** Service provided by this plugin and injected by the mcp-client row. */
export const POSTEL_SERVICE = 'postel'

/** Postel's production host. The MCP endpoint is `<baseUrl>/api/mcp`. */
export const DEFAULT_BASE_URL = 'https://www.postel.app'

export const Config = z.object({
  /** Environment variable that holds the Postel API key (`pstl_...`). */
  apiKeyEnv: z.string().default('POSTEL_API_KEY'),
  /** Inline API key. Prefer `apiKeyEnv`; this exists for patch-level overrides. */
  apiKey: z.string().role('secret').default(''),
  /** Postel host. The MCP endpoint is `<baseUrl>/api/mcp`. */
  baseUrl: z.string().default(DEFAULT_BASE_URL),
  /** Register the `postel-writing` skill on ctx.skills. */
  skill: z.boolean().default(true),
})

/**
 * Resolve the connection values from config and environment.
 *
 * @param {object} config - validated plugin config.
 * @param {Record<string, string | undefined>} env - environment to read the key from.
 * @returns {{ url: string, headers: Record<string, string>, configured: boolean, source: string }}
 */
export function resolveConnection(config, env = process.env) {
  const base = String(config?.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const url = base.endsWith('/api/mcp') ? base : `${base}/api/mcp`
  const envName = String(config?.apiKeyEnv || 'POSTEL_API_KEY')
  const inline = String(config?.apiKey || '').trim()
  const fromEnv = String(env[envName] || '').trim()
  const key = inline || fromEnv
  const source = inline ? 'config.apiKey' : fromEnv ? `env.${envName}` : 'none'
  return {
    url,
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    configured: key.length > 0,
    source,
  }
}

/**
 * @param {object} ctx - plugin context.
 * @param {object} config - validated plugin config.
 */
export function apply(ctx, config) {
  const cfg = Config(config ?? {})
  const conn = resolveConnection(cfg)
  const log = ctx.logger ?? console

  if (conn.configured) {
    log.info?.(`dsh-postel: Postel MCP endpoint ${conn.url} (key from ${conn.source})`)
  } else {
    log.info?.(
      `dsh-postel: no Postel API key found, connecting to ${conn.url} without one. ` +
        `Research (search-viral-tweets) works; to draft and schedule, create a key in Postel under ` +
        `Settings > API Keys and set ${cfg.apiKeyEnv}.`,
    )
  }

  // Plain, unfrozen values on purpose: the mcp-client row validates the
  // interpolated `headers` with schemastery, which rejects frozen objects.
  // The getter hands every evaluation its own copy.
  ctx.provide(POSTEL_SERVICE, {
    url: conn.url,
    get headers() {
      return { ...conn.headers }
    },
    configured: conn.configured,
  })

  if (cfg.skill) {
    ctx.inject(['skills'], (sctx) => {
      if (typeof sctx.skills?.register !== 'function') return
      sctx.skills.register({
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        content: SKILL_CONTENT,
        source: 'runtime',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    })
  }
}
