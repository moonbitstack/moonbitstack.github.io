// Put the version mooncakes reports into the catalogue, so a release elsewhere
// does not need an edit here.
//
// The build runs this before Astro, and `versions.yml` runs it to open a pull
// request, so the page is right at once and the file catches up behind it.
//
// Usage: node scripts/versions.mjs [--check]
//   --check exits 1 when something is stale, without writing.

import { readFile, writeFile } from 'node:fs/promises'

const DATA = new URL('../src/data/packages.ts', import.meta.url)
const ORG = 'moonbitstack'
// One catalogue entry, brace to brace. Working an entry at a time is what keeps
// a rewrite inside the module it is about.
const ENTRY = /\{\n\s*name: '([a-z0-9]+)',\n(?:[^{}]*\n)*?\s*\}/g
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

/** The text with every version line taken out, so two of these differing means
 *  something other than a version moved — added, changed or removed. */
const skeleton = text => text.replace(/^[ \t]*version: '[^']*',?\n/gm, '')

const check = process.argv.includes('--check')
const raw = await readFile(DATA, 'utf8')
// Read in one line ending and write back in the one that was there, so a
// checkout with autocrlf on behaves like the one CI gets.
const crlf = raw.includes('\r\n')
const source = crlf ? raw.replaceAll('\r\n', '\n') : raw

const entries = [...source.matchAll(ENTRY)].map(match => ({
  text: match[0],
  name: match[1],
  version: /\n\s*version: '([^']*)'/.exec(match[0])?.[1] ?? null,
  // The template and the worked example are in the catalogue and not in the
  // registry. Nothing published under their names should give them a version.
  listed: !/\n\s*unpublished:/.test(match[0]),
}))

// Every entry must have been read. One that was not is an entry shaped some
// other way, and skipping it quietly is how it stays stale.
const declared = (source.match(/name: '[a-z0-9]+',/g) ?? []).length
if (entries.length !== declared) {
  console.error(
    `::error::${declared} entries are declared and ${entries.length} were read — ` +
      'the catalogue no longer has the shape this script reads',
  )
  process.exit(1)
}

const asked = entries.filter(entry => entry.listed)
const live = await all(asked.map(entry => entry.name))

let out = source
const moved = []
const added = []
const silent = []

asked.forEach((entry, i) => {
  const now = live[i]
  if (now === null) {
    // A module the registry will not name keeps whatever is written down, so a
    // registry that is down costs freshness and nothing else.
    if (entry.version !== null) silent.push(entry.name)
    return
  }
  if (now === entry.version) return

  let next
  if (entry.version === null) {
    // It was in design and has since been published: give it the line it now
    // deserves, under the group so the field order stays the file's.
    added.push(`${entry.name} ${now} (was in design)`)
    next = entry.text.replace(/(\n(\s*)group: '[a-z]+',)/, `$1\n$2version: '${now}',`)
    if (next === entry.text) {
      console.error(`::error::${entry.name} has no group line to put a version after`)
      process.exit(1)
    }
  } else {
    moved.push(`${entry.name} ${entry.version} → ${now}`)
    next = entry.text.replace(/(\n\s*version: ')[^']*/, `$1${now}`)
  }
  out = out.replace(entry.text, next)
})

// Nothing but a version line may have changed. A catalogue whose groups or
// blurbs moved under an automated edit is worse than one with a stale number.
if (skeleton(out) !== skeleton(source)) {
  console.error('::error::the rewrite touched something that is not a version')
  process.exit(1)
}

if (silent.length > 0) console.log(`no answer for ${silent.join(', ')} — kept as written`)
for (const line of added) console.log(line)
for (const line of moved) console.log(line)

if (added.length + moved.length === 0) {
  console.log(`every version is current (${asked.length} modules)`)
  process.exit(0)
}
if (check) {
  console.error(`${added.length + moved.length} stale — run node scripts/versions.mjs`)
  process.exit(1)
}
await writeFile(DATA, crlf ? out.replaceAll('\n', '\r\n') : out)
