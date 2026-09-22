<script lang="ts">
  // Svelte, because it compiles its reactivity away: this sits at the top of
  // the first screen and the right size for a three-state switch is no runtime
  // at all. The head script applies the stored choice before paint; this only
  // has to keep it in step afterwards.

  import { onMount } from 'svelte'

  type Choice = 'auto' | 'light' | 'dark'

  const order: readonly Choice[] = ['auto', 'light', 'dark']
  const label: Record<Choice, string> = { auto: 'auto', light: 'light', dark: 'dark' }

  let choice = $state<Choice>('auto')
  let ready = $state(false)

  onMount(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'auto' || saved === 'light' || saved === 'dark') choice = saved
    ready = true
  })

  $effect(() => {
    if (!ready) return
    const root = document.documentElement
    if (choice === 'auto') delete root.dataset.theme
    else root.dataset.theme = choice
    localStorage.setItem('theme', choice)
  })

  const next = () => {
    choice = order[(order.indexOf(choice) + 1) % order.length]
  }
</script>

<button type="button" class="theme" onclick={next} aria-label="Colour scheme: {label[choice]}">
  {label[choice]}
</button>

<style lang="scss">
  .theme {
    font: inherit;
    font-size: 16px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--soft);
    cursor: pointer;
    transition: color 120ms ease;

    &:hover {
      color: var(--ink);
    }
  }
</style>
