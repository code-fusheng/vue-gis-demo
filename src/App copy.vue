<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="main"></div>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main><router-view /></el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </div>
  <!-- <a-layout>
    <a-layout-header>
      <RouterLink to="/openLayer">openLayer</RouterLink>
      <RouterLink to="/openLayer-test">openLayer-test</RouterLink>
      <RouterLink to="/openLayer-pro">openLayer-pro</RouterLink>
      <RouterLink to="/leaflet">leaflet</RouterLink>
      <RouterLink to="/leaflet-vue">leaflet-vue</RouterLink>
      <RouterLink to="/three">threeJs</RouterLink>
      <RouterLink to="/mapbox">mapbox</RouterLink>
      <RouterLink to="/amap">amap</RouterLink>
      <RouterLink to="/cesium">cesium</RouterLink>
    </a-layout-header>
    <a-layout-content>
      <RouterView />
    </a-layout-content>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout> -->
</template>

<style scoped></style>
