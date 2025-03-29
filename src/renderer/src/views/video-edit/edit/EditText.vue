<template>
  <div class="text">
    <t-textarea class="text-content" v-model="select.text"
      :placeholder="$t('common.input.videoContentTextPlaceholder')" />
    <div class="text-listen">
      <!-- 选择音色 -->
      <div class="speaker">
        <div class="speaker-content">
          <span class="label">{{ $t('common.editView.speaker') }}</span>
          <t-popup trigger="click" overlayClassName="speaker-popup" placement="top-left"
            v-model:visible="state.popupVisible">
            <t-select class="selector" :value="select.speaker?.name"
              :popupProps="{ overlayClassName: 'speaker-options' }" :placeholder="$t('common.editView.selectSpeaker')">
            </t-select>
            <template #content>
              <div class="popup-scoped">
                <div class="side">{{ $t('common.editView.myVoice') }}</div>
                <EditTextSpeaker class="wrap" v-model="select" @onSelect="action.onSelectSpeaker"
                  :popupVisible="state.popupVisible" />
              </div>
            </template>
          </t-popup>
        </div>
      </div>
      <!-- 试听 -->
      <t-button class="start" size="small" @click="action.textToAudio" :loading="state.textToAudioLoading">{{ $t('common.editView.listen') }}</t-button>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import EditTextSpeaker from './EditTextSpeaker.vue';
import { useI18n } from 'vue-i18n'
import { audition } from '@renderer/api'
const { t } = useI18n()

const select = defineModel({})

const props = defineProps({
  listener: {
    type: Object,
    default: () => ({})
  }
})


const state = reactive({
  popupVisible: false,
  textToAudioLoading: false,
})

const action = {
  async textToAudio() {
    const { speaker, text } = select.value || {}
    if (!speaker?.voice_id) {
      MessagePlugin.error('请选择音色')
      return false
    }
    if (!text) {
      MessagePlugin.error(t('common.message.videoContentText'))
      return false
    }
    state.textToAudioLoading = true
    try {
      const auditionUrl = await audition(speaker.voice_id, text)

      const name = (speaker.name || '') + ' - ' + text.slice(0, 10)

      props.listener.listen({
        name,
        audioUrl: auditionUrl
      })
    } catch (err) {
      console.error('文本转音频失败', err)
      MessagePlugin.error(err.toString() || '试听失败')
    } finally {
      state.textToAudioLoading = false
    }

  },
  onSelectSpeaker(speaker) {
    props.listener.pause()
  }
}

</script>
<style lang="less">
.speaker {
  &-options {
    visibility: hidden;
  }

  &-popup {
    width: 412px;
    height: 400px;
    background: #1D1E20;
    box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.5);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #393A3B;
    margin-bottom: 12px !important;

    .t-popup__content {
      background-color: transparent;
      border: none;
      box-shadow: none;
      height: 100%;
      color: #ffffff;
      padding: 0;
    }
  }
}
</style>
<style lang="less" scoped>
.text {
  height: 100%;
  position: relative;

  &-content {
    height: 100%;
    --td-text-color-placeholder: rgba(255, 255, 255, 0.6);
    padding-bottom: 52px;

    :deep(textarea) {
      height: 100% !important;
      border: none;
      font-size: 12px;
      min-height: unset;
      padding: 12px;
      color: rgba(255, 255, 255, 0.9);
      line-height: 20px;
      resize: none;
    }
  }

  &-listen {
    padding: 0 12px;
    position: absolute;
    align-items: center;
    bottom: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .start {
      min-width: 48px;
      height: 24px;
      border-radius: 2px;
      font-size: 12px;
    }

    .speaker {
      --td-text-color-primary: #fff;

      &-content {
        display: flex;
        align-items: center;
        gap: 12px;

        .label {
          font-weight: 500;
          font-size: 12px;
          color: #FFFFFF;
          line-height: 18px;
          white-space: nowrap;
        }

        .selector {
          width: 88px;
          height: 30px;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #2E3033;
          --td-brand-color-focus: transparent;
          --td-text-color-placeholder: rgba(255, 255, 255, 0.6);

          :deep(.t-input) {
            background-color: transparent;
            color: #fff;
            font-weight: 400;
            font-size: 12px;
            height: 30px;
            border: none;
            transition: none;

            &:hover {
              border: none;
            }

            svg {
              color: #ffffff;
            }
          }
        }
      }

    }
  }
}


.popup-scoped {
  display: flex;
  height: 100%;
  align-items: stretch;

  .side {
    width: 68px;
    flex: none;
    padding: 20px 0 0 0;
    background: #27292D;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
    line-height: 22px;
  }

  .wrap {
    flex: 1;
  }

}
</style>
