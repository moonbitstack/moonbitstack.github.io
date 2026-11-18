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
  | 'learn'
  | 'sci'
  | 'game'
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
  /** On long-term support: the interface is settled and later releases fix bugs. */
  readonly lts?: true
  /** Planned and not announced: shown only on the full page, `#full`. */
  readonly unlisted?: true
}

// Ordered the way the stack stands: what answers a request at the top, what it
// is all allowed to rest on at the bottom.
export const groups = [
  { id: 'web', title: 'Web', note: 'Servers, frameworks, and the seam between them.' },
  { id: 'net', title: 'Protocols', note: 'State machines that take bytes and hand back events, and the services standing on them.' },
  { id: 'data', title: 'Data', note: 'One interface, eight database drivers that speak the wire themselves, the mapper above them, and four vector stores.' },
  { id: 'systems', title: 'Systems', note: 'Replication, discovery, queues and telemetry, and agents with the models, memory and protocols they use.' },
  { id: 'ui', title: 'Surface', note: 'Two toolkits: one draws in a terminal, one draws pixels.' },
  { id: 'infer', title: 'Inference', note: 'Running a model, and the libraries underneath it down to the GPU.' },
  { id: 'learn', title: 'Learning', note: 'Differentiation, deep and classical models, and the data work around them.' },
  { id: 'sci', title: 'Computation', note: 'Numerical work, starting with motion control.' },
  { id: 'game', title: 'Games', note: 'An engine made of parts that each stand on their own.' },
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
    lts: true,
  },
  {
    name: 'mooncat',
    group: 'web',
    blurb: 'Native ASGI server speaking HTTP/1.1, HTTP/2, HTTP/3 and WebSocket.',
    after: 'uvicorn',
    lts: true,
  },
  {
    name: 'moonapi',
    group: 'web',
    blurb: 'Typed web framework with validation, dependency injection and OpenAPI 2.0, 3.0 and 3.1.',
    after: 'FastAPI',
    lts: true,
  },
  {
    name: 'moongql',
    group: 'web',
    blurb: 'Code-first GraphQL with subscriptions and Apollo Federation.',
    after: 'strawberry, and the GraphQL specification',
    lts: true,
  },
  {
    name: 'moonfetch',
    group: 'web',
    blurb: 'HTTP client: a Client that keeps its connections, HTTP/1.1 and HTTP/2 by ALPN, redirects, timeouts and compression.',
    after: 'aiohttp, requests, httpx and reqwest',
    lts: true,
  },
  {
    name: 'moonpug',
    group: 'web',
    blurb: 'Every feature of four template languages, spelled the way Jinja2 spells it.',
    after: 'Jinja2, Django templates, Pug and Slim',
    lts: true,
  },

  {
    name: 'moonhttp',
    group: 'net',
    blurb: 'The formats a request and a response are written in, with nothing about sockets in them.',
    after: 'the HTTP family of RFCs, and ylong',
    lts: true,
  },
  {
    name: 'moontls',
    group: 'net',
    blurb: 'TLS 1.3 and DTLS 1.3, as state machines. No sockets, and not one line of cryptography of their own.',
    after: 'RFC 8446 and RFC 9147',
    lts: true,
  },
  {
    name: 'moonquic',
    group: 'net',
    blurb: 'QUIC transport: packets, streams, loss recovery and congestion control.',
    after: 'RFC 9000 to 9002',
    lts: true,
  },
  {
    name: 'moonnet',
    group: 'net',
    blurb: 'Connections that read and write the same in the clear and under TLS, the listener and the dialler.',
    after: 'Go net and hyper',
    lts: true,
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
    lts: true,
  },
  {
    name: 'moonzero',
    group: 'net',
    blurb: 'Microservice framework: config-driven assembly, resilience and service discovery.',
    after: 'go-zero',
    lts: true,
  },
  {
    name: 'moonctl',
    group: 'net',
    blurb: 'Spec-driven code generator for the whole stack, as the mctl command.',
    after: 'goctl',
    lts: true,
  },
  {
    name: 'moonmail',
    group: 'net',
    blurb: 'Email: messages, SMTP, IMAP and POP3.',
    lts: true,
  },
  {
    name: 'moonip',
    group: 'net',
    blurb: 'IP addresses and networks: IPv4, IPv6, prefixes and how to classify them.',
    lts: true,
  },
  {
    name: 'moonjrpc',
    group: 'net',
    blurb: 'JSON-RPC 2.0: messages, a method table, two-way calls and framing.',
    lts: true,
  },

  {
    name: 'moonorm',
    group: 'data',
    blurb: 'ORM and SQL toolkit: query builder, sessions, relationships and migrations.',
    after: 'SQLAlchemy 2.x',
    lts: true,
  },
  {
    name: 'moondb',
    group: 'data',
    blurb: 'The database-access interface drivers implement, pooling included.',
    after: 'database/sql and DB-API 2.0',
    lts: true,
  },
  {
    name: 'moonsqlite',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/sqlite.html',
    blurb: 'SQLite driver for moondb.',
    after: 'the SQLite C API',
    lts: true,
  },
  {
    name: 'moonpostgres',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/postgres.html',
    blurb: 'PostgreSQL driver speaking the wire protocol itself.',
    after: 'asyncpg',
    lts: true,
  },
  {
    name: 'moonmysql',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/mysql.html',
    blurb: 'MySQL and MariaDB driver speaking the wire protocol itself.',
    after: 'PyMySQL',
    lts: true,
  },
  {
    name: 'moonchdb',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/chdb.html',
    blurb: 'ClickHouse driver for moondb, over the HTTP interface and RowBinary.',
    lts: true,
  },
  {
    name: 'moonckdb',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb',
    blurb: 'CockroachDB driver for moondb, over moonpostgres\'s wire protocol.',
    lts: true,
  },
  {
    name: 'moontidb',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb',
    blurb: 'TiDB driver for moondb, over moonmysql\'s wire protocol.',
    lts: true,
  },
  {
    name: 'moonduckdb',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb',
    blurb: 'DuckDB driver for moondb: the native library on native, the official WebAssembly build on js.',
    lts: true,
  },
  {
    name: 'moonsqls',
    group: 'data',
    repo: 'moondb',
    docs: 'moondb/sqls.html',
    blurb: 'SQL Server driver for moondb: TDS in MoonBit, TLS through moontls.',
    lts: true,
  },
  {
    name: 'moonchroma',
    group: 'data',
    repo: 'moonrag',
    docs: 'moonrag/chroma.html',
    blurb: 'Chroma vector store for moonrag, over its REST API.',
    lts: true,
  },
  {
    name: 'moonmilvus',
    group: 'data',
    repo: 'moonrag',
    docs: 'moonrag/milvus.html',
    blurb: 'Milvus vector store for moonrag, over its REST API.',
    lts: true,
  },
  {
    name: 'moonqdrant',
    group: 'data',
    repo: 'moonrag',
    docs: 'moonrag/qdrant.html',
    blurb: 'Qdrant vector store for moonrag, over its REST API.',
    lts: true,
  },
  {
    name: 'moonweavte',
    group: 'data',
    repo: 'moonrag',
    docs: 'moonrag/weavte.html',
    blurb: 'Weaviate vector store for moonrag, over its REST API.',
    lts: true,
  },
  {
    name: 'moonmodel',
    group: 'data',
    blurb: 'One field description, several projections: validation, OpenAPI, SDL and DDL.',
    after: 'Pydantic',
    lts: true,
  },

  {
    name: 'moonraft',
    group: 'systems',
    blurb: 'A function-by-function port of etcd-io/raft, fully covered by tests.',
    after: 'etcd-io/raft',
    lts: true,
  },
  {
    name: 'moonkoog',
    group: 'systems',
    blurb: 'Agent orchestration: strategy graphs, tools, structured output, retrieval and MCP.',
    after: 'JetBrains Koog',
    lts: true,
  },
  {
    name: 'moonmcp',
    group: 'systems',
    blurb: 'Model Context Protocol servers and clients: the wire model, tools, resources and prompts.',
    after: 'FastMCP and the MCP specification',
    lts: true,
  },
  {
    name: 'moonsd',
    group: 'systems',
    blurb: 'Service discovery: the contract a registry implements, an in-memory registry, a conformance suite, and three drivers.',
    lts: true,
  },
  {
    name: 'moonconsul',
    group: 'systems',
    repo: 'moonsd',
    docs: 'moonsd/consul.html',
    blurb: 'Consul driver for moonsd: agent, catalog, health, KV and sessions, with blocking queries.',
    lts: true,
  },
  {
    name: 'moonetcd',
    group: 'systems',
    repo: 'moonsd',
    docs: 'moonsd/etcd.html',
    blurb: 'etcd v3 driver for moonsd: KV, watch, lease, transactions, locks and elections over gRPC.',
    lts: true,
  },
  {
    name: 'moonredis',
    group: 'systems',
    repo: 'moonsd',
    docs: 'moonsd/redis.html',
    blurb: 'Redis driver for moonsd: RESP2 and RESP3, pipelines, transactions, pub/sub, cluster and sentinel.',
    lts: true,
  },
  {
    name: 'moonp8s',
    group: 'systems',
    blurb: 'Prometheus metrics: every metric kind, labelled families, and the text and OpenMetrics formats.',
    after: 'the Prometheus clients',
    lts: true,
  },
  {
    name: 'moontel',
    group: 'systems',
    blurb: 'OpenTelemetry: traces, context propagation and OTLP export.',
    after: 'the OpenTelemetry specification',
    lts: true,
  },
  {
    name: 'moontask',
    group: 'systems',
    blurb: 'Task queues and schedules: workers, retries, beats, workflows, and a console.',
    lts: true,
  },
  {
    name: 'moona2a',
    group: 'systems',
    blurb: 'The Agent2Agent protocol: agent cards, tasks, streaming and push notifications.',
    lts: true,
  },
  {
    name: 'moonmuse',
    group: 'systems',
    blurb: 'Language model clients: one contract for chat, streaming, tools and embeddings, with a subpackage per provider.',
    lts: true,
  },
  {
    name: 'moonrag',
    group: 'systems',
    blurb: 'Documents, splitting, vector stores and retrieval, with four vector store drivers.',
    lts: true,
  },
  {
    name: 'moonstate',
    group: 'systems',
    blurb: 'Durable state graphs: nodes, merging, checkpoints, interrupts and resume.',
    lts: true,
  },
  {
    name: 'moonacp',
    group: 'systems',
    blurb: 'The Agent Client Protocol: editors talking to agents, over ASGI or stdio.',
    lts: true,
  },
  {
    name: 'moonskill',
    group: 'systems',
    blurb: 'Agent Skills: discover, read and validate SKILL.md.',
    lts: true,
  },

  {
    name: 'moonetui',
    group: 'ui',
    blurb: 'Terminal user interfaces: cell buffers, diffed output, layout, widgets and drivers.',
    after: 'Textual',
    lts: true,
  },
  {
    name: 'moonegui',
    group: 'ui',
    blurb: 'Immediate-mode graphical interfaces: one frame, one pass over the state.',
    after: 'egui',
  },
  {
    name: 'moonvite',
    group: 'ui',
    blurb: 'Scaffolding a new interface project, and the dev server it runs under.',
    after: 'Vite',
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
    name: 'moonnaga',
    group: 'infer',
    blurb: 'Shader translation: WGSL in, a validated IR, and SPIR-V, MSL and HLSL out.',
    after: 'naga',
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
    lts: true,
  },
  {
    name: 'moonmcl',
    group: 'sci',
    blurb: 'Motion control: classical and modern control algorithms.',
    lts: true,
  },

  {
    name: 'moonjson',
    group: 'format',
    blurb: 'One tree, several ways of writing it: JSON, JSONC, JSON5 and JSON Lines.',
    after: 'RFC 8259, and each dialect’s own specification',
    lts: true,
  },
  {
    name: 'moonyaml',
    group: 'format',
    blurb: 'YAML 1.2.2, read into the same tree every other reader here produces.',
    after: 'the YAML 1.2.2 specification',
    lts: true,
  },
  {
    name: 'moontoml',
    group: 'format',
    blurb: 'TOML 1.0.0 — the format MoonBit’s own moon.mod is written in.',
    after: 'the TOML 1.0.0 specification',
    lts: true,
  },
  {
    name: 'moonschema',
    group: 'format',
    blurb: 'JSON Schema validation across all five drafts. It validates; it does not parse.',
    after: 'the JSON Schema specification',
    lts: true,
  },
  {
    name: 'moonxml',
    group: 'format',
    blurb: 'Tag documents parsed, queried by XPath and CSS, edited, and written back.',
    after: 'lxml and BeautifulSoup',
    lts: true,
  },
  {
    name: 'moonmedia',
    group: 'format',
    blurb: 'Streaming playlists and containers: m3u8, MPD, MPEG-TS, fragmented MP4, RTMP.',
    after: 'RFC 8216 and ISO/IEC 23009-1',
    lts: true,
  },
  {
    name: 'moonregex',
    group: 'format',
    blurb: 'Python’s re, the regex superset behind it, and the dialect JSON Schema means.',
    after: 're, mrab-regex, and ECMA-262 §22.2',
    lts: true,
  },
  {
    name: 'moonfory',
    group: 'format',
    blurb: 'A value written so that Java, Go or Python reads it back as its own.',
    after: 'Apache Fory',
    lts: true,
  },
  {
    name: 'moonzip',
    group: 'format',
    blurb: 'DEFLATE, the zlib and gzip containers built on it, and the ZIP archive.',
    after: 'RFC 1950 to 1952, and the ZIP appnote',
    lts: true,
  },
  {
    name: 'moonbase',
    group: 'format',
    blurb: 'base16, base32, base36, base58, base62 and base64, then bech32, base58check and multibase.',
    after: 'RFC 4648, and the alphabets that grew up outside it',
    lts: true,
  },
  {
    name: 'moonvar',
    group: 'format',
    blurb: 'How a number becomes bytes and back, fixed width and variable length alike.',
    after: 'the four protocol families that each define it differently',
    lts: true,
  },
  {
    name: 'moonmime',
    group: 'format',
    blurb: 'The MIME family: media types and their parameters, the extension-to-type registry, Content-Disposition, multipart bodies and multipart/form-data, read and written from bytes.',
    lts: true,
  },
  {
    name: 'moonsver',
    group: 'format',
    blurb: 'Semantic Versioning 2.0.0: parsing, printing, precedence, bumping and version ranges, with the range grammar of npm, Cargo, Ruby or the strict spec as a parameter.',
    lts: true,
  },
  {
    name: 'moonurl',
    group: 'format',
    blurb: 'URI references as RFC 3986 defines them: parsing, recomposing, resolving and percent coding by component, and data URLs.',
    lts: true,
  },
  {
    name: 'moonimage',
    group: 'format',
    blurb: 'Image codecs: PNG, QOI, BMP, TGA, JPEG, GIF and WebP, and the pixel arithmetic between them.',
    lts: true,
  },
  {
    name: 'moonproto',
    group: 'format',
    blurb: 'Protocol Buffers: runtime, reflection, JSON and text formats, and the protoc plugin.',
    lts: true,
  },
  {
    name: 'moonmd',
    group: 'format',
    blurb: 'Markdown: CommonMark and GFM, whole or as it streams in.',
    lts: true,
  },

  {
    name: 'mooncrypt',
    group: 'base',
    blurb: 'Hashes, MACs, ciphers, AEAD, key agreement and signatures — one algorithm to a package.',
    after: 'hashlib, hmac and the RustCrypto crates',
    lts: true,
  },
  {
    name: 'moonseal',
    group: 'base',
    blurb: 'Seal a file for several people at once; any one of them opens it.',
    after: 'age',
    lts: true,
  },
  {
    name: 'mooncred',
    group: 'base',
    blurb: 'Credential formats: JSON Web Tokens, the keys they are verified with, ASN.1 and X.509.',
    after: 'the JOSE, ASN.1 and PKIX specifications',
    lts: true,
  },
  {
    name: 'moondate',
    group: 'base',
    blurb: 'Dates, times, instants, durations and cron expressions.',
    after: 'Python’s datetime',
    lts: true,
  },
  {
    name: 'moonlog',
    group: 'base',
    blurb: 'A level, a message, fields carried as values, and a seam to write through.',
    after: 'serlog',
    lts: true,
  },
  {
    name: 'moonpool',
    group: 'base',
    blurb: 'Resource pools, backoff and flow control — the bookkeeping every client rewrites.',
    lts: true,
  },
  {
    name: 'moonconf',
    group: 'base',
    blurb: 'Configuration from defaults, the environment and files, checked on the way in.',
    lts: true,
  },
  {
    name: 'moonast',
    group: 'base',
    blurb: 'Generate MoonBit code from annotated declarations: templates over the official syntax tree, typed attribute arguments, and the generator scaffolding behind dev_build.',
    lts: true,
  },
  {
    name: 'moonward',
    group: 'base',
    blurb: 'Resilience without I/O: circuit breaking, adaptive load shedding, rate limits, backoff and deadlines, with the clock and the randomness passed in.',
    lts: true,
  },
  {
    name: 'moonucd',
    group: 'base',
    blurb: 'Unicode character database: categories, properties, case mapping and folding, generated from the UCD.',
    lts: true,
  },
  {
    name: 'moonuuid',
    group: 'base',
    blurb: 'UUIDs: parse every spelling, make versions 1 to 8, generate over your own clock and randomness.',
    lts: true,
  },
  {
    name: 'moonnum',
    group: 'base',
    blurb: 'Python’s numbers: arbitrary-precision integers, floats, complex numbers and fractions, read, written and formatted the way Python does.',
    lts: true,
  },
  {
    name: 'moonmath',
    group: 'base',
    blurb: 'Vectors, matrices, quaternions and geometry, laid out for WGSL.',
    lts: true,
  },
  {
    name: 'moonrgba',
    group: 'base',
    blurb: 'CSS colour syntax, colour spaces, gamut mapping, terminal colours and colour arithmetic.',
    lts: true,
  },
  {
    name: 'moonrand',
    group: 'base',
    blurb: 'Reproducible pseudo-random numbers: a default generator, sixty-three more, and the sampling and distributions Python’s random names.',
    lts: true,
  },
  {
    name: 'moonseed',
    group: 'base',
    blurb: 'Secure random bytes and unbiased sampling.',
    lts: true,
  },
  {
    name: 'moonkart',
    group: 'base',
    blurb: 'A cache bounded by count or weight, with expiry, loaders and eviction listeners.',
    lts: true,
  },
  {
    name: 'moongraph',
    group: 'base',
    blurb: 'Graphs: representations and the algorithms on them.',
    lts: true,
  },
  {
    name: 'moonstl',
    group: 'base',
    blurb: 'Data structures and algorithms the MoonBit core library leaves out.',
    lts: true,
  },
  {
    name: 'moonknob',
    group: 'base',
    blurb: 'Which of two settings wins, and what to do when they disagree: the precedence every moonbitstack library shares.',
    lts: true,
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
    name: 'moonp2p',
    group: 'net',
    blurb: 'libp2p: identity, multiaddr, TCP, QUIC and WebRTC transports, Noise and TLS handshakes, multiplexing, a DHT and gossipsub.',
    after: 'the libp2p specifications',
    unlisted: true,
  },
  {
    name: 'mooncrdt',
    group: 'systems',
    blurb: 'Conflict-free replicated data types: counters, registers, sets and sequences.',
    unlisted: true,
  },
  {
    name: 'mooneval',
    group: 'systems',
    blurb: 'Evaluation: datasets, scorers, experiments and regression comparison, runnable in CI.',
    after: 'openevals, Ragas, promptfoo and Inspect',
    unlisted: true,
  },
  {
    name: 'moonlens',
    group: 'systems',
    blurb: 'A self-hosted page for traces and evaluations: takes OTLP, shows traces, tokens and cost, compares experiments.',
    after: 'Langfuse and Phoenix',
    unlisted: true,
  },
  {
    name: 'moonfont',
    group: 'ui',
    blurb: 'Font parsing and glyph rasterisation, shared by moonegui and moongame.',
    unlisted: true,
  },
  {
    name: 'moongfx',
    group: 'ui',
    blurb: 'Two-dimensional drawing on the GPU: paths, rounded corners and strokes triangulated, glyphs packed into an atlas.',
    after: 'Skia’s Ganesh, lyon, fontdue and etagere',
    unlisted: true,
  },
  {
    name: 'moonapp',
    group: 'ui',
    blurb: 'A native shell: windows and the event loop, with no third-party windowing library.',
    unlisted: true,
  },
  {
    name: 'moonpane',
    group: 'ui',
    blurb: 'The browser host for moonegui: canvas and DOM.',
    unlisted: true,
  },
  {
    name: 'moondash',
    group: 'ui',
    blurb: 'Analytic web applications, declared the way Dash declares them.',
    after: 'Dash',
    unlisted: true,
  },
  {
    name: 'moonlit',
    group: 'infer',
    blurb: 'A lighter mooninfer.',
    unlisted: true,
  },
  {
    name: 'moonjax',
    group: 'learn',
    blurb: 'Composable function transforms: automatic differentiation, vectorisation, compilation and parallel maps, with neural network layers in the NNX and Linen styles.',
    after: 'JAX and Flax',
    unlisted: true,
  },
  {
    name: 'moondl',
    group: 'learn',
    blurb: 'Deep learning: modules and training loops in the PyTorch style; models, layers and fit in the Keras 3 style.',
    after: 'PyTorch and Keras 3',
    unlisted: true,
  },
  {
    name: 'moonml',
    group: 'learn',
    blurb: 'Classical machine learning and statistical modelling: regression, classification, clustering, decomposition, model selection, gradient-boosted trees, nearest neighbours and AutoML.',
    after: 'scikit-learn, statsmodels, LightGBM and XGBoost',
    unlisted: true,
  },
  {
    name: 'moonft',
    group: 'learn',
    blurb: 'Feature engineering: imputation, encoding, discretisation, transforms, and feature construction and selection.',
    after: 'Feature-engine, category_encoders and Featuretools',
    unlisted: true,
  },
  {
    name: 'moongl',
    group: 'learn',
    blurb: 'Graph machine learning: message passing, sampling and mini-batches, graph neural networks, and automatic graph learning.',
    after: 'PyTorch Geometric, DGL and AutoGL',
    unlisted: true,
  },
  {
    name: 'moonrl',
    group: 'learn',
    blurb: 'Reinforcement learning: environments, classic and deep algorithms, offline learning, distributed sampling and training.',
    after: 'Stable-Baselines3, RLlib and CleanRL',
    unlisted: true,
  },
  {
    name: 'moononnx',
    group: 'learn',
    blurb: 'ONNX models: read, write and run.',
    after: 'ONNX Runtime',
    unlisted: true,
  },
  {
    name: 'moonvec',
    group: 'sci',
    blurb: 'N-dimensional arrays: broadcasting, universal functions, linear algebra, FFT, sparse arrays, interpolation and integration, with SIMD.',
    after: 'NumPy and SciPy',
    unlisted: true,
  },
  {
    name: 'moondask',
    group: 'sci',
    blurb: 'Parallel computing: task graphs over CPU clusters with OpenMP and OpenACC, and over GPUs and NPUs.',
    after: 'Dask, Ray and mpi4py',
    unlisted: true,
  },
  {
    name: 'moondata',
    group: 'sci',
    blurb: 'Data frames: columnar storage, lazy query plans, grouping, joins, windows and pivots, and CSV, JSON, Parquet and Arrow.',
    after: 'Polars, pandas and dplyr',
    unlisted: true,
  },
  {
    name: 'moonplot',
    group: 'sci',
    blurb: 'Plotting: statistical charts, interactive figures, 3D and volume data, and a grammar of graphics, drawn through moonwgpu.',
    after: 'Matplotlib, Plotly and ggplot2',
    unlisted: true,
  },
  {
    name: 'moonsym',
    group: 'sci',
    blurb: 'Symbolic mathematics and automated reasoning: simplification, calculus, equation solving, and SAT, SMT and theorem proving.',
    after: 'SymPy and Z3',
    unlisted: true,
  },
  {
    name: 'moonopt',
    group: 'sci',
    blurb: 'Mathematical optimisation: modelling, and linear, quadratic, conic, nonlinear, mixed-integer and constraint solvers.',
    after: 'JuMP, CVXPY, HiGHS and SCIP',
    unlisted: true,
  },
  {
    name: 'mooncv',
    group: 'sci',
    blurb: 'Computer vision: image processing, features, geometry and calibration, video, detection and tracking.',
    after: 'OpenCV',
    unlisted: true,
  },
  {
    name: 'moongame',
    group: 'game',
    blurb: 'A game engine assembled from the libraries beside it, each usable on its own.',
    unlisted: true,
  },
  {
    name: 'moonecs',
    group: 'game',
    blurb: 'An entity component system.',
    unlisted: true,
  },
  {
    name: 'moonphys',
    group: 'game',
    blurb: 'Collision detection and physics, 2D and 3D over one set of shapes and queries.',
    unlisted: true,
  },
  {
    name: 'moonskel',
    group: 'game',
    blurb: 'Skeletal animation: poses, sampling, blend trees, IK, 2D skins, and animation state machines.',
    after: 'ozz-animation and DragonBones',
    unlisted: true,
  },
  {
    name: 'moonpath',
    group: 'game',
    blurb: 'Navigation: navigation meshes from triangle meshes, path queries, smoothing and crowd avoidance.',
    after: 'Recast and Detour',
    unlisted: true,
  },
  {
    name: 'moonmind',
    group: 'game',
    blurb: 'Decisions: behaviour trees, hierarchical state machines and utility scoring, ticked every frame.',
    after: 'LimboAI, Beehave and BehaviorTree.CPP',
    unlisted: true,
  },
  {
    name: 'moonroll',
    group: 'game',
    blurb: 'Online play: rollback and prediction, input delay, state replication and interpolation.',
    after: 'GGPO',
    unlisted: true,
  },
  {
    name: 'moonaudio',
    group: 'game',
    blurb: 'Audio decoding and playback.',
    unlisted: true,
  },
  {
    name: 'moongltf',
    group: 'game',
    blurb: 'glTF scenes, read for 3D.',
    after: 'the glTF 2.0 specification',
    unlisted: true,
  },
  {
    name: 'moonpgq',
    group: 'base',
    blurb: 'Graph queries over property graphs: Gremlin traversals, openCypher and ISO GQL, parsed and run.',
    after: 'Apache TinkerPop and openCypher',
    unlisted: true,
  },
  {
    name: 'moonpsec',
    group: 'base',
    blurb: 'Parser combinators: error positions and expected sets, backtracking control, operator precedence tables, streaming input.',
    after: 'parsec, megaparsec and FParsec',
    unlisted: true,
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

/** Groups with nothing but unlisted modules in them: they show on the full page only. */
export const unlistedGroups: ReadonlySet<GroupId> = new Set(
  groups.filter(group => (byGroup[group.id] ?? []).every(entry => entry.unlisted)).map(group => group.id),
)

// The counts describe the page everyone sees, so an unlisted module is not one of them.
const listed = entries.filter(entry => !entry.unlisted)

export const counts = {
  all: listed.length,
  published: listed.filter(entry => entry.version !== undefined).length,
  lts: listed.filter(entry => entry.lts).length,
  planned: listed.filter(entry => entry.planned).length,
}
