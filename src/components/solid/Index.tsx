/** @jsxImportSource solid-js */

// Solid, because this is the one place on the page where a keystroke redraws a
// list: a signal is wired straight to the nodes it feeds, so typing touches the
// entries that changed and nothing else. It is rendered at build time, so the
// whole catalogue is in the HTML and reads with the runtime switched off.

import { createEffect, createMemo, createSignal, For, Show } from 'solid-js'
import { byGroup, entries, groups, type Entry } from '../../data/packages'

function Item(props: { readonly entry: Entry }) {
  const entry = props.entry
  return (
    <article class={entry.planned ? 'item unwritten' : 'item'}>
      <h3>
        <a href={entry.repoUrl}>{entry.name}</a>
        <span class="state">{entry.version ?? (entry.planned ? 'in design' : 'a template')}</span>
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

  const hits = createMemo(() => {
    const words = query().toLowerCase().split(/\s+/).filter(Boolean)
    return words.length === 0
      ? null
      : entries.filter(entry => words.every(word => entry.haystack.includes(word)))
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
              {found().length} of {entries.length}
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
            <section id={group.id}>
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
