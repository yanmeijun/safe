<template>
  <div class="app-container dialogUniversalCharacter">
    <div class="head-container searchTabBox" style="margin-top: 10px;">
      <div class="clearfix  originaLeft" v-if="this.user.isAdmin">
          <Mechanism-Select 
            v-bind:width= "width"
            :mechanismSelectUpload = "mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
      </div>
      <div class="clearfix" style="margin-bottom: 12px;">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">审查策略列表</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toDelete(crud.selections, '', '确定要删除选中的数据吗？')"
          >
            删除
          </button>
          <button class="btnListDefault btnTabBlue flt" @click="crud.toAdd">
            添加
          </button>
        </div>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="crud.data"
        class="tableColumnWh"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="26" align="center" />
        <el-table-column label="序号" type="index" align="center" width="40" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="name"
          label="审核策略名称"
          width='180px'
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="deptName"
          label="所属机构"
          v-if="this.user.isAdmin"
          width='150px'
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="deptId"
          label="机构ID"
          v-if="this.user.isAdmin"
          width='100px'
        />
        <!-- parseTime -->
        <el-table-column
          :show-overflow-tooltip="true"
          prop="effectiveTime"
          label="生效时间"
          align="center"
          min-width="20%"
        />
        <el-table-column
          label="生效状态"
          align="center"
          prop="status"
          min-width="10%"
        >
          <template slot-scope="scope">
            <!-- 0->关；1->开 -->
            <el-switch
              v-model="scope.row.status == 1"
              active-color="#2E8CF0"
              inactive-color="#E8ECEE"
              @change="changeEnabled(scope.row, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button @click="crud.toEdit(scope.row)" title="编辑">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>
              <button title="删除">
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  @click="toDelete(scope.row, 'one', '确定删除此条数据?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <!--添加政治图片审核策略弹框 start -->
    <el-dialog
      :title="crud.status.title"
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      class="dialogZztpcl"
      width="640px"
    >
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="110px"
      >
        <el-form-item label="审核策略名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            style="width: 200px;"
            maxlength="30"
          />
        </el-form-item>

        <!-- @handleData="handleData" -->
        <library-slider
          :copyContent="copyContent"
          @handleDataFrame="handleDataFrame"
          @handleChangeSwitch="handleChangeSwitch"
        ></library-slider>

        <library-slider
          :copyContent="copyContent2"
          @handleDataFrame="handleDataFrame"
          @handleChangeSwitch="handleChangeSwitch"
        ></library-slider>

        <el-form-item label="生效日期" prop="timeFormat">
          <el-date-picker
            style="width: 200px;"
            :clearable="false"
            @input=""
            v-model="form.timeFormat"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator="-"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <!-- <el-form-item label="是否自动预警" prop="isWarn">
          <el-radio-group style="width: 400px" v-model="form.isWarn">
            <el-radio label="1" key="1">是</el-radio>
            <el-radio label="0" key="0">否，仅通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人电话" prop="warnUser">
          <el-input
            v-model="form.warnUser"
            placeholder="请输入"
            style="width: 200px;"
          />
          <div class="celueSMSnotis">
            <span class="triangleLeft"><span class="triangleLeft"></span></span>
            策略失效时会发送一条短信通知联系人
          </div>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          type="primary"
          :loading="crud.status.cu === 2"
          @click="crud.submitCU"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!--添加政治图片审核策略弹框end-->

    <!-- 自定义人物弹框 & 通用任务弹框 start -->
    <component
      v-bind:is="model"
      ref="modelElem"
      :dialogVisible2="dialogVisible2"
      @closeDialog="closeDialog"
    >
    </component>
    <!--自定义人物弹框  & 通用任务弹框 end-->
  </div>
</template>
<script>
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import pagination from "@crud/Pagination";
import LibrarySlider from "@/components/LibrarySlider";
import crudSensitiveStrategy from "@/api/sensitiveStrategy/index";
import { getlistFigure } from "@/api/politicalPictureMonitor/index";
import { getStrategyDetail } from "@/api/sensitiveStrategy/strategyDetail";
import customFrame from "@/components/PeopleLibrary/custom";
import currencyFrame from "@/components/PeopleLibrary/currency";
import Bus from "@/utils/bus.js";
import { isvalidPhone, validateName } from "@/utils/validate";
import { parseTime } from "@/utils/index";
import { mapGetters } from "vuex";
import MechanismSelect from "@/components/MechanismSelect";
const defaultForm = {
  id: null,
  isWarn: "0",
  name: "",
  timeFormat: "",
  warnUser: ""
};
export default {
  name: "politicalPictureMonitor",
  components: {
    pagination,
    LibrarySlider,
    customFrame,
    currencyFrame,
    MechanismSelect
  },
  cruds() {
    return CRUD({
      title: "政治图片审核策略",
      url: "/politics/examine/list",
      newAddRefresh: true,
      crudMethod: {
        ...crudSensitiveStrategy
      },
      strategyNewAddStatus: true,
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    const validwarnUser = (rule, value, callback) => {
      if (!isvalidPhone(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    const validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("审核策略不能为空"));
      } else if (!validateName(value)) {
        callback(new Error("审核策略名称支持中英文,不限制字数"));
      } else {
        callback();
      }
    };
    const validFaceDatabase = (rule, value, callback) => {
      if (!this.ucapFiguresFaceDatabase && !this.custormFiguresFaceDatabase) {
        callback(new Error("请选择任意一个或多个人脸库"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        name: [
          {
            required: true,
            message: "",
            trigger: "blur",
            validator: validName
          }
        ],
        custormFiguresFaceDatabase: [
          {
            validator: validFaceDatabase,
            trigger: "change"
          }
        ],
        isWarn: [
          {
            required: true,
            message: "是否自动预警不能为空",
            trigger: "change"
          }
        ],
        timeFormat: [
          {
            required: true,
            message: "生效日期不能为空",
            trigger: "blur"
          }
        ],
        warnUser: [
          // {
          //   message: "请输入合法手机号/电话号",
          //   trigger: "blur",
          //   validator: validwarnUser
          // }
          { pattern:/^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: "请输入合法手机号/电话号", trigger: "blur" }
        ]
      },
      value: [4, 8],
      //0、关 1、开
      copyContent: {
        prop: 'ucapFiguresFaceDatabase',
        title: "自定义人脸库",
        section: "疑似值区间",
        face: "人脸",
        screen: "筛选",
        faceDatabase: false
      },
      copyContent2: {
        prop: 'custormFiguresFaceDatabase',
        title: "通用人脸库",
        section: "疑似值区间",
        face: "人脸",
        screen: "筛选",
        faceDatabase: false
      },
      model: "customFrame",
      dialogVisible2: false,
      ucapFiguresFaceDatabase: false,
      custormFiguresFaceDatabase: false,
      width: '42px',
      allMechanism: 'allMechanism',
      mechanismSelectUpload: '0'
    };
  },
  mounted() {
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    //1 自定义 0通用
    this.getDatalistFigure(1);
    this.getDatalistFigure(0);
    this.crud.toQuery()
  },
  methods: {
    getMechanismChecked(val){
      // this.query.deptId = val;
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
      this.crud.toQuery();
    },
    changeEnabled(data, status) {
      let param = {
        id: data.id
      };
      if (status == "0") {
        param["status"] = 1;
      } else {
        param["status"] = 0;
      }
      this.crud.loading = true;
      crudSensitiveStrategy
        .upData(param)
        .then(res => {
          this.crud.loading = false;
          if (res.code == "200") {
            this.crud.notify("更新成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
            this.crud.toQuery();
          } else {
            this.$notify({
              title: "警告",
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    handleData(val) {
      //console.log(val)
    },
    handleChangeSwitch(val) {
      if (val.ucapFiguresFaceDatabase) {
        this.ucapFiguresFaceDatabase = val.ucapFiguresFaceDatabase.faceDatabase;
      } else {
        this.custormFiguresFaceDatabase =
          val.custormFiguresFaceDatabase.faceDatabase;
        // 主动触发验证
        this.$refs.form.validateField('custormFiguresFaceDatabase');
      }
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.copyContent.faceDatabase = false;
      this.copyContent2.faceDatabase = false;

      this.copyContent["custormFigureBackVos"] = [];
      this.copyContent2["ucapFigureBackVos"] = [];

      this.copyContent["custormMin"] = "0.5";
      this.copyContent["custormMax"] = "1";

      this.copyContent2["ucapMin"] = "0.5";
      this.copyContent2["ucapMax"] = "1";
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      if (crud.form.id) {
        getStrategyDetail({
          id: crud.form.id
        }).then(res => {
          if (res.code == 200) {
            crud.form["isWarn"] = res.data.isWarn;
            this.copyContent.faceDatabase =
              res.data.custormFlag == "0" ? false : true;
            this.copyContent2.faceDatabase =
              res.data.ucapFlag == "0" ? false : true;

            this.copyContent["custormMax"] = res.data.custormMax;
            this.copyContent["custormMin"] = res.data.custormMin;

            this.copyContent2["ucapMax"] = res.data.ucapMax;
            this.copyContent2["ucapMin"] = res.data.ucapMin;

            this.copyContent["custormFigureBackVos"] =
              res.data.custormFigureBackVos;
            this.copyContent2["ucapFigureBackVos"] = res.data.ucapFigureBackVos;

            crud.form["warnUser"] = res.data.warnUser;

            //crud.form['']

            let time = [];
            if (res.data.minEffectiveTime && res.data.maxEffectiveTime) {
              time.push(parseTime(res.data.minEffectiveTime).split(" ")[0]);
              time.push(parseTime(res.data.maxEffectiveTime).split(" ")[0]);
            }
 
            crud.form["timeFormat"] = time;
          }
        });
      }
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      // if(!this.copyContent.faceDatabase && !this.copyContent2.faceDatabase){
      //     this.$message({
      //       message: '自定义人脸库和通用人脸库二选一',
      //       type: 'error'
      //     })
      //     return false
      // }
      if (!this.ucapFiguresFaceDatabase && !this.custormFiguresFaceDatabase) {
        this.$message({
          message: "请选择任意一个或多个人脸库",
          type: "error"
        });
        return false;
      }

      if(this.copyContent.custormFigures){
        if(this.copyContent.custormFigures.length==0 && this.custormFiguresFaceDatabase){
          this.$message({
            message: "请选择任意一个或多个人脸库",
            type: "error"
          });
          return false;
        }
      }

      if(this.copyContent2.ucapFigures){
        if(this.copyContent2.ucapFigures.length==0 && this.ucapFiguresFaceDatabase){
          this.$message({
            message: "请选择任意一个或多个人脸库",
            type: "error"
          });
          return false;
        }
      }

      crud.form["custormFigures"]


      if (crud.form.warnUser) {
        if (!isvalidPhone(crud.form.warnUser)) {
          this.$message({
            message: "手机号格式填写错误,请重新填写",
            type: "error"
          });
          return false;
        }
      }
      crud.form["custormFlag"] = this.custormFiguresFaceDatabase ? "1" : "0";
      crud.form["custormMin"] = this.copyContent.sectionOne ? this.copyContent.sectionOne.replace("%", "") / 100 : this.copyContent.custormMin;
      crud.form["custormMax"] = this.copyContent.sectionTwo ? this.copyContent.sectionTwo.replace("%", "") / 100 : this.copyContent.custormMax;

      let custormFiguresId = [];
      if (this.copyContent.custormFigures) {
        this.copyContent.custormFigures.forEach(element => {
          if(element.figureId){
            custormFiguresId.push(element.figureId);
          }else{
            custormFiguresId.push(element.id);
          }
        });
      }
      crud.form["custormFigures"] = custormFiguresId;

      crud.form["minEffectiveTime"] =
        crud.form.timeFormat[0] + " " + "00:00:00";
      crud.form["maxEffectiveTime"] =
        crud.form.timeFormat[1] + " " + "23:59:59";

      crud.form["ucapFlag"] = this.ucapFiguresFaceDatabase ? "1" : "0";
      crud.form["ucapMin"] = this.copyContent2.sectionOne ? this.copyContent2.sectionOne.replace("%", "") / 100 : this.copyContent2.ucapMin;
      crud.form["ucapMax"] = this.copyContent2.sectionTwo ? this.copyContent2.sectionTwo.replace("%", "") / 100 : this.copyContent2.ucapMax;

      let ucapFiguresId = [];
      if (this.copyContent2.ucapFigures) {
        this.copyContent2.ucapFigures.forEach(element => {
          if(element.figureId){
            ucapFiguresId.push(element.figureId);
          }else{
            ucapFiguresId.push(element.id);
          }
        });
      }
      crud.form["ucapFigures"] = ucapFiguresId;

      //delete crud.form.timeFormat;
      return true;
    },
    getDatalistFigure(type) {
      getlistFigure({
        examineId: "",
        name: "",
        pinyin: "",
        type: type
      }).then(res => {
        if (res.code == 200) {
          if (type == "1") {
            this.copyContent["custormFigures"] = res.data || [];
            this.copyContent["totalNum"] = this.copyContent[
              "custormFigures"
            ].length;
            this.copyContent['custormFiguresTotal'] = res.data;
          } else {
            this.copyContent2["ucapFigures"] = res.data || [];
            this.copyContent2["totalNum"] = this.copyContent2[
              "ucapFigures"
            ].length;
            this.copyContent2['ucapFiguresTotal'] = res.data;
          }
        }
      });
    },
    closeDialog(val) {
      // if(val.customList){
      //   this.copyContent['custormFigureBackVos'] = val.customList;
      // }else{
      //   this.copyContent2['ucapFigureBackVos'] = val.ucapFigure;
      // }
      this.dialogVisible2 = false;
      Bus.$emit("selectCustomList", val);
    },
    handleDataFrame(val) {
      this.model = val.model;
      this.dialogVisible2 = true;
      //this.$refs.modelElem.init();
      this.$nextTick(() => {
        this.$refs.modelElem.init(val.data);
      });
    },
    toDelete(data, mgs, info) {
      let arr = [];
      if (mgs == "one") {
        arr.push(data);
      } else {
        if (data.length == 0) {
          return;
        }
        arr = data;
      }
      this.$confirm(info, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(arr);
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
@import url("../../assets/styles/dialog.css");
</style>
