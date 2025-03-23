<template>
  <t-form label-align="left" v-model:data="formData" :rules="rules" ref="formRef">
    <t-form-item :label="$t('coze.workflow.addModal.name')" name="name">
      <t-input placeholder="请输入名称" v-model="formData.name"></t-input>
    </t-form-item>

    <t-form-item :label="$t('coze.workflow.addModal.appId')" name="app_id">
      <t-input placeholder="请输入AppId" v-model="formData.app_id"></t-input>
    </t-form-item>
    <t-form-item :label="$t('coze.workflow.addModal.workflowId')" name="workflow_id">
      <t-input placeholder="请输入工作流ID" v-model="formData.workflow_id"></t-input>
    </t-form-item>
    <t-form-item :label="$t('coze.workflow.addModal.cozeToken')" name="coze_token">
      <t-input
        type="password"
        placeholder="请输入扣子Token"
        v-model="formData.coze_token"
      ></t-input>
    </t-form-item>
    <t-form-item :label="$t('coze.workflow.addModal.description')" name="desc">
      <t-textarea placeholder="请输入描述" v-model="formData.desc"></t-textarea>
    </t-form-item>
  </t-form>
</template>
<script setup>
import { reactive, defineExpose, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const formData = reactive({
  name: '',
  app_id: '',
  workflow_id: '',
  coze_token: '',
  desc: ''
})
const rules = {
  name: [{ required: true }],
  app_id: [{ required: true }],
  workflow_id: [{ required: true }],
  coze_token: [{ required: true }]
}
const formRef = useTemplateRef('formRef')
const methods = {
  resetForm() {
    formRef.value.reset()
  },
  async validateForm() {
    try {
      return await formRef.value.validate()
    } catch (err) {
      //   console.log(err)
      return false
    }
  }
}
defineExpose({
  methods,
  formData
})
</script>
<style lang="less" scoped></style>
