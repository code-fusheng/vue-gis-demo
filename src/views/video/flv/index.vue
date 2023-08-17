<template>
  <div>
    <video ref="videoElement" width="640" height="480"></video>
  </div>
</template>

<script>
import flvjs from "flv.js";

export default {
  mounted() {
    // 创建一个 flv.js 播放器对象
    let player = flvjs.createPlayer({
      type: "flv",
      url: "http://47.111.158.6/live/1.flv",
    });

    // 绑定播放器到视频元素上
    player.attachMediaElement(this.$refs.videoElement);

    // 开始播放
    player.load();
    player.play();
  },
};
</script>
