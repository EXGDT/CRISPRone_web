<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import cas9_img from '@/assets/cas9.png'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'
import * as ReactDOM from 'react-dom'
import React from 'react'
import '@fontsource/roboto'
import assembly from '@/assets/jbrowse/assembly2.ts'
import tracks from '@/assets/jbrowse/tracks2.ts'
import config from '@/assets/jbrowse/config2.ts'
import jbrowse from '@//components/JBrowse.vue'

const route = useRoute()
const taskID = ref(route.query.taskID)
const taskStatus = ref('running')
const sgRNAJson = ref('')
const assemblyData = ref(assembly)
const tracksData = ref(tracks)
const configurationData = ref(config)
let intervalId

defineExpose({
  assembly: assemblyData,
  tracks: tracksData,
  configuration: configurationData
})

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
  intervalId = setInterval(fetchTaskStatus, 2000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <el-main style="height: 90vh">
        <jbrowse :assembly="assembly" :tracks="tracks" :configuration="configuration"/>
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
