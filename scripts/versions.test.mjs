// What `versions.mjs` must do to the catalogue, and what it must refuse to do.
//
// It edits a file that decides what the site says about forty-eight modules, so
// the shapes it can meet are worth stating rather than assuming:
//
//   node --test scripts/versions.test.mjs
//
// The registry is real here on purpose — a fake one would only prove the fake.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)
const DATA = new URL('../src/data/packages.ts', import.meta.url)
const SCRIPT = fileURLToPath(new URL('./versions.mjs', import.meta.url))
const original = readFileSync(DATA)

/** Run the script over a catalogue bent into some shape, then put it back. */
async function against(bent) {
  writeFileSync(DATA, bent)
  try {
    const { stdout, stderr } = await run(process.execPath, [SCRIPT])
    return { code: 0, out: stdout + stderr, after: readFileSync(DATA) }
  } catch (e) {
    return { code: e.code ?? 1, out: (e.stdout ?? '') + (e.stderr ?? ''), after: readFileSync(DATA) }
  } finally {
    writeFileSync(DATA, original)
  }
}

const text = original.toString()
const RAFT = "    name: 'moonraft',\n    group: 'systems',\n    version: '0.7.0',\n"

test('a released version that moved on is taken up', async () => {
  const stale = text.replace(RAFT, RAFT.replace("'0.7.0'", "'0.6.0'"))
  const { code, out, after } = await against(stale)
  assert.equal(code, 0)
  assert.match(out, /moonraft 0\.6\.0/)
  assert.equal(after.toString(), text)
})

test('a module that was in design and is now published gains the line', async () => {
  const none = text.replace(RAFT, "    name: 'moonraft',\n    group: 'systems',\n")
  const { code, out, after } = await against(none)
  assert.equal(code, 0)
  assert.match(out, /was in design/)
  assert.equal(after.toString(), text)
})

test('the template and the worked example are never given a version', async () => {
  const { code, out } = await against(original)
  assert.equal(code, 0)
  assert.doesNotMatch(out, /moonkit|moonhelo/)
})

test('an entry written some other way is refused, not skipped', async () => {
  const bent = text.replace(
    "  {\n    name: 'moonraft',\n    group: 'systems',",
    "  { name: 'moonraft', group: 'systems',",
  )
  const { code, out } = await against(bent)
  assert.equal(code, 1)
  assert.match(out, /no longer has the shape/)
})

test('a catalogue in CRLF reads the same and stays CRLF', async () => {
  const { code, after } = await against(text.replaceAll('\n', '\r\n'))
  assert.equal(code, 0)
  assert.ok(after.toString().includes('\r\n'))
})

test('only a version line may move', () => {
  const skeleton = t => t.replace(/^[ \t]*version: '[^']*',?\n/gm, '')
  const base = "  name: 'x',\n  group: 'net',\n  version: '1.0.0',\n  blurb: 'b',\n"
  assert.equal(skeleton(base), skeleton(base.replace('1.0.0', '2.0.0')))
  assert.equal(skeleton(base), skeleton(base.replace("  version: '1.0.0',\n", '')))
  assert.notEqual(skeleton(base), skeleton(base.replace("'net'", "'web'")))
  assert.notEqual(skeleton(base), skeleton(base + "  docs: 'x',\n"))
})
