/** @jsxImportSource solid-js */

// Solid, because this is the one place on the page where a keystroke redraws a
// list: a signal is wired straight to the nodes it feeds, so typing touches the
// entries that changed and nothing else. It is rendered at build time, so the
// whole catalogue is in the HTML and reads with the runtime switched off.

import { createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import { byGroup, entries, groups, unlistedGroups, type Entry } from '../../data/packages'

function Item(props: { readonly entry: Entry }) {
  const entry = props.entry
  return (
    <article class={['item', entry.planned && 'unwritten', entry.unlisted && 'unlisted'].filter(Boolean).join(' ')}>
      <h3>
        <Show when={!entry.unlisted} fallback={entry.name}>
          <a href={entry.repoUrl}>{entry.name}</a>
        </Show>
        <span class="state">
          {entry.version ?? (entry.planned ? 'in design' : entry.unpublished)}
          <Show when={entry.lts}>
            <abbr class="lts" title="long-term support: the interface is settled, releases fix bugs">LTS</abbr>
          </Show>
        </span>
      </h3>
      <p>{entry.blurb}</p>
      <Show when={entry.after}>{after => <p class="after">after {after()}</p>}</Show>
      <Show when={entry.docsUrl || entry.modUrl}>
        <p class="more">
          <Show when={entry.docsUrl}>{url => <a href={url()}>documentation</a>}</Show>
          <Show when={entry.modUrl}>{url => <a href={url()}>mooncakes</a>}</Show>
        </p>
      </Show>
    </article>
  )
}

export default function Index() {
  const [query, setQuery] = createSignal('')
  // The full page is a state of the document, set before paint by the layout;
  // a search looks at what the page shows, so it reads the same state.
  const pool = () =>
    document.documentElement.hasAttribute('data-full') ? entries : entries.filter(entry => !entry.unlisted)

  const hits = createMemo(() => {
    const words = query().toLowerCase().split(/\s+/).filter(Boolean)
    return words.length === 0 ? null : pool().filter(entry => words.every(word => entry.haystack.includes(word)))
  })

  createEffect(() => {
    document.documentElement.toggleAttribute('data-searching', hits() !== null)
  })

  return (
    <>
      <div class="finder">
        <input
          type="search"
          value={query()}
          placeholder="Find a module"
          aria-label="Find a module"
          onInput={event => setQuery(event.currentTarget.value)}
        />
        <Show when={hits()}>
          {found => (
            <span class="count">
              {found().length} of {pool().length}
            </span>
          )}
        </Show>
      </div>

      <Show when={hits()}>
        {found => (
          <section class="found" aria-live="polite">
            <Show
              when={found().length > 0}
              fallback={<p class="empty">No module goes by that name. Try what it does instead.</p>}
            >
              <div class="items">
                <For each={found()}>{entry => <Item entry={entry} />}</For>
              </div>
            </Show>
          </section>
        )}
      </Show>

      <div class="strata">
        <For each={groups}>
          {group => (
            <section id={group.id} class={unlistedGroups.has(group.id) ? 'unlisted' : undefined}>
              <header class="layer">
                <h2>{group.title}</h2>
                <p>{group.note}</p>
              </header>
              <div class="items">
                <For each={byGroup[group.id]}>{entry => <Item entry={entry} />}</For>
              </div>
            </section>
          )}
        </For>
      </div>
    </>
  )
}
