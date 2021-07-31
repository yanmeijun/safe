<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="siteMenuBox marTop10">
      <div class="searchAllBox otherSearchBox head-container">
        <div class="clearfix marRt135">
          <div class="fl clearfix wh90" v-if="this.user.isAdmin">
            <Mechanism-Select 
            v-bind:width= "width"
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"
            ></Mechanism-Select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt fl">添加时间：</span>
            <el-date-picker
              class="date-item"
              v-model="query.webAccoutTime"
              :default-time="['00:00:00', '23:59:59']"
              type="daterange"
              range-separator="-"
              :clearable="false"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
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
      <div class="clearfix" style="margin:0 0 10px">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">网站账号</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toDelete(crud.selections)"
          >
            批量删除
          </button>
          <button class="btnListDefault flt" @click="doExport">导出全部</button>
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
        row-key="id"
        class="tableColumnWh"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="序号" type="index" align="center" width="50" />
        <el-table-column
          :show-overflow-tooltip="true"
          label="网站名称"
          prop="name"
          min-width="20%"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          label="网站首页地址"
          min-width="20%"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="网站标识码"
          prop="siteCode"
          align="center"
          min-width="15%"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          prop="createTime"
          label="添加时间"
          min-width="13%"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="10%"
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
      class="newWebsiteAccountDia"
      width="550px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-form-item label="所属机构：" prop="deptId" v-if="this.user.isAdmin">
          <el-select v-model="form.deptId" class="filter-item" style="width: 388px;">
            <el-option
              v-for="item in depts"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            />  
          </el-select>
        </el-form-item>
        <el-form-item label="网站名称" prop="name">
          <el-input v-model="form.name" style="width: 388px;" />
        </el-form-item>
        <el-form-item label="网站首页地址" prop="url">
          <el-input v-model="form.url" style="width: 388px;" />
        </el-form-item>
        <el-form-item label="网站标识码" prop="siteCode">
          <el-input
            v-model="form.siteCode"
            style="width: 388px;"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="网站标识码" prop="type" style="display: none;">
          <el-input
            v-model="form.type"
            style="width: 388px;"
            :disabled="true"
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
import websiteDetection from "@/api/websiteDetection/web/index";
import { validURL } from "@/utils/validate";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import { getDepts } from "@/api/system/dept";
import MechanismSelect from "@/components/MechanismSelect";

const defaultForm = { name: null, siteCode: "", url: "", type: "0" ,deptId : ''};
export default {
  name: "WebAccount",
  components: { pagination, rrOperation, MechanismSelect },
  cruds() {
    return CRUD({
      title: "网站账号",
      url: "/uDatabaseInfo/list",
      newAddRefresh: true,
      crudMethod: { ...websiteDetection },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    // 自定义验证
    const validUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error("网站首页地址不能为空"));
      } else {
        callback();
      }
      // else if (!validURL(value)) {
      //   callback(new Error('请输入正确的网站地址'))
      // }
    };
    return {
      depts: [],
      permission: {
        edit: ["admin", "menu:edit"],
        del: ["admin", "menu:del"]
      },
      rules: {
        name: [
          { required: true, message: "网站名称不能为空", trigger: "blur" }
        ],
        url: [{ required: true, trigger: "blur", validator: validUrl }],
        deptId: [
          { required: true, message: "请选择所属机构", trigger: "blur" }
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
    this.crud.toQuery()
  },
  methods: {
    getMechanismChecked(val){
      this.mechanismSelectUpload = String(Math.random());
    },
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
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    //删除
    toDelete(datas, one) {
      if (one == "one") {
        let arr = [];
        arr.push(datas);
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
        if(datas.length==0){
          return;
        }
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
    //导出
    doExport() {
      this.crud.url = "/uDatabaseInfo/export";
      this.crud.downExport();
      // window.open("http://101.37.27.228:8000/uDatabaseInfo/export", '_self');
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getDepts()
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content || [];
      });
    },
  }
};
</script>
