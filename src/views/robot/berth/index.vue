<script setup>
import axios from "axios";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-table :data="berthData" style="width: 100%">
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column prop="berthNum" label="泊位号" />
      <el-table-column prop="berthNumVirtual" label="虚拟泊位号" />
      <el-table-column prop="startLocation" label="起点坐标" />
      <el-table-column prop="endLocation" label="终点坐标" />
      <el-table-column prop="length" label="长度/米" />
      <el-table-column fixed="right" label="Operations">
        <template #default>
          <el-button link type="primary" size="small" @click="handleClick"
            >Detail</el-button
          >
          <el-button link type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const berthData = ref("");
const limitDto = ref({
  pageNum: 1,
  pageSize: 1000,
  params: {
    type: "",
  },
});
const pageData = ref("");
export default {
  data() {
    return {};
  },
  created() {
    this.listDevice();
  },
  methods: {
    listDevice() {
      axios
        .post("http://localhost:10240/robot/berth/list", limitDto.value)
        .then((res) => {
          console.log(res.data);
          berthData.value = res.data.data.list;
        });
    },
  },
};
</script>
