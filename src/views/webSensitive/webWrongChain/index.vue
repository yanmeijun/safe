<template>
  <div class="app-container">
    <div class="errSentiveInfoBox clearfix marTop10">
      <div
        class="tabListTit clearfix"
        style="border-bottom: 1px solid #E8E8E8;"
      >
        <ul>
          <ul>
            <li v-bind:class="{ active: isActive }" @click="displayWords(1)">
              <a href="javascript:;">死链</a>
            </li>
            <li v-bind:class="{ active: !isActive }" @click="displayWords(2)">
              <a href="javascript:;">外链/暗链</a>
            </li>
          </ul>
        </ul>
      </div>
      <div
        class="searchAllBox otherSearchBox head-container"
        style="margin-top: 16px;"
        v-if="type == 1"
      >
        <div class="clearfix marRt135">
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">时间：</span>
            <el-date-picker
              style="width: 200px;"
              v-model="query.webWrongScanDateBegin"
              :clearable="false"
              @input="handleTimestamp"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator="-"
              size="small"
              class="date-item"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">链接：</span>
            <el-select
              v-model="query.batchDeadLinkType"
              class="filter-item"
              style="width:200px"
              @change="changeUpdate"
            >
              <el-option
                v-for="(item, index) in batchDeadLinkType"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fl linkTipsBox">
            <div class="linkSvgDesc">
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban5"></use>
              </svg>
            </div>
            <div class="monResultstipCon">
              <div class="triangle"></div>
              <p>说明：</p>
              <p>
                疑似死链：在监测点监测时链接无响应（-999）或者多个网站服务器的返回码各不一样，程序判断为疑似死链。
              </p>
              <p>
                确认死链：在监测点监测时，链接打开显示404、链接已删除或是显示无法访问该网站，即返回码为404、403、-991的判断为确认死链。
              </p>
            </div>
          </div>
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">搜索：</span>
            <el-input
              v-model="query.deadUrl"
              placeholder="请输入链接地址查询"
              size="small"
              class="filter-item"
              style="width: 200px;margin-right: 0;"
            />
          </div>
          <div class="fl clearfix wh60">
            <el-row class="fl" v-if="type == 1">
              <el-col>
                <div class="fl clearfix wh60" v-if="this.user.isAdmin">
                  <Mechanism-Select 
                  v-bind:width= "width"
                  @getMechanismChecked="getMechanismChecked"
                  :mechanismSelectUpload= "mechanismSelectUpload"
                  ></Mechanism-Select>
                </div>
                <span class="main-aside-txt fl">站点：</span>
                <el-select
                  v-model="siteArr"
                  @change="changeSite()"
                  multiple
                  collapse-tags
                  class="changSiteInput"
                  style="width:200px"
                >
                  <el-option
                    v-for="(item, index) in siteList"
                    :key="index"
                    :label="item.name"
                    :value="user.isAdmin ? item.siteCode : item.accoutid"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="btnRtSearch">
          <!-- <rrOperation /> -->
          <span>
            <el-button
              v-if="crud.optShow.reset"
              class="filter-item"
              size="small"
              @click="resetQueryData()"
              >重置</el-button
            >
            <el-button
              class="filter-item"
              size="small"
              type="primary"
              @click="toQueryData"
              >查询</el-button
            >
          </span>
        </div>
      </div>

      <!-- 外链/暗链-->
      <div
        class="searchAllBox otherSearchBox head-container"
        style="margin-top: 16px;"
        v-if="type == 2"
      >
        <div class="clearfix marRt135">
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">时间：</span>
            <el-date-picker
              style="width: 200px;"
              :clearable="false"
              @input="handleTimestamp2"
              v-model="query.webWrongDate"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator="-"
              size="small"
              class="date-item"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">链接：</span>
            <el-select
              v-model="query.type"
              class="filter-item"
              @change="changeType"
              style="width:200px"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div
            class="fl clearfix wh90"
            v-if="query.type == 0 || query.type == 1"
          >
            <span class="main-aside-txt fl">问题类型：</span>
            <el-select
              v-model="query.isWrong"
              class="filter-item"
              @change="changeISwrong"
              clearable
              v-if="query.type != 2"
            >
              <el-option
                v-for="(item, index) in isWrongList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <el-row v-if="type == 2">
          <el-col class="clearfix">
            <div class="fl clearfix wh60" v-if="this.user.isAdmin">
              <Mechanism-Select 
              v-bind:width= "width"
              @getMechanismChecked="getMechanismChecked"
              :mechanismSelectUpload= "mechanismSelectUpload"
              ></Mechanism-Select>
            </div>
            <div class="fl clearfix wh60">
              <span class="main-aside-txt fl">站点：</span>
              <el-select
                v-model="siteArr"
                multiple
                collapse-tags
                style="width:200px"
                class="changSiteInput"
              >
                <el-option
                  v-for="(item, index) in siteList"
                  :key="index"
                  :label="item.name"
                  :value="user.isAdmin ? item.siteCode : item.accoutid"
                >
                </el-option>
              </el-select>
            </div>
            <div class="fl clearfix wh90">
              <span class="main-aside-txt fl">问题级别：</span>
              <el-select
                v-model="query.level"
                class="filter-item"
                style="width: 200px;"
                @change="changeUpdate"
              >
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <div class="btnRtSearch">
          <!-- <rrOperation /> -->
          <span>
            <el-button
              v-if="crud.optShow.reset"
              class="filter-item"
              size="small"
              @click="resetQueryData()"
              >重置</el-button
            >
            <el-button
              class="filter-item"
              size="small"
              type="primary"
              @click="toQueryData"
              >查询</el-button
            >
          </span>
        </div>
      </div>
      <div class="clearfix">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px" v-if="type == 1">死链</span>
          <span style="padding-left:5px" v-else>外链/暗链</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            v-if="type == 2"
            @click="updateWrite(crud.selections)"
          >
            批量添加白名单
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            v-if="type == 1"
            @click="toDelete(crud.selections)"
          >
            批量删除
          </button>
          <span style="position: relative;" @click="exportFun()" @click.stop>
            <button class="btnListDefault btnTabBlue flt">导出列表</button>
            <span class="extDown" v-if="allExt">
              <span @click="download('0')">全部数据导出</span>
              <span @click="download('1')">所选数据导出</span>
            </span>
          </span>
        </div>
      </div>

      <el-table
        style="width: 100%;margin-top: 12px;"
        v-show="type == 1"
        ref="table"
        v-loading="crud.loading"
        lazy
        :data="crud.data"
        row-key="id"
        class="tableColumnWh"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="26" align="center" />
        <el-table-column
          :show-overflow-tooltip="true"
          type="index"
          label="序号"
          width="40"
          align="center"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="scanTime"
          label="监测时间"
        />
        <el-table-column :show-overflow-tooltip="true" label="死链地址">
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a :href="scope.row.deadUrl" target="_blank">{{
                scope.row.deadUrl
              }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="title"
          label="链接标题"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          width="80"
          prop="httpCode"
          label="返回码"
        />
        <el-table-column :show-overflow-tooltip="true" label="父页面地址">
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a :href="scope.row.refUrl" target="_blank">{{
                scope.row.refUrl
              }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column width="55" prop="htmlPath" label="快照" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.htmlPath" target="_blank" class="imgStyle">
              <svg class="icon svg-icon-diaOperW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban17"></use>
              </svg>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
          fixed="right"
          class="otherOperTh"
        >
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button title="删除" @click="toDelete(scope.row, 'one')">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 外链暗链-->
      <el-table
        style="width: 100%;margin-top: 12px;"
        v-show="type == 2"
        ref="table"
        v-loading="crud.loading"
        lazy
        :data="crud.data"
        row-key="id"
        class="tableColumnWh"
        :cell-style="cellStyle"
        :row-class-name="getRowClassName"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="26" align="center" />
        <el-table-column type="index" label="序号" width="40" align="center" />
        <el-table-column :show-overflow-tooltip="true" label="外链/暗链地址">
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a :href="scope.row.linkUrl" target="_blank">{{
                scope.row.linkUrl
              }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="130px"
          align="center"
          prop="isWrongConvert"
          label="问题类型"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          width="130px"
          align="center"
          prop="levelConvert"
          label="问题级别"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          label="链接被引用次数"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a href="JavaScript:;" @click="openDiglog(scope.row)">{{
                scope.row.numberOfReferences
              }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="scanTime"
          align="center"
          label="监测时间"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.scanTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
          class="otherOperTh"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.linkAbsCustomer != 1"
              title="添加白名单"
              @click="updateWrite(scope.row, 'one', 1)"
            >
              <svg class="icon svg-icon-listoperW18" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban10"></use>
              </svg>
            </span>
            <span
              v-else
              title="取消白名单"
              @click="updateWrite(scope.row, 'one', 0)"
            >
              <svg class="icon svg-icon-listoperW18" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban9"></use>
              </svg>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />

      <!-- 弹框 -->
      <el-dialog
        title="被引用详情"
        :visible.sync="dialogVisible"
        width="735px"
        class="dialogYyDetails"
      >
        <div class="dialog-yyDetails">
          <div class="yyTit">
            分别被以下页面引用 ，共引用<span>{{ num }}</span
            >次
          </div>
          <table class="tabYyDetails">
            <thead>
              <tr>
                <th width="10%">序号</th>
                <th width="40%">外链/暗链地址</th>
                <th width="40%">被引用父页面地址</th>
                <th width="10%">快照</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in tableData">
                <td>{{ index - 0 + 1 }}</td>
                <td>
                  <a
                    class="ellipsis"
                    :href="data.linkUrl"
                    target="_blank"
                    :title="data.linkUrl"
                    style="color:#0b71de"
                    >{{ data.linkUrl }}</a
                  >
                </td>
                <td>
                  <a
                    :href="data.purl"
                    :title="data.purl"
                    target="_blank"
                    class="ellipsis"
                    style="color:#0b71de"
                    >{{ data.purl }}</a
                  >
                </td>
                <td>
                  <a :href="data.snapShot" target="_blank" class="imgStyle">
                    <svg class="icon svg-icon-diaOperW16" aria-hidden="true">
                      <use xlink:href="#icontubiaozhizuomoban17"></use>
                    </svg>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-pagination
            v-if="total"
            id="total"
            @size-change="handleSizeChange($event)"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40, 50, 100, 150, 200]"
            :page-size="pageSize"
            :current-page.sync="page"
            layout="total, sizes, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import deadLinkCrud from "@/api/webWrongChain/deadLinkCrud";
import reviewHarmfuCrud from "@/api/webWrongChain/reviewHarmfuCrud";
import CRUD, { presenter, header, crud } from "@crud/crud";
import sSearch from "@/views/webSensitive/search";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import { dataHttpGet, dataHttpPost } from "@/api/common";
import { mapGetters } from "vuex";
import { getCurrentMonthFirst } from "@/utils/util";
import MechanismSelect from "@/components/MechanismSelect";
import { getDepts } from "@/api/system/dept";

export default {
  name: "deadChain",
  components: { sSearch, rrOperation, pagination, MechanismSelect },
  cruds() {
    return CRUD({
      title: "死链",
      url: "/api/batchDeadLink",
      newAddRefresh: true,
      crudMethod: { ...deadLinkCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      type: 1,
      height: document.documentElement.clientHeight - 180 + "px;",
      isActive: true,
      typeList: [
        { value: 0, label: "暗链" },
        { value: 1, label: "外链" },
        { value: 2, label: "白名单" }
      ],
      batchDeadLinkType: [
        { value: 0, label: "全部" },
        { value: 1, label: "确认死链" },
        { value: 2, label: "疑似死链" }
      ],
      levelList: [
        { value: '', label: "全部" },
        { value: 2, label: "严重" },
        { value: 3, label: "一般" },
        { value: 4, label: "轻微" }
      ],
      isWrongList: [
        { value: "", label: "全部" },
        { value: 103, label: "商业广告外链" },
        { value: 101, label: "钓鱼网址外链" },
        { value: 102, label: "恶意外链" },
        { value: -1, label: "可疑外链" },
        { value: 111, label: "外链是ip" },
        { value: 114, label: "是色情网址" },
        { value: 115, label: "是赌博网址" },
        { value: 116, label: "其他外链" }
      ],
      problemLevelList: [
        {
          value: "全部",
          label: ""
        },
        {
          value: "1",
          label: "自定义错误字"
        },
        {
          value: "2",
          label: "疑似严重错别字"
        },
        {
          value: "3",
          label: "其他疑似错别字"
        }
      ],
      dialogVisible: false,
      tableData: [], //详情
      page: 0,
      pageSize: 10,
      total: 0,
      siteList: [],
      siteListFlag: [], //选择得id
      num: 0,
      isTrueData: {},
      allExt: false,
      siteArr: [],
      width: '60px',
      mechanismSelectUpload: '0'
    };
  },
  watch: {},
  mounted: function() {
    const that = this;
    (window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    }),
      (this.query.webWrongScanDateBegin = getCurrentMonthFirst());
    this.query.type = this.typeList[1].value;
    this.getUUserAccountData(this.user.deptInfo.deptId);
    if (this.type == 1) {
      this.query.batchDeadLinkType = 0;
    } else {
      this.query.level = '';
    }


    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }

    document.addEventListener("click", this.handleDocumentClick);
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    getMechanismChecked(val){
      this.query.deptId = val
      this.mechanismSelectUpload = String(Math.random());
      this.getUUserAccountData(val)
    },
    //设置指定行、列、具体单元格颜色
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.linkAbsCustomer == 1) {
        return "background:#f5f5f5;color: #979797";
      } else {
        return "";
      }
    },
    handleDocumentClick() {
      this.allExt = false;
    },
    getRowClassName({ row }) {
      if (row.linkAbsCustomer == 1) {
        return "tr-td-disable";
      } else {
        return "";
      }
    },
    changeUpdate() {
      this.$forceUpdate();
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh](crud) {},
    //获取所有网站
    getUUserAccountData(val) {

      if(this.user.isAdmin){
        let url = "/uDatabaseInfo/getAllList";
        let params = {
          deptId: val
        }
        dataHttpGet(url, params).then(res => {
          this.siteArr = [];
          this.siteList = [];
          if (res) {
            this.siteList = res.data || [];
            //this.siteList.
            res.data.forEach((val, key) => {
              //this.siteArr.push(val.accoutid);
              this.siteArr.push(val.siteCode);
            });
          }
          this.query.siteCode = this.siteArr.join(",");
          this.crud.toQuery();
        });
      }else{
        let url = "/UUserAccount/list";
        let params = {
          accountType: "1", //网站 2 新媒体
          userId: this.user.id,
        };
        dataHttpGet(url, params).then(res => {
          this.siteArr = [];
          this.siteList = [];
          if (res) {
            this.siteList = res.data || [];
            //this.siteList.
            res.data.forEach((val, key) => {
              this.siteArr.push(val.accoutid);
            });
          }
          this.query.siteCode = this.siteArr.join(",");
          this.crud.toQuery();
        });
      }
      
    },
    changeSite() {
      this.query.siteCode = this.siteArr.join(",");
    },
    resetQueryData() {
      this.siteArr = [];
      this.crud.resetQuery();
      if(this.user.isAdmin){
        this.query.deptId = this.user.deptInfo.deptId;
        this.mechanismSelectUpload = String(Math.random());
        this.getUUserAccountData(this.user.deptInfo.deptId);
      }
      
    },
    toQueryData() {
      this.crud.toQuery();
    },
    handleTimestamp(e) {
      let _this = this;
      _this.query.webWrongScanDateBegin = e;
      _this.$forceUpdate();
    },
    handleTimestamp2(e) {
      let _this = this;
      _this.query.webWrongDate = e;
      _this.$forceUpdate();
    },
    changeType(val) {
      this.isWrongList = [];
      this.query.isWrong = "";
      this.$forceUpdate();
      if (val == 0) {
        //暗链
        this.isWrongList = [
          { value: "", label: "全部" },
          { value: 103, label: "是商业广告暗链" },
          { value: 101, label: "钓鱼网址暗链" },
          { value: 102, label: "是恶意网址暗链" },
          { value: -1, label: "是可疑网址暗链" },
          { value: 111, label: "暗链是ip" },
          { value: 114, label: "是色情网址" },
          { value: 115, label: "是赌博网址" },
          { value: 116, label: "其他暗链" }
        ];
      } else if (val == 1) {
        //外链
        this.isWrongList = [
          { value: "", label: "全部" },
          { value: 103, label: "商业广告外链" },
          { value: 101, label: "钓鱼网址外链" },
          { value: 102, label: "恶意外链" },
          { value: -1, label: "可疑外链" },
          { value: 111, label: "外链是ip" },
          { value: 114, label: "是色情网址" },
          { value: 115, label: "是赌博网址" },
          { value: 116, label: "其他外链" }
        ];
      } else {
        this.isWrongList = [];
      }
    },
    changeISwrong() {
      this.$forceUpdate();
    },
    //切换死链 暗链外链
    displayWords(val) {
      this.type = val;
      this.isActive = !this.isActive;
      this.crud.data = [];
      this.crud.page.total = 0;
      this.crud.page.page = 0;
      this.crud.page.size = 50;
      this.query.webWrongScanDateBegin = getCurrentMonthFirst();
      if (this.type == 1) {
        this.crud.url = "/api/batchDeadLink";
        this.crud.title = "死链";
        this.query.batchDeadLinkType = 0;
        this.crud.crudMethod = { ...deadLinkCrud };
      } else {
        this.query.webWrongDate = getCurrentMonthFirst();
        this.query.type = this.typeList[1].value;
        this.query.isWrong = this.isWrongList[0].value;
        this.query.siteCodeList = this.siteArr.join(",");
        this.query.level = '';
        this.crud.url = "/api/reviewHarmfulLink";
        this.crud.title = "外链/暗链";
        this.crud.crudMethod = { ...reviewHarmfuCrud };
      }
      if(this.user.isAdmin){
          this.query.deptId = this.user.deptInfo.deptId;
        }
      this.getUUserAccountData(this.user.deptInfo.deptId);
      this.crud.toQuery();
    },
    async openDiglog(data) {
      this.isTrueData = data;
      this.dialogVisible = true;
      this.tableData = [];
      this.total = 0;
      this.num = data.numberOfReferences || 0;
      var page = this.page;
      if (page == 0) {
        page = 1;
      } else {
        page = this.page;
      }
      let params = {
        linkUrl: this.isTrueData.linkUrl,
        page: page - 1,
        size: this.pageSize
      };
      Object.assign(params, this.query);
      reviewHarmfuCrud.getOneList(params).then(res => {
        this.tableData = res.data.list || [];
        this.page = res.data.pageNum + 1 || 0;
        this.total = res.data.total || 0;
      });
    },

    //删除
    toDelete(datas, one) {
      if (one == "one") {
        let obj = {
          ids: datas.id
        };
        this.$confirm(`确认删除当前数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            deadLinkCrud.del(obj).then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "删除成功",
                  type: "success"
                });
                this.crud.toQuery();
              } else {
                this.$notify.error({
                  title: "删除失败"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        if (datas.length == 0) {
          this.$message({
            message: "请选择要操作的数据！",
            type: "warning"
          });
          return;
        }
        let arr = [];
        for (var i = 0; i < datas.length; i++) {
          arr.push(datas[i].id);
        }
        let obj = {
          ids: arr.join(",")
        };
        this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            deadLinkCrud.del(obj).then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "删除成功",
                  type: "success"
                });
                this.crud.toQuery();
              } else {
                this.$notify.error({
                  title: "删除错误"
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    //白名单
    updateWrite(datas, one, type) {
      if (one == "one") {
        let str = "",
          str2 = "";
        if (type == 1) {
          str = "添加";
          str2 = "不在";
        } else {
          str = "取消";
          str2 = "";
        }

        let params = {
          linkAbsCustomer: type,
          linkUrl: datas.linkUrl
        };
        this.$confirm(
          `确认要` + str + `白名单吗？` + str + `后将` + str2 + `监测该链接?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            reviewHarmfuCrud.updateWriteList(params).then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: str + "白名单成功",
                  type: "success"
                });
                this.crud.toQuery();
              } else {
                this.$notify.error({
                  title: str + "白名单失败"
                });
              }
            });
          })
          .catch(() => {});
      } else {
        if (datas.length == 0) {
          this.$message({
            message: "请选择要操作的数据！",
            type: "warning"
          });
          return;
        }
        let list = [];
        for (var i = 0; i < datas.length; i++) {
          list.push(datas[i].linkUrl);
        }
        this.$confirm(`确认要添加白名单吗？添加后将不在监测该链接?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              linkAbsCustomer: 1,
              linkUrl: list.join(",")
            };
            reviewHarmfuCrud.updateWriteList(params).then(res => {
              if (res.code == 200) {
                this.$notify({
                  title: "添加白名单成功",
                  type: "success"
                });
                this.crud.toQuery();
              } else {
                this.$notify.error({
                  title: "添加白名单失败"
                });
              }
            });
          })
          .catch(() => {});
      }
    },
    exportFun() {
      this.allExt = !this.allExt;
    },
    //导出
    download(num) {
      if (num == 1) {
        if (this.crud.selections.length == 0) {
          this.$alert("请选择要导出的数据", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
          return;
        }
        let arr = [];
        if (this.type == 1) {
          for (var i = 0; i < this.crud.selections.length; i++) {
            arr.push(this.crud.selections[i].id);
          }
          this.query.ids = arr.join(",");
        } else {
          for (var i = 0; i < this.crud.selections.length; i++) {
            arr.push(this.crud.selections[i].linkUrl);
          }
          this.query.ids = arr.join(",");
        }
      }
      this.crud.doExport();
      delete this.query.ids;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.openDiglog(this.isTrueData);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.openDiglog(this.isTrueData);
    }
  }
};
</script>
<style scoped>
/deep/ .el-dialog {
  height: 65%;
}
.imgStyle {
  width: 50px;
  height: 30px;
}
.errSentiveInfoBox {
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
}

.main-aside-txt:nth-of-type(n + 2) {
  margin-left: 18px;
}

.el-dialog__body {
  padding: 26px 20px;
}

.el-dialog__header {
  background: #fff;
  margin: 0 35px;
  padding: 13px 0;
  border-bottom: 1px solid #e8e8e8;
}

/* .el-dialog__title {
  opacity: 0.85;
  font-size: 14px;
  color: #000000;
} */

.el-dialog__headerbtn .el-dialog__close {
  color: #000;
  opacity: 0.5;
  font-size: 20px;
  width: 20px;
  height: 20px;
  font-weight: bold;
}
.tr-td-disable a {
  color: #979797;
}
</style>
