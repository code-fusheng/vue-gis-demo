<script setup>
import ComRouter from "./ComRouter.vue";
import * as THREE from "three";
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
    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 创建正方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 142, window.innerHeight - 64);
    document.getElementById("three-box").appendChild(renderer.domElement);

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  },
};
</script>
