import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/openLayer-pro",
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/openLayer",
      name: "openLayer",
      component: () => import("../views/map/openlayer/index.vue"),
    },
    {
      path: "/openLayer-test",
      name: "openLayer-test",
      component: () => import("../views/map/openlayer/index-test.vue"),
    },
    {
      path: "/openLayer-pro",
      name: "openLayer-pro",
      component: () => import("../views/map/openlayer/index-pro.vue"),
    },
    {
      path: "/leaflet",
      name: "leaflet",
      component: () => import("../views/map/leaflet/index.vue"),
    },
    {
      path: "/leaflet-vue",
      name: "leaflet-vue",
      component: () => import("../views/map/leaflet/index-vue.vue"),
    },
    {
      path: "/three",
      name: "three",
      component: () => import("../views/map/three/index.vue"),
    },
    {
      path: "/mapbox",
      name: "mapbox",
      component: () => import("../views/map/mapbox/index.vue"),
    },
    {
      path: "/amap",
      name: "amap",
      component: () => import("../views/map/amap/index.vue"),
    },
    {
      path: "/cesium",
      name: "cesium",
      component: () => import("../views/map/cesium/index.vue"),
    },
    {
      path: "/device",
      name: "device",
      component: () => import("../views/robot/device/index.vue"),
    },
    {
      path: "/camera",
      name: "camera",
      component: () => import("../views/robot/device/camera.vue"),
    },
    {
      path: "/berth",
      name: "berth",
      component: () => import("../views/robot/berth/index.vue"),
    },
    {
      path: "/berth/collect",
      name: "berthCollect",
      component: () => import("../views/robot/berth/collect.vue"),
    },
    {
      path: "/lpr",
      name: "lpr",
      component: () => import("../views/robot/lpr/index.vue"),
    },
    {
      path: "/lpr/match",
      name: "lprMatch",
      component: () => import("../views/robot/lpr/match.vue"),
    },
    {
      path: "/video",
      name: "video.js",
      component: () => import("../views/video/index.vue"),
    },
    {
      path: "/video/flv",
      name: "flv",
      component: () => import("../views/video/flv/index.vue"),
    },
    {
      path: "/webrtc",
      name: "webrtc",
      component: () => import("../views/video/webrtc.vue"),
    },
    {
      path: "/three/learn-demo",
      name: "learn-demo",
      component: () => import("../views/map/three/learn-demo.vue"),
    },
    {
      path: "/three/index",
      name: "three-index",
      component: () => import("../views/map/three/index.vue"),
    },
    {
      path: "/cube-demo",
      name: "cube-demo",
      component: () => import("../views/map/three/cube-demo.vue"),
    },
    {
      path: "/three-test",
      name: "three-test",
      component: () => import("../views/map/three/three-test.vue"),
    },
  ],
});

export default router;
