<script setup>
import ComRouter from "./ComRouter.vue";
import * as THREE from "three";
// 相机控件 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

    //创建一个长方体几何对象Geometry
    // THREE.BoxGeometry        长方体
    // THREE.CylinderGeometry   圆柱体
    // THREE.SphereGeometry     球体
    // THREE.ConeGeometry       圆锥
    // THREE.PlaneGeometry      矩形平面
    // THREE.CircleGeometry     圆平面
    const geometry = new THREE.BoxGeometry(100, 100, 100);

    // 受光照影响材质
    /**
     * 网格材质:
     * - 不受光照影响: 基础 MeshBasicMaterial
     * - 受光照影响: 漫反射 THREE.MeshLambartMaterial
     *              高光   ...
     *              物理   ...
     */

    // 光源
    /**
     * 环境光:
     * 点光源:
     * 聚光灯光源:
     * 平行光:
     */

    // 创建材质对象 Material
    const material = new THREE.MeshBasicMaterial({
      // color: 0xff0000, // 红色
      // color: 0x113b97, // 蓝色
      // 材质半透明设置
      color: 0x0000ff, //设置材质颜色
      transparent: true, //开启透明
      opacity: 0.5, //设置透明度
    });

    // 光源设置
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
    // 光源位置
    pointLight.position.set(400, 0, 0);
    scene.add(pointLight);

    // 网格模型 Mesh
    // 两个参数  几何体 geometry  材质 material
    const mesh = new THREE.Mesh(geometry, material);

    // 模型位置 position
    // 网格模型 三位空间 位置坐标 默认坐标原点
    mesh.position.set(0, 10, 0);

    scene.add(mesh);

    // 以上内容还不足以让页面渲染出当前几何模型

    // 透视投影相机 PerspectiveCamera
    // 实例化一个透视投影相机对象
    // const camera = new THREE.PerspectiveCamera();

    // Canvas画布：课程中会把threejs虚拟相机渲染三维场景在浏览器网页上呈现的结果称为Canvas画布。
    // 定义相机渲染输出的画布尺寸（单位：像素 px）
    const width = window.innerWidth - 142;
    const height = window.innerHeight - 64;

    // 3000改为300，使mesh位于far之外，mesh不在视锥体内，被剪裁掉 => 不显示
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    // 相机位置 position 虚拟相机
    // 相机在Three.js三维坐标系中的位置
    camera.position.set(200, 200, 500);
    // camera.position.set(-1000, 0, 0);   // x 轴拉远距离只能看到长方体侧面

    // 相机观察目标 lookAt()
    // 相机观察目标指向Threejs 3D空间中某个位置
    camera.lookAt(0, 0, 0); // 坐标原点
    // camera.lookAt(0, 10, 0);
    // camera.lookAt(mesh.position); // 指向 mesh 对应的位置

    // 透视投影相机 PerspectiveCamera 视锥体
    // PS：透视投影相机的四个参数fov, aspect, near, far构成一个四棱台3D空间，被称为视锥体，只有视锥体之内的物体，才会渲染出来，视锥体范围之外的物体不会显示在Canvas画布上。
    // fov	相机视锥体竖直方向视野角度	50
    // aspect	相机视锥体水平方向和竖直方向长度比，一般设置为Canvas画布宽高比width / height	1
    // near	相机视锥体近裁截面相对相机距离	0.1
    // far	相机视锥体远裁截面相对相机距离，far-near构成了视锥体高度方向	2000

    /* 三维坐标系 - 三维空间 */

    // 辅助观察坐标系
    // three.js坐标轴颜色 红R、绿G、蓝B 分别对应坐标系的x、y、z轴，对于three.js的3D坐标系 [ 默认y轴朝上 ] 。
    const axesHelper = new THREE.AxesHelper(150); // 参数为坐标系坐标轴线段尺寸大小
    scene.add(axesHelper);

    // 渲染器

    // WebGL 渲染器 WebGLRenderer
    const renderer = new THREE.WebGLRenderer();
    // 设置 Canvas 画布尺寸
    renderer.setSize(width, height); // 设置 three.js 渲染区域的尺寸（像素 px）

    // 渲染器 渲染方法 render()
    renderer.render(scene, camera); // 执行渲染操作

    // 渲染器 Canvas 画布属性 domElement
    document.body.appendChild(renderer.domElement);

    document.getElementById("three-box").appendChild(renderer.domElement);

    console.log(scene);

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

<style scoped>
#three-box {
  /* color: #113b97; */
}
</style>
