<script setup lang="ts">
import '@fontsource/roboto'
import { ref, watch, onMounted, computed } from 'vue'
import {
  JBrowseLinearGenomeView,
  createViewState
} from '@jbrowse/react-linear-genome-view'
import * as ReactDOM from 'react-dom/client'
import React from 'react'

const props = defineProps<{
  assembly: any,
  defaultSession: any,
  configuration: any,
  tracks: any[]
}>()

const jbrowse = ref<HTMLElement | null>(null)

const changeData = computed(() => ({
  assembly: props.assembly,
  defaultSession: props.defaultSession,
  configuration: props.configuration,
  tracks: props.tracks
}))

const renderJBrowse = () => {
  if (jbrowse.value) {
    const viewState = createViewState({
      tracks: props.tracks,
      assembly: props.assembly,
      defaultSession: props.defaultSession,
      configuration: props.configuration
    })
    const root = ReactDOM.createRoot(jbrowse.value)
    root.render(React.createElement(JBrowseLinearGenomeView, { viewState }))
  }
}

watch(changeData, renderJBrowse, { deep: true })

onMounted(() => {
  renderJBrowse()
})
</script>

<template>
  <div ref="jbrowse"></div>
</template>
