<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { PhoneNumberServer } from "aliyun_numberauthsdk_web";
const url = ref("http://47.111.158.6:5173/");
const origin = ref("http://47.111.158.6:5173");
const accessToken = ref("");
const jwtToken = ref("");
let phoneNumberServer;

const doGetAuthToken = async () => {
  await axios
    .post(
      `http://118.190.156.22:10240/robot/debug/getAuthToken?url=${url.value}&origin=${origin.value}`
    )
    .then((res) => {
      console.log(res.data);
      accessToken.value = res.data.data.accessToken;
      jwtToken.value = res.data.data.jwtToken;
    });
};

const checkLogin = () => {
  phoneNumberServer = new PhoneNumberServer();
  phoneNumberServer.checkLoginAvailable({
    accessToken: accessToken.value,
    jwtToken: jwtToken.value,
    success: function (res) {
      console.log("身份鉴权成功,可唤起登录界面", res);
      getToken();
    },
    error: function (res) {
      console.log("身份鉴权失败", res);
    },
  });
};

const getToken = () => {
  console.log("xxx");
  phoneNumberServer.getLoginToken({
    success: function (res) {
      console.log(res);
    },
    error: function (res) {
      console.log(res);
    },
    watch: function (status, data) {},
    // 配置选项
    authPageOption: {
      navText: "一键登录",
      subtitle: "", // 副标题
      btnText: "立即登录",
      agreeSymbol: "、",
      showCustomView: true,
      customView: {
        element:
          '<div class="btn_box other" onclick="clickEvent()">切换其他登录方式</div>',
        style: ".btn_box.other{background: #fff; color: #f00}",
        js: "function clickEvent(){alert(666666)}",
      },
      privacyBefore: "我已阅读并同意",
      isDialog: true, // 是否是弹窗样式
      manualClose: true, // 是否手动关闭弹窗/授权页
    },
  });
};
</script>

<template>
  <h1>阿里云手机号快速验证</h1>
  <div class="number-auth-demo">
    <el-input v-model="url" placeholder="Please input" />
    <el-input v-model="origin" placeholder="Please input" />
    <div>
      <span>{{ accessToken }}</span>
      <span>{{ jwtToken }}</span>
    </div>
    <el-button type="primary" @click="doGetAuthToken">获取Token</el-button>
    <!-- <h3 class="title">一键登录</h3> -->
    <a id="J_loginPhone" class="submit-btn" @click="checkLogin">一键登录</a>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
