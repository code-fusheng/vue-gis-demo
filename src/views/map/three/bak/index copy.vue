<script setup>
import * as THREE from "three";
// 引入扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// 引入扩展库GLTFLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
</script>

<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // 初始化3D环境
    this.initEnvironment();
    // 构建光照系统
    this.buildLightSystem();
    // 构建辅助系统
    this.buildAuxSystem();
  },
  methods: {
    // 初始化3D环境
    initEnvironment() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      // 建一个空对象存放对象
      this.map = new THREE.Object3D();
      // 设置相机参数
      this.setCamera();
      // 初始化
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: document.querySelector("canvas"),
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight - 10);
      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      window.addEventListener("resize", this.onWindowResize, false);
    },
    setCamera() {
      this.camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.set(0, -70, 90);
      this.camera.lookAt(0, 0, 0);
    },
    // 构建辅助系统: 网格和坐标
    buildAuxSystem() {
      let axisHelper = new THREE.AxesHelper(2000);
      this.scene.add(axisHelper);
      let gridHelper = new THREE.GridHelper(600, 60);
      this.scene.add(gridHelper);
      let controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.rotateSpeed = 0.35;
    },
    // 光照系统
    buildLightSystem() {
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(300, 1000, 500);
      directionalLight.target.position.set(0, 0, 0);
      directionalLight.castShadow = true;

      let d = 300;
      const fov = 45; //拍摄距离  视野角值越大，场景中的物体越小
      const near = 1; //相机离视体积最近的距离
      const far = 1000; //相机离视体积最远的距离
      const aspect = window.innerWidth / window.innerHeight; //纵横比
      directionalLight.shadow.camera = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
      );
      directionalLight.shadow.bias = 0.0001;
      directionalLight.shadow.mapSize.width =
        directionalLight.shadow.mapSize.height = 1024;
      this.scene.add(directionalLight);

      let light = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(light);
    },
    // 根据浏览器窗口变化动态更新尺寸
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    onDocumentMouseMove(event) {
      event.preventDefault();
    },
  },
};
</script>

<style></style>
