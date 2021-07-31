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
            <span class="main-aside-txt">账号状态：</span>
            <el-select v-model="query.accountState" class="filter-item">
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt">账号类型：</span>
            <el-select v-model="query.mediaType" class="filter-item">
              <el-option
                v-for="(item, index) in mediaTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="fl clearfix wh90">
            <span class="main-aside-txt">账号名称：</span>
            <el-input
              v-model="query.nickName"
              placeholder="请输入账号名称"
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
      <div class="clearfix" style="margin:0 0 10px 0">
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">新媒体账号</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
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
        <el-table-column label="序号" type="index" width="40" align="center" />
        <el-table-column
          :show-overflow-tooltip="true"
          label="账号类型"
          prop="mediaType"
          min-width="10%"
        >
          <template slot-scope="scope">{{
            fnType(scope.row.mediaType)
          }}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="账号名称"
          prop="nickName"
          min-width="13%"
        />
        <!-- <el-table-column :show-overflow-tooltip="true" label="账号ID" prop="uid" min-width="18%" /> -->
        <el-table-column
          :show-overflow-tooltip="true"
          label="账号ID"
          min-width="18%"
        >
          <!-- <template slot-scope="scope">
                <span v-if="scope.row.mediaType != 101"> {{scope.row.uid}} </span>
                <span v-else> {{scope.row.wxid}} </span>
              </template> -->
          <template slot-scope="scope">
            <span> {{ scope.row.uid }} </span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          label="唯一标识"
          min-width="18%"
        >
          <!-- <template slot-scope="scope">
                <span v-if="scope.row.mediaType == 101"> {{scope.row.uid}} </span>
              </template> -->
          <template slot-scope="scope">
            <span> {{ scope.row.wxid }} </span>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          label="主页URL"
          min-width="18%"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="账号状态"
          prop="accountState"
          align="center"
          min-width="10%"
        >
          <template slot-scope="scope">{{
            scope.row.accountState == 1 ? "正常" : "注销"
          }}</template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="添加时间"
          align="center"
          min-width="15%"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
      class="dialogXmtTypeBox"
      width="600px"
    >
      <a
        class="xmtzhxxLink"
        href="https://www.kaipuyun.cn/kp/qtwtX/201905/4ed53b4424bc4bc0a3e630e9efa412c9.shtml"
        target="_blank"
        >如何获取新媒体账号信息？</a
      >
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="110px"
      >
      <el-form-item label="所属机构：" prop="deptId" v-if="this.user.isAdmin">
        <el-select v-model="form.deptId" class="filter-item" style="width: 400px;">
          <el-option
            v-for="item in depts"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />  
        </el-select>
      </el-form-item>
        <el-form-item
          label="新媒体类型"
          prop="mediaType"
          placeholder="请选择新媒体类型"
        >
          <el-select
            v-model="form.mediaType"
            style="width: 400px;"
            placeholder="请选择新媒体类型"
            @change="changeType"
          >
            <el-option
              v-for="(item,index) in mediaTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="url" prop="url" v-if="form.mediaType != 111"> -->
        <el-form-item :label="url" prop="url" v-if="form.mediaType == 101">
          <el-input
            v-model="form.url"
            style="width: 315px;"
            :placeholder="placeholderUrl"
          />
          <el-button @click="getUrl" :disabled="!form.url">一键获取</el-button>
        </el-form-item>
        <el-form-item
          :label="url"
          prop="url"
          v-if="form.mediaType != 101 && form.mediaType != 111"
        >
          <el-input
            v-model="form.url"
            style="width: 400px;"
            :placeholder="placeholderUrl"
          />
        </el-form-item>

        <el-form-item :label="nickName" prop="nickName">
          <el-input
            v-model="form.nickName"
            style="width: 400px;"
            :placeholder="placeholderNickName"
          />
        </el-form-item>
        <el-form-item :label="uid" prop="uid" v-if="form.mediaType == 101">
          <el-input
            v-model="form.uid"
            style="width: 400px;"
            :placeholder="placeholderUid"
          />
        </el-form-item>
        <el-form-item :label="wxid" prop="wxid" v-if="form.mediaType == 101">
          <el-input
            v-model="form.wxid"
            style="width: 400px;"
            :placeholder="placeholderUid"
          />
        </el-form-item>
        <el-form-item
          :label="uid"
          prop="uid"
          v-if="form.mediaType != 101 && form.mediaType != 111"
        >
          <el-input
            v-model="form.uid"
            style="width: 400px;"
            :placeholder="placeholderUid"
          />
        </el-form-item>

        <el-form-item
          label="微信类型"
          prop="type"
          v-if="form.mediaType == '101'"
        >
          <el-radio-group v-model="form.type" style="width: 400px">
            <el-radio label="1">订阅号</el-radio>
            <el-radio label="2">服务号</el-radio>
            <el-radio label="3">企业号</el-radio>
          </el-radio-group>
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
import mediaDetection from "@/api/websiteDetection/media/index";
import { validURL } from "@/utils/validate";
import { dataHttpPostJson } from "@/api/common";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import { getDepts } from "@/api/system/dept";
import MechanismSelect from "@/components/MechanismSelect";

const defaultForm = {
  mediaType: 101,
  url: null,
  uid: null,
  nickName: null,
  wxid: null,
  type: null,
  deptId: ''
};
export default {
  name: "MediaAccount",
  components: { pagination, rrOperation, MechanismSelect },
  cruds() {
    return CRUD({
      title: "新媒体账号",
      url: "/uMediaInfo/list",
      newAddRefresh: true,
      crudMethod: { ...mediaDetection },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    // 自定义验证
    const validUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error("文章链接不能为空"));
      } else if (!validURL(value)) {
        callback(new Error("请输入正确的文章链接"));
      } else {
        callback();
      }
    };
    return {
      depts: [],
      mediaType: "",
      status: "",
      accountState: "",
      mediaTypeList: [
        { value: 101, label: "微信公众号" },
        { value: 102, label: "新浪微博" },
        { value: 111, label: "移动客户端" },
        { value: 112, label: "人民号" },
        { value: 113, label: "百家号" },
        { value: 103, label: "今日头条" },
        { value: 114, label: "其他" }
      ],
      statusList: [{ value: 1, label: "正常" }, { value: 0, label: "注销" }], // 审核状态
      rules: {
        nickName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        uid: [{ required: true, message: "请输入账号", trigger: "blur" }],
        wxid: [{ required: true, message: "请输入唯一标识", trigger: "blur" }],
        url: [{ required: true, trigger: "blur", validator: validUrl }],
        mediaType: [
          { required: true, message: "请选择账号类型", trigger: "change" }
        ],
        type: [{ required: true, message: "请选择微信类型", trigger: "change" }],
        deptId: [
          { required: true, message: "请选择所属机构", trigger: "blur" }
        ]
      },
      url: "文章链接",
      wxid: "微信唯一标识",
      placeholderUrl: "请输入账号中任意一篇发布成功的文章链接",
      nickName: "名称",
      placeholderNickName: "请输入微信公众号名称",
      uid: "微信号",
      placeholderUid: "请输入微信号",
      width: '90px',
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
    getUrl() {
      let url = "/uMediaInfo/getWeChatDetailInfo";
      let params = {
        mediaType: this.form.mediaType,
        url: this.form.url
      };
      dataHttpPostJson(url, params).then(res => {
        if (res) {
          if (res.code == 200) {
            this.form.uid = res.data.weixin_id;
            this.form.wxid = res.data.biz_id;
            this.form.nickName = res.data.nickname;
          } else {
            this.$notify.error({
              title: "一键获取失败"
            });
          }
        }
      });
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      // form.mediaType = 101
      this.getDepts()
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      if(crud.form.mediaType != 101 && crud.form.mediaType != 111){
        crud.form.wxid = crud.form.uid;
      }
      return true;
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content || [];
      });
    },
    fnType: function(data) {
      for (var i = 0; i < this.mediaTypeList.length; i++) {
        if (data == this.mediaTypeList[i].value) {
          return this.mediaTypeList[i].label;
        }
      }
    },
    changeType(val) {
      if (val == 101) {
        this.url = "文章链接";
        this.placeholderUrl = "请输入账号中任意一篇发布成功的文章链接";
        this.nickName = "名称";
        this.placeholderNickName = "请输入微信公众号名称";
        this.uid = "微信号";
        this.placeholderUid = "请输入微信号";
      } else if (val == 102) {
        this.url = "主页链接";
        this.placeholderUrl = "请输入新浪微博所在的主页链接";
        this.nickName = "昵称";
        this.placeholderNickName = "请输入新浪微博的昵称";
        this.uid = "oid";
        this.placeholderUid = "请输入新浪微博的oid";
      } else if (val == 111) {
        this.nickName = "应用昵称";
        this.placeholderNickName = "请输入应用的名称";
      } else if (val == 112) {
        this.url = "主页链接";
        this.placeholderUrl = "请输入人民号的主页链接";
        this.nickName = "作者名称";
        this.placeholderNickName = "请输入作者的名称";
        this.uid = "作者的ID";
        this.placeholderUid = "请输入作者的ID";
      } else if (val == 113) {
        this.url = "主页链接";
        this.placeholderUrl = "请输入百家号的主页链接";
        this.nickName = "百家号名称";
        this.placeholderNickName = "请输入百家号名称";
        this.uid = "app_id";
        this.placeholderUid = "请输入百家号的app_id";
      } else if (val == 103) {
        this.url = "主页链接";
        this.placeholderUrl = "请输入所在的主页地址";
        this.nickName = "头条号名称";
        this.placeholderNickName = "请输入头条号名称";
        this.uid = "头条号ID";
        this.placeholderUid = "请输入头条号ID";
      } else if (val == 114) {
        this.url = "主页链接";
        this.placeholderUrl = "请输入应用的主页地址";
        this.nickName = "名称";
        this.placeholderNickName = "请输入应用的名称";
        this.uid = "账号ID";
        this.placeholderUid = "请输入应用的账号ID";
      }
    }
  }
};
</script>
<style>
/* /deep/ .el-dialog{height: 76%;} */
</style>
