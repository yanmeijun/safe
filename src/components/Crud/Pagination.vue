<!--分页-->
<template>
  <el-pagination
    :page-size.sync="page.size"
    :total="page.total"
    :current-page.sync="page.page"
    style=""
    :page-sizes="pageSizes"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import { pagination } from "@crud/crud";
export default {
  mixins: [pagination()],
  props: {
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },  
  }
};
</script>
