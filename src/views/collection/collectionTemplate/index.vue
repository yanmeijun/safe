<br /><template>
  <div>
    <div class="content">
      <div class="rm-main-box" style="margin-top: 10px;border-radius: 4px;">
        <div class="rl-main-aside clearfix system-manager-ymj">
          <div class="flt user-logo">
            <i class="icon-cj userLogo tmpTask-ymj"></i>模板列表
          </div>
          <a
            href="javascript:;"
            v-if="authority != 1"
            style="margin-left: 0;padding: 0 16px"
            title="新增"
            class="rl-operate-btn active frt operate-ymj"
            @click="addTmp"
          >
            <!-- <i class="icon2 icon-addUser"></i> -->
            新增</a
          >
        </div>
        <div class="rl-main-aside clearfix search-operate-ymj searchAllBox">
          <div class="clearfix">
            <div class="fl clearfix" v-if="this.user.isAdmin">
                <span class="downMenuTit fl" style="width: 99px;text-align: right;">机构：</span>
                <!-- multiple -->
                <el-select
                  v-model="deptId"
                  @change="getMechanismChecked"
                  class="filter-item siteElSelect frt"
                  style="width:200px;margin-right: 15px;"
                >
                  <el-option
                    v-for="(item, index) in mechanismList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>  
            </div>
            <div class="flt clearfix whStyle">
              <label class="downMenuTit fl">测试URl地址：</label>
              <div class="resource-sort-search-box frt" style="height: 32px;">
                <input
                  class="inner-search-inp wdh226"
                  type="search"
                  placeholder="请输入测试URl地址"
                  v-model="testPath"
                  ref="keyword"
                />
              </div>
            </div>
            <!--2.模板列表接口，增加查询条件，模板类型，任务id和时间段查询-->
            <div class="flt clearfix whStyle">
              <label class="downMenuTit pusTime-y flt textLeft"
                >网站名称：</label
              >
              <div class="flt" style="position: relative;height:32px;">
                <!-- <input style="line-height: 24px;border: 1px solid #ddd;width: auto"
                             class="inner-search-inp wdh226"
                             v-model="taskName" id="search_input"
                             @focus="handlewebsiteFocus(true)"
                             @blur="handlewebsiteFocus(false)"
                             type="search" placeholder="">-->
                <span
                  id="tempName"
                  class="ellipsis"
                  style="width: 200px;height:32px;padding-left: 10px;display:inline-block;
                                 line-height: 32px;color: #c2c3c4;
                                 border: 1px solid #d2d2e0;border-radius: 4px;"
                  @click="siteSelect"
                  @click.stop
                  >{{ tempName }}</span
                >
                <i
                  class="icon2 icon-downMenu-symbol frt"
                  style="position: absolute;right: 0px;top: 1px;"
                  @click="siteSelect"
                  @click.stop
                ></i>
                <div
                  class="downMenuShow"
                  v-if="tempShow"
                  @click.stop
                  style="left: 0px;width: 100%;top: 33px; padding-left: 0;padding-right: 0;"
                >
                  <input
                    class="rm-advanced-search-inp"
                    type="text"
                    placeholder=""
                    id="search_input"
                    style="width: 182px;margin-left: 8px;"
                    @keyup.38="action($event)"
                    @keyup="action($event)"
                    @keyup.13="action($event)"
                    @keydown="action($event)"
                    v-model="taskName"
                  />
                  <ul
                    id="search_ul"
                    class="implementation-select-y"
                    style="max-height: 174px;overflow-y: auto;display: none"
                  ></ul>

                  <!--<ul id="search_ul" class="implementation-select-y" style="max-height: 174px;overflow-y: auto;">
                        <li style="padding-left: 8px;"
                          v-for="(item,index) in fuzzyQuery" :key="index" @click = "selectCon(item._id,$event)">
                          <a href="javascript:void(0)" style="padding-left: 0;line-height: 22px;">{{item.taskName}}</a>
                        </li>
                      </ul>-->
                </div>
              </div>
            </div>
            <div class="flt clearfix whStyle">
              <label class="downMenuTit flt state-user-new-ymj left-juli-y"
                >模板类型：</label
              >
              <div class="downMenu flt clearfix">
                <div
                  class="select-box result_select flt resource-sort-ymj"
                  @click="statusList2($event, 'task')"
                  @click.stop
                >
                  <span class="defaul_option">{{ taskResourceText }}</span>
                  <i
                    class="icon2 icon-downMenu-symbol frt"
                    style="margin-right: -9px;"
                  ></i>
                  <ul
                    @click="chooseStatus2($event, 'task')"
                    @click.stop
                    v-if="taskStateShow"
                  >
                    <li value="3">全部</li>
                    <li value="0">子链模板</li>
                    <li value="1">文章模板</li>
                    <li value="2">子链和文章模板</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flt whStyle">
              <label class="downMenuTit fl">网站标识码：</label>
              <div
                class="resource-sort-search-box fl"
                style="height: 32px;width: 200px;"
              >
                <input
                  class="inner-search-inp wdh226"
                  type="search"
                  placeholder="请输入网站标识码"
                  v-model="siteCode"
                />
              </div>
            </div>

            <div class="flt clearfix whStyle">
              <label class="downMenuTit pusTime-y pusTime-ym flt">时间：</label>
              <el-date-picker
                v-model="startTime"
                style="width: 118px;height:26px;"
                type="date"
                placeholder="开始时间"
              >
              </el-date-picker>
              <label class="downMenuTit">&nbsp;--</label>
              <el-date-picker
                v-model="endTime"
                type="date"
                style="width: 118px;height:26px;"
                placeholder="结束时间"
              >
              </el-date-picker>
            </div>
            <div class="flt clearfix whStyle">
              <label class="downMenuTit fl">目标链接：</label>
              <div
                class="resource-sort-search-box fl"
                style="height: 32px;width: 200px;"
              >
                <input
                  class="inner-search-inp wdh226"
                  type="search"
                  placeholder="请输入目标链接"
                  v-model="url"
                />
              </div>
            </div>

            <div class="flt clearfix whStyle">
              <label class="downMenuTit fl">域名：</label>
              <div
                class="resource-sort-search-box fl"
                style="height: 32px;width: 200px;"
              >
                <input
                  class="inner-search-inp wdh226"
                  type="search"
                  placeholder="请输入域名"
                  v-model="domainSearch"
                />
              </div>
            </div>
            <div class="flt clearfix whStyle">
              <label class="downMenuTit fl">一级栏目：</label>
              <div
                class="resource-sort-search-box fl"
                style="height: 32px;width: 200px;"
              >
                <input
                  class="inner-search-inp wdh226"
                  type="search"
                  placeholder="请输入一级栏目"
                  v-model="firstCloumnSearch"
                />
              </div>
              <div></div>
            </div>
            <div class="btnRtSearch clearfix">
              <a
                href="javascript:;"
                class="rl-operate-btn  flt"
                style="height: 32px;"
                @click="resetSearch"
                >重置</a
              >
              <a
                href="javascript:;"
                title="查询"
                class="rl-operate-btn active flt btnSearch btnSearch-ymj btnSearch-pusTime-ym"
                @click="searchByKwd('', 'first')"
                >查询</a
              >
            </div>
          </div>
        </div>
        <div class="rm-main-content">
          <div class="keep-open btn-group frt" title="列">
            <!--
            <button type="button" class="btn btn-default btn-outline dropdown-toggle tmpMonitor-dropdown-toggle" @click="dropdown" @click.stop>
              <i class="assembly"></i>
            </button>-->
            <ul
              class="dropdown-menu"
              role="menu"
              @click.stop
              v-if="dropdownMenuShow"
            >
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.numberShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('numberShow')"
                  ></i
                  >序号
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.taskNameShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('taskNameShow')"
                  ></i
                  >网站名称
                </label>
              </li>

              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.taskUserNameShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('taskUserNameShow')"
                  ></i
                  >任务用户名
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.webNameShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('webNameShow')"
                  ></i
                  >测试URl地址
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.titleShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('titleShow')"
                  ></i
                  >正则表达式
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.abstractsShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('abstractsShow')"
                  ></i
                  >模板类型
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.maintainPeople,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('maintainPeople')"
                  ></i
                  >维护人员
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.linksSizeShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('linksSizeShow')"
                  ></i
                  >收益数量
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.createTimeShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('createTimeShow')"
                  ></i
                  >创建时间
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.storageTimeShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('storageTimeShow')"
                  ></i
                  >修改时间
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.siteCodeShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('siteCodeShow')"
                  ></i
                  >网站标识码
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.firstCloumnShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('firstCloumnShow')"
                  ></i
                  >一级栏目
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.isUsefulShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('isUsefulShow')"
                  ></i
                  >模板状态
                </label>
              </li>
              <li>
                <label>
                  <i
                    class="icon3 icon-check checkout-outline-ymj"
                    :class="{
                      checked: tableHead.operationShow,
                      allowed: allowedShow
                    }"
                    @click="checkOnlyOne('operationShow')"
                  ></i
                  >操作
                </label>
              </li>
            </ul>
          </div>
          <table class="mainTable fwcgTable zebra">
            <thead>
              <tr>
                <!--<th class="wh30"><i class="icon4 check-icon" :class="{'checked':isCheck}" @click="checkAll()"></i></th>-->
                <th
                  style="width: 6.5%;padding-right: 0;"
                  v-if="tableHead.numberShow"
                  class="center"
                >
                  序号
                </th>
                <th
                  style="width: 12%;text-align: left;"
                  v-if="tableHead.taskNameShow"
                >
                  网站名称
                </th>
                <th style="width: 15%" v-if="tableHead.taskUserNameShow">
                  任务用户名
                </th>
                <th
                  style="width: 17.9%;text-align: left;"
                  v-if="tableHead.webNameShow"
                >
                  测试URl地址
                </th>
                <th style="width: 22%" v-if="tableHead.titleShow">
                  正则表达式
                </th>
                <th
                  class="center"
                  style="width: 13%"
                  v-if="tableHead.abstractsShow"
                >
                  模板类型
                  <!--<i class="icon4 icon-defalut" :class="monitorFreqClass" @click="monitorFreqSort()"></i>-->
                </th>
                <th style="width: 14%" v-if="tableHead.maintainPeople">
                  维护人员
                </th>
                <th style="width: 14%" v-if="tableHead.linksSizeShow">
                  采集数量
                  <i
                    class="eSpiderIcon"
                    @click="eSpiderClick('linksSize')"
                    :class="{ upDown1: linksSize1, upDown2: linksSize2 }"
                  ></i>
                </th>
                <th style="width: 12.8%" v-if="tableHead.createTimeShow">
                  创建时间
                </th>
                <th style="width: 13.8%" v-if="tableHead.storageTimeShow">
                  修改时间
                  <!--<i class="icon4 icon-defalut" :class="startDateClass" @click="startDateSort()"></i>-->
                </th>
                <th v-if="tableHead.siteCodeShow" style="width:14%">
                  网站标识码
                </th>
                <th v-if="tableHead.firstCloumnShow" style="width:11%">
                  一级栏目
                </th>
                <th v-if="tableHead.isUsefulShow" style="width:11%">
                  模板状态
                </th>
                <th style="width: 14.5%" v-if="tableHead.operationShow">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in tmpMonitorListArr"
                :id="item.templateID"
                :class="{ odd: index % 2 == 0, even: index % 2 != 0 }"
              >
                <!--<td class="wh30"><i class="icon4 check-icon" :class="{'checked':item.isCheck}" @click="checkOne(item.templateID,$event,index)"></i></td>-->
                <td class="center" v-if="tableHead.numberShow">
                  <span class="e3e4f">{{
                    (page - 1) * rows + (index + 1)
                  }}</span>
                </td>
                <td
                  v-if="tableHead.taskNameShow"
                  class="ellipsis"
                  :title="item.taskName"
                >
                  {{ item.taskName }}
                </td>
                <td v-if="tableHead.taskUserNameShow">
                  {{ item.taskUserName }}
                </td>
                <td class="ellipsis" v-if="tableHead.webNameShow">
                  <span class="e3e4f"
                    ><a
                      :href="item.testPath"
                      target="_blank"
                      style="color:#0281fe"
                      :title="item.testPath"
                      >{{ item.testPath }}</a
                    ></span
                  >
                </td>
                <td class="ellipsis" v-if="tableHead.titleShow">
                  <!-- {{item.regexs}}-->
                  <div>
                    <span v-for="(items, indexs) in item.regexs">{{
                      items
                    }}</span>
                  </div>
                </td>
                <td class="center" v-if="tableHead.abstractsShow">
                  <span v-if="item.type == 0">子链模版</span>
                  <span v-if="item.type == 1">文章模版</span>
                  <span v-if="item.type == 2">两者均处理</span>
                </td>
                <td v-if="tableHead.maintainPeople" class="center">
                  {{ item.userName }}
                </td>
                <td v-if="tableHead.linksSizeShow" class="center">
                  {{ item.linksSize }}
                </td>
                <td v-if="tableHead.createTimeShow" class="center">
                  {{ formatter(item.createTime).split(" ")[0] }}
                </td>
                <td v-if="tableHead.storageTimeShow" class="center">
                  {{ formatter(item.updateTime).split(" ")[0] }}
                </td>

                <td v-if="tableHead.siteCodeShow" class="center">
                  {{ item.siteCode }}
                </td>
                <td v-if="tableHead.firstCloumnShow" class="center">
                  {{ item.firstCloumn }}
                </td>
                <td v-if="tableHead.isUsefulShow" class="center">
                  {{ getIsUseful(item) }}
                </td>

                <td class="wh130" v-if="tableHead.operationShow">
                  <div class="rm-main-icon-box">
                    <a
                      class="rm-icon-btn"
                      href="javascript:;"
                      title="编辑"
                      @click="showModifyPage(item.id, item.userId)"
                    >
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban2"></use>
                      </svg>
                    </a>
                    <!--	<a v-if="item.isStart" class="rm-icon-btn" href="javascript:;" title="停用" @click="startOrStop('stop',item.templateID,$event)">
											<i class="icon2 icon-disable"></i>
										</a>
										@click="startOrStop('start',item.templateID,$event)"
										-->
                    <a
                      class="rm-icon-btn"
                      href="javascript:;"
                      title="测试"
                      @click="lookDetail(item.id)"
                    >
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban37"></use>
                      </svg>
                    </a>
                    <a
                      class="rm-icon-btn"
                      href="javascript:;"
                      title="删除"
                      @click="deleteDialog(item.id, false)"
                      v-if="userId == item.userId || userId == 0"
                    >
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban1"></use>
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="page-box clearfix">
            <div class="page-main frt">
              <div class="page-list flt">
                <el-pagination
                  @size-change="rowsChange"
                  class="tmpMonitor-pagination"
                  @current-change="rowsChange"
                  :current-page.sync="page"
                  :page-size="rows"
                  layout="prev, pager, next, jumper"
                  :total="tmpMonitorListCount"
                >
                </el-pagination>
              </div>
              <div class="page-go-box flt">
                <a class="page-btn" href="javascript:;">确定</a>
              </div>
            </div>
            <div class="frt">
              <div class="page-go-box flt">
                <span class="page-txt flt">{{
                  "共" + tmpMonitorListCount + "条"
                }}</span>
                <!--<span class="perPageShow flt" ref="rows" @click="showRowsList()">
                                	{{rows}}
                                	<i class="icon4 icon-downMenu"></i>
                                <ul v-if="rowsListShow" @click="chooseRows($event)" @click.stop>
                                  <li>10</li>
                                  <li>15</li>
                                  <li>20</li>
                              </ul>
                                </span>
								<span class="page-txt flt">条</span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="mask"></div>-->
    <!--操作失败-->
    <div class="failedBox" v-if="submitErr">
      <i class="icon4 icon-failed"></i> {{ submitErrText }}
    </div>
    <!--操作成功-->
    <div class="failedBox successBox" v-if="submitOK">
      <i class="icon4 icon-success"></i> 操作成功
    </div>

    <!-- 删除提示对话框开始 start-->
    <div v-if="deleteDialogbox">
      <div class="dialog-container add-catalog-dialog">
        <div class="dialog-inner dialog-systemDelete">
          <header class="dialog-header">
            <div class="dialog-header-tit flt dialog-header-tit-ymj clearfix">
              <i class="detleClose-ymj"></i
              ><span class="deleteUser-ymj">删除模板</span>
            </div>
            <div
              class="icon3 dialog-header-close frt"
              @click="closeDialogbox()"
            ></div>
          </header>
          <!--<div class="publicTipBox">
						<p>确定要删除这条信息吗？</p>
						&lt;!&ndash;<p v-html="templateName">{{templateName}}</p>&ndash;&gt;
					</div>-->
          <div class="dialog-body">
            <div class="dialog-wordTips">
              确定要删除这条信息吗？
            </div>
          </div>
          <footer class="dialog-footer dialog-footer-ymj">
            <ul class="btn-list">
              <li class="btn-item btn-dialog-ymj" @click="deleteMonitor()">
                确 认
              </li>
              <li class="btn-item delete-dialog-ymj" @click="closeDialogbox()">
                取 消
              </li>
            </ul>
          </footer>
        </div>
      </div>
      <div class="mask"></div>
    </div>

    <!-- 删除提示对话框结束 end-->

    <!-- 添加服务模板对话框 start -->
    <!--<addMonitor v-bind:isShowAddPage="isShowAddPage" @listenToAddChildEvent="closeAddPage()" @listenToAddSuccess="initData()"></addMonitor>-->
    <!-- 添加服务模板对话框 end -->

    <!-- 修改服务模板对话框 start -->
    <!--<modifytmpMonitor v-bind:isShowModifyPage="isShowModifyPage" @listenToModifyChildEvent="closeModifyPage()" v-bind:modifyTmpMonitorID="modifyTmpMonitorID" @listenToModifySuccess="initData()"></modifytmpMonitor>-->
    <!-- 修改服务模板对话框 end -->

    <TmpDetail
      v-bind:lookDetailShow="lookDetailShow"
      v-bind:lookDetailId="lookDetailId"
      @listenToChildEvent="closePage()"
    ></TmpDetail>

    <!--操作成功-->
    <div class="failedBox successBox" v-if="success">
      <i class="icon4 icon-success"></i>
      请绑定邮箱，以便您及时收到预警通知
    </div>
  </div>
</template>
<style scoped>
@import url("../../../assets/styles/Cmain.css");
@import url("../../../assets/styles/public.css");
@import url("../../../assets/styles/dialog.css");
</style>
<script>
import axios from "axios";
/*import addMonitor from '@/views/tmpMonitor/addtmpMonitor';*/
//import modifytmpMonitor from '@/views/tmpMonitor/modifytmpMonitor';
import TmpDetail from "./tmpDetail";
import {
  getTmpApi,
  searchTaskKey,
  deleteTmpApi,
  getUserRoleList
} from "@/api/getDate";
import { format } from "@/utils/util";
import { mapGetters } from "vuex";
import { getDepts } from "@/api/system/dept";
export default {
  name: "login",
  data() {
    return {
      tmpMonitorListArr: [], //首页初始化获取数据列表
      tmpMonitorIDArr: [], //当前页面所有数据的tmpMonitorID集合
      tmpMonitorListCount: 0, //列表数据总条数
      rows: 10, //每页显示几条
      page: 1, //当前页数
      sort: {
        isStart: -1,
        statusCode: -1,
        time: -1
      }, //数据排序
      domain: "", //domain
      userID: "", //domain
      totalPage: 0, //总页数
      statusListShow: false, //查询运行状态点击事件用的flag参数
      chooseStatusType: 5, //查询时运行状态的选择结果，0：全部，1：正常，2：异常
      chooseStatusText: "全部", //查询时运行状态栏的文本展示
      rowsListShow: false, //每页显示几条点击事件用的flag参数
      monitorFreqClass: "icon-defalut", //监控频率排序头部样式
      monitorFreq: 0, //监控频率排序
      startDateClass: "icon-defalut", //生效时间排序头部样式
      time: 0, //生效时间排序
      isShowAddPage: false,
      isShowModifyPage: false,
      modifyTmpMonitorID: "",
      submitErr: false,
      submitOK: false,
      submitErrText: "操作失败",
      isSearch: false,
      deleteDialogbox: false,
      templateName: "",
      templateID: "",
      mailboxBindVisible: false,
      success: false,

      userId: "",
      testPath: "",
      tmpID: "",
      lookDetailShow: false,
      lookDetailId: "",
      dropdownMenuShow: false, //控制表头的关键
      allowedShow: false,
      //表头数据列表*/
      tableHead: {
        numberShow: true,
        webNameShow: true,
        titleShow: false,
        abstractsShow: true,
        createTimeShow: true,
        storageTimeShow: true,
        operationShow: true,
        taskNameShow: true,
        linksSizeShow: true,
        maintainPeople: false,
        siteCodeShow: true,
        firstCloumnShow: true,
        isUsefulShow: true,
        taskUserNameShow: false
      },
      editTable: [],
      startDate: "",
      endDate: "",
      tempName: "请选择网站名称",
      tempShow: false,
      nameQuery: "",
      taskNameList: [],
      taskId: "",
      taskStateShow: false,
      taskResourceText: "全部",
      type: "",
      startTime: "",
      endTime: "",
      limit: "",
      taskName: "",
      // 二次录入变量
      secondTaskResourceText: "全部",
      secondTempName: "请选择网站名称",
      secondTestPath: "",
      secondTaskId: "",
      secondType: "",
      secondStartTime: "",
      secondEndTime: "",
      flag: false,

      selectUserList: [],
      selectUserText: "全部",
      selectUserShow: false,
      queryUserId: "",

      authority: "",

      field: "", //排序字段，linkSum-总链接数排序linkNorml-有效连接数排序 linkException-异常数排序linkHist -历史总数排序 string
      asc: "", //True-升序 false- 降序 boolean
      linksSize1: false,
      linksSize2: false,
      linksSizeFlag: true,

      resetPage: "",
      resetTask: "",
      siteCode: "",
      url: "",

      createTimeSearch: "",
      domainSearch: "",
      firstCloumnSearch: "",
      mechanismList: [],
      deptId:''
    };
  },
  created() {
    if (sessionStorage.getItem("tmpDataSecond")) {
      var secondValue = JSON.parse(sessionStorage.getItem("tmpDataSecond"));
      this.page = Number(secondValue.page); //当前页
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // 设置下一个路由的 meta
  //   if(to.path != "/home/modifytmpMonitor"){
  //     sessionStorage.removeItem('tmpDataSecond')
  //   }
  //   next()
  // },
  mounted() {
    window.addEventListener("click", this.handleSelect);

    this.userId = this.user.id;

    this.authority = "0";

    // if(sessionStorage.getItem("tmpDataSecond")){
    //     var secondValue =  JSON.parse(sessionStorage.getItem("tmpDataSecond"));
    //     this.page = secondValue.page;//当前页
    //     this.userId = secondValue.userId;
    //     this.testPath = secondValue.testPath;
    //     this.taskId = secondValue.taskId;
    //     this.type = secondValue.type;
    //     this.startTime = secondValue.startTime;
    //     this.endTime = secondValue.endTime;
    //     this.taskResourceText = secondValue.taskResourceText;
    //     this.tempName = secondValue.tempName;
    //     this.selectUserText = secondValue.selectUserText;
    //     this.queryUserId = secondValue.queryUserId;
    //  };
    this.flag = false;
    this.deptId = this.user.deptInfo.deptId;
    this.getDepts();

    if (this.authority == 0 && this.userId != 0) {
      this.initData(this.userId);
    } else {
      this.initData(this.queryUserId);
    }

    this.resetPage = "";
    //this.getAllTaskName();
  },
  computed: {
    ...mapGetters(["user"]),
    /*			getCheckedSum() {
				return this.tmpMonitorListArr.filter(item => item.isCheck).length
			},
			isCheck() {
				if(this.tmpMonitorListArr.length) {
					return this.getCheckedSum && this.getCheckedSum === this.tmpMonitorListArr.length;
				} else {
					return false
				}
			},*/
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
  components: {
    //addMonitor,
    //modifytmpMonitor,
    TmpDetail
  },
  methods: {
    getMechanismChecked(val){
      this.deptId = val;
      console.log(this.deptId)
    },
    async getDepts() {
      await getDepts().then(res => {
        this.mechanismList = res.content || [];
      });
    },
    getIsUseful(data) {
      if (data.useful) {
        return data.useful ? "可用" : "停用";
      } else {
        return "--";
      }
    },
    resetSearch() {
      this.testPath = "";
      this.taskResourceText = "全部";
      this.type = "";
      this.startTime = "";
      this.endTime = "";
      this.tempName = "请选择网站名称";

      this.siteCode = "";
      this.url = "";
      this.createTimeSearch = "";

      this.domainSearch = "";
      this.firstCloumnSearch = "";
      document.getElementById("tempName").innerHTML = "请选择网站名称";
      this.taskId = "";
      document.getElementById("tempName").setAttribute("main-id", "");

      this.selectUserText = "全部";
      this.queryUserId = "";

      this.page = 1;
      this.resetPage = 1;
      this.resetTask = true; //重置taskId
      sessionStorage.setItem("tmpDataSecond", "");

      if (this.authority == 0 && this.userId != 0) {
        this.initData(this.userId);
      } else {
        this.initData("");
      }
    },
    formatter(time) {
      let dataee = new Date(time).toJSON();
      var date = new Date(+new Date(dataee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    },
    siteSelect() {
      this.taskName = "";
      this.tempShow = this.tempShow
        ? (this.tempShow = false)
        : (this.tempShow = true);
    },
    getAllTaskName() {
      searchTaskKey("", this.userId, this.limit, this.authority)
        .then(res => {
          res = JSON.parse(res.response);
          if (res.message == "success") {
            if (res.data.length == 0) {
              return;
            }
            this.taskNameList = res.data;
          } else {
            alert(res.message);
          }
        })
        .catch(e => console.log("Oops, error", e));
    },
    action() {
      let ul = document.querySelector("#search_ul");
      let input = document.querySelector("#search_input");
      ul.innerHTML = "";
      document.getElementById("search_ul").style.display = "block";
      if (this.taskName.trim() == "") {
        return;
      }
      var str = input.value;
      var _tmpUl = document.createDocumentFragment(); //创建文档碎片节点
      searchTaskKey(
        encodeURIComponent(this.taskName.trim()),
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
              /*if(res.data[i].taskName.indexOf(this.taskName.trim()) != -1 && this.taskName.trim()!=''){
                var li = document.createElement('li');
                var text = document.createTextNode(res.data[i].taskName.trim()); //创建包含文本text的文本节点
                li.appendChild(text);
                _tmpUl.appendChild(li);
              };*/
              var li = document.createElement("li");
              var text = document.createTextNode(
                res.data[j].taskName.trim() + "--" + res.data[j].userId
              ); //创建包含文本text的文本节点
              li.setAttribute("main-id", res.data[j]._id);
              li.style.paddingLeft = "8px";
              //li.setAttribute("onclick",selectCon(res.data[j]._id,$event));
              li.appendChild(text);
              _tmpUl.appendChild(li);
              ul.appendChild(li);

              var uli = ul.getElementsByTagName("li");
              for (var i = 0; i < uli.length; i++) {
                var _this = this;
                uli[i].onclick = function() {
                  _this.taskName = this.innerHTML;
                  input.value = this.innerHTML;
                  _this.tempName = this.innerHTML;
                  document.getElementById(
                    "tempName"
                  ).innerHTML = this.innerHTML;
                  document
                    .getElementById("tempName")
                    .setAttribute("main-id", this.getAttribute("main-id"));
                  _this.tempShow = false;
                  _this.taskId = this.getAttribute("main-id");
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
    statusList2() {
      this.taskStateShow = this.taskStateShow
        ? (this.taskStateShow = false)
        : (this.taskStateShow = true);
    },
    chooseStatus2(e, mgs) {
      this.type = Number(e.target.value);
      this.taskResourceText = e.target.innerText;
      if (this.type == 3) {
        this.type = "";
      }
      this.taskStateShow = false;
    },
    selectCon(taskId, e) {
      this.tempName = e.target.innerText;
      this.tempShow = false;
      this.taskId = taskId;
    },
    /*时间比较*/
    compare() {
      if (this.startTime || this.endTime) {
        if (new Date(format(this.startTime)) > new Date(format(this.endTime))) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    async activeH() {
      var secondValue = JSON.parse(sessionStorage.getItem("tmpDataSecond"));
      var nodeChilds = document.getElementsByClassName("number");
      for (var i = 0; i < nodeChilds.length; i++) {
        if (nodeChilds[i].classList.contains("active")) {
          nodeChilds[i].classList.remove("active");
        }
        secondValue.page = this.resetPage || secondValue.page;
        if (Number(nodeChilds[i].innerHTML) == secondValue.page) {
          nodeChilds[i].classList.add("active");
        }
      }
      this.page = secondValue.page;
      document.getElementsByClassName(
        "tmpMonitor-pagination"
      )[0].childNodes[3].childNodes[1].childNodes[1].value = this.page;
    },
    async initData(userId) {
      //初始化数据
      this.isSearch = false;
      if (this.resetTask) {
        this.taskId = "";
      } else if (sessionStorage.getItem("tmpDataSecond")) {
        if (this.resetTask) {
          this.taskId = "";
        } else if (
          document.getElementById("tempName").getAttribute("main-id")
        ) {
          this.taskId = document
            .getElementById("tempName")
            .getAttribute("main-id");
        } else {
          this.taskId = JSON.parse(
            sessionStorage.getItem("tmpDataSecond")
          ).taskId;
        }
      } else {
        this.taskId =
          document.getElementById("tempName").getAttribute("main-id") || "";
      }
      // if(this.createTimeSearch){
      //   this.createTimeSearch = format(this.createTimeSearch)+"00:00:00";
      // }else{
      //   this.createTimeSearch = ""
      // }

      await getTmpApi(
        userId,
        this.page,
        this.rows,
        encodeURIComponent(this.testPath.trim()),
        this.taskId,
        this.type,
        this.startTime,
        this.endTime,
        this.field,
        this.asc,
        encodeURIComponent(this.siteCode),
        encodeURIComponent(this.url),
        encodeURIComponent(this.domainSearch),
        encodeURIComponent(this.firstCloumnSearch),
        this.deptId
      )
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.message == "success") {
            this.tmpMonitorListArr = res.data.records;
            this.tmpMonitorListCount = res.data.total;
          } else {
            alert("获取数据失败");
          }
        })
        .catch(e => console.log("Oops, error", e));
      if (!this.flag) {
        if (sessionStorage.getItem("tmpDataSecond")) {
          await this.activeH();
        }
      }
    },
    statusList(e) {
      //查询时，运行状态选择点击事件
      e = e || event;
      e.cancelBubble = true;
      this.statusListShow = this.statusListShow
        ? (this.statusListShow = false)
        : (this.statusListShow = true);
    },
    /*点击其他触发下拉框消失*/
    handleSelect() {
      this.statusListShow = false;
      this.tempShow = false;
      this.taskStateShow = false;
      this.dropdownMenuShow = false;
      this.selectUserShow = false;
    },
    showRowsList() {
      //每页显示几条选择点击事件
      this.rowsListShow
        ? (this.rowsListShow = false)
        : (this.rowsListShow = true);
    },
    chooseRows(e) {
      //每页显示几条选择点击事件
      this.page = 1;
      this.rows = Number(e.target.innerText);
      this.rowsListShow = false;
      this.rowsChange();
    },
    checkAll() {
      //全选
      this.tmpMonitorIDArr = [];
      if (this.isCheck) {
        /*单选按钮的样式*/
        for (let i = 0; i < this.tmpMonitorListArr.length; i++) {
          if (this.tmpMonitorListArr[i].isCheck) {
            this.tmpMonitorListArr[i].isCheck = !this.tmpMonitorListArr[i]
              .isCheck;
          }
        }
      } else {
        this.tmpMonitorListArr.forEach(item => {
          this.tmpMonitorIDArr.push(item.templateID);
        });
        /*单选按钮的样式*/
        for (let i = 0; i < this.tmpMonitorListArr.length; i++) {
          if (!this.tmpMonitorListArr[i].isCheck) {
            this.tmpMonitorListArr[i] = Object.assign(
              {},
              this.tmpMonitorListArr[i],
              {
                isCheck: "true"
              }
            );
            this.$set(this.tmpMonitorListArr, i, this.tmpMonitorListArr[i]);
          }
        }
      }
    },
    checkOne(tmpMonitorID, e, ind) {
      //单选
      var eve = e || window.e; //获取事件对象
      var objEle = eve.target || eve.srcElement; //获取document 对象的引用
      if (!this.tmpMonitorListArr[ind].isCheck) {
        this.tmpMonitorIDArr.push(tmpMonitorID);
        /*单选按钮的样式*/
        this.tmpMonitorListArr[ind] = Object.assign(
          {},
          this.tmpMonitorListArr[ind],
          {
            isCheck: "true"
          }
        );
        this.$set(this.tmpMonitorListArr, ind, this.tmpMonitorListArr[ind]);
      } else {
        for (var i = 0; i < this.tmpMonitorIDArr.length; i++) {
          if (this.tmpMonitorIDArr[i] == tmpMonitorID) {
            this.tmpMonitorIDArr.splice(i, 1);
            break;
          }
        }
        /*单选按钮的样式*/
        this.tmpMonitorListArr[ind] = Object.assign(
          {},
          this.tmpMonitorListArr[ind],
          {
            isCheck: ""
          }
        );
        this.$set(this.tmpMonitorListArr, ind, this.tmpMonitorListArr[ind]);
      }
    },
    startOrStop(action, tmpMonitorID) {
      //批量启用、停止
      if (!tmpMonitorID && this.tmpMonitorIDArr.length == 0) {
        this.submitErrText =
          action == "start" ? "请选择要启用的数据" : "请选择需要停用的数据";
        this.submitErr = true;
        setTimeout(() => {
          this.submitErr = false;
        }, 1500);
        return;
      }
      axios({
        headers: {
          "Content-Type": "application/json"
        },
        method: "post",
        url: "/tmpMonitor/startOrStop",
        async: true,
        data: {
          templateID: tmpMonitorID ? [tmpMonitorID] : this.tmpMonitorIDArr,
          isStart: action == "start" ? true : false
        },
        contentType: "application/json"
      })
        .then(res => {
          if (res.data.code == 200) {
            this.submitOK = true;
            setTimeout(() => {
              this.submitOK = false;
            }, 1500);
            this.initData();
          } else {
            this.submitErr = true;
            setTimeout(() => {
              this.submitErr = false;
            }, 1500);
          }
          //this.isCheck = false;//复选框的样式
          this.tmpMonitorIDArr = [];
        })
        .catch(err => {
          console.log(err);
        });
    },
    //显示删除对话框
    deleteDialog(templateID, templateName) {
      this.tmpID = templateID;
      this.deleteDialogbox = true;

      /*if(!templateID && !templateName) {
					this.templateName = "您确定要删除选中的监控信息吗？";
					this.deleteDialogbox = true;
				} else {
					this.templateName = "您确定要删除<span>" + templateName + "</span>源端监控信息吗？";
					this.deleteDialogbox = true;
					this.templateID = templateID;
				}*/
    },
    //关闭删除对话框
    closeDialogbox() {
      this.deleteDialogbox = false;
    },
    deleteMonitor(tmpMonitorID, templateName, isDelete) {
      //批量启用、停止
      /*if(!tmpMonitorID && this.tmpMonitorIDArr.length == 0) {
					this.submitErrText = "请勾选要删除的数据";
					this.submitErr = true;
					setTimeout(() => {
						this.submitErr = false;
					}, 1500);
					return;
				};*/
      //        axios.delete(`/template/${this.tmpID}`)
      //          .then(res => {
      //            if(res.data.message == "success"){
      //              alert("删除成功");
      //              this.initData();
      //            }else{
      //              alert(res.data.message)
      //            }
      //            this.deleteDialogbox = false;
      //          }, err => {
      //            (err)
      //          })

      deleteTmpApi(this.tmpID)
        .then(res => {
          var res = JSON.parse(res.response);
          if (res.message == "success") {
            alert("删除成功");
            this.initData();
          } else {
            alert(res.message);
          }
          this.deleteDialogbox = false;
        })
        .catch(e => console.log("Oops, error", e));
    },
    checkOnlyOne(mgs) {
      var _this = this;
      _this.allowedShow = false;

      var countTrue = [];
      for (var item in _this.tableHead) {
        if (_this.tableHead[item]) {
          countTrue.push(_this.tableHead[item]);
        }
      }
      if (_this.tableHead[mgs]) {
        if (_this.editTable.length > 0) {
          _this.editTable.forEach(function(val, index) {
            var that = this;
            if (val == mgs) {
              return;
            }
          });
        }
        _this.editTable.push(mgs);
      } else {
        _this.editTable.pop();
      }
      if (countTrue.length == 2) {
        _this.allowedShow = true;
      }
      if (_this.editTable.length > countTrue.length + 3) {
        _this.editTable.pop();
        if (!_this.allowedShow) {
          _this.tableHead[mgs] = !_this.tableHead[mgs];
        }
        return;
      }
      _this.tableHead[mgs] = !_this.tableHead[mgs];
    },
    dropdown() {
      this.dropdownMenuShow = !this.dropdownMenuShow;
    },
    monitorFreqSort() {
      //按监控频率排序
      if (this.monitorFreq == 0) {
        //正序
        this.monitorFreqClass = "icon-top";
        this.monitorFreq = 1;
        this.sort = {
          monitorFreq: 1
        };
      } else if (this.monitorFreq == 1) {
        //倒序
        this.monitorFreqClass = "icon-bottom";
        this.monitorFreq = 0;
        this.sort = {
          monitorFreq: -1
        };
      }
      this.isSearch ? this.searchByKwd(true) : this.initData();
    },
    startDateSort() {
      //按生效时间排序
      if (this.time == 0) {
        //正序
        this.startDateClass = "icon-top";
        this.time = 1;
        this.sort = {
          time: 1
        };
      } else if (this.time == 1) {
        //倒序
        this.startDateClass = "icon-bottom";
        this.time = 0;
        this.sort = {
          time: -1
        };
      }
      this.isSearch ? this.searchByKwd(true) : this.initData();
    },
    searchByKwd(isSort, isFirst) {
      this.secondTaskResourceText = this.taskResourceTex;
      this.secondTempName = this.tempNam;
      this.secondTestPath = this.testPat;
      this.secondTaskId = this.taskId;
      this.secondType = this.type;
      this.secondStartTime = this.startTime;
      this.secondEndTime = this.endTime;

      this.resetTask = false; //网站名称 ：区别是否分页跳转和在当前页面搜索
      this.resetPage = 1;
      this.isSearch = true;
      /*if(!this.$refs.keyword.value.trim()) {
					return;
				}*/
      if (isFirst) {
        this.page = 1;
      }
      if (this.startTime) {
        if (!this.endTime) {
          alert("请选择结束时间");
          return;
        }
        if (!this.compare()) {
          alert("结束时间不能小于开始时间");
          return;
        }
      }
      if (this.endTime) {
        if (!this.startTime) {
          alert("请选择开始时间");
        }
        if (!this.compare()) {
          alert("结束时间不能小于开始时间");
          return;
        }
      }

      if (this.startTime) {
        this.startTime = format(this.startTime) + "00:00:00";
      } else {
        this.startTime = "";
      }
      if (this.endTime) {
        this.endTime = format(this.endTime) + "23:59:59";
      } else {
        this.endTime = "";
      }

      if (this.authority == 0 && this.userId != 0) {
        this.initData(this.userId);
      } else {
        this.initData(this.queryUserId);
      }
      /*axios({
					headers: {
						"Content-Type": "application/json"
					},
					method: "post",
					url: "/tmpMonitor/searchTmpMonitor",
					async: true,
					data: {
						domain: this.domain,
						keyword: this.$refs.keyword.value.trim(),
						status: this.chooseStatusType,
						rows: this.rows,
						sort: isSort ? this.sort : "",
						page: this.page
					},
					contentType: 'application/json'
				}).then(res => {
					if(res.data.code == 200) {
						this.tmpMonitorListArr = res.data.dataUser.dataList;
						this.tmpMonitorListCount = res.data.dataUser.dataCount;
					} else {
						alert("查询失败")
					}

				}).catch(err => {
					console.log(err)
				})*/
    },
    closeAddPage() {
      this.isShowAddPage = false;
    },
    showModifyPage(tmpMonitorID, userId) {
      let tmpDataSecond = {};
      tmpDataSecond["page"] = this.page;
      tmpDataSecond["userId"] = this.userId;
      tmpDataSecond["testPath"] = this.testPath;
      tmpDataSecond["taskId"] = this.taskId;
      tmpDataSecond["type"] = this.type;
      tmpDataSecond["startTime"] = this.startTime;
      tmpDataSecond["endTime"] = this.endTime;
      tmpDataSecond["taskResourceText"] = this.taskResourceText;
      tmpDataSecond["tempName"] = this.tempName;
      tmpDataSecond["selectUserText"] = this.selectUserText;
      tmpDataSecond["queryUserId"] = this.queryUserId;

      sessionStorage.setItem("tmpDataSecond", JSON.stringify(tmpDataSecond));
      this.modifyTmpMonitorID = tmpMonitorID;
      this.$router.push({
        path: "/collection/collectionTemplate/modifytmpMonitor",
        query: {
          id: tmpMonitorID,
          tmpUserId: userId
        }
      });
    },
    closeModifyPage() {
      this.isShowModifyPage = false;
    },
    rowsChange() {
      //        this.page = 1;
      /*this.isSearch ? this.searchByKwd() : this.initData()*/
      this.flag = true;
      var nodeChilds = document.getElementsByClassName("number");
      for (var i = 0; i < nodeChilds.length; i++) {
        nodeChilds[i].classList.remove("active");
        if (nodeChilds[i].innerHTML == this.page) {
          nodeChilds[i].classList.add("active");
        }
      }
      //nodeChilds[this.page-1].classList.add('active');
      if (this.authority == 0 && this.userId != 0) {
        this.initData(this.userId);
      } else {
        this.initData(this.queryUserId);
      }
    },
    addTmp() {
      this.$router.push({
        path: "/collection/collectionTemplate/addtmpMonitor"
      });
    },
    lookDetail(id) {
      if (!id) {
        return;
      }
      console.log(222222);
      console.log(this.lookDetailShow);
      this.lookDetailShow = true;
      this.lookDetailId = id;
    },
    closePage() {
      this.lookDetailShow = false;
    },
    async showSelect(mgs) {
      if (mgs == "selectUserShow") {
        if (this.selectUserList.length == 0) {
          await getUserRoleList()
            .then(res => {
              var res = JSON.parse(res.response);
              if (res.code == "1" || res.code == 1) {
                this.selectUserList = res.data;
                this.selectUserList.unshift({ username: "全部", id: "" });
              } else {
                alert("获取角色列表失败");
              }
            })
            .catch(e => console.log("Oops, error", e));
        }
        this.selectUserShow = !this.selectUserShow;
      }
    },
    chooseStatus(e, mgs) {
      if (mgs == "selectUserShow") {
        this.selectUserText = e.target.innerText;
        if (this.selectUserText == "全部") {
          this.queryUserId = ""; //用户id
        } else {
          this.queryUserId = Number(e.target.value); //用户id
        }
        this.selectUserShow = false;
      } else {
        this.chooseStatusType = e.target.value;
        this.chooseStatusText = e.target.innerText;
        this.statusListShow = false;
      }
    },
    eSpiderClick(mgs) {
      this.field = mgs;
      if (mgs == "linksSize") {
        if (this.linksSizeFlag) {
          this.linksSize1 = true;
          this.linksSize2 = false;
          this.asc = 1;
          this.linksSizeFlag = false;
        } else {
          this.linksSize1 = false;
          this.linksSize2 = true;
          this.asc = 0;
          this.linksSizeFlag = true;
        }
      }
      if (this.authority == 0 && this.userId != 0) {
        this.initData(this.userId);
      } else {
        this.initData("");
      }
    }

    //      chooseStatus(e) { //查询时，运行状态选择点击事件
    //        this.chooseStatusType = e.target.value;
    //        this.chooseStatusText = e.target.innerText;
    //        this.statusListShow = false;
    //      },
  }
};
</script>
