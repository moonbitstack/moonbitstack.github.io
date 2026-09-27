// Refresh `src/data/versions.json` from mooncakes.
//
// The catalogue no longer carries a version, so this writes one file and one
// file only — there is nothing in it but names and numbers, and no way for it
// to disturb a group, a blurb or an entry that is still in design.
//
// The build runs it before Astro, and `versions.yml` runs it to open a pull
// request, so the page is right at once and the file catches up behind it.
//
// Usage: node scripts/versions.mjs [--check]
//   --check exits 1 when something is stale, without writing.

import { readFile, writeFile } from 'node:fs/promises'

const CATALOGUE = new URL('../src/data/packages.ts', import.meta.url)
const VERSIONS = new URL('../src/data/versions.json', import.meta.url)
const ORG = 'moonbitstack'
// One catalogue entry, brace to brace, read only for its name and whether it is
// one of the two that are in the catalogue and not in the registry.
const ENTRY = /\{\r?\n\s*name: '([a-z0-9]+)',\r?\n(?:[^{}]*\r?\n)*?\s*\}/g
// Thirty-one at once comes back throttled; four at a time does not.
const AT_ONCE = 4

/** What mooncakes says is published, or null when it will not say. */
async function published(name) {
  try {
    const answer = await fetch(`https://mooncakes.io/api/v0/modules/${ORG}/${name}`, {
      signal: AbortSignal.timeout(15_000),
    })
    if (!answer.ok) return null
    const { version, yanked } = await answer.json()
    return yanked ? null : (version ?? null)
  } catch {
    return null
  }
}

async function all(names) {
  const out = []
  for (let i = 0; i < names.length; i += AT_ONCE) {
    out.push(...(await Promise.all(names.slice(i, i + AT_ONCE).map(published))))
  }
  return out
}

const check = process.argv.includes('--check')
const catalogue = await readFile(CATALOGUE, 'utf8')
const known = JSON.parse(await readFile(VERSIONS, 'utf8'))

// The template and the worked example are in the catalogue and not in the
// registry. Nothing published under their names should give them a version.
const names = [...catalogue.matchAll(ENTRY)]
  .filter(([text]) => !/\r?\n\s*unpublished:/.test(text))
  .map(([, name]) => name)

// Every entry must have been read. One that was not is an entry shaped some
// other way, and skipping it quietly is how it stays stale.
const declared = (catalogue.match(/name: '[a-z0-9]+',/g) ?? []).length
if ([...catalogue.matchAll(ENTRY)].length !== declared) {
  console.error(`::error::${declared} entries are declared and fewer were read`)
  process.exit(1)
}

const live = await all(names)

const next = {}
const moved = []
const silent = []
names.forEach((name, i) => {
  const now = live[i]
  if (now === null) {
    // A module the registry will not name keeps whatever is written down, so a
    // registry that is down costs freshness and nothing else.
    if (known[name]) {
      next[name] = known[name]
      silent.push(name)
    }
    return
  }
  next[name] = now
  if (known[name] !== now) moved.push(`${name} ${known[name] ?? '(in design)'} → ${now}`)
})

for (const name of Object.keys(known)) {
  if (!(name in next)) moved.push(`${name} ${known[name]} → gone`)
}

if (silent.length > 0) console.log(`no answer for ${silent.join(', ')} — kept as written`)
for (const line of moved) console.log(line)

if (moved.length === 0) {
  console.log(`every version is current (${names.length} modules)`)
  process.exit(0)
}
if (check) {
  console.error(`${moved.length} stale — run node scripts/versions.mjs`)
  process.exit(1)
}
const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)))
await writeFile(VERSIONS, JSON.stringify(sorted, null, 2) + '\n')
