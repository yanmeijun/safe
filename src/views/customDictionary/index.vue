<template>
  <div class="app-container">
    <div class="customDictionaryHeard clearfix">
      <span class="fl">
        <svg class="icon svg-icon46" aria-hidden="true">
          <use xlink:href="#icontubiaozhizuomoban44"></use>
        </svg>
      </span>
      <!-- ，不会影响开普云词库的监测 -->
      <span class="errorInfoWord"
        >在此添加自定义的错别字，并可以选择是否启用对添加词的监测（添加的错别字默认为监测状态），操作只对自定义词有效，不会影响通用词库的监测。</span
      >
    </div>
    <!--工具栏-->
    <div class="searchTabBox" style="border-radius: 4px;padding: 15px 20px;">
      <div class="clearfix">
        <div class="fl clearfix wh90" v-if="this.user.isAdmin">
          <Mechanism-Select 
          v-bind:width= "width"
          :mechanismSelectUpload = "mechanismSelectUpload"
          @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
        </div>
        <div class="fl" style="margin-left: 20px;margin-right: 20px;">
          <span class="main-aside-txt">词库：</span>
          <el-select v-model="type" class="filter-item" @change="changeType(type)">
            <el-option
              v-for="(item, index) in wordTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="fl">
          <el-input
            placeholder="请输入领导人词"
            clearable
            v-model="query.word">
            <i slot="prefix" class="el-input__icon el-icon-search" 
            @click="wordSearch"
            style="cursor: pointer;"></i>
          </el-input>
        </div>
        <div class="frt">
          <el-button
            class="filter-item"
            size="small"
            type="primary"
            @click="crud.toQuery()"
            >查询</el-button
          >
        </div>
      </div>
      <div class="customDictionaryBox">
        <div class="clearfix" style="margin-bottom: 10px;">
          <span class="linkCon linkTitBox fl">
            <i class="titleTip"></i>
            <span style="padding-left:5px">自定义词库</span>
          </span>

          <div class="btnTabListBox clearfix frt">
            <!--disabled 是不可用状态-->
            <button
              class="btnListDefault flt"
              :class="{ disabled: crud.selections.length === 0 }"
              @click="changeEnabledDatas(crud.selections, 1)"
            >
              启动监控
            </button>
            <button
              class="btnListDefault flt"
              :class="{ disabled: crud.selections.length === 0 }"
              @click="changeEnabledDatas(crud.selections, 0)"
            >
              停止监控
            </button>
            <button
              class="btnListDefault flt"
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
        <!--表格渲染-->
        <el-table
          v-if="type == 2"
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
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="40"
          />
          <el-table-column label="领导人姓名" prop="word" />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="replaces"
            label="对应错误词"
          >
            <template slot-scope="scope">
              <span>{{ fnTostr(scope.row.replaces) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="prefixs"
            label="职务前缀"
          >
            <template slot-scope="scope">
              <span>{{ fnTostr(scope.row.prefixs) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="subfixs"
            label="职务后缀"
          >
            <template slot-scope="scope">
              <span>{{ fnTostr(scope.row.subfixs) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="leaders"
            label="对应排序"
          >
            <template slot-scope="scope">
              <span>{{ fnTostr(scope.row.leaders) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            label="添加日期"
            align="center"
            min-width="100%"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="监测状态" align="center" prop="isMonitor">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isMonitor"
                active-color="#2E8CF0"
                inactive-color="#E8ECEE"
                @change="changeEnabled(scope.row, scope.row.isMonitor)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-else
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
          <el-table-column
            label="序号"
            type="index"
            width="40"
            align="center"
          />
          <el-table-column label="重点监控词" prop="word" />
          <el-table-column prop="createTime" align="center" label="添加日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="监测状态" align="center" prop="isMonitor">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isMonitor"
                active-color="#2E8CF0"
                inactive-color="#E8ECEE"
                @change="changeEnabled(scope.row, scope.row.isMonitor)"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </div>
    <!-- 创建弹框 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="780px"
      height="76%"
    >
      <div class="mB20">
        <span class="main-aside-no-txt">选择词库类型：</span>
        <el-select v-model="form.type" class="filter-item" style="width:150px;">
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <div v-if="form.type == 2" class="clearfix addBox">
          <div class="wdh266 flt" style="background: #eaf3fd; height: 330px;">
            <ul class="rm-menu-ul  mT35">
              <li>
                <el-form-item
                  label="对应领导人正确姓名"
                  prop="word"
                  label-width="wdh266"
                >
                  <el-input
                    v-model="form.word"
                    style="width: 215px;"
                    placeholder="正确领导人姓名"
                    @blur="blurWord(form.word)"
                  />
                </el-form-item>
              </li>
            </ul>
          </div>
          <div class="wdh-calc276 frt errorLeft" style=" height: 100%;">
            <ul class="rm-menu-ul">
              <li>
                <div class="ellipsis">对应领导人错误姓名</div>
                <el-input
                  v-model="form.replaces"
                  placeholder="多个错误词时请用逗号隔开,举例:习近平,习近来"
                />
              </li>
              <li>
                <div class="ellipsis">
                  对应领导人职务名称：<span class="errorTxtColor"
                    >（职务名称在姓名之前）</span
                  >
                </div>
                <el-input
                  v-model="form.prefixs"
                  placeholder="多个职务错误词时请用逗号隔开,举例:省委书记某某,省长某某"
                />
              </li>
              <li>
                <div class="ellipsis">
                  对应领导人职务名称：<span class="errorTxtColor"
                    >（职务名称在姓名之后）</span
                  >
                </div>
                <el-input
                  v-model="form.subfixs"
                  placeholder="多个职务错误词时请用逗号隔开,举例:某某秘书长"
                />
              </li>
              <li>
                <div class="ellipsis">
                  对应领导人排序
                  <span style="color: #8f8f8f;"
                    >注：按照输入的顺序判断排序是否正确</span
                  >
                </div>
                <el-input
                  v-model="form.leaders"
                  placeholder="每个人名之间请用逗号隔开,举例:习近平,李克强"
                />
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <ul class="rm-menu-ul mT35">
            <li>
              <el-input
                type="textarea"
                class="otherTextarea"
                v-model="form.word"
                placeholder="每个词之间请用逗号隔开。 举例：低端人口，高端人口 "
                :rows="8"
              ></el-input>
            </li>
          </ul>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU">取消</el-button>
        <el-button type="primary" @click="crud.submitCU">确认</el-button>
        <!-- :loading="crud.status.cu === 2"  @click="crud.cancelCU"-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customDictionary from "@/api/customDictionary/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import MechanismSelect from "@/components/MechanismSelect";
import { mapGetters } from "vuex";

const defaultForm = {
  id: null,
  word: null,
  leaders: null,
  replaces: null,
  prefixs: null,
  type: 2,
  subfixs: null
};
export default {
  name: "CustomDictionary",
  components: { pagination, rrOperation, Treeselect, udOperation, MechanismSelect },
  cruds() {
    return CRUD({
      title: "错敏词",
      url: "/customTypos/list",
      newAddRefresh: true,
      crudMethod: { ...customDictionary },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ["user_status"],
  data() {
    return {
      depts: [],
      permission: {
        edit: ["admin", "menu:edit"],
        del: ["admin", "menu:del"]
      },
      rules: {
        word: [
          {
            required: true,
            message: "领导人名称不能为空",
            trigger: "blur"
          }
        ]
      },
      type: 2,
      typeList: [
        {
          value: 2,
          label: "领导人相关"
        },
        {
          value: 1,
          label: "重点监控词"
        }
      ],
      searchType: "name",
      searchTypeList: [
        {
          value: "name",
          label: "正确姓名"
        }
      ],
      wordTypeList: [
        {
          value: 2,
          label: "领导人词库"
        },
        {
          value: 1,
          label: "重点监控词"
        }
      ],
      width: '42px',
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
    // this.query.deptId = this.user.deptInfo.deptId;
    this.crud.toQuery()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh](crud) {
      this.crud.query.type = this.type;
      return true;
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      console.log(crud.form);
      if (crud.form.type == 2) {
        if (!crud.form.replaces && !crud.form.prefixs && !crud.form.subfixs) {
          this.$message.error("请添加对应领导错误信息");
          return false;
        }
      }
      crud.form.newAddStatus = true;
      return true;
    },
    cancelCU() {
      this.crud.resetForm();
    },
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
      this.crud.toQuery();
    },
    wordSearch(){
      this.crud.toQuery();
    },
    //切换
    changeType(val) {
      this.type = val;
      this.crud.data = [];
      this.crud.query.type = val;
      this.crud.toQuery();
    },
    [CRUD.HOOK.afterRefresh](crud) {
      return true;
    },
    //启动 or 停止
    changeEnabledDatas(datas, type) {
      console.log(datas);
      let list = [];
      for (var i = 0; i < datas.length; i++) {
        let obj = {};
        obj._id = datas[i]._id;
        obj.scanType = type;
        list.push(obj);
      }
      this.$confirm(`确认启动对选中的${datas.length}条数据监控?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.crud.delAllLoading = true;
          customDictionary
            .edit(list)
            .then(res => {
              this.crud.notify("成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
              this.crud.query.type = this.type;
              this.crud.toQuery();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    // 改变状态
    changeEnabled(data, val) {
      if (data.scanType == 1) {
        data.scanType = 0;
      } else {
        data.scanType = 1;
      }
      let list = [];
      let obj = {
        id: data.id,
        scanType: data.scanType
      };
      list.push(obj);
      this.$confirm(
        "此操作将 “" +
          this.dict.label.user_status[val] +
          '" ' +
          data.word +
          ", 是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          customDictionary
            .edit(list)
            .then(res => {
              this.crud.notify(
                this.dict.label.user_status[val] + "成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
            })
            .catch(() => {
              data.isMonitor = !data.isMonitor;
            });
        })
        .catch(() => {
          data.isMonitor = !data.isMonitor;
        });
    },
    //删除
    toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.crud.delAllLoading = true;
          datas.forEach(element => {
            element.id = element._id;
          });
          console.log(datas);
          this.crud.doDelete(datas);
        })
        .catch(() => {});
    },
    //转换数组
    fnTostr(data) {
      if (data) {
        //let obj = JSON.parse(data)
        let obj = data;
        let arr = [];
        for (var i = 0; i < obj.length; i++) {
          arr.push(obj[i]);
        }
        let str = arr.join(",");
        return str;
      }
    },
    blurWord(val) {
      if (val == "习近平" || val == "李克强") {
        this.$confirm(
          "词库中已有习近平、李克强相关的姓名、职务、排序的监测，请添加其他领导人",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.form.word = "";
          })
          .catch(() => {
            this.form.word = "";
          });
      }
    }
  }
};
</script>
<style scoped>
/deep/ .el-dialog {
  height: 76%;
  max-height: 560px;
}
/deep/ .el-dialog__body {
  height: -webkit-calc(100% - 112px);
  height: -moz-calc(100% - 112px);
  height: calc(100% - 112px);
}

.customDictionaryBox {
  margin-top: 10px;
  background: #fff;
  border-radius: 4px;
}

.customDictionaryHeard {
  margin: 10px 0;
  background: #eaf3fd;
  border-radius: 4px;
  padding: 20px;
  border: 1px solid #2e8cf0;
}

.customDictionaryHeard .errorInfoWord {
  font-size: 14px;
  color: #3f79f4;
  margin-left: 5px;
  line-height: 46px;
}

.main-aside-txt:nth-of-type(n + 2) {
  margin-left: 18px;
}

.rm-menu-ul li {
  line-height: 2.5;
}

.rm-menu-ul {
  padding-left: 10px;
  height: 100%;
}

.wdh266 {
  width: 276px;
}

.wdh-calc276 {
  width: calc(100% - 276px);
}

.addBox {
  border: 1px solid #eee;
  padding-right: 10px;
  border-radius: 5px;
}

.filter-item .el-input input.el-input__inner {
  background: #f8f8f9;
}
.svg-icon46 {
  width: 46px;
  height: 46px;
}
/deep/ .tableColumnWh .el-table__row {
  height :40px;
}
</style>
