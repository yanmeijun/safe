<template>
  <transition name="fade">
    <div
      class="modal-container"
      v-if="getOptions.isOpen"
      :class="[
        { 'modal-mask': getOptions.isMask },
        { 'modal-no-footer-container': !getOptions.isFooter },
        { isScreen: getOptions.isScreen }
      ]"
      :style="{ 'z-index': getOptions.zIndex }"
    >
      <div
        class="modal-inner pub-box-shadow"
        :style="innerStyle"
        ref="modalInner"
      >
        <header class="modal-header" @mousedown.prevent="mouseDownHandler">
          <slot name="dialogHeader">
            <div class="modal-header-title flt">{{ getOptions.title }}</div>
            <div class="modal-header-close frt" @click="closeHandler(0)">X</div>
          </slot>
        </header>
        <slot name="append-to-body">
          <div class="modal-body"></div>
        </slot>
        <footer
          class="modal-footer clearfix"
          v-if="getOptions.isFooter"
          :class="[getOptions.footerClass]"
        >
          <slot name="dialogFooter">
            <ul class="btn-list">
              <!-- 可扩展按钮1-->
              <slot name="footerButtons1"></slot>
              <li
                class="btn-item active"
                v-if="getOptions.isConfirm"
                @click="okHandler"
                v-html="getOptions.confirmText"
              ></li>
              <!-- 可扩展按钮2-->
              <slot name="footerButtons2"></slot>
              <li
                class="btn-item"
                v-if="getOptions.isCancel"
                @click="closeHandler(1)"
                v-html="getOptions.cancelText"
              ></li>
              <!-- 可扩展按钮3-->
              <slot name="footerButtons3"></slot>
            </ul>
          </slot>
        </footer>
        <div v-if="getOptions.isScreen">
          <i class="st-screen-b lt"></i><i class="st-screen-b lb"></i
          ><i class="st-screen-b rt"></i><i class="st-screen-b rb"></i>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    dialogOptions: Object
  },
  data() {
    return {
      defaultOptions: {
        isScreen: false, // 是否是大屏统计弹框
        isOpen: false, // 弹框打开标识
        zIndex: 1001, // 'z-index'层级
        isDraggable: true, // 弹框是否可以拖拽（默认为true）
        width: "50%", // 宽 传参含%会按百分比处理，其余按px处理
        height: "80%", // 高 传参含%会按百分比处理，其余按px处理
        isMask: true, // 是否显示遮罩
        title: "提示", // 标题
        isFooter: true, // 是否有底部
        footerClass: "right", // left：居左  right：居右 空字符串：居中
        isConfirm: true, // 是否有确定按钮
        isCancel: true, // 是否有取消按钮
        confirmText: "确&nbsp;&nbsp;定", // 确定按钮文字
        cancelText: "取&nbsp;&nbsp;消" // 取消按钮文字
      },
      innerStyle: {
        width: "50%",
        height: "60%",
        left: "25%",
        top: "20%"
      },
      oDocEle: null
    };
  },
  computed: {
    getOptions() {
      return Object.assign({}, this.defaultOptions, this.dialogOptions);
    }
  },
  methods: {
    setInnerStyle() {
      let iDocW = this.oDocEle.clientWidth;
      let iDocH = this.oDocEle.clientHeight;
      let iW0 = parseInt(this.getOptions.width);
      let iW =
        String(this.getOptions.width).indexOf("%") === -1
          ? iW0
          : (iDocW * iW0) / 100;
      let iH0 = parseInt(this.getOptions.height);
      let iH =
        String(this.getOptions.height).indexOf("%") === -1
          ? iH0
          : (iDocH * iH0) / 100;
      this.innerStyle.width = iW + "px";
      this.innerStyle.height = iH + "px";
      this.innerStyle.left = (iDocW - iW) * 0.5 + "px";
      this.innerStyle.top = (iDocH - iH) * 0.5 + "px";
    },
    closeHandler(type) {
      this.dialogOptions.isOpen = false;
      this.$emit("dialogCancel", type);
    },
    okHandler() {
      this.$emit("dialogOk");
    },
    mouseDownHandler(ev) {
      let oMoveTarget = this.$refs.modalInner;
      let iDisX = ev.clientX - oMoveTarget.offsetLeft;
      let iDisY = ev.clientY - oMoveTarget.offsetTop;
      let iML = this.oDocEle.clientWidth - oMoveTarget.offsetWidth;
      let iMT = this.oDocEle.clientHeight - oMoveTarget.offsetHeight;
      document.onmousemove = function(ev) {
        let iL = ev.clientX - iDisX;
        let iT = ev.clientY - iDisY;
        if (iL < 0) {
          iL = 0;
        }
        if (iL > iML) {
          iL = iML;
        }
        if (iT < 0) {
          iT = 0;
        }
        if (iT > iMT) {
          iT = iMT;
        }
        oMoveTarget.style.left = iL + "px";
        oMoveTarget.style.top = iT + "px";
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  },
  created() {
    this.oDocEle = document.documentElement;
    this.setInnerStyle();
    window.addEventListener("resize", this.setInnerStyle, false);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setInnerStyle, false);
  }
};
</script>
