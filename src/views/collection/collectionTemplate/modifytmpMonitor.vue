<template>
  <div class="content">
    <!--位置信息 start-->
    <div class="bread-crumbs">
      <div class="bread-crumbs-content">
        <span class="cor-0498e4">模板管理</span>
        <span class="locationgLine">&frasl;</span>
        <span class="cor-0498e4">模板配置</span>
        <span class="locationgLine">&frasl;</span>
        <span class="corBlue">编辑模板</span>
      </div>
    </div>
    <div class="rm-main-box">
      <div class="systemUser">
        <div class="deleteListCon">
          <div class="clearfix publicTitle-ymj">
            <div class="publicTitle-add-ymj flt">
              <i class="icon userLogo tmpTask-ymj"></i>编辑模板
            </div>
            <div class="frt new-close-ymj" @click="deleteAdd()"></div>
          </div>

          <div class="publicTitle"><i class="lineBlue"></i>模板信息</div>
          <div class="sy-publish-dialog-content">
            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: 15px;"
            >
              <dt class="flt rm-search-dt-ymj">站点选择：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <div class="flt" style="position: relative">
                  <!-- <input style="line-height: 24px;border: 1px solid #ddd;width: auto"
                           class="inner-search-inp wdh226"
                           v-model="taskName" id="search_input"
                           @focus="handlewebsiteFocus(true)"
                           @blur="handlewebsiteFocus(false)"
                           type="search" placeholder="">-->
                  <span
                    id="tempName"
                    class="ellipsis"
                    style="width: 316px;height:32px;padding-left: 10px;
                         line-height: 32px;
                         border: 1px solid #d2d2e0;"
                    @click="siteSelect"
                    @click.stop
                  ></span>
                  <i
                    class="icon2 icon-downMenu-symbol frt"
                    style="position: absolute;right: 0px;top: 0px;"
                    @click="siteSelect"
                    @click.stop
                  ></i>
                  <em
                    style="position:absolute;width: auto;color: red;left: 322px;top: 10px;color: red;"
                    >*</em
                  >
                  <div
                    class="downMenuShow"
                    style="width:317px;left: 0;"
                    v-if="siteShow"
                    @click.stop
                  >
                    <!--<input class="rm-advanced-search-inp" type="text" placeholder="" style="width: 246px;" v-model="nameQuery">
                    <ul id="search_ul" class="implementation-select-y">
                      <li
                        v-for="(item,index) in fuzzyQuery" :key="index" @click = "selectCon(item._id,$event)">
                        <a href="javascript:void(0)" style="padding-left: 0;line-height: 22px;">{{item.taskName}}</a>
                      </li>
                    </ul>-->
                    <input
                      ref="keyword"
                      class="rm-advanced-search-inp"
                      autocomplete="off"
                      v-model="taskName"
                      style="width: 289px;"
                      @keyup.38="action($event)"
                      @keyup="action($event)"
                      @keyup.13="action($event)"
                      @keydown="action($event)"
                      type="search"
                      placeholder="请输入网站名称"
                      id="search_input"
                    />
                    <ul
                      id="search_ul"
                      class="implementation-select-y"
                      style="left:1px;width: 97%;z-index:2;display: none"
                    ></ul>
                  </div>
                  <div class="error-tips-box">{{ taskNameTip }}</div>
                </div>
              </dd>
            </dl>

            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: 10px;"
            >
              <dt class="flt rm-search-dt-ymj">网站标识码：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp"
                  type="text"
                  @focus="handleSiteCodeFocus(true)"
                  @blur="handleSiteCodeFocus(false)"
                  placeholder="请输入网站标识码"
                  v-model="siteCodeCon"
                  autocomplete="off"
                />
                <span style="color: red;width:auto;">*</span>
                <div class="error-tips-box">{{ siteCodeTip }}</div>
              </dd>
            </dl>

            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: 20px;"
            >
              <dt class="flt rm-search-dt-ymj">一级栏目：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp"
                  type="text"
                  placeholder="请输入一级栏目"
                  v-model="firstCloumn"
                  autocomplete="off"
                />
              </dd>
            </dl>

            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: 8px;"
            >
              <dt class="flt rm-search-dt-ymj">测试地址：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp"
                  type="text"
                  @focus="handleCodeFocus(true)"
                  @blur="handleCodeFocus(false)"
                  v-model="testPath"
                  autocomplete="off"
                />
                <span style="color: red;width:auto;">*</span>
                <div class="error-tips-box">{{ testUrlTip }}</div>
              </dd>
            </dl>
            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: -2px;"
            >
              <dt class="flt rm-search-dt-ymj">正则表达式：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <textarea
                  name=""
                  id=""
                  cols="30"
                  placeholder="多个正则表达式，请用分号'；'隔开"
                  v-model="regexs"
                  class="regex-wh"
                  rows="10"
                ></textarea>
                <span
                  style="color: red; width: auto; vertical-align: top; margin-left: 5px;"
                  >*</span
                >
                <div class="error-tips-box">{{ regexTip }}</div>
              </dd>
            </dl>
            <dl
              class="rm-advanced-search-dl clearfix publicList"
              style="margin-bottom: 9px;"
            >
              <dt class="flt rm-search-dt-ymj">模板类型：</dt>
              <dd class="type-new-btn-ymj">
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: isCheck }"
                    @click="checkOne('first')"
                  ></i>
                  子链模版
                </div>
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: isCheck2 }"
                    @click="checkOne('second')"
                  ></i>
                  文章模版
                </div>
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: isCheck3 }"
                    @click="checkOne('third')"
                  ></i>
                  两者均处理
                </div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">递归特性：</dt>
              <dd
                class="rm-advanced-search-dd"
                style="padding-left: 9px; margin-top: 8px;"
              >
                <!-- <div class="move_con close" @click="moveX('move')">
                  <div class="move move_open" data-state="off" style="left: 1px;" id="move"></div>
                </div>-->
                <div class="flt" style="margin-right: 82px;">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: depthFirst }"
                    @click="checkOne('depthFirst')"
                  ></i>
                  深度优先
                </div>
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: spanFirst }"
                    @click="checkOne('spanFirst')"
                  ></i>
                  广度优先
                </div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">域名归属：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <textarea
                  v-model="domains"
                  placeholder="多个地址用分号';'隔开"
                  class="domains-wh"
                ></textarea>
                <div class="error-tips-box" v-model="domainsTip">
                  {{ domainsTip }}
                </div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">是否需要渲染：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <div class="move_con close" @click="moveX('move2')">
                  <div
                    class="move move_open"
                    data-state="off"
                    style="left: 1px;"
                    id="move2"
                  ></div>
                </div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">网页超时时间：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp website-new-ymj"
                  type="text"
                  placeholder=""
                  v-model="pageLoadTimeout"
                  autocomplete="off"
                />S
                <div class="error-tips-box">{{ pageLoadTimeoutTip }}</div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">渲染超时时间：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp website-new-ymj"
                  type="text"
                  placeholder=""
                  v-model="implicitlyWait"
                  autocomplete="off"
                />S
                <div class="error-tips-box">{{ implicitlyWaitTip }}</div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">子链抽取规则：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <textarea
                  placeholder=""
                  class="linkScript-wh"
                  v-model="linkScript"
                ></textarea>
                <!-- <div class="error-tips-box">{{linkScriptTip}}</div>-->
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">文章抽取规则：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <textarea
                  placeholder=""
                  v-model="contentScript"
                  class="linkScript-wh"
                ></textarea>
                <!--<div class="error-tips-box">{{testUrlTip}}</div>-->
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">脚本执行超时时间：</dt>
              <dd class="rm-advanced-search-dd" style="padding-left: 14px;">
                <input
                  class="rm-advanced-search-inp website-new-ymj"
                  type="text"
                  placeholder=""
                  v-model="scriptTimeout"
                  @focus="handleScriptTimeoutFocus(true)"
                  @blur="handleScriptTimeoutFocus(false)"
                  autocomplete="off"
                />S
                <div class="error-tips-box" v-if="scriptTimeoutTip">
                  {{ scriptTimeoutTip }}
                </div>
              </dd>
            </dl>

            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">渲染图片：</dt>
              <dd
                class="rm-advanced-search-dd"
                style="padding-left: 9px; margin-top: 8px;"
              >
                <div class="flt" style="margin-right: 82px;">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: image }"
                    @click="checkOne('image')"
                  ></i>
                  渲染
                </div>
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: noImage }"
                    @click="checkOne('noImage')"
                  ></i>
                  不渲染
                </div>
              </dd>
            </dl>
            <dl class="rm-advanced-search-dl clearfix publicList">
              <dt class="flt rm-search-dt-ymj">显式/隐式采集：</dt>
              <dd
                class="rm-advanced-search-dd"
                style="padding-left: 9px; margin-top: 8px;"
              >
                <div class="flt" style="margin-right: 82px;">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: handless }"
                    @click="checkOne('handless')"
                  ></i>
                  显式
                </div>
                <div class="flt">
                  <i
                    class="icon4 check-icon"
                    :class="{ checked: noHandless }"
                    @click="checkOne('noHandless')"
                  ></i>
                  隐式
                </div>
              </dd>
            </dl>
          </div>
        </div>

        <!-- <footer class="dialog-footer">
          <ul class="btn-list" style="float: left;">
            <li class="btn-item" @click="sureBtn">保&nbsp;&nbsp;存</li>
            <li class="btn-item" @click="deleteAdd">取&nbsp;&nbsp;消</li>
          </ul>
        </footer>-->
        <footer class="dialog-footer clearfix">
          <ul class="btn-list btn-list-ymj" style="float: left;">
            <li
              class="btn-item btn-item-acvite-ymj"
              @click="sureBtn()"
              v-if="(authority != 1 && userId == 0) || tmpUserId == userId"
            >
              保存
            </li>
            <li class="btn-item btn-item-default-ymj" @click="deleteAdd()">
              取消
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url("../../../assets/styles/Cmain.css");
@import url("../../../assets/styles/public.css");
.downMenuShow {
  position: absolute;
  top: 33px;
  left: -1px;
  background: #fff;
  width: 256px;
  border-radius: 2px;
  border: 1px solid #ddd;
  padding: 12px 10px;
  z-index: 1;
}
.implementation-select-y {
  max-height: 174px;
  overflow-y: auto;
}
ul.implementation-select-y li {
  line-height: 35px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  padding-left: 15px;
}
</style>
<script>
import { mapGetters } from "vuex";
import {
  searchTaskKey,
  addTmpApi,
  tmpDetailApi,
  modifytmpApi
} from "@/api/getDate";
export default {
  data() {
    return {
      testUrl: "",
      testUrlTip: "",
      isCheck: false,
      isCheck2: false,
      isCheck3: false,
      domains: "",
      domainsTip: "",
      userId: "", //用户id
      render: false, //是否需要渲染
      siteCode: "",
      type: "", //模板类型
      linkScript: "", //链接脚本
      contentScript: "", //详情脚本
      taskName: "",
      taskId: "", //任务id
      taskNameTip: "",
      regexTip: "",
      regexs: "",
      pageLoadTimeout: "", //最长等待时间(网页超时时间),单位s
      implicitlyWait: "", //智能等待时间（渲染超时时间），单位s
      implicitlyWaitTip: "",
      pageLoadTimeoutTip: "",
      testPath: "",
      tmpDetail: "",
      id: "",
      depthFirst: true, //深度优先
      spanFirst: false, //广度优先  false 深度优先 true 广度优先
      asyn: false, //递归特性（采集策略）
      siteShow: false,
      nameQuery: "",
      taskNameList: [],
      limit: "",
      scriptTimeout: "",
      image: false,
      noImage: false,
      handless: false,
      noHandless: false,
      scriptTimeoutTip: "",
      authority: "",
      tmpUserId: "",

      siteCodeTip: "",
      siteCodeCon: "",
      firstCloumnTip: "",
      firstCloumn: ""
    };
  },
  mounted() {
    window.addEventListener("click", this.handleSelectCon);
    // if(this.getUserInfo){
    //   this.userId = JSON.parse(this.getUserInfo).id;
    //   this.authority = JSON.parse(this.getUserInfo).authority;

    // };

    this.userId = this.user.id;
    this.authority = "0";

    this.tmpDetail = this.$route.query.id;
    this.tmpUserId = this.$route.query.tmpUserId;
    this.getTmpDetail();
    this.getAllTaskName();
  },
  computed: {
    ...mapGetters(["user"]),
    /*
     * 匹配输入，生成匹配字段
     */
    fuzzyQuery() {
      var _this = this;
      var Newitems = [];
      if (_this.taskNameList) {
        _this.taskNameList.map(function(item) {
          if (!item.taskName) {
            return;
          }
          if (item.taskName.search(_this.nameQuery) != -1) {
            Newitems.push(item);
          }
        });
        return Newitems;
      }
    }
  },
  methods: {
    /** [function:action]功能：匹配输入，生成匹配字段*/
    action() {
      if (this.taskName.trim() == "") {
        return;
      }
      var ul = document.querySelector("#search_ul");
      let input = document.querySelector("#search_input");
      ul.innerHTML = "";
      var str = input.value;
      var _tmpUl = document.createDocumentFragment(); //创建文档碎片节点
      searchTaskKey(
        encodeURIComponent(this.taskName),
        this.userId,
        this.limit,
        this.authority
      )
        .then(res => {
          res = JSON.parse(res.response);
          if (res.message == "success") {
            ul.innerHTML = "";
            if (res.data.length == 0) {
              return;
            }
            for (var j = 0; j < res.data.length; j++) {
              var li = document.createElement("li");
              var text = document.createTextNode(
                res.data[j].taskName + "--" + res.data[j].userId
              ); //创建包含文本text的文本节点
              li.setAttribute("main-id", res.data[j]._id);
              li.appendChild(text);
              _tmpUl.appendChild(li);

              ul.appendChild(li);
              var uli = ul.getElementsByTagName("li");

              for (var i = 0; i < uli.length; i++) {
                var _this = this;
                uli[i].onclick = function() {
                  input.value = this.innerHTML;
                  //_this.taskName = this.innerHTML;
                  _this.taskId = this.getAttribute("main-id"); //任务id
                  document.getElementById(
                    "tempName"
                  ).innerHTML = this.innerHTML;
                  document
                    .getElementById("tempName")
                    .setAttribute("main-id", this.getAttribute("main-id"));
                  input.setAttribute("main-id", _this.taskId);
                  _this.siteShow = false;
                  ul.innerHTML = "";
                };
              }
              document.getElementById("search_ul").style.display = "block";
            }
          } else {
            alert("数据加载失败");
          }
        })
        .catch(e => console.log("Oops, error", e));
    },
    siteSelect() {
      this.siteShow =
        this.siteShow == false
          ? (this.siteShow = true)
          : (this.siteShow = false);
    },
    getAllTaskName() {
      searchTaskKey(
        encodeURIComponent(this.taskName),
        this.userId,
        this.limit,
        this.authority
      )
        .then(res => {
          res = JSON.parse(res.response);
          if (res.message == "success") {
            if (res.data.length == 0) {
              return;
            }
            this.taskNameList = res.data;
          } else {
            alert("数据加载失败");
          }
        })
        .catch(e => console.log("Oops, error", e));
    },
    selectCon(taskId, e) {
      this.taskName = e.target.innerText;
      this.siteShow = false;
      this.taskId = taskId;
      this.taskNameTip = "";
    },
    checkOne(mgs) {
      switch (mgs) {
        case "first":
          this.isCheck = true;
          this.isCheck2 = false;
          this.isCheck3 = false;
          this.type = 0;
          break;
        case "second":
          this.isCheck = false;
          this.isCheck2 = true;
          this.isCheck3 = false;
          this.type = 1;
          break;
        case "third":
          this.isCheck = false;
          this.isCheck2 = false;
          this.isCheck3 = true;
          this.type = 2;
          break;
        case "depthFirst": //false 深度优先
          this.asyn = false;
          this.spanFirst = false;
          this.depthFirst = true;
          break;
        case "spanFirst": //true 广度优先
          this.asyn = true;
          this.spanFirst = true;
          this.depthFirst = false;
          break;
        case "handless":
          this.handless = true;
          this.noHandless = false;
          break;
        case "noHandless":
          this.handless = false;
          this.noHandless = true;
          break;
        case "image":
          this.image = true;
          this.noImage = false;
          break;
        case "noImage":
          this.image = false;
          this.noImage = true;
          break;
      }
    },
    moveX(elem) {
      //用户状态设置     if(elem == "move"){
      var moveState; //获取兄弟元素
      elem == "move"
        ? (moveState = document.getElementById("move"))
        : (moveState = document.getElementById("move2"));
      if (moveState.getAttribute("data-state") == "on") {
        if (elem == "move") {
          this.asyn = false;
        }
        if (elem == "move2") {
          this.render = false;
        }
        moveState.style.left = "2px";
        moveState.style.transition = "left .2s";
        moveState.setAttribute("data-state", "off");
        moveState.parentNode.style.background = "#aaa";
      } else {
        if (elem == "move") {
          this.asyn = true;
        }
        if (elem == "move2") {
          this.render = true;
        }
        moveState.style.left = "14px";
        moveState.style.transition = "left .2s";
        moveState.setAttribute("data-state", "on");
        moveState.parentNode.style.background = "#0281fe";
      }
    },
    handleCodeFocus(flag) {
      if (flag) {
        this.testUrlTip = "";
      } else {
        this.testUrlTip = "测试URL地址不能为空";
        let myreg = /^(http:\/\/|https:\/\/)/;
        if (this.testPath) {
          if (!myreg.test(this.testPath)) {
            this.testUrlTip = "测试URL地址不正确";
            return;
          } else {
            this.testUrlTip = "";
          }
        }
      }
    },
    handleSiteCodeFocus(flag) {
      if (flag) {
        this.siteCodeTip = "";
      } else {
        this.siteCodeTip = "网站标识码不能为空";
        if (this.siteCodeCon) {
          this.siteCodeTip = "";
        }
      }
    },
    handleFirstCloumnFocus(flag) {
      if (flag) {
        this.firstCloumnTip = "";
      } else {
        this.firstCloumnTip = "一级栏目不能为空";
        if (this.firstCloumn) {
          this.firstCloumnTip = "";
        }
      }
    },
    sureBtn() {
      if (!this.taskName) {
        this.taskNameTip = "站点不能为空";
        return;
      } else {
        this.taskNameTip = "";
      }
      if (!document.getElementById("tempName").getAttribute("main-id")) {
        this.taskNameTip = "站点不能为空";
        return;
      } else {
        this.taskNameTip = "";
      }
      this.handleCodeFocus(false);
      if (!this.regexs) {
        this.regexTip = "正则表达式不能为空";
        return;
      } else {
        this.regexTip = "";
      }
      if (this.regexs instanceof Array) {
      } else {
        if (this.regexs.indexOf(";") > 0) {
          this.regexs = this.regexs.split(";");
        } else {
          let target = [];
          target.push(this.regexs);
          this.regexs = target;
        }
      }

      if (this.implicitlyWait) {
        if (!/(^[1-9]\d*$)/.test(this.implicitlyWait)) {
          this.implicitlyWaitTip = "输入的不是正整数";
        } else {
          this.implicitlyWaitTip = "";
        }
      } else {
        this.implicitlyWaitTip = "";
      }
      if (this.pageLoadTimeout) {
        if (!/(^[1-9]\d*$)/.test(this.pageLoadTimeout)) {
          this.pageLoadTimeoutTip = "输入的不是正整数";
        } else {
          this.pageLoadTimeoutTip = "";
        }
      } else {
        this.pageLoadTimeoutTip = "";
      }

      if (this.domains instanceof Array) {
      } else {
        if (this.domains.indexOf(";") > 0) {
          this.domains = this.domains.split(";");
        } else {
          let targetData = [];
          targetData.push(this.domains);
          this.domains = targetData;
        }
      }

      if (this.siteCodeTip) {
        return;
      }
      /*addTmpApi(this.userId,this.taskId,this.regexs,this.testPath,this.type,this.linkScript,this.contentScript,this.implicitlyWait,this.pageLoadTimeout,this.asyn,this.render,this.domains).then((res)=>{
          var res = JSON.parse(res.response)
          if(res.message == "success"){
            this.$router.push({
              path: 'tmpMonitor',
              name: 'tmpMonitor',
            })
          }else{
            alert("添加失败")
          }
        }).catch(e => console.log("Oops, error", e))*/
      this.taskId =
        document.getElementById("tempName").getAttribute("main-id") ||
        this.taskId;
      var params = {
        id: this.id,
        taskId: this.taskId,
        regexs: this.regexs,
        testPath: this.testPath,
        type: this.type,
        linkScript: this.linkScript,
        contentScript: this.contentScript,
        implicitlyWait: this.implicitlyWait,
        pageLoadTimeout: this.pageLoadTimeout,
        asyn: this.asyn,
        render: this.render,
        domains: this.domains,
        userId: this.userId,
        scriptTimeout: Number(this.scriptTimeout),
        image: this.image,
        handless: this.handless,
        userId: this.tmpUserId,
        firstCloumn: this.firstCloumn,
        siteCode: this.siteCodeCon
      };
      modifytmpApi(JSON.stringify(params))
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.message == "success") {
            this.$router.push({
              path: "/collection/collectionTemplate"
            });
          } else {
            alert(res.message);
          }
        })
        .catch(e => console.log("请求异常"));

      //        axios.put("/template",params)
      //          .then(res => {
      //            if(res.data.message == "success"){
      //              this.$router.push({
      //                path: '/home/tmpMonitor'
      //              })
      //            }else{
      //              alert(res.data.message)
      //            }
      //          }, err => {
      //            (err)
      //          })
    },
    deleteAdd() {
      this.$router.push({
        path: "/collection/collectionTemplate"
      });
    },

    /*模板详情接口*/
    getTmpDetail() {
      tmpDetailApi(this.tmpDetail)
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.message == "success") {
            this.testPath = res.data.testPath;
            this.id = res.data.id;
            this.type = res.data.type;
            if (this.type == 0) {
              this.isCheck = true;
              this.isCheck2 = false;
              this.isCheck3 = false;
            } else if (this.type == 1) {
              this.isCheck = false;
              this.isCheck2 = true;
              this.isCheck3 = false;
            } else if (this.type == 2) {
              this.isCheck = false;
              this.isCheck2 = false;
              this.isCheck3 = true;
            }
            var urlStr = "";
            res.data.domains.forEach(function(val, index) {
              urlStr += val + ";";
            });
            this.domains = urlStr.substring(0, urlStr.length - 1);

            if (res.data.image) {
              this.noImage = false;
              this.image = true;
            } else {
              this.noImage = true;
              this.image = false;
            }
            if (res.data.handless) {
              this.handless = true;
              this.noHandless = false;
            } else {
              this.handless = false;
              this.noHandless = true;
            }
            this.scriptTimeout = res.data.scriptTimeout;

            this.asyn = res.data.asyn;
            if (res.data.asyn) {
              /*tagetAsyn.style.left='14px';
              tagetAsyn.parentNode.style.background="#0281fe"*/
              this.spanFirst = true;
              this.depthFirst = false;
            } else {
              /*tagetAsyn.style.left='2px';
              tagetAsyn.parentNode.style.background="#aaa";*/
              this.spanFirst = false;
              this.depthFirst = true;
            }

            var regexsStr = "";
            res.data.regexs.forEach(function(val, index) {
              regexsStr += val + ";";
            });
            this.regexs = regexsStr.substring(0, regexsStr.length - 1);

            this.render = res.data.render;
            var moveState = document.getElementById("move2");
            if (res.data.render) {
              moveState.style.left = "14px";
              moveState.parentNode.style.background = "#0281fe";
            } else {
              moveState.style.left = "2px";
              moveState.parentNode.style.background = "#aaa";
            }

            this.pageLoadTimeout = res.data.pageLoadTimeout;
            this.implicitlyWait = res.data.implicitlyWait;
            this.linkScript = res.data.linkScript;
            this.contentScript = res.data.contentScript;

            this.siteCodeCon = res.data.siteCode;
            this.firstCloumn = res.data.firstCloumn;

            this.taskId = res.data.taskId;
            document
              .getElementById("tempName")
              .setAttribute("main-id", res.data.taskId);
            this.taskName = res.data.taskName + "--" + res.data.userId;
            document.getElementById("tempName").innerHTML = this.taskName;
            var input = document.querySelector("#search_input");
            input.setAttribute("main-id", this.taskId);
          } else {
            alert("获取数据失败");
          }
        })
        .catch(e => console.log("请求异常"));

      /*searchTaskKey(this.taskName,this.userId,this.limit).then((resp) => {
          var resp = JSON.parse(resp.response)
          console.log(resp)
          var _this = this;
          if (resp.message == "success") {
            resp.data.forEach(function(val,index){
              if(val._id == _this.taskId){
                _this.taskName = val.taskName;
              }
            })
          } else {
            alert("数据加载失败")
          }
        }).catch(e => console.log("Oops, error", e));*/
    },
    handleSelectCon() {
      this.siteShow = false;
    },
    handleScriptTimeoutFocus(flag) {
      if (flag) {
      } else {
        if (this.scriptTimeout) {
          if (!/(^-?[1-9]\d*$)/.test(this.scriptTimeout)) {
            this.scriptTimeoutTip = "输入的不是正整数";
            return false;
          } else {
            if (this.scriptTimeout <= -1) {
              this.scriptTimeoutTip = "输入的不能小于0";
            } else if (this.scriptTimeout > 50) {
              this.scriptTimeoutTip = "脚本执行超时时间1-50s";
            } else {
              this.scriptTimeoutTip = "";
            }
          }
        } else {
          //this.monitorTimeTip = "请输入采集频率";
        }
      }
    }
  },
  watch: {
    /*isShowAddPage:{
        handler(){
          this.saveText = "保  存";
          this.startText =  "保存并启用";
          this.isShowStart = false;
        }
      }*/
  }
};
</script>
