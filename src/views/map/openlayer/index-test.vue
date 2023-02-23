<script setup>
import { ref } from "vue";

import GeoJSON from "ol/format/GeoJSON";
// 瓦片图层
import TileLayer from "ol/layer/Tile";
// 矢量图层
import VectorLayer from "ol/layer/Vector";
// 静态图层
import ImageLayer from "ol/layer/Image";
// 指定地图来源
import {
  OSM,
  XYZ,
  Vector as VectorSource,
  Stamen,
  ImageStatic,
  TileDebug,
  ImageWMS,
} from "ol/source";
import Map from "ol/Map"; //地图初始化
import View from "ol/View";
import { pan } from "ol/interaction/Interaction";

// 控件 / 鼠标位置控件
import {
  defaults as controlDefaults,
  ZoomSlider, // 缩放滚动条
  ZoomToExtent, // 放大到设定区域
  FullScreen, // 全屏
  MousePosition, // 鼠标位置
  OverviewMap, // 鸟瞰图
  Attribution, // 右下角的地图信息
  Zoom, // 缩放按钮
  ScaleLine, // 比例尺
} from "ol/control";

import { fromLonLat, get, transform } from "ol/proj";

import Feature from "ol/Feature";
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
import Tile from "ol/Tile";

// Overlay 图标
import Overlay from "ol/Overlay";

import { defaults as interactionDefaults, Select, Draw } from "ol/interaction";
import { createRegularPolygon } from "ol/interaction/Draw";

import Modify from "ol/interaction/Modify";

import { toStringHDMS, wrapX } from "ol/coordinate";
import { pointerMove } from "ol/events/condition";

import WFS from "ol/format/WFS";

// 内置交互方式

// import data from "../../../data/停车场(2).json";
// OpenLayers 3默认使用的是EPSG:3857

import * as Cesium from "cesium";
import { default as OlCesium } from "ol-cesium";
</script>

<template>
  <div>
    <!-- <el-button
      size="small"
      @click="
        () => {
          optionBox = !optionBox;
        }
      "
      >{{ optionBox ? "打开操作栏" : "关闭操作栏" }}</el-button
    > -->
    <div>
      <!-- <el-tag for="">地图信息</el-tag> -->
      <el-button size="small" @click="printMapInfo()">获取图层信息</el-button>
      <el-tag>
        图层数:<span>{{ mapInfo.layerCount }}</span>
      </el-tag>
      <el-tag>
        坐标系:<span>{{ mapInfo.projection }}</span>
      </el-tag>
      <el-tag>
        深度:<span>{{ mapInfo.zoom }}</span>
      </el-tag>
      <el-tag>
        分辨率:<span>{{ mapInfo.resolution }}</span>
      </el-tag>
      <br />
      <el-tag for="">坐标转换</el-tag>
      <el-select
        @change="changeCoordinateType(coordinateTypeValue)"
        v-model="coordinateTypeValue"
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
      <el-tag for="">图层管理</el-tag>
      <el-select
        v-model="tileValue"
        class="m-2"
        placeholder="选择瓦片图层"
        size="small"
        @change="changeTileLayer(tileValue)"
      >
        <el-option
          v-for="item in tileLayerArray"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="!item.state"
        />
      </el-select>
      <el-button size="small" @click="doTileGird()">加载瓦片网格</el-button>
      <el-select
        v-model="vecterValue"
        class="m-2"
        placeholder="选择矢量图层"
        size="small"
        @change="changeVectorLayer(vecterValue)"
      >
        <el-option
          v-for="item in vectorLayerArray"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="imageValue"
        class="m-2"
        placeholder="选择静态图层"
        size="small"
        @change="changeImageLayer(imageValue)"
      >
        <el-option
          v-for="item in imageLayerArray"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <br />
      <el-tag for="">控件管理</el-tag>
      <el-button size="small" @click="doMousePosition()">坐标提取</el-button>
      <el-button size="small" @click="testZoom()">缩放控件</el-button>
      <el-button size="small" @click="doOverviewMap()">鹰眼控件</el-button>
      <el-button size="small" @click="doFullScreen()">全屏控件</el-button>
      <el-button
        size="small"
        v-if="!interactionSwitch"
        @click="switchInteraction()"
      >
        打开控件
      </el-button>
      <el-button size="small" v-else @click="switchInteraction()">
        关闭控件</el-button
      >
      <el-row :gutter="15">
        <el-col :span="3"><el-tag for="">地图导航</el-tag></el-col>
        <el-col :span="4"><el-input v-model="location1" size="small" /></el-col>
        <el-col :span="4"><el-input v-model="location2" size="small" /></el-col>
        <el-col :span="3">
          <el-button size="small" @click="doLocation()">定位当前</el-button>
        </el-col>
        <el-col :span="3">
          <el-button size="small" @click="doFit()">自适配区域</el-button>
        </el-col>
      </el-row>
      <!-- <br /> -->
      <el-tag for="">绘制标注</el-tag>
      <el-button size="small" @click="doInsertImage()"> 插入Image </el-button>
      <el-button size="small" @click="doInsertRegularShape()">
        插入几何
      </el-button>
      <el-button size="small" @click="doInsertCanvas()"> 插入Canvas </el-button>
      <el-button size="small" @click="doInsertText()"> 插入Text </el-button>
      <el-button size="small" @click="doStyleFunction()">
        应用StyleFun
      </el-button>
      <el-button size="small" @click="doMultiMark()"> 批量插入 </el-button>
      <el-button size="small" @click="doOpenClickTopic()"> 点击提示 </el-button>
      <br />
      <el-tag for="">绘制进阶</el-tag>
      <el-button size="small" @click="doStartDraw()"> 开启绘制 </el-button>
      <el-select
        v-model="drawValue"
        class="m-2"
        placeholder="Select"
        size="small"
        @change="changeDraw(drawValue)"
      >
        <el-option
          v-for="item in drawOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <br />
      <el-tag for="">事件管理</el-tag>
      <el-button size="small" @click="doFeatureStyle()">
        Feature样式/过滤/取消
      </el-button>
      <br />
      <el-tag for="">GeoServer</el-tag>
      <!-- <el-button size="small" @click="doLoadGeoServer()"> 加载地图 </el-button> -->
      <el-button size="small" @click="doModifyGeoServer()"
        >修改地图:{{ modifySwitch }}</el-button
      >
      <el-button size="small" @click="doSaveGeoServer()">保存地图</el-button>

      <el-button size="small" @click="doLoadGeoServer4WMS()">
        加载地图(WMS)
      </el-button>
      <el-button size="small" @click="doLoadGeoServer4WFS()">
        加载地图(WFS)
      </el-button>
      <el-button size="small" @click="doLoadMark4WFS()">
        加载标注(WFS)
      </el-button>
      <el-button size="small" @click="doLoadRoadInfo4WFS()">
        加载路网(WFS)
      </el-button>
      <el-button size="small" @click="doCheckStartToEnd()">{{
        !checkRoadSwitch ? "开启选点" : "关闭选点"
      }}</el-button>
      <el-button size="small" @click="doDrawRoad()">绘制路径</el-button>
      <el-button size="small" @click="resetCheckStartToEnd()"
        >重新选点</el-button
      >
    </div>
    <el-tag for="">进阶</el-tag>
    <el-button size="small" @click="do3D()">3D渲染</el-button>
    <el-button disabled="ture" size="small" @click="doDimensionsAndTilt()"
      >维度与仰角</el-button
    >
    <el-button size="small" @click="doCesium4OpenLayer()"
      >Cesium2.5D插件</el-button
    >
    <!--注意：需要设置tabindex，才能使div获得键盘事件-->
    <div id="openlayer-map" tabindex="0" class="openlayer-map"></div>
    <div id="overiew-map" class="overiew-map"></div>
    <div id="anchor"><img src="../../../image/定位.png" alt="示例锚点" /></div>
    <!--  -->
    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    <!-- <div id="map-3d" class="map-3d"></div> -->
  </div>
</template>

<script>
const tileValue = ref("");
const vecterValue = ref("");
const imageValue = ref("");
const coordinateTypeValue = ref("");
// const location1 = ref(112.88256117241218);
// const location2 = ref(28.200131115035916);
const drawValue = ref("");
const tileLayerArray = [
  {
    label: "OSM",
    value: "OSM",
    state: true,
  },
  {
    label: "Stamen",
    value: "Stamen",
    state: true,
  },
  {
    label: "天地图(XYZ)",
    value:
      "http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=12c00f9a0d966a5f834e00fe91e4bb3e",
    state: true,
  },
  {
    label: "OSM(XYZ)",
    value: "http://{a-c}.tile.openstreetemp.org/{z}/{x}/{y}.png",
    state: false,
  },
  {
    label: "高德地图",
    // value: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=2&scale=1&style=8",
    value:
      "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    state: true,
  },
];
const vectorLayerArray = [
  {
    label: "park_roads3",
    value: "./src/data/park_roads3.json",
  },
  {
    label: "test",
    value: "./src/data/test.json",
  },
  {
    label: "park-location-1",
    value: "./src/data/park-location-1.json",
    // center: [12566241.634701168, 3274824.8631064887],
  },
  {
    label: "park-location-2",
    value: "./src/data/park-location-2.json",
  },
  {
    label: "my-park-20230202-2234",
    value: "./src/data/my-park-20230202-2234.json",
  },
  {
    label: "停车场",
    value: "./src/data/停车场.json",
    // center: [251676.2518, 115073.6203]
  },
  {
    label: "停车场(1)",
    value: "./src/data/停车场(1).json",
    // center: [251676.2518, 115073.6203]
  },
  {
    label: "停车场(2)",
    value: "./src/data/停车场(2).json",
  },
  {
    label: "停车场-location",
    value: "./src/data/停车场-location.json",
  },
  {
    label: "my-park-0206-1",
    value: "./src/data/my-park-0206-1.json",
  },
  {
    label: "TEST_V1_P_WKS_LAYER_DOWN3",
    value: "./src/data/TEST_V1_P_WKS_LAYER_DOWN3.json",
  },
  {
    label: "TEST_V0_PARK_SIMPLE",
    value: "./src/data/TEST_V0_PARK_SIMPLE.json",
  },
];
const imageLayerArray = [
  {
    label: "681675333451_.pic.jpg",
    value: "./src/image/681675333451_.pic.jpg",
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
    label: "EPSG:3857(大坐标)",
    value: "EPSG:3857",
    state: true,
  },
  {
    label: "EPSG:4326(小坐标)",
    value: "EPSG:4326",
    state: true,
  },
  {
    label: "EPSG:4490(中国大地2000)",
    value: "EPSG:4490",
    state: false,
  },
];
const labelStyle = new Style({
  text: new Text({
    font: 'bold 11px "Open Sans"',
    placement: "line",
    fill: new Fill({
      color: "black",
    }),
    // text:`${feature.get("Text")}` === "undefind" ? "" : `${feature.get("Text")}`,
  }),
});
const styles = {
  Point: [
    new Style({
      // 点样式
      image: new Circle({
        radius: 5,
        fill: null,
        stroke: new Stroke({
          color: "rgb(67, 189, 67)",
          width: 1,
        }),
      }),
    }),
  ],
  MultiPoint: [
    new Style({
      image: new Circle({
        radius: 5,
        fill: null,
        stroke: new Stroke({
          color: "rgb(67, 189, 67)",
          width: 1,
        }),
      }),
    }),
  ],
  LineString: [
    new Style({
      fill: new Fill({
        color: "#f40",
      }),
      stroke: new Stroke({
        color: "rgb(25, 189, 14)",
        width: 1,
      }),
    }),
  ],
  MultiLineString: [
    new Style({
      fill: new Fill({
        color: "#f40",
      }),
      stroke: new Stroke({
        color: "rgb(25, 189, 14)",
        width: 1,
      }),
    }),
  ],
  Polygon: [
    new Style({
      fill: new Fill({
        color: "#f40",
      }),
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
const styleFunction = function (feature, resolution) {
  // var limitvalue = feature.values_.limitvalue;
  // console.log(feature);
  // console.log(JSON.parse(feature.values_.properties).Text);
  var limitvalue = JSON.parse(feature.values_.properties).Text;
  // var limitvalue = feature.get("Text");
  console.log(limitvalue);
  // console.log(feature.getGeometry().getType());
  if (limitvalue != null && limitvalue != undefined) {
    return new Style({
      text: new Text({
        font: "bold 6px Arial",
        // placement: "line",
        fill: new Fill({
          color: "blue",
        }),
        text: limitvalue + "",
        // rotation: -Math.PI / 2,
        textAlign: "center", // 设置文本对齐方式
      }),
    });
  }
  return styles[feature.getGeometry().getType()];
};
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
var modifiedFeatures = null;
export default {
  data() {
    return {
      optionBox: true,
      mapInfo: {},
      key: "xxx",
      currentCoordinateType: "EPSG:3857",
      map: "", // map
      view: "", // 视图
      tileLayer: "", // 瓦片图层
      vectorLayer: "", // 矢量图层
      drawLayer: "",
      center: [],
      // location1: "113.0974925832291",
      // location2: "28.795259577872752",
      location1: "107",
      location2: "57",
      interactionSwitch: true,
      draw: "",
      drawSwitch: false,
      wfsVectorLayer: null,
      // modifiedFeatures: null,
      modifySwitch: false,
      startToEnd: [],
      roadLayer: "",
      startLayer: "",
      endLayer: "",
      checkRoadSwitch: false,
    };
  },
  mounted() {
    this.view = new View({
      // projection: "EPSG:3857",
      projection: "EPSG:4326",
      center: [0, 0],
      zoom: 2,
      maxZoom: 30,
      minZoom: 1,
      // rotation: Math.PI / 4,
      // tilt: 60,
    });
    this.map = new Map({
      // 管理地图控件
      controls: [],
      // controls: controlDefaults().extend([
      //   new FullScreen(),
      //   new MousePosition(),
      //   new OverviewMap(),
      //   new ScaleLine(),
      //   new ZoomSlider(),
      //   new ZoomToExtent(),
      // ]),
      // DragRotate DoubleClickZoom DragPan PinchRotate PinchZoom KeyboardPan KeyboardZoom MouseWheelZoom DragZoom
      interactions: interactionDefaults(),
      target: "openlayer-map", // 地图容器Div的ID
      layers: [],
      view: this.view,
    });
    // setInterval(() => {
    // //   console.log(this.view.getZoom());
    // }, 5000);
    // axios.get("./src/data/停车场(2).json").then((res) => {
    //   console.log("res.data = ", res.data);
    // });
    this.center = transform(
      [this.location1, this.location2],
      "EPSG:4326",
      this.currentCoordinateType
    );
    console.log(this.center);
    this.map.on("singleclick", (event) => {
      console.log(event.coordinate);
    });
  },
  watch: {
    location1: function () {
      this.center = transform(
        [this.location1, this.location2],
        "EPSG:4326",
        this.currentCoordinateType
      );
      console.log(this.center);
    },
    location2: function () {
      this.center = transform(
        [this.location1, this.location2],
        "EPSG:4326",
        this.currentCoordinateType
      );
      console.log(this.center);
    },
  },
  methods: {
    printMapInfo() {
      this.mapInfo.projection = this.view.getProjection().getCode();
      this.mapInfo.layerCount = this.map.getLayers().getLength();
      this.mapInfo.zoom = this.view.getZoom();
      this.mapInfo.resolution = this.view.getResolution();
      console.log(this.map);
      console.log(this.view);
    },
    changeCoordinateType(value) {
      this.center = transform(
        [this.location1, this.location2],
        "EPSG:4326",
        value
      );
      console.log(this.center);
      this.currentCoordinateType = value;
      console.log(value);
      this.view = new View({
        projection: value,
        center: this.center,
        zoom: 1,
        maxZoom: 30,
        minZoom: 1,
      });
      this.map.setView(this.view);
      this.map.render();
    },
    changeTileLayer(value) {
      if (value === "OSM") {
        this.tileLayer = new TileLayer({
          source: new OSM(),
        });
      } else if (value === "Stamen") {
        this.tileLayer = new TileLayer({
          source: new Stamen({
            layer: "watercolor",
          }),
        });
      } else {
        this.tileLayer = new TileLayer({
          source: new XYZ({
            url: value,
            crossOrigin: "anonymous",
            wrapX: false,
          }),
        });
      }
      this.map.removeLayer(this.map.getLayers().item(0));
      this.map.addLayer(this.tileLayer);
    },
    // 加载瓦片网格 z:层级 / x:经度 / y:纬度
    doTileGird() {
      var tileGird = new TileLayer({
        source: new TileDebug({
          projection: this.currentCoordinateType,
          tileGrid: new OSM().getTileGrid(),
        }),
      });
      this.map.addLayer(tileGird);
    },
    changeVectorLayer(value) {
      // 标注样式
      const labelStyle = new Style({
        text: new Text({
          font: 'bold 11px "Open Sans"',
          placement: "line",
          fill: new Fill({
            color: "black",
          }),
        }),
      });
      console.log(value);
      // this.vectorLayer = new VectorLayer({
      //   source: new VectorSource({
      //     features: new GeoJSON().readFeature(data, {
      //       dataProjection: "EPSG:4326",
      //       featureProjection: this.changeCoordinateType,
      //     }),
      //   }),
      // });
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: value,
          wrapX: false,
        }),
        style: styleFunction,
      });
      this.map.addLayer(this.vectorLayer);
      // this.view.setCenter(3276260, 12568713);
      // this.view.setZoom(16);
      this.view.setCenter(this.center);
      this.view.animate({
        center: this.center,
        duration: 2000,
        zoom: 10,
      });

      // this.view.setZoom(10);
      this.map.render();
    },
    changeImageLayer(value) {
      console.log(value);
      var extend = [
        center[0] - (1216 * 1000) / 2,
        center[1] - (870 * 1000) / 2,
        center[0] + (1216 * 1000) / 2,
        center[1] + (870 * 1000) / 2,
      ];
      this.imageLayer = new ImageLayer({
        source: new ImageStatic({
          url: value,
          imageExtent: extend,
        }),
      });
      this.view.setCenter(this.center);
      this.view.setZoom(7);
      this.map.addLayer(this.imageLayer);
      this.map.render();
    },
    doLabel() {},
    // 控件管理
    // 坐标拾取
    doMousePosition() {
      this.map.addControl(new MousePosition());
    },
    // 鹰眼控件
    doOverviewMap() {
      this.map.addControl(
        new OverviewMap({
          target: "overiew-map",
          collapsed: false,
        })
      );
    },
    doFullScreen() {
      var fullscreen = new FullScreen();
      this.map.addControl(fullscreen);
    },
    // 加载控件
    testZoom() {
      var zoomslider = new ZoomSlider();
      this.map.addControl(zoomslider);
      var zoomtoextent = new ZoomToExtent({
        // extent: [13100000, 4290000, 13200000, 5210000],
        extent: [13100000, -8290000, 13200000, -8210000],
      });
      this.map.addControl(zoomtoextent);
    },
    //
    doLocation() {
      console.log(this.center);
      this.view.setCenter(this.center);
      // 动画效果
      this.view.animate({
        center: this.center,
        duration: 2000,
        zoom: 10,
      });
      // this.view.setZoom(10);
      this.map.render();
    },
    doFit() {
      var originLocation = [104, 30.6, 104.12, 30.74];
      var location1 = transform(
        [originLocation[0], originLocation[1]],
        "EPSG:4326",
        this.currentCoordinateType
      );
      var location2 = transform(
        [originLocation[2], originLocation[3]],
        "EPSG:4326",
        this.currentCoordinateType
      );
      this.view.fit([location1[0], location1[1], location2[0], location2[1]]);
    },
    switchInteraction() {
      if (this.interactionSwitch) {
        this.map.interactions = interactionDefaults({
          doubleClickZoom: false,
          mouseWheelZoom: false,
          shiftDragZoom: false,
          pinchZoom: false,
        });
        console.log("close");
      } else {
        this.map.interactions = interactionDefaults();
        console.log("open");
      }
      this.interactionSwitch = !this.interactionSwitch;
      this.map.render();
    },
    // 绘制标注
    doInsertImageOld() {
      var anchor = new Overlay({
        element: document.getElementById("anchor"),
      });
      anchor.setPosition(this.center);
      this.map.addOverlay(anchor);
    },
    doInsertImage() {
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var anchor = new Feature({
        geometry: new Point(this.center),
      });
      anchor.setStyle(
        new Style({
          image: new Icon({
            src: "../定位.png",
            // anchor: [0.5, 1],
            anchor: [0, 0],
          }),
        })
      );
      layer.getSource().addFeature(anchor);
      this.map.addLayer(layer);
      this.view.setCenter(this.center);
      // this.view.setZoom(16);
      this.map.render();
      this.view.on("change:resolution", function () {
        var style = anchor.getStyle();
        // 设置图标的缩放，基于层级10来缩放
        style.getImage().setScale(this.getZoom() / 10);
        anchor.setStyle(style);
      });
    },
    doInsertRegularShape() {
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var shape = new Feature({
        geometry: new Point(this.center),
      });
      shape.setStyle(
        new Style({
          image: new RegularShape({
            points: 5,
            radius1: 20,
            radius2: 10,
            stroke: new Stroke({
              color: "red",
              size: 2,
            }),
            fill: new Fill({
              color: "blue",
            }),
          }),
        })
      );
      layer.getSource().addFeature(shape);
      this.map.addLayer(layer);
      this.view.setCenter(this.center);
      this.view.setZoom(16);
      this.map.render();
    },
    doInsertCanvas() {
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var canvas = document.createElement("canvas");
      canvas.width = 20;
      canvas.height = 20;
      var context = canvas.getContext("2d");
      context.strokeStyle = "red";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(20, 10);
      context.lineTo(0, 20);
      context.lineTo(10, 10);
      context.lineTo(0, 0);
      context.stroke();
      var style = new Style({
        image: new Icon({
          img: canvas,
          imgSize: [canvas.width, canvas.height],
          rotation: (90 * Math.PI) / 180,
        }),
      });
      var shape = new Feature({
        geometry: new Point(this.center),
      });
      shape.setStyle(style);
      layer.getSource().addFeature(shape);
      this.map.addLayer(layer);
      this.view.setCenter(this.center);
      this.view.setZoom(16);
      this.map.render();
    },

    doInsertText() {
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var text = new Feature({
        geometry: new Point(this.center),
      });
      text.setStyle(
        new Style({
          text: new Text({
            text: "我的位置",
            fill: new Fill({
              color: "red",
            }),
          }),
        })
      );
      layer.getSource().addFeature(text);
      this.map.addLayer(layer);
      this.view.setCenter(this.center);
      this.view.setZoom(16);
      this.map.render();
    },
    doStyleFunction() {
      var map = this.map;
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var anchor = new Feature({
        geometry: new Point(this.center),
      });
      anchor.setStyle(function (resolution) {
        return [
          new Style({
            image: new Icon({
              src: "../定位.png",
              scale: map.getView().getZoom() / 10,
            }),
          }),
        ];
      });
      layer.getSource().addFeature(anchor);
      this.map.addLayer(layer);
      this.view.setCenter(this.center);
      this.view.setZoom(16);
      this.map.render();
    },
    doMultiMark() {
      var layer = new VectorLayer({
        source: new VectorSource(),
      });
      var style = new Style({
        image: new Icon({
          src: "../定位.png",
        }),
      });
      var features = [];
      for (var index = 0; index < 35; index++) {
        var feature = new Feature({
          geometry: new Point(
            transform(
              [index * 10 - 175, 0],
              "EPSG:4326",
              this.currentCoordinateType
            )
          ),
        });
        feature.setStyle(style);
        features.push(feature);
      }
      layer.getSource().addFeatures(features);
      this.map.addLayer(layer);
      this.map.render();
    },
    doOpenClickTopic() {
      var container = document.getElementById("popup");
      var content = document.getElementById("popup-content");
      var closer = document.getElementById("popup-closer");
      var overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      // 通过外部定义事件监听器，可以规避 this 作用域问题
      var singleclickListener = (event) => {
        var currentCoordinate = event.coordinate;
        // alert(coordinate);
        var hdms = toStringHDMS(currentCoordinate);
        content.innerHTML = "<p>You clicked here:</p><code>" + hdms + "</code>";
        overlay.setPosition(currentCoordinate);
        this.map.un("singleclick", singleclickListener);
      };
      var key = this.map.on("singleclick", singleclickListener);
      this.map.addOverlay(overlay);
    },
    /**
     * 直接交互事件
     * singleclick 左键单击
     * dbclick 左键双击
     * click 鼠标点击
     * pointermove 鼠标移动
     * pointerdrag 鼠标拖动
     * moveend 地图移动
     * 非直接交互事件
     * change:resolution 地图缩放
     * change:center 地图中心改变
     *
     */
    doFeatureStyle() {
      var layer1 = new VectorLayer({
        source: new VectorSource(),
      });
      var layer2 = new VectorLayer({
        source: new VectorSource(),
      });
      // 在地图上画个圆
      var circle = new Feature({
        geometry: new Point(this.center),
      });
      circle.setStyle(
        new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "red",
            }),
          }),
        })
      );
      var star = new Feature({
        geometry: new Point([this.center]),
      });
      star.setStyle(
        new Style({
          image: new RegularShape({
            points: 5,
            radius1: 20,
            radius2: 10,
            fill: new Fill({
              color: "red",
            }),
          }),
        })
      );
      layer1.getSource().addFeature(circle);
      layer2.getSource().addFeature(star);
      var selectSingleClick = new Select({
        condition: pointerMove,
        style: new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({
              color: "blue",
            }),
          }),
        }),
        filter: function (feature, layer) {
          return layer === layer1;
        },
      });
      this.map.addInteraction(selectSingleClick);
      selectSingleClick.on("select");
      this.map.addLayer(layer1);
      this.map.addLayer(layer2);
      this.view.setCenter(this.center);
      this.view.setZoom(16);
      this.map.render();
    },
    changeDraw(val) {
      console.log(val);
      // 移除绘制图形
      this.map.removeInteraction(this.draw);
      this.addInteraction(val);
    },
    doStartDraw() {
      this.drawLayer = new VectorLayer({
        source: new VectorSource({ wrapX: false }),
        // style: styleFunction,
      });
      this.map.addLayer(this.drawLayer);
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
          source: this.drawLayer.getSource(),
          type: val,
          geometryFunction: geometryFunction,
          maxPoints: maxPoints,
        });
        this.draw.on("drawend", function (event) {
          alert(event.feature.getGeometry().getCoordinates());
        });
        this.map.addInteraction(this.draw);
      }
    },
    // GeoServer 地图管理
    doLoadGeoServer() {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          // url: "http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=nyc_roads&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326",
          url: "http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=test_park:park_roads3&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326",
          // url: "./src/data/park_roads3.json",
          // geometryName: "the_geom",
        }),
      });
      // this.vectorLayer = new ImageLayer({
      //   source: new ImageWMS({
      //     url: "http://localhost:8080/geoserver/test_roads/wms",
      //     crossOrigin: "anonymous",
      //     params: {
      //       LAYERS: "test_roads:nyc_roads",
      //       VERSION: "1.1.0",
      //     },
      //     serverType: "geoserver",
      //   }),
      // });
      // this.location1 = -73.99710639567148;
      // this.location2 = 40.742270050255556;
      // var center = transform(
      //   [this.location1, this.location2],
      //   "EPSG:4326",
      //   this.currentCoordinateType
      // );
      // this.view.setCenter(center);
      // this.view.setZoom(14);
      this.map.addLayer(this.vectorLayer);
      this.map.render();
    },
    doModifyGeoServer() {
      // 选择器
      var selectInteraction = new Select({
        style: new Style({
          stroke: new Stroke({
            color: "green",
            width: 2,
          }),
        }),
      });
      this.map.addInteraction(selectInteraction);
      // 修改器
      var modifyInteraction = new Modify({
        style: new Style({
          stroke: new Stroke({
            color: "red",
            width: 5,
          }),
        }),
        features: selectInteraction.getFeatures(),
      });
      this.map.addInteraction(modifyInteraction);
      if (!this.modifySwitch) {
        // modifiedFeatures = null;
        modifyInteraction.on("modifyend", function (e) {
          console.log(e.features);
          modifiedFeatures = e.features;
          console.log(modifiedFeatures);
        });
      } else {
        this.map.removeInteraction(selectInteraction);
        this.map.removeInteraction(modifyInteraction);
      }
      this.modifySwitch = !this.modifySwitch;
    },
    doSaveGeoServer() {
      console.log(modifiedFeatures);
      if (modifiedFeatures && modifiedFeatures.getLength() > 0) {
        // 转换坐标
        var modifiedFeature = modifiedFeatures.item(0).clone();
        modifiedFeature.setId(modifiedFeatures.item(0).getId());
        // 调换经纬度坐标，以符合 wfs 协议中的经纬度位置
        modifiedFeature
          .getGeometry()
          .applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
            for (var j = 0; j < flatCoordinates.length; j += stride) {
              var y = flatCoordinates[j];
              var x = flatCoordinates[j + 1];
              flatCoordinates[j] = x;
              flatCoordinates[j + 1] = y;
            }
          });
        this.modifyWFS([modifiedFeature]);
      }
    },
    modifyWFS(features) {
      console.log("y");
      var WFSTSerializer = new WFS();
      var featObject = WFSTSerializer.writeTransaction(null, features, null, {
        featureType: "test_park_wks_road_split",
        featureNS: "http://geoserver.org/test_park",
        srsName: "EPSG:4326",
      });
      // 转换为 xml 发送至服务器端
      var serializer = new XMLSerializer();
      var featString = serializer.serializeToString(featObject);
      featString = featString.replace("geometry", "geom");
      var request = new XMLHttpRequest();
      request.open("POST", "http://localhost:8080/geoserver/wfs?service=wfs");
      request.setRequestHeader("Content-Type", "text/xml");
      request.send(featString);
    },
    doDrawRoad() {
      // const params = {
      //   LATERS: "load_road",
      //   REQUEST: "GetMap",
      //   FORMAT: "image/png",
      //   VERSION: "1.3.0",
      //   exceptions: "application/vnd.ogc.se_inimage",
      // };
      var startCoord = this.startToEnd[0] || [
        32.25783016406104, 72.12607562163872,
      ];
      var destCoord = this.startToEnd[1] || [
        46.43733140722661, 82.97864003247012,
      ];
      var viewparams = [
        "x1:" + startCoord[0],
        "y1:" + startCoord[1],
        "x2:" + destCoord[0],
        "y2:" + destCoord[1],
        // "y1:" + 85.38188139258091,
        // "x1:" + 74.88508669368821,
        // "y2:" + 59.18769926228288,
        // "x2:" + 74.88508669368821,
      ];
      const params = {
        // LAYERS: "test_park:load_road_split_wks",
        LAYERS: "park_map:load_road_shortest",
        // LAYERS: "test_park:load_road",
        VERSION: "1.1.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        exceptions: "application/vnd.ogc.se_inimage",
      };
      params.viewparams = viewparams.join(";");
      this.roadLayer = new ImageLayer({
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/wms",
          params,
        }),
        style: function (feature, resolution) {
          return new Style({
            stroke: new Stroke({
              color: "red",
              width: 8,
            }),
            fill: new Fill({
              color: "red",
            }),
          });
        },
      });
      // http://localhost:8080/geoserver/test_park/wms?service=WMS&version=1.1.0&request=GetMap&layers=test_park%3Aload_road&bbox=74.8849866936882%2C59.18759926228287%2C74.88518669368821%2C85.38198139258091&width=330&height=768&srs=EPSG%3A4326&styles=&format=application%2Fopenlayers3
      //           url: "http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=test_park:park_roads3&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326",
      // this.vectorLayer = new VectorLayer({
      //   source: new VectorSource({
      //     format: new GeoJSON(),
      //     url: "http://localhost:8080/geoserver/test_park/wms?service=WMS&version=1.1.0&request=GetMap&layers=test_park%3Aload_road&bbox=74.8849866936882%2C59.18759926228287%2C74.88518669368821%2C85.38198139258091&width=330&height=768&srs=EPSG%3A4326&styles=&format=application%2Fopenlayers3",
      //     // url: "http://localhost:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=test_park:load_road&outputFormat=application/json&srsname=EPSG:4326",
      //   }),
      //   style: function (feature, resolution) {
      //     return new Style({
      //       stroke: new Stroke({
      //         color: "red",
      //         width: 1,
      //       }),
      //     });
      //   },
      // });
      this.map.addLayer(this.roadLayer);
      // this.vectorLayer = new VectorLayer({
      //   source: new VectorSource({
      //     format: new GeoJSON(),
      //     url: "http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=test_roads:nyc_roads&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326",
      //   }),
      //   style: function (feature, resolution) {
      //     return new Style({
      //       stroke: new Stroke({
      //         color: "blue",
      //         width: 1,
      //       }),
      //     });
      //   },
      // });
      // this.map.addLayer(this.vectorLayer);
    },
    doLoadGeoServer4WMS() {
      var bounds = [22, 60, 75, 86];
      this.vectorLayer = new ImageLayer({
        opacity: 0.1,
        source: new ImageWMS({
          url: "http://localhost:8080/geoserver/test_park/wms",
          params: {
            REQUEST: "GetMap",
            FORMAT: "image/png",
            VERSION: "1.3.0",
            LAYERS: "test_park:park_roads3",
            exceptions: "application/vnd.ogc.se_inimage",
          },
          // strategy: [22, 60, 75, 86],
        }),
      });
      this.map.addLayer(this.vectorLayer);
    },
    doLoadGeoServer4WFS() {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "http://localhost:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:bj_hx_live_wks_0217_b2_base&outputFormat=application/json&srsname=EPSG:4326",
        }),
        // style: styleFunction,
        style: styleFunction,
      });
      this.map.addLayer(this.vectorLayer);
    },
    doLoadMark4WFS() {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "http://localhost:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:bj_hx_live_wks_0217_b2_mark&outputFormat=application/json&srsname=EPSG:4326",
        }),
        // style: styleFunction,
        style: styleFunction,
      });
      this.map.addLayer(this.vectorLayer);
    },
    doLoadRoadInfo4WFS() {
      this.vectorLayer = new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: "http://localhost:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:bj_hx_live_wks_0217_b2_road&outputFormat=application/json&srsname=EPSG:4326",
        }),
      });
      this.map.addLayer(this.vectorLayer);
    },
    doCheckStartToEnd() {
      if (this.checkRoadSwitch) {
        this.map.un("singleclick", singleclickListener);
        this.startToEnd = [];
        this.map.removeLayer(this.roadLayer);
        this.map.removeLayer(this.startLayer);
        this.map.removeLayer(this.endLayer);
        this.startLayer = "";
        this.endLayer = "";
        this.checkRoadSwitch = !this.checkRoadSwitch;
        return;
      }
      var singleclickListener = (event) => {
        var currentCoordinate = event.coordinate;
        this.startToEnd.push(currentCoordinate);
        console.log(this.startToEnd);
        // alert(currentCoordinate);
        var anchor = new Feature({
          geometry: new Point(currentCoordinate),
        });
        anchor.setStyle(
          new Style({
            image: new Icon({
              src: "../定位.png",
              anchor: [0.5, 1],
              // anchor: [0, 0],
            }),
          })
        );
        console.log(this.startToEnd.length);
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
          this.map.removeLayer(this.roadLayer);
          this.map.removeLayer(this.startLayer);
          this.map.removeLayer(this.endLayer);
          this.startLayer = "";
          this.endLayer = "";
        }
      };
      var key = this.map.on("singleclick", singleclickListener);
      this.checkRoadSwitch = !this.checkRoadSwitch;
    },
    resetCheckStartToEnd() {
      this.startToEnd = [];
      this.map.removeLayer(this.roadLayer);
      this.map.removeLayer(this.startLayer);
      this.map.removeLayer(this.endLayer);
      this.startLayer = "";
      this.endLayer = "";
    },
    //
    doDimensionsAndTilt() {
      this.view = new View({
        center: this.center,
        rotation: Math.PI / 4,
        tile: 60,
      });
      this.map.render();
    },
    doCesium4OpenLayer() {
      const map = new Map({
        target: "openlayer-map",
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
      this.tileLayer = new TileLayer({
        source: new OSM(),
      });
      map.addLayer(this.tileLayer);
      const viewer = new Cesium.Viewer("openlayer-map");
      this.cesiumScene = new Cesium.Scene(viewer);

      const olCesium = new OlCesium({ map });
      olCesium.start();
    },
  },
};
</script>

<style>
.openlayer-map {
  width: 100%;
  height: 800px;
  border: 1px solid black;
}

.map-3d {
  width: 100%;
  height: 500px;
  border: 1px solid black;
}

#anchor {
  cursor: pointer;
  color: rgb(67, 189, 67);
}
#test {
  color: rgb(119, 123, 118);
}
</style>
