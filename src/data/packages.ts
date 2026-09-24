// The one place the index is written down. Every page, island and link on this
// site reads from here, so a new repository is a row rather than an edit.

export type GroupId =
  | 'web'
  | 'net'
  | 'data'
  | 'format'
  | 'base'
  | 'systems'
  | 'ui'
  | 'start'

export interface Group {
  readonly id: GroupId
  readonly title: string
  readonly note: string
}

export interface Pkg {
  readonly name: string
  readonly group: GroupId
  readonly blurb: string
  /** What it is modeled on, when it follows something. */
  readonly after?: string
  /** The published version. Absent means the repository exists and the work has not started. */
  readonly version?: string
  /** The repository, when it is not one of its own. */
  readonly repo?: string
  /** The path under this domain that serves its documentation, when one is live. */
  readonly docs?: string
  /** Absent for the two that are meant to be copied rather than added. */
  readonly unpublished?: true
}

// Ordered the way the stack stands: what answers a request at the top, what it
// is all allowed to rest on at the bottom.
export const groups = [
  { id: 'web', title: 'Web', note: 'Servers, frameworks, and the seam between them.' },
  { id: 'net', title: 'Protocols', note: 'State machines that take bytes and hand back events, and the services standing on them.' },
  { id: 'data', title: 'Data', note: 'One interface, three drivers that speak the wire themselves, and the mapper above them.' },
  { id: 'systems', title: 'Systems', note: 'Replication, and agents that plan before they act.' },
  { id: 'ui', title: 'Interfaces', note: 'Two toolkits: one draws in a terminal, one draws pixels.' },
  { id: 'format', title: 'Formats', note: 'Text and binary formats, read and written back.' },
  { id: 'base', title: 'Foundations', note: 'What everything above is allowed to depend on.' },
  { id: 'start', title: 'Starting points', note: 'Copied rather than added.' },
] as const satisfies readonly Group[]

export const packages = [
  {
    name: 'moonasgi',
    group: 'web',
    version: '0.10.0',
    docs: 'moonasgi',
    blurb: 'ASGI 3.0: the interface between servers and frameworks.',
    after: 'the ASGI specification',
  },
  {
    name: 'mooncat',
    group: 'web',
    version: '0.14.4',
    docs: 'mooncat',
    blurb: 'Native ASGI server speaking HTTP/1.1, HTTP/2, HTTP/3 and WebSocket.',
    after: 'uvicorn',
  },
  {
    name: 'moonapi',
    group: 'web',
    version: '0.13.0',
    docs: 'moonapi',
    blurb: 'Typed web framework with validation, dependency injection and OpenAPI 2.0, 3.0 and 3.1.',
    after: 'FastAPI',
  },
  {
    name: 'moongql',
    group: 'web',
    version: '0.9.0',
    docs: 'moongql',
    blurb: 'Code-first GraphQL with subscriptions and Apollo Federation.',
    after: 'strawberry, and the GraphQL specification',
  },
  {
    name: 'moonfetch',
    group: 'web',
    blurb: 'HTTP client: one spelling for the blocking call and the awaited one, on both hosts.',
    after: 'requests and aiohttp',
  },
  {
    name: 'moonpug',
    group: 'web',
    blurb: 'Template engine taking the union of four template languages, spelled the way Jinja2 spells it.',
    after: 'Jinja2, Django templates, Pug and Fumi',
  },

  {
    name: 'moonhttp',
    group: 'net',
    version: '0.11.0',
    blurb: 'The formats a request and a response are written in, with nothing about sockets in them.',
    after: 'the HTTP family of RFCs',
  },
  {
    name: 'moontls',
    group: 'net',
    version: '0.8.0',
    blurb: 'TLS 1.3 and DTLS 1.3, as state machines. No sockets, and not one line of cryptography of their own.',
    after: 'RFC 8446 and RFC 9147',
  },
  {
    name: 'moonquic',
    group: 'net',
    version: '0.3.2',
    blurb: 'QUIC transport: packets, streams, loss recovery and congestion control.',
    after: 'RFC 9000 to 9002',
  },
  {
    name: 'moonnet',
    group: 'net',
    blurb: 'The contract those state machines are reached through, and the wiring that connects them.',
  },
  {
    name: 'moonrtc',
    group: 'net',
    blurb: 'The WebRTC stack, layer by layer: SDP, STUN, TURN, ICE, RTP, RTCP, SRTP and SCTP, with no socket in any of them.',
    after: 'pion/webrtc and aiortc',
  },
  {
    name: 'moonrpc',
    group: 'net',
    version: '0.19.2',
    docs: 'moonrpc',
    blurb: 'gRPC with server reflection, over moonhttp’s HTTP/2.',
    after: 'grpc-go',
  },
  {
    name: 'moonzero',
    group: 'net',
    version: '0.11.2',
    docs: 'moonzero',
    blurb: 'Microservice framework: config-driven assembly, resilience and service discovery.',
    after: 'go-zero',
  },
  {
    name: 'moonctl',
    group: 'net',
    version: '0.10.0',
    docs: 'moonctl',
    blurb: 'Spec-driven code generator for the whole stack, as the mctl command.',
    after: 'goctl',
  },

  {
    name: 'moonorm',
    group: 'data',
    version: '0.10.0',
    docs: 'moonorm',
    blurb: 'ORM and SQL toolkit: query builder, sessions, relationships and migrations.',
    after: 'SQLAlchemy 2.x',
  },
  {
    name: 'moondb',
    group: 'data',
    version: '0.2.0',
    repo: 'moonorm',
    docs: 'moonorm/db',
    blurb: 'The database-access interface drivers implement, pooling included.',
    after: 'database/sql and DB-API 2.0',
  },
  {
    name: 'moonsqlite',
    group: 'data',
    version: '0.3.1',
    repo: 'moonorm',
    docs: 'moonorm/sqlite',
    blurb: 'SQLite driver for moondb.',
    after: 'the SQLite C API',
  },
  {
    name: 'moonpostgres',
    group: 'data',
    version: '0.6.2',
    repo: 'moonorm',
    docs: 'moonorm/postgres',
    blurb: 'PostgreSQL driver speaking the wire protocol itself.',
    after: 'asyncpg',
  },
  {
    name: 'moonmysql',
    group: 'data',
    version: '0.7.2',
    repo: 'moonorm',
    docs: 'moonorm/mysql',
    blurb: 'MySQL and MariaDB driver speaking the wire protocol itself.',
    after: 'PyMySQL',
  },
  {
    name: 'moonmodel',
    group: 'data',
    blurb: 'One field description, several projections: validation, OpenAPI, SDL and DDL from the same declaration.',
    after: 'Pydantic',
  },

  {
    name: 'moonjson',
    group: 'format',
    version: '0.4.0',
    blurb: 'One tree, several ways of writing it: JSON (RFC 8259), JSONC, JSON5 and JSON Lines.',
  },
  {
    name: 'moonyaml',
    group: 'format',
    version: '0.1.1',
    blurb: 'YAML 1.2.2, read into the same tree every other reader here produces.',
    after: 'the YAML 1.2.2 specification',
  },
  {
    name: 'moontoml',
    group: 'format',
    version: '0.1.0',
    blurb: 'TOML 1.0.0 — the format MoonBit’s own moon.mod is written in.',
    after: 'the TOML 1.0.0 specification',
  },
  {
    name: 'moonschema',
    group: 'format',
    version: '0.2.0',
    blurb: 'JSON Schema validation across all five drafts. It validates; it does not parse.',
    after: 'the JSON Schema specification',
  },
  {
    name: 'moonxml',
    group: 'format',
    blurb: 'Tag documents parsed, queried by XPath and CSS, edited, and written back.',
    after: 'lxml and BeautifulSoup',
  },
  {
    name: 'moonmedia',
    group: 'format',
    blurb: 'Streaming containers and playlists: m3u8, MPD, MPEG-TS and fragmented MP4, plus the RTMP ingest protocol.',
    after: 'RFC 8216 and ISO/IEC 23009-1',
  },
  {
    name: 'moonzip',
    group: 'format',
    version: '0.3.0',
    blurb: 'DEFLATE and the two stream containers built on it (RFC 1950 to 1952), plus the ZIP archive.',
  },
  {
    name: 'moonbase',
    group: 'format',
    version: '0.4.0',
    docs: 'moonbase',
    blurb: 'base16, base32 and base64 from RFC 4648, plus base36, base58 and base62.',
  },
  {
    name: 'moonvar',
    group: 'format',
    version: '0.2.0',
    blurb: 'How a number becomes bytes and back, fixed width and variable length alike.',
    after: 'the four protocol families that each define it differently',
  },

  {
    name: 'mooncrypt',
    group: 'base',
    version: '0.3.1',
    blurb: 'Hashes, MACs, ciphers, AEAD, key agreement and signatures — one algorithm to a package.',
    after: 'hashlib, hmac and the RustCrypto crates',
  },
  {
    name: 'moonseal',
    group: 'base',
    blurb: 'Seal a file for several people at once; any one of them opens it. A header of recipient stanzas over a streaming payload.',
    after: 'age',
  },
  {
    name: 'mooncred',
    group: 'base',
    version: '0.6.1',
    blurb: 'Credential formats: JSON Web Tokens, the keys they are verified with, ASN.1 and X.509.',
    after: 'the JOSE, ASN.1 and PKIX specifications',
  },
  {
    name: 'moondate',
    group: 'base',
    version: '0.1.0',
    blurb: 'Dates, times, instants, durations and cron expressions.',
    after: 'Python’s datetime',
  },
  {
    name: 'moonlog',
    group: 'base',
    version: '0.1.0',
    blurb: 'A level, a message, fields carried as values, and a seam to write through. Zero dependencies.',
  },
  {
    name: 'moonpool',
    group: 'base',
    version: '0.2.0',
    blurb: 'Resource pools, backoff and flow control — the bookkeeping every client rewrites.',
  },

  {
    name: 'moonraft',
    group: 'systems',
    version: '0.7.0',
    docs: 'moonraft',
    blurb: 'A function-by-function port of etcd-io/raft, fully covered by tests.',
    after: 'etcd-io/raft',
  },
  {
    name: 'moonkoog',
    group: 'systems',
    version: '0.6.1',
    docs: 'moonkoog',
    blurb: 'Agent orchestration: strategy graphs, tools, structured output and retrieval.',
    after: 'JetBrains Koog',
  },

  {
    name: 'moonetui',
    group: 'ui',
    version: '0.1.1',
    blurb: 'Terminal user interfaces: cell buffers, diffed output, layout, widgets and drivers.',
    after: 'Textual',
  },
  {
    name: 'moonegui',
    group: 'ui',
    version: '0.2.0',
    blurb: 'Immediate-mode graphical interfaces.',
    after: 'egui',
  },

  {
    name: 'moonkit',
    group: 'start',
    unpublished: true,
    blurb: 'The template every repository here starts from: workflows, skeleton, licence.',
  },
  {
    name: 'moonhelo',
    group: 'start',
    unpublished: true,
    blurb: 'An end-to-end example running nine of these as one service.',
  },
] as const satisfies readonly Pkg[]

export const repoOf = (pkg: Pkg): string => pkg.repo ?? pkg.name

/** Everything a card needs, worked out once. */
export interface Entry extends Pkg {
  readonly repoUrl: string
  readonly docsUrl?: string
  readonly modUrl?: string
  readonly planned: boolean
  readonly haystack: string
}

// `as const` above keeps every literal, so the map is given the wider type:
// the union of literals has no `version` on the members that lack one.
export const entries: readonly Entry[] = packages.map((pkg: Pkg): Entry => ({
  ...pkg,
  repoUrl: `https://github.com/moonbitstack/${repoOf(pkg)}`,
  docsUrl: pkg.docs && `https://moonbitstack.github.io/${pkg.docs}/`,
  modUrl: pkg.version && `https://mooncakes.io/docs/moonbitstack/${pkg.name}`,
  planned: !pkg.version && !pkg.unpublished,
  haystack: `${pkg.name} ${pkg.blurb} ${pkg.after ?? ''}`.toLowerCase(),
}))

export const byGroup = Object.groupBy(entries, entry => entry.group)

export const counts = {
  all: entries.length,
  published: entries.filter(entry => entry.version !== undefined).length,
  planned: entries.filter(entry => entry.planned).length,
}
