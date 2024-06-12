<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import cas12b_img from '@/assets/cas12b.png'

import { ref, reactive, watch, onMounted } from 'vue'

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
const toCas12b = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const response = await axios.post('http://211.69.141.134:8866/cas12b_API/', form)
      console.log(response.data)
      task_id.value = response.data.task_id
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const fillExampleID = () => {
  form.inputSequence = 'Ghjin_A07g001000'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_V1.1_HZAU'
}
const fillExamplePosition = () => {
  form.inputSequence = 'Ghjin_A01:80323913-80324566'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_V1.1_HZAU'
}
const fillExampleSeq = () => {
  form.inputSequence =
    '>Ghjin_A01g000010\nATGTTTATACACTCATCTTTTCTTGGGTAGTCCGCAAGCCTTAAGCAATAAGAGAACCAGGGGGACTATTGAAACAGTGTAATGAAGGATCAAACCATGCCAGAAGCAATCAAATGCCTTTTTCATGAACATCTGGATTCAGTTTTTGATTCTGAGAAGAAAATGAGGCACTTTATCAAA'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_V1.1_HZAU'
}

const namedb_value = ref([])
const fillNameDB = async () => {
  const response = await axios.get('http://211.69.141.134:8866/cas12b_namedb_list')
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
            <el-image :src="cas12b_img" />
          </el-col>
          <el-col :span="8">
            <h4>
              <strong>Design of <span style="color: red">CRISPR/Cas12b (C2c1)</span> guide RNAs</strong>
            </h4>
            <p class="text-muted">
              The CRISPR-Cas12b (<span style="color:blue">TTN + 20bp</span>) is an RNA-guided endonuclease that can specifically cleave target double stranded DNA in the presence of PAM.
              Cas12b has high cleavage activity, and the optimal temperature of cleavage reaction is 48 °C, which makes it nearly impossible to use it in mammalian and plant cells. Fortunately, scientists have found several other Cas12b variants which cleave DNA at lower temperatures.
              <a href="https://onlinelibrary.wiley.com/doi/full/10.1111/pbi.13417" target="_blank">More ...<i class="fas fa-external-link-alt"></i></a>.
            </p>
            <p><strong>Advantages:</strong></p>
            <ul>
              <li>Cas12b nucleases are smaller than Cas9 and Cas12a/Cpf1</li>
              <li>Cas12b can maintain high enzyme activity in a wide temperature and pH range</li>
              <li>Cas12b have very high target specificity (low off-target editing)</li>
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
                  placeholder="Please input a valid Gene Id or Genome Position or Sequence."
                  :autosize="{ minRows: 4, maxRows: 12 }"
                  :clearable="false"
                />
              </el-form-item> </el-col
          ></el-row>

          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item label="PAM Type" prop="pam">
                <template #label>
                  <strong>PAM Type <i class="fas fa-level-down-alt"></i> </strong>
                  <a href="/help/#enzymes" target="_blank">
                    See notes on enzymes in the help
                    <el-icon>
                      <Link /> </el-icon
                  ></a>
                </template>
                <el-select v-model="form.pam" placeholder="Please select a PAM type">
                  <el-option label="TTN-20bp - GhCas12b" value="TTN"></el-option>
                  <el-option label="ATTN-23bp - BhCas12b v4" value="ATTN"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="9">
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
          </el-row>

          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item prop="pam">
                <template #label>
                  <strong>Customized PAM</strong> (IUPAC nucleotide code is allowed to be filled in.
                  <strong>PAM Type</strong> <i class="fas fa-level-up-alt"></i>)
                </template>
                <el-input v-model="form.pam" />
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item prop="sgRNAModule">
                <template #label>
                  <strong>sgRNA module of Customized PAM</strong>
                </template>
                <el-select
                  v-model="form.sgRNAModule"
                  placeholder="Select an order for PAM & spacer."
                >
                  <el-option label="5'-Spacer + PAM-3'" value="spacerpam" />
                  <el-option label="5'-PAM + Spacer-3'" value="pamspacer" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item prop="spacerLength">
                <template #label>
                  <strong>Spacer length of Customized PAM</strong>
                </template>
                <el-input v-model="form.spacerLength" type="number" min="10" max="50" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center"
            ><el-col :span="18">
              <el-form-item>
                <el-button type="primary" @click="toCas12b">Create</el-button>
                <el-button @click="fillExampleID">Example(Gene ID)</el-button>
                <el-button @click="fillExamplePosition">Example(Genome Position)</el-button>
                <el-button @click="fillExampleSeq">Example(Genome Sequence)</el-button>
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
