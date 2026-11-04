/**
 * The `postel-writing` skill registered on `ctx.skills`.
 *
 * The text is the same SKILL.md that ships at the root of robinfaraj/postel-mcp
 * (copied into this package by scripts/sync-skill-copies.mjs), read once at
 * load time from the package's own files. Frontmatter is split off: the name
 * and description become the registration fields, the body is the content.
 */
import { readFileSync } from 'node:fs'

const raw = readFileSync(new URL('../skills/postel-writing/SKILL.md', import.meta.url), 'utf8')

/**
 * @param {string} text
 * @returns {{ name: string, description: string, body: string }}
 */
export function parseSkill(text) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text)
  if (!match) throw new Error('postel-writing SKILL.md has no frontmatter')
  const field = (key) => {
    const line = match[1].split('\n').find((l) => l.startsWith(`${key}:`))
    return line ? line.slice(key.length + 1).trim() : ''
  }
  return { name: field('name'), description: field('description'), body: text.slice(match[0].length).trim() }
}

const parsed = parseSkill(raw)

export const SKILL_NAME = parsed.name
export const SKILL_DESCRIPTION = parsed.description
export const SKILL_CONTENT = parsed.body
