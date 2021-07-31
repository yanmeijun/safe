<template>
  <div class="app-container">
    <s-search></s-search>
    <div class="errSentiveInfoBox clearfix">
      <div class="clearfix" style="margin-top: 16px;">
        <span class="main-aside-txt">年份：</span>

        <el-date-picker
          v-model="query.createTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>

        <span class="main-aside-txt">报告期数：</span>
        <el-select v-model="query.sensitivityCategory" class="filter-item">
          <el-option
            v-for="(item, index) in linkData"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <div style="float:right;">
          <rrOperation />
        </div>
      </div>

      <el-row class="clearfix" style="margin-top: 16px;">
        <el-col :span="12">
          <span class="linkCon">
            <i class="titleTip"></i>
            <span style="padding-left:5px">监测报告</span>
          </span>
        </el-col>
        <el-col :span="5" :offset="7">
          <div class="btnTabListBox clearfix frt">
            <!--disabled 是不可用状态-->
            <button class="btnListDefault btnTabBlue flt">导出列表</button>
          </div>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%;margin-top: 12px;">
        <el-table-column :selectable="checkboxT" type="selection" width="55" />
        <el-table-column
          :show-overflow-tooltip="true"
          type="index"
          label="序号"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="zip"
          label="期数"
          width="452"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="dept"
          label="报告状态"
          width="316"
        >
          <template slot-scope="scope">
            <div>kgjkf</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <udOperation
                      :data="scope.row"
                      :permission="permission"
                      :disabled-dle="scope.row.id === user.id"
                    /> -->

            <svg class="icon svg-icon-operW16" aria-hidden="true">
              <use xlink:href="#icontubiaozhizuomoban8"></use>
            </svg>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>
<script>
import CRUD, { presenter, header, crud } from "@crud/crud";
import sSearch from "@/views/webSensitive/search";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
export default {
  name: "deadChain",
  components: { sSearch, rrOperation, pagination },
  cruds() {
    console.log(5555555);
    return CRUD({ title: "错敏信息网站", url: "api/users" });
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      isActive: true,
      linkData: [],
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
          email: "435435",
          time: "dfdf",
          gender: "retretret"
        }
      ],
      problemLevelList: [
        { value: "全部", label: "" },
        { value: "自定义错误字", label: "1" },
        { value: "疑似严重错别字", label: "2" },
        { value: "其他疑似错别字", label: "3" }
      ]
    };
  },
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    displayWords() {
      this.isActive = !this.isActive;
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1;
    }
  }
};
</script>
<style scoped>
@import url("../../assets/styles/common.css");
.errSentiveInfoBox {
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
}
.main-aside-txt:nth-of-type(n + 2) {
  margin-left: 18px;
}
.titleTip {
  background: #1890ff;
  border-radius: 0 2px 2px 0;
  border-radius: 0px 2px 2px 0px;
  display: inline-block;
  width: 4px;
  height: 14px;
}
.linkCon {
  opacity: 0.85;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  text-align: left;
  line-height: 22px;
}
</style>
