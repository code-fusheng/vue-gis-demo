<template>
  <a-layout>
    <a-layout-sider width="auto">
      <!-- <a-button
        type="primary"
        style="margin-bottom: 16px"
        @click="toggleCollapsed"
      >
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button> -->
      <a-menu mode="inline" theme="dark">
        <a-sub-menu index="1">
          <template #title>地图 Demo</template>
          <!-- <a-menu-item-group key="g1"> -->
          <!-- <template #icon>
              <QqOutlined />
            </template>
            <template #title>OpenLayer</template> -->
          <a-menu-item key="openLayer">
            <RouterLink to="/openLayer">openLayer</RouterLink>
          </a-menu-item>
          <a-menu-item key="openLayer-test">
            <RouterLink to="/openLayer-test">openLayer-test</RouterLink>
          </a-menu-item>
          <a-menu-item key="openLayer-pro">
            <RouterLink to="/openLayer-pro">openLayer-pro</RouterLink>
          </a-menu-item>
          <!-- </a-menu-item-group> -->
          <!-- <a-menu-item-group key="leaflet-group"> -->
          <!-- <template #icon>
            <QqOutlined />
          </template>
          <template #title>Leaflet</template> -->
          <a-menu-item key="leaflet">
            <RouterLink to="/leaflet">leaflet</RouterLink>
          </a-menu-item>
          <a-menu-item key="leaflet-test">
            <RouterLink to="/leaflet-vue">leaflet-vue</RouterLink>
          </a-menu-item>

          <a-menu-item key="three">
            <RouterLink to="/three">threeJs</RouterLink>
          </a-menu-item>
          <a-menu-item key="mapbox">
            <RouterLink to="/mapbox">mapbox</RouterLink>
          </a-menu-item>
          <a-menu-item key="amap">
            <RouterLink to="/amap">amap</RouterLink>
          </a-menu-item>
          <a-menu-item key="cesium">
            <RouterLink to="/cesium">cesium</RouterLink>
          </a-menu-item>
          <!-- </a-menu-item-group> -->
        </a-sub-menu>
        <a-sub-menu index="2">
          <template #title>机器人 Demo</template>
        </a-sub-menu>
      </a-menu>
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
import { ref, reactive } from "vue";
// import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
const state = reactive({
  collapsed: false,
  selectedKeys: ["1"],
  openKeys: ["sub1"],
  preOpenKeys: ["sub1"],
});
const item = {
  date: "2016-05-02",
  name: "Tom",
  address: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({ length: 20 }).fill(item));
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
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
