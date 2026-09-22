<script setup lang="ts">
// Vue, because the rail is one list bound to one piece of state. `v-for` with a
// class binding says that in three lines of template and needs no render
// function around it — and that template is the one place on this site where
// Pug is a simplification rather than a costume.

import { onMounted, onUnmounted, ref } from 'vue'
import { groups } from '../../data/packages'

const here = ref<string>(groups[0].id)
let watcher: IntersectionObserver | undefined

onMounted(() => {
  const seen = new Map<string, number>()
  watcher = new IntersectionObserver(
    records => {
      for (const record of records) seen.set(record.target.id, record.intersectionRatio)
      const [id, ratio] = [...seen].toSorted(([, a], [, b]) => b - a)[0] ?? ['', 0]
      if (ratio > 0) here.value = id
    },
    { threshold: [0, 0.2, 0.6, 1] },
  )
  for (const group of groups) {
    const node = document.getElementById(group.id)
    if (node) watcher.observe(node)
  }
})

onUnmounted(() => watcher?.disconnect())
</script>

<template lang="pug">
nav.rail(aria-label="Layers")
  a(
    v-for="group in groups"
    :key="group.id"
    :href="`#${group.id}`"
    :class="{ here: here === group.id }"
  ) {{ group.title }}
</template>

<style lang="scss" scoped>
.rail {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 40px;
  align-self: start;
  font-size: 16px;
  line-height: 1.3;

  a {
    width: fit-content;
    color: var(--soft);
    text-decoration: none;
    transition: color 120ms ease;

    &:hover {
      color: var(--ink);
    }

    // The rule marks where you are; it does not sit under every entry waiting
    // to be earned.
    &.here {
      color: var(--ink);
      box-shadow: inset 0 -1px 0 var(--mark);
    }
  }
}

@media (width <= 900px) {
  .rail {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px 20px;
    padding-bottom: 18px;
    font-size: 15px;
  }
}
</style>
