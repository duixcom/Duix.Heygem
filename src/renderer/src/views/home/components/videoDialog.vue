<template>
  <div class="video-dialog-box">
    <t-dialog
      :width="400"
      v-model:visible="props.showVideoDialog"
      top="10vh"
      :on-close="cancelUploda"
    >
      <template #footer>
        <span></span>
      </template>
      <div class="video-box">
        <video
          ref="videoPlayer"
          class="video-look"
          autoplay
          :src="localUrl.addFileProtocol(props.videoUrl)"       
          controls
        ></video>
      </div>
    </t-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { localUrl } from '@renderer/utils'
const emit = defineEmits(["cancel"]);
const props = defineProps({
  showVideoDialog: Boolean,
  videoUrl: String,
});
const videoPlayer = ref(null);
const cancelUploda = () => {
  emit("cancel");
  videoPlayer.value.pause();
};
</script>
<style lang="less" scoped>
.video-box {
  display: flex;
  justify-items: center;
  align-items: center;
  .video-look {
    width: 100%;
  }
}
</style>
