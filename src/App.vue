<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
//import HelloWorld from './components/HelloWorld.vue'
import "mdui/mdui.css";
import "mdui";
import "@mdui/icons/menu.js";
import "@/assets/mdui-icon.css";
import "@/assets/main.css";
import "mdui/components/divider.js";
import ImMainView from "@/components/ImMainView.vue";

onMounted(() => {});
</script>

<template>
  <header></header>
  <mdui-layout style="width: 100% !important; height: 100%">
    <mdui-top-app-bar id="TitleBar" variant="center-aligned">
      <mdui-top-app-bar-title> Abracadabra Demo </mdui-top-app-bar-title>
    </mdui-top-app-bar>

    <!-- 内部界面，是框架的消息部分 -->
    <mdui-layout-main class="InnerUI" fullHeight>
      <!--主要组件-->
      <mdui-divider></mdui-divider>
      <ImMainView />
      <p
        style="
          position: relative;
          top: -38px;
          width: 100%;
          text-align: center;
          font-size: 1rem;
          z-index: 2100;
        "
      >
        <i>V2.5</i>
      </p>
    </mdui-layout-main>
  </mdui-layout>
</template>
