<template>
  <div>泊位采集</div>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="采集任务">
      <el-input v-model="formInline.taskId" placeholder="" />
    </el-form-item>
    <el-form-item label="泊位编号">
      <el-col :span="5">
        <el-input v-model="berthPrefix" class="w-50 m-2" placeholder="" />
      </el-col>
      <el-input-number
        v-model="berthNumber"
        :min="1"
        :max="999"
        @change="handleChange"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onCollectStart">采集起点</el-button>
      <el-button type="primary" @click="onCollectEnd">采集终点</el-button>
      <el-button type="primary" @click="doList">查询</el-button>
    </el-form-item>
  </el-form>
  <br />
  <el-table :data="collectData" style="width: 100%">
    <!-- <el-table-column prop="id" label="id" /> -->
    <el-table-column prop="taskMark" label="任务标识" />
    <el-table-column prop="berthMark" label="任务标识" />
    <el-table-column prop="partMark" label="起点&终点">
      <template #default="scope">
        <el-tag
          :type="scope.row.partMark === 1 ? '' : 'success'"
          disable-transitions
          >{{ scope.row.partMark === 1 ? "终点" : "起点" }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column prop="longitude" label="经度" width="120" />
    <el-table-column prop="latitude" label="纬度" width="120" />
    <el-table-column prop="altitude" label="高度" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
const collectData = ref("");

const formInline = reactive({
  taskId: "D",
  berthNum: "D101",
});

const berthPrefix = ref("D1");
const berthNumber = ref(1);

const handleChange = (value) => {
  console.log(value);
};

const onCollectStart = () => {
  collectBerth(0);
};
const onCollectEnd = () => {
  collectBerth(1);
};

const collectBerth = (partMark) => {
  let key = `${formInline.taskId}-${berthPrefix.value}${berthNumber.value}-${partMark}`;
  if (berthNumber.value < 10) {
    key = `${formInline.taskId}-${berthPrefix.value}0${berthNumber.value}-${partMark}`;
  }
  axios
    .get(`http://47.111.158.6:10251/robot/doBerthCollect?key=${key}`)
    .then((res) => {
      if (res.data.code == 200) {
        ElMessage.success(res.data.message);
      } else {
        ElMessage.error(res.data.message);
      }
    });
};

const listDevice = () => {
  axios
    .get(
      `http://47.111.158.6:10251/robot/berthCollectRecords?taskId=${formInline.taskId}`
    )
    .then((res) => {
      console.log(res.data);
      collectData.value = res.data.data;
    });
};

const doList = () => {
  setInterval(listDevice(), 1000);
};
</script>
