// What `versions.mjs` must do, and what it must not touch.
//
//   node --test scripts/versions.test.mjs
//
// The registry is real here on purpose — a fake one would only prove the fake.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const SCRIPT = fileURLToPath(new URL('./versions.mjs', import.meta.url))
const CATALOGUE = new URL('../src/data/packages.ts', import.meta.url)
const VERSIONS = new URL('../src/data/versions.json', import.meta.url)

const catalogue = readFileSync(CATALOGUE)
const versions = readFileSync(VERSIONS)
const current = JSON.parse(versions.toString())

/** Run the script over files bent into some shape, then put them back. */
async function against({ list, known } = {}) {
  if (list !== undefined) writeFileSync(CATALOGUE, list)
  if (known !== undefined) writeFileSync(VERSIONS, known)
  let result
  try {
    const { stdout, stderr } = await run(process.execPath, [SCRIPT])
    result = { code: 0, out: stdout + stderr }
  } catch (e) {
    result = { code: e.code ?? 1, out: (e.stdout ?? '') + (e.stderr ?? '') }
  }
  result.list = readFileSync(CATALOGUE)
  result.known = JSON.parse(readFileSync(VERSIONS, 'utf8'))
  writeFileSync(CATALOGUE, catalogue)
  writeFileSync(VERSIONS, versions)
  return result
}

const withRaft = value => {
  const out = { ...current }
  if (value === null) delete out.moonraft
  else out.moonraft = value
  return JSON.stringify(out, null, 2) + '\n'
}

test('the catalogue is never written to', async () => {
  const { code, list } = await against({ known: withRaft('0.0.1') })
  assert.equal(code, 0)
  assert.deepEqual(list, catalogue)
})

test('a version that moved on is taken up', async () => {
  const { code, out, known } = await against({ known: withRaft('0.0.1') })
  assert.equal(code, 0)
  assert.match(out, /moonraft 0\.0\.1/)
  assert.equal(known.moonraft, current.moonraft)
})

test('a module that was in design and is now published gains an entry', async () => {
  const { code, out, known } = await against({ known: withRaft(null) })
  assert.equal(code, 0)
  assert.match(out, /in design/)
  assert.equal(known.moonraft, current.moonraft)
})

test('the template and the worked example are never given a version', async () => {
  const { code, out, known } = await against()
  assert.equal(code, 0)
  assert.doesNotMatch(out, /moonkit|moonhelo/)
  assert.ok(!('moonkit' in known))
  assert.ok(!('moonhelo' in known))
})

test('an entry written some other way is refused, not skipped', async () => {
  const bent = catalogue
    .toString()
    .replace(
      "  {\n    name: 'moonraft',\n    group: 'systems',",
      "  { name: 'moonraft', group: 'systems',",
    )
  const { code, out } = await against({ list: bent })
  assert.equal(code, 1)
  assert.match(out, /entries are declared/)
})

test('a catalogue in CRLF reads the same', async () => {
  const { code, out } = await against({ list: catalogue.toString().replaceAll('\n', '\r\n') })
  assert.equal(code, 0)
  assert.doesNotMatch(out, /entries are declared/)
})
