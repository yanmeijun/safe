<template>
  <div class="templateManage" v-if="totalSituationShow">
    <div class="dialog-container add-catalog-dialog">
      <div
        class="dialog-inner dialog-modifyMail"
        style="height: 600px !important;width: 880px;margin-top:-300px !important;margin-left: -440px;"
      >
        <header class="dialog-header">
          <div class="dialog-header-tit flt dialog-header-tit-ymj clearfix">
            <i class="detleClose-ymj ceshi-new-ymj"></i
            ><span class="deleteUser-ymj">{{
              whichRequestList[whichRequest]
            }}</span>
          </div>
          <div class="icon3 dialog-header-close frt" @click="cancel()"></div>
        </header>
        <div
          class="dialog-body"
          ref="viewBox"
          style="margin-bottom: 10px;max-height: 511px;overflow-y: scroll;"
        >
          <div
            class="sy-publish-dialog-content"
            style="padding-left: 30px;padding-right: 30px;"
          >
            <a
              href="javascript:;"
              title="补发消息"
              v-if="whichRequest == 'httpCode'"
              style="margin-right: 15px;width: 65px;margin-bottom: 10px;"
              @click="oneClickReissue()"
              class="rl-operate-btn active frt btnSearch btnSearch-ymj"
            >
              一键补发</a
            >
            <table
              class="mainTable fwcgTable zebra numberMainTable"
              style="margin-top: 26px;"
            >
              <thead>
                <tr>
                  <th style="width: 20%;">标题</th>
                  <th style="width: 50%;">链接地址</th>
                  <th style="width: 11%;">状态码</th>
                  <th style="width: 15%;">网页类型</th>
                  <!-- <th style="width: 13%;">当前深度</th>
                       <th style="width: 16%;">
                        操作
                      </th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in linkSumList" :key="index">
                  <td class="ellipsis" :title="item.anchor ? item.anchor : ''">
                    {{ item.anchor ? item.anchor : "" }}
                  </td>
                  <td class="lineHeight-ellipsis">
                    <a
                      target="_blank"
                      :href="item.url"
                      style="cursor: pointer"
                      :title="item.url"
                      >{{ item.url }}</a
                    >
                  </td>
                  <td style="text-align: center;">{{ item.httpCode }}</td>
                  <td style="text-align: center;">
                    <span v-if="item.linkType == 1">首页</span>
                    <span v-if="item.linkType == 2">栏目</span>
                    <span v-if="item.linkType == 3">文章</span>
                    <span v-if="item.linkType == 4">未知</span>
                  </td>
                  <!-- <td>{{item.depth}}</td> -->
                  <!-- <td>

                          <a href="javascript:;" title="补发消息"
                             style="margin-left: 0;width: 65px;"
                             @click="replacement(item._id)"
                             class="rl-operate-btn active flt btnSearch btnSearch-ymj">
                            补发消息</a>
                        </td> -->
                </tr>
                <tr>
                  <td colspan="4">
                    <div
                      class="moreOnload"
                      v-if="
                        linkSumNext != null &&
                          linkSumNext &&
                          linkSumList.length >= 10
                      "
                    >
                      <!--<span class="shrinkCuro pull_down">-->
                      <!--<img class="shrink" src="../../assets/img/cloudCollection/shrink2.png" alt="">更多-->
                      <!--</span>-->
                    </div>
                    <div
                      v-else
                      style="line-height: 60px;font-size:16px;"
                      class="moreOnload"
                    >
                      <span v-if="linkSumList.length == 0">暂无数据</span>
                      <span v-else>已加载全部</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="maskookDetailShow" style="margin-left: -430px;" v-if="dailShow">
      <img
        src="../../../assets/img/loader.gif"
        style="width: 45px;height: 43px;"
      />
    </div>

    <div class="mask"></div>
  </div>
</template>
<script>
import { linkRequestApi, reSendMsgApi, oneReissue } from "@/api/getDate";
export default {
  name: "container",
  props: ["totalSituationShow", "totalSituationId", "whichRequest", "groupKey"],
  data() {
    return {
      limit: 10,
      lastId: "",
      whichRequestList: {
        linkSum: "扫描链接数 ",
        linkNorml: "有效链接数",
        eSpiderShow: "异常数",
        linkHist: "历史总数",
        refer: "父页面",
        domain: "域名",
        depth: "深度",
        linkType: "链接类型",
        httpCode: "请求状态码"
      },
      requestUrl: {
        linkSum: "/link/linkSum-list",
        linkNorml: "/link/linkNormal-list",
        eSpiderShow: "/link/linkException-list",
        linkHist: "/link/linkHistory-list",
        refer: "/link/group-list",
        domain: "/link/group-list",
        depth: "/link/group-list",
        linkType: "/link/group-list",
        httpCode: "/link/group-list",
        renderType: "/link/group-list"
      },
      linkSumList: [],
      dailShow: false,
      linkSumNext: "",
      isCanScroll: true
    };
  },
  mounted() {
    this.linkSumList = [];
    this.linkSumNext = "";
    this.lastId = "";
    console.log(this.totalSituationId);
    console.log(this.groupKey);
  },
  computed: {},
  components: {},
  created() {},
  methods: {
    cancel() {
      this.$emit("listenToChildEvent", false);
    },
    async initData() {
      this.dailShow = true;
      linkRequestApi(
        this.totalSituationId,
        this.lastId,
        this.limit,
        this.requestUrl[this.whichRequest],
        this.whichRequest,
        encodeURIComponent(this.groupKey)
      )
        .then(res => {
          var res = JSON.parse(res.response);
          this.dailShow = false;
          if (res.code == "1") {
            this.linkSumNext = res.data.lastId;
            if (this.linkSumList.length > 0) {
              var _this = this;
              res.data.records.forEach(function(item, index) {
                _this.linkSumList.push(item);
              });
            } else {
              this.linkSumList = res.data.records;
            }
            if (res.data.lastId) {
              this.isCanScroll = true;
            } else {
              this.isCanScroll = false;
            }
          } else {
            alert(res.message);
          }
        })
        .catch(e => console.log("Oops, error", e));
    },
    async handleScroll() {
      if (
        this.$refs.viewBox.scrollTop + this.$refs.viewBox.offsetHeight >=
        this.$refs.viewBox.scrollHeight - 20
      ) {
        if (this.isCanScroll) {
          this.isCanScroll = false;
          if (!this.linkSumNext) {
            return;
          }
          this.lastId = this.linkSumNext;
          await this.initData();
        }
      }
    },
    replacement(id) {
      reSendMsgApi(id)
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.code == "1") {
            alert("补发消息成功");
          } else {
            alert(res.message);
          }
        })
        .catch(e => console.log("Oops, error", e));
    },

    oneClickReissue() {
      //任务唯一标识    taskId   字符串类型
      //http状态码       httpCode  数字类型
      let params = {
        taskId: this.totalSituationId,
        httpCode: this.groupKey
      };
      oneReissue(JSON.stringify(params))
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.code == "1") {
            alert("一键补发消息成功");
          } else {
            alert(res.message);
          }
        })
        .catch(e => console.log("Oops, error", e));
    }
  },
  watch: {
    totalSituationShow: {
      async handler(val) {
        if (val) {
          this.linkSumList = [];
          this.linkSumNext = "";
          this.lastId = "";
          await this.initData();
          //首先通过$refs获取dom元素
          let box = this.$refs.viewBox;
          //监听这个dom的scroll事件
          box.addEventListener("scroll", await this.handleScroll);
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
@import url("../../../assets/styles/Cmain.css");
@import url("../../../assets/styles/public.css");
@import url("../../../assets/styles/dialog.css");
</style>
