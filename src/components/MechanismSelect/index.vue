<template>
  <div class="fl clearfix wh90">
    <span class="main-aside-txt" :style="{'width': width}">机构：</span>
    <!-- multiple -->
    <el-select
      v-model="crud.query.deptId"
      @change="changeTypeSelect"
      @remove-tag="removeTypeTag"
      class="filter-item siteElSelect"
      style="width:200px;"
    >
      <el-option
        v-for="(item, index) in mechanismList"
        :key="index"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>  
  </div>
</template>
<script>
import CRUD, { crud } from "@crud/crud";
import { getDepts } from "@/api/system/dept";
import { mapGetters } from "vuex";
export default {
  name: "politicalPictureMonitor",
  mixins: [crud()],
  props: {
    width: {
      type: String,
      default: "90px"
    },
    mechanismSelectUpload: {
      type: String,
      default: "2"
    },
    allMechanism: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      mechanismList: [],
      mechanismChecked: ''
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.siteFun();
  },
  methods: {
    changeTypeSelect(val) {
      this.$emit("getMechanismChecked", val);
    },
    removeTypeTag(val) {
      if (val === "all") {
        this.mechanismList = [];
      }
    },
    selectTypeAll() {
    },
    async siteFun() {
      await getDepts().then(res => {
        this.mechanismList = res.content || [];
        if(this.allMechanism){
          this.mechanismList.unshift({ id: "", label: "", name: "全部" });
        }
      });
    }
  },
  watch: {
    mechanismSelectUpload(val){
      this.siteFun();
    }
  }
};
</script>
