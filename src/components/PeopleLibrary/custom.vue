<template>
  <el-dialog
    title="自定义人物"
    :visible.sync="dialogVisible"
    width="616px"
    height="76%"
  >
    <div class="customCharacterList customRwBox clearfix">
      <ul>
        <li
          v-for="(item, index) in characterList"
          @click="selectCharacter(index)"
          :class="{ active: item.isCheck }"
          :key="index"
        >
          <a href="javascript:;">{{ item.name }}</a>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <div class="selectNumBox">
        已选择<span>{{ selectArr.length }}</span
        >项
      </div>
      <el-button type="text" @click="dialogVisible = false">取消</el-button>
      <el-button type="text" @click="selectAllCharacter()">全部人物</el-button>
      <el-button type="primary" @click="selectData()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getlistFigure } from "@/api/politicalPictureMonitor/index";
export default {
  name: "politicalPictureMonitor",
  props: {
    examineId: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    pinyin: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      characterList: [],
      selectArr: []
    };
  },
  created() {},
  methods: {
    init(data) {
      console.log(data)
      this.dialogVisible = true;
      getlistFigure({
        examineId: this.examineId,
        name: this.name,
        pinyin: this.pinyin,
        type: "1"
      }).then(res => {
        if (res.code == 200) {
          this.characterList = res.data;
          this.selectArr = []
          if(data.length==0){
            data = res.data
          }
          this.characterList.forEach(item => {
            item['isCheck'] = '';
            data.forEach(items => {
              if(items.name == item.name){
                item['isCheck'] = true;
                this.selectArr.push(item)
              }
            })
          })
        }
      });
    },
    selectCharacter(ind) {
      this.selectArr = [];
      if (!this.characterList[ind].isCheck) {
        this.characterList[ind] = Object.assign({}, this.characterList[ind], {
          isCheck: "true"
        });
        this.$set(this.characterList, ind, this.characterList[ind]);
      } else {
        this.characterList[ind] = Object.assign({}, this.characterList[ind], {
          isCheck: ""
        });
        this.$set(this.characterList, ind, this.characterList[ind]);
      }
      this.characterList.forEach(element => {
        if (element.isCheck) {
          this.selectArr.push(element);
        }
      });
    },
    selectAllCharacter() {
      this.dialogVisible = false;
      this.$emit("closeDialog", { customList: this.characterList });
      // this.selectArr = this.characterList;
      //   for(let i = 0; i < this.characterList.length; i++) {
      //     if(!this.characterList[i].isCheck) {
      //       this.characterList[i] = Object.assign({}, this.characterList[i], {
      //         isCheck: 'true'
      //       });
      //       this.$set(this.characterList, i, this.characterList[i]);
      //     }
      //   }
    },
    selectData() {
      this.dialogVisible = false;
      this.$emit("closeDialog", { customList: this.selectArr });
    }
  }
};
</script>
<style scoped>
@import url("../../assets/styles/dialog.css");
</style>
