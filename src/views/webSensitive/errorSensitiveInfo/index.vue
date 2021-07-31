<template>
  <div class="app-container">
    <div class="siteMenuBox" v-if="mediaTypeShow">
      <Mechanism-Select 
      v-if="this.user.isAdmin"
      v-bind:width= "width"
      :mechanismSelectUpload = "mechanismSelectUpload"
      @getMechanismChecked="getMechanismChecked"
      style="margin-right: 15px;"
      ></Mechanism-Select>
      <span class="main-aside-txt">站点：</span>
      <el-select
        v-model="siteCodeArr"
        @change="changeSite()"
        multiple
        class="filter-item siteElSelect"
        style="width:462px;"
      >
        <el-option
          v-for="(item, index) in siteList"
          @click.change.native="changea($event, index, item.value)"
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
            共<span>{{ sensitiveCount? sensitiveCount : 0}}</span
            >个疑似错敏字，涉及<span>{{ articleCount }}</span
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
        style="height:170px;"
        :option="optionPie"
      ></i-echart>
    </div>
    <!--工具栏-->
    <div class="head-container searchTabBox">
      <div class="searchAllBox otherSearchBox">
        <div class="clearfix marRt135">
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl whLabel60">时间：</span>
            <el-date-picker
              v-model="query.timeFormat"
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
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl whLabel60">数据：</span>
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
          <!-- <rrOperation /> v-if="crud.optShow.reset"-->
          <span>
            <el-button
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
      <!-- groupByUrl -->
      <table
        v-show="groupByUrl"
        style="width: 100%;"
        class="mainTable fwcgTable zebra"
      >
        <thead>
          <tr>
            <th style="width: 3.5%;">
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
            <th style="width: 19%;text-align: left;">所在地址</th>
            <th style="width: 14%;text-align: left;" v-if="mediaTypeShow">
              网站名称
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
            <!-- v-for="(items,indexs) in item.detail" :colspan="item.detail.length-1" -->
            <td>
              <span class="checkboxTab" v-for="(items, indexs) in item.detail">
                <!-- <svg class="clampHide" class="icon svg-icon-operW16" aria-hidden="true" >
                      <use xlink:href="#icontubiaozhizuomoban40"></use>
                    </svg> -->
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
                class="ellipsis"
                :class="{ errWordTd: items.wrongTerm }"
              >
                {{ items.wrongTerm }}
              </div>
            </td>
            <td>
              <div
                v-for="(items, index2) in item.detail"
                :title="items.expectTerms"
                class="ellipsis"
                :class="{ errWordTd: items.expectTerms }"
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
                :title="items.typeStr"
                class="ellipsis errWordTd"
              >
                {{ items.typeStr }}
              </div>
            </td>
            <td class="ellipsis">
              <a :href="item.url" target="_blank" style="color: #509cf2;">{{
                item.url
              }}</a>
            </td>

            <td class="ellipsis" v-if="mediaTypeShow">
              <div
                v-for="(items, index7) in item.detail"
                class="ellipsis errWordTd"
                :title="items.siteName"
              >
                {{ items.siteName }}
              </div>
            </td>

            <td v-if="isEheckShow" class="center">
              <!-- 0：正常，1：忽略，2删除，2修改-->
              <!-- <div v-if="scope.row.delFlag==0">正常</div> -->
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

            <td class="ellipsis center" style="padding:0;">
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
                            <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(items.id,"1","确定忽略此条数据?")'>
                              <use xlink:href="#icontubiaozhizuomoban"></use>
                            </svg>
                          </button>
                          <button title="取消忽略">
                            <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(items.id,"0","确定取消忽略此条数据?")'>
                              <use xlink:href="#icontubiaozhizuomoban7"></use>
                            </svg>
                          </button>
                          <button title="删除">
                            <svg class="icon svg-icon-operW16" aria-hidden="true"  @click='toDelete(items.id,"2","确定删除此条数据?")'>
                              <use xlink:href="#icontubiaozhizuomoban1"></use>
                            </svg>
                          </button>
                          <button title="取消删除">
                              <svg class="icon svg-icon-operW20" aria-hidden="true" @click='toDelete(items.id,"0","确定取消删除此条数据?")' >
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
                      @click="toIgnore(items.id, '1', '确定忽略此条数据?')"
                    >
                      <use xlink:href="#icontubiaozhizuomoban"></use>
                    </svg>
                  </button>
                  <button title="取消忽略" v-if="items.delFlag == 1">
                    <svg
                      class="icon svg-icon-operW16"
                      aria-hidden="true"
                      @click="toIgnore(items.id, '0', '确定取消忽略此条数据?')"
                    >
                      <use xlink:href="#icontubiaozhizuomoban7"></use>
                    </svg>
                  </button>

                  <button
                    title="删除"
                    v-if="
                      items.delFlag == 0 ||
                        items.delFlag == 1 ||
                        items.delFlag == 3
                    "
                  >
                    <svg
                      class="icon svg-icon-operW16"
                      aria-hidden="true"
                      @click="toDelete(items.id, '2', '确定删除此条数据?')"
                    >
                      <use xlink:href="#icontubiaozhizuomoban1"></use>
                    </svg>
                  </button>
                  <button v-else title="取消删除">
                    <svg
                      class="icon svg-icon-operW20"
                      aria-hidden="true"
                      @click="toDelete(items.id, '0', '确定取消删除此条数据?')"
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
        />
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
          width="120"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.wrongTerm }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="expectTerms" label="修改推荐" width="180" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="sentenceHighlighted"
          width="251"
          label="所在上下文"
        >
          <template slot-scope="scope">
            <div>
              <a
                :href="scope.row.imgUrl"
                target="_blank"
                v-html="scope.row.sentenceHighlighted"
              ></a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          width="135"
          prop="type"
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
          v-if="mediaTypeShow"
          prop="siteName"
          label="网站名称"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            {{ scope.row.siteName }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          prop="delFlag"
          v-if="isEheckShow"
          label="操作类型"
          align="center"
          width="100"
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
          align="center"
          label="监测时间"
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
                      <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(scope.row.id,"1","确定忽略此条数据?")'>
                        <use xlink:href="#icontubiaozhizuomoban"></use>
                      </svg>
                    </button>
                    <button title="取消忽略">
                      <svg class="icon svg-icon-operW16" aria-hidden="true" @click='toIgnore(scope.row.id,"0","确定取消忽略此条数据?")'>
                        <use xlink:href="#icontubiaozhizuomoban7"></use>
                      </svg>
                    </button>
                    <button title="删除">
                      <svg class="icon svg-icon-operW16" aria-hidden="true"  @click='toDelete(scope.row.id,"2","确定删除此条数据?")'>
                        <use xlink:href="#icontubiaozhizuomoban1"></use>
                      </svg>
                    </button>
                    <button title="取消删除">
                        <svg class="icon svg-icon-operW20" aria-hidden="true" @click='toDelete(scope.row.id,"0","确定取消删除此条数据?")' >
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
                  @click="toIgnore(scope.row.id, '1', '确定忽略此条数据?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban"></use>
                </svg>
              </button>
              <button title="取消忽略" v-if="scope.row.delFlag == 1">
                <svg
                  class="icon svg-icon-operW16"
                  title="取消忽略"
                  aria-hidden="true"
                  @click="toIgnore(scope.row.id, '0', '确定取消忽略此条数据?')"
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
                  @click="toDelete(scope.row.id, '2', '确定删除此条数据?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
              <button v-else title="取消删除">
                <svg
                  class="icon svg-icon-operW20"
                  aria-hidden="true"
                  title="取消删除"
                  @click="toDelete(scope.row.id, '0', '确定取消删除此条数据?')"
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
//import { isvalidPhone } from '@/utils/validate'
import sensitiveWordCrud from "@/api/sensitiveApi/sensitiveWord";
import {
  getSensitiveNum,
  getSensitiveLevel,
  getArticleCount,
  getSensitiveCount,
  getSensitiveType,
  getsiteList,
  getGroupByUrlApi,
  sensitiUpdate,
  del,
  sensitieFindById
} from "@/api/sensitiveApi/queryCustom";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import MechanismSelect from "@/components/MechanismSelect";

import echarts from "echarts"; //图标
import iEchart from "@/views/webSensitive/errorSensitiveInfo/echart";
import { dataHttpGet } from "@/api/common";

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

// const validPhone = (rule, value, callback) => {
//       if (!value) {
//         callback(new Error('请输入电话号码'))
//       } else if (!isvalidPhone(value)) {
//         callback(new Error('请输入正确的11位手机号码'))
//       } else {
//         callback()
//       }
//     }  account: this.query.account

export default {
  name: "User",
  components: { rrOperation, udOperation, pagination, iEchart, MechanismSelect },
  cruds() {
    //console.log(this.query.account)
    return CRUD({
      title: "",
      url: "sensitiveDetail/queryList",
      newAddRefresh: true,
      query: { tableType: 0 },
      crudMethod: { ...sensitiveWordCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  //dicts: ['user_status'],
  dicts: ["is_level"],
  data() {
    // 自定义验证
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
        //问题级别correctType
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
        ]
      },
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
        tableType: 0,
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
      siteCodeArr: [],
      mediaTypeNewShow: false,
      mediaTypeShow: false,
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

    this.getCurrentMonthFirst();
    this.siteFun(this.user.deptInfo.deptId);
    this.sensitiveNum();
    this.sensitiveType();

    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    // this.query.delFlag = this.operationTypeList[0].value;
    // this.query.isEheck = this.dataList[0].value;
    // console.log(this.problemLevelList)
    // this.query.correctType = this.dict.is_level[1].value;
    document.addEventListener("click", this.handleDocumentClick);
  },
  methods: {
    async getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());

      let url = "/uDatabaseInfo/getAllList";
      let params = {
        deptId: val
      }
     await dataHttpGet(url,params).then(res => {
        this.siteCodeArr = [];this.siteList = [];
        if (res.code == 200) {
          res.data.forEach((val, key) => {
            this.siteCodeArr.push(val.siteCode);
            this.siteList.push({
              name: val.name,
              value: val.siteCode,
              label: val.name
            });
          });
          this.siteList.unshift({ value: "", label: "", name: "全部" });

          this.query.account = this.siteCodeArr.join(",");
        }else{
          this.siteList = [];
          this.query.account = "";
        }
      })
      document.getElementById('loading').style.display='block';
      await this.sensitiveNum();
      await this.sensitiveType();
      this.crud.toQuery();
    },
    handleDocumentClick() {
      this.allExt = false;
    },
    displayWords(queryLink) {
      this.isActive = !this.isActive;
      this.sensitiveType();
      this.sensitiveNum();
      this.groupByUrl = false;
      this.isCheckedAll = false;
      this.operationTypeShow = false;
      this.query.delFlag = "";
      //this.query.account = this.query.account.join(',');
      this.crud.getTable().clearSelection();
      if (queryLink) {
        this.crud.loading = true;
        this.crud.url = "sensitiveDetail/groupByUrl";
        this.crud.toQuery();
        this.crud.selections = [];

        if (this.crud.data.length > 0) {
          this.groupByUrl = true;
        }
      } else {
        this.crud.url = "sensitiveDetail/queryList";
        this.crud.selections = [];
        this.crud.toQuery();
      }

      this.query.delFlag = this.operationTypeList[0].value;
      this.query.isEheck = this.dataList[0].value;
      this.query.correctType = this.problemLevelList[0].value;
    },
    async getGroupByUrlData() {
      await getGroupByUrlApi({ tableType: 0, page: 0, size: 50 }).then(res => {
        if (res.code == 200) {
          //this.errData = res.data.list
          //this.crud.data
          //this.crud.page.total = res.data.total
        }
      });
    },
    changea(ev, index, mgs) {
      let queryAccountArr = [];
      this.flageSelect = !this.flageSelect;

      this.mediaTypeNewShow = true;
      if (!mgs) {
        if (this.siteCodeArr.length > 0) {
          this.siteCodeArr.forEach((val, index) => {
            if (index == 0) {
              if (!val) {
                this.siteList.forEach((val, index) => {
                  if (val.value) {
                    queryAccountArr.push(val.value);
                  }
                });
                this.flageSelect = true;
                this.siteCodeArr = queryAccountArr;
              } else {
                // if(!this.flageSelect){
                //   this.query.account = []
                //}
              }
            } else {
              this.siteCodeArr = [];
            }
          });
        }
      }

      this.query.account = this.siteCodeArr.join(",");
    },
    changeSite() {
      this.query.account = this.siteCodeArr.join(",");
      //this.crud.toQuery();
    },
    resetQueryData() {
      this.siteCodeArr = [];
      this.crud.resetQuery();
      if(this.user.isAdmin){
        this.query.deptId = this.user.deptInfo.deptId;
        this.mechanismSelectUpload = String(Math.random());
        this.siteFun(this.user.deptInfo.deptId);
      }
      this.query.correctType = this.dict.is_level[1].value;
      this.isEheckShow = true;
      this.sensitiveNum();
    },
    toQueryData() {
      this.crud.selections = [];
      this.crud.getTable().clearSelection();
      if (this.query.isEheck == 1 || this.query.isEheck == "") {
        this.isEheckShow = true;
      } else {
        this.isEheckShow = false;
      }
      this.crud.toQuery();
      this.sensitiveNum();
    },
    getCurrentMonthFirst() {
      this.query.timeFormat = [];
      var date = new Date();
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.query.timeFormat.push(date.getFullYear() + "-" + month + "-" + day);
      this.getCurrentMonthLast();
    },
    handleTimestamp(e) {
      let _this = this;
      _this.query.timeFormat = e;
      _this.$forceUpdate();
    },
    getCurrentMonthLast() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = new Date(year, month, 0);
      this.query.timeFormat.push(year + "-" + month + "-" + day.getDate());
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
      // if(this.query.timeFormat){
      //   if(this.query.timeFormat.length>0){
      //     Object.assign(this.statisticsList,{'scanDateStart':this.query.timeFormat[0],'scanDateEnd':this.query.timeFormat[1]})
      //   }
      // }else{
      //   this.statisticsList = this.query
      // }



      if(this.query.timeFormat){
        if(this.query.timeFormat.length>0){
          this.query.scanDateStart = this.query.timeFormat[0];
          this.query.scanDateEnd = this.query.timeFormat[1];
        }
      }

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
        //if(this.sensitiveCount) {
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
              center: ["50%", "54%"],
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
                        fontSize: 12
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
                        //color: 'rgba(0,0,0,0.30)',
                        fontSize: 12
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
                        fontSize: 12
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
                        fontSize: 12
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
      //        //this.sensitiveCount = res.data;
      //        //if(this.sensitiveCount) {
      //         this.optionPie = {
      //               tooltip: {
      //                   trigger: 'item',
      //                   formatter: '{a} <br/>{b} : {c} ({d}%)'
      //               },
      //               color:['#639CFF','#FF777C','#FCA327','#FDC551'],
      //               series: [
      //                   {
      //                       name: '访问来源',
      //                       type: 'pie',
      //                       radius: '55%',
      //                       center: ['50%', '50%'],
      //                       radius: ['40%', '60%'],

      //                       data: [
      //                           {value: this.seriousWord, name: '疑似严重错敏字','label': {
      //                                   formatter: [
      //                                       '{title|{b}}',
      //                                       '{value|{c}个 {d}%}',
      //                                   ].join('\n'),
      //                                   rich: {
      //                                       title: {
      //                                           align: 'center'
      //                                       }
      //                                   }
      //                               }},
      //                           {value: this.commonlyWord, name: '疑似一般错敏字','label': {
      //                                   formatter: [
      //                                       '{title|{b}}',
      //                                       '{value|{c}个 {d}%}',
      //                                   ].join('\n'),
      //                                   rich: {
      //                                       title: {
      //                                           align: 'center'
      //                                       }
      //                                   }
      //                               }},
      //                           {value: this.customSen, name: '自定义错敏字','label': {
      //                                   formatter: [
      //                                       '{title|{b}}',
      //                                       '{value|{c}个 {d}%}',
      //                                   ].join('\n'),
      //                                   rich: {
      //                                       title: {
      //                                           align: 'center'
      //                                       }
      //                                   }
      //                               }},
      //                           {value: this.slightWord, name: '疑似轻微错敏字','label': {
      //                                   formatter: [
      //                                       '{title|{b}}',
      //                                       '{value|{c}个 {d}%}',
      //                                   ].join('\n'),
      //                                   rich: {
      //                                       title: {
      //                                           align: 'center'
      //                                       }
      //                                   }
      //                               }},

      //                       ],
      //                       emphasis: {
      //                           itemStyle: {
      //                               shadowBlur: 10,
      //                               shadowOffsetX: 0,
      //                               shadowColor: 'rgba(0, 0, 0, 0.5)'
      //                           }
      //                       }
      //                   }
      //               ]
      //             }
      //      // }

      //     }
      // });
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

    siteFun(deptId) {
      // deptId: this.user.deptInfo.deptId

      if(this.user.isAdmin){
        let url = "/uDatabaseInfo/getAllList";
        let params = {
          deptId: deptId
        }
        dataHttpGet(url,params).then(res => {
          this.siteCodeArr = [];
          this.siteList = [];
          if (res.code == 200) {
            res.data.forEach((val, key) => {
              this.siteCodeArr.push(val.siteCode);
              this.siteList.push({
                name: val.name,
                value: val.siteCode,
                label: val.name
              });
            });
            this.siteList.unshift({ value: "", label: "", name: "全部" });

            this.query.account = this.siteCodeArr.join(",");

            if (res.data.length > 1 || this.mediaTypeNewShow) {
              this.mediaTypeShow = true;
            } else {
              this.mediaTypeShow = false;

              this.query.account = this.siteCodeArr.join(",");
            }
          }else{
            this.siteList = [];
            this.query.account = "";
          }

          this.query.delFlag = this.operationTypeList[0].value;
          this.query.isEheck = this.dataList[0].value;
          this.query.correctType = this.problemLevelList[1].value;
          this.crud.toQuery();
        });
      }else{
        getsiteList({ accountType: "1" , userId: this.user.id }).then(res => {
          this.siteCodeArr = [];
          if (res.code == 200) {
            res.data.forEach((val, key) => {
              this.siteCodeArr.push(val.accoutid);
              this.siteList.push({
                name: val.name,
                value: val.accoutid,
                label: val.name
              });
            });
            this.siteList.unshift({ value: "", label: "", name: "全部" });

            this.query.account = this.siteCodeArr.join(",");

            if (res.data.length > 1 || this.mediaTypeNewShow) {
              this.mediaTypeShow = true;
            } else {
              this.mediaTypeShow = false;

              this.query.account = this.siteCodeArr.join(",");
            }
          } else {
            this.siteList = [];
            this.query.account = "";
          }

          this.query.delFlag = this.operationTypeList[0].value;
          this.query.isEheck = this.dataList[0].value;
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
      this.query.exportType = num;
      this.ids = "";
      if (num == 1) {
        //导出所选的数据
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
        : (this.isCheckedAll = true);
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
    selectionChangeHandler() {
      this.$forceUpdate();
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

              del({ ids: ids.join(","), tableType: 0, type: num }).then(res => {
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
            del({ ids: ids, tableType: 0, type: num }).then(res => {
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

              del({ ids: ids.join(","), tableType: 0, type: num }).then(res => {
                if (res.code == 200) {
                  this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
                } else {
                  this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
                }
                this.crud.toQuery();
                this.crud.selections = [];
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
            del({ ids: ids, tableType: 0, type: num }).then(res => {
              if (res.code == 200) {
                this.crud.notify("操作成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              } else {
                this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
              }
              this.crud.toQuery();
              this.crud.selections = [];
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
</style>
