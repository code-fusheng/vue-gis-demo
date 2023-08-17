<template>
  <div>
    <!-- 视频元素 -->
    <video
      id="rtmp-player"
      class="video-js vjs-default-skin vjs-big-play-centered"
    ></video>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import videojs from "video.js";

export default {
  mounted() {
    // 创建视频播放器实例
    const player = videojs("rtmp-player", {
      autoplay: true,
      controls: true,
      sources: [
        {
          src: "rtmp://47.111.158.6:1935/live1",
          type: "rtmp/flv",
        },
      ],
    });

    // 监听事件，处理错误
    player.on("error", (e) => {
      console.error("播放出错:", e);
    });

    // 保存 player 实例方便后续销毁
    this.player = player;
  },

  beforeUnmount() {
    // 销毁 player 实例
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style scoped>
/* 自定义样式 */
</style>
