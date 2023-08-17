<template>
  <div>
    <a-layout>
      <a-layout-header>
        <RouterLink to="/three/learn-demo">
          <el-button size="small">Learn</el-button>
        </RouterLink>
        <RouterLink to="/three/index">
          <el-button size="small">index</el-button>
        </RouterLink>
        <RouterLink to="/cube-demo">
          <el-button size="small">立方体</el-button>
        </RouterLink>
        <RouterLink to="/three-test">
          <el-button size="small">Test</el-button>
        </RouterLink>
      </a-layout-header>
    </a-layout>
  </div>
</template>

<style>
#three-box {
  width: auto;
  margin: auto;
  /* height: 900px; */
}
</style>
