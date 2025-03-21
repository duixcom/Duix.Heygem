<template>
  <div class="edit">
    <div class="edit-header">{{ $t('common.editView.headerText') }}</div>
    <EditUpload v-model="select" class="content" :listener="listener" />
    <EditListener ref="listener" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import EditListener from './EditListener.vue'
import EditUpload from './EditUpload.vue';

const select = defineModel({})

const listener = ref()

</script>
<style lang="less" scoped>
.edit {
  display: flex;
  height: 100%;
  flex-direction: column;

  &-header {
    font-weight: 500;
    padding: 18px;
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
    border-bottom: 1px solid #000000;
  }

  .content {
    border-radius: 8px 8px 8px 8px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    --td-bg-color-specialcomponent: #161718;
    --td-brand-color-focus: #161718;
  }
}
</style>
