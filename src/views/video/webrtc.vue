<template>
  <div>
    <!-- <video id="video" /> -->
    <video id="rtspVideo" autoplay width="900" height="900"></video>
  </div>
</template>
<script>
import { defineComponent, nextTick, onBeforeUnmount, ref } from "vue";
import WebRtcStreamer from "@/assets/static/webrtcstreamer";
export default defineComponent({
  name: "AppVideo2",
});
</script>
<script setup>
const webRtcServer = ref();
const init = () => {
  //   let script = document.createElement("script");
  //   script.type = "text/javascript";
  //   script.src = "../../assets/static/adapter.min.js";
  //   document.body.appendChild(script);
  nextTick(() => {
    //video：需要绑定的video控件ID
    //连接后端的IP地址和端口   启动webrtc-streamer的设备IP
    webRtcServer.value = new WebRtcStreamer(
      "rtspVideo",
      location.protocol + "//" + window.location.hostname + ":8000"
    );
    //向后端发送rtsp地址
    webRtcServer.value.connect("rtsp://47.111.158.6:8554/live1");
  });
};
init();
onBeforeUnmount(() => {
  webRtcServer.value.disconnect();
  webRtcServer.value = null;
});
</script>
<style scoped></style>
