// Keep the catalogue in step with what is actually out there.
//
// Two jobs, both of which used to be an edit by hand after every release:
//
//   versions  `versions.json` takes whatever mooncakes reports. The catalogue
//             itself is only read, for the names, so a group or a blurb cannot
//             be disturbed by a machine.
//   discovery a repository in the organisation that no entry names gets one
//             appended, with the group from its topics and the blurb from its
//             description. Nothing already written is touched — the new entry
//             goes after the last one and everything before it must come out
//             byte for byte the same.
//
// Usage: node scripts/catalogue.mjs [--check]
//   --check exits 1 when something is out of step, without writing.

import { readFile, writeFile } from 'node:fs/promises'

const CATALOGUE = new URL('../src/data/packages.ts', import.meta.url)
const VERSIONS = new URL('../src/data/versions.json', import.meta.url)
const ORG = 'moonbitstack'
// One catalogue entry, brace to brace, read only for its name and for whether
// it is one of the two that are in the catalogue and not in the registry.
const ENTRY = /\{\r?\n\s*name: '([a-z0-9]+)',\r?\n(?:[^{}]*\r?\n)*?\s*\}/g
const CLOSE = '] as const satisfies readonly Pkg[]'
// Thirty-one at once comes back throttled; four at a time does not.
const AT_ONCE = 4

/** A string the way this file writes them: single quotes, escaped inside. */
const quoted = text => "'" + text.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"

async function json(url, headers = {}) {
  try {
    const answer = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) })
    return answer.ok ? await answer.json() : null
  } catch {
    return null
  }
}

/** What mooncakes says is published, or null when it will not say. */
async function published(name) {
  const body = await json(`https://mooncakes.io/api/v0/modules/${ORG}/${name}`)
  if (body === null) return null
  return body.yanked ? null : (body.version ?? null)
}

async function all(names) {
  const out = []
  for (let i = 0; i < names.length; i += AT_ONCE) {
    out.push(...(await Promise.all(names.slice(i, i + AT_ONCE).map(published))))
  }
  return out
}

/** Every module repository the organisation has, or null when GitHub will not say. */
async function repositories() {
  const headers = { accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const body = await json(
    `https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public`,
    headers,
  )
  if (body === null) return null
  // `.github` and the site itself are not modules; everything else here is.
  return body.filter(repo => /^moon[a-z0-9]+$/.test(repo.name))
}

const check = process.argv.includes('--check')
const catalogue = await readFile(CATALOGUE, 'utf8')
const known = JSON.parse(await readFile(VERSIONS, 'utf8'))

const entries = [...catalogue.matchAll(ENTRY)]
// Every entry must have been read. One that was not is an entry shaped some
// other way, and skipping it quietly is how it stays stale.
const declared = (catalogue.match(/name: '[a-z0-9]+',/g) ?? []).length
if (entries.length !== declared) {
  console.error(`::error::${declared} entries are declared and ${entries.length} were read`)
  process.exit(1)
}

const listed = new Set(entries.map(([, name]) => name))
// The template and the worked example are in the catalogue and not in the
// registry. Nothing published under their names should give them a version.
const names = entries
  .filter(([text]) => !/\r?\n\s*unpublished:/.test(text))
  .map(([, name]) => name)

// ------------------------------------------------------------------ versions

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

// ----------------------------------------------------------------- discovery

const groups = /export type GroupId =\n((?:\s*\|\s*'[a-z]+'\n)+)/.exec(catalogue)
const ids = new Set([...(groups?.[1] ?? '').matchAll(/'([a-z]+)'/g)].map(m => m[1]))
const repos = await repositories()
const fresh = []

if (repos === null) {
  console.log('GitHub would not list the organisation — no new repository can be seen')
} else {
  for (const repo of repos.sort((a, b) => a.name.localeCompare(b.name))) {
    if (listed.has(repo.name)) continue
    // A topic that names a group is the only thing here that can say where a
    // new module belongs; without one it lands in `base` wearing a note.
    const group = repo.topics?.find(topic => ids.has(topic))
    fresh.push({
      name: repo.name,
      group: group ?? 'base',
      blurb: repo.description || 'Newly created; nothing written down about it yet.',
      guessed: group === undefined,
    })
  }
}

// ------------------------------------------------------------------- writing

const lines = []
for (const one of fresh) {
  lines.push(`${one.name} is in the organisation and not in the catalogue`)
}
if (silent.length > 0) console.log(`no answer for ${silent.join(', ')} — kept as written`)
for (const line of moved) console.log(line)
for (const line of lines) console.log(line)

if (moved.length === 0 && fresh.length === 0) {
  console.log(`every version is current (${names.length} modules), and nothing is missing`)
  process.exit(0)
}
if (check) {
  console.error(`${moved.length + fresh.length} out of step — run node scripts/catalogue.mjs`)
  process.exit(1)
}

if (moved.length > 0) {
  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)))
  await writeFile(VERSIONS, JSON.stringify(sorted, null, 2) + '\n')
}

if (fresh.length > 0) {
  const at = catalogue.lastIndexOf(CLOSE)
  if (at < 0) {
    console.error(`::error::the catalogue does not end with ${CLOSE}`)
    process.exit(1)
  }
  const added = fresh
    .map(one =>
      [
        one.guessed
          ? '  // Added from the organisation. Its group is a guess — a repository'
          : '  // Added from the organisation.',
        ...(one.guessed ? ['  // topic naming one would have said where it belongs.'] : []),
        '  {',
        `    name: '${one.name}',`,
        `    group: '${one.group}',`,
        `    blurb: ${quoted(one.blurb)},`,
        '  },',
      ].join('\n'),
    )
    .join('\n')
  const out = catalogue.slice(0, at) + added + '\n' + catalogue.slice(at)
  // Nothing already written may move: the new entries are an append and only
  // an append, so everything before the closing bracket must survive verbatim.
  if (!out.startsWith(catalogue.slice(0, at)) || !out.endsWith(catalogue.slice(at))) {
    console.error('::error::the append disturbed what was already there')
    process.exit(1)
  }
  await writeFile(CATALOGUE, out)
}
