<template>
  <div class="app-container">
    <!--用户数据-->
    <!--工具栏-->
    <div class="siteMenuBox head-container marTop10">
      <div class="searchAllBox otherSearchBox">
        <div class="clearfix marRt135">
          <div class="clearfix fl originaLeft" v-if="this.user.isAdmin">
            <Mechanism-Select  
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">用户角色：</span>
            <el-select v-model="query.roleId" class="filter-item">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="fl clearfix wh60">
            <span class="main-aside-txt fl">状态：</span>
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">用户名：</span>
            <el-input
              v-model="query.username"
              placeholder="请输入用户名查询"
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
      <div class="clearfix" style="margin:10px 0">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">用户列表</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="batchUpdate(crud.selections, false)"
          >
            禁用
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="batchUpdate(crud.selections, true)"
          >
            启用
          </button>
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            v-if="crud.selections.length"
            @click="toDelete(crud.selections)"
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
        :data="crud.data"
        row-key="id+index"
        @select="crud.selectChange"
        class="tableColumnWh"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="username"
          label="用户名"
          min-width="20%"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          label="登录密码"
          min-width="20%"
        >
          <template slot-scope="scope">
            <span class="pwdOmission">······</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="userRole"
          label="用户角色"
          min-width="25%"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="deptName"
          label="所属机构"
          min-width="20%"
          v-if="this.user.isAdmin"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="createTime"
          label="创建日期"
          min-width="20%"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-permission="['user:edit', 'user:del']"
          label="操作"
          width="135"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button title="编辑" @click="crud.toEdit(scope.row)">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>
              <button title="删除" @click="toDelete(scope.row, 'one')">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
              <button
                title="启用"
                v-if="!scope.row.enabled"
                @click="batchUpdate(scope.row, true, 'one')"
              >
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban29"></use>
                </svg>
              </button>
              <button title="禁用" v-else>
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  @click="batchUpdate(scope.row, false, 'one')"
                >
                  <use xlink:href="#icontubiaozhizuomoban30"></use>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>

    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="680px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="110px"
      >

      <el-form-item label="所属机构：" prop="deptId" v-if="this.user.isAdmin && !form.id">
        <el-select v-model="form.deptId" class="filter-item" style="width: 450px;" @change="changeDeptId">
          <el-option
            v-for="item in depts"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />  
        </el-select>
      </el-form-item>

      <el-form-item label="所属机构：" prop="deptId" v-if="this.user.isAdmin && form.id">
        <el-input type="text" style="width: 450px" disabled v-model="item.name" :key="item.id" v-for="item in depts" v-if="form.deptId == item.id" />
      </el-form-item>

        <el-form-item label="用户角色" prop="userRoles">
          <el-select
            v-model="form.userRoles"
            style="width: 450px"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id + '$$$' + item.name"
            /> </el-select
          ><!-- :disabled="level !== 1 && item.level <= level" -->
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            style="width: 450px"
            :disabled="form.disabled"
          />
        </el-form-item>
        <el-form-item v-if="!form.disabled" label="密码">
          <el-input
            v-model="form.password"
            style="width: 450px"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item v-if="form.disabled" label="重置密码">
          <el-radio-group v-model="form.isClear" style="width: 450px">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="form.enabled" style="width: 450px">
            <el-radio
              v-for="item in dict.user_status"
              :key="item.id"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="对应网站">
          <el-select
            multiple
            v-model="form.webListChecked"
            style="width: 450px;"
            @change="changeWebSelect"
            @remove-tag="removeWebTag"
            placeholder="请选择"
          >
            <el-option
              label="全选"
              value="all"
              @click.native="selectWebAll"
            ></el-option>
            <el-option
              v-for="(item, index) in webList"
              :key="index"
              :label="item.name"
              :value="item.siteCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新媒体类型">
          <el-select
            multiple
            v-model="form.mediaTypeListChecked"
            style="width: 450px;"
            @change="changeTypeSelect"
            @remove-tag="removeTypeTag"
            placeholder="请选择"
          >
            <el-option
              label="全部"
              value="all"
              key="all"
              @click.native="selectTypeAll"
            ></el-option>
            <el-option
              v-for="(item, index) in mediaTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="新媒体账号"> 
          <el-select
            multiple
            v-model="form.mediaTypeUserListChecked"
            style="width: 450px;"
            @change="changeUserSelect"
            @remove-tag="removeUserTag"
            placeholder="请选择"
          >
            <el-option
              label="全部"
              value="all"
              key="all"
              @click.native="selectUserAll"
            ></el-option>
            <el-option
              v-for="(item, index) in mediaTypeUserList"
              :key="index"
              :label="item.nickName"
              :value="item.wxid + '$$$' + item.mediaType"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudUser from "@/api/system/user";
import { isuserName } from "@/utils/validate";
import { dataHttpGet, dataHttpPost } from "@/api/common";
import { getAll, getLevel } from "@/api/system/role";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import Treeselect from "@riophae/vue-treeselect";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import MechanismSelect from "@/components/MechanismSelect";
import { getDepts } from "@/api/system/dept";
import { getDeptIdRoles } from "@/api/system/role";
const defaultForm = {
  password: 123456,
  username: null,
  enabled: "true",
  roles: [],
  userRoles: null,
  disabled: false,
  webListChecked: [],
  mediaTypeUserListChecked: [],
  mediaTypeListChecked: [],
  isClear: "false",
  deptId: '',
  id: null  
};
export default {
  name: "User",
  components: { Treeselect, rrOperation, udOperation, pagination, MechanismSelect },
  cruds() {
    return CRUD({
      title: "用户",
      url: "/api/users/list",
      newAddRefresh: true,
      crudMethod: { ...crudUser },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ["user_status"],
  data() {
    // 自定义验证
    const validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else if (value.replace(/\s/g, "").length == 0) {
        this.form.username = "";
        callback(new Error("请输入用户名"));
      } else if (!isuserName(value)) {
        callback(new Error("只支持英文字符和数字（不支持输入特殊字符和汉字）"));
      } else {
        callback();
      }
    };
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      level: 3,
      rolesList: [], //全部角色
      permission: {
        add: ["admin", "user:add"],
        edit: ["admin", "user:edit"],
        del: ["admin", "user:del"]
      },
      enabledTypeOptions: [
        { key: "true", display_name: "启用" },
        { key: "false", display_name: "禁用" }
      ],
      mediaTypeList: [
        { value: 101, label: "微信公众号" },
        { value: 102, label: "新浪微博" },
        { value: 111, label: "移动客户端" },
        { value: 112, label: "人民号" },
        { value: 113, label: "百家号" },
        { value: 103, label: "今日头条" },
        { value: 114, label: "其他" }
      ],
      webList: [], //全部网站
      mediaTypeUserList: [], //新媒体用户
      rules: {
        username: [
          { required: true, trigger: "blur", validator: validName },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        userRoles: [
          { required: true, message: "请选择用户角色", trigger: "change" }
        ],
        deptId: [
         { required: true, message: "请选择所属机构", trigger: "blur" },
        ]
      },
      organList: [],
      depts: [],
      mechanismSelectUpload: '0'
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.crud.msg.add = "新增成功，默认密码：123456";
  },
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };

    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.crud.toQuery();

    this.getRoles();
    this.getRoleLevel(); //权限
  },
  methods: {
    resetQueryData() {
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
    },
    changeDeptId(val){
      if(!val)return;
      this.crud.form.userRoles = ''
      getDeptIdRoles({deptId:val}).then(res => {
        this.rolesList = []
        this.rolesList = res.content || [];
      })
      this.getUUserAccountData(val);
    },
    toQueryData() {
      this.query.newAddAuthority = true;
      this.crud.toQuery();
    },
    selectWebAll() {
      if (this.form.webListChecked.length < this.webList.length) {
        this.form.webListChecked = [];
        this.webList.map(item => {
          this.form.webListChecked.push(item.siteCode);
        });
        this.form.webListChecked.unshift("all");
      } else {
        this.form.webListChecked = [];
      }
    },
    changeWebSelect(val) {
      if (!val.includes("all") && val.length === this.webList.length) {
        this.form.webListChecked.unshift("all");
      } else if (val.includes("all") && val.length - 1 < this.webList.length) {
        this.form.webListChecked = this.form.webListChecked.filter(item => {
          return item !== "all";
        });
      }
    },
    removeWebTag(val) {
      if (val === "all") {
        this.form.webListChecked = [];
      }
    },
    selectTypeAll() {
      if (this.form.mediaTypeListChecked.length < this.mediaTypeList.length) {
        this.form.mediaTypeListChecked = [];
        this.mediaTypeList.map(item => {
          this.form.mediaTypeListChecked.push(item.value);
        });
        this.form.mediaTypeListChecked.unshift("all");
      } else {
        this.form.mediaTypeListChecked = [];
      }
    },
    changeTypeSelect(val) {
      this.crud.form.mediaTypeUserListChecked = [];
      if (!val.includes("all") && val.length === this.mediaTypeList.length) {
        this.form.mediaTypeListChecked.unshift("all");
      } else if (
        val.includes("all") &&
        val.length - 1 < this.mediaTypeList.length
      ) {
        this.form.mediaTypeListChecked = this.form.mediaTypeListChecked.filter(
          item => {
            return item !== "all";
          }
        );
      }
      this.changeMediaType(val);
    },
    removeTypeTag(val) {
      if (val === "all") {
        this.form.mediaTypeListChecked = [];
      }
    },
    selectUserAll() {
      if (
        this.form.mediaTypeUserListChecked.length <
        this.mediaTypeUserList.length
      ) {
        this.form.mediaTypeUserListChecked = [];
        this.mediaTypeUserList.map(item => {
          this.form.mediaTypeUserListChecked.push(
            item.uid + "$$$" + item.mediaType
          );
        });
        this.form.mediaTypeUserListChecked.unshift("all");
      } else {
        this.form.mediaTypeUserListChecked = [];
      }
    },
    changeUserSelect(val) {
      if (
        !val.includes("all") &&
        val.length === this.mediaTypeUserList.length
      ) {
        this.form.mediaTypeUserListChecked.unshift("all");
      } else if (
        val.includes("all") &&
        val.length - 1 < this.mediaTypeUserList.length
      ) {
        this.form.mediaTypeUserListChecked = this.form.mediaTypeUserListChecked.filter(
          item => {
            return item !== "all";
          }
        );
      }
    },
    removeUserTag(val) {
      if (val === "all") {
        this.form.mediaTypeUserListChecked = [];
      }
    },

    //获取所有网站
    getUUserAccountData(deptId) {
      let url = "/uDatabaseInfo/getAllList";
      let params = {
        deptId: deptId
      }
      dataHttpGet(url,params).then(res => {
        this.webList = [];
        if (res) {
          this.webList = res.data || [];
        }
      });
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content || []
      });
    },
    // 获取弹窗内角色数据
    getRoles() {
      this.rolesList = [];
      getAll()
        .then(res => {
          this.rolesList = res;
        })
        .catch(() => {});
    },
    //查询媒体账号账户
    changeMediaType(val) {
      for (var i = 0; i < val.length; i++) {
        if (val[i] == "all") {
          val = [];
        }
      }
      let url = "/uMediaInfo/getAllList?deptId=" + this.form.deptId;
      dataHttpPost(url, val).then(res => {
        this.mediaTypeUserList = [];
        if (res) {
          if(this.form.mediaTypeListChecked.length === 0){
            this.mediaTypeUserList = []
          }else{
            this.mediaTypeUserList = res.data || [];
          }
        }
      });
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = form.enabled.toString();
        if(this.user.isAdmin){
          this.getDepts();
          if(form.id){
            getDeptIdRoles({deptId:form.deptId}).then(res => {
              this.rolesList = []
              this.rolesList = res.content || [];
            })
          }
        }else{
          this.getRoles()
          this.getUUserAccountData(this.user.deptInfo.deptId)
        }
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      form.disabled = true;
      this.getUUserAccountData(form.deptId)
      let data = form.UUserAccountList || [],
        type = [];
      if (form.roleId && form.userRole) {
        form.userRoles = form.roleId + "$$$" + form.userRole;
      } else {
        form.userRoles = "";
      }
      for (var i = 0; i < data.length; i++) {
        if (data[i].accounttype == 2) {
          form.mediaTypeUserListChecked.push(
            data[i].accoutid + "$$$" + data[i].mediatype
          );
          type.push(data[i].mediatype);
        } else {
          form.webListChecked.push(data[i].accoutid);
        }
      }
      form.mediaTypeListChecked = Array.from(new Set(type));
      this.changeMediaType(form.mediaTypeListChecked);
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (
        crud.form.webListChecked.length == 0 &&
        crud.form.mediaTypeUserListChecked.length == 0
      ) {
        this.$message({
          message: "请选择对应网站或新媒体账号",
          type: "warning"
        });
        return false;
      }

      let uuserAccountList = [],
        webArr = [],
        newArr = [];
      if (crud.form.userRoles) {
        let newRolesObj = {
          id: crud.form.userRoles.split("$$$")[0],
          name: crud.form.userRoles.split("$$$")[1]
        };
        crud.form.roles.push(newRolesObj);
      } else {
        crud.form.roles = [];
      }
      if (crud.form.webListChecked.length > 0) {
        if (crud.form.webListChecked[0] == "all") {
          for (var i = 0; i < this.webList.length; i++) {
            webArr.push(this.webList[i].siteCode);
          }
        } else {
          webArr = crud.form.webListChecked;
        }
      }
      for (var i = 0; i < webArr.length; i++) {
        let obj = {
          accounttype: 1,
          accoutid: webArr[i]
        };
        uuserAccountList.push(obj);
      }
      if (crud.form.mediaTypeUserListChecked.length > 0) {
        if (crud.form.mediaTypeUserListChecked[0] == "all") {
          for (var i = 0; i < this.mediaTypeUserList.length; i++) {
            let obj = {
              uid: this.mediaTypeUserList[i].wxid,
              type: this.mediaTypeUserList[i].mediaType
            };
            newArr.push(obj);
          }
        } else {
          for (var i = 0; i < crud.form.mediaTypeUserListChecked.length; i++) {
            let obj = {
              uid: crud.form.mediaTypeUserListChecked[i].split("$$$")[0],
              type: crud.form.mediaTypeUserListChecked[i].split("$$$")[1]
            };
            newArr.push(obj);
          }
        }
      }
      for (var i = 0; i < newArr.length; i++) {
        let obj = {
          accounttype: 2,
          accoutid: newArr[i].uid,
          mediatype: newArr[i].type
        };
        uuserAccountList.push(obj);
      }
      if (crud.form.isClear == "true") {
        crud.form.password = 123456;
      } else {
        delete crud.form.password;
      }
      crud.form.uuserAccountList = uuserAccountList;
      delete crud.form.createTime;
      delete crud.form.userRoles;
      delete crud.form.userRole;
      delete crud.form.disabled;
      delete crud.form.UUserAccountList;
      delete crud.form.mediaTypeUserListChecked;
      delete crud.form.mediaTypeListChecked;
      delete crud.form.webListChecked;
      delete crud.form.isClear;

      return true;
    },

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

    // 获取权限级别
    getRoleLevel() {
      getLevel()
        .then(res => {
          this.level = res.level;
        })
        .catch(() => {});
    },
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
    },
    //删除
    toDelete(datas, one) {
      if (one == "one") {
        let arr = [];
        arr.push(datas);
        //确认删除`+datas.username+`这个角色?
        this.$confirm(`确认要删除吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(arr);
          })
          .catch(() => {});
      } else {
        this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.crud.delAllLoading = true;
            this.crud.doDelete(datas);
          })
          .catch(() => {});
      }
    },
    batchUpdate(datas, type, one) {
      let str = "",
        tips = "",
        list = [];
      if (type) {
        str = "启用";
      } else {
        str = "禁用";
      }
      if (one == "one") {
        let params = {
          id: datas.id,
          enabled: type
        };
        list.push(params);
        tips = `确认` + str + `"` + datas.username + `"` + `这条数据?`;
      } else {
        tips = `确认` + str + `选中的${datas.length}条数据?`;
        for (var i = 0; i < datas.length; i++) {
          let params = {
            id: datas[i].id,
            enabled: type
          };
          list.push(params);
        }
      }
      let url = "/api/users/batchUpdate";
      this.$confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dataHttpPost(url, list).then(res => {
            if (res.code == 200) {
              this.$notify({
                title: str + "成功",
                type: "success"
              });
              this.crud.toQuery();
            } else {
              this.$notify.error({
                title: str + "失败"
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .vue-treeselect__control,
/deep/ .vue-treeselect__placeholder,
/deep/ .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
