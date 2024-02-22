<script setup lang="ts">

import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

import cas9_img from '@/assets/cas9.png';

import { ref, reactive, watch } from 'vue'

import axios from 'axios'

import type { FormInstance, FormRules } from 'element-plus'

const pam_dict = ref({
  'NGG': ['spacerpam', 20],
  'NG': ['spacerpam', 20],
  'NNG': ['spacerpam', 20],
  'NGN': ['spacerpam', 20],
  'NNGT': ['spacerpam', 20],
  'NAA': ['spacerpam', 20],
  'NNGRRT': ['spacerpam', 21],
  'NNGRRT-20': ['spacerpam', 20],
  'NGK': ['spacerpam', 20],
  'NNNRRT': ['spacerpam', 21],
  'NNNRRT-20': ['spacerpam', 20],
  'NGA': ['spacerpam', 20],
  'NNNNCC': ['spacerpam', 24],
  'NGCG': ['spacerpam', 20],
  'NNAGAA': ['spacerpam', 20],
  'NGGNG': ['spacerpam', 20],
  'NNNNGMTT': ['spacerpam', 20],
  'NNNNACA': ['spacerpam', 20],
  'NNNNRYAC': ['spacerpam', 22],
  'NNNVRYAC': ['spacerpam', 22],
  'TTCN': ['pamspacer', 20],
  'YTTV': ['pamspacer', 20],
  'NNNNCNAA': ['spacerpam', 20],
  'NNN': ['spacerpam', 20],
  'NRN': ['spacerpam', 20],
  'NYN': ['spacerpam', 20]
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
  name_db: '',
})

const rules = {
  inputSequence: [{ required: true, message: 'Check here', trigger: 'blur' }],
  pam: [{ required: true, message: 'Check here', trigger: 'blur' }],
  spacerLength: [{ required: true, message: 'Check here', trigger: 'blur' }],
  sgRNAModule: [{ required: true, message: 'Check here', trigger: 'change' }],
  name_db: [{ required: true, message: 'Check here', trigger: 'blur' }],
};

const formRef = ref<FormInstance>()

watch(() => form.pam, (pam) => {
  if (pam in pam_dict.value) {
    const pam_prop = pam_dict.value[pam as keyof typeof pam_dict.value];
    form.sgRNAModule = pam_prop[0].toString()
    form.spacerLength = pam_prop[1] as number
  }
})

const task_id = ref('')
const toCas9 = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const response = await axios.post('http://211.69.141.134:8866/cas9_API/', form)
      console.log(response.data)
      task_id.value = response.data.task_id
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const fillExampleID = () => {
  form.inputSequence = 'Gh_A07G001000'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_HZAU'
}
const fillExamplePosition = () => {
  form.inputSequence = 'Ghjin_A01:80323913-80324566'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_HZAU'
}
const fillExampleSeq = () => {
  form.inputSequence = '>Ghjin_A01g000010\nATGTTTATACACTCATCTTTTCTTGGGTAGTCCGCAAGCCTTAAGCAATAAGAGAACCAGGGGGACTATTGAAACAGTGTAATGAAGGATCAAACCATGCCAGAAGCAATCAAATGCCTTTTTCATGAACATCTGGATTCAGTTTTTGATTCTGAGAAGAAAATGAGGCACTTTATCAAA'
  form.pam = 'NGG'
  form.name_db = 'Gossypium_hirsutum_Jin668_HZAU'
}

</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <el-main style="height: 90vh;">
        <el-row justify="center" :gutter="30">
          <el-col :span="8">
            <el-image :src="cas9_img" />
          </el-col>
          <el-col :span="8">
            <h4><strong>Design of <span style="color:red">CRISPR/Cas9</span> guide RNAs</strong></h4>
            <p class="text-muted">
              CRISPR/Cas enzymes will introduce a double-strand break (DSB) at a specific location based on a gRNA-defined
              target sequence. DSBs are preferentially repaired in the cell by non-homologous end joining (NHEJ), a
              mechanism which frequently causes insertions or deletions (indels) in the DNA. Indels often lead to
              frameshifts, creating loss of function alleles. <a
                href="https://www.synthego.com/blog/crispr-knockin-tips-tricks" target="_blank">More ...<el-icon>
                  <Link />
                </el-icon>
              </a></p>
            <p><strong>Components:</strong></p>
            <ul>
              <li>Guide RNA (gRNA or sgRNA), a short synthetic RNA composed of a scaffold sequence necessary for
                Cas-binding and a user-defined ∼20 nucleotide spacer that defines the genomic target to be modified.</li>
              <li>CRISPR-associated endonuclease (Cas protein)</li>
            </ul>
          </el-col>
        </el-row>
        <el-row justify="center"><el-col :span="18"><el-divider /></el-col>
        </el-row>
        <el-row justify="center"><el-col :span="18">
          </el-col></el-row>

        <el-form :model="form" label-position="top" ref="formRef" :rules="rules" :hide-required-asterisk="true">
          <el-row justify="center"><el-col :span="18">
              <el-form-item prop="inputSequence">
                <template #label>
                  <h4>
                    <strong>Input Sequences</strong> (Only <span style="color:red"><strong>One</strong></span>
                    Id/Position/Sequence required; <strong>Design speed:</strong> Id = Position > Fasta Sequence)
                    <el-tooltip content="Recommended input Gene Id or Genome Position">
                      <el-icon>
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </h4>
                </template>
                <el-input v-model="form.inputSequence" type="textarea" rows="4"
                  placeholder="Please input a valid Gene Id or Genome Position or Sequence."
                  :autosize="{ minRows: 4, maxRows: 12 }" :clearable="false" />
              </el-form-item>
            </el-col></el-row>

          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item label="PAM Type" prop="pam">
                <template #label>
                  <strong>PAM Type <i class="fas fa-level-down-alt"></i>
                  </strong>
                  <a href="/help/#enzymes" target="_blank"> See notes on enzymes in the help <el-icon>
                      <Link />
                    </el-icon></a>
                </template>
                <el-select v-model="form.pam" placeholder="Please select a PAM type">
                  <el-option label="SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" value="NGG"></el-option>
                  <el-option label="NG-Cas9 or xCas9 3.7 (TLIKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'"
                    value="NG"></el-option>
                  <el-option label="20bp-NNG - Cas9 S. canis" value="NNG"></el-option>
                  <el-option label="20bp-NGN - SpG" value="NGN"></el-option>
                  <el-option label="20bp-NNGT - Cas9 S. canis - high efficiency PAM, recommended"
                    value="NNGT"></el-option>
                  <el-option label="20bp-NAA - iSpyMacCas9" value="NAA"></el-option>
                  <el-option label="21bp-NNG(A/G)(A/G)T - Cas9 S. Aureus" value="NNGRRT"></el-option>
                  <el-option label="20bp-NNG(A/G)(A/G)T - Cas9 S. Aureus with 20bp-guides" value="NNGRRT-20"></el-option>
                  <el-option label="20bp-NG(G/T) - xCas9, recommended PAM, see notes" value="NGK"></el-option>
                  <el-option label="21bp-NNN(A/G)(A/G)T - KKH SaCas9" value="NNNRRT"></el-option>
                  <el-option label="20bp-NNN(A/G)(A/G)T - KKH SaCas9 with 20bp-guides" value="NNNRRT-20"></el-option>
                  <el-option label="20bp-NGA - Cas9 S. Pyogenes mutant VQR" value="NGA"></el-option>
                  <el-option label="24bp-NNNNCC - Nme2Cas9" value="NNNNCC"></el-option>
                  <el-option label="20bp-NGCG - Cas9 S. Pyogenes mutant VRER" value="NGCG"></el-option>
                  <el-option label="20bp-NNAGAA - Cas9 S. Thermophilus" value="NNAGAA"></el-option>
                  <el-option label="20bp-NGGNG - Cas9 S. Thermophilus" value="NGGNG"></el-option>
                  <el-option label="20bp-NNNNG(A/C)TT - Cas9 N. Meningitidis" value="NNNNGMTT"></el-option>
                  <el-option label="20bp-NNNNACA - Cas9 Campylobacter jejuni, original PAM" value="NNNNACA"></el-option>
                  <el-option label="22bp-NNNNRYAC - Cas9 Campylobacter jejuni, revised PAM" value="NNNNRYAC"></el-option>
                  <el-option label="22bp-NNNVRYAC - Cas9 Campylobacter jejuni, opt. efficiency"
                    value="NNNVRYAC"></el-option>
                  <el-option label="TTCN-20bp - CasX" value="TTCN"></el-option>
                  <el-option label="YTTV-20bp - MAD7 Nuclease, Lui, Schiel, Maksimova et al, CRISPR J 2020"
                    value="YTTV"></el-option>
                  <el-option label="20bp-NNNNCNAA - Thermo Cas9 - Walker et al, Metab Eng Comm 2020"
                    value="NNNNCNAA"></el-option>
                  <el-option label="20bp-NNN - SpRY, Walton et al Science 2020" value="NNN"></el-option>
                  <el-option label="20bp-NRN - SpRY (high efficiency PAM)" value="NRN"></el-option>
                  <el-option label="20bp-NYN - SpRY (low efficiency PAM)" value="NYN"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="9">
              <el-form-item label="Target Genome" prop="name_db">
                <template #label>
                  <strong>Target Genome</strong><a href="/help/#genomes" target="_blank">: More Information of Genomes
                    Metadata <el-icon>
                      <Link />
                    </el-icon></a>
                </template>
                <el-select v-model="form.name_db" placeholder="Select your targer genome">
                  <el-option label="Gossypium hirsutum Jin668" value="Gossypium_hirsutum_Jin668_HZAU"></el-option>
                  <el-option label="Gossypium hirsutum YZ1" value="Gossypium_hirsutum_YZ1_HZAU"></el-option>
                  <el-option label="Gossypium hirsutum TM-1 (HAU v1.1)" value="Gossypium_hirsutum_TM1_HAU"></el-option>
                  <el-option label="Arabidopsis thaliana (TAIR10)" value="Arabidopsis_thaliana"></el-option>
                  <el-option label="Brassica napus (Xiaoyun)" value="Brassica_napus_Xiaoyun"></el-option>
                  <el-option label="Zea mays (AGPv4)" value="Zea_mays_v4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item prop="pam">
                <template #label>
                  <strong>Customized PAM</strong> (IUPAC nucleotide code is allowed to be filled in. <strong>PAM
                    Type</strong>
                  <i class="fas fa-level-up-alt"></i>)
                </template>
                <el-input v-model="form.pam" />
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item prop="sgRNAModule">
                <template #label>
                  <strong>sgRNA module of Customized PAM</strong>
                </template>
                <el-select v-model="form.sgRNAModule" placeholder="Select an order for PAM & spacer.">
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

          <el-row justify="center"><el-col :span="18">
              <el-form-item>
                <el-button type="primary" @click="toCas9">Create</el-button>
                <el-button @click="fillExampleID">Example(Gene ID)</el-button>
                <el-button @click="fillExamplePosition">Example(Genome Position)</el-button>
                <el-button @click="fillExampleSeq">Example(Genome Sequence)</el-button>
              </el-form-item>
            </el-col></el-row>
        </el-form>


      </el-main>
      <Footer />
    </el-container>
  </div>
</template>

<style scoped></style>
