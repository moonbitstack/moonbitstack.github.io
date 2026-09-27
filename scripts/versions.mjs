// Put the version mooncakes reports into the catalogue, so a release elsewhere
// does not need an edit here.
//
// The build runs this before Astro. A module the registry will not answer for
// keeps the version already written down, so a registry that is down or slow
// costs freshness and nothing else.
//
// Usage: node scripts/versions.mjs [--check]
//   --check exits 1 when something is stale, without writing.

import { readFile, writeFile } from 'node:fs/promises'

const DATA = new URL('../src/data/packages.ts', import.meta.url)
const ORG = 'moonbitstack'
const ENTRY = /name: '([a-z0-9]+)',\s*\n\s*group: '[a-z]+',\s*\n\s*version: '([0-9][^']*)'/g
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
const source = await readFile(DATA, 'utf8')
const wanted = [...source.matchAll(ENTRY)].map(([, name, version]) => ({ name, version }))
const live = await all(wanted.map(({ name }) => name))

let out = source
const moved = []
const silent = []
wanted.forEach(({ name, version }, i) => {
  const now = live[i]
  if (now === null) {
    silent.push(name)
  } else if (now !== version) {
    moved.push(`${name} ${version} -> ${now}`)
    out = out.replace(
      new RegExp(`(name: '${name}',\\s*\\n\\s*group: '[a-z]+',\\s*\\n\\s*version: ')[^']*`),
      `$1${now}`,
    )
  }
})

if (silent.length > 0) console.log(`no answer for ${silent.join(', ')} — kept as written`)
if (moved.length === 0) {
  console.log(`every version is current (${wanted.length} modules)`)
  process.exit(0)
}
for (const line of moved) console.log(line)
if (check) {
  console.error(`${moved.length} stale — run node scripts/versions.mjs`)
  process.exit(1)
}
await writeFile(DATA, out)
