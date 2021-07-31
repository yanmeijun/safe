<template>
  <div>
    <div class="fl clearfix wh60" v-if="this.user.isAdmin">
      <Mechanism-Select 
      v-bind:width= "width"
      @getMechanismChecked="getMechanismChecked"
      :mechanismSelectUpload = "mechanismSelectUpload"
      style="margin-right: 15px;"
      ></Mechanism-Select>
    </div>
    <span class="main-aside-txt">站点：</span>
    <!-- multiple -->
    <el-select
      v-model="siteCodeChecked"
      @change="changeTypeSelect"
      @remove-tag="removeTypeTag"
      class="filter-item siteElSelect"
      style="width:462px;"
    >
      <!-- <el-option label="全部" value="all" key="all"  @click.native='selectTypeAll'></el-option> -->
      <el-option
        v-for="(item, index) in siteList"
        :key="index"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { getsiteList } from "@/api/sensitiveApi/queryCustom";
import { mapGetters } from "vuex";
import { dataHttpGet } from "@/api/common";
import MechanismSelect from "@/components/MechanismSelect";
export default {
  name: "politicalPictureMonitor",
  props: {
    accountType: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      siteList: [],
      siteCodeChecked: [],
      width: '42px',
      mechanismSelectUpload: '0',
      deptId: ''
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  components: { MechanismSelect },
  mounted() {
    this.siteFun(this.user.deptInfo.deptId);
  },
  methods: {
    changeTypeSelect(val) {
      this.$emit("getSiteCodeChecked", val);
      // if (!val.includes('all') && val.length === this.siteList.length) {
      //   this.siteList.unshift('all')
      // } else if (val.includes('all') && (val.length - 1) < this.siteList.length) {
      //   this.siteCodeChecked = this.siteCodeChecked.filter((item) => {
      //     return item !== 'all'
      //   })
      // }
    },
    removeTypeTag(val) {
      if (val === "all") {
        this.siteList = [];
      }
    },
    selectTypeAll() {
      // if (this.siteCodeChecked.length < this.siteList.length) {
      //   this.siteCodeChecked = []
      //   this.siteList.map((item) => {
      //    this.siteCodeChecked.push(item.value)
      //   })
      //     this.siteCodeChecked.unshift('all')
      //   } else {
      //     this.siteList = []
      //   }
    },
    getMechanismChecked(val){
      this.mechanismSelectUpload = String(Math.random());
      this.siteCodeChecked = '';
      this.siteFun(val);
      this.$emit("getSiteCodeChecked", '');
    },
    async siteFun(val) {
      if(this.user.isAdmin){
        let url = "/uDatabaseInfo/getAllList";
        let params = {
          deptId: val
        }
        this.deptId = val;
        await dataHttpGet(url, params).then(res => {
          if (res.code == 200) {
            this.siteList = []
            res.data.forEach((val, key) => {
              this.siteList.push({
                name: val.name,
                value: val.siteCode,
                label: val.name
              });
            });
            this.siteList.unshift({ value: "", label: "", name: "全部" });
          } else {
            this.siteList = [];
          }
        })

      }else{
        await getsiteList({
            userId: this.user.id,
            accountType: this.accountType
          }).then(res => {
            if (res.code == 200) {
              this.siteList = []
              res.data.forEach((val, key) => {
                this.siteList.push({
                  name: val.name,
                  value: val.accoutid,
                  label: val.name
                });
              });
              this.siteList.unshift({ value: "", label: "", name: "全部" });
            } else {
              this.siteList = [];
            }
          });
      }
    }
  }
};
</script>
