<script setup>
import axios from "axios";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-table :data="deviceData" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="uuid" label="uuid" />
      <el-table-column prop="deviceName" label="车辆名称" fit />
      <el-table-column prop="deviceType" label="车辆类型" fit />
      <el-table-column
        prop="lastestHeartbeat"
        show-overflow-tooltip
        label="上次心跳时间"
      />
      <el-table-column
        prop="lastestLocation"
        show-overflow-tooltip
        label="上次位置"
      />
      <el-table-column prop="remainBattery" label="剩余电量" fit />
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
        .post("http://47.111.158.6:10240/robot/car/list", limitDto.value)
        .then((res) => {
          console.log(res.data);
          deviceData.value = res.data.data.list;
        });
    },
  },
};
</script>
