<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";
window._AMapSecurityConfig = {
  securityJsCode: "5d10f11a76dc2b240330988b537d800f",
};
</script>
<template>
  <el-input
    placeholder="请输入坐标"
    style="width: 200px"
    v-model="targetLocation"
  >
  </el-input>
  <el-button @click="doLocationMarker()"> 标记定位 </el-button>
  <el-button @click="doClear()"> 清除 </el-button>
  <br />
  <el-button @click="doTrackReplay()"> 轨迹回放 </el-button>
  <el-button @click="resumeAnimation()"> 开始 </el-button>
  <el-button @click="pauseAnimation()"> 暂停 </el-button>
  <el-button @click="resumeAnimation()"> 继续 </el-button>
  <el-button @click="stopAnimation()"> 停止 </el-button>
  <div id="container"></div>
</template>

<script>
export default {
  data() {
    return {
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      map: "",
      marker: "",
      targetLocation: [117.363535427518, 39.134492730035],
    };
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "0a75d2db5ccad39045e0ae7bd9360a6b", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 16, //初始化地图级别
            center: [117.35703184233333, 39.1333499835], //初始化地图中心点位置
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    doLocationMarker() {
      this.marker = new AMap.Marker({
        icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
        position: this.targetLocation,
        offset: new AMap.Pixel(-13, -30),
      });
      this.marker.setMap(this.map);
    },
    async convertCoordinates(locations) {
      return new Promise((resolve, reject) => {
        AMapLoader.load({
          key: "0a75d2db5ccad39045e0ae7bd9360a6b",
          version: "2.0",
          plugins: [],
        }).then((AMap) => {
          AMap.convertFrom(locations, "gps", function (status, result) {
            console.log(status);
            console.log(result);
            if (status === "complete" && result.info === "ok") {
              resolve(result.locations);
            } else {
              reject(new Error("坐标转换失败"));
            }
          });
        });
      });
    },
    // 轨迹回放
    async doTrackReplay() {
      var track = [];
      await axios
        .get(
          `http://localhost:10240/robot/task/track/info?carId=5&startTime=2023-06-06 17:50:36.083&endTime=2023-06-06 18:12:08.731'`
        )
        .then(async (res) => {
          if (res.data.data.length > 0) {
            track = await this.convertCoordinates(res.data.data);
          }
        });
      AMap.plugin("AMap.MoveAnimation", function () {
        var marker,
          lineArr = track;
        console.log(lineArr[0]);
        var map = new AMap.Map("container", {
          resizeEnable: true,
          center: [117.35703184233333, 39.1333499835],
          zoom: 19,
        });
        marker = new AMap.Marker({
          map: map,
          position: [117.35703184233333, 39.1333499835],
          icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
          offset: new AMap.Pixel(-13, -26),
        });
        var polyline = new AMap.Polyline({
          map: map,
          path: lineArr,
          showDir: true,
          strokeColor: "#28F", //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6, //线宽
          // strokeStyle: "solid"  //线样式
        });
        var passedPolyline = new AMap.Polyline({
          map: map,
          strokeColor: "#AF5", //线颜色
          strokeWeight: 6, //线宽
        });
        marker.on("moving", function (e) {
          passedPolyline.setPath(e.passedPath);
          map.setCenter(e.target.getPosition(), true);
        });
        map.setFitView();
        marker.moveAlong(lineArr, {
          // 每一段的时长
          duration: 500, //可根据实际采集时间间隔设置
          // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
          autoRotation: true,
        });
      });
    },
    doClear() {
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
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
