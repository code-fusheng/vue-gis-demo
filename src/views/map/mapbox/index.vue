<script setup>
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
// 注意版本号，与官方最新示例保持一致
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
);
</script>

<template>
  <div id="mapbox"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    const map = new mapboxgl.Map({
      container: "mapbox", // container ID
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  },
};
</script>
