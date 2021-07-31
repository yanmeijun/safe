<template>
  <!-- 通用人物弹框 start -->
  <el-dialog
    title="通用人物弹框"
    :visible.sync="dialogVisible"
    :before-close="close"
    width="928px"
    height="76%"
  >
    <div class="dialogUniversal">
      <dir-transfer
        v-model="value2"
        filter-placeholder="人物名称"
        :data="data2"
        :titles="titles"
        ref="myTransfer"
      ></dir-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <a href="javascript:;" class="useHelp fl" @click="showDialogVisible()"
        >使用帮助</a
      >
      <el-button type="text" @click="close()">取消</el-button>
      <!-- <el-button type="text">全部人物</el-button> -->
      <el-button type="primary" @click="shareSave()">确定</el-button>
    </div>
    <!--引导页 start-->
    <div class="guidePagesBox" v-if="guidePageVisible">
      <div class="pic">
        <img src="../../assets/images/guidePagesPic.png" width="954" />
      </div>
      <el-row class="guidePagesClose">
        <el-button type="text" @click="closeDialogVisible()">知道了</el-button>
      </el-row>
    </div>
    <!--引导页 end-->
  </el-dialog>
  <!--通用人物弹框end-->
</template>
<script>
import DirTransfer from "@/components/Transfer/transfermain";
import { getlistFigure } from "@/api/politicalPictureMonitor/index";
let rawData = [];
export default {
  name: "politicalPictureMonitor",
  props: {},
  data() {
    const generateData2 = _ => {
      const data = [];
      const cities = rawData;
      //const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      cities.forEach((item, index) => {
        data.push({
          label: item.name,
          key: index,
          id: item.id,
          figureId: item.figureId,
          name: item.name,
          pinyin: item.pinyin,
          customizeLabelName: item.customizeLabelName
          //pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      dialogVisible: false,
      input: "",
      data2: [],
      value2: [],
      titles: ["全部人脸库", "已选"], //左右穿梭框的标题
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      selectArr: [],
      guidePageVisible: false,
      editData: []
    };
  },
  components: { DirTransfer },
  mounted() {
    
  },
  methods: {
    async init(data) {
      this.editData = data;
      await this.getDatalistFigure("", "0");
      this.dialogVisible = true;
      if (data) {
        //this.value2 = this.editData.map(ele => ele.key);
      }
    },
    shareSave() {
      this.dialogVisible = false;
      this.selectArr = [];
      this.value2.forEach(items => {
        this.data2.forEach(item => {
          if(item.key == items){
            this.selectArr.push(item);
          }
        })
      });
      this.$emit("closeDialog", { ucapFigure: this.selectArr });
    },
    close() {
      //this.value2 = [];
      this.$refs.myTransfer.$children[0]._data.query = '';
      // 清空右边搜索
      this.$refs.myTransfer.$children[2]._data.query = '';
      this.dialogVisible = false;
    },
    closeDialogVisible() {
      this.guidePageVisible = false;
    },
    showDialogVisible() {
      this.guidePageVisible = true;
    },
    getDatalistFigure(pinyin, type) {
      getlistFigure({
        examineId: "",
        name: "",
        pinyin: pinyin,
        type: type
      }).then(res => {
        if (res.code == 200) {
          let data = [];
          res.data.forEach((item, index) => {
            data.push({
              label: item.name,
              key: item.id,
              id: item.id,
              figureId: item.figureId,
              name: item.name,
              pinyin: item.pinyin,
              customizeLabelName: item.customizeLabelName
            });
            
            this.editData.forEach(items => {
              if(item.name == items.name){
                items['key'] = item.id
              }
            })

          });
          
          this.data2 = data;
          if(this.data2.length == this.editData.length || this.editData.length==0){
            this.value2 = this.data2.map(ele => ele.key);
          }else{
            this.value2 = this.editData.map(ele => ele.key);
            console.log(this.value2)
          }
        }
      });
    }
  }
}
</script>
<style scoped>
@import url("../../assets/styles/dialog.css");
</style>
