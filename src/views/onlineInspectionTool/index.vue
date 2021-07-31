<template>
  <div class="app-container" v-loading="fullscreenLoading">
    <div class="errSentiveInfoBox clearfix">
      <div class="clearfix">
        <span class="main-aside-txt">检查：</span>
        <el-select v-model="sensitivityCategory" class="filter-item">
          <el-option
            v-for="(item, index) in problemLevelList"
            @click.change.native="changea()"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="errSentiveInfoBox clearfix">
      <el-row class="clearfix" style="margin-top: 16px;">
        <el-col :span="24">
          <!-- <textarea cols="30"
                    rows="10"
                    class="textareaClass"
                    id="hightWord"
                    v-if="hightWordShow"
                    v-model="hightWord" placeholder="请输入要搜索的关键词"></textarea> -->

          <div
            class="box textareaClass"
            id="hightWord"
            @keyup="keyup($event)"
            style="max-height: 230px;overflow-y: scroll;"
            v-html="hightWord"
            placeholder="请输入要搜索的关键词"
            contenteditable="true"
          ></div>

          <!-- <p v-html="hightWord" v-else
                    @click="hideHightWord()"
                    class="textareaClass"></p>  -->
        </el-col>
      </el-row>

      <div class="btnTabListBox clearfix">
        <!--disabled 是不可用状态-->
        <button
          class="btnListDefault btnTabBlue flt"
          :class="{ active: this.hightWordShowOrHide }"
          style="margin-left:0"
          v-preventReClick
          @click="getCheckoutWors"
        >
          立即检测
        </button>
      </div>

      <p class="wordResult" v-if="segmentWordResult">分词结果：</p>
      <p v-if="segmentWordResult" style="margin-top: 8px;">
        {{ segmentWordResult }}
      </p>
    </div>
  </div>
</template>
<script>
import {
  wordsCheckTooApi,
  segmentCheckToolApi
} from "@/api/onlineInspectionTool/index";
export default {
  name: "deadChain",
  computed: {},
  data() {
    return {
      isActive: true,
      problemLevelList: [
        { name: "错敏词检查", value: "1" },
        { name: "词性分析", value: "2" }
      ],
      sensitivityCategory: "",
      hightWord: "",
      hightWordShow: true,
      segmentWordResult: "",
      hightWordShowOrHide: false,
      fullscreenLoading: false
    };
  },
  mounted: function() {
    this.sensitivityCategory = "1";
  },
  methods: {
    displayWords() {
      this.isActive = !this.isActive;
    },
    hideHightWord() {
      this.hightWordShow = true;
      //this.hightWord=''
    },
    keyup(eve) {
      if (!eve.target.innerText.trim()) {
        eve.target.innerHTML = "";
        this.hightWordShowOrHide = false;
      } else {
        this.hightWordShowOrHide = true;
      }
    },
    changea() {
      this.hightWord = "";
      document.getElementById("hightWord").innerHTML = "";
      this.segmentWordResult = "";
      this.hightWordShow = true;

      this.hightWordShowOrHide = false;
    },
    getCheckoutWors() {
      if (!document.getElementById("hightWord").innerText) {
        this.$message({
          message: "请输入关键词",
          type: "warning"
        });
        return;
      }
      this.fullscreenLoading = true;
      this.segmentWordResult = "";
      this.hightWordShow = true;
      if (this.sensitivityCategory == "1") {
        this.hightWord = document.getElementById("hightWord").innerText;
        wordsCheckTooApi({
          keyword: document.getElementById("hightWord").innerText
        }).then(res => {
          this.fullscreenLoading = false;
          if (res.code == 200) {
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                let replaceReg = new RegExp(res.data[i].errorWord, "g");
                let replaceReg2 = res.data[i].errorWord;
                let txt = ''
                if (!res.data[i].suggestWord || res.data[i].suggestWord === '') {
                  txt = res.data[i].explain;
                } else {
                  txt = '书写错误，建议改为';
                }
                let replaceString =
                  '<span style="color: red;position:relative;display: inline-block;" class="dialogErrWord"  onmousemove="enter(this)"  onmouseleave="leave(this)" >' +
                  res.data[i].errorWord +
                  '<div class="dialogErrWordResult" style="display:none;top: 29px;left: 0;position: absolute;z-index:1000" id="dialogErrWordResult">' +
                  '<div class="triangle"></div>' +
                  '<div class="errWordResultBox clearfix">' +
                  '<span class="errWordR fl">' +
                  res.data[i].errorWord +
                  "</span>" +
                  '<span class="iconErrWord fl">' +
                  '<svg class="icon svg-icon-operW16" fill="#2E8CF0" aria-hidden="true">' +
                  '<use xlink:href="#icontubiaozhizuomoban33"></use>' +
                  "</svg>" +
                  "</span>" +
                  '<span class="correctWordR fr">' +
                  res.data[i].suggestWord +
                  "</span>" +
                  "</div>" +
                  '<div class="modifyDesc"><span class="red">' +
                  res.data[i].errorWord +
                  '</span>' + txt + '<span class="green">' +
                  res.data[i].suggestWord +
                  "</span></div>" +
                  "</div>" +
                  "</span>";
                // document.getElementById(
                //   "hightWord"
                // ).innerText = document
                //   .getElementById("hightWord")
                //   .innerText.replace(replaceReg, replaceString);
                  document.getElementById(
                  "hightWord"
                  ).innerText = document
                  .getElementById("hightWord")
                  .innerText.replace(replaceReg2, replaceString);
              }
              this.hightWord = document.getElementById("hightWord").innerText;
            }
          }
        })
        .catch(() => {
            this.fullscreenLoading = false;
            this.$notify.error({
            title: '错误',
            message: '请求异常'
            });
        });
      } else {
        segmentCheckToolApi({
          keyword: document.getElementById("hightWord").innerText
        })
          .then(res => {
            this.fullscreenLoading = false;
            if (res.code == 200) {
              if (res.code == 200) {
                var html = "";
                if (res.data.length > 0) {
                  html += "“[";
                  for (var i = 0; i < res.data.length; i++) {
                    html +=
                      res.data[i].nature + "/n" + res.data[i].word + " , ";
                  }
                  html += "]”";
                }
                this.segmentWordResult = html;
              }
            } else {
            }
          })
          .catch(() => {
            this.fullscreenLoading = false;
            this.$notify.error({
              title: "错误",
              message: "请求异常"
            });
          });
      }
    },
    enter() {}
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
.textareaClass {
  height: 230px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  border-radius: 4px;
  width: 100%;
  padding: 20px;
  outline: none;
}
textarea::-webkit-input-placeholder {
  opacity: 0.25;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #000000;
  text-align: left;
}
.wordResult {
  opacity: 0.65;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000000;
  letter-spacing: -0.34px;
  margin-top: 25px;
}
.btnListDefault.btnTabBlue {
  font-family: PingFangSC-Regular;
  background: #83bbf7;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  line-height: 22px;
  border: none;
}
.btnListDefault.active {
  background: #2e8cf0;
  border-radius: 4px;
  border-radius: 4px;
  color: #fff;
}
</style>
