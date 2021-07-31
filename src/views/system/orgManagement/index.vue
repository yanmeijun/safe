<template>
  <div class="app-container dialogUniversalCharacter">
    <div class="sysMonitorBox clearfix" style="padding-bottom: 30px;">
      <div class="clearfix" v-if="this.user.isAdmin">
        <div class="wh90">
          <Mechanism-Select
            style="margin-bottom: 10px;"
            v-bind:width= "width"
            v-bind:allMechanism="allMechanism"
            :mechanismSelectUpload="mechanismSelectUpload"
            @getMechanismChecked="getMechanismChecked"></Mechanism-Select>
          <!-- <span class="main-aside-txt fl">机构：</span>
          <el-select v-model="query.organizational" class="filter-item fl">
            <el-option v-for="(item, index) in organList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </div>
      </div>
      <div class="clearfix">
        <span class="linkCon linkTitMargin fl">
          <i class="titleTip"></i>
          <span style="padding-left:5px">机构管理列表</span>
        </span>
        <!-- <div class="fl">
          <el-input
            placeholder="请输入搜索关键字"
            clearable
            v-model="query.key">
            <i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer;"></i>
          </el-input>
        </div> -->

        <div class="clearfix frt" v-if="this.user.isAdmin">
          <!--disabled 是不可用状态-->
          <el-button class="btnListDefault btnTabBlue flt" 
          type="primary" 
          size="small"
          @click="openMarkFun('addOrganizational')"
          >
            添加机构
          </el-button>
        </div>
      </div>
      <!--表格渲染-->
      <div class="tableMarginTop">
          <el-table ref="table" v-loading="crud.loading" lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :data="crud.data" 
          class="tableColumnWh"
          row-key="id" @select="crud.selectChange" 
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler">
          <el-table-column type="selection" width="34" align="center" />
          <el-table-column label="序号" type="index" width="34" align="center" />
          <el-table-column label="机构名称" prop="name" v-if="user.isAdmin" width="117" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="机构ID" prop="deptId" v-if="user.isAdmin" width="80" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="系统名称" prop="sysName" width="170" :show-overflow-tooltip="true" align="center" />
          <el-table-column label="系统logo" prop="sysLogo" width="103" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <svg
                class="icon"
                aria-hidden="true"
                @click="lookImageUrl('logo',scope.row)"
                style="width: 16px;height: 16px;cursor: pointer;"
              >
                <use xlink:href="#icontubiaozhizuomoban231"></use>
              </svg>
              <!-- <el-image
                style="display: table-cell;vertical-align: middle;width:16px;height:14px;"
                :src="scope.row.sysLogo == '/static/images/logo2.png' ? baseApi+scope.row.sysLogo.substring(1) : scope.row.sysLogo"
                :preview-src-list='scope.row.sysLogo == "/static/images/logo2.png" ? [baseApi + scope.row.sysLogo.substring(1)] : [scope.row.sysLogo]'
              >
              </el-image> -->
            </template>
          </el-table-column>
          <el-table-column
          :show-overflow-tooltip="true"
          label="域名"
          prop="domainName"
          min-width="10%"
        >
          <template slot-scope="scope">{{
            scope.row.domainName
          }}</template>
        </el-table-column>
        <el-table-column label="中文网站数" prop="webNumCN" width="85" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.webNumCN}}</template>
        </el-table-column>
        <el-table-column label="新媒体数" prop="nickName" width="75" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.mediaNum}}</template>
        </el-table-column>
        <el-table-column label="英文网站数" prop="nickName" width="92" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.webNumEN}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="scope">
            <div class="tabIiconOperate">
              <el-tooltip class="item"
              :enterable="false" 
              effect="dark" content="配置" placement="top">
              <!-- v-if="user.isAdmin || (!user.isAdmin && scope.row.deptId !== 2)" -->
                <svg class="icon svg-icon-operW16" aria-hidden="true" @click="crud.toEdit(scope.row)">
                  <use xlink:href="#iconpeizhi"></use>
                </svg>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" 
              content="编辑"
              v-if="user.isAdmin"
              :enterable="false"
              placement="top">
                <svg class="icon svg-icon-operW16" aria-hidden="true" @click="openMarkFun('addOrganizational', scope.row)">
                  <use xlink:href="#icontubiaozhizuomoban2"></use>
                </svg>
              </el-tooltip>
              <!-- v-model="scope.row.status == '1'" @change="changeEnabled(scope.row, scope.row.status)" -->
              <el-tooltip class="item" effect="dark" 
              content="删除"
              :enterable="false"
              v-if="scope.row.deptId !== 2 && user.isAdmin"
              placement="top">
                <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  @click="toDelete(scope.row,  '确定删除此条数据?')"
                >
                  <use xlink:href="#icontubiaozhizuomoban1"></use>
                </svg>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" 
              :content="scope.row.enabled == 1 ? '停用' : '启用'"
              :enterable="false"
              v-if="scope.row.deptId !== 2 && user.isAdmin"
              placement="top">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#2E8CF0"
                inactive-color="#E8ECEE"
                @change="changeEnabled(scope.row)"
                v-if="scope.row.deptId !== 2 && user.isAdmin"
              />
              </el-tooltip>

            </div>
          </template>
        </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </div>
      <!-- 创建弹框 -->
      <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      class="newWebsiteAccountDia mailboxRadio"
      width="746px"
      style="margin-top:-3vh"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="188px"
      >
      <el-form-item label="登录系统名称:" prop="sysName">
          <el-input v-model="form.sysName" style="width: 473px;" @focus="maxlengthFun" :maxlength = "maxlength"/>
          <el-tooltip content="恢复默认" placement="top" :enterable="false">
            <i class="el-icon-refresh-right restoreDefault" @click="restoreDefault('sysName','内容安全审查系统')"></i>
          </el-tooltip>
      </el-form-item>
      <el-form-item label="配置系统logo:" >
        <div class="uploadlogo">
          <div class="uploadlogo-operation">
            <!-- 默认-->
            <div class="uploadDefaultStatus">
              <div class="uploadPicDefault">
                <img
                  :src="upload.img || upload.originalPicture"
                  style="max-width:53px"
                />
              </div>
            </div>
            <!-- 默认 -->
            <!-- 文件上传中 -->
            <div class="fileUploading" v-if="upload.loading">
              <div class="tit">文件上传中</div>
              <div class="UploadProgressBg">
                <el-progress
                  :show-text="false"
                  :percentage="upload.percentage"
                  color="#1890FF"
                >
                </el-progress>
              </div>
            </div>
            <!-- 文件上传中结束 -->
            <div
              class="hoverDelSVG"
              @mouseleave="isShowPopup = false"
            >
            <!-- <el-upload
              ref="avatarUploade"
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :on-change="
                handleAvatarChange.bind(null, {})
              "
              :auto-upload="false"
              accept="image/*"
            >
              <svg
                class="icon svg-icon-operW16"
                aria-hidden="true"
                fill="#fff"
              >
                <use xlink:href="#iconshangchuan"></use>
              </svg>
            </el-upload> -->
            
              <svg
                  class="icon svg-icon-operW16"
                  aria-hidden="true"
                  fill="#fff"
                  @click="toggleShow"
                >
                <use xlink:href="#iconshangchuan"></use>
              </svg>

              <svg
                class="icon svg-icon-operW16"
                aria-hidden="true"
                fill="#fff"
                @click="lookImageUrl()"
              >
                <use xlink:href="#iconchakan--pure"></use>
              </svg>
              <svg
                class="icon svg-icon-operW16"
                aria-hidden="true"
                fill="#fff"
                @click="delImageUrl()"
              >
                <use xlink:href="#icontubiaozhizuomoban1"></use>
              </svg>
            </div> 
            <!-- 鼠标滑过结束-->
          </div>
          <p>建议上传png透明背景图片，且不超过2MB</p>
        </div>
      </el-form-item>
      <el-form-item label="配置系统域名:" prop="domainName">
        <el-input v-model="form.domainName" style="width: 473px;" />
        <el-tooltip content="恢复默认" placement="top" :enterable="false">
          <i class="el-icon-refresh-right restoreDefault" @click="restoreDefault('domainName','http://datasafe.kaipuyun.cn:89')"></i>
        </el-tooltip>
      </el-form-item>

      <!-- 超级管理员配置 -->
      <el-form-item label="配置监测账号数:" v-if="user.isAdmin" prop="monitorAccount">
        <el-checkbox-group v-model="form.monitorAccount">
          <div v-for="(item, index) in monitorAccountList"  :key="index" style="margin-bottom: 3px;">
            <el-checkbox :label="item.name" :value="item.name" style="width: 158px;">
              {{item.name}}
            </el-checkbox>
            <el-input-number v-model="item.num" style="width: 110px;" controls-position="right" size="small" :min="0"></el-input-number>
            <div class="num-span-small">个</div>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="错敏监测接口配置:" v-if="user.isAdmin">
        <!-- <el-checkbox v-model="form.sensitiveFlag">错敏词接口</el-checkbox> -->
      </el-form-item>
      <el-form-item label="错敏词接口地址:" v-if="user.isAdmin" prop="sensitivePath">
        <!-- <el-input v-model="form.sensitivePath" style="width: 473px;" /> -->

        <el-select
          v-model="form.sensitivePath"
          class="filter-item siteElSelect"
          style="width:473px;"
        >
          <el-option
            v-for="(item, index) in word_path"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>  

      </el-form-item>
      <el-form-item label="错敏词类别:" v-if="user.isAdmin" prop="sensitiveTypeNew">
        <el-select v-model="form.sensitiveTypeNew" 
        multiple 
        class="filter-item siteElSelect" 
        @change="changeTypeSelect"
        @remove-tag="removeTypeTag"
        style="width: 473px;">
          <el-option
            label="全部"
            value="all"
            key="all"
            @click.native="selectTypeAll"
          ></el-option>
          <el-option
            v-for="(item, index) in errSensitivityCategoryList"
            :key="index"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
          <!--  -->
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="错敏监测对应key配置:" v-if="user.isAdmin" prop="sensitiveKey">
        <el-input v-model="form.sensitiveKey" style="width: 473px;" />
      </el-form-item> -->
      <el-form-item label="登录系统用户数配置:" v-if="user.isAdmin" prop="loginAccountArr">
        <el-checkbox-group v-model="form.loginAccountArr">
          <div v-for="(item, index) in loginAccountList"  :key="index" style="margin-bottom: 3px;">
            <el-checkbox :label="item.name" :value="item.name"  style="width: 173px;">
              {{item.name}}
            </el-checkbox>
            <el-input-number v-model="item.num" style="width: 110px;" controls-position="right" size="small" :min="1"></el-input-number>
            <div class="num-span-small">个</div>
          </div>
        </el-checkbox-group>
      </el-form-item>
      <!-- 超级管理员配置结束 -->


      <el-form-item label="发送预警邮箱设置:">
        <el-radio-group v-model="form.type" size="medium" @change="changeEmailSet">
          <el-radio border :label="item.value" :key="item.value" v-for="(item,index) in isCreateNewUser">{{item.label}}</el-radio>
        </el-radio-group> 
      </el-form-item>
      <!-- 开普云默认设置开始 -->
      <!-- <el-form-item label="" prop="" v-if="form.emailSetting===3">
        <div class="mailbox">
          <ul class="mailbox-content">
            <li><b>邮件标题：</b><span>开普云内容安全</span></li>
            <li><b>发件人邮箱名称：</b><span>开普云监管</span></li>
          </ul>
          <span class="lookExamples">查看示例</span>
        </div>
      </el-form-item> -->
      <!-- 开普云默认设置结束 -->

     <!-- 自定义其他企业邮箱开始 -->
      <div class="customTip" v-if="form.type==2">
        <svg class="top_icon icon" aria-hidden="true">
          <use xlink:href="#icontishi"></use>
        </svg>
        <p>使用其他第三方企业邮箱，可能会遇到第三方邮箱诸多限制问题，导致邮件发送失败，影响您正常使用预警功能，不建议您按此方式配置。</p>
      </div>
      <!-- 自定义其他企业邮箱开始 --> 

      <!-- 自定义邮箱模板 & 自定义其他企业邮箱 开始 -->
      <el-form-item label="邮件标题:" prop="title" >
        <el-input v-model="form.type==0 ? '开普云内容安全' : form.title" style="width: 473px;" :disabled="form.type===0"/>
      </el-form-item>
      <el-form-item label="发件人邮箱名称:" prop="sendName">
        <el-input v-model="form.type==0 ? '开普云监管' : form.sendName" style="width: 473px;" :disabled="form.type===0"/>
      </el-form-item>
      <el-form-item label="发件人邮箱地址:" prop="sendAddress" v-if="form.type==2">
        <el-input v-model="form.sendAddress" style="width: 473px;"/>
      </el-form-item>
      
      <!-- 自定义邮箱模板 & 自定义其他企业邮箱 结束 -->

      <!-- 自定义其他企业邮箱开始 -->
      <el-form-item label="登录账号:" v-if="form.type==2" prop="emailAccount">
        <el-input v-model="form.emailAccount" style="width: 473px;" />
      </el-form-item>
      <el-form-item label="登录密码:" v-if="form.type==2" prop="emailPassword">
        <el-input v-model="form.emailPassword" style="width: 473px;" type="password"/>
      </el-form-item>
      <el-form-item label="host:" v-if="form.type==2" prop="emailHost">
        <el-input v-model="form.emailHost" style="width: 473px;" />
      </el-form-item>
      <el-form-item label="port:" v-if="form.type==2" prop="port">
        <el-input v-model="form.port" style="width: 473px;" />
      </el-form-item>
      <!-- <el-form-item label="企业ID:" v-if="form.type==2" prop="enterpriseId">
        <el-input v-model="form.enterpriseId" style="width: 473px;" />
      </el-form-item>
      <el-form-item label="应用凭证秘钥:" v-if="form.type==2" prop="key">
        <el-input v-model="form.key" style="width: 473px;" />
      </el-form-item> -->


      <div class="earlyWarnMailbox">
        <a href="javascript:" @click="lookImageUrl(form.type)">查看预警邮箱示例</a>
      </div>

      <!-- 自定义其他企业邮箱结束 -->
      <el-form-item label="系统版权信息区:" prop="sysCopyrightInfo">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          :autosize="{ minRows: 3.6, maxRows: 3.6 }"
          v-model="form.sysCopyrightInfo"
          maxlength="300"
          show-word-limit
          style="width: 473px;"
        />
        <el-tooltip content="恢复默认" placement="top" :enterable="false">
          <i class="el-icon-refresh-right restoreDefault" @click="restoreDefault('sysCopyrightInfo','© CopyRight 2021 开普云 kaipuyun.cn. All Rights Reserved 版权所有 ⋅ 粤ICP备09112131号-1')"></i>
        </el-tooltip>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.cu === 2"
          type="primary"
          @click="crud.submitCU"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 裁剪图片 start-->
    <vue-cropper ref="VueCropperItem" @confirm="confirmCropper" />
    <!-- 裁剪图片 end-->
    <!--添加机构弹框开始-->
    <component
      v-bind:is="inspectDialog"
      ref="inspectDialog"
      :dialogVisible="dialogVisible"
      @closeDialog="closeDialog"
    ></component>
    <el-image 
      ref="viewImg"
      :class="{'enlargeImages': enlargeImagesShow === 'logo'}"
      :preview-src-list="viewImages">
    </el-image>

    <myUpload
    v-model="show"
    :headers="headers"
    :url="updateLogoApi"
    :width='34'
    :height="28"
    field="file"
    ref="myUpload"
    @src-file-set="srcFileSet"
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
  />
  </div>
</template>
<script>
import CRUD, {
  presenter,
  header,
  form,
  crud
} from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import addOrganizational from './addOrganizational/index';
import vueCropper from "@/components/CropperImage/index2";
import { uploadLog } from "@/api/customPicture/index";
import crudOrgManagement from "@/api/orgManagement/index";
import { getSensitiveType } from "@/api/sensitiveApi/queryCustom";
import { mapGetters } from "vuex";
import store from "@/store";
import MechanismSelect from "@/components/MechanismSelect";
import examples from "@/assets/images/examples.png";
import email3x from "@/assets/images/email3x.png";
import emailThird3x from "@/assets/images/email@3x.png";
import { validEmail } from "@/utils/validate";
import myUpload from "vue-image-crop-upload";
import { getToken } from "@/utils/auth";
const defaultForm = {
  id: null,
  deptId: null,
  sysName: '',
  domainName: 'http://datasafe.kaipuyun.cn:89',
  type: 0,
  sendAddress: '',
  sendName: '',
  title: '',
  emailAccount: '',
  emailPassword: '',
  emailHost: '',
  port: '',
  //enterpriseId: '',
  //key: '',
  sysCopyrightInfo: '',//版本
  monitorAccount: [],//配置监测账号数
  sensitiveFlag: '1 ',//错敏标识(0、未选中，1、选中)
  sensitiveTypeNew: [],
  loginAccountArr: [],
  sensitivePath: ''
  //sensitiveKey: '' //敏感词对应的key设置
};
export default {
  components: {
    pagination,
    rrOperation,
    addOrganizational,
    vueCropper,
    MechanismSelect,
    myUpload
  },
  cruds() {
    return CRUD({
      title: "机构",
      url: "/monitor",
      newAddRefresh: true,
      crudMethod: { ...crudOrgManagement }
    });
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ["word_path"],
  computed: {
    ...mapGetters(["user","baseApi", "updateLogoApi"])
  },
  data() {
    const validMonitorAccount = (rule, value, callback) => {
      if (value.length==0) {
        rule.message = '请配置监测账号数！'
        callback(new Error('请配置监测账号数！'));
      } else {
        let monitorList = []
        this.monitorAccountList.forEach(element => {
            value.forEach(item => {
              if(item == element.name){
                 if(element.num === 0){
                   monitorList.push(element)
                 }
              }
            })
        });
        if(monitorList.length === 3){
          rule.message = '监测账号数不能均为零！'
          callback(new Error('监测账号数不能均为零！'));
        }else{
          if(monitorList.length>0){
            rule.message = '监测账号数不能均为零！'
            callback(new Error('监测账号数不能均为零！'));
          }else{
            callback();
          }
        }
      }
    };
    const validLoginAccount = (rule, value, callback) => {
      if(value.length==0){
        rule.message = '请配置登录系统用户数！'
        callback(new Error('请配置登录系统用户数！'));
      }else{
        if(value.length!==2){
          rule.message = '登录系统用户数配置必须'
          callback(new Error('登录系统用户数配置必须'));
        }else{
          callback();
        }
      }
    }
    const validMail = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("不能为空!即为空时不允许配置完成。"));
      } else if (validEmail(value)) {
        callback();
      } else {
        callback(new Error("格式错误"));
      }
    }
    const validSysName = (rule, value, callback) => {
      if(value === "" || value === null){
        callback(new Error("登录系统名称不能为空"));
      }if(value){
         console.log(value.replace(/[\u0391-\uFFE5]/g,"aa").length)
         if(value.replace(/[\u0391-\uFFE5]/g,"aa").length>16){
          //callback(new Error("名称16字节以内,中文代表2个字节"));
          
         }else{
          callback();
         }
       }
    }
    return {
      organList: [{}],
      dialogVisible: false,
      inspectDialog: 'addOrganizational',
      rules: {
        sysName: [
        //  validator: validSysName
          { required: true, trigger: "blur", message: "登录系统名称不能为空",  }
        ],
        url: [{ required: false, trigger: "blur"}],
        sysCopyrightInfo: [{ required: true, trigger: "blur"}],
        domainName: [
         {required: true, trigger: "blur", message: '请配置配置系统域名!'}
        ],
        monitorAccount: [
          {required: true, trigger: "blur", message: '请配置监测账号数！',validator: validMonitorAccount}
        ],
        sensitivePath: [
          {required: true, trigger: "blur", message: '请填写接口地址！'}
        ],
        sensitiveTypeNew: [
          {required: true, trigger: "blur", message: '请选择敏感词类别！'}
        ],
        // sensitiveKey: [
        //  {required: true, trigger: "blur", message: '请填写key!'}
        // ],
        title: [
         {required: false, trigger: "blur", message: '请填写对应自定义内容。否则设置不成功，不允许提交。'}
        ],
        sendName: [
         {required: false, trigger: "blur", message: '请填写对应自定义内容。否则设置不成功，不允许提交。'}
        ],
        sendAddress: [
        //message: '不能为空!即为空时不允许配置完成。'
         {required: true, trigger: "blur",validator: validMail}
        ],
        loginAccountArr: [
         {required: true, trigger: "blur", message: '请配置登录系统用户数！',validator: validLoginAccount}
        ],
        emailAccount: [
         {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        ],
        emailPassword: [
         {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        ],
        emailHost: [
         {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        ],
        port: [
         {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        ]
        // enterpriseId: [
        //  {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        // ],
        // key: [
        //  {required: true, trigger: "blur", message: '不能为空!即为空时不允许配置完成。'}
        // ]
      },
      upload: {
        img: require("@/assets/images/logo2.png"),
        sort: "0",
        customizeLabelImg: "",
        id: "",
        originalPicture: require("@/assets/images/logo2.png"),
        loading: false,
        percentage: 20
      },
      viewImages: [],
      monitorAccountList: [
        {name: '允许创建中文网站数', num: 0},
        {name: '允许创建新媒体数', num: 0},
        {name: '允许创建英文网站数', num: 0}
      ],
      errSensitivityCategoryList: [], //错敏类别
      loginAccountList: [
        {name: '允许创建角色个数', num: 1},
        {name: '允许创建登录用户个数', num: 1}
      ],
      isCreateNewUser: [
        { label: "开普云默认设置", value: 0 },
        { label: "自定义邮箱模板", value: 1 },
        { label: "自定义其他企业邮箱", value: 2 },
      ],
      width: '42px',
      emailExamplesObj: {
         '0': examples,
         '1': email3x,
         '2': emailThird3x
      },
      mechanismSelectUpload: '0',
      allMechanism: 'allMechanism',
      show: false,
      headers: {
        Authorization: getToken()
      },
      word_path: [],
      maxlength: '16',
      enlargeImagesShow: ''
    }
  },
  mounted(){
    this.word_path = this.dict.word_path;
  },
  methods: {
    maxlengthFun(){
      // this.maxlength = '16';
      // if(this.crud.form.sysName.replace(/[\u0391-\uFFE5]/g,"aa").length>16){
      //   this.maxlength = '8'
      // }
      let leng = this.validateTextLength(this.crud.form.sysName);
      console.log(leng)
      if (leng >= 8) {
        this.maxlength = 8;
      } else {
        this.maxlength = 16;
      }
    },
    validateTextLength (value) {
      // 中文、中文标点、全角字符按1长度，英文、英文符号、数字按0.5长度计算
      let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g
      let mat = value.match(cnReg);
      let length
      if (mat) {
        length = (mat.length + (value.length - mat.length) * 0.5);
        return length
      } else {
        return value.length * 0.5
      }
    },
    toggleShow() {
      this.show = !this.show;
      this.$refs.myUpload.setStep(1)
    },
    cropUploadSuccess(res, field){
       this.upload.img = process.env.VUE_APP_BASE_API + res.data.substring(1);
    },
    srcFileSet(fileName, fileType, fileSize){
      //  if (fileSize > 2 * 1024 * 1024) {
      // }
    },
    cropSuccess(imgDataUrl){
      //调用其组件的方法，将其视图跳转到第一步
      this.$refs.myUpload.setStep(1)
    },
    addOrganizational(){

    },
    openMarkFun( inspection, data ) {
      this.dialogVisible = true;
      this.inspectDialog = inspection;
      this.$nextTick(() => {
        this.$refs.inspectDialog.init(data ? data.id : '', data);
      });
    },
    closeDialog(val) {
      this.dialogVisible = val;
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
    // 删除图片
    delImageUrl(index, data) {
      this.upload.img = require("@/assets/images/logo2.png");
      this.upload.id = "";
      this.upload.customizeLabelImg = "";
      this.$emit("change", "");
    },
    lookImageUrl( mgs, obj ){
      this.enlargeImagesShow = mgs;
      console.log(this.enlargeImagesShow)
      if(mgs || mgs == 0){
        if(obj){
          this.viewImages = obj.sysLogo == "/static/images/logo2.png" ? [this.baseApi + obj.sysLogo.substring(1)] : [obj.sysLogo]
        }else{
          this.viewImages = [this.emailExamplesObj[mgs]];
        }
      }else{
        this.viewImages = [this.upload.img || this.upload.originalPicture];
      }
      this.$nextTick().then(() => {
        this.$refs.viewImg.showViewer = true;
      });
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
      setInterval(this.increment(), 200); //进度条
      this.upload.loading = true;
      //this.loading = true;
      await this.uploadOssApi(file);
      //this.loading = false
      this.upload.loading = false;
    },
    // 上传图片接口
    async uploadOssApi(data) {
      try {
        let params = new FormData();
        params.append("file", data);

        //this.uploadedImageList[index].percentage =20;
        const res = await uploadLog(params);
        if (res.code == "500") {
          this.$message.error(res.message);
          this.$emit("change", "");
          return;
        }
        this.upload.img =
          process.env.VUE_APP_BASE_API + res.data.substring(1);
        //this.imageUrl = res.data;
        this.isProgress = false;
        this.$emit("change", res.data);
      } catch (err) {
        this.$message.error("上传失败");
        //this.imageUrl = ''
        this.upload.img = "";
        this.upload.percentage = 20;
        this.isProgress = false;
        this.$emit("change", "");
      }
    },
    increment() {
      this.upload.percentage = this.upload.percentage + 5;
    },
    // 设置裁剪的配置
    setVueCropperOptions() {
      this.$refs.VueCropperItem.options.autoCropWidth = '40';
      this.$refs.VueCropperItem.options.autoCropHeight = '30';
      this.$refs.VueCropperItem.options.fixedBox = true; //固定相框大小
      
      this.$refs.VueCropperItem.options.fixed = false;
      this.$refs.VueCropperItem.isCompress = true; //是否压缩图片
      this.$refs.VueCropperItem.compress = 0.8; //压缩率
    },
    toDelete(data, mgs) {
      this.$confirm(mgs, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.crud.delAllLoading = true;
          crudOrgManagement.del(data.deptId).then(res => {
            if (res.code == 200) {
              this.mechanismSelectUpload = String(Math.random());
              this.crud.notify("删除成功", CRUD.NOTIFICATION_TYPE.SUCCESS);
            } else {
              this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
            }
            this.crud.toQuery();
          })
        })
        .catch(() => {
          // this.$message({
          //   message: '请求异常',
          //   type: 'error'
          // });
        });
    },
    sensitiveType() {
      getSensitiveType({ type: "" }).then(res => {
        this.errSensitivityCategoryList = [];
        Object.keys(res.data).map((val, key) => {
          this.errSensitivityCategoryList.push({
            value: val,
            label: "",
            name: res.data[val]
          });
        });
      });
    },
    changeTypeSelect(val) {
      if (!val.includes("all") && val.length === this.errSensitivityCategoryList.length) {
        this.form.sensitiveType.unshift("all");
      } else if (
        val.includes("all") &&
        val.length - 1 < this.sensitiveType.length
      ) {
        this.form.sensitiveType = this.form.sensitiveType.filter(
          item => {
            return item !== "all";
          }
        );
      }
    },
    removeTypeTag(val) {
      if (val === "all") {
        this.form.errSensitivityChecked = [];
      }
    },
    selectTypeAll() {
      if (this.form.sensitiveType.length < this.errSensitivityCategoryList.length) {
        this.form.sensitiveType = [];
        this.errSensitivityCategoryList.map(item => {
          this.form.sensitiveType.push(item.value);
        });
        this.form.sensitiveType.unshift("all");
      } else {
        this.form.sensitiveType = [];
      }
    },
    getMechanismChecked(val){
      this.query.deptId = val;
      this.mechanismSelectUpload = String(Math.random());
      this.crud.toQuery();
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.sensitiveType();
      form.sensitiveFlag = 1;
      form.type = 0;
      form.domainName = 'http://datasafe.kaipuyun.cn:89';
      this.upload.img = require("@/assets/images/logo2.png");
      form.sysName = '内容安全审查系统';
      form.sysCopyrightInfo = '© CopyRight 2021 开普云 kaipuyun.cn. All Rights Reserved 版权所有 ⋅ 粤ICP备09112131号-1';
      crudOrgManagement.editDetail(form.deptId).then(res => {
        if(res.data.sensitiveType){
          // form.sysCopyrightInfo = res.data.sysCopyrightInfo;
          Object.assign(form, res.data)
          form.sensitiveTypeNew = res.data.sensitiveType.split(',');
          form.type = Number(res.data.type) || 0;
          this.monitorAccountList[0].num = res.data.webNumCN;
          this.monitorAccountList[1].num = res.data.mediaNum;
          this.monitorAccountList[2].num = res.data.webNumEN;
          form.key = res.data.enterpriseKey;
          if(res.data.webNumCN>0){
            form.monitorAccount.push('允许创建中文网站数');
          }
          if(res.data.mediaNum>0) {
            form.monitorAccount.push('允许创建新媒体数');
          }
          if(res.data.webNumEN>0) {
            form.monitorAccount.push('允许创建英文网站数');
          }

          this.loginAccountList[0].num = res.data.roleNum;
          this.loginAccountList[1].num = res.data.userNum;
          form.loginAccountArr = ['允许创建角色个数','允许创建登录用户个数'];
          res.data.sysLogo == '/static/images/logo2.png' ? this.upload.img = require("@/assets/images/logo2.png") : this.upload.img = res.data.sysLogo || require("@/assets/images/logo2.png");
        }

      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
       let deptEmailVo = {
          emailAccount: crud.form.emailAccount,
          emailHost: crud.form.emailHost,
          emailPassword: crud.form.emailPassword,
          port: crud.form.port,
          // enterpriseId: crud.form.enterpriseId,
          sendAddress: crud.form.sendAddress,
          sendName: crud.form.sendName || '开普云监管',
          title: crud.form.title || '开普云内容安全',
          type: crud.form.type,
          // key: crud.form.key,
          // appKey: crud.form.key
        }
        let monitorVo = {
          mediaNum: 0,//新媒体数
          roleNum: this.loginAccountList[0].num,//允许创建角色个数
          userNum: this.loginAccountList[1].num,//允许创建登录用户数
          webNumCN: 0,//中文站点数
          webNumEN: 0//英文站点数
        }
       crud.form.monitorAccount.forEach(item => {
          if(item == '允许创建中文网站数' && this.monitorAccountList[0].num !==0){
            monitorVo.webNumCN = this.monitorAccountList[0].num;
          }else if(item == '允许创建新媒体数' && this.monitorAccountList[1].num !==0){
            monitorVo.mediaNum = this.monitorAccountList[1].num;
          }else if(item == '允许创建英文网站数' && this.monitorAccountList[2].num !==0){
            monitorVo.webNumEN = this.monitorAccountList[2].num;
          }
       })
       if(monitorVo.webNumCN>9999999){
          this.$message({
            message: "中文网站数不能超过9999999个",
            type: "warning"
          });
          return false;
       }else if(monitorVo.mediaNum>9999999){
        this.$message({
            message: "新媒体数不能超过9999999个",
            type: "warning"
          });
          return false;
       }else if(monitorVo.webNumEN>9999999){
          this.$message({
            message: "英文网站数不能超过9999999个",
            type: "warning"
          });
          return false;
       }
       //允许创建登录用户数
       if(this.loginAccountList[0].num>9999999){
        this.$message({
            message: "登录用户数不能超过9999999个",
            type: "warning"
          });
          return false;
       }
       
      //允许创建角色个数
      if(this.loginAccountList[1].num>9999999){
        this.$message({
            message: "角色个数不能超过9999999个",
            type: "warning"
          });
          return false;
       }
       

       
       Object.assign(crud.form, {monitorVo: monitorVo})
       Object.assign(crud.form, {deptEmailVo: deptEmailVo})
       //this.upload.originalPicture
       if(this.upload.img.indexOf("base64") !=-1){
        crud.form.sysLogo = "/static/images/logo2.png";
       }else{
        crud.form.sysLogo = this.upload.img;
       }
       crud.form.sensitiveType = crud.form.sensitiveTypeNew.join(',');
       this.mechanismSelectUpload = String(Math.random());
       return true;
    },
    [CRUD.HOOK.afterAddError](crud) {
      //this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    [CRUD.HOOK.afterEditError](crud) {
      //this.afterErrorMethod(crud)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      //form.enabled = form.enabled.toString()
    },
    restoreDefault(ele,mgs){
      this.crud.form[ele] = mgs;
    },
    changeEnabled(data, val) {
      let enabled = '';
      if (data.enabled) {
        data.enabled = false;
        enabled = 1;
      } else {
        data.enabled = true;
        enabled = 0;
      }
      this.$confirm(
        enabled == 1 ? "是否要启用？" : "是否要停用？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let param = {
            deptId : data.deptId,
            enabled: enabled
          }
          crudOrgManagement
            .updateEnabledById(param)
            .then(res => {
              this.mechanismSelectUpload = String(Math.random());
              this.crud.notify(
                "修改成功",
                CRUD.NOTIFICATION_TYPE.SUCCESS
              );
              this.crud.toQuery();
            })
            .catch(() => {
              this.crud.notify(res.message, CRUD.NOTIFICATION_TYPE.ERROR);
            });
        })
        .catch(() => {
        });
    },
    changeEmailSet(val){
      this.rules.title[0].required = false;
      this.rules.sendName[0].required = false;
      this.rules.title[0].message = '';
      this.rules.sendName[0].message = '';
      if(val === 1 || val === 2){
        this.rules.title[0].required = true;
        this.rules.sendName[0].required = true;
        this.rules.title[0].message = '请填写对应自定义内容。否则设置不成功，不允许提交。';
        this.rules.sendName[0].message = '请填写对应自定义内容。否则设置不成功，不允许提交。';
        if(val === 2){
          this.rules.title[0].message = '不能为空!即为空时不允许配置完成。';
          this.rules.sendName[0].message = '不能为空!即为空时不允许配置完成。';
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .enlargeImages /deep/ .el-image-viewer__img{
    width:100px !important;
    max-width: 100px !important;
  }
  .restoreDefault{
    cursor: pointer;
  }
  .linkTitMargin{
    margin-top: 5px;
  }
  .originaLeft{
    margin: 0 10px 0 39px;
  }
  .tableMarginTop{
    margin-top: 12px;
  }
  .dialog-footer .el-button--small{
    padding: 8px 15px;
  }
  .newWebsiteAccountDia{
    /deep/ .el-radio{
      margin-right: 0px;
    }
    .mailbox{
      /* box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15); */
      border-radius: 4px;
      border: 1px solid #D9D9D9;
      width: 473px;
      padding: 18px 0 6px 21px;
      .lookExamples{
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #2E8CF0;
        
      }
      &-content{
        margin-bottom: 60px;
        li{
          line-height: 27px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          b{
            color: #333333;
            font-weight: normal;
          }
          span{
            color: #666666;
          }
        }
      }
    }
  }
  .mailboxRadio{
    /deep/ .el-radio--small.is-bordered .el-radio__inner{
      height: 16px;
      width: 16px;
    }
    /deep/ .el-dialog{
      height: 76%;
    }
    /deep/ .el-dialog__body{
      padding-top:16px;
    }
    /deep/ .el-input.is-disabled .el-input__inner {
      color: #333333;
    }
    /deep/ .el-dialog__header{
      margin: 0 30px;
      .el-dialog__title{
        font-size: 14px !important;
        font-family: PingFangSC-Medium, PingFang SC;
      }
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner{
      border-color: #2E8CF0 ;
      background: #fff;
    }
    /deep/ .el-radio__inner::after{
      background-color: #2E8CF0;
        background: #2E8CF0;
    }
    /deep/ .el-radio__input.is-checked .el-radio__inner::after{
      -webkit-transform: translate(-50%, -50%) scale(2);
       transform: translate(-50%, -50%) scale(2);
    }
    /* /deep/ .el-radio.is-bordered+.el-radio.is-bordered{
      margin-left: 8px;
    } */
    /deep/ .el-radio--medium.is-bordered{
      padding: 8px 10px 0 10px;
      height: 32px;
    }
    /deep/ .el-radio__label{
      padding-left:8px;
    }
    .uploadlogo{
      display: flex;
      p{
        margin-left: 20px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #606266;
        line-height: 18px;
        margin-top: 38px;
      }
      &-operation{
        width: 90px;
        height: 90px;
        /* border: 1px solid #dcdfe6; */
        border-radius: 4px;
        .uploadDefaultStatus{
          width: 90px;  
          height: 90px;
          background: #0A0F30;
          border-radius: 4px;
          opacity: 0.5;
          text-align: center;
          cursor: pointer;
        }
        .hoverDelSVG{
          display: none;
          position: absolute;
          top: 1px;
          left: 1px;
          width: 90px;
          height: 90px;
          z-index: 10;
          border-radius: 4px;
          background: #0A0F30;
          opacity: 0.64;
          text-align: center;
          .avatar-uploader{
            width: 18px;
            display: inline-block;
            margin-right: 2px;
          }
          svg.svg-icon-operW16{
             opacity: 1;
             margin-top: 30px;
             margin: 30px 2px 0 2px;
          }
        }
        .fileUploading{
          position: absolute; 
          top: 23px;
          left: 6px;
          height: 50px;
          .tit{ 
           text-align: center;
          }
          .UploadProgressBg{
            width: 80px;
          }
        }
      }
      &-operation:hover  .hoverDelSVG{
        display: block;
      }
    }
    .customTip{
      margin: 0 38px 26px 58px;
      display: flex;
      background: #F0FAFF;
      border-radius: 4px;
      border: 1px solid #ABDCFF;
      padding: 12px 12px 11px 20px;
      svg{
        width: 30px;
        height: 22px;
        position: relative;
        top: 5px;
        margin-right: 11px;
      }
      p{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 17px;
      }
    }
    .earlyWarnMailbox {
      margin: 0 38px 26px 58px;
      text-align: center;
      height: 32px;
      background: #f9f9f9;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      line-height: 32px;
      a{
        cursor: pointer;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #2E8CF0;
        transition: .15s ease-out;
        &:hover {
          color: #2E8CF0;
        }
      }
    }
    .num-span-small{
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #989CA1;
      margin-left: 8px;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #E2E5EB;
      display: inline-block;
      text-align: center;
      line-height: 32px;
    }
  }
  .tabIiconOperate{
    svg {
      margin: 0 3px;
    }
    .el-tooltip{
      outline: none;
    }
  }
</style>
