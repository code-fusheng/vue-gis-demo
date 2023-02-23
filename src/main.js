import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

// import "ol-cesium/dist/olcesium.css";
window.CESIUM_BASE_URL = "/cesium/";

import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);
app.use(Antd);
app.use(router);
app.use(ElementPlus);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
app.config.globalProperties.$axios = axios;

app.mount("#app");
