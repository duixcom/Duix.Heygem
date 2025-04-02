<template>
  <div class="select">
    <div class="select-header">{{ $t('common.selectView.selectHeaderText') }}</div>
    <div class="select-body">
      <!-- 搜索框 -->
      <t-input class="model-search" v-model="state.search" :placeholder="$t('common.input.searchAvatarNamePlaceholder')"
        @change="action.searchList">
        <template #prefix-icon>
          <SearchIcon />
        </template>
      </t-input>
      <div class="model-scroll noscrollbar">
        <!-- 创建模特 -->
        <div class="model-create">
          <t-image class="image" :src="ModelPng" />
          <t-button theme="default" class="btn" @click="action.onCreateModel">{{
            $t('common.selectView.generateButtonText')
          }}</t-button>
        </div>
        <!-- 模特列表 -->
        <div class="model-list">
          <div class="model-list__item" v-for="model in data.modelList" :model-id="model.id" :key="model.id"
            @click="action.selectModel(model)" :class="{ '--active': data.model?.id === model.id }">
            <video class="video" :src=localUrl.addFileProtocol(model.video_path) />
            <div class="name" :title="model.name">{{ model.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import ModelPng from '@renderer/assets/images/video-edit/create-model.png'
import { SearchIcon } from 'tdesign-icons-vue-next'
import { createModel } from '@renderer/components/model-create'
import { useRouter } from 'vue-router'
import { localUrl } from '@renderer/utils'

const router = useRouter()

const data = defineModel({})

const state = reactive({
  search: ''
})

const emits = defineEmits(['query'])

const action = {
  async searchList() {
    emits('query', state.search)
  },
  selectModel(model) {
    data.value.model = model
  },
  async onCreateModel() {
    const { isSubmitOK_toSee, isSubmitOK } = await createModel()
    if (isSubmitOK_toSee) {
      router.push('/home?type=model')
    } else if (isSubmitOK) {
      await action.searchList()
    }
  }
}
</script>
<style lang="less" scoped>
.select {
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

  &-body {
    flex: 1;
    padding: 16px 19px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .model {
    &-search {
      flex: none;
      margin-bottom: 21px;
      --td-bg-color-specialcomponent: #1d1e20;
      --td-text-color-primary: #ffffff;
      --td-text-color-placeholder: rgba(255, 255, 255, 0.6);

      :deep(.t-input) {
        border-color: rgba(255, 255, 255, 0.6);
      }

      :deep(.t-input--focused) {
        box-shadow: none;
      }
    }

    &-scroll {
      flex: 1;
      overflow: auto;
    }

    &-create {
      width: 100%;
      height: 238px;
      background: #17181a;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #27292d;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      gap: 12px;

      --td-bg-color-secondarycontainer: transparent;

      .image {
        width: 148px;
        height: 92px;
      }

      .btn {
        background: #27292d;
        font-size: 12px;
        color: #ffffff;
        border: none;
      }
    }

    &-list__item {
      width: 100%;
      height: 238px;
      background: #17181a;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #27292d;
      margin-top: 21px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;

      &.--active {
        border: 1px solid var(--td-brand-color);
      }

      &:last-of-type {
        margin-bottom: 21px;
      }

      .name {
        width: 90%;
        font-size: 14px;
        color: #ffffff;
        line-height: 22px;
        text-align: center;
        white-space: nowrap;
        /* 保持文本在一行显示 */
        overflow: hidden;
        /* 超出部分隐藏 */
        text-overflow: ellipsis;
        /* 超出部分显示省略号 */
      }

      .video {
        max-width: 100%;
        max-height: 80%;
        border-radius: 4px;
      }
    }
  }
}
</style>
