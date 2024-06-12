<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import ChatCRISPR_img from '@/assets/cas12b.png'

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
      <el-main style="height: 84vh">
        <el-row justify="center" :gutter="30">
          <el-col :span="8">
            <el-image :src="ChatCRISPR_img" />
          </el-col>
          <el-col :span="8">
            <h4>
              <strong>Chat with <span style="color: red">ChatCRISPR</span></strong>
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
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style scoped></style>
