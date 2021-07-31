<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container searchTabBox" style="margin-top: 10px;">
      <div class="searchAllBox otherSearchBox">
        <div class="clearfix marRt135">
          <!-- <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">采集状态：</span>
            <el-select v-model="query.status" class="filter-item" style="width:200px">
              <el-option v-for="(item,index) in collectionStateList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">采集任务：</span>
            <el-select v-model="query.dailyCollection" class="filter-item" style="width:200px">
              <el-option v-for="(item,index) in collectionTaskList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="fl clearfix wh90" v-if="this.user.isAdmin">
            <Mechanism-Select 
            v-bind:width= "width"
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"
            ></Mechanism-Select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">服务状态：</span>
            <el-select
              v-model="query.ifTurnOn"
              class="filter-item"
              style="width:200px"
            >
              <el-option
                v-for="(item, index) in ifTurnOnList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!-- <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">创建时间：</span>
            <el-date-picker
              v-model="query.collectionTime"
              :default-time="['00:00:00','23:59:59']"
              type="daterange"
              range-separator=":"
              size="small"
              class="date-item"
              style="margin-right: 3px;"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div> -->
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">网站名称：</span>
            <el-input
              v-model="query.siteName"
              placeholder="请输入网站名称"
              size="small"
              class="filter-item"
              style="width: 200px;"
            />
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">入口地址：</span>
            <el-input
              v-model="query.newAddentranceUrl"
              placeholder="请输入链接地址"
              size="small"
              class="filter-item"
              style="width: 200px;"
            />
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
      <div class="clearfix" style="margin-bottom: 12px;">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">列表任务</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="startStopFun(crud.selections, 'stop')"
          >
            启用
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="startStopFun(crud.selections, 'start')"
          >
            停用
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toDelete(crud.selections)"
          >
            删除
          </button>
          <button class="btnListDefault btnTabBlue flt" @click="crud.toAdd">
            添加
          </button>
        </div>
      </div>
      <!--表格渲染  @select-all="crud.selectAllChange"   @select="crud.selectChange" -->

      <el-table
        ref="table"
        :key="timer2"
        v-loading="crud.loading"
        :data="crud.data"
        row-key="id"
        @expand-change="zydescription"
        @selection-change="crud.selectionChangeHandler"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
      <!-- @expand-change="zydescription" -->
        <el-table-column
          :selectable="checkboxT"
          type="selection"
          width="55"
          align="center"
        />
        <!-- <el-table-column label="序号" type="index" align="center" width="40">
            <template slot-scope="scope">
              <span>{{(crud.page.page-1)*crud.page.size+(scope.$index + 1)}}</span>
            </template>
        </el-table-column> -->

        <el-table-column width="30" type="expand">
          <template slot-scope="props">
            <table class="mainTable fwcgTable zebra">
              <thead>
                <tr>
                  <th>任务ID</th>
                  <th>采集状态</th>
                  <th>采集任务</th>
                  <th>采集链接数</th>
                  <th>异常数</th>
                  <th style="width: 150px;">开始时间</th>
                  <th style="width: 150px;">结束时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in props.row.childrenExpand"
                  :key="index"
                  v-show="props.row.hasChildren"
                >
                  <td class="center">{{ item.siteCode }}</td>
                  <td class="center">{{ getStatus(item.status) }}</td>
                  <td class="center">
                    {{ item.userId == "1" ? "全站采集" : "日常采集" }}
                  </td>
                  <td class="center">
                    <a
                      style="color:#0281fe;"
                      v-show="item.userId == 1"
                      @click="toLookSituation('linkNorml', item.mongodbId)"
                      >{{ item.linkNorml }}</a
                    >
                    <a
                      style="color:#0281fe;"
                      v-show="item.userId != 1"
                      @click="toLookSituation('linkHist', item.mongodbId)"
                      >{{ item.linkHist }}</a
                    >
                    <!-- <a style="color:#0281fe;" @click="toLookSituation('linkNorml',props.row.id)">{{ item.linkHist }}</a> -->
                  </td>
                  <td class="center">
                    <!-- {{item.linkException}} -->
                    <a
                      style="color:#0281fe;"
                      @click="toLookSituation('eSpiderShow', item.mongodbId)"
                      >{{ item.linkException }}</a
                    >
                  </td>
                  <td>{{ item.startTime }}</td>
                  <td>{{ item.finishTime }}</td>
                  <td class="center">
                    <span
                      style="cursor: pointer;"
                      @click="openDiglog(props.row.id, item.userId)"
                      >历史任务</span
                    >
                  </td>
                </tr>
                <tr v-show="!props.row.hasChildren">
                  <td colspan="8" style="text-align:center">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </template>
        </el-table-column>

        <el-table-column
          label="网站名称"
          prop="siteName"
          type=""
          :show-overflow-tooltip="true"
          min-width="20%"
        >
        </el-table-column>
        <el-table-column
          label="入口地址"
          prop="entranceUrl"
          type=""
          :show-overflow-tooltip="true"
          min-width="50%"
        >
          <template slot-scope="scope">
            <div>
              <a
                :href="scope.row.entranceUrl"
                target="_blank"
                style="color: #0281fe;"
                >{{ scope.row.entranceUrl }}</a
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="服务状态"
          prop="ifTurnOn"
          type=""
          min-width="10%"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ getIfTurnOn(scope.row.ifTurnOn) }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="异常数"  :show-overflow-tooltip="true" align="center" prop="linkException" min-width="7%">
          <template slot-scope="scope" >
            <div v-if="scope.row.userId==1">
              <a style="color:#0281fe;" @click="toLookSituation('eSpiderShow',scope.row.id)">{{ scope.row.linkException}}</a>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column> -->

        <!-- 1全站 2是日常 -->
        <!-- <el-table-column label="有效链接"  :show-overflow-tooltip="true" align="center" prop="linkNorml"  min-width="8%" >
          <template slot-scope="scope" >
            <div v-if="scope.row.userId==1"><a style="color:#0281fe;" @click="toLookSituation('linkNorml',scope.row.id)">{{ scope.row.linkNorml }}</a></div>
            <div v-else><a style="color:#0281fe;" @click="toLookSituation('linkHist',scope.row.id)">{{ scope.row.linkHist }}</a> </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="有效链接"  :show-overflow-tooltip="true"  prop="linkHist" min-width="10%">
          <template slot-scope="scope">
            <div> <a style="color:#0281fe;" @click="toLookSituation('linkHist',scope.row.id)">{{ scope.row.linkHist }}</a> </div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column prop="createTime" label="创建时间" min-width="16%" align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" min-width="16%" align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="finishTime" label="结束时间" min-width="16%" align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.finishTime) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          type=""
          min-width="10%"
        >
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button title="修改" @click="crud.toEdit(scope.row)">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>

              <el-switch
                active-color="#409EFF"
                inactive-color="#E8ECEE"
                v-model="scope.row.ifTurnOn == 1"
                v-if="scope.row.ifTurnOn == 1"
                @change="startStopFun(scope.row, 'start')"
              />
              <el-switch
                active-color="#409EFF"
                inactive-color="#E8ECEE"
                v-else
                @change="startStopFun(scope.row, 'stop')"
              />

              <!-- <span v-if='scope.row.status==1'>
                <button title="修改" @click="crud.toEdit(scope.row)" >
                  <svg class="icon svg-icon-operW16" aria-hidden="true">
                    <use xlink:href="#icontubiaozhizuomoban2"></use>
                  </svg>
                </button>
                <button title="删除" @click='toDelete(scope.row.id)'>
                  <svg class="icon svg-icon-operW16" aria-hidden="true">
                    <use xlink:href="#icontubiaozhizuomoban1"></use>
                  </svg>
                </button>
              </span> -->

              <!-- <span v-if='scope.row.status!=1 && scope.row.status !=2'>
                <button  title="开启" @click='startStopFun(scope.row, "start")' v-if='scope.row.ifTurnOn == 1'>
                  <svg class="icon svg-icon-operW16"  aria-hidden="true" >
                    <use xlink:href="#icontubiaozhizuomoban30"></use>
                  </svg>
                </button>
                <button title="关停" v-if='scope.row.ifTurnOn == 0' @click='startStopFun(scope.row,"stop")'>
                  <svg class="icon svg-icon-operW16" aria-hidden="true">
                    <use xlink:href="#icontubiaozhizuomoban29"></use>
                  </svg>
                </button>
              </span> -->

              <!-- <button title="轨迹追踪">
            		<svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban21"></use>
                </svg>
            	</button>
            	<button title="任务统计">
            		<svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban31"></use>
                </svg>
            	</button>
            	<button title="历史批次查看">
            		<svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban32"></use>
                </svg>
            	</button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>

    <!--扫描链接数 有效链接数 异常数 历史总数 弹框开始-->
    <TotalSituation
      v-bind:totalSituationShow="totalSituationShow"
      v-bind:whichRequest="whichRequest"
      v-bind:totalSituationId="totalSituationId"
      @listenToChildEvent="closeModel"
    ></TotalSituation>
    <!--扫描链接数 有效链接数 异常数 历史总数 弹框结束-->

    <!-- 创建和编辑弹框 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      class="newCollectTask"
      width="940px"
    >
      <el-form ref="form" :model="form" size="small" label-width="140px">
        <el-row class="clearfix" style="padding: 10px 0px;">
          <el-col>
            <span class="linkCon padLeft20">
              <i class="titleTip"></i>
              <span style="padding-left:5px">采集站点</span>
            </span>
          </el-col>
        </el-row>
        <el-form-item label="网站">
          <el-select
            v-model="form.siteCode"
            style="width: 370px;"
            placeholder="请选择要采集的网站"
          >
            <el-option
              v-for="(item, index) in siteList"
              :key="index"
              @click.change.native="changea(item.url, item.label)"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入口地址">
          <el-input
            v-model="form.entranceUrl"
            style="width: 370px;"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-row class="clearfix" style="padding: 10px 0px;">
          <el-col>
            <span class="linkCon padLeft20">
              <i class="titleTip"></i>
              <span style="padding-left:5px">采集任务规则配置</span>
              <span style="color: red;"
                >如果需要配置其他域名地址请用；分开，域名地址填写方式：http(s)://后至第一个/中间的部分</span
              >
            </span>
          </el-col>
        </el-row>
        <el-form-item label="域名归属">
          <el-input
            type="textarea"
            class="otherTextarea"
            v-model="form.domains"
            placeholder="多个地址请用 ; 隔开"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="需要排除的域名组">
          <el-input
            type="textarea"
            class="otherTextarea"
            v-model="form.blackDomains"
            placeholder="多个地址请用 ; 隔开"
            :rows="5"
          ></el-input>
        </el-form-item>

        <!-- v-if="isDailyOnce" -->
        <el-form-item label="日常采集频率">
          <el-input-number
            v-model.number="form.dailyFrequency"
            :min="5"
            controls-position="right"
            style="width: 95px;"
          />
          <span class="spanStyle">min</span>
        </el-form-item>
        <!-- v-if="isDailyOnce1" -->
        <el-form-item label="全站采集频率">
          <el-input-number
            v-model.number="form.totalStationFrequency"
            :min="minDate"
            controls-position="right"
            style="width: 95px;"
          />
          <el-select
            v-model="form.unit"
            style="width: 95px;"
            @change="changeDateType"
          >
            <el-option
              v-for="(item, index) in dateList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="spanStyle">/次</span>
        </el-form-item>
        <!-- v-if="isDailyOnce2" -->
        <el-form-item label="是否进行日常采集">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="form.dailyCollection"
            active-color="#409EFF"
            inactive-color="#E8ECEE"
          />
        </el-form-item>
        <!-- v-if="ifEnglishShow" -->
        <el-form-item label="是否是英文网站">
          <el-radio-group v-model="form.ifEnglish" @change="handleIfEnglish">
            <el-radio label="1" key="1">是</el-radio>
            <el-radio label="0" key="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog
      :title="textTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="dialogYyDetails"
    >
      <div class="dialog-yyDetails">
        <table class="tabYyDetails">
          <thead>
            <tr>
              <th width="5%">序号</th>
              <th width="13%">网站名称</th>
              <th width="20%">入口地址</th>
              <th width="20%">执行类型</th>
              <th width="10%">采集状态</th>
              <th width="13%">创建时间</th>
              <th width="13%">开始时间</th>
              <th width="13%">结束时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in tableData" :key="index">
              <td>{{ index - 0 + 1 }}</td>
              <td>
                {{ data.siteName }}
                <!-- <a class="ellipsis" :href="data.linkUrl" target="_blank" :title="data.linkUrl" style="color:#0b71de">{{data.linkUrl}}</a>  -->
              </td>
              <td>
                {{ data.entranceUrl }}
                <!-- <a :href="data.purl" :title="data.purl" target="_blank" class="ellipsis" style="color:#0b71de">{{data.purl}}</a> -->
              </td>
              <td>
                {{ data.type === '1' ? '定时执行' : '手动执行'}}
              </td>
              <td>
                {{ getStatus(data.status) }}
                <!-- <a :href="data.snapShot" target="_blank" class="imgStyle">
            <svg class="icon svg-icon-diaOperW16" aria-hidden="true">
              <use xlink:href="#icontubiaozhizuomoban17"></use>
            </svg>
          </a> -->
              </td>
              <td>{{ parseTime(data.createTime) }}</td>
              <td>{{ parseTime(data.startTime) }}</td>
              <td>{{ parseTime(data.endTime) }}</td>
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
</template>

<script>
import webCrud from "@/api/collction/collctionTask";
import { del } from "@/api/collction/collctionTask";
import {
  startStopApi,
  findByIdApi,
  getOneList
} from "@/api/collction/updateTurnOnApi";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import IconSelect from "@/components/IconSelect";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { getsiteList } from "@/api/sensitiveApi/queryCustom";
import { mapGetters } from "vuex";
import TotalSituation from "./totalSituation"; //扫描链接数 有效链接数 异常数 历史总数 弹框组件
import MechanismSelect from "@/components/MechanismSelect";
const defaultForm = {
  id: null,
  siteCode: "",
  domains: null,
  blackDomains: null,
  dailyFrequency: null,
  totalStationFrequency: null,
  dailyCollection: 1,
  ifEnglish: 0,
  unit: null,
  dailyCollectionBoolean: null,
  entranceUrl: null
};
//newAddCollRefresh:true  /task/list  query:{userId: 15}
export default {
  name: "CollctionTask",
  components: {
    pagination,
    rrOperation,
    TotalSituation,
    Treeselect,
    IconSelect,
    MechanismSelect
  },
  cruds() {
    return CRUD({
      title: "采集任务",
      url: "api/task/getTaskList",
      newAddRefresh: true,
      crudMethod: { ...webCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      depts: [],
      permission: {
        edit: ["admin", "menu:edit"],
        del: ["admin", "menu:del"]
      },
      dateType: "mm",
      uncertains1: 5,
      uncertains2: 1,
      minDate: 7,
      dateList: [{ value: "1", label: "月" }, { value: "2", label: "天" }],
      collectionStateList: [
        { value: "", label: "全部" },
        { value: "1", label: "待采集" },
        { value: "2", label: "采集中" },
        { value: "3", label: "已完成" },
        { value: "4", label: "异常" }
      ],
      collectionTaskList: [
        { value: "", label: "全部" },
        { value: "1", label: "日常采集" },
        { value: "0", label: "全站采集" }
      ],
      ifTurnOnList: [
        { value: "", label: "全部" },
        { value: "1", label: "启用" },
        { value: "0", label: "停用" }
      ],
      siteList: [],
      siteCode: "", //网站
      domains: "",
      dailyCollectionStatus: false,
      ifEnglishShow: true,
      isDailyOnce: true,
      isDailyOnce1: true,
      isDailyOnce2: true,
      totalSituationShow: false, //扫描链接数 有效链接数 异常数 历史总数
      totalSituationId: "",
      whichRequest: "",

      dataList: [],
      expands: [],
      dialogVisible: false,
      tableData: [], //详情
      page: 0,
      pageSize: 10,
      total: 0,
      textTitle: "日常采集历史任务",
      newID: "",
      newUserId: "",
      width: '90px',
      mechanismSelectUpload: '0',
      timer2: ''
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {},
  mounted: function() {
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.siteCode = [];
    this.siteFun("one");
  },
  methods: {
    loadData(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(tree.children);
      }, 100);
    },
    zydescription(data, treeNode) {
      var that = this;
      that.dataList = [];
      that.crud.data.forEach((res,index) => {
        if (data.id == res.id) {
          that.dataList = res.children; 
          Object.assign(that.crud.data[index], { childrenExpand: res.children || res.childrenExpand });
        }
      });
      // that.crud.toQuery();

    },
    onenable() {},
    changeDateType(val) {
      if (val == 1) {
        this.form.totalStationFrequency = 1;
        this.minDate = 1; //月
      } else {
        this.form.totalStationFrequency = 7;
        this.minDate = 7; //天
      }
    },
    resetQueryData() {
      // this.crud.resetQuery();
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
      this.siteFun("one");
    },
    getMechanismChecked(val){
      this.mechanismSelectUpload = String(Math.random());
    },
    toQueryData() {
      this.timer2 = new Date().getTime();
      this.crud.toQuery();
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // this.uncertains1 = 5
      // this.uncertains2 = 1
      // this.minDate = 1
      this.siteFun();
      form.ifEnglish = "0";
      form.dailyCollection = 1;
      form.unit = "2";
      form.totalStationFrequency = '7'
      this.minDate = 7; //天
      this.ifEnglishShow = true;
      this.isDailyOnce = true;
      this.isDailyOnce1 = true;
      this.isDailyOnce2 = true;
    },
    handleIfEnglish() {
      this.$forceUpdate();
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.siteFun();
      findByIdApi({ id: form.id }).then(res => {
        if (res.code == 200) {
          this.ifEnglishShow = false;
          // if(res.data.domains){
          //   res.data.domains.join(';')
          // }
          // if(res.data.blackDomains){
          //   res.data.blackDomains.join(';')
          // }
          form = res.data;
          if (form.blackDomains || form.domains) {
            if (form.blackDomains instanceof Array) {
              form = Object.assign(form, {
                blackDomains: form.blackDomains.join(";")
              });
            }
            if (form.domains instanceof Array) {
              form = Object.assign(form, { domains: form.domains.join(";") });
            }
          } else {
            form = Object.assign(form, { domains: "", blackDomains: "" });
          }

          this.form.domains = form.domains;
          this.form.blackDomains = form.blackDomains;
          this.form.totalStationFrequency = form.totalStationFrequency;
          //  1:月 2:天
          this.form.unit = form.unit;
          console.log(this.form.unit);
          this.form.dailyFrequency = form.dailyFrequency;
          this.form.siteCode = form.siteCode;
          this.form.dailyCollection = form.dailyCollection;
          this.form.ifEnglish = form.ifEnglish;
          if (form.userId == 2) {
            //1 全站 2是日常
            this.isDailyOnce = true;
            this.isDailyOnce1 = false;
          } else {
            this.isDailyOnce = false;
            this.isDailyOnce1 = true;
          }

          this.isDailyOnce2 = false;
        } else {
          this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
        }
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.siteCode) {
        this.$message({
          message: "网站不能为空",
          type: "warning"
        });
        return false;
      } else if (!crud.form.domains) {
        this.$message({
          message: "域名归属不能为空",
          type: "warning"
        });
        return false;
      }

      if (this.isDailyOnce2) {
        if (crud.form.dailyCollection == 1) {
          //是否进行日常采集
          if (!crud.form.dailyFrequency) {
            this.$message({
              message: "日常采集频率不能为空",
              type: "warning"
            });
            return false;
          }
        } else {
          if (!crud.form.dailyFrequency && !crud.form.totalStationFrequency) {
            this.$message({
              message: "日常采集或全站采集频率不能为空",
              type: "warning"
            });
            return false;
          }
        }
      }
      if (crud.form.domains instanceof Array) {
      } else {
        if (crud.form.domains.indexOf(";") > 0) {
          crud.form.domains = crud.form.domains.split(";");
          crud.form.domains = crud.form.domains.filter(function(value) {
            return value && value.trim();
          });
          crud.form.domains = crud.form.domains.join(";");
        } else {
          // let target = [];
          // target.push(crud.form.domains);
          // crud.form.domains = target;
          // crud.form.domains = crud.form.domains.filter(function(value) {return value && value.trim()});
          // crud.form.domains.join(',')
        }
      }

      if (crud.form.blackDomains) {
        if (crud.form.blackDomains instanceof Array) {
        } else {
          if (crud.form.blackDomains.indexOf(";") > 0) {
            crud.form.blackDomains = crud.form.blackDomains.split(";");
            crud.form.blackDomains = crud.form.blackDomains.filter(function(
              value
            ) {
              return value && value.trim();
            });
            crud.form.blackDomains = crud.form.blackDomains.join(";");
          } else {
            // let target = [];
            // target.push(crud.form.blackDomains);
            // crud.form.blackDomains = target;
            // crud.form.blackDomains = crud.form.blackDomains.filter(function(value) {return value && value.trim()});
            // crud.form.blackDomains.join(',');
          }
        }
      }
      if (crud.form.totalStationFrequency) {
        crud.form.totalStationNum = 1;
      } else {
        crud.form.totalStationNum = "";
      }

      if (this.minDate == 7) {
        this.unit = 2;
      } else {
        this.unit = 1;
      }

      //this.query.entranceUrl = ''
      return true;
    },
    siteFun(mgs) {
      this.query.siteCodes = "";
      getsiteList({ userId: this.user.id, accountType: "1" }).then(res => {
        this.siteList = [];
        var newSiteCodes = [];
        if (res.code == 200) {
          res.data.forEach((val, key) => {
            //this.query.account.push(val.accoutid);
            newSiteCodes.push(val.accoutid);
            this.siteList.push({
              value: val.accoutid,
              label: val.name,
              url: val.url
            });
            if (this.form.siteCode) {
              this.query.entranceUrl = val.url;
            }
          });
          if (mgs == "one") {
            this.query.siteCodes = newSiteCodes.join(",");
            this.crud.toQuery();
          }
        } else {
          this.siteList = [];
        }
      });
    },
    //siteCodes
    changea(url, name) {
      //this.query.entranceUrl = url;
      var domain = url.split("/");
      if (domain[2]) {
        domain = domain[2] + ";";
      } else {
        domain = "";
      }
      Object.assign(this.crud.form, {
        entranceUrl: url,
        siteName: name,
        domains: domain
      });

      console.log(this.crud.form);
    },
    async openDiglog(id, userId) {
      this.dialogVisible = true;
      this.tableData = [];
      this.total = 0;
      this.newID = id;
      this.newUserId = userId;
      var page = this.page;
      if (page == 0) {
        page = 1;
      } else {
        page = this.page;
      }
      if (userId == 1) {
        this.textTitle = "全站历史任务";
      } else {
        this.textTitle = "日常采集历史任务";
      }
      let params = {
        id: id,
        page: page - 1,
        size: this.pageSize,
        userid: userId
      };
      getOneList(params).then(res => {
        this.tableData = res.data.list || [];
        this.page = res.data.pageNum + 1 || 0;
        this.total = res.data.total || 0;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.openDiglog(this.newID, this.newUserId);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.openDiglog(this.newID, this.newUserId);
    },
    //删除
    toDelete(datas) {
      let ids = [],
        completeOrAbnormal = [];
      if (datas instanceof Array) {
        if (datas.length == 0) {
          this.$confirm(`请选择要删除的数据！`, "提示", {
            confirmButtonText: "确定",
            type: "warning"
          }).then(() => {
            this.crud.delAllLoading = true;
          });
        } else {
          datas.forEach((val, ind) => {
            if (val.status == 3 || val.status == 4) {
              completeOrAbnormal.push(val.status);
            }
          });

          if (completeOrAbnormal.length > 0) {
            this.$confirm("所选的数据不支持删除！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            }).then(() => {
              this.crud.delAllLoading = true;
            });
            return;
          }

          this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.crud.delAllLoading = true;
              datas.forEach((val, index) => {
                ids.push(val.id);
              });

              del({ idList: ids.join(",") }).then(res => {
                if (res.code == 200) {
                  this.crud.notify("删除成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
                } else {
                  this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
                }
                this.crud.toQuery();
              });
            })
            .catch(() => {});
        }
      } else {
        this.$confirm(`确认要删除吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            ids = datas;
            del({ idList: ids }).then(res => {
              if (res.code == 200) {
                this.crud.notify("删除成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              } else {
                this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
              }
              this.crud.toQuery();
            });
          })
          .catch(() => {});
      }
    },
    startStopFun(datas, elem) {
      let title = "",
        ifTurnOn = "",
        stopData = [],
        startData = [],
        waitCollected = [];

      //1-打开 0-关停   任务状态 1-初始化 2-进行中 3-完成 4-异常
      if (elem == "stop") {
        //启用
        ifTurnOn = 1;
        if (datas instanceof Array) {
          if (datas.length == 0) {
            this.$confirm("请选择要启用的数据！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "0";
              });
            return;
          } else {
            title = "确定要启用所选的数据吗？";
          }

          datas.forEach((val, ind) => {
            if (val.ifTurnOn == 1) {
              // 0 停用 1 启用
              stopData.push(val.ifTurnOn);
            }
            if (val.status == 1) {
              waitCollected.push(val.status);
            }
          });

          if (waitCollected.length > 0) {
            this.$confirm("待采集任务不支持手动启用任务！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "0";
              });
            return;
          }

          if (stopData.length > 0) {
            this.$confirm("所选任务有正在启用的，不支持重复启用！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "0";
              });
            return;
          }
        } else {
          title = "确定要启用吗？";
          if (datas.ifTurnOn == 1) {
            this.$confirm("请选择要启用的数据！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "0";
              });
            return;
          }
        }
      } else {
        ifTurnOn = 0;
        if (datas instanceof Array) {
          if (datas.length == 0) {
            this.$confirm("请选择要停用的数据！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "1";
              });
            return;
          } else {
            title = "确定要停用所选的数据吗?";
          }

          datas.forEach((val, ind) => {
            if (val.ifTurnOn == 0) {
              // 0 停用 1 启用
              startData.push(val.ifTurnOn);
            }
            if (val.status == 1) {
              waitCollected.push(val.status);
            }
          });

          if (waitCollected.length > 0) {
            this.$confirm("待采集任务不支持手动停用任务！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "1";
              });
            return;
          }

          if (startData.length > 0) {
            this.$confirm("所选任务有已停用的，不支持重复停用！", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "1";
              });
            return;
          }
        } else {
          title = "确定要停用吗？";
          if (datas.ifTurnOn == 0) {
            this.$confirm("请选择要停用的数据", "提示", {
              confirmButtonText: "确定",
              type: "warning"
            })
              .then(() => {
                this.crud.delAllLoading = true;
              })
              .catch(() => {
                datas.ifTurnOn = "1";
              });
            return;
          }
        }
      }

      let ids = [];
      if (datas instanceof Array) {
        if (datas.length == 0) {
          this.$confirm(title, "提示", {
            confirmButtonText: "确定",
            type: "warning"
          }).then(() => {
            this.crud.delAllLoading = true;
          });
        } else {
          this.$confirm(title, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.crud.delAllLoading = true;
              datas.forEach((val, index) => {
                ids.push(val.id);
              });
              //ifTurnOn
              startStopApi({ idList: ids.join(","), ifTurnOn: ifTurnOn })
                .then(res => {
                  if (res.code == 200) {
                    this.crud.notify(
                      "操作成功",
                      CRUD.NOTIFICATION_TYPE.SUCCESS
                    );
                  } else {
                    this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
                  }
                  this.crud.toQuery();
                })
                .catch(() => {});
            })
            .catch(() => {
              if (ifTurnOn == 1) {
                datas.ifTurnOn = 0;
              } else {
                datas.ifTurnOn = 1;
              }
            });
        }
      } else {
        this.$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            ids = datas.id;
            startStopApi({ idList: ids, ifTurnOn: ifTurnOn }).then(res => {
              if (res.code == 200) {
                this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              } else {
                this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
              }
              this.crud.toQuery();
            });
          })
          .catch(() => {
            if (ifTurnOn == 1) {
              datas.ifTurnOn = 0;
            } else {
              datas.ifTurnOn = 1;
            }
          });
      }
    },
    checkboxT(row, rowIndex) {
      if (row.status == 2) {
        return false;
      } else {
        return true;
      }
    },
    getStatus(val) {
      // 1 已添加 ，5 待采集 ，2.采集中 3 已完成 4 异常
      if (val == 1) {
        return "已添加";
      } else if (val == 2) {
        return "采集中";
      } else if (val == 3) {
        return "已完成";
      } else if (val == 4) {
        return "异常";
      } else if (val == 5) {
        return "待采集";
      } else if (val == 6) {
        return "未执行";
      }
    },
    getIfTurnOn(val) {
      if (val == "1") {
        return "启用";
      } else if (val == "0") {
        return "停用";
      } else {
        return "--";
      }
    },

    toLookSituation(mgs, taskId) {
      this.totalSituationId = taskId;
      console.log(taskId);
      switch (mgs) {
        case "linkSum":
          this.whichRequest = "linkSum";
          break;
        case "linkNorml":
          this.whichRequest = "linkNorml";
          break;
        case "eSpiderShow":
          this.whichRequest = "eSpiderShow";
          break;
        case "linkHist":
          this.whichRequest = "linkHist";
          break;
      }
      this.totalSituationShow = true; //弹框开关
    },
    closeModel() {
      this.totalSituationShow = false;
    }
  }
};
</script>
<style scoped>
/deep/ .el-dialog {
  height: 76%;
}
.dialog-footer {
  padding: 10px 0;
}

/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
/deep/ .vue-treeselect__control,
/deep/ .vue-treeselect__placeholder,
/deep/ .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
