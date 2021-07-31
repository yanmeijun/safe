<template>
  <div class="app-container">
    <div class="head-container searchTabBox" style="margin-top: 10px;">
      <div class="clearfix" style="margin-bottom: 12px;">
        <div class="clearfix">
          <div v-if="this.user.isAdmin">
            <Mechanism-Select 
            v-bind:width= "width"
            v-if="this.user.isAdmin"
            style="margin-right: 20px;"
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
          </div>
          <div class="fl">
            <el-input
              placeholder="请输入人物名称"
              clearable
              v-model="query.name">
            </el-input>
          </div>
          <div class="frt">
            <el-button
              class="filter-item"
              size="small"
              type="primary"
              @click="crud.toQuery()"
              >查询</el-button
            >
          </div>
        </div>
        <span class="linkCon linkTitBox fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">自定义人脸列表</span>
        </span>
        <div class="btnTabListBox clearfix frt">
          <!--disabled 是不可用状态-->
          <button
            class="btnListDefault flt"
            :class="{ disabled: crud.selections.length === 0 }"
            @click="toDelete(crud.selections, '', '确定要删除选中的数据吗？')"
          >
            删除
          </button>
          <button class="btnListDefault btnTabBlue flt" @click="crud.toAdd">
            添加
          </button>
        </div>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :data="crud.data"
        class="tableColumnWh"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="26" align="center" />
        <el-table-column label="序号" type="index" align="center" width="40" />
        <el-table-column label="图片" align="center" min-width="10%" prop="img">
          <template slot-scope="scope">
            <!-- class="bigPicture" -->
            <div
              v-if="scope.row.img != null && scope.row.img.length > 0"
              @click="lookImg(scope.row)"
              style="color: #266BEE;cursor: pointer;"
            >
              {{ scope.row.img.length }}
              <!-- <div class="leftArrow active" @click="prevHandler($event,scope.row.img)"><i class="el-icon-arrow-left"></i></div>
                      <div class="centerPic">
                        <img
                        style="width: 100%;"
                        :src="scope.row.img[currentIndex]"
                        alt=""
                        @click="imgHandler">
                      </div>
                      <div class="rightArrow" @click="nextHandler($event,scope.row.img)"><i class="el-icon-arrow-right"></i></div> -->
            </div>
            <span v-else style="color: #266BEE;">0</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="name"
          label="图片人物名称"
          width="260px"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          v-if="this.user.isAdmin"
          prop="deptName"
          label="所属机构"
          width="150px"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          prop="createTime"
          label="添加时间"
          align="center"
          min-width="23%"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="createUser"
          label="添加人"
          align="center"
          min-width="12%"
        />
        <el-table-column
          label="监测状态"
          align="center"
          prop="status"
          min-width="13%"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status == '1'"
              active-color="#2E8CF0"
              inactive-color="#E8ECEE"
              @change="changeEnabled(scope.row, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <button @click="crud.toEdit(scope.row)" title="编辑">
                <svg class="icon svg-icon-operW16" aria-hidden="true">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </button>
              <button title="删除">
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  @click="toDelete(scope.row, 'one', '确定删除此条数据?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
    <!--添加自定义人脸弹框 start -->
    <el-dialog
      :title="crud.status.title"
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      class="dialogZztpcl customPicHt"
      width="723px"
      height="76%"
    >
      <div class="picUploadTips">
        <table>
          <tr>
            <td>
              <svg class="icon svg-icon-operW16" aria-hidden="true">
                <use xlink:href="#icontubiaozhizuomoban35" fill="#2E8CF0"></use>
              </svg>
            </td>
            <td>
              图片将用于人脸监测识别。建议分别按不同角度、不同表情的单人清晰人脸图片进行上传，有助于更精准的识别人物哦！
            </td>
          </tr>
        </table>
      </div>
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="110px"
        align="center"
        style="width: 683px;"
      >
        <el-form-item label="图片人物名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            maxlength="30"
            style="width: 200px;"
          />
        </el-form-item>
      </el-form>
      <div class="">
        <div class="uploadPicList">
          <ul class="clearfix">
            <li v-for="(item, index) in uploadedImageList" :key="index">
              <a href="javascript:;">
                <!--默认 图片 start-->
                <el-upload
                  :ref="'avatarUploader' + index"
                  class="avatar-uploader"
                  :action="actionUrl"
                  :show-file-list="false"
                  :on-change="
                    handleAvatarChange.bind(null, { index: index, data: item })
                  "
                  :auto-upload="false"
                  accept="image/*"
                  v-if="type === 'avatar' && !item.img && !item.loading"
                >
                  <!-- v-loading="item.loading" element-loading-text="上传中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"-->
                  <span>
                    <!-- 默认-->
                    <div class="uploadDefaultStatus">
                      <div class="uploadPicDefault">
                        <img
                          :src="item.originalPicture"
                          width="110"
                          height="124px"
                        />
                      </div>
                      <div class="uploadPicSVG">
                        <svg class="icon svg-icon-operW16" aria-hidden="true">
                          <use
                            xlink:href="#icontubiaozhizuomoban59"
                            fill="#2A3A58"
                          ></use>
                        </svg>
                      </div>
                    </div>
                  </span>
                </el-upload>

                <!-- 文件上传中 -->
                <div class="fileUploading" v-if="item.loading">
                  <div class="tit">文件上传中</div>
                  <div class="UploadProgressBg">
                    <el-progress
                      :show-text="false"
                      :percentage="item.percentage"
                      color="#1890FF"
                    >
                    </el-progress>
                  </div>
                </div>

                <!-- 上传的图片 v-lazy="imageUrl"-->
                <div class="uploadedPic" v-if="item.img">
                  <img
                    :src="item.img"
                    class="avatar"
                    @mouseover.stop="isShowPopup = true"
                  />
                </div>
                <div
                  class="hoverDelSVG"
                  @mouseleave="isShowPopup = false"
                  v-show="item.img && isShowPopup"
                >
                  <svg
                    class="icon svg-icon-operW16"
                    aria-hidden="true"
                    @click="delImageUrl(index, item)"
                  >
                    <use xlink:href="#icontubiaozhizuomoban60"></use>
                  </svg>
                </div>
                <!--已上传的图片并滑过可以删除 end-->
                <!--默认 图片 end-->
              </a>
            </li>
            <li class="active" style="display:none">
              <a href="javascript:;">
                <!--默认 图片 start-->
                <div class="uploadDefaultStatus" style="display: none;">
                  <div class="uploadPicDefault">
                    <img
                      src="../../assets/images/rightFace.png"
                      width="110"
                      height="124px"
                    />
                  </div>
                  <div class="uploadPicSVG">
                    <svg class="icon svg-icon-operW16" aria-hidden="true">
                      <use
                        xlink:href="#icontubiaozhizuomoban59"
                        fill="#2A3A58"
                      ></use>
                    </svg>
                  </div>
                </div>
                <!--默认 图片 end-->
                <!--上传错误 start-->
                <div style="">
                  <div class="errorTips">
                    错误提示<span class="triangle"></span>
                  </div>
                  <div class="fileUploadError">
                    <div class="pic">
                      <svg class="icon svg-icon-operW16" aria-hidden="true">
                        <use
                          xlink:href="#icontubiaozhizuomoban58"
                          fill="#FF373A"
                        ></use>
                      </svg>
                    </div>
                    <div class="uploadPicName">
                      内容审核系统-政治图片审核20201218.png
                    </div>
                  </div>
                </div>
                <!--上传错误 end-->
              </a>
            </li>
          </ul>
        </div>
        <div class="uploadPicFormat">
          图片格式支持 jpg、jpeg、png、bmp，图片大小不超过2M，尺寸不低于200px * 200px
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          type="primary"
          :loading="crud.status.cu === 2"
          @click="crud.submitCU"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 裁剪图片 start-->
    <vue-cropper ref="VueCropperItem" @confirm="confirmCropper" />
    <!-- 裁剪图片 end-->

    <!--添加政治图片审核策略弹框end-->
    <!--照片弹框 start-->
    <el-dialog
      title="照片"
      width="514px"
      class="dialogOriginalResult dialogPicTop"
      :append-to-body="true"
      :visible.sync="dialogVisibleImg"
    >
      <div class="uploadPicList viewPic">
        <ul class="clearfix">
          <li
            v-for="(item, index) in viewPictureList"
            :key="index"
            @click="loopImg(index)"
          >
            <a href="javascript:;">
              <el-image
                style="display: table-cell;vertical-align: middle;width:130px;height:144px;"
                :src="item"
                :preview-src-list="viewPictureList"
              >
              </el-image>
            </a>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!--照片弹框 end-->
  </div>
</template>
<script>
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import pagination from "@crud/Pagination";
import vueCropper from "@/components/CropperImage/index";
import { uploadOss } from "@/api/customPicture/index";
import crudCustom from "@/api/customPicture/crudIndex";
import { mapGetters } from "vuex";
import MechanismSelect from "@/components/MechanismSelect";

const defaultForm = {
  id: null,
  name: "",
  pictureItems: [
    { img: "", sort: "0", customizeLabelImg: "", id: "", img: "" },
    { img: "", sort: "1", customizeLabelImg: "", id: "", img: "" },
    { img: "", sort: "2", customizeLabelImg: "", id: "", img: "" },
    { img: "", sort: "3", customizeLabelImg: "", id: "", img: "" },
    { img: "", sort: "4", customizeLabelImg: "", id: "", img: "" }
  ]
};
export default {
  name: "politicalPictureMonitor",
  components: { pagination, vueCropper, MechanismSelect },
  cruds() {
    return CRUD({
      title: "自定义人脸",
      url: "/politics/customPicture",
      newAddRefresh: true,
      crudMethod: { ...crudCustom },
      queryOnPresenterCreated: false
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "图片人物名称不能为空", trigger: "blur" }],
        faceDatabase: [{ required: false, message: "", trigger: "blur" }]
      },
      value: [4, 8],

      isShowPopup: false,
      isProgress: false,

      imageUrl: "",
      actionUrl: "",
      type: "avatar",
      fixedBox: false,
      dialogVisibleImg: false,
      autoCropHeight: 200,
      autoCropWidth: 200,
      isCompress: true, //是否压缩
      compress: "0.8", //压缩率
      uploadedImageList: [
        {
          actionUrl: "",
          img: "",
          sort: "0",
          customizeLabelImg: "",
          id: "",
          originalPicture: require("../../assets/images/leftFace.png"),
          loading: false,
          percentage: 20
        },
        {
          actionUrl: "",
          img: "",
          sort: "1",
          customizeLabelImg: "",
          id: "",
          originalPicture: require("../../assets/images/leftSideFace.png"),
          loading: false,
          percentage: 20
        },
        {
          actionUrl: "",
          img: "",
          sort: "2",
          customizeLabelImg: "",
          id: "",
          originalPicture: require("../../assets/images/frontFace.png"),
          loading: false,
          percentage: 20
        },
        {
          actionUrl: "",
          img: "",
          sort: "3",
          customizeLabelImg: "",
          id: "",
          originalPicture: require("../../assets/images/rightSideFace.png"),
          loading: false,
          percentage: 20
        },
        {
          actionUrl: "",
          img: "",
          sort: "4",
          customizeLabelImg: "",
          id: "",
          originalPicture: require("../../assets/images/rightFace.png"),
          loading: false,
          percentage: 20
        }
      ],
      currentIndex: 0, //一开始设置为 0
      viewPictureList: [],
      mechanismSelectUpload: '0',
      width: '42px'
    };
  },
  mounted(){
    if(this.user.isAdmin){
      this.query.deptId = this.user.deptInfo.deptId;
    }
    this.crud.toQuery()
  },
  methods: {
    getMechanismChecked(val){
      this.mechanismSelectUpload = String(Math.random());
    },
    lookImg(data) {
      this.dialogVisibleImg = true;
      data.img.map((item, index) => {
        if (item.indexOf("http://") == -1) {
          data.img[index] = process.env.VUE_APP_BASE_API + item.substring(1);
        }
      });
      this.viewPictureList = data.img;
    },
    loopImg(index) {
      console.log(index);
    },
    changeEnabled(data, status) {
      this.crud.loading = true;
      let param = {
        id: data.id
      };
      if (status == "0") {
        param["status"] = 1;
      } else {
        param["status"] = 0;
      }
      crudCustom
        .updateStatusById(param)
        .then(res => {
          this.crud.loading = false;
          if (res.code == "200") {
            this.crud.notify("数据更新成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
            this.crud.toQuery();
          } else {
            this.$notify({
              title: "警告",
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(() => {});
    },
    handleData(val) {
      console.log(val);
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.uploadedImageList.forEach(item => {
        item.img = "";
      });
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      if (!crud.form.id) return;
      crudCustom.getCustomPictureById({ id: crud.form.id }).then(res => {
        if (res.code == "200") {
          if (
            res.data.pictureItemList != null &&
            res.data.pictureItemList.length > 0
          ) {
            res.data.pictureItemList.forEach(item => {
              this.uploadedImageList.forEach(items => {
                if (item.sort == items.sort) {
                  items.img =
                    process.env.VUE_APP_BASE_API + item.img.substring(1);
                  items.id = item.id;
                  items.customizeLabelImg = item.customizeLabelImg;
                }
              });
            });
          }
        }
      });
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      let pictureItems = [];
      this.uploadedImageList.forEach(element => {
        if (element.img) {
          pictureItems.push({
            customizeLabelImg: element.customizeLabelImg,
            id: element.id,
            img: element.img.substring(element.img.indexOf("/upload")),
            sort: element.sort
          });
        }
      });
      if (pictureItems.length == 0) {
        this.$message({
          message: "请上传图片",
          type: "error"
        });
        return false;
      }
      crud.form["pictureItems"] = pictureItems;

      if (!crud.form.img || crud.form.img) {
        delete crud.form.img;
      }
      if (crud.form.createUser) {
        delete crud.form.createUser;
      }
      if (crud.form.status) {
        delete crud.form.status;
      }
      
      if (crud.form.createTime) {
        delete crud.form.createTime;
      }
      return true;
    },
    // 上传之前
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        if (!/\.(jpg|jpeg|png|bmp)$/i.test(file.name)) {
          return reject("上传图片只能是jpg、jpeg、png、bmp格式!");
        }
        if (file.size > 2 * 1024 * 1024) {
          return reject("上传图片大小不能超过2M!");
        }
        resolve("符合表单规则");
      });
    },
    // 上传改变
    async handleAvatarChange(obj, file, fileList) {
      try {
        await this.beforeAvatarUpload(file);
        // console.log('上传改变', file)
        this.showVueCropperItem(file, obj);
      } catch (e) {
        this.$message.warning(JSON.stringify(e));
      }
    },
    // 上传图片接口
    async uploadOssApi(data, index) {
      try {
        let params = new FormData();
        params.append("file", data);

        //this.uploadedImageList[index].percentage =20;
        const res = await uploadOss(params);
        if (res.code == "500") {
          this.$message.error(res.message);
          this.$emit("change", "");
          return;
        }
        this.uploadedImageList[index].img =
          process.env.VUE_APP_BASE_API + res.data.substring(1);
        //this.imageUrl = res.data;
        this.isProgress = false;
        this.$emit("change", res.data);
      } catch (err) {
        this.$message.error("上传失败");
        //this.imageUrl = ''
        this.uploadedImageList[index].img = "";
        this.uploadedImageList[index].percentage = 20;
        this.isProgress = false;
        this.$emit("change", "");
      }
    },
    // 删除图片
    delImageUrl(index, data) {
      this.uploadedImageList[index].img = "";
      this.uploadedImageList[index].id = "";
      this.uploadedImageList[index].customizeLabelImg = "";
      //this.imageUrl = ''
      this.$emit("change", "");
    },
    // 显示裁剪框
    showVueCropperItem(file, originalData) {
      this.$refs.VueCropperItem.init();
      this.$refs.VueCropperItem.fileName = file.name;

      this.$refs.VueCropperItem.originalPos = originalData;

      this.$refs.VueCropperItem.options.img = URL.createObjectURL(file.raw);
      this.setVueCropperOptions();
    },
    // 确认裁剪后上传
    async confirmCropper(file) {
      console.log(file);
      setInterval(this.increment(file.originalPos.index), 200); //进度条
      this.uploadedImageList[file.originalPos.index].loading = true;
      //this.loading = true;
      await this.uploadOssApi(file.file, file.originalPos.index);
      //this.loading = false
      this.uploadedImageList[file.originalPos.index].loading = false;
    },
    increment(index) {
      this.uploadedImageList[index].percentage =
        this.uploadedImageList[index].percentage + 5;
    },
    // 设置裁剪的配置
    setVueCropperOptions() {
      this.$refs.VueCropperItem.options.autoCropWidth = this.autoCropWidth;
      this.$refs.VueCropperItem.options.autoCropHeight = this.autoCropHeight;
      this.$refs.VueCropperItem.options.fixedBox = this.fixedBox;

      this.$refs.VueCropperItem.isCompress = this.isCompress; //是否压缩图片
      this.$refs.VueCropperItem.compress = this.compress; //压缩率
    },
    toDelete(data, mgs, info) {
      let arr = [];
      if (mgs == "one") {
        arr.push(data);
      } else {
        if (data.length == 0) {
          return;
        }
        arr = data;
      }
      this.$confirm(info, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.crud.delAllLoading = true;
          this.crud.doDelete(arr);
        })
        .catch(() => {});
    },
    nextHandler(e, data) {
      this.currentIndex++;
      //更改图片地址
      if (this.currentIndex == data.length) {
        //js的if判断语句
        this.currentIndex = 0;
      }
    },
    prevHandler(e, data) {
      //更改图片地址
      if (this.currentIndex == 0) {
        //js的if判断语句
        this.currentIndex = data.length;
      }
      this.currentIndex--;
    },
    imgHandler(e) {
      //每一个事件都有一个event对象, 冒泡阻止默认事件学的
      console.log(e.target); //当前目标对象 <img src="img/1.jpg" alt>
      console.log(this); //实例化里面的对象this 指的都是当前实例化对象
    }
  }
};
</script>
<style scoped>
@import url("../../assets/styles/dialog.css");
</style>
