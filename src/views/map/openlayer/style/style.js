import {
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
  Circle,
  RegularShape,
} from "ol/style";
import { Point, LineString, Polygon } from "ol/geom";
import { defaultFillStyle, defaultStrokeStyle } from "ol/render/canvas";

// 几何样式组
const geomStyles = {
  Point: [],
  MultiPoint: [],
  LineString: [],
  MultiLineString: [],
  Polygon: [],
  MultiPolygon: [],
};

// 图层样式组
const layerStyles = {
  "HTC-轮廓": [
    new Style({
      fill: new Fill({
        color: "#ff5900",
      }),
      stroke: new Stroke({
        color: "#ff5900",
        width: 1.5,
        // lineDash: [10, 5], // 虚线效果 [虚线长度为10, 间隔长度为5]
      }),
    }),
  ],
  "HTC-停车位": [
    new Style({
      fill: new Fill({
        color: "#56bacc",
      }),
      stroke: new Stroke({
        color: "#988a8a",
        width: 0.5,
      }),
    }),
  ],
  "HTC-车位号": [
    new Style({
      text: new Text({
        font: "bold 5px Arial",
        fill: new Fill({
          color: "#485759",
        }),
        text: "",
        textAlign: "center",
        rotation: -Math.PI / 2,
      }),
    }),
  ],
  "HTC-文字": [
    new Style({
      text: new Text({
        font: "bold 12px Arial",
        fill: new Fill({
          color: "#879294",
        }),
        text: "",
        textAlign: "center",
      }),
    }),
  ],
  "HTC-标识": [
    new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.4)",
        }),
        stroke: new Stroke({
          color: "#3399CC",
          width: 0.5,
        }),
      }),
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.4)",
      }),
      stroke: new Stroke({
        color: "#3399CC",
        width: 0.5,
      }),
    }),
  ],
};

const styleFunction = function (feature, resolution) {
  var { Text, Layer } = JSON.parse(feature.values_.properties);
  var Type = feature.getGeometry().getType();
  //   console.log(Text, Layer, Type);
  // 暂时不通过样式渲染车位编号
  if (Text && Layer != "HTC-车位号") {
    var style = layerStyles[Layer] || [
      new Style({
        fill: defaultFillStyle,
        stroke: defaultStrokeStyle,
      }),
    ];
    style[0].getText().setText(Text);
    return style;
  }
  return layerStyles[Layer];
};

export { styleFunction, layerStyles };
