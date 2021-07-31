<template>
  <div class="advanced-search" v-if="advancedSearchShow">
    <el-row>
      <el-col :span="24">
        <div class="rm-advanced-search-header">
          <h3 class="rm-advanced-search-tit">高级搜索<i class="rm-bor"></i></h3>
          <i
            class="el-icon-close close-icon"
            @click="listenToParentEvent()"
          ></i>
        </div>
      </el-col>
      <el-row
        :class="{ overflowHeight: overflowHeight }"
        style="width: 100%;overflow: auto;"
      >
        <el-col :span="24" class="rm-advanced-search-body">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <dl
              class="rm-advanced-search-dl clearfix"
              style="margin-bottom: 0px;"
            >
              <el-form-item label="搜索关键词：" prop="allKey">
                <!-- &amp; -->
                <el-input
                  v-model="ruleForm.allKey"
                  class="wdh-calc135"
                  placeholder="请输入关键词，多个关键词请用*隔开"
                />
                <span class="rm-advanced-search-word">包括以上全部关键词</span>
              </el-form-item>
              <el-form-item label="" prop="searchKey">
                <el-input
                  v-model="ruleForm.searchKey"
                  class="wdh-calc135 wdh-calc135-second"
                  placeholder="请输入关键词，多个关键词请用*隔开"
                />
                <span class="rm-advanced-search-word">包括以上任意关键词</span>
              </el-form-item>
              <el-form-item label="" prop="onIncludeKey">
                <el-input
                  v-model="ruleForm.onIncludeKey"
                  class="wdh-calc135 wdh-calc135-second"
                  placeholder="请输入关键词，多个关键词请用*隔开"
                />
                <span class="rm-advanced-search-word">不包括以上关键词</span>
              </el-form-item>
            </dl>
            <div class="wdh-percent">
              <el-row>
                <el-col :xs="12" :sm="12" :lg="12">
                  <dl class="rm-advanced-search-dl">
                    <dt class="rm-advanced-search-dt">搜索范围：</dt>
                    <dd class="rm-advanced-search-dd">
                      <ul class="sy-role-list flt">
                        <li
                          class="sy-role-item flt"
                          :class="[{ selected: checkIconObj.resName }]"
                        >
                          <i
                            class="advIcon check-icon flt"
                            @click="checkIconFun('resName')"
                            main-id="resName"
                          ></i>
                          <span class="sy-role-name flt">标题</span>
                        </li>
                        <li
                          class="sy-role-item flt"
                          :class="[{ selected: checkIconObj.Content }]"
                        >
                          <i
                            class="advIcon check-icon flt"
                            @click="checkIconFun('Content')"
                            main-id="Content"
                          ></i>
                          <span class="sy-role-name flt">正文</span>
                        </li>
                      </ul>
                    </dd>
                  </dl>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="12">
                  <dl class="rm-advanced-search-dl" style="margin-bottom: 0px;">
                    <dt class="rm-advanced-search-dt">匹配模式：</dt>
                    <dd class="rm-advanced-search-dd">
                      <a href="javascript:;" class="rm-search-select-item">
                        <i
                          class="advIcon search-select-icon"
                          :class="{ selected: pipeiSearch.accurate }"
                          @click="pipeiSearchFun('accurate')"
                          main-id="accurate"
                        ></i>
                        <span class="search-select-tit">精确匹配</span>
                      </a>
                      <a href="javascript:;" class="rm-search-select-item">
                        <i
                          class="advIcon search-select-icon"
                          :class="{ selected: pipeiSearch.like }"
                          @click="pipeiSearchFun('like')"
                          main-id="like"
                        ></i>
                        <span class="search-select-tit">包含匹配</span></a
                      >
                      <a href="javascript:;" class="rm-search-select-item">
                        <i
                          class="advIcon search-select-icon"
                          :class="{ selected: pipeiSearch.participle }"
                          @click="pipeiSearchFun('participle')"
                          main-id="participle"
                        ></i>
                        <span class="search-select-tit">分词匹配</span>
                      </a>
                    </dd>
                  </dl>
                </el-col>
              </el-row>
            </div>
            <div>
              <dl
                class="rm-advanced-search-dl advanced-search-bottom"
                style="margin-bottom: 0px;"
              >
                <el-form-item label="采集时间：" prop="collTime">
                  <!-- @focus="dateChange('picker')" :picker-options="pickerOptions"-->
                  <el-date-picker
                    v-model="ruleForm.collTime"
                    ref="picker"
                    @change="dateChangebirthday"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="timePlug"
                    format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
              </dl>
              <dl
                class="rm-advanced-search-dl advanced-search-bottom"
                style="margin-bottom: 0px;"
              >
                <el-form-item label="发布时间：" prop="publicTime">
                  <!-- @focus="dateChange('picker2')" :picker-options="pickerOptions"-->
                  <el-date-picker
                    v-model="ruleForm.publicTime"
                    ref="picker2"
                    @change="dateChangebirthday"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="timePlug"
                    format="yyyy-MM-dd"
                  >
                    <!--  -->
                  </el-date-picker>
                </el-form-item>
              </dl>
              <dl
                class="rm-advanced-search-dl advanced-search-bottom"
              >
                <dt class="rm-advanced-search-dt">稿件状态：</dt>
                <dd class="rm-advanced-search-dd">
                  <el-select
                    v-model="value"
                    placeholder="请选择"
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
                </dd>
              </dl>
              <dl class="rm-advanced-search-dl advanced-search-bottom"
              style="margin-bottom: 0px;">
                <el-form-item label="所属机构："  v-if="this.user.isAdmin">
                  <el-select v-model="ruleForm.deptId" class="filter-item" style="width: 240px;margin-left:15px" @change="changeDeptId">
                    <el-option
                      v-for="item in depts"
                      :key="item.name"
                      :label="item.name"
                      :value="item.id"
                    />  
                  </el-select>
                </el-form-item>
              </dl>
            </div>
          </el-form>
        </el-col>
        <el-col
          :span="24"
          style="text-align: center;margin-top: 10px;"
          class="rm-advanced-search-footer"
        >
          <el-button class="btn-item active" @click="submit"
            >高级搜索</el-button
          >
          <el-button class="btn-item" @click="clearAll()">清空</el-button>
          <el-button class="btn-item" @click="listenToParentEvent()"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-row>

    <div class="errTipsBox" v-if="errTipsBoxShow">请填写搜索关键词</div>
  </div>
</template>
<script>
import { format2 } from "@/utils/util";
import { getDepts } from "@/api/system/dept";
import { mapGetters } from "vuex";
import { dataHttpGet } from "@/api/common";
export default {
  name: "advanced-search",
  props: {
    advancedSearchShow: {
      type: Boolean,
      default: false
    },
    overflowHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let vue = this;
    // 自定义验证
    const validAllKey = (rule, value, callback) => {
      if (!value) {
        if (!this.ruleForm.searchKey && !this.ruleForm.onIncludeKey) {
          this.errTipsBoxShow = true;
          setTimeout(() => {
            this.errTipsBoxShow = false;
          }, 2000);
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validSearchKey = (rule, value, callback) => {
      if (!value) {
        if (!this.ruleForm.allKey && !this.ruleForm.onIncludeKey) {
          this.errTipsBoxShow = true;
          setTimeout(() => {
            this.errTipsBoxShow = false;
          }, 2000);
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validOnIncludeKey = (rule, value, callback) => {
      if (!value) {
        if (!this.ruleForm.allKey && !this.ruleForm.searchKey) {
          this.errTipsBoxShow = true;
          setTimeout(() => {
            this.errTipsBoxShow = false;
          }, 2000);
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      options: [
        {
          label: "全部",
          value: "0"
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
      value: "2",
      ruleForm: {
        allKey: "",
        searchKey: "",
        onIncludeKey: "",
        collTime: "",
        publicTime: "",
        deptId: '',
        siteCodes: []
      },
      rules: {
        allKey: [
          {
            required: false,
            trigger: "change",
            validator: validAllKey
          }
        ],
        searchKey: [
          {
            required: false,
            trigger: "change",
            validator: validSearchKey
          }
        ],
        onIncludeKey: [
          {
            required: false,
            trigger: "change",
            validator: validOnIncludeKey
          }
        ],
        deptId: [
         { required: true, message: "请选择所属机构", trigger: "blur" },
        ]
      },
      depts: [],
      checkIconObj: {
        resName: true,
        Content: true
      },
      pipeiSearch: {
        participle: false,
        like: true,
        accurate: false
      },
      errTipsBoxShow: false,
      collStartTime: "",
      collEndTime: "",
      publicStartTime: "",
      publicEndTime: "",
      queryMode: "like", //匹配模式
      searchRound: "resName,Content",
      pickerOptions: {
        onPick(time) {
          //当第一时间选中才设置禁用
          if (time.minDate && time.maxDate) {
            let endDateVal = new Date(time.minDate).getTime();
            let beginDateVal = new Date(time.maxDate).getTime();
            let iDays = parseInt(
              Math.abs(beginDateVal - endDateVal) / 1000 / 60 / 60 / 24
            );
            if (iDays >= 30) {
              this.$message({
                message: "选中范围不能超过30天",
                type: "error"
              });
            }
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {},
  mounted(){
    this.getDepts();
  },
  methods: {
    changeDeptId(val){
      this.getUUserAccountData(val)
    },
    getUUserAccountData(val) {
      let url = "/uDatabaseInfo/getAllList";
      let params = {
        deptId: val
      }
      dataHttpGet(url, params).then(res => {
          if (res) {
            let data = res.data || [];
            for (var i = 0; i < data.length; i++) {
              this.ruleForm.siteCodes.push(data[i].siteCode);
            }
          }
      });
    },
    getDepts() {
      getDepts().then(res => {
        this.depts = res.content || []
      });
    },
    listenToParentEvent() {
      this.$emit("listenToChildEvent");
      this.clearAll();
    },
    clearAll() {
      this.$refs["ruleForm"].resetFields();
      this.ruleForm.deptId = '';
      this.ruleForm.siteCodes = [];

      this.value = "2";
      this.checkIconObj = {
        resName: true,
        Content: true
      };
      this.pipeiSearch = {
        participle: false,
        like: true,
        accurate: false
      };
    },
    checkIconFun(mgs) {
      this.checkIconObj[mgs] = !this.checkIconObj[mgs];
    },
    pipeiSearchFun(mgs) {
      Object.keys(this.pipeiSearch).map(item => {
        this.pipeiSearch[item] = false;
      });
      this.pipeiSearch[mgs] = true;
      this.queryMode = mgs;
    },
    dateChangebirthday(val) {
      // let endDateVal = new Date(val[1]).getTime();
      // let beginDateVal = new Date(val[0]).getTime()
      // let iDays = parseInt(Math.abs(beginDateVal - endDateVal) / 1000 / 60 / 60 / 24);
      // if (iDays >= 30) {
      //   this.$message({
      //     message: '选中范围不能超过30天',
      //     type: 'error'
      //   });
      //   this.ruleForm.collTime = ''
      // }
    },
    dateChange(elem) {
      if (this.$refs[elem].picker) {
        const targetEl = this.$refs[elem].picker.$el.querySelector(
          ".el-picker-panel__footer"
        );
        if (targetEl.childNodes[0].className.indexOf("el-button--text") > 0) {
          targetEl.removeChild(targetEl.childNodes[0]);
        }
      }
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        this.ruleForm.collTime != null &&
        this.ruleForm.collTime.length > 0 &&
        this.ruleForm.collTime.length != "1"
          ? (this.collStartTime =
              format2(this.ruleForm.collTime[0]) + "00:00:00")
          : (this.collStartTime = "");
        this.ruleForm.collTime != null &&
        this.ruleForm.collTime.length > 0 &&
        this.ruleForm.collTime.length != "1"
          ? (this.collEndTime = format2(this.ruleForm.collTime[1]) + "23:59:59")
          : (this.collEndTime = "");
        this.ruleForm.publicTime != null &&
        this.ruleForm.publicTime.length > 0 &&
        this.ruleForm.publicTime.length != "1"
          ? (this.publicStartTime =
              format2(this.ruleForm.publicTime[0]) + "00:00:00")
          : (this.publicStartTime = "");
        this.ruleForm.publicTime != null &&
        this.ruleForm.publicTime.length > 0 &&
        this.ruleForm.publicTime.length != "1"
          ? (this.publicEndTime =
              format2(this.ruleForm.publicTime[1]) + "23:59:59")
          : (this.publicEndTime = "");
        if (this.checkIconObj.resName && this.checkIconObj.Content) {
          this.searchRound = "resTitle,contentWithoutTag";
        } else if (this.checkIconObj.resName && !this.checkIconObj.Content) {
          this.searchRound = "resTitle";
        } else if (!this.checkIconObj.resName && this.checkIconObj.Content) {
          this.searchRound = "contentWithoutTag";
        } else {
          this.searchRound = "";
        }
        let params = {
          startCreateTime: this.collStartTime,
          endCreateTime: this.collEndTime,
          feilds: this.searchRound,
          queryMode: this.queryMode,
          startPubDate: this.publicStartTime,
          endPubDate: this.publicEndTime,
          isDelete: this.value === "0" ? "" : this.value,
          allWord: this.ruleForm.allKey,
          anyWord: this.ruleForm.searchKey,
          notWord: this.ruleForm.onIncludeKey,
          siteCodes: this.ruleForm.siteCodes.join(",")
        };
        this.$emit("searchParams", params);
        this.listenToParentEvent();
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import url("../../assets/styles/advancedSearch.scss");
</style>
