// The one place the index is written down. Every page, island and link on this
// site reads from here, so a new repository is a row rather than an edit.

import sites from './sites.json'
import versions from './versions.json'

export type GroupId =
  | 'web'
  | 'net'
  | 'data'
  | 'format'
  | 'base'
  | 'systems'
  | 'ui'
  | 'infer'
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
  /** The repository, when it is not one of its own. */
  readonly repo?: string
  /**
   * The path under this domain that serves its documentation, for a module that
   * shares a repository and so cannot name its own page as a homepage. Every
   * other site comes from the repository's homepage, through `sites.json`.
   */
  readonly docs?: string
  /** What to call the two that are not published — they are not the same thing. */
  readonly unpublished?: 'a template' | 'an example'
}

// Ordered the way the stack stands: what answers a request at the top, what it
// is all allowed to rest on at the bottom.
export const groups = [
  { id: 'web', title: 'Web', note: 'Servers, frameworks, and the seam between them.' },
  { id: 'net', title: 'Protocols', note: 'State machines that take bytes and hand back events, and the services standing on them.' },
  { id: 'data', title: 'Data', note: 'One interface, three drivers that speak the wire themselves, and the mapper above them.' },
  { id: 'systems', title: 'Systems', note: 'Replication, and agents that plan before they act.' },
  { id: 'ui', title: 'Surface', note: 'Two toolkits: one draws in a terminal, one draws pixels.' },
  { id: 'infer', title: 'Inference', note: 'Running a model, and the four libraries underneath it.' },
  { id: 'format', title: 'Formats', note: 'Text and binary formats, read and written back.' },
  { id: 'base', title: 'Foundations', note: 'What everything above is allowed to depend on.' },
  { id: 'start', title: 'Beginning', note: 'Not published: one to copy from, one to read.' },
] as const satisfies readonly Group[]

export const packages = [
  {
    name: 'moonasgi',
    group: 'web',
    blurb: 'ASGI 3.0: the interface between servers and frameworks.',
    after: 'the ASGI specification',
  },
  {
    name: 'mooncat',
    group: 'web',
    blurb: 'Native ASGI server speaking HTTP/1.1, HTTP/2, HTTP/3 and WebSocket.',
    after: 'uvicorn',
  },
  {
    name: 'moonapi',
    group: 'web',
    blurb: 'Typed web framework with validation, dependency injection and OpenAPI 2.0, 3.0 and 3.1.',
    after: 'FastAPI',
  },
  {
    name: 'moongql',
    group: 'web',
    blurb: 'Code-first GraphQL with subscriptions and Apollo Federation.',
    after: 'strawberry, and the GraphQL specification',
  },
  {
    name: 'moonfetch',
    group: 'web',
    blurb: 'HTTP client: a Client that keeps its connections, HTTP/1.1 and HTTP/2 by ALPN, redirects, timeouts and compression.',
    after: 'aiohttp, requests, httpx and reqwest',
  },
  {
    name: 'moonpug',
    group: 'web',
    blurb: 'Every feature of four template languages, spelled the way Jinja2 spells it.',
    after: 'Jinja2, Django templates, Pug and Slim',
  },

  {
    name: 'moonhttp',
    group: 'net',
    blurb: 'The formats a request and a response are written in, with nothing about sockets in them.',
    after: 'the HTTP family of RFCs, and ylong',
  },
  {
    name: 'moontls',
    group: 'net',
    blurb: 'TLS 1.3 and DTLS 1.3, as state machines. No sockets, and not one line of cryptography of their own.',
    after: 'RFC 8446 and RFC 9147',
  },
  {
    name: 'moonquic',
    group: 'net',
    blurb: 'QUIC transport: packets, streams, loss recovery and congestion control.',
    after: 'RFC 9000 to 9002',
  },
  {
    name: 'moonnet',
    group: 'net',
    blurb: 'Connections that read and write the same in the clear and under TLS, the listener and the dialler.',
    after: 'Go net and hyper',
  },
  {
    name: 'moonrtc',
    group: 'net',
    blurb: 'The WebRTC stack, layer by layer: SDP, STUN, ICE, RTP, SRTP and the data channel.',
    after: 'pion/webrtc and aiortc',
  },
  {
    name: 'moonrpc',
    group: 'net',
    blurb: 'gRPC with server reflection, over moonhttp’s HTTP/2.',
    after: 'grpc-go',
  },
  {
    name: 'moonzero',
    group: 'net',
    blurb: 'Microservice framework: config-driven assembly, resilience and service discovery.',
    after: 'go-zero',
  },
  {
    name: 'moonctl',
    group: 'net',
    blurb: 'Spec-driven code generator for the whole stack, as the mctl command.',
    after: 'goctl',
  },

  {
    name: 'moonorm',
    group: 'data',
    blurb: 'ORM and SQL toolkit: query builder, sessions, relationships and migrations.',
    after: 'SQLAlchemy 2.x',
  },
  {
    name: 'moondb',
    group: 'data',
    blurb: 'The database-access interface drivers implement, pooling included.',
    after: 'database/sql and DB-API 2.0',
  },
  {
    name: 'moonsqlite',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/sqlite.html',
    blurb: 'SQLite driver for moondb.',
    after: 'the SQLite C API',
  },
  {
    name: 'moonpostgres',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/postgres.html',
    blurb: 'PostgreSQL driver speaking the wire protocol itself.',
    after: 'asyncpg',
  },
  {
    name: 'moonmysql',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/mysql.html',
    blurb: 'MySQL and MariaDB driver speaking the wire protocol itself.',
    after: 'PyMySQL',
  },
  {
    name: 'moonmodel',
    group: 'data',
    blurb: 'One field description, several projections: validation, OpenAPI, SDL and DDL.',
    after: 'Pydantic',
  },

  {
    name: 'moonjson',
    group: 'format',
    blurb: 'One tree, several ways of writing it: JSON, JSONC, JSON5 and JSON Lines.',
    after: 'RFC 8259, and each dialect’s own specification',
  },
  {
    name: 'moonyaml',
    group: 'format',
    blurb: 'YAML 1.2.2, read into the same tree every other reader here produces.',
    after: 'the YAML 1.2.2 specification',
  },
  {
    name: 'moontoml',
    group: 'format',
    blurb: 'TOML 1.0.0 — the format MoonBit’s own moon.mod is written in.',
    after: 'the TOML 1.0.0 specification',
  },
  {
    name: 'moonschema',
    group: 'format',
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
    blurb: 'Streaming playlists and containers: m3u8, MPD, MPEG-TS, fragmented MP4, RTMP.',
    after: 'RFC 8216 and ISO/IEC 23009-1',
  },
  {
    name: 'moonregex',
    group: 'format',
    blurb: 'Python’s re, the regex superset behind it, and the dialect JSON Schema means.',
    after: 're, mrab-regex, and ECMA-262 §22.2',
  },
  {
    name: 'moonfory',
    group: 'format',
    blurb: 'A value written so that Java, Go or Python reads it back as its own.',
    after: 'Apache Fory',
  },
  {
    name: 'moonzip',
    group: 'format',
    blurb: 'DEFLATE, the zlib and gzip containers built on it, and the ZIP archive.',
    after: 'RFC 1950 to 1952, and the ZIP appnote',
  },
  {
    name: 'moonbase',
    group: 'format',
    blurb: 'base16, base32, base36, base58, base62 and base64, then bech32, base58check and multibase.',
    after: 'RFC 4648, and the alphabets that grew up outside it',
  },
  {
    name: 'moonvar',
    group: 'format',
    blurb: 'How a number becomes bytes and back, fixed width and variable length alike.',
    after: 'the four protocol families that each define it differently',
  },

  {
    name: 'mooncrypt',
    group: 'base',
    blurb: 'Hashes, MACs, ciphers, AEAD, key agreement and signatures — one algorithm to a package.',
    after: 'hashlib, hmac and the RustCrypto crates',
  },
  {
    name: 'moonseal',
    group: 'base',
    blurb: 'Seal a file for several people at once; any one of them opens it.',
    after: 'age',
  },
  {
    name: 'mooncred',
    group: 'base',
    blurb: 'Credential formats: JSON Web Tokens, the keys they are verified with, ASN.1 and X.509.',
    after: 'the JOSE, ASN.1 and PKIX specifications',
  },
  {
    name: 'moondate',
    group: 'base',
    blurb: 'Dates, times, instants, durations and cron expressions.',
    after: 'Python’s datetime',
  },
  {
    name: 'moonlog',
    group: 'base',
    blurb: 'A level, a message, fields carried as values, and a seam to write through.',
    after: 'serlog',
  },
  {
    name: 'moonpool',
    group: 'base',
    blurb: 'Resource pools, backoff and flow control — the bookkeeping every client rewrites.',
  },

  {
    name: 'moonraft',
    group: 'systems',
    blurb: 'A function-by-function port of etcd-io/raft, fully covered by tests.',
    after: 'etcd-io/raft',
  },
  {
    name: 'moonkoog',
    group: 'systems',
    blurb: 'Agent orchestration: strategy graphs, tools, structured output, retrieval and MCP.',
    after: 'JetBrains Koog',
  },

  {
    name: 'moonetui',
    group: 'ui',
    blurb: 'Terminal user interfaces: cell buffers, diffed output, layout, widgets and drivers.',
    after: 'Textual',
  },
  {
    name: 'moonegui',
    group: 'ui',
    blurb: 'Immediate-mode graphical interfaces: one frame, one pass over the state.',
    after: 'egui',
  },

  {
    name: 'mooninfer',
    group: 'infer',
    blurb: 'Run a model: weights, a KV cache, sampling, and a server to put it behind.',
  },
  {
    name: 'moonggml',
    group: 'infer',
    blurb: 'Tensors, the graph built from them, and the schedule that runs it on CPU or GPU.',
    after: 'ggml',
  },
  {
    name: 'moonwgpu',
    group: 'infer',
    blurb: 'The WebGPU API: one surface over the browser’s own and a native backend.',
    after: 'the WebGPU and WGSL specifications',
  },
  {
    name: 'moongguf',
    group: 'infer',
    blurb: 'GGUF model files: the header, the metadata table and the tensor index.',
    after: 'the GGUF specification',
  },
  {
    name: 'moontoken',
    group: 'infer',
    blurb: 'Text into tokens and back: byte-level BPE and the SentencePiece shape.',
  },
  {
    name: 'moonkit',
    group: 'start',
    unpublished: 'a template',
    blurb: 'The template every repository here starts from: workflows, skeleton, licence.',
  },
  {
    name: 'moonhelo',
    group: 'start',
    unpublished: 'an example',
    blurb: 'An end-to-end example running nine of these as one service.',
  },
  {
    name: 'moonconf',
    group: 'base',
    blurb: 'Configuration from defaults, the environment and files, checked on the way in.',
  },
  {
    name: 'moonvite',
    group: 'ui',
    blurb: 'Scaffolding a new interface project, and the dev server it runs under.',
    after: 'Vite',
  },
  // Added from the organisation.
  {
    name: 'moonast',
    group: 'base',
    blurb: 'Generate MoonBit code from annotated declarations: templates over the official syntax tree, typed attribute arguments, and the generator scaffolding behind dev_build.',
  },
  // Added from the organisation.
  {
    name: 'moonmime',
    group: 'format',
    blurb: 'moonmime — the MIME family for MoonBit: media types and their parameters, the extension-to-type registry, Content-Disposition, multipart bodies and multipart/form-data, each read and written from bytes. No sockets, no files.',
  },
  // Added from the organisation.
  {
    name: 'moonsver',
    group: 'format',
    blurb: 'Semantic Versioning 2.0.0: parsing, printing, precedence, bumping and version ranges, with the range grammar of npm, Cargo, Ruby or the strict spec as a parameter.',
  },
  // Added from the organisation.
  {
    name: 'moonurl',
    group: 'format',
    blurb: 'URI references as RFC 3986 defines them: parsing, recomposing, resolving and percent coding by component, and data URLs.',
  },
  // Added from the organisation.
  {
    name: 'moonward',
    group: 'base',
    blurb: 'Resilience without I/O: circuit breaking, adaptive load shedding, rate limits, backoff and deadlines, with the clock and the randomness passed in.',
  },
  {
    name: 'moonmcp',
    group: 'web',
    blurb: 'Model Context Protocol servers and clients: the wire model, tools, resources and prompts.',
    after: 'FastMCP and the MCP specification',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonucd',
    group: 'base',
    blurb: 'Unicode character database for MoonBit: categories, properties, case mapping and folding, generated from the UCD.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonuuid',
    group: 'base',
    blurb: 'UUIDs for MoonBit: parse every spelling, make versions 1 to 8, generate over your own clock and randomness.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonnum',
    group: 'base',
    blurb: 'moonnum — Python\'s numbers for MoonBit: arbitrary-precision integers, floats, complex numbers and fractions, read, written and formatted the way Python reads, writes and formats them.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonimage',
    group: 'base',
    blurb: 'Image codecs for MoonBit: PNG, QOI, BMP, TGA, JPEG, GIF and WebP, and the pixel arithmetic between them.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonmath',
    group: 'base',
    blurb: 'Vectors, matrices, quaternions and geometry for MoonBit, laid out for WGSL.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonrgba',
    group: 'base',
    blurb: 'CSS colour syntax, colour spaces, gamut mapping, terminal colours and colour arithmetic for MoonBit.',
  },
  // Added from the organisation.
  {
    name: 'moonrand',
    group: 'base',
    blurb: 'Reproducible pseudo-random numbers: a default generator, sixty-three more, and the sampling and distributions Python’s random names.',
  },
  // Added from the organisation.
  {
    name: 'moonmail',
    group: 'net',
    blurb: 'Email for MoonBit: messages, SMTP, IMAP and POP3.',
  },
  // Added from the organisation.
  {
    name: 'moonseed',
    group: 'base',
    blurb: 'Secure random bytes and unbiased sampling for MoonBit.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonkart',
    group: 'base',
    blurb: 'A cache for MoonBit: bounded by count or weight, with expiry, loaders and eviction listeners.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonconsul',
    group: 'base',
    blurb: 'A Consul client for MoonBit: agent, catalog, health, KV and sessions, with blocking queries.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonetcd',
    group: 'base',
    blurb: 'An etcd v3 client for MoonBit: KV, watch, lease, transactions, locks and elections over gRPC.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonredis',
    group: 'base',
    blurb: 'A Redis client for MoonBit: RESP2 and RESP3, pipelines, transactions, pub/sub, cluster and sentinel.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonsd',
    group: 'base',
    blurb: 'Service discovery for MoonBit: the contract backends implement, with one in-memory registry and a conformance suite.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonproto',
    group: 'base',
    blurb: 'Protocol Buffers for MoonBit: runtime, reflection, JSON and text formats, and the protoc plugin.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moongraph',
    group: 'base',
    blurb: 'Graphs for MoonBit: representations and the algorithms on them.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonstl',
    group: 'base',
    blurb: 'Data structures and algorithms the MoonBit core library leaves out.',
  },
  {
    name: 'moonp8s',
    group: 'web',
    blurb: 'Prometheus metrics: every metric kind, labelled families, and the text and OpenMetrics formats.',
    after: 'the Prometheus clients',
  },
  {
    name: 'moontel',
    group: 'web',
    blurb: 'OpenTelemetry: traces, context propagation and OTLP export.',
    after: 'the OpenTelemetry specification',
  },
  // Added from the organisation.
  {
    name: 'moonp8s',
    group: 'web',
    blurb: 'Prometheus metrics for MoonBit.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonip',
    group: 'base',
    blurb: 'IP addresses and networks for MoonBit: IPv4, IPv6, prefixes and how to classify them.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moontask',
    group: 'base',
    blurb: 'Task queues and schedules for MoonBit: workers, retries, beats, workflows, and a console.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moona2a',
    group: 'base',
    blurb: 'The Agent2Agent protocol for MoonBit: agent cards, tasks, streaming and push notifications.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonmd',
    group: 'base',
    blurb: 'Markdown for MoonBit: CommonMark and GFM, whole or as it streams in.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonmuse',
    group: 'base',
    blurb: 'Talk to language models from MoonBit: one contract for chat, streaming, tools and embeddings, with a subpackage per provider.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonrag',
    group: 'base',
    blurb: 'Documents, splitting, vector stores and retrieval for MoonBit.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonskills',
    group: 'base',
    blurb: 'Agent Skills for MoonBit: discover, read and validate SKILL.md.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonstate',
    group: 'base',
    blurb: 'Durable state graphs for MoonBit: nodes, merging, checkpoints, interrupts and resume.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonacp',
    group: 'base',
    blurb: 'The Agent Client Protocol for MoonBit: editors talking to agents, over ASGI or stdio.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonjsonrpc',
    group: 'base',
    blurb: 'JSON-RPC 2.0 for MoonBit: messages, a method table, two-way calls and framing.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonjrpc',
    group: 'base',
    blurb: 'JSON-RPC 2.0 for MoonBit: messages, a method table, two-way calls and framing.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonskill',
    group: 'base',
    blurb: 'Agent Skills for MoonBit: discover, read and validate SKILL.md.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonmcl',
    group: 'base',
    blurb: 'MoonBit Motion Control Library: a pure MoonBit collection of classical and modern motion control algorithms.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonknob',
    group: 'base',
    blurb: 'Which of two settings wins, and what to do when they disagree: the precedence every moonbitstack library shares.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonchdb',
    group: 'base',
    blurb: 'Published under the organisation; nothing written down about it yet.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonduckdb',
    group: 'base',
    blurb: 'Published under the organisation; nothing written down about it yet.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonsqls',
    group: 'base',
    blurb: 'Published under the organisation; nothing written down about it yet.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moonckdb',
    group: 'base',
    blurb: 'Published under the organisation; nothing written down about it yet.',
  },
  // Added from the organisation. Its group is a guess — a repository
  // topic naming one would have said where it belongs.
  {
    name: 'moontidb',
    group: 'base',
    blurb: 'Published under the organisation; nothing written down about it yet.',
  },
] as const satisfies readonly Pkg[]

export const repoOf = (pkg: Pkg): string => pkg.repo ?? pkg.name

/** Everything a card needs, worked out once. */
export interface Entry extends Pkg {
  /** What mooncakes reports, or absent when nothing is published under the name. */
  readonly version?: string
  readonly repoUrl: string
  readonly docsUrl?: string
  readonly modUrl?: string
  readonly planned: boolean
  readonly haystack: string
}

// Neither the version nor the site is written down here: `versions.json` holds
// what mooncakes reports and `sites.json` the homepage each repository names,
// both refreshed by `scripts/catalogue.mjs`, so a release or a new site
// elsewhere never needs an edit to this file.
export const entries: readonly Entry[] = packages.map((pkg: Pkg): Entry => {
  const version = (versions as Record<string, string>)[pkg.name]
  return {
    ...pkg,
    version,
    repoUrl: `https://github.com/moonbitstack/${repoOf(pkg)}`,
    docsUrl: pkg.docs
      ? `https://moonbitstack.github.io/${pkg.docs}${pkg.docs.endsWith('.html') ? '' : '/'}`
      : (sites as Record<string, string>)[repoOf(pkg)],
    modUrl: version && `https://mooncakes.io/docs/moonbitstack/${pkg.name}`,
    planned: !version && !pkg.unpublished,
    haystack: `${pkg.name} ${pkg.blurb} ${pkg.after ?? ''}`.toLowerCase(),
  }
})

export const byGroup = Object.groupBy(entries, entry => entry.group)

export const counts = {
  all: entries.length,
  published: entries.filter(entry => entry.version !== undefined).length,
  planned: entries.filter(entry => entry.planned).length,
}
