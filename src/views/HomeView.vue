<script setup>
import Card from "@/components/MdCard.vue";
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch } from "vue";
import "@mdui/icons/autorenew--rounded.js";
import "@mdui/icons/do-not-disturb-alt--rounded.js";
import "@mdui/icons/explore.js";
import "@mdui/icons/done--rounded.js";
import { snackbar } from "mdui/functions/snackbar.js";

import { Abracadabra } from "abracadabra-cn";

const InputMode = ref("TEXT");
const OutputMode = ref("TEXT");
const ForceEnc = ref(false);
const ForceDec = ref(false);
const ForceEncq = ref(false);
const FileCardColor = ref("#5b6169");
var dropzoneActive = false;
var filess = ref(new Array());
const INFILE = ref(null);
const FILENAME = ref("");

watch(
  () => filess.value[0],
  (newFile) => {
    INFILE.value = newFile;
    FILENAME.value = newFile.name;
    window.inputfile = newFile;
  }
);

function fileToUint8Array(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      // 当FileReader读取操作完成时，event.target.result将包含读取的结果
      const uint8Array = new Uint8Array(event.target.result);
      resolve(uint8Array);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file); // 读取文件内容，结果为ArrayBuffer
  });
}
function uint8ArrayToFile(uint8Array, fileName, mimeType) {
  const blob = new Blob([uint8Array], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}
/**
 * 处理拖拽区域的拖入事件
 * @param {Event} event - 拖入事件对象
 */
function dragEnter(event) {
  event.preventDefault();
  dropzoneActive = true;
  document.getElementById("FileCard").style.background = "#6ea0be";
}
/**
 * 处理拖拽区域的拖离事件
 * @param {Event} event - 拖离事件对象
 */
function dragLeave(event) {
  event.preventDefault();
  dropzoneActive = false;
  document.getElementById("FileCard").style.background = "#5b6169";
}
/**
 * 处理拖拽区域的拖放事件
 * @param {Event} event - 拖放事件对象
 */
function dragOver(event) {
  event.preventDefault();
}
/**
 * 处理文件的拖放上传
 * @param {Event} event - 拖放事件对象
 */
function dropFile(event) {
  event.preventDefault();
  dropzoneActive = false;
  document.getElementById("FileCard").style.background = "#5b6169";
  const files = event.dataTransfer.files;
  handleFiles(files);
}
/**
 * 处理选择文件按钮的上传事件
 * @param {Event} event - 选择文件事件对象
 */
function selectFile(event) {
  const files = event.target.files;
  handleFiles(files);
  //console.log(files);
}
function triggers(event) {
  document.querySelector("#fileIn").click();
}
/**
 * 处理上传的文件列表
 * @param {FileList} files - 文件列表
 */
function handleFiles(files) {
  filess.value = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    filess.value.push(file);
    // 在这里可以执行文件上传的相关操作
  }
}

function ControlEnc() {
  if (document.getElementById("ForceEnc").checked == true) {
    document.getElementById("ForceDec").disabled = true;
    document.getElementById("ForceDec").checked = false;
    ForceEnc.value = true;
    ForceDec.value = false;
  } else if (document.getElementById("ForceDec").checked == true) {
    document.getElementById("ForceEnc").disabled = true;
    document.getElementById("Forceq").disabled = true;
    document.getElementById("ForceEnc").checked = false;
    ForceEnc.value = false;
    ForceDec.value = true;
  } else {
    document.getElementById("ForceDec").disabled = false;
    document.getElementById("ForceEnc").disabled = false;
    document.getElementById("Forceq").disabled = false;
    ForceEnc.value = false;
    ForceDec.value = false;
  }
}
function ControlEncq() {
  if (document.getElementById("Forceq").checked == true) {
    ForceEncq.value = true;
  } else {
    ForceEncq.value = false;
  }
}

async function ProcessGo() {
  let Abra = new Abracadabra(InputMode.value, OutputMode.value);
  let key;
  try {
    if (document.getElementById("KeyCard").value == "") {
      key = "ABRACADABRA";
      snackbar({
        message: "你没有填写密钥，自动使用默认密钥，这不安全",
        autoCloseDelay: 1500
      });
    } else {
      key = document.getElementById("KeyCard").value;
    }
    if (InputMode.value == "TEXT") {
      if (document.getElementById("InputCard").value == "") {
        return;
      }
      if (ForceEnc.value) {
        if (ForceEncq.value) {
          Abra.Input(document.getElementById("InputCard").value, "ENCRYPT", key, true);
        } else {
          Abra.Input(document.getElementById("InputCard").value, "ENCRYPT", key, false);
        }
      } else if (ForceDec.value) {
        Abra.Input(document.getElementById("InputCard").value, "DECRYPT", key);
      } else {
        Abra.Input(document.getElementById("InputCard").value, "AUTO", key, ForceEncq.value);
      }
    } else if (InputMode.value == "UINT8") {
      if (window.inputfile == undefined || window.inputfile == null) {
        return;
      }
      let FileU = await fileToUint8Array(window.inputfile);
      if (ForceEnc.value) {
        if (ForceEncq.value) {
          Abra.Input(FileU, "ENCRYPT", key, true);
        } else {
          Abra.Input(FileU, "ENCRYPT", key, false);
        }
      } else if (ForceDec.value) {
        Abra.Input(FileU, "DECRYPT", key);
      } else {
        Abra.Input(FileU, "AUTO", key, ForceEncq.value);
      }
    }
    if (OutputMode.value == "TEXT") {
      document.getElementById("OutputText").value = Abra.Output();
    } else if (OutputMode.value == "UINT8") {
      let OutUint = Abra.Output();
      let FileOut = uint8ArrayToFile(OutUint, "Abracadabra_Result", "application/octet-stream");

      let aTag = document.createElement("a"); //创建一个a标签
      aTag.download = FileOut.name;
      let href = URL.createObjectURL(FileOut); //获取url
      aTag.href = href;
      aTag.click();
      URL.revokeObjectURL(href); //释放url
    }
  } catch (err) {
    snackbar({
      message: "发生错误, " + err.toString()
    });
  }
}

onMounted(() => {
  ControlEnc();
});
onBeforeUnmount(() => {});
</script>

<template>
  <div id="MainBager" style="display: inline-grid; height: 85%; width: 100%">
    <div
      id="MainContainer"
      style="display: grid; grid-template-rows: 200px 150px 200px; grid-gap: 7px"
    >
      <mdui-text-field
        id="InputCard"
        v-if="InputMode == 'TEXT'"
        variant="outlined"
        rows="7"
        label="输入"
        style="grid-area: 1"
      ></mdui-text-field>
      <Card
        v-if="InputMode == 'UINT8'"
        id="FileCard"
        Background="#5b6169"
        Width="100%"
        Height="200px"
        :Other="{ 'grid-area': 1, transition: 'all 1s ease' }"
        clickable
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragover="dragOver"
        @drop="dropFile"
        @click="triggers"
      >
        <h1 style="align-self: center; justify-self: center">选择文件</h1>
        <p style="align-self: center; justify-self: center">拖拽或点击</p>
        <p style="align-self: center; justify-self: center; margin-bottom: 0">{{ FILENAME }}</p>
        <input type="file" id="fileIn" style="display: contents" @change="selectFile" />
      </Card>
      <div
        id="controlBar"
        style="
          grid-area: 2;
          display: grid;
          grid-template-columns: 40% 20% 40%;
          grid-template-rows: 50% 50%;
        "
      >
        <div id="InputOutputBar" style="display: grid; scale: 0.85">
          <span style="grid-area: 1; width: 35px; align-self: center; justify-self: right"
            >输入</span
          >
          <mdui-radio-group
            id="InputSelector"
            variant="filled"
            value="TEXT"
            style="width: 152px; grid-area: 1; height: 30px"
            @input="InputMode = $event.target.value"
          >
            <mdui-radio value="UINT8">文件</mdui-radio>
            <mdui-radio value="TEXT">文本</mdui-radio>
          </mdui-radio-group>
          <span style="grid-area: 2; width: 35px; align-self: center; justify-self: right"
            >输出</span
          >
          <mdui-radio-group
            id="OutputSelector"
            variant="filled"
            value="TEXT"
            style="width: 152px; grid-area: 2; height: 30px"
            @input="OutputMode = $event.target.value"
          >
            <mdui-radio value="UINT8">文件</mdui-radio>
            <mdui-radio value="TEXT">文本</mdui-radio>
          </mdui-radio-group>
        </div>
        <mdui-fab
          variant="primary"
          icon="arrow_downward--rounded"
          style="align-self: center; justify-self: center"
          @click="ProcessGo"
        ></mdui-fab>
        <div
          id="CryptControl"
          style="
            display: grid;
            grid-template-columns: 50% 50%;
            grid-template-rows: 50% 50% 50%;
            padding-bottom: 23px;
            gap: 17px;
            scale: 0.8;
            align-content: center;
            margin-top: 20px;
          "
        >
          <span style="align-self: center; justify-self: right; margin-right: 0px">强制加密</span>
          <mdui-switch
            id="ForceEnc"
            style="align-self: center; justify-self: left"
            unchecked-icon="hdr_auto--rounded"
            checked-icon="verified_user--rounded"
            @change="ControlEnc"
          ></mdui-switch>
          <span style="align-self: center; justify-self: right; margin-right: 0px">强制解密</span>
          <mdui-switch
            id="ForceDec"
            style="align-self: center; justify-self: left"
            unchecked-icon="hdr_auto--rounded"
            checked-icon="verified_user--rounded"
            @change="ControlEnc"
          ></mdui-switch>
          <span style="align-self: center; justify-self: right; margin-right: 0px">去除标志</span>
          <mdui-switch
            id="Forceq"
            style="align-self: center; justify-self: left"
            @change="ControlEncq"
          ></mdui-switch>
        </div>
        <mdui-text-field
          id="KeyCard"
          variant="outlined"
          rows="1"
          label="密钥"
          style="grid-column: span 3; align-self: center"
        ></mdui-text-field>
      </div>
      <mdui-text-field
        v-if="OutputMode == 'TEXT'"
        id="OutputText"
        variant="outlined"
        rows="7"
        label="输出"
        style="grid-area: 3"
      ></mdui-text-field>
      <Card
        v-if="OutputMode == 'UINT8'"
        id="FileCard2"
        Background="#5b6169"
        Width="100%"
        Height="200px"
        :Other="{ 'grid-area': 3, transition: 'all 1s ease' }"
      >
        <h1 style="align-self: center; justify-self: center">输出文件</h1>
      </Card>
      <p style="bottom: 5px; width: 100%; text-align: center; font-size: 1rem">
        Powered by Abracadabra<br /><a href="https://github.com/SheepChef/Abracadabra"
          >Github Repo</a
        >
      </p>
      <div style="height: 85px"></div>
    </div>
  </div>
</template>
<style scoped></style>
