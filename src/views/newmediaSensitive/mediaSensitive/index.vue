<template>
  <div class="app-container">
    <div class="siteMenuBox" v-if="mediaTypeShow">

      <div class="fl clearfix wh60" v-if="this.user.isAdmin" style="margin-left: 15px;">
        <Mechanism-Select
        :mechanismSelectUpload = "mechanismSelectUpload"
        v-bind:width= "width"
        @getMechanismChecked="getMechanismChecked"
        ></Mechanism-Select>
      </div>
      <div class="fl" style="margin-left: 15px;">
        <span class="main-aside-txt">新媒体类型：</span>
        <el-select v-model="query.bussinessType" class="filter-item">
          <el-option
            v-for="(item, index) in bussinessType"
            @click.change.native="changea($event, index, item.value)"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- @click.change.native = "changea($event,index,item.value)" -->
      <span class="main-aside-txt padLeft16 fl">新媒体账号：</span>
      <el-select
        v-model="siteCodeArr"
        multiple
        @change="changeSite()"
        class="filter-item siteElSelect"
      >
        <el-option
          v-for="(item, index) in siteList"
          @click.change.native="changea2()"
          :key="index"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="head-container errSentiveInfoBox clearfix">
      <div class="errSensitiveNum clearfix">
        <div class="errSenPic">
          <svg class="icon svg-icon-errSenWord" aria-hidden="true">
            <use xlink:href="#icontubiaozhizuomoban11"></use>
          </svg>
        </div>
        <div class="errSenListBox">
          <div class="errSenTit">
            共<span>{{ sensitiveCount || 0}}</span
            >个疑似错敏字，涉及<span>{{ articleCount || 0}}</span
            >个文章
          </div>
          <div class="errSenList clearfix">
            <ul>
              <li>
                <b class="bgBlue"></b
                ><span
                  >自定义错敏字：<strong>{{ customSen || 0}}</strong
                  >个</span
                >
              </li>
              <li>
                <b class="bgRed"></b
                ><span
                  >疑似严重错敏字：<strong>{{ seriousWord || 0}}</strong
                  >个</span
                >
              </li>
              <li>
                <b class="bgYellow"></b
                ><span
                  >疑似一般错敏字：<strong>{{ commonlyWord || 0}}</strong
                  >个</span
                >
              </li>
              <li>
                <b class="bgYellow"></b
                ><span
                  >疑似轻微错敏字：<strong>{{ slightWord || 0}}</strong
                  >个</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- echart图 -->
      <!-- <div class="errSensitiveChart" id="errSensitiveChart"  >
            </div> -->
      <i-echart
        class="errSensitiveChart"
        style="height:156px;"
        :option="optionPie"
      ></i-echart>
    </div>
    <!--工具栏-->
    <div class="head-container searchTabBox">
      <div class="searchAllBox otherSearchBox">
        <div class="clearfix marRt135">
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">时间：</span>
            <el-date-picker
              v-model="query.timeFormat"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              @input="handleTimestamp"
              range-separator="-"
              size="small"
              class="date-item"
              style="margin-right: 3px;"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">错敏类别：</span>
            <el-select v-model="query.type" class="filter-item">
              <el-option
                v-for="(item, index) in errSensitivityCategoryList"
                :key="index"
                :label="item.name"
                :value="item.value"
                @click.change.native="changeaErrSensitivit"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">问题级别：</span>
            <el-select v-model="query.correctType" class="filter-item">
              <el-option
                v-for="(item, index) in problemLevelList"
                :key="index"
                :label="item.label"
                :value="item.value"
                @click.change.native="changeaErrSensitivit"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fl wh60">
            <span class="main-aside-txt fl">数据：</span>
            <el-select v-model="query.isEheck" class="filter-item">
              <el-option
                v-for="(item, index) in dataList"
                :key="index"
                :label="item.name"
                :value="item.value"
                @click.change.native="changeaDataOpe"
              >
              </el-option>
            </el-select>
          </div>
          <!--   -->
          <div class="fl clearfix wh90" v-if="operationTypeShow">
            <span class="main-aside-txt fl">操作类型：</span>
            <el-select v-model="query.delFlag" class="filter-item">
              <el-option
                v-for="(item, index) in operationTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
                @click.change.native="changeaErrSensitivit"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="btnRtSearch">
          <!-- <rrOperation  :newVersion="true"/> -->
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
        <!-- <div class="clearfix">
          		<div class="fl">
          			<span class="main-aside-txt">新媒体账号：</span>
                <el-select v-model="query.opera" class="filter-item">
                  <el-option
                    v-for="(item,index) in mediaTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
          		</div>
            </div> -->
      </div>
      <!--公用列表操作按钮-->
      <div class="tabListFilter clearfix">
        <div class="tabListTit flt clearfix">
          <ul>
            <li v-bind:class="{ active: isActive }" @click="displayWords()">
              <a href="javascript:;">按错误词展示</a>
            </li>
            <li
              v-bind:class="{ active: !isActive }"
              @click="displayWords('queryLink')"
            >
              <a href="javascript:;">按问题链接展示</a>
            </li>
          </ul>
        </div>
        <div class="btnTabListBox frt clearfix">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toIgnore(crud.selections, '1')"
          >
            忽略
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toDelete(crud.selections, '2')"
          >
            删除
          </button>
          <span style="position: relative;" @click="exportFun()" @click.stop>
            <button class="btnListDefault btnTabBlue flt">导出列表</button>
            <span class="extDown" v-if="allExt">
              <span @click="downloadTmp('0')">全部数据导出</span>
              <span @click="downloadTmp('1')">所选数据导出</span>
            </span>
          </span>
        </div>
      </div>
    </div>
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="570px"
    >
      <el-form ref="form" :model="form">
        <div class="editErrWordBox">
          <div class="publicDialogList clearfix">
            <label class="fl">网站标识码：</label>
            <input
              type="text"
              placeholder=""
              disabled
              class="fl"
              v-model="form.siteCode"
            />
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">监测时间：</label>
            <input
              type="text"
              placeholder=""
              disabled
              class="fl"
              v-model="form.scanTime"
            />
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">错别字：</label>
            <input
              type="text"
              placeholder=""
              class="fl"
              v-model="form.wrongTerm"
            />
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">建议词：</label>
            <input
              type="text"
              placeholder=""
              class="fl"
              v-model="form.expectTerms"
            />
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">所在链接：</label>
            <a :href="form.url" class="iconDialogBox fl" target="_blank">
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban45"></use>
              </svg>
            </a>
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">快照：</label>
            <a :href="form.imgUrl" class="iconDialogBox fl" target="_blank">
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban17"></use>
              </svg>
            </a>
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">错误级别：</label>
            <div class=" flt clearfix">
              <el-select
                v-model="form.correctType"
                style="width: 200px !important;"
              >
                <el-option
                  style="width: 200px;"
                  v-for="(item, index) in correctTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                  @click.change.native="changeaErrSensitivit"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="publicDialogList clearfix">
            <label class="fl">建议描述：</label>
            <textarea class="textarea" v-model="form.problemDesc"></textarea>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>

    <!--表格渲染-->
    <div class="tabListPadBG">
      <div class="errScroll">
        <table v-show="groupByUrl" class="mainTable fwcgTable zebra">
          <thead>
            <tr>
              <th style="width: 3.5%;padding:0px;">
                <span class="checkboxTab">
                  <svg
                    class="icon svg-icon-operW16"
                    aria-hidden="true"
                    @click="checkAll()"
                    v-if="!isCheckedAll"
                  >
                    <use xlink:href="#icontubiaozhizuomoban40"></use>
                  </svg>
                  <svg
                    class="icon svg-icon-operW16"
                    aria-hidden="true"
                    v-else
                    @click="checkAll()"
                  >
                    <use xlink:href="#icontubiaozhizuomoban38"></use>
                  </svg>
                </span>
              </th>
              <th style="width: 5%;padding: 0;">序号</th>
              <th style="width: 14%;text-align: left;">错敏字</th>
              <th style="width: 14%;text-align: left;">修改推荐</th>
              <th style="width: 16%;text-align: left;">所在上下文</th>
              <th style="width: 11%" class="center">错敏类别</th>
              <th style="width: 21%;text-align: left;">所在地址</th>
              <th v-if="isEheckShow" style="width:15.5%;">修改时间</th>
              <th v-if="mediaTypeShow" style="width: 12%;">新媒体类型</th>
              <th v-if="mediaTypeShow" style="width: 14%;text-align: left;">
                昵称
              </th>
              <th v-if="isEheckShow" style="width: 9%;">操作类型</th>
              <th style="width: 15.5%" class="center">监测时间</th>
              <th style="width: 15%;text-align: center;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in crud.data"
              :key="index"
              v-if="item.detail != null"
              :class="{ evenOddBg: index % 2 }"
            >
              <td style="padding:0px;text-align:center;">
                <span
                  v-for="(items, indexs) in item.detail"
                  class="checkboxTab"
                >
                  <svg
                    class="icon svg-icon-operW16"
                    aria-hidden="true"
                    @click="checkOne(index, indexs)"
                    v-if="!items.isChecked"
                  >
                    <use xlink:href="#icontubiaozhizuomoban40"></use>
                  </svg>
                  <svg
                    class="icon svg-icon-operW16"
                    aria-hidden="true"
                    v-else
                    @click="checkOne(index, indexs)"
                  >
                    <use xlink:href="#icontubiaozhizuomoban38"></use>
                  </svg>
                </span>
              </td>

              <td class="center">
                {{ (crud.page.page - 1) * crud.page.size + (index + 1) }}
              </td>
              <td>
                <div
                  v-for="(items, index1) in item.detail"
                  :class="{ errWordTd: items.wrongTerm }"
                  :title="items.wrongTerm"
                >
                  {{ items.wrongTerm }}
                </div>
              </td>
              <td>
                <div
                  v-for="(items, index2) in item.detail"
                  class="ellipsis"
                  :class="{ errWordTd: items.expectTerms }"
                  :title="items.expectTerms"
                >
                  {{ items.expectTerms }}
                </div>
              </td>
              <td>
                <div
                  v-for="(items, index3) in item.detail"
                  class="ellipsis"
                  :class="{ errWordTd: items.sentenceHighlighted }"
                  :title="items.sentence"
                >
                  <a
                    :href="items.imgUrl"
                    target="_blank"
                    v-html="items.sentenceHighlighted"
                  ></a>
                </div>
              </td>
              <td class="center">
                <div
                  v-for="(items, index4) in item.detail"
                  class="ellipsis errWordTd"
                  :title="items.typeStr"
                >
                  {{ items.typeStr }}
                </div>
              </td>
              <td class="ellipsis">
                <a :href="item.url" target="_blank" style="color: #509cf2;">{{
                  item.url
                }}</a>
              </td>

              <td v-if="isEheckShow" class="center">
                <div
                  v-for="(items, index8) in item.detail"
                  class="ellipsis errWordTd"
                  :title="items.modifyTime"
                >
                  {{ items.modifyTime }}
                </div>
              </td>

              <td v-if="mediaTypeShow" class="center">
                <div
                  v-for="(items, index7) in item.detail"
                  class="ellipsis errWordTd"
                  :title="items.bussinessTypeStr"
                >
                  {{ items.bussinessTypeStr }}
                </div>
              </td>
              <td v-if="mediaTypeShow">
                <div
                  v-for="(items, index6) in item.detail"
                  class="ellipsis errWordTd"
                  :title="items.nickName"
                >
                  {{ items.nickName }}
                </div>
              </td>

              <td v-if="isEheckShow" class="center">
                <span
                  v-for="(items, index5) in item.detail"
                  class="errWordTd"
                  style="display: block;"
                >
                  <div v-if="items.delFlag == 1">已忽略</div>
                  <div v-if="items.delFlag == 2">已删除</div>
                  <div v-if="items.delFlag == 3">已修改</div>
                  <div v-if="items.delFlag == 0">未操作</div>
                </span>
              </td>
              <td class="ellipsis">
                <div v-for="(items, index6) in item.detail" class="errWordTd">
                  {{ items.scanTime }}
                </div>
              </td>
              <td>
                <div
                  v-for="(items, index5) in item.detail"
                  style="text-align: center;"
                >
                  <div class="tabIiconOperate">
                    <button @click="crud.toEdit(items)" title="编辑">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban2"></use>
                      </svg>
                    </button>

                    <!-- <span v-if="query.isEheck!='1' && query.isEheck!='2'">
                                    <button  title="忽略">
                                      <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(items.id,"1","确定忽略此条数据吗？")'>
                                        <use xlink:href="#icontubiaozhizuomoban"></use>
                                      </svg>
                                    </button>
                                    <button title="取消忽略">
                                      <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(items.id,"0","确定取消忽略此条数据吗？")'>
                                        <use xlink:href="#icontubiaozhizuomoban7"></use>
                                      </svg>
                                    </button>
                                    <button tile="删除">
                                      <svg class="icon svg-icon-operW16" aria-hidden="true"  @click='toDelete(items.id,"2","确定删除此条数据吗？")'>
                                        <use xlink:href="#icontubiaozhizuomoban1"></use>
                                      </svg>
                                    </button>
                                    <button tile="取消删除">
                                        <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toDelete(items.id,"0","确定取消删除此条数据吗？")' >
                                          <use xlink:href="#icontubiaozhizuomoban28"></use>
                                        </svg>
                                    </button>
                                  </span> -->

                    <button
                      title="忽略"
                      v-if="
                        items.delFlag == 2 ||
                          items.delFlag == 3 ||
                          items.delFlag == 0
                      "
                    >
                      <svg
                        class="icon svg-icon-operW16"
                        aria-hidden="true"
                        title="忽略"
                        @click="toIgnore(items.id, '1', '确定忽略此条数据吗?')"
                      >
                        <use xlink:href="#icontubiaozhizuomoban"></use>
                      </svg>
                    </button>
                    <button title="取消忽略" v-if="items.delFlag == 1">
                      <svg
                        class="icon svg-icon-operW16"
                        aria-hidden="true"
                        title="取消忽略"
                        @click="
                          toIgnore(items.id, '0', '确定取消忽略此条数据吗?')
                        "
                      >
                        <use xlink:href="#icontubiaozhizuomoban7"></use>
                      </svg>
                    </button>

                    <button
                      v-if="
                        items.delFlag == 0 ||
                          items.delFlag == 1 ||
                          items.delFlag == 3
                      "
                      title="删除"
                    >
                      <svg
                        class="icon svg-icon-operW16"
                        aria-hidden="true"
                        title="删除"
                        @click="toDelete(items.id, '2', '确定删除此条数据吗?')"
                      >
                        <use xlink:href="#icontubiaozhizuomoban1"></use>
                      </svg>
                    </button>
                    <button v-else title="取消删除">
                      <svg
                        class="icon svg-icon-operW16"
                        aria-hidden="true"
                        title="取消删除"
                        @click="
                          toDelete(items.id, '0', '确定取消删除此条数据吗?')
                        "
                      >
                        <use xlink:href="#icontubiaozhizuomoban28"></use>
                      </svg>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <el-table
        ref="table"
        v-loading="crud.loading"
        key="table"
        v-show="!groupByUrl"
        :data="crud.data"
        class="tableColumnWh"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column
          :selectable="checkboxT"
          type="selection"
          width="26"
          align="center"
        >
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="序号"
          width="40"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ (crud.page.page - 1) * crud.page.size + (scope.$index + 1) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="wrongTerm"
          label="错敏字"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.wrongTerm }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="expectTerms" label="修改推荐" width="120" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="sentenceHighlighted"
          width="251"
          label="所在上下文"
        >
          <template slot-scope="scope">
            <a
              :href="scope.row.imgUrl"
              target="_blank"
              v-html="scope.row.sentenceHighlighted"
            ></a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          width="135"
          prop="typeStr"
          label="错敏类别"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.typeStr }}</div>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="title"
          label="所在地址"
          width="242"
        >
          <template slot-scope="scope">
            <div>
              <a
                :href="scope.row.url"
                target="_blank"
                style="color: #509cf2;"
                >{{ scope.row.url }}</a
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="modifyTime"
          label="修改时间"
          width="145"
          v-if="isEheckShow"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.modifyTime }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="bussinessTypeStr"
          label="新媒体类型"
          v-if="mediaTypeShow"
        >
          <template slot-scope="scope">
            {{ scope.row.bussinessTypeStr }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="nickName"
          label="昵称"
          v-if="mediaTypeShow"
        >
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="delFlag"
          v-if="isEheckShow"
          label="操作类型"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <!-- 0：正常，1：忽略，2删除，2修改-->
            <!-- <div v-if="scope.row.delFlag==0">正常</div> -->
            <div v-if="scope.row.delFlag == 1">已忽略</div>
            <div v-if="scope.row.delFlag == 2">已删除</div>
            <div v-if="scope.row.delFlag == 3">已修改</div>
            <div v-if="scope.row.delFlag == 0">未操作</div>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="scanTime"
          width="145"
          label="监测时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.scanTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-permission="['admin', 'user:edit', 'user:del']"
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <!-- <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              /> -->
            <div class="tabIiconOperate">
              <button @click="crud.toEdit(scope.row)" title="编辑">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>

              <!-- <span v-if="query.isEheck!='1' && query.isEheck!='2'">
                  <button  title="忽略">
                    <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(scope.row.id,"1","确定忽略此条数据吗?")'>
                      <use xlink:href="#icontubiaozhizuomoban"></use>
                    </svg>
                  </button>
                  <button title="取消忽略">
                    <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(scope.row.id,"0","确定取消忽略此条数据吗?")'>
                      <use xlink:href="#icontubiaozhizuomoban7"></use>
                    </svg>
                  </button>
                  <button tile="删除">
                    <svg class="icon svg-icon-operW16" aria-hidden="true"  @click='toDelete(scope.row.id,"2","确定删除此条数据吗?")'>
                      <use xlink:href="#icontubiaozhizuomoban1"></use>
                    </svg>
                  </button>
                  <button tile="取消删除">
                      <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toDelete(scope.row.id,"0","确定取消删除此条数据吗?")' >
                        <use xlink:href="#icontubiaozhizuomoban28"></use>
                      </svg>
                  </button>
                </span> -->

              <button
                title="忽略"
                v-if="
                  scope.row.delFlag == 2 ||
                    scope.row.delFlag == 3 ||
                    scope.row.delFlag == 0
                "
              >
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  title="忽略"
                  @click="toIgnore(scope.row.id, '1', '确定忽略此条数据吗?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban"></use>
                </svg>
              </button>
              <button title="取消忽略" v-if="scope.row.delFlag == 1">
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  title="取消忽略"
                  @click="
                    toIgnore(scope.row.id, '0', '确定取消忽略此条数据吗?')
                  "
                >
                  <use xlink:href="#icontubiaozhizuomoban7"></use>
                </svg>
              </button>

              <button
                v-if="
                  scope.row.delFlag == 0 ||
                    scope.row.delFlag == 1 ||
                    scope.row.delFlag == 3
                "
                title="删除"
              >
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  title="删除"
                  @click="toDelete(scope.row.id, '2', '确定删除此条数据吗?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
              <button v-else title="取消删除">
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  title="取消删除"
                  @click="
                    toDelete(scope.row.id, '0', '确定取消删除此条数据吗?')
                  "
                >
                  <use xlink:href="#icontubiaozhizuomoban28"></use>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { isvalidPhone } from "@/utils/validate";
import sensitiveWordCrud from "@/api/sensitiveApi/newMediaEdit";
import {
  getSensitiveNum,
  getSensitiveLevel,
  getArticleCount,
  getSensitiveCount,
  getSensitiveType,
  getsiteList,
  sensitiUpdate,
  del,
  sensitieFindById
} from "@/api/sensitiveApi/queryCustom";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import { dataHttpGet } from "@/api/common";
import echarts from "echarts"; //图标
import iEchart from "@/views/webSensitive/errorSensitiveInfo/echart";
import { getCurrentMonthFirst } from "@/utils/util";
import MechanismSelect from "@/components/MechanismSelect";
import { dataHttpPost } from "@/api/common";

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
      url: "sensitiveDetail/queryList",
      newAddRefresh: true,
      query: { tableType: 1 },
      crudMethod: { ...sensitiveWordCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  // dicts: ['user_status'],
  dicts: ["is_level"],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      deptName: "",
      depts: [],
      deptDatas: [],
      jobs: [],
      level: 3,
      roles: [],
      defaultProps: { children: "children", label: "name", isLeaf: "leaf" },
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"]
      },
      dataList: [
        { name: "全部", label: "", value: "" },
        { name: "已操作数据", label: "1", value: "1" },
        { name: "未操作数据", label: "2", value: "2" }
      ],
      errSensitivityCategoryList: [], //错敏类别

      problemLevelList: [
        //问题级别correctType  correctType
        { value: "", label: "", name: "全部" },
        { value: "2", label: "2", name: "疑似严重错敏字" },
        { value: "3", label: "3", name: "疑似一般错敏字" },
        { value: "4", label: "4", name: "疑似轻微错敏字" }
      ],
      //操作类型
      operationTypeList: [
        { value: "", label: "", name: "全部" },
        { value: "1", label: "1", name: "忽略" },
        { value: "2", label: "2", name: "删除" },
        { value: "3", label: "3", name: "修改" }
      ],

      siteList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        phone: [{ required: true, trigger: "blur", validator: validPhone }]
      },
      bussinessType: [
        { name: "微信公众号", value: "101" },
        { name: "新浪微博", value: "102" },
        { name: "今日头条", value: "103" }
      ],
      mediaTypeList: [],
      //echart
      optionPie: {},
      isActive: true,
      customSen: "",
      articleCount: "",
      seriousWord: "",
      commonlyWord: "",
      slightWord: "",
      sensitiveCount: "",
      statisticsList: {
        tableType: 1,
        account: "",
        correctType: "2",
        delFlag: "",
        isEheck: "",
        scanDateEnd: "",
        scanDateStart: "",
        type: ""
      },
      flageSelect: true,
      allExt: false,
      ids: "",
      groupByUrl: false,
      position: 0,
      rowSpanArr: [],
      isCheckedAll: false,
      errData: [],
      operationTypeShow: false,
      correctTypeList: [
        { value: 3, name: "疑似一般错敏字" },
        { value: 4, name: "疑似轻微错敏字" },
        { value: 2, name: "疑似严重错敏字" }
      ],
      mediaTypeShow: false,
      siteCodeArr: [],
      mediaTypeNewShow: false,
      isEheckShow: true,
      width: '42px',
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

    this.problemLevelList = this.dict.is_level;

    this.query.bussinessType = '101'
    this.query.timeFormat = getCurrentMonthFirst();
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.siteFun("one",this.user.deptInfo.deptId);
    this.sensitiveNum();
    this.sensitiveType();

    // this.query.delFlag = this.operationTypeList[0].value;
    // this.query.isEheck = this.dataList[0].value;
    // //问题级别修改
    // this.query.correctType = this.problemLevelList[1].value;

    document.addEventListener("click", this.handleDocumentClick);
  },
  methods: {
    displayWords(queryLink) {
      this.isActive = !this.isActive;
      this.sensitiveType();
      this.sensitiveNum();
      this.groupByUrl = false;
      this.isCheckedAll = false;
      this.operationTypeShow = false;
      this.query.delFlag = "";
      if (queryLink) {
        this.crud.loading = true;
        this.crud.url = "sensitiveDetail/groupByUrl";
        this.crud.toQuery();
        this.crud.selections = [];
        if (this.crud.data.length > 0) {
          this.groupByUrl = true;
        }
      } else {
        this.crud.selections = [];
        this.crud.url = "sensitiveDetail/queryList";
        this.crud.toQuery();
        this.$forceUpdate();
      }

      this.query.delFlag = this.operationTypeList[0].value;
      this.query.isEheck = this.dataList[0].value;
      this.query.correctType = this.problemLevelList[1].value;
    },
    changea2() {
      this.query.account = this.siteCodeArr.join(",");
    },
    changeSite() {
      this.query.account = this.siteCodeArr.join(",");
      //this.crud.toQuery();
    },
    handleDocumentClick() {
      this.allExt = false;
    },
    changea(ev, index, mgs) {
      let queryAccountArr = [];
      this.flageSelect = !this.flageSelect;
      this.mediaTypeNewShow = true;
      this.$forceUpdate();

      if(!this.user.isAdmin){
        this.siteFun();
      }else{
        this.siteMechanismFun(this.query.deptId)
      }
      //  if(!mgs){
      //     if(this.query.account.length>0){
      //       this.query.account.forEach((val,index)=>{
      //           if(index==0){
      //             if(!val){
      //                 this.siteList.forEach((val,index)=>{
      //                     if(val.value){
      //                       queryAccountArr.push(val.value);
      //                     }
      //                 })
      //                 this.flageSelect = true;
      //                 this.query.account = queryAccountArr;
      //             }else{

      //               // if(!this.flageSelect){
      //               //   this.query.account = []
      //               //}
      //             }
      //           }else{
      //             this.query.account = []
      //           }
      //       })
      //     }
      //  }
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud);
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud);
    },
    afterErrorMethod(crud) {},
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {},
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      sensitieFindById({ id: form.id, tableType: 1 }).then(res => {
        if (res.code == 200) {
          form = res.data;
        } else {
          this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
        }
      });
    },
    // 提交前做的操作
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
      // if(this.query.timeFormat){
      //   if(this.query.timeFormat.length>0){
      //     Object.assign(this.statisticsList,{'scanDateStart':this.query.timeFormat[0],'scanDateEnd':this.query.timeFormat[1]})
      //   }
      // }else{
      //   this.statisticsList = this.query
      // }
      this.statisticsList = this.query;
      await getSensitiveNum(this.statisticsList).then(res => {
        if (res.code == 200) {
          this.customSen = res.data;
        }
      });
      await getSensitiveLevel(this.statisticsList).then(res => {
        if (res.code == 200) {
          (this.seriousWord = res.data["2"]),
            (this.commonlyWord = res.data["3"]),
            (this.slightWord = res.data["4"]);
        }
        this.sensitiveCount =
          this.customSen +
          this.seriousWord +
          this.slightWord +
          this.commonlyWord;
        this.optionPie = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ["#FF777C", "#FDC551", "#639CFF", "#FCA327"],
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
                  value: this.seriousWord,
                  name: "疑似严重错敏字",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}个 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                        // color: 'rgba(0,0,0,0.85)',
                      },
                      value: {
                        //color: 'rgba(0,0,0,0.30)',
                        // lineHeight: 18,
                      }
                    }
                  }
                },
                {
                  value: this.commonlyWord,
                  name: "疑似一般错敏字",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}个 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                        // color: 'rgba(0,0,0,0.85)',
                      },
                      value: {
                        // color: 'rgba(0,0,0,0.30)',
                        // lineHeight: 18,
                      }
                    }
                  }
                },
                {
                  value: this.customSen,
                  name: "自定义错敏字",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}个 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                        // color: 'rgba(0,0,0,0.85)',
                      },
                      value: {
                        //color: 'rgba(0,0,0,0.30)',
                        // lineHeight: 18,
                      }
                    }
                  }
                },
                {
                  value: this.slightWord,
                  name: "疑似轻微错敏字",
                  label: {
                    formatter: ["{title|{b}}", "{value|{c}个 {d}%}"].join("\n"),
                    rich: {
                      title: {
                        align: "center"
                        // color: 'rgba(0,0,0,0.85)',
                      },
                      value: {
                        //color: 'rgba(0,0,0,0.30)',
                        // lineHeight: 18,
                      }
                    }
                  }
                }
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
      await getArticleCount(this.statisticsList).then(res => {
        if (res.code == 200) {
          this.articleCount = res.data;
        }
      });
      // await getSensitiveCount(this.statisticsList).then(res => {
      //     if(res.code==200){
      //        this.sensitiveCount = res.data;
      //     }
      // });
    },
    resetQueryData() {
      this.siteCodeArr = [];
      this.crud.resetQuery();
      this.isEheckShow = true;
      this.query.deptId = this.user.deptInfo.deptId;
      this.query.bussinessType = '101'
      this.sensitiveNum();
      this.siteFun("one",this.user.deptInfo.deptId);
    },
    toQueryData() {
      if (this.query.isEheck == 1 || this.query.isEheck == "") {
        this.isEheckShow = true;
      } else {
        this.isEheckShow = false;
      }
      this.crud.toQuery();
      this.sensitiveNum();
    },
    handleTimestamp(e) {
      let _this = this;
      _this.query.timeFormat = e;
      _this.$forceUpdate();
    },
    sensitiveType() {
      getSensitiveType({ type: "" }).then(res => {
        this.errSensitivityCategoryList = [];
        Object.keys(res.data).map((val, key) => {
          this.errSensitivityCategoryList.push({
            value: val,
            label: "",
            name: res.data[val]
          });
        });
        this.errSensitivityCategoryList.unshift({
          value: "",
          label: "",
          name: "全部"
        });
        this.query.type = this.errSensitivityCategoryList[0].value;
      });
    },
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
      this.query.bussinessType = '101';
      this.siteMechanismFun(val)
    },
    siteMechanismFun(val) {
      let url = "/uMediaInfo/getAllList?deptId=" + val;
      dataHttpPost(url, [this.query.bussinessType]).then(res => {
        if (res) {
          this.siteList = [];
          this.siteCodeArr = [];
          var accountId = [];
          if (res.code == 200) {
          res.data.forEach((val, key) => {
            accountId.push(val.siteCode);
            this.siteList.push({
              name: val.nickName,
              value: val.wxid,
              label: val.nickName
            });
          });

          this.siteList.forEach((vals, keys) => {
            this.siteCodeArr.push(vals.value);
          });
          this.query.account = this.siteCodeArr.join(",");
        } else {
          this.siteList = [];
          this.query.account = "";
        }

        this.query.delFlag = this.operationTypeList[0].value;
        this.query.isEheck = this.dataList[0].value;
        //问题级别修改
        this.query.correctType = this.problemLevelList[1].value;

        this.crud.toQuery();
        this.sensitiveNum();
        this.sensitiveType();
        }
      });
    },
    siteFun(mgs) {
      if(this.user.isAdmin){
        let url = "/uMediaInfo/getAllList?deptId=" + this.user.deptInfo.deptId;
        dataHttpPost(url, [this.query.bussinessType]).then(res => {
          if (res) {
            this.siteList = [];
            this.siteCodeArr = [];
            var accountId = [];
            if (res.code == 200) {
            res.data.forEach((val, key) => {
              accountId.push(val.siteCode);
              this.siteList.push({
                name: val.nickName,
                value: val.wxid,
                label: val.nickName
              });
            });

            if (res.data.length > 1 || this.mediaTypeNewShow) {
              this.mediaTypeShow = true;
              if (mgs == "one") {
                this.query.bussinessType = this.bussinessType[0].value;
                this.siteFun("two");
              }
              if (mgs == "two") {
                this.siteList.forEach((vals, keys) => {
                  this.siteCodeArr.push(vals.value);
                });
                this.query.account = this.siteCodeArr.join(",");
              }
            } else {
              this.mediaTypeShow = false;
              this.query.account = accountId.join(",");
            }
            //this.siteList.unshift({value: '45',label: '',name:'全部'});
          } else {
            this.siteList = [];
            this.query.account = "";
          }

          this.query.delFlag = this.operationTypeList[0].value;
          this.query.isEheck = this.dataList[0].value;
          //问题级别修改
          this.query.correctType = this.problemLevelList[1].value;

          this.crud.toQuery();
          }
        });
      }else{
        getsiteList({
          userId: this.user.id,
          accountType: "2",
          mediaType: this.query.bussinessType
        }).then(res => {
          this.siteList = [];
          this.siteCodeArr = [];
          var accountId = [];
          if (res.code == 200) {
            res.data.forEach((val, key) => {
              accountId.push(val.accoutid);
              this.siteList.push({
                name: val.name,
                value: val.accoutid,
                label: val.name
              });
            });

            if (res.data.length > 1 || this.mediaTypeNewShow) {
              this.mediaTypeShow = true;
              if (mgs == "one") {
                this.query.bussinessType = this.bussinessType[0].value;
                this.siteFun("two");
              }
              if (mgs == "two") {
                this.siteList.forEach((vals, keys) => {
                  this.siteCodeArr.push(vals.value);
                });
                this.query.account = this.siteCodeArr.join(",");
              }
            } else {
              this.mediaTypeShow = false;
              this.query.account = accountId.join(",");
            }
            //this.siteList.unshift({value: '45',label: '',name:'全部'});
          } else {
            this.siteList = [];
            this.query.account = "";
          }

          this.query.delFlag = this.operationTypeList[0].value;
          this.query.isEheck = this.dataList[0].value;
          //问题级别修改
          this.query.correctType = this.problemLevelList[1].value;

          this.crud.toQuery();
        });
      }
    },
    changeaErrSensitivit() {
      this.$forceUpdate();
    },
    changeaDataOpe() {
      //2 未操作 1已操作
      this.operationTypeShow = false;
      if (this.query.isEheck == "1") {
        this.operationTypeShow = true;
      } else {
        this.query.delFlag = "";
      }
      this.$forceUpdate();
    },
    // /sensitiveDetail/exportDetailData
    exportDetailData() {},

    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(
        '此操作将 "' +
          this.dict.label.user_status[val] +
          '" ' +
          data.username +
          ", 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          crudUser
            .edit(data)
            .then(res => {
              this.crud.notify(
                this.dict.label.user_status[val] + "成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
            })
            .catch(() => {
              data.enabled = !data.enabled;
            });
        })
        .catch(() => {
          data.enabled = !data.enabled;
        });
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id;
    },
    exportFun() {
      this.allExt = !this.allExt;
    },
    downloadTmp(num) {
      //this.crud.url = 'sensitiveDetail/exportDetailData';
      this.crud.downloadLoading = false;
      this.query.exportType = num;
      this.ids = "";
      if (num == 1) {
        if (this.crud.selections.length == 0) {
          this.$alert("请选择要导出的数据", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
          return;
        }
      }
      this.crud.selections.forEach((val, index) => {
        if (val.id) {
          this.ids += val.id + ",";
        }
      });
      this.query.ids = this.ids;
      this.crud.wzExport();
    },
    checkAll() {
      this.crud.selections = [];
      this.crud.data.forEach(item => {
        for (var i = 0; i < item.detail.length; i++) {
          item.detail[i]["isChecked"] = !this.isCheckedAll;
        }
      });
      this.isCheckedAll = !this.isCheckedAll;

      if (this.isCheckedAll) {
        this.crud.data.forEach(item => {
          for (var i = 0; i < item.detail.length; i++) {
            this.crud.selections.push(item.detail[i]);
          }
        });
      }
    },
    checkOne(key, ind) {
      this.crud.selections = [];
      this.crud.data[key].detail[ind]["isChecked"]
        ? (this.isCheckedAll = false)
        : "";
      this.crud.data[key].detail[ind]["isChecked"]
        ? (this.crud.data[key].detail[ind]["isChecked"] = false)
        : (this.crud.data[key].detail[ind]["isChecked"] = true);
      this.$set(
        this.crud.data[key].detail,
        ind,
        this.crud.data[key].detail[ind]
      );
      let flag = true;
      this.crud.data.forEach(item => {
        item.detail.forEach(items => {
          if (!items["isChecked"]) {
            flag = false;
          } else {
            this.crud.selections.push(items);
          }
        });
      });
      this.isCheckedAll = flag;
    },
    toDelete(datas, num, mgs) {
      let ids = [];
      if (datas instanceof Array) {
        if (datas.length == 0) {
          // this.$confirm(`请选择要操作的数据`, '提示', {
          //   //confirmButtonText: '确定',
          //   type: 'warning'
          // }).then(() => {
          //   this.crud.delAllLoading = true
          // })
          this.$message({
            message: "请选择要操作的数据",
            type: "warning"
          });
        } else {
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

              del({ ids: ids.join(","), tableType: 1, type: num }).then(res => {
                if (res.code == 200) {
                  this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
                } else {
                  this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
                }
                this.crud.selections = [];
                this.crud.toQuery();
              });
            })
            .catch(() => {});
        }
      } else {
        if (!datas) {
          this.$message({
            message: "id不能为空",
            type: "warning"
          });
          return;
        }
        this.$confirm(mgs, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            ids = datas;
            del({ ids: ids, tableType: 1, type: num }).then(res => {
              if (res.code == 200) {
                this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              } else {
                this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
              }
              this.crud.selections = [];
              this.crud.toQuery();
            });
          })
          .catch(() => {});
      }
    },
    toIgnore(datas, num, mgs) {
      let ids = [];
      if (datas instanceof Array) {
        if (datas.length == 0) {
          // this.$confirm(`请选择要操作的数据`, '提示', {
          //   //confirmButtonText: '确定',
          //   type: 'warning'
          // }).then(() => {
          //   this.crud.delAllLoading = true
          // })
          this.$message({
            message: "请选择要操作的数据",
            type: "warning"
          });
        } else {
          this.$confirm(`确认忽略选中的${datas.length}条数据?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.crud.delAllLoading = true;
              datas.forEach((val, index) => {
                ids.push(val.id);
              });

              del({ ids: ids.join(","), tableType: 1, type: num }).then(res => {
                if (res.code == 200) {
                  this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
                } else {
                  this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
                }
                this.crud.selections = [];
                this.crud.toQuery();
              });
            })
            .catch(() => {});
        }
      } else {
        if (!datas) {
          this.$message({
            message: "id不能为空",
            type: "warning"
          });
          return;
        }
        this.$confirm(mgs, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            ids = datas;
            del({ ids: ids, tableType: 1, type: num }).then(res => {
              if (res.code == 200) {
                this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              } else {
                this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
              }
              this.crud.selections = [];
              this.crud.toQuery();
            });
          })
          .catch(() => {});
      }
    }
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
@media screen and (max-width: 1500px) {
  .errScroll {
    overflow-x: auto;
  }
  .tabListPadBG .mainTable.fwcgTable.zebra {
    width: 1500px;
    overflow-x: auto;
  }
}
</style>
