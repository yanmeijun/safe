<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="siteMenuBox marTop10">
      <div class="clearfix" v-if="this.user.isAdmin">
        <Mechanism-Select 
        v-bind:width= "width"
        :mechanismSelectUpload="mechanismSelectUpload"
        @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
      </div>
      <div class="clearfix" style="margin-bottom:10px">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">预警接收人信息</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button class="btnListDefault btnTabBlue flt" @click="crud.toAdd">
            新增
          </button>
        </div>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :data="crud.data"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="id"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="手机号" prop="phoneNumber" />
        <el-table-column label="邮箱号" prop="email" />
        <el-table-column
          v-permission="['admin', 'menu:del']"
          label="操作"
          width="130px"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button title="修改" @click="crud.toEdit(scope.row)">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>
              <button title="删除" @click="toDelete(scope.row)">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
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
    <!-- 创建弹框 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="600px"
    >
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            style="width: 170px;"
            placeholder="请输入"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            v-model="form.phoneNumber"
            style="width: 170px;"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="邮箱号" prop="email">
          <el-input
            v-model="form.email"
            style="width: 170px;"
            placeholder="请输入"
          />
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
  </div>
</template>

<script>
import receiver from "@/api/earlyWarning/receiver/index";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import MechanismSelect from "@/components/MechanismSelect";
import { mapGetters } from "vuex";

const defaultForm = { id: null, name: null, phoneNumber: "", email: "" };
export default {
  name: "WarnReceiver",
  components: { pagination, udOperation, MechanismSelect },
  cruds() {
    return CRUD({
      title: "预警接收人",
      url: "/uWarnUser",
      newAddRefresh: true,
      crudMethod: { ...receiver },
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
      rules: {
        name: [{ required: true, message: "名字不能为空", trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入合法手机号/电话号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "邮箱号不能为空", trigger: "blur" },
          {
            pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ]
      },
      width: '42px',
      mechanismSelectUpload: '0'
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted: function() {
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.crud.toQuery();
  },
  methods: {
    [CRUD.HOOK.afterToCU](crud, form) {
      // form.id = null
    },
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
      this.crud.toQuery();
    },
    //删除
    toDelete(datas, one) {
      let arr = [];
      arr.push(datas);
      this.$confirm(
        `确认删除` + `"` + datas.name + `"` + `预警接收人?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(arr);
        })
        .catch(() => {});
    }
  }
};
</script>
