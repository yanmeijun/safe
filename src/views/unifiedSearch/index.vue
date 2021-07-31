<template>
  <div class="app-container">
    <div v-if="isShow">
      <div
        class="unfiedSearchBox clearfix"
        style="height: calc(100vh - 175px);"
      >
        <div class="position-box-search bigSearchBox">
          <input
            type="text"
            placeholder="请输入要搜索的关键词"
            class="btnText fl"
            v-model="searchKey"
            @keyup.enter.prevent="getSearchList('one')"
          />
          <el-dropdown class="" @command="handleCommand2" v-if="this.user.isAdmin">
            <el-button type="primary" size="medium" class="btnSearch2" style="line-height: auto;"
              >搜索</el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in mechanismList"
                :command="{
                  value: item.id,
                  label: item.label
                }"
                :key="item.id"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <button class="btnSearch fl" @click="getSearchList('one')" v-else>
            搜索
          </button>
          <button
            class="btnSearch fl"
            @click="advancedSearch"
            style="border-radius: 4px;margin-left: 20px;"
          >
            高级搜索
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="unfiedSearchBox clearfix">
        <input
          type="text"
          placeholder="请输入要搜索的关键词"
          class="btnText fl"
          v-model="searchKey"
          @keyup.enter.prevent="getSearchList"
        />
        
        <el-dropdown  @command="handleCommand2" v-if="this.user.isAdmin">
          <el-button type="primary" size="medium" class="btnSearch3"
            >搜索</el-button
          >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in mechanismList"
              :command="{
                value: item.id,
                label: item.label
              }"
              :key="item.id"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
       <button class="btnSearch fl" @click="getSearchList('one')" v-else>搜索</button>


        <el-button type="primary" class="advancedSearch" @click="advancedSearch"
          >高级搜索</el-button
        >
      </div>
      <div class="searchResultData">
        <div class="searchResultTit searchResultTit2">
          <svg class="icon svg-icon-operW16" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban35" fill="#078fea"></use>
          </svg>
          搜索结果：共找到相关结果{{ total }}个
        </div>
      </div>
      <div class="searchResultList">
        <div class="searchResultTit" style="margin-bottom: 0px;">
          <span>查询数据：</span>
          <el-select
            v-model="states"
            placeholder="请选择"
            @change="change()"
            class="selectWh"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span
            style="margin-left: 10px;color: rgba(0,0,0,0.45);font-size: 12px;"
            >提示：对数据做删除或取消删除时，需等待1秒后生效呦！</span
          >
          <el-dropdown class="rightExport" @command="handleCommand">
            <el-button type="primary" size="medium" class="exportExexc"
              >导出</el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in all_list"
                :command="{
                  value: item.value,
                  label: item.label
                }"
                :key="item.value"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="s-r-listCon">
          <ul :style="{ marginTop: searchKeyData.length > 0 ? '20px' : '0' }">
            <li class="clearfix" v-for="item in searchKeyData">
              <a
                :href="item.url"
                class="tit fl"
                target="_blank"
                v-html="item.resTitle"
              ></a>
              <b class="time fl">{{ item.pubDate }}</b>
              <span class="fl" style="margin-left: 20px;">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="取消删除"
                  placement="top"
                  v-if="item.isDelete === '1'"
                >
                  <svg
                    class="icon svg-icon-operW16 svg-icon-operW20"
                    tile="取消删除"
                    aria-hidden="true"
                    @click="toDelete(item.id, '2', '确定取消删除此条数据吗？')"
                  >
                    <use xlink:href="#icontubiaozhizuomoban28"></use>
                  </svg>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                  v-else
                >
                  <svg
                    class="icon svg-icon-operW16"
                    tile="删除"
                    aria-hidden="true"
                    @click="toDelete(item.id, '1', '确定删除此条数据吗？')"
                  >
                    <use xlink:href="#icontubiaozhizuomoban1"></use>
                  </svg>
                </el-tooltip>
              </span>
            </li>
          </ul>
        </div>
        <el-pagination
          v-show="total > 0"
          @size-change="handleSizeChange($event)"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, sizes"
          :page-sizes="[10, 20, 30, 40, 50, 100, 150, 200]"
          :current-page.sync="page"
          :page-size="pageSize"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <advanced-search
      v-bind:advancedSearchShow="advancedSearchShow"
      v-bind:overflowHeight="overflowHeight"
      @listenToChildEvent="closePage()"
      @searchParams="searchParams"
    />
  </div>
</template>

<script>
import { dataHttpGet, del } from "@/api/common";
import { mapGetters } from "vuex";
import advancedSearch from "@/views/unifiedSearch/advancedSearch";
import crud from "@/mixins/crud";
import { getDepts } from "@/api/system/dept";
export default {
  name: "UnifiedSearch",
  components: { advancedSearch },
  mixins: [crud],
  data() {
    return {
      searchKey: "",
      siteList: [],
      searchKeyData: [],
      page: 0,
      pageSize: 50,
      total: 0,
      isShow: true,
      advancedSearchShow: false,
      options: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未删除",
          value: "2"
        },
        {
          label: "已删除",
          value: "1"
        }
      ],
      all_list: [
        { label: "导出全部页", value: "1" },
        { label: "导出当前页", value: "2" }
      ],
      states: "2", //标识 删除1 取消删除2
      advanceSearchParams: {},
      overflowHeight: false,
      // 导出表格宽度是否auto
      autoWidth: true,
      mechanismList: []
    };
  },
  mounted: function() {
    if(!this.user.isAdmin){
      this.getUUserAccountData();
    }
    this.getDepts()
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    async getDepts() {
      await getDepts().then(res => {
        this.mechanismList = res.content || [];
      });
    },
    //获取所有网站
    getUUserAccountData(val) {
      if(this.user.isAdmin){
        let url = "/uDatabaseInfo/getAllList";
        let params = {
          deptId: val
        }
        dataHttpGet(url, params).then(res => {
            if (res) {
              let data = res.data || [];
              for (var i = 0; i < data.length; i++) {
                this.siteList.push(data[i].siteCode);
              }
              this.getSearchList('one')
            }
        });
      }else{
        let url = "/UUserAccount/list";
        let params = {
          accountType: "1", //网站 2 新媒体
          userId: this.user.id
        };
        dataHttpGet(url, params).then(res => {
          if (res) {
            let data = res.data || [];
            for (var i = 0; i < data.length; i++) {
              this.siteList.push(data[i].accoutid);
            }
          }
        });
      }
      
    },
    getSearchList(mgs, advanceSearch, advanceSearch2) {
      this.searchKeyData = [];
      this.total = 0;
      if (mgs == "one") {
        if (!this.searchKey || this.searchKey.replace(/\s/g, "").length == 0) {
          this.searchKey = "";
          this.$message.error("搜索内容不能为空");
          this.isShow = true;
          return;
        }
      }
      this.isShow = false;
      let url = "/api/unifiedSearch";
      if (mgs == "one") {
        this.page = 0;
      }
      var page = this.page;
      if (page == 0) {
        page = 1;
      } else {
        page = this.page;
      }
      // let params = {
      //   siteCodes: this.siteList.join(','),
      //   searchKey: this.searchKey,
      //   page: page-1,
      //   size: this.pageSize
      // }
      let params = {
        siteCodes: this.siteList.join(","),
        anyWord: this.searchKey,
        page: page - 1,
        size: this.pageSize,
        queryMode: "like",
        isDelete: this.states,
        startCreateTime: "",
        endCreateTime: "",
        startPubDate: "",
        endPubDate: "",
        allWord: "",
        notWord: "",
        feilds: ""
      };

      if (advanceSearch) {
        params = Object.assign(params, this.advanceSearchParams);
        if (!advanceSearch2) {
          params = Object.assign(params, { isDelete: this.states });
        }
      }

      this.exportParam = params;
      dataHttpGet(url, params).then(res => {
        if (res) {
          this.searchKeyData = res.data.list || [];
          this.page = res.data.pageNum + 1 || 0;
          this.total = res.data.total || 0;
        }
      });
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      //this.getSearchList()
      if (JSON.stringify(this.advanceSearchParams) !== "{}") {
        this.getSearchList("", "advanceSearch");
      } else {
        this.getSearchList();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (JSON.stringify(this.advanceSearchParams) !== "{}") {
        this.getSearchList("", "advanceSearch");
      } else {
        this.getSearchList();
      }
    },
    advancedSearch() {
      this.advancedSearchShow = true;
      if (document.body.clientHeight < 766) {
        this.overflowHeight = true;
      } else {
        this.overflowHeight = false;
      }
    },
    closePage() {
      this.advancedSearchShow = false;
    },
    async handleCommand2(command){
      console.log(command)
      if (!this.searchKey || this.searchKey.replace(/\s/g, "").length == 0) {
        this.searchKey = "";
        this.$message.error("搜索内容不能为空");
        this.isShow = true;
        return;
      }
      await this.getUUserAccountData(command.value);
    },
    handleCommand(command) {
      //导出全部1;导出当前页2
      //  this.params = Object.assign(this.exportParam,{type: command.value});
      //  this.url = "api/unifiedSearch";
      //  this.downloadMethod();
      //process.env.VUE_APP_BASE_API+
      if (command.value === "1") {
        window.location.href =
          process.env.VUE_APP_BASE_API +
          "api/unifiedSearch/download?allWord=" +
          this.exportParam.allWord +
          "&anyWord=" +
          this.exportParam.anyWord +
          "&endCreateTime=" +
          this.exportParam.endCreateTime +
          "&endPubDate=" +
          this.exportParam.endPubDate +
          "&feilds=" +
          this.exportParam.feilds +
          "&isDelete=" +
          this.exportParam.isDelete +
          "&notWord=" +
          this.exportParam.notWord +
          "&queryMode=" +
          this.exportParam.queryMode +
          "&siteCodes=" +
          this.exportParam.siteCodes +
          "&startCreateTime=" +
          this.exportParam.startCreateTime +
          "&startPubDate=" +
          this.exportParam.startPubDate +
          "&states=" +
          this.exportParam.states +
          "&type=" +
          command.value +
          "&userId=" +
          this.user.id;
      } else {
        // 列标题
        var date = new Date();
        var month = parseInt(date.getMonth() + 1);
        var day = date.getDate();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        const worksheet =
          "统一搜索-" + date.getFullYear() + "-" + month + "-" + day;
        var searchKeyData = [];

        this.searchKeyData.map(item => {
          let itemObj = {};
          itemObj["siteCode"] = item.siteCode;
          itemObj["name"] = item.name;
          itemObj["keywords"] = item.keywords;
          itemObj["resTitle"] = item.resTitle.replace(/<.*?>/gi, "");
          itemObj["url"] = item.url;
          itemObj["pubDate"] = item.pubDate;
          searchKeyData.push(itemObj);
        });
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require("../../excel/Export2Excel.js");
          const tHeader = [
            "站点标识码",
            "站点名称",
            "关键词",
            "关键词所在上下文",
            "超链接",
            "发稿时间"
          ];
          const filterVal = [
            "siteCode",
            "name",
            "keywords",
            "resTitle",
            "url",
            "pubDate"
          ];
          const list = searchKeyData;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, worksheet, this.autoWidth);
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    change(val) {
      if (this.searchKey) {
        this.getSearchList("one");
        this.advanceSearchParams = {};
      } else {
        this.getSearchList("", "advanceSearch");
      }
    },
    searchParams(data) {
      this.advanceSearchParams = data;
      this.searchKey = "";
      this.states = "2";
      this.getSearchList("", "advanceSearch", "advanceSearch2");
    },
    toDelete(datas, num, mgs) {
      del("/api/unifiedSearch/deleteSearch", { id: datas, status: num }).then(
        res => {
          // if(res.code == 200){
          //   this.$notify({
          //     title: '成功',
          //     message: '操作成功',
          //     type: 'success'
          //   });
          // }else{
          //   this.$notify.error({
          //     title: '错误',
          //     message: res.message
          //   });
          // }

          // if(this.searchKey){
          //   this.advanceSearchParams = {};
          //   this.getSearchList('one');
          // }else{
          //   this.getSearchList('','advanceSearch');
          // }

          if (this.states) {
            this.searchKeyData.map((item, index) => {
              if (item.id == datas) {
                this.searchKeyData.splice(index, 1);
              }
            });
          } else {
            this.searchKeyData.map((item, index) => {
              if (item.id == datas) {
                item = Object.assign(item, {
                  isDelete: num
                });
                this.$set(this.searchKeyData, index, this.searchKeyData[index]);
              }
            });
          }
        }
      );
      // const h = this.$createElement
      // this.$confirm(mgs, '提示', {
      //       confirmButtonText: '确定',
      //       message: h('div',[h('p',mgs),h('p', { class: 'questionClass' },'非实时更新，请稍后刷新页面重试')]),
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       del("/api/unifiedSearch/deleteSearch",{ id: datas, status:num }).then(res => {
      //           if(res.code == 200){
      //             this.$notify({
      //               title: '成功',
      //               message: '操作成功',
      //               type: 'success'
      //             });
      //           }else{
      //             this.$notify.error({
      //               title: '错误',
      //               message: res.message
      //             });
      //           }
      //           this.getSearchList('one');
      //       });
      // }).catch(() => {});
    }
  }
};
</script>
<style scoped>
.btnSearch2{
  height: 44px;
  width: 109px;
  font-size: 18px;
}
.btnSearch3{
  height: 32px;
  width: 102px;
  font-size: 14px;
}
/deep/.s-r-listCon li a em {
  color: red;
}
.questionClass {
  color: red;
}
.position-box-search {
  /*position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);*/
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100%;
  /*background-size: cover;*/
}
.advancedSearch {
  margin-left: 20px;
  font-size: 14px;
  padding: 8px 15px;
}
.rightExport {
  float: right;
}
.exportExexc {
  padding: 8px 34px;
}
.searchResultData {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  margin: 10px 0;
  border-radius: 4px;
  padding: 10px 0 10px 19px;
}
.searchResultData .searchResultTit2 {
  margin-bottom: 0;
}
.searchResultData .searchResultTit2 .svg-icon-operW16 {
  opacity: 1;
  vertical-align: top;
  margin-top: 2px;
  margin-right: 4px;
}
.svg-icon-operW20 {
  width: 20px;
  height: 20px;
}
.marginRight {
  margin-right: 300px;
}
</style>
