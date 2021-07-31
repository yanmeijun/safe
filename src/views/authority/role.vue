<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="siteMenuBox marTop10">
      <div class="searchAllBox otherSearchBox clearfix">
        <!-- 搜索 -->
        <div class="fl clearfix">
          <div class="fl clearfix wh90" v-if="this.user.isAdmin">
            <Mechanism-Select 
            v-bind:width= "width"
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">角色名称：</span>
            <el-input
              v-model="query.blurry"
              size="small"
              clearable
              placeholder="请输入角色名称查询"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
            />
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">创建时间：</span>
            <el-date-picker
              v-model="query.createTime"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator="-"
              size="small"
              class="date-item"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </div>
        <div class="btnRtSearch">
          <!-- <rrOperation /> -->
          <el-button
            class="filter-item"
            size="small"
            @click="resetNewQuery()"
            >重置</el-button
          >
          <el-button
            class="filter-item"
            size="small"
            type="primary"  
            @click="crud.toQuery"
            >查询</el-button
          >
        </div>
      </div>
      <div class="clearfix" style="margin:10px 0">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">角色列表</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            v-if="crud.selections.length"
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
      <el-row :gutter="15">
        <!--角色管理-->
        <el-col
          :xs="24"
          :sm="24"
          :md="16"
          :lg="16"
          :xl="17"
          style="margin-bottom: 10px"
        >
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <span class="role-span">角色列表</span>
            </div>
            <el-table
              ref="table"
              v-loading="crud.loading"
              highlight-current-row
              style="width: 100%;"
              :data="crud.data"
              @selection-change="crud.selectionChangeHandler"
              @current-change="handleCurrentChange"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="name" label="角色名称" min-width="50%" />
              <el-table-column prop="deptName" label="所属机构" min-width="45%" v-if="this.user.isAdmin"/>
              <el-table-column prop="deptId" label="ID" min-width="35%" v-if="this.user.isAdmin"/>
              <el-table-column
                :show-overflow-tooltip="true"
                prop="createTime"
                label="创建日期"
              >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="130px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div class="tabIiconOperate" v-if="scope.row.level >= level">
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
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <el-tooltip
                class="item"
                effect="dark"
                content="选择指定角色分配菜单"
                placement="top"
              >
                <span class="role-span">菜单分配</span>
              </el-tooltip>
              <el-button
                v-permission="['admin', 'roles:edit']"
                :disabled="!showButton"
                :loading="menuLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="saveMenu"
                >保存</el-button
              >
            </div>
            <el-tree
              ref="menu"
              lazy
              :data="menus"
              :default-checked-keys="menuIds"
              :load="getMenuDatas"
              :props="defaultProps"
              accordion
              show-checkbox
              node-key="id"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="585px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="94px"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="form.name" style="width: 412px;" maxlength="20"/>
        </el-form-item>
        <el-form-item label="所属机构：" prop="deptId" v-if="this.user.isAdmin">
          <el-select v-model="form.deptId" class="filter-item" style="width: 412px;" @change="changeDeptId">
            <el-option
              v-for="item in depts"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />  
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
import crudRoles from "@/api/system/role";
import { getDepts, getDeptSuperior } from "@/api/system/dept";
import { getMenusTree, getMenuSuperior } from "@/api/system/menu";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import { mapGetters } from "vuex";
import MechanismSelect from "@/components/MechanismSelect";
const defaultForm = {
  id: null,
  name: null,
  depts: [],
  description: null,
  dataScope: "全部",
  level: 3,
  deptId: ''
};
export default {
  name: "Role",
  components: {
    Treeselect,
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    MechanismSelect
  },
  cruds() {
    return CRUD({
      title: "角色",
      url: "api/roles",
      sort: "level,asc",
      crudMethod: { ...crudRoles },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      defaultProps: { children: "children", label: "label", isLeaf: "leaf" },
      dateScopes: ["全部", "本级", "自定义"],
      level: 3,
      currentId: 0,
      menuLoading: false,
      showButton: false,
      menus: [],
      menuIds: [],
      depts: [],
      permission: {
        add: ["admin", "roles:add"],
        edit: ["admin", "roles:edit"],
        del: ["admin", "roles:del"]
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "请选择所属机构", trigger: "blur" },
        ]
      },
      width: '70px',
      mechanismSelectUpload: '0'
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted(){
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.crud.toQuery();

    this.getDepts();
  },
  created() {
    crudRoles.getLevel().then(data => {
      this.level = data.level;
    });
  },
  methods: {
    resetNewQuery(){
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
    getMenuDatas(node, resolve) {
      setTimeout(() => {
        getMenusTree({pid: node.data.id ? node.data.id : 0,deptId: node.data.deptId ? node.data.deptId : this.user.deptId}).then(res => {
          // let childrenList=[];
          // this.menuIds.map(items =>{
          //     res.map(item => {
          //       if(items == item.id){
          //         childrenList.push(item);
          //       }
          //     })
          // })
          // resolve(childrenList)
          resolve(res);
        });
      }, 100);
    },
    changeDeptId(val){
      if(!val)return;
      // getMenus({deptId: val}).then(res => {
      //    this.crud.form.menus = res.content;
      // })
    },
    [CRUD.HOOK.afterRefresh]() {
      this.$refs.menu.setCheckedKeys([]);
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {
      if (form.dataScope === "自定义") {
        if (form.id == null) {
          this.getDepts();
        } else {
          this.getSupDepts(form.depts);
        }
      }
      const depts = [];
      form.depts.forEach(function(dept, index) {
        depts.push(dept.id);
      });
      form.depts = depts;
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.dataScope === "自定义" && crud.form.depts.length === 0) {
        this.$message({
          message: "自定义数据权限不能为空",
          type: "warning"
        });
        return false;
      } else if (crud.form.dataScope === "自定义") {
        const depts = [];
        crud.form.depts.forEach(function(data, index) {
          const dept = { id: data };
          depts.push(dept);
        });
        crud.form.depts = depts;
      } else {
        crud.form.depts = [];
      }
      //crud.form.menus
      // crud.form.createTime = this.user.createTime;
      // crud.form.createBy = this.user.createBy;
      // crud.form.updateTime = this.user.updateTime;
      // crud.form.updateBy = this.user.updateBy;
      return true;
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud);
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud);
    },
    afterErrorMethod(crud) {
      const depts = [];
      crud.form.depts.forEach(function(dept, index) {
        depts.push(dept.id);
      });
      crud.form.depts = depts;
    },
    // 触发单选
    handleCurrentChange(val) {
      getMenusTree({deptId: val.deptId, pid: 0}).then(res => {
          res.map(x => {
            x['deptId'] = val.deptId;
          })
        this.menus = res || []
      })
      if (val) {
        const _this = this;
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([]);
        // 保存当前的角色id
        this.currentId = val.id;
        this.showButton = this.level <= val.level;
        // 初始化
        this.menuIds = [];
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          _this.menuIds.push(data.id);
        });
        //this.menus=[];
        let childrenList = [];
        getMenuSuperior(this.menuIds).then(res => {
          // res.map(x => {
          //     _this.menuIds.map(item => {
          //       if(x.id == item){
          //         _this.menus.push(x)
          //       }
          //     })
          // })
          //this.menus = res;
        });
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuLoading = true;
      const role = { id: this.currentId, menus: [] };
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const menu = { id: data.id };
        role.menus.push(menu);
      });
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data };
        role.menus.push(menu);
      });
      crudRoles
        .editMenu(role)
        .then(res => {
          this.crud.notify("保存成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
          this.menuLoading = false;
          this.update();
        })
        .catch(err => {
          this.menuLoading = false;
          console.log(err.response.data.message);
        });
    },
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRoles.get(this.currentId).then(res => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res;
            break;
          }
        }
      });
    },
    // 获取部门数据
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null;
          }
          return obj;
        });
      });
    },
    getSupDepts(depts) {
      const ids = [];
      depts.forEach(dept => {
        ids.push(dept.id);
      });
      getDeptSuperior(ids).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren && !obj.children) {
            obj.children = null;
          }
          return obj;
        });
      });
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null;
            }
            return obj;
          });
          setTimeout(() => {
            callback();
          }, 200);
        });
      }
    },
    // 如果数据权限为自定义则获取部门数据
    changeScope() {
      if (this.form.dataScope === "自定义") {
        this.getDepts();
      }
    },
    getMechanismChecked(val){
      console.log(val)
      this.mechanismSelectUpload = String(Math.random());
    },
    //删除
    toDelete(datas, one) {
      if (one == "one") {
        let arr = [];
        arr.push(datas);
        this.$confirm(`确认删除` + datas.name + `这个角色?`, "提示", {
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
/deep/ .vue-treeselect__multi-value {
  margin-bottom: 0;
}
/deep/ .vue-treeselect__multi-value-item {
  border: 0;
  padding: 0;
}
</style>
