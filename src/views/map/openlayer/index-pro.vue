<script setup>
import axios from "axios";
import { ref } from "vue";

import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ImageLayer from "ol/layer/Image";
import { Cluster, Image, ImageWMS } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import WFS from "ol/format/WFS";
import Feature from "ol/Feature";
import { defaults as interactionDefaults, Select, Draw } from "ol/interaction";
import { Point, LineString, Polygon } from "ol/geom";
import {
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
  Circle,
  RegularShape,
} from "ol/style";

import srsDict from "../openlayer/dict/srsDict.json";
import {
  styleFunction,
  layerStyles,
  numTextStyleFunction,
} from "../openlayer/style/style";
</script>

<template>
  <div>
    <a-layout>
      <a-layout-header>
        <!-- <el-tag for="">选择坐标</el-tag> -->
        <el-select
          style="width: 120px"
          @change="changeCoordinateType(coordinateTypeValue)"
          v-model="coordinateTypeValue"
          placeholder="Select"
          size="small"
        >
          <el-option
            v-for="item in srsDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="!item.state"
          />
        </el-select>
        <!-- <el-tag for="">选择地图</el-tag> -->
        <el-select
          v-model="mapValue"
          placeholder="请选择车场地图"
          size="small"
          @change="changeMap(mapValue)"
        >
          <el-option
            v-for="item in mapInfoList"
            :key="item.layer_name"
            :label="item.park_name"
            :value="item.park_name"
          />
        </el-select>
        <el-select
          style="width: 100px"
          v-model="levelValue"
          placeholder="请选择楼层"
          size="small"
          @change="changeLevel(levelValue)"
          :disabled="currentMapInfoList.length == 0"
        >
          <el-option
            v-for="item in currentMapInfoList"
            :key="item.layer_name"
            :label="item.layer_level"
            :value="item.layer_name"
          />
        </el-select>
        <!-- <br /> -->
        <el-button size="small" @click="printMapInfo()">调试</el-button>
        <el-button size="small" @click="resetMap()">重置</el-button>
        <el-button size="small" @click="doLoadMark()">
          {{ !showMarkSwitch ? "显示标注" : "隐藏标注" }}
        </el-button>
        <el-button size="small" @click="doShowText()">
          {{ !showTextSwitch ? "显示文字" : "隐藏文字" }}
        </el-button>
        <el-button size="small" @click="doLoadRoad()">
          {{ !showRoadSwitch ? "显示道路" : "隐藏道路" }}
        </el-button>
        <el-button size="small" @click="doLoadCarStyle()">
          {{ !showCarSwitch ? "显示车位渲染" : "隐藏车位渲染" }}
        </el-button>
        <el-button size="small" @click="doSelectShowTip()">
          {{ !showSelectTipSwitch ? "开启选中提示" : "关闭选中提示" }}
        </el-button>
        <el-button size="small" @click="doHoverShowTip()">
          {{ !showHoverTipSwitch ? "开启悬浮提示" : "关闭悬浮提示" }}
        </el-button>
        <el-button size="small" @click="doCheckStartToEnd()">
          {{ !checkRoadSwitch ? "开启选点" : "关闭选点" }}
        </el-button>
        <el-button size="small" @click="doDoubleMap()">
          {{ !showDoubleSwitch ? "开启双地图" : "关闭双地图" }}
        </el-button>
        <!-- <el-button size="small" @click="doLoadDoubleMap()">
          加载双地图
        </el-button> -->
        <br />
        <el-tag> 起点 </el-tag>
        <el-select
          style="width: 70px"
          v-model="startLevelValue"
          placeholder="请选择起点楼层"
          size="small"
        >
          <el-option
            v-for="item in currentMapInfoList"
            :key="item.layer_name"
            :label="item.layer_level"
            :value="item.layer_name"
          />
        </el-select>
        <el-select
          style="width: 100px"
          v-model="startTypeValue"
          placeholder="请选择特征类型"
          size="small"
        >
          <el-option
            v-for="item in typeDict"
            :key="item.key"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
        <el-input
          placeholder="请输入特征Text"
          size="small"
          style="width: 100px"
          v-model="startTextValue"
        >
        </el-input>
        <!-- <el-button size="small" @click="doLocationFeature()">定位 </el-button> -->
        <el-tag> 终点 </el-tag>
        <el-select
          style="width: 70px"
          v-model="endLevelValue"
          placeholder="请选择目标楼层"
          size="small"
        >
          <el-option
            v-for="item in currentMapInfoList"
            :key="item.layer_name"
            :label="item.layer_level"
            :value="item.layer_level"
          />
        </el-select>
        <el-select
          style="width: 100px"
          v-model="endTypeValue"
          placeholder="请选择特征类型"
          size="small"
        >
          <el-option
            v-for="item in typeDict"
            :key="item.key"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
        <el-input
          placeholder="请输入车位编号"
          size="small"
          style="width: 100px"
          v-model="endTextValue"
        >
        </el-input>
        <el-button size="small" @click="doLoadCarRoad()">查找 </el-button>
        <el-button
          size="small"
          @click="doLoadShortestRoad()"
          :disabled="startToEnd.length != 2"
          >计算路径
        </el-button>
        <el-button size="small" @click="doFastLoadCarRoad()">
          一键导航(模拟)
        </el-button>
        <input type="file" id="myFileInput" />
        <!-- <el-button size="small" @click="testMapUpload()"> 上传地图 </el-button> -->
      </a-layout-header>
      <a-layout-content>
        <div class="map-box">
          <div
            id="map1"
            :style="
              'width:' +
              map1Style.widht +
              'px;' +
              'height:' +
              map1Style.height +
              'px;'
            "
            tabindex="0"
            class="map1"
          ></div>
          <div
            id="map2"
            :style="
              'width:' +
              map2Style.widht +
              'px;' +
              'height:' +
              map2Style.height +
              'px;'
            "
            tabindex="1"
            class="map2"
          ></div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
const mapValue = ref("");
const levelValue = ref("");
const coordinateTypeValue = ref("EPSG:4326");

// 起点终点选定值
const startTypeValue = ref("车位");
const startLevelValue = ref("l1");
const startTextValue = ref("E6-15");
const endLevelValue = ref("l1");
const endTypeValue = ref("车位");
const endTextValue = ref("A2-15");

const typeDict = [
  {
    key: "车位",
    value: "车位",
    type: "text",
  },
  {
    key: "查询机",
    value: "查询机",
    type: "mark",
  },
  {
    key: "电梯",
    value: "电梯",
    type: "text",
  },
];

export default {
  data() {
    return {
      mapFile: [],
      key: "",
      mapInfoList: [],
      currentMapInfoList: [],
      currentMapInfo: null,
      targetMapInfo: null,
      startToEnd: [],
      //
      map1: "", // map 地图对象
      view1: "", // view 视图对象
      map2: "",
      view2: "",

      // 图层
      tileLayer: "",
      vectorLayer: "",
      parkLayer: "", // 车场图层
      markLayer: "", // 标注图层
      roadLayer: "",
      textLayer: "",
      shortestRoadLayer: "",
      startLayer: "",
      endLayer: "",
      carLayer: "",
      //
      carStyleLayer: "",
      // 矢量标注源
      clusterSource: "",
      // 按键开关组
      showMarkSwitch: false,
      showRoadSwitch: false,
      showTextSwitch: false,
      checkRoadSwitch: false,
      showCarSwitch: false,
      showSelectTipSwitch: false,
      showHoverTipSwitch: false,
      showDoubleSwitch: false,

      // 选择器
      carSelect: "", // 车位选择器

      // 样式变量
      map1Style: {
        widht: "width: 50%",
        height: "700px",
      },
      map2Style: {
        widht: "width: 50%",
        height: "700px",
      },

      // 双地图
      park2Layer: "",

      map2StartToEnd: [],
      map2ShortestRoadLayer: "",
    };
  },
  methods: {
    printMapInfo() {
      console.table({
        坐标系: this.view2.getProjection().getCode(),
        深度: this.view2.getZoom(),
        分辨率: this.view2.getResolution(),
        图层数: this.map2.getLayers().getLength(),
      });
      console.log(this.view2);
    },
    initView() {
      this.view1 = new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 1,
        interactions: [],
      });
    },
    initView2() {
      this.view2 = new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 1,
        interactions: [],
      });
    },
    initMap() {
      this.map1 = new Map({
        target: "map1",
        controls: [],
        layers: [],
        view: this.view1,
      });
    },
    initMap2() {
      this.map2 = new Map({
        target: "map2",
        controls: [],
        layers: [],
        view: this.view1,
      });
    },
    listMap() {
      var body = {
        layerType: "base",
      };
      axios.post("http://47.111.158.6:10010/map/map/page", body).then((res) => {
        console.log(res.data);
        this.mapInfoList = res.data.data;
      });
    },
    // 开启双地图
    async doDoubleMap() {
      this.initMap2();
      this.showDoubleSwitch = !this.showDoubleSwitch;
      if (this.showDoubleSwitch) {
        var widht = (document.body.clientWidth - 150) / 2;
        var height = document.body.clientHeight - 50;
        this.map1Style.widht = widht;
        this.map1Style.height = height;
        this.map2Style.widht = widht;
        this.map2Style.height = height;
      } else {
        var widht = document.body.clientWidth - 150;
        var height = document.body.clientHeight - 50;
        this.map1Style.widht = widht;
        this.map1Style.height = height;
        this.map2Style.widht = 0;
        this.map2Style.height = 0;
      }
    },
    // 加载双地图
    doLoadDoubleMap() {
      var currentMapInfoExt;
      if (this.currentMapInfoList.length > 0) {
        currentMapInfoExt = this.currentMapInfoList.filter(
          (item) => item.layer_level == endLevelValue.value
        )[0];
        // console.log(currentMapInfoExt);
        var { layer_name, extent, center } = currentMapInfoExt;
        var key = layer_name.toLowerCase() + "_base";
        this.initMap2();
        this.initView2();
        this.parkLayer2 = new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
          style: styleFunction,
        });
        this.map2.addLayer(this.parkLayer2);
        var extents = extent.replace(/[()]/g, "").split(",");
        var startX = parseFloat(extents[0]);
        var startY = parseFloat(extents[2]);
        var endX = parseFloat(extents[1]);
        var endY = parseFloat(extents[3]);
        this.view1.fit([startX, startY, endX, endY]);
        this.map2.render();
      }
    },
    // 重置地图
    resetMap() {
      this.map1.removeLayer(this.shortestRoadLayer);
      this.map1.removeLayer(this.startLayer);
      this.map1.removeLayer(this.endLayer);
      this.map1.removeLayer(this.carLayer);
      this.map1.removeLayer(this.carStyleLayer);
      this.map1.removeLayer(this.roadLayer);
      this.map1.removeLayer(this.markLayer);
      this.map1.removeLayer(this.parkLayer);
      this.map1.removeLayer(this.textLayer);
      this.showMarkSwitch = false;
      this.showRoadSwitch = false;
      this.checkRoadSwitch = false;
      this.showMarkSwitch = false;
      this.showSelectTipSwitch = false;
      this.showHoverTipSwitch = false;
      if (this.showDoubleSwitch) {
        // this.map2.removeLayer(this.park2Layer);
        this.map2.removeLayer(this.map2ShortestRoadLayer);
      }
    },
    changeMap(value) {
      this.resetMap();
      console.log(value);
      this.currentMapInfoList = this.mapInfoList.filter(
        (item) => item.park_name == value
      );
      console.log(this.currentMapInfoList);
      var currentLevel =
        levelValue.value || this.currentMapInfoList[0].layer_level;
      this.currentMapInfo = this.currentMapInfoList.filter(
        (item) => item.layer_level == currentLevel
      )[0];
      this.currentMapInfo = this.currentMapInfoList[0];
      mapValue.value = value;
      levelValue.value = this.currentMapInfo.layer_level;
      console.table(this.currentMapInfo);
      var { layer_name, extent, center } = this.currentMapInfo;
      var key = layer_name.toLowerCase() + "_base";
      this.parkLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
        }),
        style: styleFunction,
      });

      this.map1.addLayer(this.parkLayer);

      var centers = center.replace(/[{}]/g, "").split(",");
      console.log(centers);
      var extents = extent.replace(/[()]/g, "").split(",");
      var startX = parseFloat(extents[0]);
      var startY = parseFloat(extents[2]);
      var endX = parseFloat(extents[1]);
      var endY = parseFloat(extents[3]);
      // this.view1.setZoom(11.786666666666667);
      // this.view1.setCenter([centers[0], centers[1]]);
      this.view1.fit([startX, startY, endX, endY]);
      // this.view1.setRotation(Math.PI / 2);
      // this.map1.renderSync();
      if (this.showDoubleSwitch) {
        console.log(this.currentMapInfoList);
        console.log(endLevelValue.value);
        this.targetMapInfo = this.currentMapInfoList.filter(
          (item) => item.layer_level == endLevelValue.value
        )[0];
        console.log(this.targetMapInfo);
        var target_key = this.targetMapInfo.layer_name.toLowerCase() + "_base";
        this.parkLayer2 = new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${target_key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
          style: styleFunction,
        });
        this.map2.addLayer(this.parkLayer2);
      }
    },
    changeLevel(value) {
      this.resetMap();
      this.map1.removeLayer(this.parkLayer);
      console.log(value);
      this.currentMapInfo = this.mapInfoList.filter(
        (item) => item.layer_name == value
      )[0];
      console.table(this.currentMapInfo);
      var { layer_name, extent, center } = this.currentMapInfo;
      var key = layer_name.toLowerCase() + "_base";
      this.parkLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
        }),
        style: styleFunction,
      });
      this.map1.addLayer(this.parkLayer);
      // if (this.currentMapInfo.layer_level == "b2") {
      //   this.view1.setZoom(11.786666666666667);
      // } else {
      //   this.view1.setZoom(5.099456960967731);
      // }
      var centers = center.replace(/[{}]/g, "").split(",");
      this.view1.setCenter([centers[0], centers[1]]);
      var extents = extent.replace(/[()]/g, "").split(",");
      var startX = parseFloat(extents[0]);
      var startY = parseFloat(extents[2]);
      var endX = parseFloat(extents[1]);
      var endY = parseFloat(extents[3]);
      // this.view1.setZoom(11.786666666666667);
      // this.view1.setCenter([centers[0], centers[1]]);
      this.view1.fit([startX, startY, endX, endY]);
      // this.view1.setRotation(Math.PI / 2);
      this.map1.render();
    },
    changeCoordinateType() {},
    // 显示&隐藏标注
    doLoadMark() {
      this.showMarkSwitch = !this.showMarkSwitch;
      if (this.showMarkSwitch) {
        var { layer_key, layer_level, layer_name, extent, center } =
          this.currentMapInfo;
        var key = (layer_key + "_" + layer_level + "_" + "mark").toLowerCase();
        this.markLayer = new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
          style: styleFunction,
        });
        this.map1.addLayer(this.markLayer);
        // this.view1.on("change:resolution", function () {
        //   console.log(layerStyles["HTC-车位号"][0].getText().getFont());
        // });
        console.log(this.markLayer.getStyle());
      } else {
        this.map1.removeLayer(this.markLayer);
      }
    },
    doShowText() {
      this.showTextSwitch = !this.showTextSwitch;
      if (this.showTextSwitch) {
        var { layer_key, layer_level, layer_name, extent, center } =
          this.currentMapInfo;
        var key = (layer_key + "_" + layer_level + "_" + "text").toLowerCase();
        this.clusterSource = new Cluster({
          distance: 50,
          source: new VectorSource({
            format: new GeoJSON(),
            url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
        });
        this.textLayer = new VectorLayer({
          source: this.clusterSource,
          style: numTextStyleFunction,
        });
        // this.textLayer = new VectorLayer({
        //   source: new VectorSource({
        //     format: new GeoJSON(),
        //     url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
        //   }),
        //   style: styleFunction,
        // });
        this.map1.addLayer(this.textLayer);
      } else {
        this.map1.removeLayer(this.textLayer);
      }
    },
    doLoadRoad() {
      this.showRoadSwitch = !this.showRoadSwitch;
      if (this.showRoadSwitch) {
        var { layer_key, layer_level, layer_name, extent, center } =
          this.currentMapInfo;
        var key = (layer_key + "_" + layer_level + "_" + "road").toLowerCase();
        this.roadLayer = new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: `http://47.111.158.6:18080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
        });
        this.map1.addLayer(this.roadLayer);
      } else {
        this.map1.removeLayer(this.roadLayer);
      }
    },
    doLoadCarStyle() {
      console.log("doLoadCarStyle");
      this.showCarSwitch = !this.showCarSwitch;
      if (this.showCarSwitch) {
        this.carStyleLayer = new VectorLayer({
          source: new VectorSource(),
        });
        var features = this.parkLayer.getSource().getFeatures();
        features.forEach((item) => {
          var { Text, Layer } = JSON.parse(item.values_.properties);
          if (Layer === "HTC-停车位") {
            var coor = item.getGeometry().getCoordinates();
            var carPolygon = new Polygon([coor]);
            var carFeature = new Feature({
              geometry: carPolygon,
            });
            carFeature.setStyle(layerStyles[Layer]);
            this.carStyleLayer.getSource().addFeature(carFeature);
          }
        });
        this.map1.addLayer(this.carStyleLayer);
      } else {
        this.map1.removeLayer(this.carStyleLayer);
      }
    },
    doHoverShowTip() {
      this.showHoverTipSwitch = !this.showHoverTipSwitch;
      if (this.showHoverTipSwitch) {
        var hoverShowTip = (event) => {
          // console.log(event.coordinate);
        };
        this.map1.on("pointermove", hoverShowTip);
      }
    },
    doSelectShowTip() {
      this.showSelectTipSwitch = !this.showSelectTipSwitch;
      if (this.showSelectTipSwitch) {
        const selectedStyle = new Style({
          stroke: new Stroke({
            color: "red",
            width: 0.5,
          }),
          text: new Text({
            font: "bold 5px Arial",
            fill: new Fill({
              color: "#485759",
            }),
            text: "",
            textAlign: "center",
            rotation: -Math.PI / 2,
          }),
        });
        this.carSelect = new Select({
          style: selectedStyle,
          pixelTolerance: 50,
        });
        this.map1.addInteraction(this.carSelect);
        var selectShowTip = (event) => {
          var feature = event.selected[0];
          console.log(feature);
          feature.setStyle(selectedStyle);
        };
        this.carSelect.on("select", selectShowTip);
      } else {
        this.carSelect.un("select", selectShowTip);
      }
    },
    doCheckStartToEnd() {
      this.checkRoadSwitch = !this.checkRoadSwitch;
      if (this.checkRoadSwitch) {
        var singleclickListener = (event) => {
          var currentCoordinate = event.coordinate;
          this.startToEnd.push(currentCoordinate);
          // 添置锚点
          var anchor = new Feature({
            geometry: new Point(currentCoordinate),
          });
          anchor.setStyle(
            new Style({
              image: new Icon({
                src: "../定位.png",
                anchor: [0.5, 1],
              }),
            })
          );
          if (this.startToEnd.length == 1) {
            this.startLayer = new VectorLayer({
              source: new VectorSource(),
            });
            this.startLayer.getSource().addFeature(anchor);
            this.map1.addLayer(this.startLayer);
          } else if (this.startToEnd.length == 2) {
            this.endLayer = new VectorLayer({
              source: new VectorSource(),
            });
            this.endLayer.getSource().addFeature(anchor);
            this.map1.addLayer(this.endLayer);
          } else {
            this.startToEnd = [];
            this.map1.removeLayer(this.shortestRoadLayer);
            this.map1.removeLayer(this.startLayer);
            this.map1.removeLayer(this.endLayer);
            this.map1.removeLayer(this.carLayer);
            this.startLayer = "";
            this.endLayer = "";
          }
        };
        this.map1.on("singleclick", singleclickListener);
      } else {
        this.map1.un("singleclick", singleclickListener);
        this.startToEnd = [];
        this.map1.removeLayer(this.shortestRoadLayer);
        this.map1.removeLayer(this.startLayer);
        this.map1.removeLayer(this.endLayer);
        this.map1.removeLayer(this.carLayer);
        this.startLayer = "";
        this.endLayer = "";
      }
    },
    doLoadShortestRoad() {
      var { layer_key, layer_level, layer_name, extent, center } =
        this.currentMapInfo;
      console.log(this.startToEnd);
      var startPoint = this.startToEnd[0];
      var endPoint = this.startToEnd[1];
      var viewparams = [
        "x1:" + startPoint[0],
        "y1:" + startPoint[1],
        "x2:" + endPoint[0],
        "y2:" + endPoint[1],
        "layer_name:" +
          ((layer_key + "_" + layer_level + "_" + "road").toLowerCase() ||
            "bj_hx_live_wks_0223_b2_road"),
      ];
      // const params = {
      //   LAYERS: "park_map:load_road_shortest_v2",
      //   VERSION: "1.1.0",
      //   REQUEST: "GetMap",
      //   FORMAT: "image/png",
      //   exceptions: "application/vnd.ogc.se_inimage",
      // };
      // params.viewparams = viewparams.join(";");
      // this.shortestRoadLayer = new ImageLayer({
      //   source: new ImageWMS({
      //     url: "http://47.111.158.6:18080/geoserver/wms",
      //     params,
      //   }),
      // });
      // WFS 请求
      const wfsParams = {
        version: "1.1.0",
        request: "GetFeature",
        typeName: "park_map:load_road_shortest_v2",
        outputFormat: "application/json",
        srsname: "EPSG:4326",
        viewparams: viewparams.join(";"),
      };
      var paramsStr = new URLSearchParams(wfsParams).toString();
      console.log(paramsStr);
      this.shortestRoadLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "http://47.111.158.6:18080/geoserver/wfs?" + paramsStr,
        }),
        style: new Style({
          fill: new Fill({
            color: "#ff0000",
          }),
          stroke: new Stroke({
            color: "#ff0000",
            width: 4,
          }),
        }),
      });
      this.map1.addLayer(this.shortestRoadLayer);
      this.map1.render();
      // this.view1.animate({
      //   center: [
      //     (startPoint[0] + endPoint[0]) / 2,
      //     (startPoint[1] + endPoint[1]) / 2,
      //   ],
      //   duration: 3000,
      // });
    },
    doLoadShortestRoadV2() {
      console.log("xxxxxxx");
      var { layer_key, layer_level, layer_name, extent, center } =
        this.currentMapInfo;
      if (startLevelValue.value != endLevelValue.value) {
        console.log(this.map2StartToEnd);
        var startPoint = this.map2StartToEnd[0];
        var endPoint = this.map2StartToEnd[1];
        var viewparams = [
          "x1:" + startPoint[0],
          "y1:" + startPoint[1],
          "x2:" + endPoint[0],
          "y2:" + endPoint[1],
          "layer_name:" +
            ((
              layer_key +
              "_" +
              endLevelValue.value +
              "_" +
              "road"
            ).toLowerCase() || "bj_hx_live_wks_0223_b2_road"),
        ];
        var wfsParams = {
          version: "1.1.0",
          request: "GetFeature",
          typeName: "park_map:load_road_shortest_v2",
          outputFormat: "application/json",
          srsname: "EPSG:4326",
          viewparams: viewparams.join(";"),
        };
        var paramsStr = new URLSearchParams(wfsParams).toString();
        console.log(paramsStr);
        this.map2ShortestRoadLayer = new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: "http://47.111.158.6:18080/geoserver/wfs?" + paramsStr,
          }),
          style: new Style({
            fill: new Fill({
              color: "#ff0000",
            }),
            stroke: new Stroke({
              color: "#ff0000",
              width: 4,
            }),
          }),
        });
        this.map2.addLayer(this.map2ShortestRoadLayer);
        this.map2.render();
      }
    },
    async doLoadCarRoad() {
      var text = endTextValue.value;
      var type = typeDict.filter((item) => item.value == endTypeValue.value)[0]
        .type;
      var level = endLevelValue.value;
      var location = [];
      var center = [];
      if (startLevelValue.value != endLevelValue.value) {
        await axios
          .post(
            `http://47.111.158.6:10010/map/feature/location?layer_level=${startLevelValue.value}&layer_key=${this.currentMapInfo.layer_key}&layer_type=text&pros_text=DT12`
          )
          .then((res) => {
            console.log(res.data);
            center = res.data.data;
          })
          .catch(function (error) {
            console.log(error);
            alert("未找到");
            return;
          });
        await axios
          .post(
            `http://47.111.158.6:10010/map/feature/location?layer_level=${endLevelValue.value}&layer_key=${this.currentMapInfo.layer_key}&layer_type=${type}&pros_text=DT12`
          )
          .then((res) => {
            console.log(res.data);
            this.map2StartToEnd.push(res.data.data);
          })
          .catch(function (error) {
            console.log(error);
            alert("未找到");
            return;
          });
        await axios
          .post(
            `http://47.111.158.6:10010/map/feature/location?layer_level=${endLevelValue.value}&layer_key=${this.currentMapInfo.layer_key}&layer_type=${type}&pros_text=${text}`
          )
          .then((res) => {
            console.log(res.data);
            this.map2StartToEnd.push(res.data.data);
          })
          .catch(function (error) {
            console.log(error);
            alert("未找到");
            return;
          });
      } else {
        await axios
          .post(
            `http://47.111.158.6:10010/map/feature/location?layer_level=${level}&layer_key=${this.currentMapInfo.layer_key}&layer_type=${type}&pros_text=${text}`
          )
          .then((res) => {
            console.log(res.data);
            center = res.data.data;
          })
          .catch(function (error) {
            console.log(error);
            alert("未找到");
            return;
          });
      }
      this.carLayer = new VectorLayer({
        source: new VectorSource(),
      });
      var anchor = new Feature({
        geometry: new Point(center),
      });
      anchor.setStyle(
        new Style({
          image: new Icon({
            src: "../定位.png",
            anchor: [0, 0],
          }),
        })
      );
      this.carLayer.getSource().addFeature(anchor);
      this.map1.addLayer(this.carLayer);
      // this.view1.animate({
      //   center: center,
      //   duration: 2000,
      // });
      this.map1.render();
      this.startToEnd.push(center);
    },
    // 特征定位
    async doLocationFeature(text, type) {
      text = text || startTextValue.value;
      type =
        type ||
        typeDict.filter((item) => item.value == startTypeValue.value)[0].type;
      var location = [];
      await axios
        .post(
          `http://47.111.158.6:10010/map/feature/location?layer_level=${this.currentMapInfo.layer_level}&layer_key=${this.currentMapInfo.layer_key}&layer_type=${type}&pros_text=${text}`
        )
        .then((res) => {
          console.log(res.data);
          location = res.data.data;
        })
        .catch(function (error) {
          alert("未找到");
          return;
        });
      if (this.startToEnd.length == 0) {
        // 起点定位
        this.startLayer = new VectorLayer({
          source: new VectorSource(),
        });
        var anchor = new Feature({
          geometry: new Point(location),
        });
        anchor.setStyle(
          new Style({
            image: new Icon({
              src: "../定位.png",
              anchor: [0, 0],
            }),
          })
        );
        this.startLayer.getSource().addFeature(anchor);
        this.map1.addLayer(this.startLayer);
      } else {
        // 终点定位
        this.endLayer = new VectorLayer({
          source: new VectorSource(),
        });
        var anchor = new Feature({
          geometry: new Point(location),
        });
        anchor.setStyle(
          new Style({
            image: new Icon({
              src: "../定位.png",
              anchor: [0, 0],
            }),
          })
        );
        this.endLayer.getSource().addFeature(anchor);
        this.map1.addLayer(this.endLayer);
      }
      this.map1.render();
      this.startToEnd.push(location);
      console.log(this.startToEnd);
    },
    doTestRandomStart() {
      var { layer_key, layer_level, layer_name, extent, center } =
        this.currentMapInfo;
      console.log(extent);
      var arr = extent.replace(/[()]/g, "").split(",");
      var startX = parseFloat(arr[0]);
      var startY = parseFloat(arr[2]);
      var endX = parseFloat(arr[1]);
      var endY = parseFloat(arr[3]);
      var center = [
        parseFloat((Math.random() * (endX - startX) + startX).toFixed(12)),
        parseFloat((Math.random() * (endY - startY) + startY).toFixed(12)),
      ];
      console.log(center);
      this.startToEnd.push(center);
      var anchor = new Feature({
        geometry: new Point(center),
      });
      anchor.setStyle(
        new Style({
          image: new Icon({
            src: "../定位.png",
            anchor: [0.5, 1],
          }),
        })
      );
      this.startLayer = new VectorLayer({
        source: new VectorSource(),
      });
      this.startLayer.getSource().addFeature(anchor);
      this.map1.addLayer(this.startLayer);
      // this.view1.animate({
      //   center: center,
      //   duration: 1000,
      // });
      this.map1.render();
    },
    async doFastLoadCarRoad() {
      this.listMap();
      this.showCarSwitch = false;
      this.showMarkSwitch = false;
      this.showTextSwitch = false;
      this.startToEnd = [];
      this.map1.removeLayer(this.shortestRoadLayer);
      this.map1.removeLayer(this.startLayer);
      this.map1.removeLayer(this.endLayer);
      this.map1.removeLayer(this.carLayer);
      this.map1.removeLayer(this.carStyleLayer);
      this.map1.removeLayer(this.parkLayer);
      this.map1.removeLayer(this.markLayer);
      if (this.showDoubleSwitch) {
        this.showDoubleSwitch = false;
        this.map2StartToEnd = [];
        this.map2.removeLayer(this.map2ShortestRoadLayer);
        this.map2.removeLayer(this.park2Layer);
      }
      // this.changeMap("华熙LIVE·五棵松");
      console.log(this.currentMapInfoList);
      console.log(this.currentMapInfo);
      console.log(this.mapInfoList);
      var { park_name, layer_key, layer_level, layer_name, extent, center } =
        this.currentMapInfo || this.mapInfoList[0];
      console.log(park_name, layer_key);
      if (startLevelValue.value != endLevelValue.value) {
        console.log("开启双地图");
        await this.doDoubleMap();
      }
      this.changeMap(park_name);
      var step1 = false;
      this.map1.on("rendercomplete", (event) => {
        if (!step1) {
          this.doLoadCarStyle();
          step1 = !step1;
          var step2 = false;
          this.map1.on("rendercomplete", (event) => {
            if (!step2) {
              this.doLoadMark();
              step2 = !step2;
              var step3 = false;
              this.map1.on("rendercomplete", (event) => {
                if (!step3) {
                  this.doShowText();
                  step3 = !step3;
                  var step4 = false;
                  this.map1.on("rendercomplete", (event) => {
                    if (!step4) {
                      this.doLocationFeature();
                      step4 = !step4;
                      var step5 = false;
                      this.map1.on("rendercomplete", (event) => {
                        if (!step5) {
                          this.doLoadCarRoad();
                          step5 = !step5;
                          var step6 = false;
                          this.map1.on("rendercomplete", (event) => {
                            if (!step6) {
                              this.doLoadShortestRoad();
                              step6 = !step6;
                              if (
                                startLevelValue.value != endLevelValue.value
                              ) {
                                var step7 = false;
                                if (!step7) {
                                  this.doLoadShortestRoadV2();
                                  step7 = !step7;
                                }
                              }
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
    testMapUpload() {
      var formData = new FormData();
      formData.append("park_id", "1");
      formData.append("park_name", "华熙LIVE·五棵松_WSG");
      formData.append("file", this.mapFile);
      axios.post("http://47.111.158.6:10010/map/map/upload", formData);
    },
  },
  mounted() {
    this.listMap();
    this.initView();
    this.initMap();
    var widht = document.body.clientWidth - 150;
    var height = document.body.clientHeight - 50;
    this.map1Style.widht = widht;
    this.map1Style.height = height;
    this.map2Style.widht = 0;
    this.map2Style.height = 0;
    window.onresize = () => {
      return (() => {
        if (this.showDoubleSwitch) {
          var widht = (document.body.clientWidth - 150) / 2;
          var height = document.body.clientHeight - 50;
          this.map1Style.widht = widht;
          this.map1Style.height = height;
          this.map2Style.widht = widht;
          this.map2Style.height = height;
        } else {
          var widht = document.body.clientWidth - 150;
          var height = document.body.clientHeight - 50;
          this.map1Style.widht = widht;
          this.map1Style.height = height;
          this.map2Style.widht = 0;
          this.map2Style.height = height;
        }
      })();
    };
    const fileInput = document.getElementById("myFileInput");
    fileInput.addEventListener("change", (event) => {
      // 获取选择的文件
      this.mapFile = event.target.files[0];
      console.log(this.mapFile);
    });
  },
};
</script>

<style scoped>
.map-box {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.map1 {
  /* width: 50%; */
  /* height: 700px; */
  border: 1px solid black;
}
.map2 {
  /* width: 50%; */
  /* height: 700px; */
  border: 1px solid rgb(255, 0, 119);
  /* background-color: antiquewhite; */
}

.ant-layout-header {
  height: auto;
  padding: 0 0;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  background: #001529;
}

.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
