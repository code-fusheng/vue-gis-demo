<script setup>
import axios from "axios";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-table :data="deviceData" style="width: 100%">
      <el-table-column prop="licencePlate" label="车牌号" />
      <el-table-column prop="berthNum" label="泊位号" />
      <el-table-column prop="eventTime" label="事件时间" />
    </el-table>
    <el-pagination
      :page-size="20"
      :pager-count="11"
      layout="total, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
        .post("http://47.111.158.6:10251/robot/match/list", limitDto.value)
        .then((res) => {
          console.log(res.data);
          deviceData.value = res.data.data.list;
        });
    },
    handleSizeChange(number) {
      console.log(number);
      limitDto.value.pageSize = number;
      this.listDevice();
    },
    handleCurrentChange(number) {
      console.log(number);
      limitDto.value.pageNum = number;
      this.listDevice();
    },
  },
};
</script>
