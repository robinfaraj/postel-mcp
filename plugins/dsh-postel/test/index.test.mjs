import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import * as plugin from '../lib/index.js'
import { SKILL_CONTENT, SKILL_DESCRIPTION, SKILL_NAME, parseSkill } from '../lib/skill.js'

const here = dirname(fileURLToPath(import.meta.url))

test('named exports only, with a stable plugin name', () => {
  assert.equal(plugin.name, 'dsh-postel')
  assert.equal(typeof plugin.apply, 'function')
  assert.equal('default' in plugin, false)
})

test('resolveConnection reads the key from the configured env var', () => {
  const conn = plugin.resolveConnection(
    { apiKeyEnv: 'POSTEL_API_KEY', apiKey: '', baseUrl: 'https://www.postel.app' },
    { POSTEL_API_KEY: 'pstl_abc' },
  )
  assert.equal(conn.url, 'https://www.postel.app/api/mcp')
  assert.deepEqual(conn.headers, { Authorization: 'Bearer pstl_abc' })
  assert.equal(conn.configured, true)
  assert.equal(conn.source, 'env.POSTEL_API_KEY')
})

test('resolveConnection prefers an inline key and normalizes the base URL', () => {
  const conn = plugin.resolveConnection(
    { apiKeyEnv: 'POSTEL_API_KEY', apiKey: 'pstl_inline', baseUrl: 'https://www.postel.app/api/mcp/' },
    { POSTEL_API_KEY: 'ignored' },
  )
  assert.equal(conn.url, 'https://www.postel.app/api/mcp')
  assert.deepEqual(conn.headers, { Authorization: 'Bearer pstl_inline' })
  assert.equal(conn.source, 'config.apiKey')
})

test('without a key it connects anonymously, with no auth header', () => {
  const conn = plugin.resolveConnection({ apiKeyEnv: 'POSTEL_API_KEY' }, {})
  assert.equal(conn.configured, false)
  assert.equal(conn.url, 'https://www.postel.app/api/mcp')
  assert.deepEqual(conn.headers, {})
})

test('apply provides ctx.postel and registers the skill', () => {
  const provided = {}
  const registered = []
  const ctx = {
    logger: { info() {}, warn() {} },
    provide(key, value) { provided[key] = value },
    inject(deps, cb) {
      assert.deepEqual(deps, ['skills'])
      cb({ skills: { register(skill) { registered.push(skill); return () => {} } } })
    },
  }
  plugin.apply(ctx, { apiKey: 'pstl_k' })
  assert.equal(provided.postel.url, 'https://www.postel.app/api/mcp')
  assert.equal(provided.postel.headers.Authorization, 'Bearer pstl_k')
  assert.notEqual(provided.postel.headers, provided.postel.headers, 'each read gets its own copy')
  assert.equal(registered.length, 1)
  assert.equal(registered[0].name, 'postel-writing')
  assert.equal(registered[0].content, SKILL_CONTENT)
  assert.match(registered[0].content, /search-viral-tweets/)
  assert.match(registered[0].content, /schedule-post/)
})

test('apply skips the skill when disabled', () => {
  let injected = false
  const ctx = { logger: { info() {}, warn() {} }, provide() {}, inject() { injected = true } }
  plugin.apply(ctx, { skill: false })
  assert.equal(injected, false)
})

test('the skill is parsed from SKILL.md frontmatter', () => {
  assert.equal(SKILL_NAME, 'postel-writing')
  assert.match(SKILL_DESCRIPTION, /^Use when/)
  assert.doesNotMatch(SKILL_CONTENT, /^---/)
  assert.throws(() => parseSkill('no frontmatter'))
})

test('the bundled skill matches the repository skill', () => {
  const root = join(here, '..', '..', '..', 'skills', 'postel-writing', 'SKILL.md')
  const copy = join(here, '..', 'skills', 'postel-writing', 'SKILL.md')
  let upstream
  try { upstream = readFileSync(root, 'utf8') } catch { return } // installed from npm: no repo root
  assert.equal(readFileSync(copy, 'utf8'), upstream, 'run node scripts/sync-skill-copies.mjs')
})

test('bundle manifest points at the patch and the patch wires both rows', () => {
  const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'))
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(pkg.keywords.includes('dsh-plugin'))
  const patch = readFileSync(join(here, '..', 'cordis.patch.yml'), 'utf8')
  assert.match(patch, /name: dsh-postel/)
  assert.match(patch, /name: '@deepseek-ai\/dsh-mcp-client'/)
  assert.match(patch, /serverName: postel/)
  assert.match(patch, /url: !!js ctx\.postel\.url/)
  assert.match(patch, /headers: !!js ctx\.postel\.headers/)
})
