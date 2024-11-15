<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import cas9_img from '@/assets/cas9.png'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'
import '@fontsource/roboto'
import assemblyData from '@/assets/jbrowse/assembly.ts'
import tracksData from '@/assets/jbrowse/tracks.ts'
import configData from '@/assets/jbrowse/config.json'
import * as ReactDOM from 'react-dom/client'
import React from 'react'

const route = useRoute()
const taskID = ref(route.query.taskID)
const taskStatus = ref('running')
const sgRNAJson = ref('')
const jbrowse = ref<HTMLElement | null>(null)
let intervalId

const assembly = {
  name: 'Zea_mays',
  sequence: {
    type: 'ReferenceSequenceTrack',
    trackId: 'Zea_mays-ReferenceSequenceTrack',
    adapter: {
      type: 'IndexedFastaAdapter',
      fastaLocation: {
        uri: '/jbrowse/Zea_mays.fa',
        locationType: 'UriLocation'
      },
      faiLocation: {
        uri: '/jbrowse/Zea_mays.fa.fai',
        locationType: 'UriLocation'
      }
    }
  }
}

const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'Zea_mays.processed',
    name: 'Zea_mays.processed',
    adapter: {
      type: 'Gff3Adapter',
      gffLocation: {
        uri: '/jbrowse/Zea_mays.processed.gff3',
        locationType: 'UriLocation'
      }
    },
    assemblyNames: ['Zea_mays']
  }
]

const defaultSession = {
  id: 'Zea_mays',
  name: 'Session',
  view: {
    id: 'linearGenomeView',
    type: 'LinearGenomeView',
    displayedRegions: [
      {
        refName: '3',
        start: 50000,
        end: 140000,
        reversed: false,
        assemblyName: 'Zea_mays'
      }
    ],
    tracks: [
      {
        id: 'IpTYJKmsp',
        type: 'ReferenceSequenceTrack',
        configuration: 'Zea_mays-ReferenceSequenceTrack',
        displays: [
          {
            id: 's877wHWtzD',
            type: 'LinearReferenceSequenceDisplay',
            configuration: 'Zea_mays-ReferenceSequenceTrack-LinearReferenceSequenceDisplay'
          }
        ]
      }
    ],
  }
}

const renderJBrowse = () => {
  if (jbrowse.value) {
    const viewState = createViewState({
      tracks: tracks,
      assembly: assembly,
      defaultSession: defaultSession
      // configuration: configData
    })
    const root = ReactDOM.createRoot(jbrowse.value)
    root.render(React.createElement(JBrowseLinearGenomeView, { viewState }))
  }
}

const fetchTaskStatus = async () => {
  try {
    const response = await axios.get(`http://211.69.141.134:8866/cas9_module_API/`, {
      params: { task_id: taskID.value }
    })
    if (response.data.task_status === 'finished') {
      taskStatus.value = 'finished'
      sgRNAJson.value = response.data.sgRNAJson
      clearInterval(intervalId)
    }
  } catch (error) {
    console.error('Failed to fetch task status:', error)
  }
}

onMounted(() => {
  setTimeout(() => {
    intervalId = setInterval(fetchTaskStatus, 2000)
  }, 2000)
  renderJBrowse()
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <div ref="jbrowse"></div>
      <el-main style="height: 90vh">
        <el-table :data="sgRNAJson.rows" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                <h3>offtarget</h3>
                <el-table :data="props.row.offtarget_json.rows">
                  <el-table-column label="family" prop="family" />
                  <el-table-column label="seqid" prop="seqid" />
                  <el-table-column label="types" prop="types" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="sgRNA_id" prop="sgRNA_id" />
          <el-table-column label="sgRNA_seq" prop="sgRNA_seq" />
        </el-table>
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style scoped></style>
