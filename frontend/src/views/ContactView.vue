<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import { ref, reactive, watch, onMounted } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  firstName: string
  lastName: string
  email: string
  request: string
  message: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  firstName: '',
  lastName: '',
  email: '',
  request: '',
  message: '',
})

const rules = reactive<FormRules<RuleForm>>({
  firstName: [
    { required: true, message: 'Please input first name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  request: [
    {
      required: true,
      message: 'Please Select a Request',
      trigger: 'change',
    },
  ],
  email: [
    {
      required: true,
      message: 'Please input correct email address',
      trigger: 'change',
    },
  ],
  message: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <Header />
      <el-main style="height: 90vh">
        <el-row justify="center" :gutter="20">
            <el-col :span="2">
              <h3 class="mb-5 text-center"><strong>Contact Us</strong></h3>
            </el-col>
        </el-row>
        <el-row justify="center"><el-col :span="18"><el-divider /></el-col></el-row>
        <el-row justify="center"><el-col :span="18"> </el-col></el-row>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item label="First Name" prop="firstName">
                <el-input v-model="ruleForm.firstName" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Last Name" prop="lastName">
                <el-input v-model="ruleForm.lastName" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row justify="center" :gutter="20">
            <el-col :span="9">
              <el-form-item
                prop="email"
                label="Email"
                :rules="[
                  {
                    required: true,
                    message: 'Please input email address',
                    trigger: 'blur',
                  },
                  {
                    type: 'email',
                    message: 'Please input correct email address',
                    trigger: ['blur', 'change'],
                  },
                ]"
              >
                <el-input v-model="ruleForm.email" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Contact for" prop="request">
                <el-select v-model="ruleForm.request" placeholder="Select a Request">
                  <el-option label="Request CRISPR Plasmids" value="requestPlasmids" />
                  <el-option label="Request Question" value="requestQuestion" />
                  <el-option label="Other" value="otherQuestion" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row justify="center" :gutter="20">
            <el-col :span="18">
              <el-form-item label="Message" prop="message">
                <el-input v-model="ruleForm.message" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row justify="center" :gutter="20">
            <el-col :span="3">
              <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                  Create
                </el-button>
                <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 地图 -->
        <el-row justify="center" :gutter="20">
            <el-col :span="18">
              <div class="row">
                <div class="col-md-12">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.6224366374727!2d114.35084631545814!3d30.475130605052215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x9cdee9c2f051347!2z5Y2O5Lit5Yac5Lia5aSn5a2m!5e0!3m2!1sen!2sus!4v1605798126656!5m2!1sen!2sus"
                          width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0">
                  </iframe>
                </div>
              </div>
            </el-col>
        </el-row>
      </el-main>
      <Footer />
    </el-container>
  </div>
</template>