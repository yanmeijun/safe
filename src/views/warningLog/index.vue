<template>
  <div class="app-container">
    <div class="head-container errSentiveInfoBox clearfix">
      <div class="errSensitiveNum clearfix">
        <div class="errSenPic">
          <svg class="icon svg-icon-errSenWord" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban11" />
          </svg>
        </div>
        <div class="errSenListBox">
          <div class="errSenTit">
            共
            <!-- <span>{{ sensitiveCount }}</span>个疑似错敏字 -->
            <span>{{ sensitiveCount }}</span>条预警日志
          </div>
          <div class="errSenList clearfix">
            <ul>
              <li>
                <b class="bgBlue"></b>
                <span>
                  确定不连通：
                  <strong>{{ definitely }}</strong>条
                </span>
              </li>
              <li>
                <b class="bgRed"></b>
                <span>
                  疑似不连通：
                  <strong>{{ suspected }}</strong>条
                </span>
              </li>
              <li>
                <b class="bgYellow"></b>
                <span>
                  网站错敏数据：
                  <strong>{{ pageSensitive }}</strong>条
                </span>
              </li>
              <li>
                <b class="bgGreen"></b>
                <span>
                  新媒体错敏数据：
                  <strong>{{ mediaSensitive }}</strong>条
                </span>
              </li>
              <li>
                <b class="bgPurple"></b>
                <span>
                  外链/暗链：
                  <strong>{{ reviewHarmfulLink }}</strong>条
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- echart图 -->
      <!-- <div class="errSensitiveChart" id="errSensitiveChart"  >
      </div>-->
      <i-echart class="errSensitiveChart" style="height:156px;" :option="optionPie"></i-echart>
    </div>
    <!--工具栏-->
    <div class="head-container searchTabBox">
      <div class="searchAllBox otherSearchBox">
        <div class="clearfix marRt135">
          <div class="fl clearfix wh90" v-if="this.user.isAdmin">
              <Mechanism-Select 
              v-bind:width= "width"
              :mechanismSelectUpload="mechanismSelectUpload"
              @getMechanismChecked="getMechanismChecked"
              ></Mechanism-Select>
            </div>
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl whLabel60">时间：</span>
            <el-date-picker
              v-model="timeFormat"
              @input="handleTimestamp"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="false"
              type="daterange"
              range-separator="-"
              size="small"
              class="date-item"
              style="margin-right: 3px;font-size:12px;"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">渠道：</span>
            <el-select v-model="placeVal" class="filter-item">
              <el-option
                v-for="(item, index) in place"
                :key="index"
                :label="item.name"
                :value="item.value"
                @click.change.native="changePlaceVal"
              ></el-option>
            </el-select>
          </div>

          <div class="fl clearfix wh60" v-show="placeVal==2">
            <span class="main-aside-txt fl">邮箱：</span>
            <el-input
              v-model="email"
              placeholder="请输入邮箱地址"
              size="small"
              class="filter-item"
              style="width: 200px;margin-right: 0;"
            />
          </div>
          <div class="fl clearfix wh60" v-show="placeVal==1">
            <span class="main-aside-txt fl">手机号：</span>
            <el-input
              v-model="phone"
              placeholder="请输入手机号码"
              size="small"
              class="filter-item"
              style="width: 200px;margin-right: 0;"
            />
          </div>
          <div class="fl clearfix" style="padding-left:18px">
            <span class="main-aside-txt fl">预警类型：</span>
            <el-select v-model="query.warnType" class="filter-item">
              <el-option
                v-for="(item, index) in warningType"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="btnRtSearch">
          <!-- <rrOperation /> v-if="crud.optShow.reset"-->
          <span>
            <el-button class="filter-item" size="small" @click="resetQueryData()">重置</el-button>
            <el-button class="filter-item" size="small" type="primary" @click="toQueryData">查询</el-button>
          </span>
        </div>
      </div>
      <!--公用列表操作按钮-->
      <!-- <div class="tabListFilter clearfix">
        <div class="btnTabListBox frt clearfix">
          <span style="position: relative;" @click="exportFun()" @click.stop>
            <button class="btnListDefault btnTabBlue flt">导出列表</button>
          </span>
        </div>
      </div>-->
    </div>

    <!--表格渲染-->
    <div class="tabListPadBG">
      <!-- groupByUrl -->

      <el-table
        ref="table"
        v-loading="crud.loading"
        key="table"
        :data="crud.data"
        class="tableColumnWh"
        style="width: 100%;"
        
      >
        <el-table-column :show-overflow-tooltip="true" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <div>{{ (crud.page.page - 1) * crud.page.size + (scope.$index + 1) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道" width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.type =='sms'?'短信':'邮箱'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="接收账号" width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.email?scope.row.email:scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预警类型" width="100" align="center">
          <template slot-scope="scope">
            <span>{{getWarningTypeText(scope.row.warnType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预警内容" width="280" align="left">
          <template slot-scope="scope">
            <span>{{getWarningTypeContent(scope.row.content)}}</span>
          </template>
        </el-table-column>

        
        <el-table-column label="所属机构" v-if="this.user.isAdmin" width="150" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.deptName}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="机构ID" v-if="this.user.isAdmin" width="90" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.deptId}}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="异常原因" width="180" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.exceptionDetail?scope.row.exceptionDetail:'无'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="详情" width="180" align="left">
          <template slot-scope="scope">
            <span
              :class="{'detailLink':scope.row.content.includes('table')}"
              @click="showTable(scope.row.content)"
            >{{scope.row.content.includes('table')?'点击查看':'无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详情链接" width="180" align="left">
          <template slot-scope="scope">
            <span
              :class="{detailLink:getWarningTypeLink(scope.row.content)!='无'}"
              @click="jumpUrl(getWarningTypeLink(scope.row.content))"
            >{{getWarningTypeLink(scope.row.content)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预警时间" width="180" align="center">
          <template slot-scope="scope">
            <span>{{parseTime(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功失败" width="180" align="center">
          <template slot-scope="scope">
            <span>{{(scope.row.status=='1'?'成功':'失败')}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页组件-->
    <pagination />

    <el-dialog title="预警详情" :visible.sync="dialogVisible" width="60%">
      <div v-html="tableHtml" v-show="tableHtml"></div>
      <!-- <iframe class="detailLinkBox" :src="dlink" frameborder="0" v-show="!tableHtml"></iframe> -->
    </el-dialog>
  </div>
</template>

<script>
//import { isvalidPhone } from '@/utils/validate'

import { uWarnSendLog } from "@/api/warningLog";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import request from "@/utils/request";

import echarts from "echarts"; //图标
import iEchart from "@/views/webSensitive/errorSensitiveInfo/echart";
import MechanismSelect from "@/components/MechanismSelect";

const defaultForm = {
  id: null,
  siteCode: null,
  scanTime: null,
  wrongTerm: null,
  correctType: null,
  problemDesc: null,
  imgUrl: null,
  url: null,
  expectTerms: null
};

export default {
  name: "User",
  components: { rrOperation, udOperation, pagination, iEchart, MechanismSelect },
  cruds() {
    return CRUD({
      title: "",
      url: "/uWarnSendLog/list",
      newAddRefresh: true,
      query: {
        warnType: ""
      },
      sort: ["createTime,desc"],
      // crudMethod: { ...sensitiveWordCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  // dicts: ["user_status"],
  // dicts: ["warn"],
  data() {
    // 自定义验证
    return {
      dlink: "",
      height: document.documentElement.clientHeight - 180 + "px;",
      level: 3,
      roles: [],
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" },
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"]
      },
      //渠道
      place: [
        { value: "1", label: "1", name: "短信" },
        { value: "2", label: "2", name: "邮箱" }
      ],
      placeVal: "",
      timeFormat: [],
      email: "",
      phone: "",
      // 预警类型
      warningType: [
        { value: "", label: "", name: "全部" },
        { value: "1", label: "1", name: "确定不连通" },
        { value: "2", label: "2", name: "疑似不连通" },
        { value: "3", label: "3", name: "网站错敏数据" },
        { value: "4", label: "4", name: "外链/暗链" },
        { value: "5", label: "5", name: "新媒体错敏数据" }
      ],
      siteList: [],
      dialogVisible: false,
      tableHtml: "",
      //echart
      optionPie: {},
      isActive: true,
      definitely: "",
      suspected: "",
      pageSensitive: "",
      mediaSensitive: "",
      sensitiveCount: "",
      reviewHarmfulLink: "",
      statisticsList: {
        email: "",
        endTime: "",
        page: 0,
        phone: "",
        size: 0,
        startTime: "",
        warnType: ""
      },
      flageSelect: true,
      ids: "",
      groupByUrl: true,
      position: 0,
      rowSpanArr: [],
      isCheckedAll: false,
      errData: [],
      operationTypeShow: false,
      mediaTypeNewShow: false,
      mediaTypeShow: false,
      width: '90px',
      mechanismSelectUpload: '0'
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  updated() {},
  beforeCreadted() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };

    this.query.deptId = this.user.deptInfo.deptId;

    // 获取字典中的warningType
    this.getWarningType();

    // 获取图表部分数据
    this.sensitiveNum();
    document.addEventListener("click", this.handleDocumentClick);
    this.crud.toQuery();
  },
  methods: {
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
    },
    // 获取字典中的warningType
    getWarningType() {
      request({
        url: "api/dictDetail",
        method: "get",
        params: {
          dictName: "warn",
          label: "warnType"
        }
      }).then(res => {
        let warn_dic = JSON.parse(res.content[0].value);
        let warn_arr = [{ value: "", label: "", name: "全部" }];
        for (let key in warn_dic) {
          warn_arr.push({
            value: key,
            label: key,
            name: warn_dic[key]
          });
        }
        this.warningType = warn_arr;
      });
    },
    // 获取预警类型
    getWarningTypeText(type) {
      for (let i = 0; i < this.warningType.length; i++) {
        if (this.warningType[i].value == type) {
          return this.warningType[i].name;
        }
      }
    },
    jumpUrl(url) {
      if(url == '无'){
        return false
      }else{
        window.open(url, "_blank");
      }
      // this.tableHtml = "";
      // this.dlink = url;
      // this.dialogVisible = true;
    },
    showTable(tableHtml) {
      this.tableHtml = tableHtml;
      this.dialogVisible = true;
    },
    // 获取预警内容
    getWarningTypeContent(content) {
      if (content.indexOf("<table") > -1) {
        return "";
        // 表格形式
      } else if (content.indexOf("http") > -1) {
        // 链接形式
        let strReturn = content.slice(0, content.indexOf("，点击链接"));
        return strReturn;
      } else {
        // 展示文字
        return content;
      }
    },
    // 获取预警链接
    getWarningTypeLink(content) {
      if (content.includes("http") && !content.includes("<table")) {
        return content.slice(content.indexOf("http"), content.length);
      } else {
        return "无";
      }
    },
    resetQueryData() {
      this.query.email = "";
      this.email = "";
      this.query.phone = "";
      this.phone = "";
      this.placeVal = "";
      this.timeFormat = "";
      this.query.startTime = "";
      this.query.endTime = "";

      //this.crud.resetQuery();
      const defaultQuery = JSON.parse(JSON.stringify(this.crud.defaultQuery));
      const query = this.crud.query;
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key];
      });
      if(this.user.isAdmin){
        this.query.deptId = this.user.deptInfo.deptId;
        this.mechanismSelectUpload = String(Math.random());
      }
      this.crud.toQuery();
      this.sensitiveNum();
    },
    toQueryData() {
      this.query.email = this.email;
      this.query.phone = this.phone;
      this.crud.toQuery();
      this.sensitiveNum();
    },
    handleTimestamp(e) {
      // let _this = this;
      // _this.query.timeFormat = e;
      this.query.startTime = e[0];
      this.query.endTime = e[1];
      this.$forceUpdate();
    },
    [CRUD.HOOK.afterAddError](crud) {
      //this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    [CRUD.HOOK.afterEditError](crud) {
      //this.afterErrorMethod(crud)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      //form.enabled = form.enabled.toString()
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      sensitieFindById({ id: form.id, tableType: 0 }).then(res => {
        if (res.code == 200) {
          form = res.data;
        } else {
          this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
        }
      });
    },

    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.id) {
        this.$message({
          message: "id不能为空",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    //自定义错敏信息个数
    async sensitiveNum() {
      this.statisticsList = this.query;

      await uWarnSendLog({deptId: this.query.deptId}).then(res => {
        if (res.code == 200) {
          this.definitely = res.data.definitely;
          this.suspected = res.data.suspected;
          this.pageSensitive = res.data.pageSensitive;
          this.reviewHarmfulLink = res.data.reviewHarmfulLink;
          this.mediaSensitive = res.data.mediaSensitive;
        }
        this.sensitiveCount =
          Number(this.definitely) +
          Number(this.suspected) +
          Number(this.mediaSensitive) +
          Number(this.pageSensitive) +
          Number(this.reviewHarmfulLink);
        this.optionPie = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ["#689FFE", "#FF777C", "#FCA327", "#67C23A", "purple"],
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              radius: ["40%", "60%"],
              minAngle: 5,
              avoidLabelOverlap: true,
              labelLine: {
                normal: {
                  lineStyle: {
                    color: "#DBDBDB"
                  },
                  smooth: 0.2
                }
              },
              itemStyle: {
                borderWidth: 2, //边框的宽度
                borderColor: "#fff" //边框的颜色
              },
              data: [
                {
                  value: this.definitely,
                  name: "确定不连通",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}条 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                      },
                      value: {
                        fontSize: 12
                      }
                    }
                  }
                },
                {
                  value: this.suspected,
                  name: "疑似不连通",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}条 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                      },
                      value: {
                        fontSize: 12
                      }
                    }
                  }
                },
                 {
                  value: this.pageSensitive,
                  name: "网站错敏数据",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}条 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                      },
                      value: {
                        fontSize: 12
                      }
                    }
                  }
                },
                {
                  value: this.mediaSensitive,
                  name: "新媒体错敏数据",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}条 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                      },
                      value: {
                        fontSize: 12
                      }
                    }
                  }
                },
                {
                  value: this.reviewHarmfulLink,
                  name: "外链/暗链",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}条 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                      },
                      value: {
                        fontSize: 12
                      }
                    }
                  }
                },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.2)"
                }
              }
            }
          ]
        };
      });
    },
    // 切换渠道
    changePlaceVal() {
      if (this.placeVal == 1) {
        this.email = "";
      } else {
        this.phone = "";
      }
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },

  }
};
</script>
<style scoped>
.el-table th > .cell {
  padding-left: 10px;
}
.el-select.filter-item.el-select--small {
  width: 200px;
}
.mainTable {
  width: 100%;
  border-collapse: collapse;
  /* border-top: 1px solid #E6E6E6; */
  table-layout: fixed;
  word-wrap: break-word;
}
.mainTable th,
.mainTable td {
  height: 40px;
  border-bottom: 1px solid #f1eff5;
  padding: 0px 10px;
  font-size: 12px;
  font-family: "Microsoft Yahei";
  line-height: 40px;
}
.evenOddBg {
  background: #f8f8f9;
}
.detailLink {
  color: #5791fd;
  cursor: pointer;
}
.detailLinkBox {
  display: block;
  width: 350px;
  overflow: scroll;
  min-height: 400px;
  margin: 0 auto;
}
</style>
