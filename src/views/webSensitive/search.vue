<template>
  <div class="siteMenuBox">
    <span class="main-aside-txt">站点：</span>
    <el-select
      v-model="siteListFlag"
      multiple
      class="filter-item"
      @change="changea"
    >
      <el-option
        v-for="(item, index) in siteList"
        :key="index"
        :label="item.name"
        :value="item.accoutid"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import CRUD, { crud } from "@crud/crud";
import { mapGetters } from "vuex";
import { dataHttpGet, dataHttpPost } from "@/api/common";
export default {
  name: "deadChain",
  mixins: [crud()],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      siteListFlag: [],
      siteList: []
    };
  },
  mounted: function() {
    const that = this;
    (window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    }),
      this.getUUserAccountData();
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    //获取所有网站
    getUUserAccountData() {
      let url = "/UUserAccount/list";
      let params = {
        accountType: "1", //网站 2 新媒体
        userId: this.user.id
      };
      dataHttpGet(url, params).then(res => {
        if (res) {
          console.log(res);
          this.siteList = res.data || [];
        }
      });
    },
    changea(index) {
      console.log(444444);
    }
  }
};
</script>
