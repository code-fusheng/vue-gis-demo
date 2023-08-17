<script setup>
import ComRouter from "./ComRouter.vue";
import * as THREE from "three";
</script>

<template>
  <div>
    <ComRouter />
    <div id="three-box"></div>
  </div>
</template>

<!-- 场景Scene、相机Camera、渲染器Renderer三个基本概念 -->

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // 创建3D场景对象Scene
    const scene = new THREE.Scene();
    console.log(scene);

    //创建一个长方体几何对象Geometry
    // THREE.BoxGeometry        长方体
    // THREE.CylinderGeometry   圆柱体
    // THREE.SphereGeometry     球体
    // THREE.ConeGeometry       圆锥
    // THREE.PlaneGeometry      矩形平面
    // THREE.CircleGeometry     圆平面
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    // 创建材质对象 Material
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000, // 红色
    });

    // 网格模型 Mesh
    // 两个参数  几何体 geometry  材质 material
    const mesh = new THREE.Mesh(geometry, material);

    // 模型位置 position
    // 网格模型 三位空间 位置坐标 默认坐标原点
    mesh.position.set(0, 10, 0);

    scene.add(mesh);
  },
};
</script>
