<script setup>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<script>
export default {
  mounted() {
    const viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMGIxYTM5Zi1hN2JlLTRkZjYtYjI1ZS04ZGRjNzg1ZmI2M2MiLCJpZCI6MTIzNTgwLCJpYXQiOjE2NzU2ODY1NTh9.ZcO8sJ7_n5Lmg_6Rp4K9jCUe5otSiGWn2L3XdHoyi68",
      }),
    });
    this.cesiumScene = new Cesium.Scene(this.cesiumViewer);
  },
};
</script>
