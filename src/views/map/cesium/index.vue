<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted } from "vue";
onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MGQ3NjYzNS00OWFhLTRlZWMtODNiYy0xNjhjNjQ0ZDZiMWYiLCJpZCI6MTIzNTgwLCJpYXQiOjE2OTE3NDQyMDd9.CY1vg1o4hP7o4jkZnzbNMxTxQVfiK-bGxO5OARLs95o";
  const viewer = new Cesium.Viewer("cesiumContainer", {
    timeline: false, // 时间轴控件
    animation: false, // 动画控件
    geocoder: false, // 搜索按钮
    homeButton: false, // 主页按钮
    sceneModePicker: true, // 投影方式按钮
    baseLayerPicker: true, // 图层选择按钮
    navigationHelpButton: false, // 帮助手势按钮
    fullscreenButton: false, // 全屏按钮
  });

  // 返回笛卡尔坐标(z!=高度)
  const cartesian = Cesium.Cartesian3.fromDegrees(
    117.35727990783333,
    39.133768483333334,
    -1.8536000000000001
  ); // 经度 纬度 高度
  console.log(cartesian);

  // 笛卡尔转弧度坐标
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  // 弧度坐标转角度坐标
  // let lon = 180 / Math.PI * cartographic.longitude
  // let lat = 180 / Math.PI * cartographic.latitude

  let lon = Cesium.Math.toDegrees(cartographic.longitude);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);

  console.log(lon, lat, cartographic.height);

  // 相机坐标
  const position = Cesium.Cartesian3.fromDegrees(113.09, 28.32, 5000);

  // 飞行视角
  // viewer.camera.flyTo({
  //   destination: position,
  //   duration: 3,
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // });

  // 相机视角
  // viewer.camera.setView({
  //   destination: position,
  //   // 默认(0, -90, 0)
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // });

  // 视角目标锁定 lookAt
  const targetPosition = Cesium.Cartesian3.fromDegrees(117.357279, 39.133768);
  viewer.camera.lookAt(
    targetPosition,
    new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(-90),
      20000
    )
  );

  // 实体 entity

  // method1
  // const point = new Cesium.Entity({
  //   position: Cesium.Cartesian3.fromDegrees(117.357279, 39.133768),
  //   point: {
  //     pixelSize: 20, // 点像素大小
  //   },
  // });
  // viewer.entities.add(point);

  // method2
  // viewer.entities.add({
  //   id: "point",
  //   position: Cesium.Cartesian3.fromDegrees(117.357279, 39.133768),
  //   point: {
  //     pixelSize: 20, // 点像素大小
  //   },
  // });
  // viewer.zoomTo(point);

  // 标注
  const billboard = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(117.357279, 39.133768, 0),
    billboard: {
      image: "/src/assets/position.png",
    },
  });

  // 标签
  const label = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(117.357279, 39.133768, 10),
    label: {
      text: "Cesium",
      fillColor: Cesium.Color.YELLOW,
      // showBackground: true,
      backgroundColor: new Cesium.Color(255, 255, 0), // 实例化类
    },
  });

  // 线
  const polyline = viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        117.3564568, 39.1338434, 117.3564385, 39.1338164, 117.3564234,
        39.1337947, 117.3564069, 39.1337739, 117.356388, 39.1337544,
        117.3563689, 39.1337338, 117.356356, 39.1337118, 117.3563444,
        39.1336915, 117.3563324, 39.1336723, 117.3563169, 39.1336503,
        117.3565112, 39.1340464,
      ]),
      width: 1,
      material: Cesium.Color.RED,
    },
  });

  // berth
  const berth = viewer.entities.add({
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          117.35645, 39.13384, 117.35646, 39.13384, 117.35646, 39.13389,
        ]),
      },
      material: Cesium.Color.WHITE,
      height: 0,
      extrudedHeight: 1000,
    },
  });

  // box
  const box = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(117.35645, 39.13384, 0),
    box: {
      dimensions: new Cesium.Cartesian3(100, 100, 100),
      material: Cesium.Color.BLUE,
    },
  });

  viewer.zoomTo(berth);
});
</script>

<style scoped>
#cesiumContainer {
  /* width: 100vw; */
  height: 100vh;
  /* overflow: hidden; */
}
</style>
