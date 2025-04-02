<template>
  <div class="upload">
    <!-- 上传中 -->
    <div class="upload-box --uploading" v-if="state.isUploading">
      {{ $t('common.modelCreateView.isUploading') }}
    </div>

    <!-- 已上传 -->
    <div class="upload-box --uploaded" v-else-if="uploadInfo.videoPath" @click="action.upload">
      <video class="video" :src="localUrl.addFileProtocol(uploadInfo.videoPath)" controls />
    </div>

    <!-- 未上传 -->
    <div class="upload-box --unupload" v-else>
      <t-image class="image" :src="ImageShotVideo" />
      <p class="tips">{{ $t('common.modelCreateView.tipsText') }}</p>
      <t-button class="button" @click="action.upload">
        {{ $t('common.modelCreateView.uploadVideoText') }}</t-button
      >
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import ImageShotVideo from '@renderer/assets/images/create-model/image-shot.png'
import { Client } from '@renderer/client'
import { MessagePlugin } from 'tdesign-vue-next'
import { localUrl } from '@renderer/utils'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const uploadInfo = defineModel()

const state = reactive({
  isUploading: false
})

const action = {
  async upload() {
    const filePath = await Client.file.selectVideo()
    if (filePath) {
      state.isUploading = true
      const videoInfo = await Client.file.getVideoInfo(filePath)
      state.isUploading = false
      if (action.check(videoInfo)) {
        uploadInfo.value.videoPath = filePath
      }
    }
  },
  check(videoInfo) {
    if (!videoInfo.isOK) {
      MessagePlugin.error(videoInfo.msg || t('common.message.videoUploadError'))
      return false
    }
    if (videoInfo.duration < 8) {
      MessagePlugin.error(t('common.message.videoLength'))
      return false
    }
    return true
  }
}
</script>
<style lang="less" scoped>
.upload {
  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #161718;
    border-radius: 8px;

    &.--unupload {
      .image {
        width: 64px;
        height: 64px;
      }

      .tips {
        margin: 4px auto 16px;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        line-height: 22px;
      }
    }

    &.--uploaded {
      border-radius: 8px;
      overflow: hidden;

      .video {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
