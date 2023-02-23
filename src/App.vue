<template>
  <a-layout>
    <a-layout-sider width="auto">
      <RouterLink to="/openLayer">openLayer</RouterLink>
      <br />
      <RouterLink to="/openLayer-test">openLayer-test</RouterLink>
      <br />
      <RouterLink to="/openLayer-pro">openLayer-pro</RouterLink>
      <br />
      <RouterLink to="/leaflet">leaflet</RouterLink>
      <br />
      <RouterLink to="/leaflet-vue">leaflet-vue</RouterLink>
      <br />
      <RouterLink to="/three">threeJs</RouterLink>
      <br />
      <RouterLink to="/mapbox">mapbox</RouterLink>
      <br />
      <RouterLink to="/amap">amap</RouterLink>
      <br />
      <RouterLink to="/cesium">cesium</RouterLink>
    </a-layout-sider>
    <a-layout>
      <!-- <a-layout-heade>xxx</a-layout-sider> -->
      <a-layout-content>
        <RouterView />
      </a-layout-content>
    </a-layout>
    <!-- <a-layout-footer>Footer</a-layout-footer> -->
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";

const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({ length: 20 }).fill(item));
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
