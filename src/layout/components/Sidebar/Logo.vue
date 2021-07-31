<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <span v-if="logo"  class="sidebar-logo">
          <!-- <svg class="icon svg-iconWh34" fill="#fff" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban36"></use>
          </svg> -->
          <img :src="this.user.deptInfo.sysLogo == '/static/images/logo2.png' ? logo : this.user.deptInfo.sysLogo" alt="">
          <!-- <svg class="icon svg-iconWh34" fill="#fff" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban63"></use>
          </svg> -->
        </span>
        <h1 v-else class="sidebar-title">{{ this.user.deptInfo.sysName || title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <span v-if="logo"  class="sidebar-logo">
          <!-- <svg class="icon svg-iconWh34" fill="#fff" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban36"></use>
          </svg> -->
          <img :src="this.user.deptInfo.sysLogo == '/static/images/logo2.png' ? logo : this.user.deptInfo.sysLogo" alt="">
          <!-- <svg class="icon svg-iconWh34" fill="#fff" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban63"></use>
          </svg> -->
        </span>
        <h1 class="sidebar-title">{{ this.user.deptInfo.sysName || title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import Logo from "@/assets/images/logo.png";
import Config from "@/settings";
import { mapGetters } from "vuex";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted(){
    console.log(this.user.deptInfo)
  },
  data() {
    // this.user.deptInfo.title ||  this.user.deptInfo.sysLogo || 
    return {
      title: Config.title,
      logo: Logo
    };
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      max-width: 36px;
      vertical-align: middle;
      margin-right: 10px;
      /* display: inline-block; */
      position: relative;
      /* top: 13px; */
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: normal;
      line-height: 70px;
      font-size: 18px;
      /* font-size: 22px; */
      /*font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;*/
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
