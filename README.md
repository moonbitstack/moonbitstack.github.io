# moonbitstack.github.io

The organisation's front page: one catalogue of every module, ordered the way the stack stands.

```
npm install
npm run dev      # http://localhost:4321
npm run check    # types, across .astro, .tsx, .vue and .svelte
npm run build    # dist/
```

`main` deploys through `.github/workflows/pages.yml`.

## What is where

| Path | Holds |
|:--:|:--|
| `src/data/packages.ts` | The catalogue. A new repository is a row here and nothing else. |
| `src/pages/index.astro` | The page: the hero, and the two islands the catalogue is made of. |
| `src/styles/` | SCSS. `_tokens.scss` is the palette and the two type families. |
| `src/components/{react,solid,svelte,vue}/` | One directory per runtime. |

## Four runtimes on one page

Astro renders every island at build time, so the catalogue is in the HTML and reads with scripting off; each island hydrates when the browser goes idle. Which framework each one is written in is a decision recorded at the top of its file:

| Island | Runtime | Why that one |
|:--:|:--:|:--|
| `Index` | Solid | A keystroke redraws a list; signals touch the entries that changed and nothing else. |
| `Nav` | Vue | One list bound to one value — `v-for` and a class binding, with its template in Pug. |
| `Theme` | Svelte | Compiles its reactivity away, which is the right size for a three-state switch. |
| `Install` | React | A form action with a pending state, which is what `useActionState` is for. |

Documentation for the modules themselves lives at `moonbitstack.github.io/<module>/`, built in each module's own repository.
