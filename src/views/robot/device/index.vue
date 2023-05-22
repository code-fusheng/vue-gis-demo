<script setup>
import axios from "axios";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-table :data="deviceData" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="uuid" label="uuid" />
      <el-table-column prop="type" label="设备类型" width="120" />
      <el-table-column prop="lastestHeartbeat" label="上次心跳时间" />
      <el-table-column prop="lastestLocation" label="上次位置" />
      <el-table-column fixed="right" label="Operations" width="120">
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
const deviceData = ref("");
const limitDto = ref({
  pageNum: 1,
  pageSize: 10,
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
        .post("http://47.111.158.6:10251/robot/device/list", limitDto.value)
        .then((res) => {
          console.log(res.data);
          deviceData.value = res.data.data.list;
        });
    },
  },
};
</script>
