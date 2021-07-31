<template>
  <div class="navbar">
    <div class="hamburgerBox fl">
      <div class="fl menuLine"></div>
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <svg class="icon svg-icon-wh20" fill="#fff" aria-hidden="true">
        <use xlink:href="#icontubiaozhizuomoban15"></use>
      </svg>
    </div>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!--<search id="header-search" class="right-menu-item" />-->

        <!--<el-tooltip content="项目文档" effect="dark" placement="bottom">
          <Doc class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <div class="screenfullHead fl" style="position: relative;float: left;">
          <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
            <screenfull id="screenfull" class="right-menu-item hover-effect" />
          </el-tooltip>
          <svg class="icon svg-icon-wh20" fill="#fff" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban14"></use>
          </svg>
        </div>

        <!--<el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <!--<img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" class="user-avatar">-->

          <svg class="icon user-avatar" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban3"></use>
          </svg>
          <!--<i class="el-icon-caret-bottom" />-->
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display:block;" @click="show = true">
            <el-dropdown-item>
              布局设置
            </el-dropdown-item>
          </span>
          <router-link to="/user/center">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <span style="display:block;" @click="open">
            <el-dropdown-item divided>
              退出登录
            </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Doc from "@/components/Doc";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from "@/components/HeaderSearch";
import Avatar from "@/assets/images/avatar.png";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    Doc
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "device", "user", "baseApi"]),
    show: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    open() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.logout();
      });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #2e8cf0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      line-height: normal;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .screenfullHead {
      position: relative;
      line-height: initial;
    }
    .screenfullHead .right-menu-item {
      position: absolute;
      left: -7px;
      top: 23px;
      opacity: 0;
      line-height: normal;
    }
    .screenfullHead .svg-icon-wh20 {
      margin-top: 26px;
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 18px;
        margin-left: 10px;
        position: relative;
        line-height: normal;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .menuLine {
    border-right: 1px solid #fff;
    height: 30px;
    opacity: 0.3;
    vertical-align: middle;
    margin-top: 5px;
    margin-right: 15px;
  }
}
</style>
