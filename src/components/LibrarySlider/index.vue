<template>
  <el-form-item :label="copyContent.title" :prop="copyContent.prop">
    <template slot-scope="scope">
      <!-- copyContent.faceDatabase @change="changeSwitch()"-->
      <el-switch
        v-model="faceDatabase"
        active-color="#409EFF"
        inactive-color="#E8ECEE"
        @change="changeSwitch(copyContent.title)"
      />
      <div class="intervalValBox" v-if="faceDatabase">
        <div class="clearfix">
          <label class="tit fl">{{ copyContent.section }}：</label>
          <div class="progressBar fl clearfix">
            <span class="fl progressVal">50%</span>
            <div class="block progressSlider">
              <el-slider
                v-model="value"
                tooltip-class="sliderTip"
                range
                :min="50"
                :max="100"
                v-on:input="inputFunc"
              >
              </el-slider>
            </div>
            <span class="fl progressVal">100%</span>
          </div>
        </div>
        <div class="intervalResultVal">
          <span class="leftVal">{{ sectionOne }}</span>
          <span class="centerTo">～</span>
          <span class="rightVal">{{ sectionTwo }}</span>
        </div>
        <div class="humanFaceBox clearfix">
          <label class="tit fl">{{ copyContent.face }}：</label>
          <span class="btnFilterFace fl" @click="screenFun(copyContent.custormFigureBackVos || copyContent.ucapFigureBackVos)">
            <svg class="icon svg-icon-operW16" aria-hidden="true">
              <use xlink:href="#iconshaixuan"></use>
            </svg>
            {{ copyContent.screen }}
          </span>
          <span class="btnAllFace fl">
            <div v-if="selectAll == 'all'">全部</div>
            <div class="selectedPeopleNum" v-else>
              已选人物
              <span class="currentNum">{{ selectNum }}</span>
              <span class="totalNum">/{{ totalNum }}</span>
              <svg
                class="icon svg-icon-operW12"
                aria-hidden="true"
                @click="closeSelect()"
              >
                <use xlink:href="#icontubiaozhizuomoban4" fill="#999"></use>
              </svg>
            </div>
          </span>
        </div>
      </div>
    </template>
  </el-form-item>
</template>
<script>
import Bus from "@/utils/bus.js";
export default {
  name: "slider",
  props: {
    copyContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      sectionOne: "50%",
      sectionTwo: "100%",
      tagsView: "1",
      value: [50, 100],
      totalNum: "20",
      selectNum: "",
      selectAll: "all",
      ucapFiguresArr: [],
      custormFiguresArr: [],
      section: [],
      section2: [],
      model: "",
      faceDatabase: false
    };
  },
  mounted() {
    this.upData();
    var vm = this;
    // 用$on事件来接收参数
    Bus.$on("selectCustomList", data => {
      console.log(data)
      if (data.customList) {
        if (vm.copyContent.custormFigures) {
          if (vm.copyContent["totalNum"] == data.customList.length) {
            vm.selectAll = "all";
          } else {
            vm.selectAll = "custormFigureBackVos";
          }
          vm.selectNum = data.customList.length>800 ? data.customList.length-1 : data.customList.length;
          vm.copyContent["custormFigures"] = data.customList;
        }
      } else if (data.ucapFigure) {
        if (vm.copyContent.ucapFigures) {
          if (vm.copyContent["totalNum"] == data.ucapFigure.length) {
            vm.selectAll = "all";
          } else {
            vm.selectAll = "ucapFigureBackVos";
          }
          vm.selectNum = data.ucapFigure.length > 800 ? data.ucapFigure.length-1 : data.ucapFigure.length;
          vm.copyContent["ucapFigures"] = data.ucapFigure;
        }
      }
    });
  },
  methods: {
    inputFunc(val) {
      this.sectionOne = val[0] + "%";
      this.sectionTwo = val[1] + "%";
      Object.assign(this.copyContent, {
        sectionOne: this.sectionOne,
        sectionTwo: this.sectionTwo,
        faceDatabase: this.faceDatabase
      });
      this.$emit("handleData", this.copyContent);
    },
    changeSwitch(mgs) {
      if (mgs == "自定义人脸库") {
        this.$emit("handleChangeSwitch", {
          custormFiguresFaceDatabase: { faceDatabase: this.faceDatabase }
        });
      } else if (mgs == "通用人脸库") {
        this.$emit("handleChangeSwitch", {
          ucapFiguresFaceDatabase: { faceDatabase: this.faceDatabase }
        });
      }
    },
    upData() {
      if (this.copyContent["custormMin"]) {
        this.section = [];
        if (this.copyContent["custormMin"].indexOf("%") != -1) {
          this.sectionOne = parseInt(this.copyContent["custormMin"].replace("%", ""));
          this.sectionTwo = parseInt(this.copyContent["custormMax"].replace("%", ""));
          this.section.push(
            parseInt(this.copyContent["custormMin"].replace("%", "")),
            parseInt(this.copyContent["custormMax"].replace("%", ""))
          );
        } else {
          this.sectionOne = parseInt(this.copyContent["custormMin"] * 100);
          this.sectionTwo = parseInt(this.copyContent["custormMax"] * 100);
          if (this.copyContent["custormMax"] * 100 > 100) {
            this.sectionTwo = parseInt(this.copyContent["custormMax"] * 10);
          } else {
            this.sectionTwo = parseInt(this.copyContent["custormMax"] * 100);
          }
          this.section.push(
            parseInt(this.copyContent["custormMin"] * 100),
            parseInt(this.sectionTwo)
          );
        }
        this.value = this.section;
        this.sectionOne = this.section[0] + "%";
        this.sectionTwo = this.section[1] + "%";
      }
      if (this.copyContent["ucapMin"]) {
        this.section2 = [];
        if (this.copyContent["ucapMin"].indexOf("%") != -1) {
          this.sectionOne = parseInt(this.copyContent["ucapMin"].replace("%", ""));
          this.sectionTwo = parseInt(this.copyContent["ucapMax"].replace("%", ""));
          this.section2.push(
            parseInt(this.copyContent["ucapMin"].replace("%", "")),
            parseInt(this.copyContent["ucapMax"].replace("%", ""))
          );
        } else {
          this.sectionOne = parseInt(this.copyContent["ucapMin"] * 100);
          this.sectionTwo = parseInt(this.copyContent["ucapMax"] * 100);
          if (this.sectionTwo > 100) {
            this.sectionTwo = parseInt(this.copyContent["ucapMax"] * 10);
          } else {
            this.sectionTwo = parseInt(this.copyContent["ucapMax"] * 100);
          }
          this.section2.push(
            parseInt(this.copyContent["ucapMin"] * 100),
            parseInt(this.sectionTwo)
          );
        }
        this.value = this.section2;
        this.sectionOne = this.section2[0] + "%";
        this.sectionTwo = this.section2[1] + "%";
      }

      if (this.copyContent["custormFigures"]) {
        this.totalNum = this.copyContent["totalNum"];
        this.custormFiguresArr = this.copyContent["custormFigures"];
        this.faceDatabase = this.copyContent.faceDatabase;
        this.$emit("handleChangeSwitch", {
          custormFiguresFaceDatabase: { faceDatabase: this.faceDatabase }
        });
      }

      if (this.copyContent["custormFigureBackVos"]) {
        if (this.copyContent["custormFigureBackVos"].length == 0) {
          this.selectAll = "all";
        } else {
          this.selectAll = "custormFigureBackVos";
          this.selectNum = this.copyContent["custormFigureBackVos"].length > 800 ? this.copyContent["custormFigureBackVos"].length-1 : this.copyContent["custormFigureBackVos"].length;
          this.copyContent["custormFigures"] = this.copyContent[
            "custormFigureBackVos"
          ];
        }
      }

      if (this.copyContent["ucapFigures"]) {
        this.totalNum = this.copyContent["totalNum"];
        this.ucapFiguresArr = this.copyContent["ucapFigures"];
        this.faceDatabase = this.copyContent.faceDatabase;
        this.$emit("handleChangeSwitch", {
          ucapFiguresFaceDatabase: { faceDatabase: this.faceDatabase }
        });
      }

      if (this.copyContent["ucapFigureBackVos"]) {
        if (this.copyContent["ucapFigureBackVos"].length == 0) {
          this.selectAll = "all";
        } else {
          this.selectAll = "ucapFigureBackVos";
          this.selectNum = this.copyContent["ucapFigureBackVos"].length > 800 ?this.copyContent["ucapFigureBackVos"].length - 1: this.copyContent["ucapFigureBackVos"].length;
          this.copyContent["ucapFigures"] = this.copyContent[
            "ucapFigureBackVos"
          ];
        }
      }

      //faceDatabase
    },
    closeSelect() {
      if (this.selectAll == "ucapFigureBackVos") {
        //this.copyContent["ucapFigures"] = this.ucapFiguresArr;
        this.copyContent["ucapFigures"] = this.copyContent['ucapFiguresTotal']
      } else if (this.selectAll == "custormFigureBackVos") {
        //this.copyContent["custormFigures"] = this.custormFiguresArr;
        this.copyContent["custormFigures"] = this.copyContent['custormFiguresTotal']
      }
      this.selectAll = "all"; 
      this.$emit("handleData", this.copyContent);

    },
    screenFun(data) {
      console.log(data)
      this.model = "";
      let editData = [];
      if (this.copyContent.custormFigures) {
        this.model = "customFrame";
        editData = data.length == 0 ? this.copyContent.custormFiguresTotal : this.copyContent.custormFigures;
      } else {
        this.model = "currencyFrame";
        editData = data.length == 0 ? this.copyContent.ucapFiguresTotal : this.copyContent.ucapFigures;
      }
      //this.$emit("handleDataFrame", this.model);
      this.$emit("handleDataFrame", {'model': this.model, 'data' : editData});
    }
  },
  watch: {
    copyContent: {
      deep: true,
      handler: function(newVal, oldVal) {
        this.upData();
      }
    },
    model: {
      handler: function(newVal, oldVal) {}
    }
  }
};
</script>
<style lang="scss" scoped>
  .el-form-item /deep/ .el-form-item__content {
    min-width: 200px;
  }
</style>
