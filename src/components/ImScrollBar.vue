<script setup>
import "@/assets/ImScrollBar.css";
import { onBeforeMount, onMounted, ref, watch, toRef } from "vue";
const props = defineProps({
  ContainerId: String, //需要绑定的容器
  //注意，你需要把这个组件放到目标容器的下一层
  //并且该容器内溢出的内容必须放在更下一层！
  //滚动条默认使用相对定位！
  /*示例
  <Container>
      <ScrollBar />
      <Content>
       .......Your Content Here
       </Content>
  </Container>
  */
  ContentContainerId: String,
  Direction: String, //方向，可以是 Top Bottom Left Right
  Length: String, // 滚动条的“长度"，根据绑定的方向，会有不同的显示策略。
  Width: String, //滚动条的"宽度"，注意这里不是水平方向的宽度而是动态的宽度。
  PBottom: String, //
  PRight: String, //
  PMarginOne: String,
  PMarginTwo: String,
  Id: String //赋予滚动条的ID，确保每次都赋予不一样的ID！
});
var BarForceHiddened = ref(false);
var BarMouseHovered = ref(false);
var isDragging = ref(false);
function ScrollBarHoverEffect(event) {
  //console.log(event);
  if (BarForceHiddened.value) {
    document.getElementById(props.Id).style.opacity = "0";
    return;
  }
  if (event.type == "mouseover" || isDragging.value) {
    document.getElementById(props.Id).style.opacity = "0.701";
    BarMouseHovered.value = true;
  } else if (event.type == "mouseout" || !isDragging.value) {
    document.getElementById(props.Id).style.opacity = "0.4";
    setTimeout(function () {
      if (document.getElementById(props.Id).style.opacity != "0.701") {
        document.getElementById(props.Id).style.opacity = "0";
        BarMouseHovered.value = false;
      }
    }, 1000);
  }
}
onBeforeMount(() => {});
onMounted(() => {
  //挂载后再执行
  var ScrollBar = document.getElementById(props.Id);
  var ContentContainer = document.getElementById(props.ContentContainerId);
  var Container = document.getElementById(props.ContainerId);
  if (props.Direction == "Left") {
    //动态修改滚动条样式
    ScrollBar.style.float = "left"; //贴左侧显示
    ScrollBar.style.height = props.Length; //长边在垂直方向
    ScrollBar.style.width = props.Width; //短边在水平方向
    ScrollBar.style.bottom = props.PBottom;
    ScrollBar.style.right = props.PRight;
    ScrollBar.style.marginBottom = props.PMarginOne;
    ScrollBar.style.marginTop = props.PMarginTwo;
  } else if (props.Direction == "Right") {
    //动态修改滚动条样式
    ScrollBar.style.float = "right"; //贴右侧显示
    ScrollBar.style.height = props.Length; //长边在垂直方向
    ScrollBar.style.width = props.Width; //短边在水平方向
    ScrollBar.style.bottom = props.PBottom;
    ScrollBar.style.right = props.PRight;
    ScrollBar.style.marginBottom = props.PMarginOne;
    ScrollBar.style.marginTop = props.PMarginTwo;
  } else if (props.Direction == "Top") {
    //动态修改滚动条样式
    ScrollBar.style.float = "left"; //贴上侧显示
    ScrollBar.style.width = props.Length; //长边在水平方向
    ScrollBar.style.height = props.Width; //短边在垂直方向
    ScrollBar.style.bottom = props.PBottom;
    ScrollBar.style.right = props.PRight;
    ScrollBar.style.marginLeft = props.PMarginOne;
    ScrollBar.style.marginRight = props.PMarginTwo;
  } else if (props.Direction == "Bottom") {
    //动态修改滚动条样式
    ScrollBar.style.float = "left"; //贴下侧显示
    ScrollBar.style.width = props.Length; //长边在水平方向
    ScrollBar.style.height = props.Width; //短边在垂直方向
    ScrollBar.style.bottom = props.PBottom;
    ScrollBar.style.right = props.PRight;
    ScrollBar.style.marginLeft = props.PMarginOne;
    ScrollBar.style.marginRight = props.PMarginTwo;
  }
  const thumbPosition = ref("0%");
  var nMax;
  const observer = new ResizeObserver((entries) => {
    // 遍历所有观测到的元素
    entries.forEach((entry) => {
      const targetElement = entry.target;
      if (targetElement.id == props.ContentContainerId) {
        const AnotherTargerElement = Container;
        var a = targetElement.scrollHeight;
        var b = targetElement.scrollWidth;
        var c = AnotherTargerElement.clientHeight;
        var d = AnotherTargerElement.clientWidth;
      }
      if (targetElement.id == props.ContainerId) {
        const AnotherTargerElement = ContentContainer;
        var a = AnotherTargerElement.scrollHeight;
        var b = AnotherTargerElement.scrollWidth;
        var c = targetElement.clientHeight;
        var d = targetElement.clientWidth;
      }
      var NewL, NewML;
      if (props.Direction == "Left") {
        NewL = a;
        NewML = c;
      } else if (props.Direction == "Right") {
        NewL = a;
        NewML = c;
      } else if (props.Direction == "Top") {
        NewL = b;
        NewML = d;
      } else if (props.Direction == "Bottom") {
        NewL = b;
        NewML = d;
      }
      if (NewL <= NewML) {
        //如果实际长度小于等于容器长度，那么隐藏滚动条
        BarForceHiddened.value = true; //屏蔽事件函数的逻辑
        //ScrollBar.style.opacity = "0";
      } else {
        BarForceHiddened.value = false;
        //ScrollBar.style.opacity = "0";
      }
      /*依据内容容器占外部容器尺寸的比例来决定Thumb的长度，这一内容应当是动态更新的。

      元素的offsetTop/Width占ScrollTop/Width的比例，计算Thumb相对于滑条顶部的距离
       */
      var LengthRate = (NewML / NewL) * 100; //计算尺寸比例
      if (NewL > NewML) {
        //如果不需要显示则不计算。
        var Thumb = ScrollBar.childNodes[0];
        var OffsetRate;
        if (props.Direction == "Left") {
          //var TrackLength = ScrollBar.clientHeight;
          Thumb.style.width = "100%";
          Thumb.style.height = LengthRate.toString() + "%";
          OffsetRate = (Container.scrollTop / ContentContainer.scrollHeight) * 100;
          Thumb.style.top = OffsetRate.toString() + "%";
        } else if (props.Direction == "Right") {
          Thumb.style.width = "100%";
          Thumb.style.height = LengthRate.toString() + "%";
          OffsetRate = (Container.scrollTop / ContentContainer.scrollHeight) * 100;
          Thumb.style.top = OffsetRate.toString() + "%";
        } else if (props.Direction == "Top") {
          Thumb.style.width = LengthRate.toString() + "%";
          Thumb.style.height = "100%";
          OffsetRate = (Container.scrollLeft / ContentContainer.scrollWidth) * 100;
          Thumb.style.left = OffsetRate.toString() + "%";
        } else if (props.Direction == "Bottom") {
          Thumb.style.width = LengthRate.toString() + "%";
          Thumb.style.height = "100%";
          OffsetRate = (Container.scrollLeft / ContentContainer.scrollWidth) * 100;
          Thumb.style.left = OffsetRate.toString() + "%";
        }
        thumbPosition.value = OffsetRate;
        if (props.Direction == "Left") {
          nMax = ScrollBar.offsetHeight - Thumb.offsetHeight;
        } else if (props.Direction == "Right") {
          nMax = ScrollBar.offsetHeight - Thumb.offsetHeight;
        } else if (props.Direction == "Top") {
          nMax = ScrollBar.offsetWidth - Thumb.offsetWidth;
        } else if (props.Direction == "Bottom") {
          nMax = ScrollBar.offsetWidth - Thumb.offsetWidth;
        }
      }
    });
  });
  observer.observe(Container);
  observer.observe(ContentContainer); //监听页面resize

  var Thumb = ScrollBar.childNodes[0];
  var nInitCoordinateOne, nInitCoordinateTwo;
  var MouseUpLock = true;
  var nX;
  var BarOffsetRate;
  var AbsoluteOffset;
  function MoveListenner() {
    function MoveEvent(event) {
      if (!MouseUpLock) {
        //鼠标移动时取消默认行为，避免选中其他元素或文字
        event.preventDefault();
        isDragging.value = true;
        ScrollBarHoverEffect({ type: "null" });
        //获取鼠标移动后滑块应该移动到的位置

        if (props.Direction == "Left") {
          nX = event.clientY - nInitCoordinateOne + nInitCoordinateTwo;
        } else if (props.Direction == "Right") {
          nX = event.clientY - nInitCoordinateOne + nInitCoordinateTwo;
        } else if (props.Direction == "Top") {
          nX = event.clientX - nInitCoordinateOne + nInitCoordinateTwo;
        } else if (props.Direction == "Bottom") {
          nX = event.clientX - nInitCoordinateOne + nInitCoordinateTwo;
        }

        //限制滑块最大移动位置
        if (nX >= nMax) {
          nX = nMax;
        }
        //限制滑块最小移动位置
        if (nX <= 0) {
          nX = 0;
        }
        //修改滑块位置（因为用的是箭头函数，所以this还是指向滑块）

        if (props.Direction == "Left") {
          Thumb.style.top = nX + "px";
          BarOffsetRate = nX / ScrollBar.offsetHeight;
          AbsoluteOffset = ContentContainer.scrollHeight * BarOffsetRate;
          Container.scrollTop = AbsoluteOffset;
        } else if (props.Direction == "Right") {
          Thumb.style.top = nX + "px";
          BarOffsetRate = nX / ScrollBar.offsetHeight;
          AbsoluteOffset = ContentContainer.scrollHeight * BarOffsetRate;
          Container.scrollTop = AbsoluteOffset;
        } else if (props.Direction == "Top") {
          Thumb.style.left = nX + "px";
          BarOffsetRate = nX / ScrollBar.offsetWidth;
          AbsoluteOffset = ContentContainer.scrollWidth * BarOffsetRate;
          Container.scrollLeft = AbsoluteOffset;
        } else if (props.Direction == "Bottom") {
          Thumb.style.left = nX + "px";
          BarOffsetRate = nX / ScrollBar.offsetWidth;
          AbsoluteOffset = ContentContainer.scrollWidth * BarOffsetRate;
          Container.scrollLeft = AbsoluteOffset;
        }
      }
    }
    function UpEvent(event) {
      isDragging.value = false;
      ScrollBarHoverEffect({ type: "null" });
      document.removeEventListener("mousemove", MoveEvent);
      MouseUpLock = true;
    }
    //鼠标松开绑定事件，取消页面上所有事件
    document.addEventListener("mouseup", UpEvent, { once: true });
    document.addEventListener("mousemove", MoveEvent);
  }
  Thumb.addEventListener("mousedown", function (event) {
    //这里用原生JS来绑定事件监听
    //因为必要的数据必须在onMounted之后才能读取
    if (props.Direction == "Left") {
      nInitCoordinateOne = event.clientY;
      nInitCoordinateTwo = this.offsetTop;
    } else if (props.Direction == "Right") {
      nInitCoordinateOne = event.clientY;
      nInitCoordinateTwo = this.offsetTop;
    } else if (props.Direction == "Top") {
      nInitCoordinateOne = event.clientX;
      nInitCoordinateTwo = this.offsetLeft;
    } else if (props.Direction == "Bottom") {
      nInitCoordinateOne = event.clientX;
      nInitCoordinateTwo = this.offsetLeft;
    }
    MouseUpLock = false;
    MoveListenner();
  });
  var timeout = null;
  function ContainerScrollEventProcess(event) {
    var OffsetRate;
    isDragging.value = true;
    ScrollBarHoverEffect({ type: "null" });
    if (props.Direction == "Left") {
      OffsetRate = (Container.scrollTop / ContentContainer.scrollHeight) * 100;
      Thumb.style.top = OffsetRate.toString() + "%";
    } else if (props.Direction == "Right") {
      OffsetRate = (Container.scrollTop / ContentContainer.scrollHeight) * 100;
      Thumb.style.top = OffsetRate.toString() + "%";
    } else if (props.Direction == "Top") {
      OffsetRate = (Container.scrollLeft / ContentContainer.scrollWidth) * 100;
      Thumb.style.left = OffsetRate.toString() + "%";
    } else if (props.Direction == "Bottom") {
      OffsetRate = (Container.scrollLeft / ContentContainer.scrollWidth) * 100;
      Thumb.style.left = OffsetRate.toString() + "%";
    }
    if (MouseUpLock) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        isDragging.value = false;
        ScrollBarHoverEffect({ type: "null" });
      }, 200);
    }
  }

  Container.addEventListener("scroll", ContainerScrollEventProcess);
});
</script>

<template>
  <div
    class="ImScrollBarTrack"
    :id="props.Id"
    @mouseover="ScrollBarHoverEffect"
    @mouseout="ScrollBarHoverEffect"
  >
    <div class="ImScrollBarThumb"></div>
  </div>
</template>
