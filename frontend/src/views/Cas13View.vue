<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import cas13_img from '@/assets/cas13.jpg'

import { ref, reactive, watch, onMounted } from 'vue'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'

import axios from 'axios'

import type { FormInstance, FormRules } from 'element-plus'

const pam_dict = ref({
  NGG: ['spacerpam', 20],
  NG: ['spacerpam', 20],
  NNG: ['spacerpam', 20],
  NGN: ['spacerpam', 20],
  NNGT: ['spacerpam', 20],
  NAA: ['spacerpam', 20],
  NNGRRT: ['spacerpam', 21],
  'NNGRRT-20': ['spacerpam', 20],
  NGK: ['spacerpam', 20],
  NNNRRT: ['spacerpam', 21],
  'NNNRRT-20': ['spacerpam', 20],
  NGA: ['spacerpam', 20],
  NNNNCC: ['spacerpam', 24],
  NGCG: ['spacerpam', 20],
  NNAGAA: ['spacerpam', 20],
  NGGNG: ['spacerpam', 20],
  NNNNGMTT: ['spacerpam', 20],
  NNNNACA: ['spacerpam', 20],
  NNNNRYAC: ['spacerpam', 22],
  NNNVRYAC: ['spacerpam', 22],
  TTCN: ['pamspacer', 20],
  YTTV: ['pamspacer', 20],
  NNNNCNAA: ['spacerpam', 20],
  NNN: ['spacerpam', 20],
  NRN: ['spacerpam', 20],
  NYN: ['spacerpam', 20]
})

interface RuleForm {
  inputSequence: string
  pam: string
  spacerLength: number
  sgRNAModule: string
  name_db: string
}

const form = reactive<RuleForm>({
  inputSequence: '',
  pam: '',
  spacerLength: 20,
  sgRNAModule: '',
  name_db: ''
})

const rules = {
  inputSequence: [{ required: true, message: 'Check here', trigger: 'blur' }],
  pam: [{ required: true, message: 'Check here', trigger: 'blur' }],
  spacerLength: [{ required: true, message: 'Check here', trigger: 'blur' }],
  sgRNAModule: [{ required: true, message: 'Check here', trigger: 'change' }],
  name_db: [{ required: true, message: 'Check here', trigger: 'blur' }]
}

const formRef = ref<FormInstance>()

watch(
  () => form.pam,
  (pam) => {
    if (pam in pam_dict.value) {
      const pam_prop = pam_dict.value[pam as keyof typeof pam_dict.value]
      form.sgRNAModule = pam_prop[0].toString()
      form.spacerLength = pam_prop[1] as number
    }
  }
)

const task_id = ref('')
const toCas13 = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const response = await axios.post('http://211.69.141.134:8866/cas13_API/', form)
      console.log(response.data)
      task_id.value = response.data.task_id
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const fillExampleID = () => {
  form.inputSequence = 'Ghjin_A07g001000.1'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_V1.1_HZAU'
}
const fillExampleSeq = () => {
  form.inputSequence =
    '>Ghjin_A01g000020.1 CDS=1-207\nATGGTTGTTTATTTTTCTTTGATTCTTCTGTGTTGGTTCGCAAAAGAAGGAATGTTTTATGACTTCGAGA\nGGACTGGAATAAGCACTTTAGTCACTATGGGAGTCCGAGATATTCAGGATGAGGGATTTCCCGATCAGTT\nTTCTGGGTTGGCTGACTCCGTATTTCTGGACCTACCACAACCTTGGCTAGCCATTCCTTCAGGTTGA'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_V1.1_HZAU'
}

const namedb_value = ref([])
const fillNameDB = async () => {
  const response = await axios.get('http://211.69.141.134:8866/cas13_namedb_list')
  namedb_value.value = response.data.map((item) => ({
    label: item.label,
    value: item.value
  }))
}

onMounted(fillNameDB)
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <el-main style="height: 90vh">
        <el-row justify="center" :gutter="30">
          <el-col :span="8">
            <el-image :src="cas13_img" />
          </el-col>
          <el-col :span="8">
            <h4>
              <strong>Design of <span style="color: red">CRISPR/Cas13</span> guide RNAs</strong>
            </h4>
            <p class="text-muted">
              The RNA-targeting endonuclease Cas13 (Type VI CRISPR) ability to selectively target cellular RNAs and influence gene expression without making permanent genetic changes. <a href="https://www.nature.com/articles/nbt.4054" target="_blank">More ...<i class="fas fa-external-link-alt"></i></a>.
            </p>
            <p><strong>Advantages:</strong></p>
            <ul>
              <li>RNA editing doesn't require homology-directed repair (HDR) machinery.</li>
              <li>Cas13 enzymes also don't require a PAM sequence at the target locus.</li>
              <li>Cas13 enzymes do not contain the RuvC and HNH domains responsible for DNA cleavage, so they cannot directly edit the genome.</li>
            </ul>
          </el-col>
        </el-row>
        <el-row justify="center"
          ><el-col :span="18"><el-divider /></el-col>
        </el-row>
        <el-row justify="center"><el-col :span="18"> </el-col></el-row>

        <el-form
          :model="form"
          label-position="top"
          ref="formRef"
          :rules="rules"
          :hide-required-asterisk="true"
        >
          <el-row justify="center"
            ><el-col :span="18">
              <el-form-item prop="inputSequence">
                <template #label>
                  <h4>
                    <strong>Input Sequences</strong> (Only
                    <span style="color: red"><strong>One</strong></span> Id/Position/Sequence
                    required; <strong>Design speed:</strong> Id = Position > Fasta Sequence)
                    <el-tooltip content="Recommended input Gene Id or Genome Position">
                      <el-icon>
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </h4>
                </template>
                <el-input
                  v-model="form.inputSequence"
                  type="textarea"
                  rows="4"
                  placeholder="Input Your Gene Id / DNA Sequence or See a DEMO as show in example&#10;To improve accuracy and run time, the recommended input sequence length is 80 to 500 bp"
                  :autosize="{ minRows: 4, maxRows: 12 }"
                  :clearable="false"
                />
              </el-form-item> </el-col
          ></el-row>

          <el-row justify="center" :gutter="20">
            <el-col :span="10">
              <el-form-item label="Target Genome" prop="name_db">
                <template #label>
                  <strong>Target Genome</strong
                  ><a href="/help/#genomes" target="_blank"
                    >: More Information of Genomes Metadata
                    <el-icon>
                      <Link /> </el-icon
                  ></a>
                </template>
                <el-select v-model="form.name_db" placeholder="Select your target genome">
                  <el-option
                    v-for="item in namedb_value"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="spacerLength">
                <template #label>
                  <strong>Spacer length</strong>
                </template>
                <el-input v-model="form.spacerLength" type="number" min="20" max="30" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center"
            ><el-col :span="18">
              <el-form-item>
                <el-button type="primary" :icon="Search" size="large" @click="toCas13">Create</el-button>
                <el-button type="success" size="large" @click="fillExampleID">Example(Gene ID)</el-button>
                <el-button type="success" size="large" @click="fillExampleSeq">Example(RNA Sequence)</el-button>
              </el-form-item>
            </el-col></el-row
          >
        </el-form>
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style scoped></style>
