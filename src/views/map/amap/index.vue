<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
</script>
<template>
  <div id="container"></div>
</template>

<script>
export default {
  data() {
    return {
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      //map:null,
    };
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "570275c17a3fe160d1b9e157a0b0de22", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 5, //初始化地图级别
            center: [105.602725, 37.076636], //初始化地图中心点位置
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>
