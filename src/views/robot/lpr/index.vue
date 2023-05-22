<script setup>
import axios from "axios";
import { ref } from "vue";
</script>

<template>
  <div>
    <el-table :data="deviceData" style="width: 100%">
      <el-table-column prop="licencePlate" label="车牌号" />
      <el-table-column prop="smallImage" label="车牌图片">
        <template #default="{ row }">
          <img
            :src="'http://47.111.158.6' + row.smallImage.replace('/opt', '')"
            style="width: 100px; height: 40px"
            @click="showImageDialog(row.smallImage)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="fullImage" label="车牌图片">
        <template #default="{ row }">
          <img
            :src="'http://47.111.158.6' + row.fullImage.replace('/opt', '')"
            style="width: 100px; height: 40px"
            @click="showImageDialog(row.fullImage)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="eventLocation" label="事件位置" />
      <el-table-column prop="targetLocation" label="目标位置" />
      <el-table-column prop="eventTime" label="事件时间" />
      <el-table-column prop="matchStatus" label="匹配状态">
        <template #default="scope">
          <el-tag v-if="scope.row.matchStatus === 1">匹配成功</el-tag>
          <el-tag v-else-if="scope.row.matchStatus === -1">匹配失败</el-tag>
          <el-tag v-else>待匹配</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="匹配说明" />
    </el-table>
    <el-pagination
      :page-size="20"
      :pager-count="11"
      layout="total, prev, pager, next"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-model="dialogVisible"
      :title="currentImagePath"
      @close="closeImageDialog"
    >
      <img
        :src="'http://47.111.158.6' + currentImagePath.replace('/opt', '')"
        style="width: 100%; height: 100%"
      />
    </el-dialog>
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
    return {
      dialogVisible: false,
      currentImagePath: "",
    };
  },
  created() {
    this.listDevice();
  },
  methods: {
    listDevice() {
      axios
        .post("http://47.111.158.6:10251/robot/lpr/list", limitDto.value)
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
    showImageDialog(imagePath) {
      console.log(imagePath);
      this.currentImagePath = imagePath;
      this.dialogVisible = true;
    },
    closeImageDialog() {
      this.dialogVisible = false;
      this.currentImagePath = "";
    },
  },
};
</script>
