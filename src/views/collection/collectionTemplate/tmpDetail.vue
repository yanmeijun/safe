<template>
  <div class="templateManage" v-if="lookDetailShow">
    <div class="dialog-container add-catalog-dialog">
      <div
        class="dialog-inner dialog-modifyMail"
        style="height: 500px !important;width: 700px;margin-top:-250px !important;margin-left: -350px;"
      >
        <header class="dialog-header">
          <div class="dialog-header-tit flt dialog-header-tit-ymj clearfix">
            <i class="detleClose-ymj ceshi-new-ymj"></i
            ><span class="deleteUser-ymj">测试结果</span>
          </div>
          <div class="icon3 dialog-header-close frt" @click="cancel()"></div>
        </header>
        <div
          class="dialog-body"
          style="margin-bottom: 10px;max-height: 400px;overflow-y: scroll;height: 414px;"
        >
          <div class="sy-publish-dialog-content">
            <table
              class="mainTable userList yhglTable userList-new-result-ymj"
              v-if="Object.keys(this.tmpeDetailObj).length != 0"
            >
              <tr>
                <td
                  style="width: 90px;padding-left: 0;"
                  class="ceshi-title-ymj"
                >
                  链接地址:
                </td>
                <td class="ellipsis ceshi-result-ymj">
                  <a
                    :href="tmpeDetailObj.fetchResult.url"
                    target="_blank"
                    :title="tmpeDetailObj.fetchResult.url"
                    style="color:#0281fe;"
                    >{{ tmpeDetailObj.fetchResult.url }}</a
                  >
                </td>
              </tr>
              <tr>
                <td class="ceshi-title-ymj">语言类型:</td>
                <!--<td class="ellipsis ceshi-result-ymj">{{tmpeDetailObj["language"]}}</td>-->
                <td
                  class="ellipsis ceshi-result-ymj"
                  v-if="tmpeDetailObj['language'] == -1"
                >
                  未知
                </td>
                <td
                  class="ellipsis ceshi-result-ymj"
                  v-if="tmpeDetailObj['language'] == 1"
                >
                  简体中文
                </td>
                <td
                  class="ellipsis ceshi-result-ymj"
                  v-if="tmpeDetailObj['language'] == 2"
                >
                  繁体中文
                </td>
                <td
                  class="ellipsis ceshi-result-ymj"
                  v-if="tmpeDetailObj['language'] == 3"
                >
                  日文
                </td>
              </tr>
              <!-- <tr>
                <td  class="ceshi-title-ymj">页面锚点:</td>
                <td class="ellipsis ceshi-result-ymj">{{tmpeDetailObj.fetchResult.anchor?tmpeDetailObj.fetchResult.anchor:"&#45;&#45;"}}</td>
              </tr>-->
              <tr v-if="tmpeDetailObj.data">
                <td colspan="2">
                  <div class="linkCount" style="margin-left: -24px;">
                    <table class="link-count-new-ymj link-count-y">
                      <tr>
                        <td class="ceshi-title-ymj">所属栏目:</td>
                        <td class=" ceshi-result-ymj">
                          {{ tmpeDetailObj.data.column }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj ellipsis">关键字:</td>
                        <td class="ceshi-result-ymj">
                          <span
                            v-for="(items, index) in tmpeDetailObj.data
                              .articleKeywords"
                            >{{ items + "," }}</span
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">正文:</td>
                        <td class=" ceshi-result-ymj">
                          {{ tmpeDetailObj.data.contentWithoutTag }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">发布时期:</td>
                        <td class="ellipsis ceshi-result-ymj">
                          {{ tmpeDetailObj.data.pubDate }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj" style="vertical-align: top">
                          摘要:
                        </td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.abstracts }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">标题:</td>
                        <td class="ellipsis ceshi-result-ymj">
                          {{ tmpeDetailObj.data.resTitle }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">创建时间:</td>
                        <td class="ellipsis ceshi-result-ymj">
                          {{ tmpeDetailObj.data.createTime }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">文章标签:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.label }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">页面类型:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.linkType }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">文件编号:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.docNo }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">文件年号:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.docYear }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">文件类型:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.docType }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">索引号:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.indexNo }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">发布机关:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.pubOffice }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">发布文号:</td>
                        <td class="ceshi-result-ymj">
                          {{ tmpeDetailObj.data.pubTextNo }}
                        </td>
                      </tr>
                      <tr>
                        <td class="ceshi-title-ymj">文章来源:</td>
                        <td class="ellipsis ceshi-result-ymj">
                          {{ tmpeDetailObj.data.source }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              <tr v-if="tmpeDetailObj['linkCount'] != 0">
                <td class="ceshi-title-ymj">子链数:</td>
                <td class="ellipsis ceshi-result-ymj">
                  {{ tmpeDetailObj["linkCount"] }}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="border-bottom: 0">
                  <div
                    class="linkCount"
                    style="width: 406px;margin-left: 150px;overflow-y: scroll;max-height:174px;
                background: #f7f7f7;"
                  >
                    <div v-for="(item, index) in tmpeDetailObj.links">
                      <h1 class="linkCount-con-text">
                        链接第{{ index + 1 }}条数据
                      </h1>
                      <table class="link-count-new-ymj link-count-new-ym">
                        <!--                        <thead>
                        <tr>
                          <td style=" width: 50%;">链接地址</td>
                          <td style=" width: 20%;">标题文字</td>
                          <td style=" width: 30%;">发布时间</td>
                        </tr>
                        </thead>-->
                        <!-- <tr>
                          &lt;!&ndash;<td class="ceshi-title-ymj ellipsis" style="width: 120px;">链接标题:</td>&ndash;&gt;
                          <td class="ceshi-result-ymj"><a :href="item.relativePath" target="_blank" style="color: #0281fe;">{{item.relativePath}}</a></td>
                          <td class="ceshi-result-ymj"><a :href="item.absPath" target="_blank" style="color: #0281fe;">{{item.anchor?item.anchor:"-&#45;&#45;"}}</a></td>
                          <td class="ceshi-result-ymj">{{item.pudDate}}</td>
                        </tr>-->
                        <tr>
                          <td
                            class="ceshi-title-ymj ellipsis"
                            style="width: 120px;"
                          >
                            链接标题:
                          </td>
                          <td
                            class="ellipsis ceshi-result-ymj"
                            style="width: 200px;"
                          >
                            <a
                              :href="item.absPath"
                              class="ellipsis"
                              target="_blank"
                              :title="item.anchor"
                              style="color: #0281fe;width: 201px;display: inline-block;"
                              >{{ item.anchor ? item.anchor : "--" }}</a
                            >
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="ceshi-title-ymj ellipsis"
                            style="width: 120px;"
                          >
                            相对路径:
                          </td>
                          <td
                            class="ellipsis ceshi-result-ymj"
                            style="width: 200px;"
                          >
                            <a
                              :href="item.relativePath"
                              class="ellipsis"
                              target="_blank"
                              :title="item.relativePath"
                              style="color: #0281fe;width: 201px;display: inline-block;"
                              >{{ item.relativePath }}</a
                            >
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="ceshi-title-ymj ellipsis"
                            style="width: 120px;"
                          >
                            全路径:
                          </td>
                          <td
                            class="ceshi-result-ymj ellipsis"
                            style="width: 200px;"
                          >
                            <a
                              :href="item.absPath"
                              class="ellipsis"
                              target="_blank"
                              :title="item.absPath"
                              style="color: #0281fe;width: 201px;display: inline-block;"
                              >{{ item.absPath }}</a
                            >
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="ceshi-title-ymj ellipsis"
                            style="width: 120px;"
                          >
                            发布时间:
                          </td>
                          <td
                            class="ceshi-result-ymj ellipsis"
                            style="width: 200px;"
                          >
                            {{ item.pudDate }}
                          </td>
                        </tr>
                        <!--<tr>
                          <td class="ceshi-title-ymj ellipsis" style="width: 120px;">网页上的链接相对路径:</td>
                          <td class="ellipsis ceshi-result-ymj"><a :href="item.relativePath" target="_blank" style="color: #0281fe;">{{item.relativePath}}</a></td>
                        </tr>
                        <tr>
                          <td class="ceshi-title-ymj ellipsis" style="width: 120px;">父页面的url:</td>
                          <td class="ellipsis ceshi-result-ymj"><a :href="item.referUrl" target="_blank" style="color: #0281fe;">{{item.referUrl}}</a></td>
                        </tr>
                        <tr>
                          <td class="ceshi-title-ymj ellipsis" style="width: 120px;">拼接后的全路径:</td>
                          <td class="ceshi-result-ymj ellipsis"><a :href="item.absPath" target="_blank" style="color: #0281fe;">{{item.absPath}}</a></td>
                        </tr>
                        <tr>
                          <td class="ceshi-title-ymj ellipsis" style="width: 120px;">当前深度:</td>
                          <td class=" ceshi-result-ymj ellipsis">{{item.cDepth?item.cDepth:"&#45;&#45;"}}</td>
                        </tr>-->
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="maskookDetailShow" v-if="maskookDetailShow">
      <img
        src="../../../assets/images/loader.gif"
        style="width: 45px;height: 43px;"
      />
    </div>
    <!--<div class="loadWord">加载中，请稍候...</div>-->
    <div class="mask"></div>
  </div>
</template>
<style scoped>
.publicList input {
  width: 512px !important;
  height: 32px !important;
  line-height: 32px !important;
  border: 1px solid #d5dde6 !important;
  border-radius: 2px !important;
  background: #fff !important;
  box-sizing: content-box;
  padding: 0 0 0 10px !important;
}
</style>
<style>
.el-tree-node__content > .el-checkbox {
  width: 10px;
}
.maskookDetailShow {
  position: absolute;
  width: 612px;
  height: 500px;
  top: 50%;
  left: 50%;
  margin-left: -306px;
  margin-top: -250px;
  z-index: 1002;
  text-align: center;
  line-height: 500px;
}
.link-count-new-ymj.link-count-y td.ceshi-title-ymj {
  width: 154px;
}
</style>
<script type="text/ecmascript-6">
import axios from 'axios';
import {checkTmpApi} from '@/api/getDate';
import {newArr} from "@/utils/new"
export default{
  name:'templateManage',
  props:["lookDetailShow","lookDetailId"],
  data(){
    return {
      tmpeDetailObj:{},
      maskookDetailShow:true
    }
  },
  components: {

  },
  mounted(){
    this.tmpeDetailObj = {};
    if(this.lookDetailShow){
      this.initData();
    }
  },
  methods: {
    initData(){
      //this.lookDetailId   5d0073c5c28f9f0284a9506c
      //this.tmpeDetailObj = newArr;
      this.maskookDetailShow = true;
      checkTmpApi(this.lookDetailId ).then((res) => {
        res = JSON.parse(res.response)
        this.tmpeDetailObj = res;
        this.maskookDetailShow = false;
      }).catch(e => console.log("请求异常"))
    },
    cancel(){
      this.$emit("listenToChildEvent",false);
    }
  },
  watch: {
    lookDetailShow:{
      handler (val) {
        if(val){
          this.tmpeDetailObj = {}
          this.initData();
        }
      },
      deep:true
    }
  }
}
</script>
