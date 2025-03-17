<template>
  <div>
    <t-dialog
      v-model:visible="visible"
      :header="t('coze.workflow.result.title')"
      attach="body"
      @confirm="handleClose"
      @close="handleClose"
      :confirmBtn="null"
      width="60%"
    >
      <t-table
        :data="tableData"
        :columns="columns"
        table-layout="fixed"
        style="min-height: 300px"
        rowKey="id"
      />
    </t-dialog>
  </div>
</template>

<script setup lang="jsx">
import { ref, defineExpose, defineProps, onMounted, reactive, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useI18n } from 'vue-i18n'
import { queryWorkFlowResultById } from '@renderer/api'
import dayjs from 'dayjs'

const { t } = useI18n()
const visible = ref(false)
const tableData = ref([])
const props = defineProps({
  workflowId: {
    type: String,
    default: ''
  }
})

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    textarea.value = text
    textarea.select()
    document.execCommand('copy', true)
    document.body.removeChild(textarea)
  }
  MessagePlugin.success('文本复制成功')
}

const handleClose = () => {
  visible.value = false
}

const columns = ref([
  {
    colKey: 'created_at',
    title: t('coze.workflow.result.columns.createAt'),
    width: 200
  },
  {
    colKey: 'text',
    title: t('coze.workflow.result.columns.result'),
    ellipsisTitle: true,
    ellipsis: {
      theme: 'light',
      placement: 'bottom'
    },
    width: 320
  },

  {
    colKey: 'action',
    title: t('coze.workflow.result.columns.action'),
    width: 100,
    cell: (h, { row }) => {
      return (
        <div>
          <t-button
            variant="dashed"
            theme="primary"
            size="small"
            onClick={() => {
              copyToClipboard(row.text)
            }}
          >
            {t('coze.workflow.result.columns.copy')}
          </t-button>
        </div>
      )
    }
  }
])

watch(
  () => props.workflowId,
  async () => {
    console.log(props.workflowId)
    tableData.value = await queryWorkFlowResultById(props.workflowId)
  },
  { immediate: true }
)

defineExpose({
  open: async () => {
    visible.value = true
    tableData.value = await queryWorkFlowResultById(props.workflowId)
  }
})
</script>
