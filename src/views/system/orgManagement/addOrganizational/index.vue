<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :title="this.isEditShow? '编辑' : '添加机构'"
    :visible.sync="addOrganizational"
    width="512px" 
    class="dialogOrgan"
  >
  <div class="addOrganizationalMain">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="81px"
    >
    <!-- v-if="!this.isEditShow" -->
      <el-form-item label="机构名称:" prop="name">
        <el-input
          placeholder=""
          clearable
          v-model="form.name"
          style="width: 321px;"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="机构ID:" v-if="this.isEditShow">
        <el-input
          placeholder=""
          :disabled="true"
          v-model="form.id"
          style="width: 321px;"
        />
      </el-form-item>
      <el-form-item label="功能菜单:" prop="menuEditList">
        <el-cascader
        :key="refreshItem"
        v-model="form.menuEditList"
        :options="provenceArray"
        :props="props"
        class="siteElSelect"
        ref="cascaders"
        style="width: 321px;"
        ></el-cascader>
      </el-form-item>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="text" size="small" @click="addOrganizational = false">取消</el-button>
    <el-button type="primary" size="small" @click="submitForm('form')">确定</el-button>
  </div>
  </el-dialog>
</template>
<script>
import crudMenu from "@/api/system/menu";
import { mapGetters } from "vuex";
import { addOrgManag, updateMenus, getMenusByDeptId } from "@/api/orgManagement/addOrgManagement";
export default {
  name: 'addOrganizational',
  data() {
    let that = this;
    return {
      addOrganizational: false,
      form: {
        name: '',
        id: '',
        menuEditList: [],
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写机构名称!'
          }
        ],
        menuEditList: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择功能菜单'
          }
        ]
      },
      props: { 
        multiple: true,
        children: "children",
        label: "label",
        value:"id",
        lazy: true,
        lazyLoad(node, resolve){
          if (node.data.id && node.data.hasChildren && node.data.children.length==0) {
            that.handleItemChange(node.data, resolve)
          }else{
            resolve([])
          }
        }
      },
      provenceArray: [],
      refreshItem:0,  // 重新渲染级联选择器 
      isEditShow: false,
      editData: {}
    }
  },
  created() {
    this.getMenus();
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    async init(id, data) {
      this.editData = data;
      this.addOrganizational = true;
      this.isEditShow = false;
      if(id){
        this.isEditShow = true;
      }
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      })

      if(this.isEditShow){
        try {
          let resData = await getMenusByDeptId(data.deptId);
          this.form.menuEditList = JSON.parse(resData.data.menus);
          this.form.name = resData.data.name;
          this.form.id = resData.data.id;
        } catch(err){
          this.$message({
            message: '请求异常',
            type: 'error'
          });
        }
        if(this.provenceArray[0].children.length>0){
           return;
        }
        for (let i = 0; i< this.provenceArray.length; i++){
           if(this.provenceArray.length >0 ){
            if(!this.provenceArray[i].leaf && this.provenceArray[i].hasChildren){
              let res = await crudMenu.getMenusTree({pid:this.provenceArray[i].id,deptId: this.user.deptId});
              res.forEach(item => {
                item.hasChildren = false;
                item.children = null;
                item.leaf = true;
              })
              this.provenceArray[i].children = res;
            }
           }
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let menusList = [];
          menusList = [].concat.apply([], this.form.menuEditList);
          Object.assign(this.form, {menusList: [...new Set(menusList)]});
          this.form.menuEdit = JSON.stringify(this.form.menuEditList);
          if(this.isEditShow){
            Object.assign(this.form, {deptId: this.editData.deptId});
            //delete this.form.id
            updateMenus(this.form).then(res => {
              if(res.code == '200'){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.addOrganizational = false;
                this.$parent.mechanismSelectUpload = String(Math.random());
                this.$parent.crud.toQuery();
              }
            })
          }else{
            addOrgManag(this.form).then(res => {
              if(res.code == '200'){
                // this.$refs['form'].resetFields();
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.addOrganizational = false;
                this.$parent.mechanismSelectUpload = Math.random();
                this.$parent.crud.toQuery();
              }
            })
          }
        } else {
          return false;
        }
      });
    },
    getMenus() {
      const params = { pid: 0, deptId: this.user.deptId};
      crudMenu.getMenusTree(params).then(res => {
        this.refreshItem++;
        this.provenceArray = res || []
        this.provenceArray.forEach((item,index)=>{
          if(item.hasChildren){
            //crudMenu.getMenusTree(0).then(res => {
            this.provenceArray[index].children = [] // 视图未更新
          }
          // this.$set(this.provenceArray[index], 'children', []) // right
        })
      });
    },
    handleItemChange(val,resolve){
      crudMenu.getMenusTree({pid: val.id, deptId: this.user.deptId}).then(res => {
        //leaf
        res.forEach(item => {
          item.hasChildren = false;
          item.children = null;
          item.leaf = true;
        })
        resolve(res)
      })
    },
  }
}
</script>
<style scoped lang="scss">
  .addOrganizationalMain{
    padding: 0 80px 0 24px;
    margin-top: -10px;
  }
  .dialogOrgan{
    /deep/ .el-dialog__body{
      padding-bottom:15px;  
    }
    /deep/ .el-dialog__footer{
      padding: 15px;
      padding-top:0;
      .dialog-footer{
        padding-top: 15px;
      }
    }
    /deep/ .el-input.is-disabled .el-input__inner {
      color: #333333;
    }
    .dialog-footer .el-button--small{
      padding: 8px 15px;
    }
  }
  .siteElSelect {
    /deep/ .el-cascader__tags{
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
</style>