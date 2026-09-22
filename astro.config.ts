import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import solid from '@astrojs/solid-js'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'

// React and Solid both compile JSX, so each is confined to its own directory;
// that is also where a reader looks to see which runtime a component belongs to.
export default defineConfig({
  site: 'https://moonbitstack.github.io',
  integrations: [
    react({ include: ['**/components/react/**'] }),
    solid({ include: ['**/components/solid/**'] }),
    svelte(),
    vue(),
  ],
  build: { inlineStylesheets: 'always' },
})
