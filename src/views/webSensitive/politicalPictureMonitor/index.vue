<template>
  <div class="app-container dialogUniversalCharacter" v-loading="fullscreenLoading">
    <div class="siteMenuBox">
      <site-select
        v-bind:accountType="accountType"
        @getSiteCodeChecked="getSiteCodeChecked"
      ></site-select>
      <div class="zztpjcTabTit clearfix">
        <div class="tabListTit fl clearfix">
          <ul>
            <li
              :class="{ active: custormOrcurrency == 'currency' }"
              @click="tabStrategy('currency')"
            >
              <a href="javascript:;">默认策略</a>
            </li>
            <li
              :class="{ active: custormOrcurrency == 'custorm' }"
              @click="tabStrategy('custorm')"
            >
              <a href="javascript:;">自定义策略</a>
            </li>
          </ul>
        </div>
        <div class="fr clearfix wh60 startEndTime">
          <span class="main-aside-txt fl">时间：</span>
          <el-date-picker
            style="width: 200px;"
            :clearable="false"
            v-model="timeFormat"
            @change="dateChangebirthday"
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
      </div>
    </div>
    <div v-if="validExamine">
      <div class="celuFilterCondition">
        <div class="celuListBox clearfix">
          <div class="fl celuListTit">人物库</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: peopleLibrary === 'all' }"
            @click="selectCon('peopleLibrary', 'all')"
          >
            全部
          </div>
          <div class="fl celuListBtn">
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: peopleLibrary === 'cloud' }"
                @click="selectCon('peopleLibrary', 'cloud')"
                >开普云</span
              >
            </span>
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: peopleLibrary === 'custom' }"
                @click="selectCon('peopleLibrary', 'custom')"
                >自定义</span
              >
            </span>
            <div class="reset-btn fr">
              <el-button type="primary" @click="resetQuery()">重置</el-button>
            </div>
          </div>
        </div>
        <div
          class="celuListBox clearfix"
          v-if="peopleLibrary === 'custom' || peopleLibrary === 'all'"
        >
          <div class="fl celuListTit">自定义人物</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: customList.length == 0 }"
            @click="customAll('customList')"
          >
            全部
          </div>
          <div class="fl celuListBtn clearfix">
            <!-- <div class="btnAllCon fl">
                <span class="celuBtnCon" v-for="(item,index) in customList" :key="index">
                  <span class="btnValue active">{{item.name}}
                    <svg class="icon svg-icon-operW12" aria-hidden="true" @click="removeData('customList',index)">
                      <use xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                    </svg>
                  </span>
                </span>
              </div> -->
            <div class="addFilter fr" @click="screenFun('customFrame')">
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#iconshaixuan"></use>
              </svg>
              筛选
            </div>
            <div
              class="btnShowHide fr"
              @click="shrinkFun('shrinkShow', false)"
              v-if="shrinkShow && customList.length > 0"
            >
              收起
              <svg class="icon svg-icon-operW12" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban51" fill="#1890FF"></use>
              </svg>
            </div>
            <div
              class="btnShowHide fr"
              @click="shrinkFun('shrinkShow', true)"
              v-if="!shrinkShow && customList.length > 0"
            >
              展开
              <svg class="icon svg-icon-operW12" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban50" fill="#1890FF"></use>
              </svg>
            </div>
            <div
              class="btnAllCon fl"
              :class="{ 'shrink-height': !shrinkShow && customList.length > 0 }"
            >
              <!-- <span  class="celuBtnCon">
                  <span data-v-182b5c89="" class="btnValue active">周永康
                  <svg  aria-hidden="true" class="icon svg-icon-operW12">
                    <use data-v-182b5c89="" xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                  </svg>
                 </span>
                </span> -->
              <span
                class="celuBtnCon"
                v-for="(item, index) in customList"
                :key="index"
              >
                <span class="btnValue active"
                  ><span class="itemName fl">{{ item.name }}</span>
                  <svg
                    class="icon svg-icon-operW12"
                    aria-hidden="true"
                    @click="removeData('customList', index)"
                  >
                    <use xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div
          class="celuListBox clearfix"
          v-if="peopleLibrary === 'cloud' || peopleLibrary === 'all'"
        >
          <div class="fl celuListTit">通用人物</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: currencyList.length == 0 }"
            @click="customAll('currencyList')"
          >
            全部
          </div>
          <div class="fl celuListBtn clearfix" ref="currencyRef">
            <!-- <div class="btnAllCon fl">
                <span class="celuBtnCon" v-for="(item,index) in currencyList" :key="index">
                  <span class="btnValue active">{{item.name}}
                    <svg class="icon svg-icon-operW12" aria-hidden="true" @click="removeData('currencyList',index)">
                      <use xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                    </svg>
                  </span>
                </span>
              </div> -->
            <div
              class="addFilter fr"
              @click="screenFun('currencyFrame', currencyList)"
            >
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#iconshaixuan"></use>
              </svg>
              筛选
            </div>
            <div
              class="btnShowHide fr"
              @click="shrinkFun('shrinkShow2', true)"
              v-if="!shrinkShow2 && currencyList.length > 0"
            >
              展开
              <svg class="icon svg-icon-operW12" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban50" fill="#1890FF"></use>
              </svg>
            </div>
            <div
              class="btnShowHide fr"
              @click="shrinkFun('shrinkShow2', false)"
              v-if="shrinkShow2 && currencyList.length > 0"
            >
              收起
              <svg class="icon svg-icon-operW12" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban51" fill="#1890FF"></use>
              </svg>
            </div>
            <div
              class="btnAllCon fl"
              :class="{
                'shrink-height': !shrinkShow2 && currencyList.length > 0
              }"
            >
              <!-- <span  class="celuBtnCon">
                  <span data-v-182b5c89="" class="btnValue active">周永康
                    <svg  aria-hidden="true" class="icon svg-icon-operW12">
                      <use data-v-182b5c89="" xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                    </svg>
                 </span>
                </span> -->
              <span
                class="celuBtnCon"
                v-for="(item, index) in currencyList"
                :key="index"
              >
                <span class="btnValue active"
                  ><span class="itemName fl">{{ item.name }}</span>
                  <svg
                    class="icon svg-icon-operW12"
                    aria-hidden="true"
                    @click="removeData('currencyList', index)"
                  >
                    <use xlink:href="#icontubiaozhizuomoban4" fill="#fff"></use>
                  </svg>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div
          class="celuListBox clearfix"
          v-if="custormOrcurrency == 'currency'"
        >
          <div class="fl celuListTit">相似值</div>
          <div class="fl celuListBtn" style="padding-top: 5px;margin-left: 17px;width: calc(100% - 131px);">
            <!-- <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: similarityValue === '4' }"
                @click="selectCon('similarityValue', '4')"
                >0～0.4</span
              >
            </span> -->
            <div class="slider-con">
              <span>50%</span>
              <el-slider
                v-model="sliderValue"
                tooltip-class="sliderTip"
                range
                :min="50"
                :max="100"
                @change="selectCon('similarityValue')"
              >
              </el-slider>
              <span>100%</span>
            </div>

            <!-- <span
              class="celuBtnCon"
              v-for="ele in similarityValueList"
              :key="ele.label"
            >
              <span
                class="btnValue"
                :class="{ active: similarityValue.includes(ele.value) }"
                @click="selectCon('similarityValue', ele.value)"
                >{{ ele.label }}</span
              >
            </span> -->
            <!-- <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: similarityValue === '6' }"
                @click="selectCon('similarityValue', '6')"
                >0.6～0.7</span
              >
            </span>
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: similarityValue === '7' }"
                @click="selectCon('similarityValue', '7')"
                >0.7～0.8</span
              >
            </span>
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: similarityValue === '8' }"
                @click="selectCon('similarityValue', '8')"
                >0.8～0.9</span
              >
            </span>
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: similarityValue === '9' }"
                @click="selectCon('similarityValue', '9')"
                >0.9~1.0</span
              >
            </span> -->
          </div>
        </div>
        <div
          class="celuListBox clearfix"
          v-if="custormOrcurrency == 'currency'"
        >
          <div class="fl celuListTit">数据</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: dataLibrary === 'all' }"
            @click="selectCon('dataLibrary', 'all')"
          >
            全部
          </div>
          <div class="fl celuListBtn">
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: dataLibrary === 'notReviewed' }"
                @click="selectCon('dataLibrary', 'notReviewed')"
                >未审核</span
              >
            </span>
            <span class="celuBtnCon">
              <span
                class="btnValue"
                :class="{ active: dataLibrary === 'reviewed' }"
                @click="selectCon('dataLibrary', 'reviewed')"
                >已审核</span
              >
            </span>
          </div>
        </div>

        <div
          class="celuListBox clearfix"
          v-if="dataLibrary === 'reviewed' && custormOrcurrency == 'currency'"
        >
          <div class="fl celuListTit">操作类型</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: operationTypeCloud }"
            @click="selectCheckedAll('operationTypeList')"
          >
            全部
          </div>
          <div class="fl celuListBtn">
            <span
              class="celuBtnCon"
              v-for="(item, index) in operationTypeList"
              :key="index"
            >
              <span
                class="btnValue"
                :class="{ active: item.isCheck }"
                @click="selectChecked('operationTypeList', index)"
                >{{ item.name }}</span
              >
            </span>
          </div>
        </div>

        <div class="celuListBox clearfix" v-if="custormOrcurrency == 'custorm'">
          <div class="fl celuListTit">操作类型</div>
          <div
            class="fl celuListFiltersALL"
            :class="{ active: operationTypeCloud }"
            @click="selectCheckedAll('operationTypeList2')"
          >
            全部
          </div>
          <div class="fl celuListBtn">
            <span
              class="celuBtnCon"
              v-for="(item, index) in operationTypeList2"
              :key="index"
            >
              <span
                class="btnValue"
                :class="{ active: item.isCheck }"
                @click="selectChecked('operationTypeList2', index)"
                >{{ item.name }}</span
              >
            </span>
          </div>
        </div>
      </div>

      <div class="viewFilter clearfix">
        <div class="selectAll fl clearfix">
          <!--icontubiaozhizuomoban40默认，39滑过，38选中状态-->
          <div class="btnAllSelectSVG fl">
            <!-- <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban40"></use>
              </svg>
              <svg class="icon svg-icon-operW16" aria-hidden="true" style="display: none;">
                <use xlink:href="#icontubiaozhizuomoban39"></use>
              </svg>
              <svg class="icon svg-icon-operW16" aria-hidden="true" style="display: none;">
                <use xlink:href="#icontubiaozhizuomoban38"></use>
              </svg> -->

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
          </div>
          <div class="fl btnAllSelectWord">全选</div>
        </div>
        <div class="fl btnViewAllBox clearfix">
          <el-tooltip class="item" effect="dark" content="对比"
          :enterable="false"
          placement="top">
            <div
              class="btnViewIcon fl"
              @click="listExhibition('contrast')"
              :class="{ active: listRegion === 'contrast' }"
            >
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban48"></use>
              </svg>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="卡片" placement="top" :enterable="false">
            <div
              class="btnViewIcon fl"
              @click="listExhibition('monitor')"
              :class="{ active: listRegion === 'monitor' }"
            >
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban47"></use>
              </svg>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="列表" placement="top" :enterable="false">
            <div
              class="btnViewIcon fl"
              @click="listExhibition('list')"
              :class="{ active: listRegion === 'list' }"
            >
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban46"></use>
              </svg>
            </div>
          </el-tooltip>
        </div>
        <div class="btnRtSearch">
          <span>
            <el-button
              class="filter-item"
              size="small"
              :class="{ disabled: crud.selections.length === 0 }"
              @click="warnOrPass(crud.selections, 'warn', 'batch')"
              >预警
            </el-button>
            <el-button
              class="filter-item"
              size="small"
              :class="{ disabled: crud.selections.length === 0 }"
              @click="warnOrPass(crud.selections, 'pass', 'batch')"
              >通过
            </el-button>
            <el-button
              class="filter-item"
              size="small"
              :class="{ disabled: crud.selections.length === 0 }"
              @click="warnOrPass(crud.selections, 'noPass', 'batch')"
              >不通过
            </el-button>
            <!-- <el-button class="filter-item" size="small" type="primary">导出</el-button> -->
            <el-dropdown @command="handleCommand" style="margin-left: 4px;">
              <el-button type="primary">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="downMenuExport">
                <!-- <el-dropdown-item>导出当前页</el-dropdown-item>
                  <el-dropdown-item>全部导出</el-dropdown-item> -->
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
          </span>
        </div>
      </div>

      <div class="clearfix">
        <!--暂无数据 start -->
        <div
          class="policyConfigBox monitorNoData noDataKapian"
          v-if="crud.data.length == 0 && listRegion === 'monitor'"
        >
          <div class="noDataBox">
            <div>
              <svg aria-hidden="true" class="icon svg-icon-diaOperWh">
                <use xlink:href="#iconkongbaiye1"></use>
              </svg>
            </div>
            <div class="noDataWord">暂无数据</div>
          </div>
        </div>
        <!--暂无数据 end-->
        <!--列表查看 start-->
        <div class="viewCon" v-if="listRegion === 'list'">
          <!--表格渲染 ref="table"-->
          <el-table
            class="tableColumnWh"
            ref="listPowerSupplyTab"
            :data="crud.data"
            @select="crud.selectChange"
            @selection-change="checkOneList"
            v-loading="crud.loading"
            lazy
          >
            <el-table-column type="selection" width="34" align="center" />
            <el-table-column
              label="NO"
              type="index"
              align="center"
              width="40"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              label="图片人物名称"
              prop="name"
              min-width="13%"
            >
              <template slot-scope="scope">
                <span>{{ nameToStr(scope.row.dataItemBackVoList) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="replaces"
              label="图片"
              min-width="7%"
            >
              <template slot-scope="scope">
                <span class="con-hover" @click="viewOriginalResults(scope.row)"
                  >查看</span
                >
                <!-- <el-dropdown
                  class="linkLookC"
                  placement="bottom"
                  v-if="
                    scope.row.status != null &&
                      scope.row.status != 0 &&
                      scope.row.updateImg
                  "
                >
                  <span class="el-dropdown-link">
                    查看<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="dropdownPicMenu">
                    <el-dropdown-item class="fl">
                      <div class="originalResultPic">
                        <div class="tit">原结果</div>
                        <div class="pic">
                          <div class="resultPic">
                            <img
                              v-if="scope.row.resImage"
                              :src="urlImage + scope.row.resImage.substring(1)"
                            />
                          </div>
                        </div>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item class="fl">
                      <div class="modifyAfterPic">
                        <div class="tit">修改后</div>
                        <div class="pic">
                          <div class="resultPic">
                            <img
                              v-if="scope.row.updateImg"
                              :src="urlImage + scope.row.updateImg.substring(1)"
                            />
                          </div>
                        </div>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="value"
              label="相似值"
              min-width="10.5%"
            >
              <template slot-scope="scope">
                <span>{{ valueToStr(scope.row.dataItemBackVoList) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="originUrl"
              label="所在地址"
              min-width="16%"
            >
              <template slot-scope="scope">
                <a
                  :href="scope.row.originUrl"
                  target="_blank"
                  class="linkColorBlue"
                  >{{ scope.row.originUrl }}</a
                >
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="referUrl"
              label="父页面地址"
              min-width="16%"
            >
              <template slot-scope="scope">
                <a
                  :href="scope.row.referUrl"
                  target="_blank"
                  class="linkColorBlue"
                  >{{ scope.row.referUrl }}</a
                >
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="siteName"
              label="网站名称"
              min-width="11%"
            >
              <template slot-scope="scope">
                <a href="javascript:;" class="linkColorBlue">{{
                  scope.row.siteName
                }}</a>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="scanDate"
              label="监测时间"
              align="center"
              min-width="14%"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              prop="isMonitor"
              width="152px"
            >
              <template slot-scope="scope">
                <div class="tabIiconOperate">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <button @click="crud.toEdit(scope.row)">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban2"></use>
                      </svg>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="预警"
                    placement="top"
                  >
                    <button @click="warnOrPass(scope.row, 'warn')">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban24"></use>
                      </svg>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="不通过"
                    placement="top"
                  >
                    <button @click="warnOrPass(scope.row, 'noPass')">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban61"></use>
                      </svg>
                    </button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="通过"
                    placement="top"
                  >
                    <button @click="warnOrPass(scope.row, 'pass')">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use xlink:href="#icontubiaozhizuomoban62"></use>
                      </svg>
                    </button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </div>
        <!--列表查看 end-->
        <!--对比查看 start-->
        <template v-if="listRegion === 'contrast'">
          <div class="viewCon clearfix" ref="fixBoxPar">
            <div
              class="thumbnailBox fl"
              ref="fixBox"
              :class="{ fixTypeBox: ifBoxFixed }"
              v-loading="fullscreenLoading"
            >
              <div class="figureThumbnail">
                <div class="name" v-if="images[currentIndex]">
                  {{ images[currentIndex].name }}
                </div>
                <div class="bigPicture">
                  <div class="centerPic" ref="centerPic">
                    <!-- <img src="../../../assets/images/background.jpg">  .substring(1)-->
                    <img
                    v-lazy="images[currentIndex].img"
                    :key="currentIndex"
                    alt=""
                    style="width:100%;height:100%"
                    @click="imgHandler"
                    v-if="images[currentIndex]"
                  />
                    <!-- <el-image
                      :src="images[currentIndex].img"
                      @click="imgHandler"
                      v-if="images[currentIndex]"
                      fit="cover"
                    ></el-image> -->
                  </div>
                </div>
                <div class="smallPicture">
                  <div class="leftArrow fl active" @click="prev('mySwiper')">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div
                    class="swiper-container swiper-container1"
                    v-show="swiperSlideList.length > 0"
                  >
                    <div class="swiper-wrapper" ref="mySwiper">
                      <div
                        class="swiper-slide"
                        v-for="(item, index) in swiperSlideList"
                        :key="index"
                      >
                        <div
                          class="smallPicBg"
                          :class="{ borderClass: currentIndex == index }"
                        >
                          <!-- <el-image
                            v-if="item.img"
                            :src="item.img"
                            fit="cover"
                          ></el-image> -->
                          <img v-lazy="item.img" v-if="item.img" style="object-fit: cover;width:100%;height:100%"/>
                        </div>

                        <div class="name">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="rightArrow fl" @click="next('mySwiper')">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="characterPicList fr">
              <ul class="ulList clearfix" >
                <!-- class="active" v-if="labelNames"-->
                <li
                  v-for="(item, index) in crud.data"
                  :key="index"
                  :class="{ active: item.isChecked }"
                >
                  <a class="item-a" href="javascript:;">
                    <div class="item">
                      <!-- <el-image
                        :src="urlImage + item.resImage.substring(1)"
                        v-if="item.status && item.status == 0 && item.resImage"
                        fit="cover"
                      ></el-image>
                      <el-image
                        :src="urlImage + item.updateImg.substring(1)"
                        v-if="
                          item.status != null &&
                            item.status != 0 &&
                            item.updateImg
                        "
                        fit="cover"
                      ></el-image>
                    -->

                      <img
                      v-lazy="urlImage + item.resImage.substring(1)"
                      v-if="
                      item.status && item.status == 0 && item.resImage
                      "
                      fits="cover"
                    />
                      <img
                      v-lazy="urlImage + item.updateImg.substring(1)"
                        v-if="
                          item.status != null &&
                            item.status != 0 &&
                            item.updateImg
                        "
                        fits="fill"
                      />
                      <img v-if="item.status != null && item.status != 0 && !item.updateImg" v-lazy="item.originalImg"/>

                      <div class="characterPicHoverBox">
                        <div class="marTopBom">
                          <div class="multipleSimilarPeople">
                            <div
                              class="characterSimilarity clearfix"
                              v-for="(items, indexs) in item.dataItemBackVoList"
                              :key="indexs"
                            >
                              <span class="name" v-if="items.value!==0 && items.value>=0.5">{{ items.name }}</span>
                              <span class="similarity" v-if="items.value!==0 && items.value>=0.5"
                                >相似度{{
                                  `${parseInt(items.value * 100)}%`
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                        <div class="editWarn">
                          <!-- <svg class="icon svg-icon-operW22" aria-hidden="true" @click="crud.toEdit(item)">
                        <use xlink:href="#icontubiaozhizuomoban2" fill="#fff"></use>
                      </svg> -->
                          <a href="javascript:;" @click="crud.toEdit(item)"
                            >编辑</a
                          >
                          <a
                            href="javascript:;"
                            @click="warnOrPass(item, 'warn')"
                            >预警</a
                          >
                          <a
                            href="javascript:;"
                            @click="warnOrPass(item, 'pass')"
                            >通过</a
                          >
                          <a
                            href="javascript:;"
                            @click="warnOrPass(item, 'noPass')"
                            >不通过</a
                          >
                        </div>
                        <div class="addressBox">
                          <a class="fl" :href="item.originUrl" target="_blank"
                            >所在地址</a
                          >
                          <a class="fr" :href="item.referUrl" target="_blank"
                            >父页面地址</a
                          >
                        </div>
                      </div>
                      <div class="originalResult">
                        <el-button
                          type="primary"
                          @click="viewOriginalResults(item)"
                          v-if="item.status != null && item.status != 0"
                          >原结果</el-button
                        >
                        <el-button
                          v-else
                          type="primary"
                          @click="viewImage(item)"
                          >查看</el-button
                        >
                      </div>
                      <div class="selectDefault">
                        <svg
                          class="icon svg-icon-operW44"
                          aria-hidden="true"
                          @click="checkOne(index)"
                        >
                          <use xlink:href="#icontubiaozhizuomoban49"></use>
                        </svg>
                      </div>
                    </div>
                    <!-- <img
                    :src="urlImage + item.resImage.substring(1)"
                    v-if="item.status && item.status == 0 && item.resImage"
                  />
                  <img
                    :src="urlImage + item.updateImg.substring(1)"
                    v-if="
                      item.status != null && item.status != 0 && item.updateImg
                    "
                  /> -->
                  </a>
                </li>
              </ul>

              <div
                class="policyConfigBox monitorNoData noDataBig"
                v-if="crud.data.length == 0"
              >
                <div class="noDataBox">
                  <div>
                    <svg aria-hidden="true" class="icon svg-icon-diaOperWh">
                      <use xlink:href="#iconkongbaiye1"></use>
                    </svg>
                  </div>
                  <div class="noDataWord">暂无数据</div>
                </div>
              </div>
              <!--分页组件-->
              <pagination :pageSizes="[10]"/>
            </div>
          </div>
        </template>
        <!--对比查看 end-->
        <!--卡片查看 start-->
        <div class="viewCon" v-if="listRegion === 'monitor'">
          <div class="characterPicList cardPicList">
            <ul class="ulList clearfix">
              <li
                v-for="(item, index) in crud.data"
                :key="index"
                :class="{ active: item.isChecked }"
              >
                <a href="javascript:;" class="item-a">
                  <div class="item">
                    <div class="cardPic">
                      <!-- <img :src="urlImage+item.resImage.substring(1)"> -->
                      <!-- <img
                      :src="urlImage + item.resImage.substring(1)"
                      v-if="item.status && item.status == 0 && item.resImage"
                    />
                    <img
                      :src="urlImage + item.updateImg.substring(1)"
                      v-if="
                        item.status != null &&
                          item.status != 0 &&
                          item.updateImg
                      "
                    /> -->
                    <img
                      v-lazy="urlImage + item.resImage.substring(1)"
                      v-if="
                      item.status && item.status == 0 && item.resImage
                      "
                      fits="cover"
                    />
                    <img
                    v-lazy="urlImage + item.updateImg.substring(1)"
                    fits="fill"
                      v-if="
                        item.status != null &&
                          item.status != 0 &&
                          item.updateImg
                      "
                    />
                    <img v-if="item.status != null && item.status != 0 && !item.updateImg" v-lazy="item.originalImg"/>

                      <!-- <el-image
                        :src="urlImage + item.resImage.substring(1)"
                        v-if="item.status && item.status == 0 && item.resImage"
                        fits="cover"
                      ></el-image>
                      <el-image
                        v-lazy="urlImage + item.updateImg.substring(1)"
                        v-if="
                          item.status != null &&
                            item.status != 0 &&
                            item.updateImg
                        "
                        fits="fill"
                      ></el-image> -->
                    </div>
                    <!-- <div class="characterSimilarity clearfix">
                          <span class="name fl">周永康</span>
                          <span class="similarity fr">相似度96.9%</span>
                        </div> -->
                    <div class="characterPicHoverBox">
                      <div class="marTopBom">
                        <div class="multipleSimilarPeople">
                          <div
                            class="characterSimilarity clearfix"
                            v-for="(items, indexs) in item.dataItemBackVoList"
                            :key="indexs"
                          >
                            <span class="name" v-if="items.value!==0 && items.value>=0.5  ">{{ items.name ? items.name : 'XXX' }}</span>
                            <span class="similarity" v-if="items.value!==0 && items.value>=0.5"
                              >相似度{{
                                  `${parseInt(items.value * 100)}%`
                              }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="editWarn">
                        <!-- <svg class="icon svg-icon-operW22" aria-hidden="true" @click="crud.toEdit(item)">
                        <use xlink:href="#icontubiaozhizuomoban2" fill="#fff"></use>
                      </svg> -->
                        <a href="javascript:;" @click="crud.toEdit(item)"
                          >编辑</a
                        >
                        <a href="javascript:;" @click="warnOrPass(item, 'warn')"
                          >预警</a
                        >
                        <a href="javascript:;" @click="warnOrPass(item, 'pass')"
                          >通过</a
                        >
                        <a
                          href="javascript:;"
                          @click="warnOrPass(item, 'noPass')"
                          >不通过</a
                        >
                      </div>
                      <div class="addressBox">
                        <a class="fl" :href="item.originUrl" target="_blank">所在地址</a>
                        <a class="fr" :href="item.referUrl" target="_blank">父页面地址</a>
                      </div>
                    </div>
                    <!--  -->
                    <div class="originalResult">
                      <el-button
                        type="primary"
                        @click="viewOriginalResults(item)"
                        v-if="item.status != null && item.status != 0"
                        >原结果</el-button
                      >
                      <el-button v-else type="primary" @click="viewImage(item)"
                        >查看</el-button
                      >
                    </div>
                    <div class="selectDefault">
                      <svg
                        class="icon svg-icon-operW44"
                        aria-hidden="true"
                        @click="checkOne(index)"
                      >
                        <use xlink:href="#icontubiaozhizuomoban49"></use>
                      </svg>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
            <!--分页组件-->
            <pagination :pageSizes="[10]"/>
          </div>
        </div>
        <!--卡片查看 end-->
      </div>
    </div>

    <!--配置自定义策略 start -->
    <div class="policyConfigBox" v-else>
      <div class="noDataBox">
        <div>
          <svg aria-hidden="true" class="icon svg-icon-diaOperWh">
            <use xlink:href="#iconkongbaiye1"></use>
          </svg>
        </div>
        <div class="noDataWord">自定义策略暂无配置，请配置好再来查看啊！</div>
        <div class="goPolicyConfig">
          <!-- @click="jump" -->
          <el-button type="primary">
            <a href="#/sensitiveStrategy/sensitiveImageStrategy" class=""
              >审核策略配置</a
            >
          </el-button>
        </div>
      </div>
    </div>
    <!--配置自定义策略 end-->
    <!--原结果弹框 start-->
    <el-dialog
      title="查看"
      width="734px"
      class="dialogOriginalResult"
      :append-to-body="true"
      :visible.sync="oriResDialogVisible"
      @close="closeDialogViewImages"
    >
      <div class="clearfix">
        <div class="fl originalResultPic">
          <div class="tit">
            {{ `${originalAndUpdateImgList.isUpdate ? "原结果" : "目标人脸"}` }}
          </div>
          <div class="pic">
            <div class="resultPic">
              <!-- <img
                :src="originalAndUpdateImgList.originalImg"
                v-if="originalAndUpdateImgList.originalImg"
              /> -->
              <el-image
                v-if="originalAndUpdateImgList.originalImg"
                :src="originalAndUpdateImgList.originalImg"
                :preview-src-list="srcListDialog"
                lazy
              >
              </el-image>
            </div>
          </div>
        </div>
        <div class="fl modifyAfterPic">
          <div class="tit">
            {{ `${originalAndUpdateImgList.isUpdate ? "修改后" : "监测结果"}` }}
          </div>
          <div class="pic">
            <div class="resultPic">
              <!-- <img
                :src="originalAndUpdateImgList.updateImg"
                v-if="originalAndUpdateImgList.updateImg"
              /> -->
              <el-image
                v-if="originalAndUpdateImgList.updateImg"
                :src="originalAndUpdateImgList.updateImg"
                :preview-src-list="srcListDialog"
              >
              </el-image>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--原结果弹框 start-->
    <!--编辑人物头像弹框 start-->
    <el-dialog
      width="726px"
      class="dialogEditAvatar"
      append-to-body
      :title="crud.status.title ? crud.status.title : '编辑'"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
    >
      <div class="clearfix">
        <el-form
          ref="form"
          :model="form"
          size="small"
          label-width="88px"
          class="markAvatarList"
        >
          <div class="characterAvatar">
            <div class="picBoxVerCen">
              <img
                :src="urlImage + form.resImage.substring(1)"
                v-if="form.resImage"
                @click="viewImage({ resImage: form.resImage })"
              />
            </div>
          </div>
          <div class="picAvatarTit">图片中的人物头像</div>
          <div class="smallPicture clearfix">
            <div class="leftArrow active fl" @click="prev('mySwiper1')">
              <i class="el-icon-arrow-left"></i>
            </div>
            <!-- <swiper :options="swiperOptionThumbs1" class="gallery-thumbs fl" ref="mySwiper1">
                      <swiper-slide class="swiper-slide games" v-for="(item, index) in politicsDataItemBackVoList" :key="index">
                       <div class="smallPicBg"><img :src="item.faceImgs"></div>
                        <div class="name">{{item.name}}</div>
                        <el-checkbox v-model="item.checked" class="checkboxAvatar"></el-checkbox>
                      </swiper-slide>
                    </swiper> -->
            <div
              class="swiper-container swiper-container2"
              v-show="politicsDataItemBackVoList.length > 0"
            >
              <div class="swiper-wrapper">
                <div
                  class="swiper-slide"
                  v-for="(item, index) in politicsDataItemBackVoList"
                  :key="index"
                >
                  <el-tooltip
                    class="item beyondTextCon"
                    effect="dark"
                    :content="item.name"
                    :disabled="!item.name"
                    placement="top"
                  >
                    <el-checkbox v-model="item.checked" class="checkboxAvatar">
                      <div class="smallPicBg">
                        <img
                          :src="urlImage + item.faceImgs.substring(1)"
                          v-if="item.faceImgs"
                        />
                        <div class="name">{{ item.name }}</div>
                      </div>
                    </el-checkbox>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="rightArrow fr" @click="next('mySwiper1')">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="characterDetailsList">
            <ul class="clearfix">
              <li
                class="markAvatarList"
                v-for="(item, index) in politicsDataItemBackVoList"
                :key="index"
                :class="{ 'no-checked': !item.checked }"
              >
                <div class="item-main" v-if="item.checked">
                  <div class="xuhao">
                    {{
                      parseInt(item.num) > 9
                        ? parseInt(item.num) + 1
                        : "0" + (parseInt(item.num) + 1)
                    }}
                  </div>
                  <el-form-item label="是否标记：" class="marNot">
                    <el-radio-group
                      v-model="item.isSign"
                      @change="
                        val => {
                          radioChange(val, index);
                        }
                      "
                    >
                      <el-radio label="1" key="1">是</el-radio>
                      <el-radio label="0" key="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="人物名：">
                    <el-input
                      v-model="item.name1"
                      :disabled="item.isSign == false"
                      class="characterName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="相似值：">
                    <el-input
                      v-model="item.value1"
                      :disabled="item.isSign == false"
                      class="similarVal"
                    ></el-input>
                    <span class="percentage">%</span>
                  </el-form-item>
                </div>
              </li>
            </ul>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button type="text" :loading="crud.status.cu === 2" @click="crud.submitCU(3)">确定并预警</el-button>
        <el-button type="primary" :loading="crud.status.cu === 2" @click="crud.submitCU(1)"
          >确定并通过</el-button
        >
      </div>
    </el-dialog>
    <!--编辑人物头像弹框 start-->
    <!--选择通过、不通过、预警弹框 start-->
    <el-dialog
      :title="'选择' + warnOrPassTitle"
      width="450px"
      class="dialogWarnOrPass"
      :append-to-body="true"
      :visible.sync="warnOrPassDialogVisible"
    >
      <el-form ref="form" :model="form" size="small" class="selectPublicRadio">
        <el-form-item :label="warnOrPassTitle + '：'">
          <el-radio-group v-model="isWarn">
            <el-radio label="1" key="1">{{ warnOrPassRadio1 }}</el-radio>
            <el-radio label="0" key="0">{{ warnOrPassRadio2 }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="warnOrPassDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="warnOrPassDialogFun()"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!--选择通过、不通过、预警弹框 end-->
    <!-- 自定义人物弹框 start -->
    <component
      v-bind:is="model"
      ref="modelElem"
      :dialogVisible2="dialogVisible2"
      @closeDialog="closeDialog"
    >
    </component>
    <!--自定义人物弹框end-->
    <el-image
      v-if="viewImages.length > 0"
      ref="viewImg"
      :preview-src-list="viewImages"
    ></el-image>
  </div>
</template>
<script>
import SiteSelect from "@/components/SiteSelect";
import {
  getlistFigure,
  getValidExamine,
  getlistPicture,
  getPoliticsDataBy,
  updateStatuse,
  exportData
} from "@/api/politicalPictureMonitor/index";
import crudCustom from "@/api/politicalPictureMonitor/crudCustom";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import customFrame from "@/components/PeopleLibrary/custom";
import currencyFrame from "@/components/PeopleLibrary/currency";
//import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import { downloadFilePost, downloadFile } from '@/utils/index';
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.js";

import qs from "qs";

const defaultForm = {
  id: null,
  siteCode: "",
  politicsDataItemBackVoList: null
};
let vmNew = null;
export default {
  name: "politicalPictureMonitor",
  components: {
    SiteSelect,
    customFrame,
    currencyFrame,
    pagination
  },
  cruds() {
    return CRUD({
      title: "自定义人物",
      url: "/politics/data/list",
      queryOnPresenterCreated: false,
      newAddRefresh: true,
      crudMethod: {
        ...crudCustom
      }
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    // 自定义验证
    return {
      siteList: [],
      siteCodeArr: [],
      peopleLibrary: "all",
      // similarityValue: ["all"],
      dataLibrary: "notReviewed",
      operationType: "all",
      sliderValue: [50, 100],
      customList: [
        // {"name":"周永康","":"1"},
        // {"name":"周永康","":"2"},
      ],
      currencyList: [
        // {"name":"errew","":"1"},
        // {"name":"周永康","":"2"},
      ],
      model: "customFrame",
      dialogVisible2: false,
      oriResDialogVisible: false, //原结果
      listRegion: "contrast",
      shrinkShow: false,
      shrinkShow2: false,
      images: [], //数据
      currentIndex: 0, //一开始设置为 0
      swiperOptionThumbs: {
        spaceBetween: 10,
        //centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true,
        pagination: {
          el: ".swiper-pagination",
          // type : 'progressbar', //分页器形状
          clickable: true //点击分页器的指示点分页器会控制Swiper切换
        },
        on: {
          //slice点击事件
          click: function() {
            const that = this;
            vmNew.handleClickSlide(that,'one'); //引用：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法
          }
        },
        preventLinksPropagation: false
      },
      swiperOptionThumbs1: {
        spaceBetween: 10,
        //centeredSlides: true,
        slidesPerView: "auto",
        touchRatio: 0.2,
        slideToClickedSlide: true,
        pagination: {
          el: ".swiper-pagination",
          // type : 'progressbar', //分页器形状
          clickable: true //点击分页器的指示点分页器会控制Swiper切换
        },
        preventLinksPropagation: false
      },
      validExamine: true,
      custormOrcurrency: "currency",
      accountType: "1",
      timeFormat: "",
      swiperSlideList: [],
      warnOrPassDialogVisible: false,
      isWarn: "1",
      warnOrPassTitle: "",
      warnOrPassRadio1: "",
      warnOrPassRadio2: "",
      isCheckedAll: false,
      originalAndUpdateImgList: {
        originalImg: "",
        updateImg: "",
        isUpdate: false
      },
      srcListDialog: [],
      viewImages: [],
      cloudCharacter: [], //开普云人物编码
      custormCharacter: [], //自定义人物编码
      operationTypeList: [
        {
          name: "人工通过",
          id: "1"
        },
        {
          name: "人工修改通过",
          id: "4"
        },
        {
          name: "自动通过",
          id: "7"
        },
        {
          name: "人工不通过",
          id: "2"
        },
        {
          name: "人工预警",
          id: "3"
        },
        {
          name: "人工修改预警",
          id: "5"
        },
        {
          name: "自动预警",
          id: "6"
        }
      ],
      operationTypeCloud: true,
      operationTypeList2: [
        {
          name: "人工通过",
          id: "1"
        },
        {
          name: "人工不通过",
          id: "2"
        },
        {
          name: "人工预警",
          id: "3"
        },
        {
          name: "自动通过",
          id: "7"
        },
        {
          name: "自动预警",
          id: "6"
        }
      ],
      politicsDataItemBackVoList: [],
      mySwiper: false,
      mySwiper1: false,
      customListArr: [],
      warnOrPassData: "",
      warnOrPassStatus: "",
      all_list: [
        {
          label: "全部导出",
          value: "0"
        },
        {
          label: "导出当前页",
          value: "1"
        }
      ],
      batchOrsingleType: "",
      fullscreenLoading: false,
      urlImage: process.env.VUE_APP_BASE_API,
      // similarityValueList: [
      //   {
      //     label: "0.5~0.6",
      //     value: "5"
      //   },
      //   {
      //     label: "0.6~0.7",
      //     value: "6"
      //   },
      //   {
      //     label: "0.7~0.8",
      //     value: "7"
      //   },
      //   {
      //     label: "0.8~0.9",
      //     value: "8"
      //   },
      //   {
      //     label: "0.9~1.0",
      //     value: "9"
      //   }
      // ],
      labelNames: "",
      isLoading: false,
      ifBoxFixed: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
    // swiper() {
    //   return this.$refs.mySwiper.swiper
    // }
    getPoliticsDataItemBackVoList() {
      return this.politicsDataItemBackVoList.filter(ele => ele.checked);
    }
  },
  created() {
    vmNew = this;
  },
  mounted() {
    //this.getlistPictureFun("");
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    window.addEventListener("scroll", this.handleScroll);
    this.crud.page.size= 10;
    this.getValidExamineFun('one');
  },
  methods: {
    resetQuery() {
      this.query.status = ['0']
      this.query.valueMin = 0.5;
      this.query.valueMax = 1;
      this.dataLibrary = "notReviewed";
      // this.similarityValue = ["all"];
      this.peopleLibrary = "all";
      this.query.labelName = "";
      this.query.labelNames = [];
      this.customList = [];
      this.currencyList = [];
      this.customListArr = [];
      this.sliderValue = [50, 100];
      this.query.deptId = this.user.deptInfo.deptId;
      this.listExhibition("contrast");
    },
    handleScroll() {
      if (!this.$refs.fixBox) return;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      console.log(scrollTop)
      console.log(this.$refs.fixBox.offsetTop)
      // -110
      if (scrollTop >= this.$refs.fixBox.offsetTop) {
        if(!this.ifBoxFixed){
          this.ifBoxFixed = true;
          // document.getElementsByClassName("ifBoxFixed")[0].style.top="100px";
          //document.getElementsByClassName("ifBoxFixed")[0].style.transform = 'translateY(42px)';
          //document.getElementsByClassName("ifBoxFixed")[0].style.transform = 'transform 0.5s ease 0s';
        }
        let widthIndex;
        if (document.body.clientWidth < 1599) {
          widthIndex = 0.4;
        } else {
          widthIndex = 0.32;
        }
        this.$refs.fixBox.style =
          "width:" + this.$refs.fixBoxPar.clientWidth * widthIndex + "px";
      } else {
        this.ifBoxFixed = false;
        this.$refs.fixBox.style = "";
      }
      if(scrollTop < this.$refs.currencyRef.scrollHeight+80){
        this.ifBoxFixed = false;
        this.$refs.fixBox.style = "";
      }
      // if(document.body.clientHeight <=766){
      //   this.$refs.centerPic.style = "height: calc(100% - 530px)";
      // }else{
      //   this.$refs.centerPic.style = "height: 447px;"
      // }
    },
    async getValidExamineFun(mgs) {
      await getValidExamine({deptId: this.query.deptId}).then(res => {
        if (res.code == 200) {
          let ids = '', customList = [];
          if (!res.data.id) {
            this.validExamine = false;
          } else {
            this.query.examineId = res.data.id;
            this.validExamine = true;
            this.customList = res.data.custormList || [];
            this.currencyList = res.data.ucapList || [];
            this.customListArr = []
            this.customListArr = [...this.customList, ...this.currencyList];
            if(this.customListArr.length>0){
              ids = [];
              this.customListArr.forEach(item => {
                customList.push(item.customizeLabelName);
                ids.push(item.id);
              });
            }

            this.query.labelNames = customList;
            if(mgs != 'one'){
              this.getlistPictureFun(ids,'firstOne');
            }
          }
          if(mgs == 'one' && res.data.id){
            this.custormOrcurrency = 'custorm';
            //this.query.status = ["0"];
            this.operationTypeCheck("operationTypeList2");
            this.query.status = ["1", "2", "3", "7", "6"];

            this.query.labelNames = customList;
            this.getlistPictureFun(ids,'firstOne');
          }

          if(mgs == 'one' && !res.data.id){
            this.tabStrategy('currency')
          }

        }
      });
    },
    tabStrategy(mgs) {
      document.getElementById('loading').style.display='block'
      this.custormOrcurrency = mgs;

      this.query.status = ["0"];
      this.query.valueMin = "";
      this.query.valueMax = "";
      this.dataLibrary = "notReviewed";
      // this.similarityValue = ["all"];
      this.peopleLibrary = "all";

      this.query.labelNames = [];

      this.customList = [];
      this.currencyList = [];
      this.customListArr = [];

      this.listRegion = 'contrast';

      if (mgs == "custorm") {
        this.operationTypeCheck("operationTypeList2");
        this.query.status = ["1", "2", "3", "7", "6"];
        this.getValidExamineFun(); //查询审核策略生效策略
      } else {
        this.validExamine = true;
        this.query.examineId = "";
        //
        this.getlistPictureFun("",'firstOne');
      }
      //this.getlistPictureFun("");
    },
    getSiteCodeChecked(val) {
      this.query.siteCode = val;
      if(this.user.isAdmin){
        this.getValidExamineFun('one');
      }else{
        this.crud.toQuery();
      }

    },
    dateChangebirthday(val) {
      this.query.scanDateMin = val[0] + " " + "00:00:00";
      this.query.scanDateMax = val[1] + " " + "23:59:59";
      this.crud.toQuery();
    },
    jump() {
      this.$router.push({
        path: "/sensitiveStrategy/sensitiveImageStrategy"
      });
    },
    remove(arr, mgs) {
      arr = [...arr];
      const index = arr.indexOf(mgs);
      if (index === -1) return arr;
      arr.splice(index, 1);
      return arr;
    },
    selectCon(ele, mgs) {
      this.listRegion = 'contrast';

      if (ele !== "similarityValue") {
        this[ele] = mgs;
      }
      if (ele == "similarityValue") {
        // if (mgs === "all") {
        //   this[ele] = ["all"];
        // } else {
        //   if (this[ele].includes("all")) {
        //     this[ele] = [];
        //   }
        //   if (this[ele].includes(mgs) && this[ele].length > 1) {
        //     this[ele] = this.remove(this[ele], mgs);
        //   } else {
        //     this[ele].push(mgs);
        //   }
        // }
        let valueMax = this.sliderValue[1] ? this.sliderValue[1] / 100 : 1; //最大相似值
        let valueMin = this.sliderValue[0] ? this.sliderValue[0] / 100 : 0.5; //最小相似值
        // if (mgs == "5") {
        //   valueMin = "0.5";
        //   valueMax = "0.6";
        // } else if (mgs == "6") {
        //   valueMin = "0.6";
        //   valueMax = "0.7";
        // } else if (mgs == "7") {
        //   valueMin = "0.7";
        //   valueMax = "0.8";
        // } else if (mgs == "8") {
        //   valueMin = "0.8";
        //   valueMax = "0.9";
        // } else if (mgs == "9") {
        //   valueMin = "0.9";
        //   valueMax = "1.0";
        // }
        this.query.valueMin = valueMin;
        this.query.valueMax = valueMax;
        this.crud.toQuery();
      }
      if (ele == "dataLibrary") {
        let status = [];
        if (mgs == "notReviewed") {
          status = ["0"];
        } else if (mgs == "reviewed") {
          //已审核
          status = ["1", "2", "3", "4", "5", "6", "7"];
        }
        this.operationTypeCloud = true;

        this.operationTypeCheck("operationTypeList");
        this.operationTypeCheck("operationTypeList2");
        this.query.status = status;

        let customList = [],ids = [];
        this.customListArr.forEach(item => {
          customList.push(item.customizeLabelName);
          ids.push(item.id);
        });
        this.query.labelNames = customList;
        this.getlistPictureFun(ids,'one');
        //this.crud.toQuery();
      }

      if (ele == "peopleLibrary") {
        //this.fullscreenLoading = true;
        //labelNames 是选中的人物标签集合
        if (mgs == "cloud") {
          this.getDatalistFigure(0);
        } else if (mgs == "custom") {
          this.getDatalistFigure(1);
        } else if (mgs == "all") {
          if(this.customListArr.length == 0){
            this.query.labelNames = [];
            this.getlistPictureFun("");

          }else{
            if(this.customList.length>0 && this.currencyList.length == 0){
              this.getDatalistFigure(0);
            }else if(this.currencyList.length > 0 && this.customList.length == 0){
              this.getDatalistFigure(1);
            }else if(this.currencyList.length > 0 && this.customList.length > 0){
              let customList = [],ids = [];
              this.customListArr.forEach(item => {
                customList.push(item.customizeLabelName);
                ids.push(item.id);
              });
              this.query.labelNames = customList;
              this.getlistPictureFun(ids);
            }
          }

        }
      }
    },
    operationTypeCheck(arr) {
      this[arr].forEach(element => {
        element.isCheck = "true";
      });
    },
    selectChecked(arr, ind) {
      let selectArr = [];
      if (!this[arr][ind].isCheck) {
        this[arr][ind] = Object.assign({}, this[arr][ind], {
          isCheck: "true"
        });
        this.$set(this[arr], ind, this[arr][ind]);
      } else {
        this[arr][ind] = Object.assign({}, this[arr][ind], {
          isCheck: ""
        });
        this.$set(this[arr], ind, this[arr][ind]);
      }
      this[arr].forEach(element => {
        if (element.isCheck) {
          selectArr.push(element.id);
          this.operationTypeCloud = false;
        }
      });
      if (selectArr.length == 0 || selectArr.length == this[arr].length) {
        this.operationTypeCloud = true;
        this[arr].forEach(element => {
          element.isCheck = "true";
        });
        if (arr == "operationTypeList") {
          selectArr = ["1", "2", "3", "4", "5", "6", "7"];
        } else {
          selectArr = ["1", "2", "3", "6", "7"];
        }
      }
      this.query.status = selectArr;
      this.crud.toQuery();
    },
    selectCheckedAll(arr) {
      this.operationTypeCloud = true;
      if (this.operationTypeCloud) {
        this[arr].forEach((element, i) => {
          if (!element.isCheck) {
            this[arr][i] = Object.assign({}, this[arr][i], {
              isCheck: "true"
            });
            this.$set(this[arr], i, this[arr][i]);
          }
        });
        if (arr == "operationTypeList") {
          this.query.status = ["1", "2", "3", "4", "5", "6", "7"];
        } else {
          this.query.status = ["1", "2", "3", "6", "7"];
        }
      }
      this.crud.toQuery();
    },
    removeData(list, index) {
      this[list].splice(index, 1);
      let customList = [];
      let ids = [];
      //this.fullscreenLoading = true;
      // this[list].forEach(item => {
      //   customList.push(item.customizeLabelName);
      //   ids.push(item.id)
      // })
      this.customListArr = [];
      this.customListArr = [...this.customList, ...this.currencyList];
      this.customListArr.forEach(item => {
        customList.push(item.customizeLabelName);
        ids.push(item.id);
      });

      this.query.labelNames = customList;
      if (ids.length == 0) {
        ids = "";
      }
      if (this.peopleLibrary != "all") {
        if (list === "currencyList") {
          this.getDatalistFigure(0);
        } else if (list === "customList") {
          this.getDatalistFigure(1);
        }
        this.getlistPictureFun(ids,'one');
      } else {
        if (this.currencyList.length == 0 && this.customList.length > 0) {
          this.getDatalistFigure(0);
        } else if (
          this.customList.length == 0 &&
          this.currencyList.length > 0
        ) {
          this.getDatalistFigure(1);
        } else {
          this.getlistPictureFun(ids,'one');
        }
        //this.getlistPictureFun(ids);
      }
      this.crud.toQuery();
    },
    screenFun(mgs, data) {
      this.model = mgs;
      this.dialogVisible2 = true;
      let customAndCurrencyList = [];
      if(mgs == 'customFrame'){
        customAndCurrencyList = this.customList;

      } else {
        customAndCurrencyList = this.currencyList;
      }
      this.$nextTick(() => {
        //this.$refs.modelElem.init(data);
        this.$refs.modelElem.init(customAndCurrencyList);
      });
    },
    async closeDialog(val) {
      this.listRegion = 'contrast';
      this.dialogVisible2 = false;
      let customList = [];
      let ids = [];
      //this.fullscreenLoading = true;
      if (val.customList) {
        this.customList = val.customList;
        this.customListArr = [...this.customListArr, ...this.customList];
      } else if (val.ucapFigure) {
        this.currencyList = val.ucapFigure;
        this.customListArr = [...this.customListArr, ...this.currencyList];
      }
      this.customListArr.forEach(item => {
        customList.push(item.customizeLabelName);
        ids.push(item.id);
      });
      if (this.peopleLibrary === "all") {
        if (val.customList) {
          if (this.currencyList.length == 0) {
            this.getDatalistFigure(0);
            this.crud.toQuery();
            return;
          }
        } else if (val.ucapFigure) {
          if (this.customList.length == 0) {
            this.getDatalistFigure(1);
            this.crud.toQuery();
            return;
          }
        }

      }

      this.query.labelNames = customList;
      // this.query.labelNames = [];
      if (ids.length == 0) {
        ids = "";
      }

      // if(this.listRegion == 'contrast'){
      //   this.getlistPictureFun(ids, 'one');
      // }else{
      //   this.query.labelName = ''
      //   this.crud.toQuery();
      // }
      this.getlistPictureFun(ids, 'one');
    },
    listExhibition(mgs) {
      this.listRegion = mgs;
      this.crud.page.size= 10;
      if(mgs == "list"){
        this.crud.page.size= 50;
        this.query.labelName = ''
        this.crud.toQuery();
      }
      if(mgs == "monitor"){
        this.query.labelName = ''
        this.crud.toQuery();
      }
      if (mgs == "contrast") {
        this.currentIndex = 0;
        let ids = [];
        this.customListArr.forEach(item => {
          ids.push(item.id);
        });
        if (ids.length == 0) {
          ids = "";
        }
        //this.query.labelName = this.images[0].customizeLabelName;
        this.getlistPictureFun(ids,'one');
      }else{
        //this.query.labelName = "";
      }

      this.isCheckedAll = false;
      this.crud.selections = [];
    },
    customAll(mgs) {
      this[mgs] = [];
      this.listRegion = 'contrast';
      this.query.labelName = "";
      if (this.peopleLibrary == "all") {
        //
        //this.fullscreenLoading = true;
        this.customListArr = [];
        let customList = [],
          ids = [];
        if (mgs === "currencyList") {
          this.customList.forEach(item => {
            customList.push(item.customizeLabelName);
            ids.push(item.id);
          });
        } else if (mgs === "customList") {
          this.currencyList.forEach(item => {
            customList.push(item.customizeLabelName);
            ids.push(item.id);
          });
        }
        if (ids.length == 0) {
          ids = "";
        }
        this.query.labelNames = customList;
        if (mgs === "currencyList") {
          this.getDatalistFigure(0);
        } else if (mgs === "customList") {
          this.getDatalistFigure(1);
        }
        this.getlistPictureFun(ids,'one');
        //this.crud.toQuery();
      } else {
        if (mgs === "currencyList") {
          this.getDatalistFigure(0);
        } else if (mgs === "customList") {
          this.getDatalistFigure(1);
        }
      }

    },
    shrinkFun(ele, mgs) {
      this[ele] = mgs;
    },
    //左右切换
    prev(mySwiper) {
      //activeIndex
      this[mySwiper].slidePrev();
    },
    next(mySwiper) {
      //this.$refs.mySwiper.$swiper.slideNext()
      this[mySwiper].slideNext();
    },
    //切换标签页
    handleClickSlide(vmm,firstOne) {
      // console.log(vmm);
      //if (this.crud.loading) return;
      this.currentIndex = vmm.clickedIndex || 0;
      this.query.labelName = this.swiperSlideList[
        this.currentIndex
      ].customizeLabelName;
      if(firstOne){
        this.crud.toQuery();
      }
    },
    nextHandler(e) {
      console.log(e);
      this.currentIndex++;
      //更改图片地址
      if (this.currentIndex == this.images.length) {
        //js的if判断语句
        this.currentIndex = 0;
      }
    },
    prevHandler(e) {
      console.log(e);
      console.log(this.currentIndex);
      //更改图片地址
      if (this.currentIndex == 0) {
        //js的if判断语句
        this.currentIndex = this.images.length;
      }
      this.currentIndex--;
    },
    imgHandler(e) {
      //每一个事件都有一个event对象, 冒泡阻止默认事件学的
      console.log(e.target); //当前目标对象 <img src="img/1.jpg" alt>
      console.log(this); //实例化里面的对象this 指的都是当前实例化对象
    },
    viewOriginalResults(data) {
      let updateImg = "";
      let isUpdate = false;
      this.oriResDialogVisible = true;

      let originalImg = data.resImage
        ? process.env.VUE_APP_BASE_API + data.resImage.substring(1)
        : data.resImage;
      if (!data.updateImg) {
        updateImg = data.resImage
          ? process.env.VUE_APP_BASE_API + data.resImage.substring(1)
          : data.resImage;
        isUpdate = false;
      } else {
        updateImg = data.updateImg
          ? process.env.VUE_APP_BASE_API + data.updateImg.substring(1)
          : data.updateImg;
        isUpdate = true;
      }
      this.originalAndUpdateImgList = {
        originalImg,
        updateImg,
        isUpdate
      };
      this.srcListDialog = [
        this.originalAndUpdateImgList.originalImg,
        updateImg
      ];
    },
    closeDialogViewImages() {
      this.oriResDialogVisible = false;
      this.originalAndUpdateImgList = {};
      this.srcListDialog = [];
    },
    viewImage(data) {
      console.log(data);
      let resImage = data.resImage
        ? process.env.VUE_APP_BASE_API + data.resImage.substring(1)
        : data.resImage;
      this.viewImages = [resImage];
      this.$nextTick().then(() => {
        this.$refs.viewImg.showViewer = true;
      });
    },
    warnOrPass(data, mgs, batchOrsingleType) {
      let nomal = [], passArr = [], noPassArr = [], warnArr = [], info = '';
      if (batchOrsingleType) {
        if (this.crud.selections.length == 0) {
          return;
        }
        //状态 0、未审核 1、人工通过 2、人工不通过 3、人工预警 4、已修改通过 5、已修改预警 6、自动预警 7、自动通过
        if(this.crud.selections.length > 0){
          this.crud.selections.forEach(item => {
             if(item.status == 0){
              nomal.push(item.status)
             }else if(item.status == 1 || item.status == 4 || item.status == 7){//通过
              passArr.push(item.status)
             }else if(item.status == 2){//不通过
              noPassArr.push(item.status)
             }else if(item.status == 3 || item.status == 5 || item.status == 6){//预警
              warnArr.push(item.status)
             }
          })
        }
        if (mgs == "warn"){
          info = `此操作中有${nomal.length + passArr.length + noPassArr.length}条数据可以执行此操作，${warnArr.length}条数据已发过预警，不会再重复发送，是否要继续修改？`;
        }else if(mgs == "pass"){
          info = `此操作中有${nomal.length + noPassArr.length + warnArr.length}条数据可以执行此操作，${passArr.length}条数据已包含当前要修改的状态，不会再重复修改，是否要继续修改？`;
        }else if(mgs == "noPass"){
          info = `此操作中有${nomal.length + passArr.length + warnArr.length}条数据可以执行此操作，${noPassArr.length}条数据已包含当前要修改的状态，不会再重复修改，是否要继续修改？`;
        }
      }

      if(batchOrsingleType){
        this.$confirm(info, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.warnOrPassDialogVisible = true;
          })
          .catch(() => {});
      }else{
        this.warnOrPassDialogVisible = true;
      }
      this.warnOrPassData = data;
      this.isWarn = "1";
      if (!batchOrsingleType) {
        this.batchOrsingleType = "single";
      }
      if (mgs == "warn") {
        this.warnOrPassTitle = "预警数据";
        this.warnOrPassRadio1 = "仅预警勾选项数据";
        this.warnOrPassRadio2 = "预警查询条件范围内的全部数据";
        this.warnOrPassStatus = "3";
      } else if (mgs == "pass") {
        this.warnOrPassTitle = "通过数据";
        this.warnOrPassRadio1 = "仅通过勾选项数据";
        this.warnOrPassRadio2 = "通过查询条件范围内的全部数据";
        this.warnOrPassStatus = "1";
      } else if (mgs == "noPass") {
        this.warnOrPassTitle = "不通过数据";
        this.warnOrPassRadio1 = "仅不通过勾选项数据";
        this.warnOrPassRadio2 = "查询条件范围内的全部数据都不通过";
        this.warnOrPassStatus = "2";
      }
    },
    warnOrPassDialogFun() {
      let status = "",
        id = [],
        params = {};
        console.log(this.warnOrPassData)
      if (this.batchOrsingleType == "single") {
        id.push(this.warnOrPassData.id);
      } else {
        this.warnOrPassData.forEach(item => {
          id.push(item.id);
        });
      }
      params["ids"] = id;
      params["status"] = this.warnOrPassStatus;

      if (this.isWarn == "0") {
        id = [];
        this.crud.data.forEach(item => {
          id.push(item.id);
        });
        params["ids"] = id;
        params = Object.assign({}, this.query, params);
      }
      updateStatuse(params).then(res => {
        if (res.code == "200") {
          this.crud.notify("数据更新成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
          //this.query.status = []
          this.crud.toQuery();
        } else {
          this.$notify({
            title: "警告",
            message: res.message,
            type: "warning"
          });
        }
        this.warnOrPassDialogVisible = false;
      });
    },
    handleCommand(command) {
      this.query.type = command.value;
      delete this.query.entranceUrl;
      let exportParam = {};
      exportParam = Object.assign({}, this.query, {
        page: this.crud.page.page - 1,
        size: this.crud.page.size
      });
      if(this.crud.data.length == 0){
        this.$message({
          message: '暂无数据',
          type: 'warning'
        });
        return;
      }

     exportData(exportParam).then(res => {
       console.log(res)
        downloadFilePost(res)
        //downloadFile(res, "错敏信息", "xlsx");
     })
      // window.location.href =
      //   process.env.VUE_APP_BASE_API +
      //   "politics/data/exportExcelByDto" +
      //   "?" +
      //   qs.stringify(exportParam, {
      //     indices: false
      //   });
    },
    async getlistPictureFun(ids,firstOne) {
      //this.fullscreenLoading = true;
      document.getElementById('loading').style.display='block'
      this.labelNames = ids;
      //获取人物图片
      await getlistPicture({
        labelNames: ids
      }).then(res => {
        this.fullscreenLoading = false;
        if (res.code == "200") {
          this.swiperSlideList = res.data || [];
          this.images = res.data || [];
          if(res.data.length>0){
            this.query.labelName = res.data[0].customizeLabelName;
          }else{
            this.query.labelName = '';
          }
          if (this.images.length > 0) {
            this.images.forEach(item => {
              if (item.img) {
                item.img = this.urlImage + item.img.substring(1);
              }
            });
          }
          // this.handleClickSlide();
          this.$nextTick(() => {
            this.initSwiper(".swiper-container1", "mySwiper", {
              spaceBetween: 10,
              slidesPerView: "auto",
              //paginationClickable: true,
              observeParents: true,
              observe: true,
              //slideToClickedSlide: true,
              preventLinksPropagation: false,
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
              },
              on: {
                init: function(swiper) {
                  let that = this;
                  vmNew.handleClickSlide(that, firstOne);
                },
                click: function() {
                  let that = this;
                  vmNew.handleClickSlide(that, 'one');
                }
              },
              onSlideChangeStart: function(swiper) {
                //这个是当swiper被改变是的回调函数，可以拿到当前索引
                //console.log(swiper.activeIndex)
                // alert(swiper.activeIndex);
              }
            });
          });

          setTimeout(() => {
            this.fullscreenLoading = false;
            window.addEventListener("resize", this.handleScroll);
          }, 1500);

          // let labelName = [];
          // res.data.forEach(item => {
          //   labelName.push(item.customizeLabelName)
          // })
          // this.query.labelName = labelName;
        }
      });
    },
    initSwiper(ele, mySwiper, obj) {
      var that = this;
      that[mySwiper] = new Swiper(ele, obj);
      //that[mySwiper].update();
    },
    webNamePosOut(e) {
      let el = e.target;
      el.nextElementSibling.style.left = el.getBoundingClientRect().left + "px";
    },
    checkAll() {
      if (this.listRegion === "list") {
        this.$refs.listPowerSupplyTab.toggleAllSelection(this.crud.data, true);
        this.isCheckedAll = !this.isCheckedAll;
        if (this.isCheckedAll) {
          this.crud.selections = this.crud.data;
        } else {
          this.crud.selections = [];
        }
      } else {
        this.crud.selections = [];
        this.crud.data.forEach(item => {
          item["isChecked"] = !this.isCheckedAll;
        });
        this.isCheckedAll = !this.isCheckedAll;

        if (this.isCheckedAll) {
          this.crud.data.forEach(item => {
            this.crud.selections.push(item);
          });
        }
      }
    },
    checkOne(key, ind) {
      this.crud.selections = [];
      this.crud.data[key]["isChecked"] ? (this.isCheckedAll = false) : "";
      this.crud.data[key]["isChecked"]
        ? (this.crud.data[key]["isChecked"] = false)
        : (this.crud.data[key]["isChecked"] = true);
      this.$set(this.crud.data, key, this.crud.data[key]);
      let flag = true;
      this.crud.data.forEach(item => {
        if (!item["isChecked"]) {
          flag = false;
        } else {
          this.crud.selections.push(item);
        }
      });
      this.isCheckedAll = flag;
    },
    checkOneList(val) {
      this.crud.selectionChangeHandler(val);
      if (this.crud.selections.length == this.crud.data.length) {
        this.isCheckedAll = true;
      } else {
        this.isCheckedAll = false;
      }
    },
    valueToStr(data) {
      let strValue = [];
      data.forEach(item => {
        if(item.value && item.value>=0.5){
          strValue.push(item.value);
        }
      });
      return strValue.join(",");
    },
    nameToStr(data) {
      let strName = [];
      data.forEach(item => {
        if(item.name && item.value>=0.5){
          strName.push(item.name);
        }
      });
      return strName.join(",");
    },
    async getDatalistFigure(type) {
      await getlistFigure({
        examineId: "",
        name: "",
        pinyin: "",
        type: type
      }).then(res => {
        if (res.code == 200) {
          let labelNames = [],
            ids = [];
          res.data.forEach(item => {
            labelNames.push(item.customizeLabelName);
            ids.push(item.id);
          });
          if(res.data.length>0){
            this.query.labelName = res.data[0].customizeLabelName;
          }else{
            this.query.labelName = '';
          }


          if (this.peopleLibrary === "all") {
            if (this.customList.length > 0 && this.currencyList.length > 0) {
            } else {
              this.customListArr.forEach(item => {
                labelNames.push(item.customizeLabelName);
                ids.push(item.id);
              });

            }
          }
          if(this.peopleLibrary === 'custom'){
            if(this.customList.length > 0){
              labelNames = [];ids = [];
              this.customList.forEach(item => {
                labelNames.push(item.customizeLabelName);
                ids.push(item.id);
              });

            }
          }else if(this.peopleLibrary === 'cloud'){
            if(this.currencyList.length > 0){
              labelNames = [];ids = [];
              this.currencyList.forEach(item => {
                labelNames.push(item.customizeLabelName);
                ids.push(item.id);
              });

            }
          }

          if (ids.length == "0") {
            ids = "";
          }
          this.query.labelNames = labelNames;
          this.getlistPictureFun(ids, 'one');
        }
      });
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
    [CRUD.HOOK.afterToCU](crud, form) {},
    // 打开编辑弹窗前做的操作
    async [CRUD.HOOK.beforeToEdit](crud, form) {
      await getPoliticsDataBy({
        id: form.id
      }).then(res => {
        if (res.code == 200) {
          //console.log(res.data)
          form = res.data;
          form.politicsDataItemBackVoList.forEach(item => {
            item["name1"] = item.name;
            item["value1"] = parseInt(item.value * 100);
            item["checked"] = false;
          });
          this.politicsDataItemBackVoList = form.politicsDataItemBackVoList;
          this.$nextTick(() => {
            this.initSwiper(".swiper-container2", "mySwiper1", {
              spaceBetween: 10,
              slidesPerView: "auto",
              observeParents: true,
              observe: true,
              preventLinksPropagation: false,
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
              },
              on: {
                click: function() {}
              },
              onSlideChangeStart: function(swiper) {
                //这个是当swiper被改变是的回调函数，可以拿到当前索引
                console.log(swiper.activeIndex);
                // alert(swiper.activeIndex);
              }
            });
          });
        } else {
          this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
        }
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud, mgs) {
      // console.log("crud--------mgs");

      if (mgs === 1 || mgs === 3) {
        // console.log(crud.form);
        let hasSign = this.politicsDataItemBackVoList.filter(ele => {
          return ele.isSign === "1" && ele.checked && !ele.name1;
        });
        // console.log(hasSign);
        if (hasSign.length > 0) {
          crud.notify("请输入人物名", CRUD.NOTIFICATION_TYPE.ERROR);
          return false;
        }
        let hasSignVal = this.politicsDataItemBackVoList.filter(ele => {
          return ele.isSign === "1" && ele.checked && ele.value1 < 50;
        });
        if (hasSignVal.length > 0) {
          crud.notify("相似值不能小于50%", CRUD.NOTIFICATION_TYPE.ERROR);
          return false;
        }
        let hasSignValMax = this.politicsDataItemBackVoList.filter(ele => {
          return ele.isSign === "1" && ele.checked && ele.value1 > 100;
        });
        if (hasSignValMax.length > 0) {
          crud.notify("相似值不能超过100%", CRUD.NOTIFICATION_TYPE.ERROR);
          return false;
        }
      }
      // console.log(9);
      // let getChecked = this.politicsDataItemBackVoList.filter(
      //   ele => ele.checked
      // );
      this.politicsDataItemBackVoList.forEach(item => {
        item.name = item.name1;
        item.value = parseInt(item.value1) / 100;
        if (item.img) {
          item.img = item.img.substring(element.img.indexOf("/upload"));
        }
        //item.faceImgs = null;
        delete item.name1;
        delete item.value1;
        delete item.checked;
      });
      crud.form.politicsDataItemVoList = this.politicsDataItemBackVoList;
      delete crud.form.dataItemBackVoList;
      delete crud.form.originUrl;
      delete crud.form.originalImg;
      delete crud.form.referUrl;
      delete crud.form.scanDate;
      delete crud.form.siteCode;
      delete crud.form.siteName;
      delete crud.form.updateImg;
      delete crud.form.updateTime;
      delete crud.form.updateUser;
      delete crud.form.resImage;
      delete crud.form.politicsDataItemBackVoList;
      crud.form.status = mgs;
      return true;
    },
    radioChange(val, index) {
      if (val === "0") {
        console.log(val);
        this.politicsDataItemBackVoList[
          index
        ].name1 = this.politicsDataItemBackVoList[index].name;
        this.politicsDataItemBackVoList[index].value1 = parseInt(
          this.politicsDataItemBackVoList[index].value * 100
        );
      }
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleScroll);
  }
};
</script>
<style scoped lang="scss">
@import url("../../../assets/styles/politicalPictureMonitor.css");

.figureThumbnail .smallPicture .smallPicBg.borderClass {
  border: 3px solid #2e8cf0;
  border-radius: 4px;
}
.con-hover {
  cursor: pointer;
  &:hover {
    color: #2e8cf0;
  }
}
.shrink-height {
  height: 32px;
  overflow: hidden;
}
.reset-btn {
  padding: 0px 20px 0px;
  text-align: center;
  .el-button--small{
    padding: 4px 9px;
  }
}
.slider-con {
  width: 400px;
  display: flex;
  align-items: center;
  .el-slider {
    flex: 1;
    /deep/ .el-slider__button-wrapper {
      z-index: 8 !important;
    }
  }
  & > span {
    margin: 0 10px;
  }
  & > span:nth-child(1) {
    margin: 0 10px 0 0;
  }
}
.fixTypeBox {
  position: fixed;
  top: 110px;
  /* transition: top 2s ease; */
}
.dialogWarnOrPass{
  /deep/ .el-dialog__body{
    height: auto;
  }
}
</style>
