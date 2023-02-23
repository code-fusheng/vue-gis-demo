<script setup>
import GeoJSON from "ol/format/GeoJSON";
// 创建矢量图层
import VectorLayer from "ol/layer/Vector";
// 瓦片图层
import TileLayer from "ol/layer/Tile";
// 指定地图来源
import { OSM, XYZ, Vector as VectorSource } from "ol/source";

import Map from "ol/Map"; //地图初始化
import View from "ol/View";

// 绘制控件
import Draw from "ol/interaction/Draw";
import { createRegularPolygon } from "ol/interaction/Draw";
import Select from "ol/interaction/Select"; // 选择要素控件
// 要素
import Modify from "ol/interaction/Modify";

// 控件 / 鼠标位置控件
import { ZoomSlider, ZoomToExtent, FullScreen } from "ol/control";

// 偏移
import { fromLonLat, get } from "ol/proj";

// 样式
import { Style, Fill, Stroke, Circle, Text } from "ol/style";

import { LineString, Point, Polygon } from "ol/geom";

// 坐标转换
import Projection from "ol/proj/Projection";
import { transform } from "ol/proj";

// 定位导航
import Geolocation from "ol/Geolocation";

import { ref } from "vue";
import Feature from "ol/Feature";
</script>

<template>
  <div>
    <el-tag for="">加载地图</el-tag>
    <el-button size="small" @click="testOSM()">testOSM</el-button>
    <el-button size="small" @click="testTianDiTu()">testTianDiTu</el-button>
    <el-button size="small" @click="test1()">test1</el-button>
    <el-button size="small" @click="testPark()">testPark</el-button>
    <br />
    <el-tag for="">加载控件</el-tag>
    <el-button size="small" @click="testZoom()">testZoom</el-button>
    <el-button size="small" @click="testView()">testView</el-button>
    <el-button size="small" @click="testModify()">testModify</el-button>
    <el-button size="small" @click="fullScreen()">fullScreen</el-button>
    <el-button disabled size="small" @click="fillStyle()">fillStyle</el-button>
    <el-button size="small" @click="loadStyle()">loadStyle</el-button>
    <el-button size="small" @click="reset()">reset</el-button>
    <br />
    <el-tag for="">Draw绘制</el-tag>
    <el-button size="small" @click="initLayer()">initLayer</el-button>
    <el-select
      v-model="value"
      class="m-2"
      placeholder="Select"
      size="small"
      @change="changeDraw(value)"
    >
      <el-option
        v-for="item in drawOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <br />
    <el-tag for="">地图标注</el-tag>
    <el-button size="small" @click="openLabel()">openLabel</el-button>
    <el-radio-group size="small" v-model="radio1" class="ml-4">
      <el-radio size="small" label="1" value="vector">Vector Labels</el-radio>
      <el-radio size="small" label="2" value="overlay">Overlay Labels</el-radio>
    </el-radio-group>
    <br />
    <el-tag for="">坐标转换</el-tag>
    <el-select
      @change="changeCoordinateType(value2)"
      v-model="value2"
      class="m-2"
      placeholder="Select"
      size="small"
    >
      <el-option
        v-for="item in coordinateType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="!item.state"
      />
    </el-select>
    <br />
    <el-tag for="">定位导航</el-tag>
    <el-button size="small" @click="testLocation()">testLocation</el-button>
    <el-form size="small" :inline="true" :model="address" label-width="70px">
      <el-form-item label="位置精度">
        <el-input v-model="address.accuracy" />
      </el-form-item>
      <el-form-item label="海拔高度">
        <el-input v-model="address.altitude" />
      </el-form-item>
      <el-form-item label="海拔精度">
        <el-input v-model="address.altitudeAccuracy" />
      </el-form-item>
      <el-form-item label="航向">
        <el-input v-model="address.heading" />
      </el-form-item>
      <el-form-item label="速度">
        <el-input v-model="address.speed" />
      </el-form-item>
    </el-form>
    <div id="map" class="map"></div>
    <div id="map1" class="map1"></div>
    <div id="map2" class="map2"></div>
  </div>
</template>

<script>
const value = ref("");
const value2 = ref("");
const radio1 = ref("1");
const drawOptions = [
  {
    label: "无",
    value: "None",
  },
  {
    value: "Point",
    label: "点",
  },
  {
    value: "LineString",
    label: "线",
  },
  {
    value: "Polygon",
    label: "面",
  },
  {
    value: "Circle",
    label: "圆",
  },
  {
    label: "正方形",
    value: "Square",
  },
  {
    label: "长方形",
    value: "Box",
  },
];
const coordinateType = [
  {
    label: "地理经纬度(投影坐标系)",
    // 包含: EPSG:102100、EPSG:102113、EPSG:900913
    value: "EPSG:4326",
    state: false,
  },
  {
    label: "Web墨卡托(投影坐标系)",
    // 包含: CRS:84
    value: "X-EPSG:3857",
    state: false,
  },
  {
    label: "EPSG:3857",
    value: "EPSG:3857",
    state: true,
  },
  {
    label: "EPSG:53009",
    value: "EPSG:53009",
    state: true,
  },
  {
    label: "EPSG:4326",
    value: "EPSG:4326",
    state: true,
  },
  {
    label: "EPSG:6326",
    value: "EPSG:6326",
    state: true,
  },
];
export default {
  data() {
    return {
      address: {},
      type: "EPSG:4326",
      key: "",
      map: "",
      draw: "",
      source: "",
      vectorLayer: "",
      view: new View({
        projection: "EPSG:4326",
        center: [0, 0], // 地图初始中心点
        zoom: 1, // 地图初始显示级别
        // 缩放级别
        minZoom: -10,
        maxZoom: 100,
      }),
    };
  },
  mounted() {
    this.map = new Map({
      target: "map", // 地图容器Div的ID
      layers: [],
      view: this.view,
    });
  },
  watch: {
    type: function () {
      // alert(this.type);
    },
  },
  methods: {
    // 瓦片地图绘制
    testOSM() {
      var tileLayer0 = new TileLayer({
        source: new OSM(),
      });
      this.map.addLayer(tileLayer0);
      // var view = this.map.getView();
      // view.setCenter(new fromLonLat([12900000, 4900000])); // 平移地图
      // view.setProjection("EPSG:4326");
    },
    testTianDiTu() {
      var tiandituLayer = new TileLayer({
        source: new XYZ({
          url: "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=12c00f9a0d966a5f834e00fe91e4bb3e",
          // url: "http://t{0-7}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=12c00f9a0d966a5f834e00fe91e4bb3e",
          crossOrigin: "anonymous",
          wrapX: false,
        }),
      });
      this.map.addLayer(tiandituLayer);
    },
    // 基础矢量图绘制
    test1() {
      var VectorLayer1 = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "./src/data/park-border-1.json",
          // url: "./src/data/base.json",
        }),
      });
      this.map.addLayer(VectorLayer1);
    },
    testPark() {
      var parkLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "./src/data/park-3857.json",
        }),
      });
      this.map.addLayer(parkLayer);
    },
    // 加载控件
    testZoom() {
      var zoomslider = new ZoomSlider();
      this.map.addControl(zoomslider);
      var zoomtoextent = new ZoomToExtent({
        extent: [13100000, 4290000, 13200000, 5210000],
      });
      this.map.addControl(zoomtoextent);
    },
    testModify() {
      var modify = {
        init: () => {
          var select = new Select();
          this.map.addInteraction(select);
          console.log(select.getFeatures());
          var modify = new Modify({
            features: select.getFeatures(),
          });
          this.map.addInteraction(modify);
          select.setActive(true);
          modify.setActive(true);
        },
      };
      modify.init();
    },
    // 控制视图
    testView() {
      var view = this.map.getView();
      // view.setZoom(5);
      view.setCenter(new fromLonLat([0, 0])); // 平移地图
      // view.setProjection("EPSG:4326");
    },
    //
    fullScreen() {
      var fullscreen = new FullScreen();
      this.map.addControl(fullscreen);
    },
    // 填充色彩
    fillStyle() {
      var source = new VectorSource();
      var style = new Style({
        source: source,
        fill: new Fill({
          color: "#fff",
        }),
        stroke: new Stroke({
          color: "#fc3",
          width: 2,
        }),
      });
      this.map.addLayer(source);
    },
    // 加载样式
    loadStyle() {
      var image = new Circle({
        radius: 5,
        fill: null,
        stroke: new Stroke({
          color: "red",
          width: 1,
        }),
      });
      var text = new Text({
        font: "13px Microsoft Yahei",
        fill: new Fill({
          color: "#666",
        }),
        stroke: new Stroke({
          color: "#fff",
          width: 3,
        }),
        // text: "" + VectorSource.feature.values_.limitvalue + "",
        offsetY: -15,
      });
      var styles = {
        Point: [
          new Style({
            // 点样式
            image: image,
          }),
        ],
        MultiPoint: [
          new Style({
            image: image,
          }),
        ],
        LineString: [
          new Style({
            stroke: new Stroke({
              color: "red",
              width: 1,
            }),
          }),
        ],
        MultiLineString: [
          new Style({
            stroke: new Stroke({
              color: "red",
              width: 1,
            }),
          }),
        ],
        Polygon: [
          new Style({
            stroke: new Stroke({
              color: "blue",
              lineDash: [4],
              width: 3,
            }),
          }),
        ],
        MultiPolygon: [
          new Style({
            stroke: new Stroke({
              color: "yellow",
              width: 1,
            }),
            fill: new Fill({
              color: "#f40",
            }),
          }),
        ],
      };
      var styleFunction = function (feature, resolution) {
        return styles[feature.getGeometry().getType()];
      };
      var VectorLayer1 = new VectorLayer({
        style: styleFunction,
        source: new VectorSource({
          format: new GeoJSON(),
          url: "./src/data/park-pro-num.json",
          // url: "./src/data/base.json",
        }),
      });
      this.map.addLayer(VectorLayer1);
    },
    reset() {
      this.map.removeLayer();
      var view = this.map.getView();
      view.setCenter([0, 0]);
      view.setZoom(2);
    },
    // 初始化绘制矢量地图
    initLayer() {
      this.source = new VectorSource({
        wrapX: false,
      });
      this.vectorLayer = new VectorLayer({
        source: this.source,
        fill: new Fill({
          color: "#fff",
        }),
        stroke: new Stroke({
          color: "#f00",
          width: 2,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: "#f00",
          }),
        }),
      });
      this.map.addLayer(this.vectorLayer);
    },
    changeDraw(val) {
      console.log(val);
      // 移除绘制图形
      this.map.removeInteraction(this.draw);
      this.addInteraction(val);
    },

    addInteraction(val) {
      if (val !== "None") {
        var geometryFunction, maxPoints;
        if (val === "Square") {
          val = "Circle";
          geometryFunction = createRegularPolygon(4);
        } else if (val === "Box") {
          val = "LineString";
          maxPoints = 2;
          geometryFunction = function (coordinates, geometry) {
            var start = coordinates[0];
            var end = coordinates[1];
            if (!geometry) {
              geometry = new Polygon([
                [start, [start[0], end[1]], end, [end[0], start[1]], start],
              ]);
            }
            geometry.setCoordinates([
              [start, [start[0], end[1]], end, [end[0], start[1]], start],
            ]);
            return geometry;
          };
        }
        this.draw = new Draw({
          source: this.source,
          type: val,
          geometryFunction: geometryFunction,
          maxPoints: maxPoints,
        });
        this.map.addInteraction(this.draw);
      }
    },
    openLabel() {
      this.map.on("click", (event) => {
        console.log(event);
        alert(event.coordinates);
      });
    },
    changeCoordinateType(value) {
      console.log(value);
      this.type = value;
    },

    testLocation() {
      var geolocation = new Geolocation({
        projection: this.map.getView().getProjection(), // 设置投影参考系
        // 追踪参数
        trackingOptions: {
          maximumAge: 10000, // 最大周期
          enableHighAccuracy: true, // 启用高精度
          timeout: 600000, // 超时
        },
      });
      geolocation.setTracking(true);
      geolocation.on("change:accuracyGeometry", function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
      });
      var positionFeature = new Feature();
      positionFeature.setStyle(
        new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({
              color: "#39C",
            }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
          }),
        })
      );
      geolocation.on("change:position", function () {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(
          coordinates ? new Point(coordinates) : null
        );
      });
    },
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 500px;
  border: 1px solid red;
}

/* #map .ol-zoom .ol-zoom-out {
  margin-top: 204px;
} */
.el-button + .el-button {
  margin-left: 0 !important;
}

.el-form--inline .el-form-item {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 0;
}
.el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 0;
}
</style>
