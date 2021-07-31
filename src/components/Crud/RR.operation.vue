<!--搜索与重置-->
<template>
  <span>
    <el-button
      v-if="crud.optShow.reset"
      class="filter-item"
      size="small"
      @click="crud.resetQuery()"
      >重置</el-button
    >
    <el-button
      class="filter-item"
      size="small"
      type="primary"
      @click="crud.toQuery"
      >查询</el-button
    >
  </span>
</template>
<script>
import { crud } from "@crud/crud";
export default {
  mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ""
    }
  },
  methods: {
  }
};
</script>
