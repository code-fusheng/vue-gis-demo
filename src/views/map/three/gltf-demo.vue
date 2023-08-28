<script setup>
import ComRouter from "./ComRouter.vue";
import * as THREE from "three";
// 相机控件 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
</script>

<template>
  <div id="three-box">
    <ComRouter />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // 创建场景对象
    const scene = new THREE.Scene();
    // 创建相机对象
    const width = window.innerWidth - 142;
    const height = window.innerHeight - 64;

    // 3000改为300，使mesh位于far之外，mesh不在视锥体内，被剪裁掉 => 不显示
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(200, 200, 500);
    camera.lookAt(0, 0, 0);

    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("three-box").appendChild(renderer.domElement);

    // 创建光源
    const light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 0);
    scene.add(light);

    const axesHelper = new THREE.AxesHelper(150); // 参数为坐标系坐标轴线段尺寸大小
    scene.add(axesHelper);

    // 创建 GLTF 加载器对象
    const loader = new GLTFLoader();
    // GLTF 加载器 load 方法
    loader.load("/src/assets/望城坡建筑.glb", function (glb) {
      console.log(glb);
      console.log(glb.scene);
      scene.add(glb.scene);
    });

    renderer.setSize(width, height);
    // 渲染函数
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // 设置相机空间 轨道控制器 OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    // OrbitControls本质上就是改变相机的参数，比如相机的位置属性，改变相机位置也可以改变相机拍照场景中模型的角度
    controls.addEventListener("change", function () {
      console.log("camera.position", camera.position);
      renderer.render(scene, camera); //执行渲染操作
    }); //监听鼠标、键盘事件
  },
};
</script>
