<template>
  <div class="preview">
    <div class="preview-header">{{ $t('common.preview.headerText') }}</div>
    <div class="preview-body">
      <video v-if="model.video_path" class="video" controls :src="localUrl.addFileProtocol(model.video_path)"></video>
    </div>
  </div>
</template>
<script setup>
import { localUrl } from '@renderer/utils'
defineProps({
  model: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="less" scoped>
.preview {
  display: flex;
  height: 100%;
  flex-direction: column;
  border-left: 1px solid #000000;
  border-right: 1px solid #000000;

  &-header {
    font-weight: 500;
    padding: 18px;
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    text-align: center;
    border-bottom: 1px solid #000000;
  }

  &-body {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #161718;
    padding: 40px;
    overflow: hidden;

    .video {
      max-width: 100%;
      max-height: 100%;
      border-radius: 4px;
    }
  }
}
</style>
