#!/usr/bin/env node
// Copies skills/postel-writing/SKILL.md into the packages that need their own
// copy (they are installed from a subdirectory, so they can't reach the root).
// `--check` reports drift and exits 1 without writing.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = 'skills/postel-writing/SKILL.md'
const copies = [
  'agent-plugin/skills/postel-writing/SKILL.md',
  'plugins/dsh-postel/skills/postel-writing/SKILL.md',
]
const check = process.argv.includes('--check')
const text = readFileSync(join(root, source), 'utf8')
let drift = 0
for (const copy of copies) {
  let current = ''
  try { current = readFileSync(join(root, copy), 'utf8') } catch {}
  if (current === text) continue
  drift++
  if (check) console.error(`${copy} differs from ${source}`)
  else { writeFileSync(join(root, copy), text); console.log(`updated ${copy}`) }
}
if (check && drift) process.exit(1)
if (!drift) console.log('skill copies are in sync')
