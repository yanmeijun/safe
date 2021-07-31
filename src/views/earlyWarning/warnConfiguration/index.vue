<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="searchTabBox marTop10">
      <div
        class="tabListTit clearfix"
        style="border-bottom: 1px solid #eee;margin-bottom: 10px;"
      >
        <ul>
          <li v-bind:class="{ active: isActive }" @click="changeWarnType('1')">
            <a href="javascript:;">网站预警配置</a>
          </li>
          <li v-bind:class="{ active: !isActive }" @click="changeWarnType('0')">
            <a href="javascript:;">新媒体预警配置</a>
          </li>
        </ul>
      </div>
      <div class="clearfix">
          <Mechanism-Select 
          v-bind:width= "width"
          v-if="this.user.isAdmin"
          :mechanismSelectUpload= "mechanismSelectUpload"
          @getMechanismChecked="getMechanismChecked"
          ></Mechanism-Select>
          <div class="fl" style="margin-left:10px;">
            <span class="main-aside-txt" style="margin: 0px;">策略查询：</span>
            <el-input
              v-model="query.name"
              placeholder="请输入策略名称"
              size="small"
              class="filter-item"
              style="width: 200px;"
            />
          </div>
          <div class="frt">
            <!-- <rrOperation :newVersion="true" /> -->
            <el-button
              v-if="crud.optShow.reset"
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
          <span style="padding-left:5px" v-if="warnType == 1"
            >网站预警配置</span
          >
          <span style="padding-left:5px" v-else>新媒体预警配置</span>
          <span style="font-weight: normal;margin-left: 20px;"
            >共：<a style="color: #FF373A;">{{ crud.data.length }} </a> 个</span
          >
        </span>

        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            v-if="crud.selections.length"
            @click="toDelete(crud.selections)"
          >
            删除
          </button>
          <button class="btnListDefault btnTabBlue flt" @click="crud.toAdd">
            添加策略
          </button>
        </div>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :data="crud.data"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
        class="tableColumnWh"
      >
        <el-table-column type="selection" width="26" align="center" />
        <el-table-column label="序号" type="index" width="40" align="center" />
        <el-table-column label="策略名称" prop="name" />
        <el-table-column label="触发条件" prop="trigger" align="center">
          <template slot-scope="scope"
            ><span style="color: #266BEE;">{{
              scope.row.trigger
            }}</span></template
          >
        </el-table-column>
        <el-table-column label="最后修改时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime">{{
              parseTime(scope.row.updateTime)
            }}</span>
            <span v-else>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接收预警时间段" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.startTime && scope.row.endTime"
              >{{ scope.row.startTime }} - {{ scope.row.endTime }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="预警渠道" prop="type" align="center">
          <template slot-scope="scope">{{ fnType(scope.row.type) }}</template>
        </el-table-column>

        <el-table-column label="监测状态" align="center" prop="statusFlag">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.statusFlag"
              active-color="#409EFF"
              inactive-color="#E8ECEE"
              @change="changeEnabled(scope.row, scope.row.statusFlag)"
            />
          </template>
        </el-table-column>
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
      width="852px"
      class="newWarnConfigDia"
      :destroy-on-close="true"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="预警网站" prop="warnWeb" v-if="warnType == '1'">
          <el-select
            v-model="warnWebLists"
            style="width: 570px;"
            multiple
            placeholder="请选择预警网站"
          >
            <el-option label="全部预警网站" value="all"></el-option>
            <el-option
              v-for="(item, index) in warnWebList"
              :key="index"
              :label="item.name"
              :value="item.accoutid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警账号" prop="warnWebMedia" v-else>
          <el-select
            v-model="form.warnWeb"
            style="width: 570px;"
            multiple
            placeholder="请选择预警账号"
          >
            <el-option
              v-for="(item, index) in mediaTypeUserList"
              :key="index"
              :label="item.name"
              :value="item.accoutid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警接收人" prop="webUserList">
          <el-select
            v-model="webUserListChecked"
            style="width: 570px;"
            multiple
            placeholder="请选择预警接收人"
          >
            <el-option
              v-for="(item, index) in webUserList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件" prop="webStrategyVoList">
          <el-checkbox-group
            v-model="checkList"
            style="background-color: #eaf3fd; padding: 10px;"
          >
            <ul class="checkbox-ul">
              <li v-for="item in strategyList">
                <div v-if="warnType == '1' && item.type == '1'">
                  <el-checkbox :label="item.id"><a></a></el-checkbox>
                  <span
                    class="spanStyle wdh90"
                    style="width:98px;display: inline-block"
                    >{{ item.content }}</span
                  >
                  <span
                    class="spanStyle"
                    v-if="item.mold == '1' || item.mold == '2'"
                    >异常连续出现
                  </span>
                  <span class="spanStyle" v-else>发送预警频率 </span>
                  <el-input-number
                    v-model.number="item.unusual"
                    :min="1"
                    controls-position="right"
                    style="width: 95px;"
                    @change="handleChange"
                  />
                  <div
                    style="display: inline-block;"
                    v-if="item.mold == '1' || item.mold == '2'"
                  >
                    <span class="spanStyle span-small">次</span>
                    <span class="spanStyle">进行预警 最多发出</span>
                    <el-input-number
                      v-model.number="item.send"
                      :min="1"
                      controls-position="right"
                      style="width: 95px;"
                      @change="handleChange"
                    />
                    <span class="spanStyle">次预警信息</span>
                  </div>
                  <div style="display: inline-block;" v-else>
                    <span class="spanStyle span-small">时</span>
                    <span class="spanStyle">进行预警</span>
                  </div>
                </div>
                <div v-if="warnType == '0' && item.type == '0'">
                  <el-checkbox :label="item.id"><a></a></el-checkbox>
                  <span class="spanStyle wdh70">{{ item.content }}</span>
                  <span class="spanStyle">发送预警频率 </span>
                  <el-input-number
                    v-model.number="item.send"
                    :min="1"
                    controls-position="right"
                    style="width: 95px;"
                    @change="handleChange"
                  />
                  <span class="spanStyle span-small">时</span>
                  <span class="spanStyle">进行预警</span>
                </div>
              </li>
            </ul>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="接收时段" prop="timeDate">
          <el-time-picker
            v-model="form.startTime"
            style="width: 125px;"
            value-format="HH:mm:ss"
            placeholder="00:00:00"
          >
          </el-time-picker>
          至
          <el-time-picker
            v-model="form.endTime"
            value-format="HH:mm:ss"
            style="width: 125px;"
            placeholder="00:00:00"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="预警渠道" prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="email" name="type">邮件</el-checkbox>
            <el-checkbox label="sms" name="type">短信</el-checkbox>
          </el-checkbox-group>
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
import webCrud from "@/api/earlyWarning/uWarnWeb";
import newMediaCrud from "@/api/earlyWarning/uWarnNewMedia";
import { dataHttpGet, dataHttpPost } from "@/api/common";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";
import rrOperation from "@crud/RR.operation";
import { mapGetters } from "vuex";
import MechanismSelect from "@/components/MechanismSelect";

const webForm = {
  name: null,
  type: [],
  startTime: null,
  endTime: null,
  webUserList: [],
  warnWeb: [],
  webStrategyVoList: [],
  mediaUserList: [],
  mediaStrategyVoList: [],
  id: null
};
export default {
  name: "WarnConfiguration",
  components: { pagination, udOperation, rrOperation, MechanismSelect },
  cruds() {
    return CRUD({
      title: "预警配置",
      url: "/uWarnWeb",
      newAddRefresh: true,
      crudMethod: { ...webCrud },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(webForm), crud()],
  data() {
    // 自定义验证
    const validTime = (rule, value, callback) => {
      if (!this.form.startTime || !this.form.endTime) {
        callback(new Error("接收时间段不能为空"));
      } else {
        callback();
      }
    };
    const validWeb = (rule, value, callback) => {
      if (this.warnWebLists.length == 0) {
        callback(new Error("预警网站不能为空"));
      } else {
        callback();
      }
    };
    const validWebMadie = (rule, value, callback) => {
      if (this.form.warnWeb.length == 0) {
        callback(new Error("预警账号不能为空"));
      } else {
        callback();
      }
    };
    const validUser = (rule, value, callback) => {
      if (this.webUserListChecked.length == 0) {
        callback(new Error("预警接收人不能为空"));
      } else {
        callback();
      }
    };
    const validwebStrategy = (rule, value, callback) => {
      if (this.checkList.length == 0) {
        callback(new Error("触发条件不能为空"));
      } else {
        callback();
      }
    };
    const validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("策略名字不能为空"));
      } else {
        if (value.length > 20) {
          callback(new Error("策略名称不能超过20个字符"));
        } else {
          callback();
        }
      }
    };
    return {
      depts: [],
      permission: {
        edit: ["admin", "menu:edit"],
        del: ["admin", "menu:del"]
      },
      rules: {
        name: [{ required: true, trigger: "change", validator: validName }],
        timeDate: [{ required: true, trigger: "change", validator: validTime }],
        warnWeb: [{ required: true, trigger: "change", validator: validWeb }],
        warnWebMedia: [
          { required: true, trigger: "change", validator: validWebMadie }
        ],
        webUserList: [
          { required: true, trigger: "change", validator: validUser }
        ],
        webStrategyVoList: [
          { required: true, trigger: "blur", validator: validwebStrategy }
        ],
        type: [{ required: true, message: "请选择预警渠道", trigger: "blur" }]
      },
      mediaTypeList: [
        { value: 101, label: "微信公众号" },
        { value: 102, label: "新浪微博" },
        { value: 111, label: "移动客户端" },
        { value: 112, label: "人民号" },
        { value: 113, label: "百家号" },
        { value: 103, label: "今日头条" },
        { value: 114, label: "其他" }
      ],
      mediaTypeUserList: [], //新媒体用户
      warnType: "1", //网站 新媒体切换
      isActive: true,
      webUserList: [],
      webUserListChecked: [],
      warnWebList: [],
      warnWebLists: [],
      strategyList: [],
      checkList: [], //勾选的条件
      unusual: 1, //首页不连通异常连续出现次数
      uncertains: 1,
      send: 1, //首页不连通最大发送次数
      uncertainsSend: 1,
      errorSend: 1, //错敏发送最大次数
      errSend: 1, // 暗链发送最大次数
      width: '42px',
      mechanismSelectUpload: '0'
    };
  },
  dicts: ["user_status"],
  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    warnWebLists: function(val, oldval) {
      let newindex = val.indexOf("all"),
        oldindex = oldval.indexOf("all"); //获取val和oldval里all的索引,如果没有则返回-1
      if (newindex != -1 && oldindex == -1 && val.length > 1)
        //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.warnWebLists = ["all"];
      else if (newindex != -1 && oldindex != -1 && val.length > 1)
        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.warnWebLists.splice(val.indexOf("all"), 1);
    }
  },
  mounted() {
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.crud.toQuery();
    this.getStrategy(); //获取触发条件
    this.getUWarnUserData(); //所有接收人
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
    //切换网站和新媒体页
    changeWarnType(type) {
      this.warnType = type;
      this.isActive = !this.isActive;
      this.crud.data = [];
      if (type == "0") {
        this.crud.url = "/uWarnNewMedia";
        this.crud.crudMethod = { ...newMediaCrud };
      } else {
        this.crud.url = "/uWarnWeb";
        this.crud.crudMethod = { ...webCrud };
      }
      this.crud.toQuery();
      this.getStrategy();
    },
    //获取接收人
    getUWarnUserData() {
      this.webUserList = [];
      let url = "/uWarnUser/getAll";
      dataHttpGet(url).then(res => {
        if (res) {
          for (var i = 0; i < res.data.length; i++) {
            let obj = {
              id: res.data[i].id,
              name: res.data[i].name
            };
            this.webUserList.push(obj);
          }
        }
      });
    },
    //获取所有网站
    getUUserAccountData() {
      this.warnWebList = [];
      let url = "/UUserAccount/list";
      let params = {
        accountType: "1", //网站 2 新媒体
        userId: this.user.id
      };
      dataHttpGet(url, params).then(res => {
        if (res) {
          this.warnWebList = res.data || [];
        }
      });
    },
    //获取新媒体用户
    changeMediaType() {
      this.mediaTypeUserList = [];
      let url = "/UUserAccount/list";
      let params = {
        accountType: "2", //网站 2 新媒体
        userId: this.user.id
      };
      dataHttpGet(url, params).then(res => {
        if (res) {
          this.mediaTypeUserList = res.data || [];
        }
      });
    },
    //获取触发条件
    getStrategy() {
      this.checkList = [];
      this.strategyList = [];
      let url = "/uWarnWeb/getStrategy";
      let params = {
        status: this.warnType
      };
      dataHttpGet(url, params).then(res => {
        if (res) {
          this.strategyList = res.data || [];
          for (var i = 0; i < this.strategyList.length; i++) {
            if (this.strategyList[i].content == "确定不连接") {
              Object.assign(this.strategyList[i], {
                content: "首页确定不连通"
              });
            } else if (this.strategyList[i].content == "疑似不连接") {
              Object.assign(this.strategyList[i], {
                content: "首页疑似不连通"
              });
            }
            this.strategyList[i].unusual = 1; //出现次数
            this.strategyList[i].send = 1; //发送次数
            this.checkList.push(this.strategyList[i].id);
          }
        }
      });
    },

    //删除
    toDelete(datas, one) {
      if (one == "one") {
        let arr = [];
        arr.push(datas);
        this.$confirm(`确认删除` + datas.name + `这条策略?`, "提示", {
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
    // 改变监测状态
    changeEnabled(data, val) {
      if (data.status == "0") {
        data.status = "1";
      } else {
        data.status = "0";
      }
      this.$confirm(
        '此操作将 "' +
          this.dict.label.user_status[val] +
          '" ' +
          data.name +
          ", 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (this.warnType == "1") {
            webCrud
              .updateStatus(data)
              .then(res => {
                this.crud.notify(
                  this.dict.label.user_status[val] + "成功",
                  CRUD.NOTIFICATION_TYPE.SUCCESS
                );
              })
              .catch(() => {
                data.statusFlag = !data.statusFlag;
              });
          } else {
            newMediaCrud
              .updateStatusNewMedia(data)
              .then(res => {
                this.crud.notify(
                  this.dict.label.user_status[val] + "成功",
                  CRUD.NOTIFICATION_TYPE.SUCCESS
                );
              })
              .catch(() => {
                data.statusFlag = !data.statusFlag;
              });
          }
        })
        .catch(() => {
          data.statusFlag = !data.statusFlag;
        });
    },
    //新增前做的操作
    [CRUD.HOOK.beforeToAdd](crud, form) {
      form.id = null;
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.beforeToCU](crud, form) {
      if (this.warnType == "1") {
        this.getUUserAccountData(); //所有网站
      } else {
        this.changeMediaType();
      }
      this.warnWebLists = [];
      this.checkList = [];
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      if (form.type) {
        form.type = form.type.split(",");
      } else {
        form.type = [];
      }
      let url = "";
      let params = { id: form.id };
      if (this.warnType == "1") {
        url = "/uWarnWeb/getOne";
        dataHttpGet(url, params).then(res => {
          if (res) {
            let data = res.data;
            //触发条件
            if (data.webStrategyVoList.length > 0) {
              for (var i = 0; i < data.webStrategyVoList.length; i++) {
                this.checkList.push(data.webStrategyVoList[i].warnStrategyId);
              }
              for (var k = 0; k < this.strategyList.length; k++) {
                for (var i = 0; i < data.webStrategyVoList.length; i++) {
                  if (
                    data.webStrategyVoList[i].warnStrategyId ==
                    this.strategyList[k].id
                  ) {
                    this.strategyList[k].unusual =
                      data.webStrategyVoList[i].unusual || 1;
                    this.strategyList[k].send =
                      data.webStrategyVoList[i].send || 1;
                  }
                }
              }
            }
            //接收人
            this.webUserListChecked = [];
            if (data.webUserList.length > 0) {
              for (var i = 0; i < data.webUserList.length; i++) {
                this.webUserListChecked.push(data.webUserList[i].uwarnUserId);
              }
            }
            if (data.warnWeb) {
              this.warnWebLists = data.warnWeb.split(",");
            }
          }
        });
      } else {
        url = "/uWarnNewMedia/getOne";
        dataHttpGet(url, params).then(res => {
          if (res) {
            let data = res.data;
            //触发条件
            if (data.mediaStrategyVoList.length > 0) {
              for (var i = 0; i < data.mediaStrategyVoList.length; i++) {
                this.checkList.push(data.mediaStrategyVoList[i].warnStrategyId);
              }
            }
            for (var k = 0; k < this.strategyList.length; k++) {
              for (var i = 0; i < data.mediaStrategyVoList.length; i++) {
                if (
                  data.mediaStrategyVoList[i].warnStrategyId ==
                  this.strategyList[k].id
                ) {
                  this.strategyList[k].unusual =
                    data.mediaStrategyVoList[i].unusual || 1;
                  this.strategyList[k].send =
                    data.mediaStrategyVoList[i].send || 1;
                }
              }
            }
            //接收人
            this.webUserListChecked = [];
            if (data.mediaUserList.length > 0) {
              for (var i = 0; i < data.mediaUserList.length; i++) {
                this.webUserListChecked.push(data.mediaUserList[i].uwarnUserId);
              }
            }
            if (data.warnWeb) {
              form.warnWeb = data.warnWeb.split(",");
            }
          }
        });
      }
      this.$forceUpdate();
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.type) {
        crud.form.type = crud.form.type.join(",");
      }
      if (this.warnType == "1") {
        if (this.checkList.length > 0) {
          for (var i = 0; i < this.checkList.length; i++) {
            for (var k = 0; k < this.strategyList.length; k++) {
              if (this.checkList[i] == this.strategyList[k].id) {
                let obj = {
                  warnStrategyId: this.strategyList[k].id,
                  send: this.strategyList[k].send,
                  unusual: this.strategyList[k].unusual
                };
                crud.form.webStrategyVoList.push(obj);
              }
            }
          }
        }
        //预警接收人
        for (var i = 0; i < this.webUserListChecked.length; i++) {
          crud.form.webUserList[i] = {
            uwarnUserId: this.webUserListChecked[i]
          };
        }
        if (this.warnWebLists.length > 0) {
          if (this.warnWebLists[0] == "all") {
            let arr = [];
            for (var i = 0; i < this.warnWebList.length; i++) {
              arr.push(this.warnWebList[i].accoutid);
            }
            crud.form.warnWeb = arr.join(",");
          } else {
            crud.form.warnWeb = this.warnWebLists.join(",");
          }
        }
        delete crud.form.mediaStrategyVoList;
        delete crud.form.mediaUserList;
      } else {
        if (this.checkList.length > 0) {
          for (var i = 0; i < this.checkList.length; i++) {
            for (var k = 0; k < this.strategyList.length; k++) {
              if (this.checkList[i] == this.strategyList[k].id) {
                let obj = {
                  warnStrategyId: this.strategyList[k].id,
                  send: this.strategyList[k].send,
                  unusual: this.strategyList[k].unusual
                };
                crud.form.mediaStrategyVoList.push(obj);
              }
            }
          }
        }
        //预警接收人
        for (var i = 0; i < this.webUserListChecked.length; i++) {
          crud.form.mediaUserList[i] = {
            uwarnUserId: this.webUserListChecked[i]
          };
        }
        if (crud.form.warnWeb.length > 0) {
          crud.form.warnWeb = crud.form.warnWeb.join(",");
        }
        delete crud.form.webStrategyVoList;
        delete crud.form.webUserList;
      }
      crud.form.warnFlag = 0;
      return true;
    },
    fnType(data) {
      let arr = data.split(",");
      let newArr = [];
      for (var i = 0; i < arr.length; i++) {
        let str = "";
        if (arr[i] == "email") {
          str = "邮件";
        } else if (arr[i] == "sms") {
          str = "短信";
        } else if (arr[i] == "wx") {
          str = "微信";
        } else {
          str = arr[i];
        }
        newArr.push(str);
      }
      return newArr.join(",");
    },
    handleChange() {
      this.$forceUpdate();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog {
  height: 65%;
}
/deep/ .checkbox-ul .el-checkbox {
  margin-right: 0px;
}
.spanStyle {
  font-size: 14px;
  margin: 0px 5px;
}
span.wdh70 {
  width: 70px;
  display: inline-block;
}
.span-small {
  background-color: #fcfcfc;
  border: #e3e3e8 solid 1px;
  color: #909399;
  padding: 5px;
  margin-right: 0px;
}
</style>
