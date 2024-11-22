<script setup>
import "@/assets/ImMainView.css";
import ImScrollBar from "./ImScrollBar.vue";
import { onMounted, ref, watch } from "vue";
import HomeView from "@/views/HomeView.vue";
//import $ from "jquery";
const mainHeight = ref(0);
const mainHeightObserve = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    mainHeight.value = entry.contentRect.height;
  });
});

onMounted(() => {
  mainHeightObserve.observe(document.getElementById("ImWindowContainer"));
  //mainHeight.value = document.getElementById("ImWindowContainer").clientHeight;
});
</script>

<template>
  <div id="ImWindowContainer" ref="ImContainer">
    <ImScrollBar
      ContainerId="ImWindowContainer"
      ContentContainerId="ImContentContainer"
      Direction="Right"
      Length="calc(100% - 120px)"
      Width="10px"
      PBottom="10px"
      PRight="2px"
      PMarginOne="27px"
      PMarginTwo="0px"
      Id="TestBar"
    />
    <div id="ImContentContainer">
      <div id="main_content" :style="{ height: 'fit-content' }">
        <HomeView />
      </div>
    </div>
  </div>
</template>
