<script setup>
import axios from "axios";
import { ref } from "vue";

import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import ImageLayer from "ol/layer/Image";
import { Image, ImageWMS } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
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
import { styleFunction, layerStyles } from "../openlayer/style/style";
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
        <el-button size="small" @click="doLoadMark()">
          {{ !showMarkSwitch ? "显示标注" : "隐藏标注" }}
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

        <el-button
          size="small"
          @click="doLoadShortestRoad()"
          :disabled="startToEnd.length != 2"
          >计算路径
        </el-button>
        <el-input
          placeholder="请输入车位编号"
          size="small"
          style="width: 200px"
          v-model="slotValue"
        >
        </el-input>
        <el-button size="small" @click="doLoadCarRoad()">导航 </el-button>
        <el-button size="small" @click="doFastLoadCarRoad()"
          >一键导航
        </el-button>
      </a-layout-header>
      <a-layout-content>
        <div id="map" tabindex="0" class="map"></div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
const slotValue = ref("A2-001");
const mapValue = ref("");
const levelValue = ref("");
const coordinateTypeValue = ref("EPSG:4326");
export default {
  data() {
    return {
      key: "",
      mapInfoList: [],
      currentMapInfoList: [],
      currentMapInfo: {},
      startToEnd: [],
      //
      map: "", // map 地图对象
      view: "", // view 视图对象

      // 图层
      tileLayer: "",
      vectorLayer: "",
      parkLayer: "", // 车场图层
      markLayer: "", // 标注图层
      roadLayer: "",
      shortestRoadLayer: "",
      startLayer: "",
      endLayer: "",
      carLayer: "",
      //
      carStyleLayer: "",
      // 按键开关组
      showMarkSwitch: false,
      showRoadSwitch: false,
      checkRoadSwitch: false,
      showCarSwitch: false,
      showSelectTipSwitch: false,
      showHoverTipSwitch: false,

      // 选择器
      carSelect: "", // 车位选择器
    };
  },
  methods: {
    printMapInfo() {
      console.table({
        坐标系: this.view.getProjection().getCode(),
        深度: this.view.getZoom(),
        分辨率: this.view.getResolution(),
        图层数: this.map.getLayers().getLength(),
      });
      console.log(this.view);
    },
    initView() {
      this.view = new View({
        projection: "EPSG:4326",
        center: [0, 0],
        zoom: 1,
      });
    },
    initMap() {
      this.map = new Map({
        target: "map",
        controls: [],
        interactions: interactionDefaults(),
        layers: [],
        view: this.view,
      });
    },
    listMap() {
      var body = {
        layerType: "base",
      };
      axios
        .post("http://42.192.222.62:10010/mapinfo/page", body)
        .then((res) => {
          console.log(res.data);
          this.mapInfoList = res.data.data;
        });
    },
    changeMap(value) {
      console.log(value);
      this.currentMapInfoList = this.mapInfoList.filter(
        (item) => item.park_name == value
      );
      this.currentMapInfo = this.currentMapInfoList[0];
      levelValue.value = this.currentMapInfo.layer_level;
      console.table(this.currentMapInfo);
      var { layer_name, extent, center } = this.currentMapInfo;
      var key = layer_name.toLowerCase();
      this.parkLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: `http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
        }),
        style: styleFunction,
      });
      this.map.addLayer(this.parkLayer);
      this.view.setZoom(11.786666666666667);
      this.view.setCenter([116.09564230861724, 38.9752956321172]);
      this.view.setRotation(Math.PI / 2);
      this.map.render();
      // this.map.renderSync();
    },
    changeLevel() {},
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
            url: `http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
          style: styleFunction,
        });
        this.map.addLayer(this.markLayer);
        // this.view.on("change:resolution", function () {
        //   console.log(layerStyles["HTC-车位号"][0].getText().getFont());
        // });
        console.log(this.markLayer.getStyle());
      } else {
        this.map.removeLayer(this.markLayer);
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
            url: `http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${key}&outputFormat=application/json&srsname=EPSG:4326`,
          }),
        });
        this.map.addLayer(this.roadLayer);
      } else {
        this.map.removeLayer(this.roadLayer);
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
        this.map.addLayer(this.carStyleLayer);
      } else {
        this.map.removeLayer(this.carStyleLayer);
      }
    },
    doHoverShowTip() {
      this.showHoverTipSwitch = !this.showHoverTipSwitch;
      if (this.showHoverTipSwitch) {
        var hoverShowTip = (event) => {
          // console.log(event.coordinate);
        };
        this.map.on("pointermove", hoverShowTip);
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
        this.map.addInteraction(this.carSelect);
        var selectShowTip = (event) => {
          var feature = event.selected[0];
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
            this.map.addLayer(this.startLayer);
          } else if (this.startToEnd.length == 2) {
            this.endLayer = new VectorLayer({
              source: new VectorSource(),
            });
            this.endLayer.getSource().addFeature(anchor);
            this.map.addLayer(this.endLayer);
          } else {
            this.startToEnd = [];
            this.map.removeLayer(this.shortestRoadLayer);
            this.map.removeLayer(this.startLayer);
            this.map.removeLayer(this.endLayer);
            this.map.removeLayer(this.carLayer);
            this.startLayer = "";
            this.endLayer = "";
          }
        };
        this.map.on("singleclick", singleclickListener);
      } else {
        this.map.un("singleclick", singleclickListener);
        this.startToEnd = [];
        this.map.removeLayer(this.shortestRoadLayer);
        this.map.removeLayer(this.startLayer);
        this.map.removeLayer(this.endLayer);
        this.map.removeLayer(this.carLayer);
        this.startLayer = "";
        this.endLayer = "";
      }
    },
    doLoadShortestRoad() {
      var startPoint = this.startToEnd[0];
      var endPoint = this.startToEnd[1];
      var viewparams = [
        "x1:" + startPoint[0],
        "y1:" + startPoint[1],
        "x2:" + endPoint[0],
        "y2:" + endPoint[1],
      ];
      const params = {
        LAYERS: "park_map:load_road_shortest",
        VERSION: "1.1.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        exceptions: "application/vnd.ogc.se_inimage",
      };
      params.viewparams = viewparams.join(";");
      this.shortestRoadLayer = new ImageLayer({
        source: new ImageWMS({
          url: "http://42.192.222.62:8080/geoserver/wms",
          params,
        }),
      });
      this.map.addLayer(this.shortestRoadLayer);
      this.map.render();
      // this.view.animate({
      //   center: [
      //     (startPoint[0] + endPoint[0]) / 2,
      //     (startPoint[1] + endPoint[1]) / 2,
      //   ],
      //   duration: 3000,
      // });
    },
    async doLoadCarRoad() {
      var center = [];
      await axios
        .post(
          `http://42.192.222.62:10010/slotinfo?layer_level=${this.currentMapInfo.layer_level}&layer_key=${this.currentMapInfo.layer_key}&slot_num=${slotValue.value}`
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
      this.map.addLayer(this.carLayer);
      // this.view.animate({
      //   center: center,
      //   duration: 2000,
      // });
      this.map.render();
      this.startToEnd.push(center);
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
      this.map.addLayer(this.startLayer);
      // this.view.animate({
      //   center: center,
      //   duration: 1000,
      // });
      this.map.render();
    },
    doFastLoadCarRoad() {
      this.showCarSwitch = false;
      this.showMarkSwitch = false;
      this.startToEnd = [];
      this.map.removeLayer(this.shortestRoadLayer);
      this.map.removeLayer(this.startLayer);
      this.map.removeLayer(this.endLayer);
      this.map.removeLayer(this.carLayer);
      this.map.removeLayer(this.shortestRoadLayer);
      this.map.removeLayer(this.carStyleLayer);
      this.map.removeLayer(this.parkLayer);
      this.map.removeLayer(this.markLayer);
      this.changeMap("华熙LIVE·五棵松");
      var { layer_key, layer_level, layer_name, extent, center } =
        this.currentMapInfo;
      var step1 = false;
      this.map.on("rendercomplete", (event) => {
        if (!step1) {
          this.doLoadCarStyle();
          step1 = !step1;
          var step2 = false;
          this.map.on("rendercomplete", (event) => {
            if (!step2) {
              this.doLoadMark();
              step2 = !step2;
              var step3 = false;
              this.map.on("rendercomplete", (event) => {
                if (!step3) {
                  this.doTestRandomStart();
                  step3 = !step3;
                  var step4 = false;
                  this.map.on("rendercomplete", (event) => {
                    if (!step4) {
                      this.doLoadCarRoad();
                      step4 = !step4;
                      var step5 = false;
                      this.map.on("rendercomplete", (event) => {
                        if (!step5) {
                          this.doLoadShortestRoad();
                          step5 = !step5;
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
  },
  mounted() {
    this.listMap();
    this.initView();
    this.initMap();
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 800px;
  border: 1px solid black;
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
