<script setup>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import { CRS, latLng } from "leaflet";
import "proj4leaflet";
import proj4 from "proj4";
import park from "../../../data/park-border-1.json";
// import fullPark from "../../../data/park-pro.json";
import wksParkV2 from "../../../data/wks-park-v2.json";
import demo1 from "../../../data/demo1.json";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-tag for="">加载地图</el-tag>
    <el-button size="small" @click="testLeaflet()">testLeaflet</el-button>
    <el-button size="small" @click="testPark()">testPark</el-button>
    <el-button size="small" @click="testFullPark()">testFullPark</el-button>
    <el-button size="small" @click="clearMap()">clearMap</el-button>
    <el-tag for="">坐标转换</el-tag>
    <el-select
      @change="changeCoordinateType(value2)"
      v-model="value2"
      class="m-2"
      placeholder="Select"
      size="small"
      ><el-option
        v-for="item in coordinateType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="!item.state"
    /></el-select>
    <div id="map" class="map">
      <l-map
        :crs="crs"
        :zoom="zoom"
        :center="center"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
      >
        <l-tile-layer :url="url"></l-tile-layer>
        <l-geo-json :geojson="geojson"></l-geo-json>
      </l-map>
    </div>
  </div>
</template>

<script>
const value2 = ref("");
const coordinateType = [
  {
    label: "L.CRS.EPSG3415",
    value: "L.CRS.EPSG3415",
    state: true,
  },
  {
    label: "L.CRS.EPSG3857",
    value: "L.CRS.EPSG3857",
    state: true,
  },
  {
    label: "L.CRS.ESRI53009",
    value: "L.CRS.ESRI53009",
    state: true,
  },
  {
    label: "L.CRS.EPSG4326",
    value: "L.CRS.EPSG4326",
    state: false, // 自动转换
  },
];
const crsDict = {
  "L.CRS.EPSG3415": new L.Proj.CRS(
    "EPSG:3415",
    "+proj=lcc +lat_1=18 +lat_2=24 +lat_0=21 +lon_0=114 +x_0=500000 +y_0=500000 +ellps=WGS72 +towgs84=0,0,1.9,0,0,0.814,-0.38 +units=m +no_defs",
    {
      resolutions: (function () {
        var level = 17;
        var res = [];
        res[0] = Math.pow(2, level);
        for (var i = 1; i < level - 5; i++) {
          res[i] = Math.pow(2, level - i);
        }
        return res;
      })(),
      origin: [2752609.29, -11909708.5],
      bounds: L.bounds(
        [14068705.421709407, -29736152.4826897],
        [-16397006.661909804, 30735400.422382265]
      ),
    }
  ),
  "L.CRS.EPSG4326": new L.Proj.CRS(
    "EPSG:4326",
    "+proj=longlat +datum=WGS84 +no_defs +type=crs",
    {
      resolutions: (function () {
        var level = 17;
        var res = [];
        res[0] = Math.pow(2, level);
        for (var i = 1; i < level - 5; i++) {
          res[i] = Math.pow(2, level - i);
        }
        return res;
      })(),
      origin: [0.0, 0.0],
      bounds: L.bounds([-180.0, -90.0], [180.0, 90.0]),
    }
  ),
  "L.CRS.EPSG3857": new L.Proj.CRS(
    "EPSG:3857",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs",
    {
      resolutions: (function () {
        var level = 17;
        var res = [];
        res[0] = Math.pow(2, level);
        for (var i = 1; i < level - 5; i++) {
          res[i] = Math.pow(2, level - i);
        }
        return res;
      })(),
      origin: [0.0, 0.0],
      bounds: L.bounds([-20037508.34, -20048966.1], [20037508.34, 20048966.1]),
    }
  ),
  "L.CRS.ESRI53009": new L.Proj.CRS(
    "ESRI:53009",
    "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +R=6371000 +units=m +no_defs +type=crs",
    {
      resolutions: (function () {
        var level = 17;
        var res = [];
        res[0] = Math.pow(2, level);
        for (var i = 1; i < level - 5; i++) {
          res[i] = Math.pow(2, level - i);
        }
        return res;
      })(),
      origin: [0.0, 0.0],
      bounds: L.bounds([-18019909.21, -9009954.61], [18019909.21, 9009954.61]),
    }
  ),
};
export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      crs: "",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      geojson: "",
      zoom: 1,
      center: [47.41322, -1.219482],
      bounds: null,
    };
  },
  mounted() {},
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    testLeaflet() {
      this.geojson = demo1;
      this.center = [47.31322, -1.319482];
    },
    testPark() {
      this.geojson = park;
    },
    testFullPark() {
      this.geojson = wksParkV2;
    },
    clearMap() {
      this.geojson = "";
      this.url = "";
    },
    changeCoordinateType(value) {
      this.crs = "";
      console.log(value);
      this.crs = crsDict[value];
      console.log(this.crs);
    },
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 500px;
  border: 1px solid blue;
}
</style>
