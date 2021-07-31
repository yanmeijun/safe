<template>
  <div class="app-container">
    <div class="sysMonitorBox" style="padding-bottom: 30px;">
      <span class="linkCon linkTitBox">
        <i class="titleTip"></i>
        <span style="padding-left:5px">监测管理</span>
      </span>
      <div style="margin-top: 30px;">
        <span
          class="spanStyle"
          style="width: 160px;display: inline-block;font-size: 14px;"
          >允许创建中文网站数：</span
        >
        <el-input-number
          v-model.number="numList.webNumCN"
          :min="1"
          controls-position="right"
          style="width: 95px;"
        />
        <div style="display: inline-block;">
          <span class="spanStyle span-small">个</span>
        </div>
      </div>

      <div style="margin-top: 30px;">
        <span
          class="spanStyle"
          style="width: 160px;display: inline-block;font-size: 14px;"
          >允许创建英文网站数：</span
        >
        <el-input-number
          v-model.number="numList.webNumEN"
          :min="1"
          controls-position="right"
          style="width: 95px;"
        />
        <div style="display: inline-block;">
          <span class="spanStyle span-small">个</span>
        </div>
      </div>

      <div style="margin-top: 30px">
        <span
          class="spanStyle"
          style="width: 160px;display: inline-block;font-size: 14px;"
          >允许创建新媒体数：</span
        >
        <el-input-number
          v-model.number="numList.mediaNum"
          :min="1"
          controls-position="right"
          style="width: 95px;"
        />
        <div style="display: inline-block;">
          <span class="spanStyle span-small">个</span>
        </div>
      </div>

      <div style="overflow: hidden;margin-top: 30px;">
        <el-button
          class="filter-item"
          size="medium"
          type="primary"
          @click="saveConfigure"
          >保存</el-button
        >
        <el-button class="filter-item" size="medium" @click="findOneData"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<style>
.spanStyle.span-small {
  background-color: #fcfcfc;
  border: #e3e3e8 solid 1px;
  color: #909399;
  padding: 5px;
}
</style>

<script>
import {
  saveMonManagementApi,
  findOneDataAPi
} from "@/api/monManagement/index";

export default {
  name: "Timing",

  data() {
    return {
      numList: {
        webNumCN: 1,
        webNumEN: 1,
        mediaNum: 1
      }
    };
  },
  mounted() {
    this.findOneData();
  },
  methods: {
    // 执行

    cancel() {},
    findOneData() {
      findOneDataAPi({ id: "1" }).then(res => {
        if (res.code == 200) {
          this.numList = Object.assign(this.numList, res.data);
        }
      });
    },
    saveConfigure() {
      saveMonManagementApi(this.numList).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "保存失败",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
