<template>
  <div class="app-container">
    <div class="siteMenuBox">
      <div class="fl clearfix wh60" v-if="this.user.isAdmin">
          <span class="main-aside-txt">机构：</span>
          <!-- multiple -->
          <el-select
            v-model="deptId"
            @change="getMechanismChecked"
            @remove-tag="removeTypeTag"
            class="filter-item siteElSelect"
            style="width:200px;margin-right: 15px;"
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
      <span class="main-aside-txt">站点：</span>
      <!-- multiple -->
      <el-select
        v-model="sideCodeArr"
        class="filter-item newSelect"
        style="width:400px"
      >
        <el-option
          v-for="(item, index) in siteList"
          @click.change.native="changea($event, index)"
          :key="index"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <!--首页不连通-->

    <div class="errSentiveInfoBox clearfix">
      <div class="homeNotConPic fl">
        <svg class="icon svg-icon-syblt" aria-hidden="true">
          <use xlink:href="#icontubiaozhizuomoban12"></use>
        </svg>
      </div>
      <div class="homeNotConnected fl">
        <div class="tit">首页不连通</div>
        <div class="connectedList">
          <ul>
            <li>
              <b></b
              >考察网站首页连不通的情况。连续监测7天，连通率低于95%则单项否决。公式：连通率=连通次数/连接总次数
            </li>
            <li>
              <b></b
              >每天连接网站首页96~288次,每15分钟或5分钟连接一次。监测结果根据网站服务器Http返回码确定。
            </li>
            <li>
              <b></b>正常连通：200或者3XX系列（300~399） |
              不连通：4XX或者5XX系列（400~599） |
              疑似不连通：无响应（-999）或者多个网站服务器的返回码各不一样
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 首页连通性折线图开始-->
    <div class="Broken-line row">
      <div class="t-broken-l clearfix">
        <h3 class="fl">首页不连通折线图</h3>
        <div class="tab-t fr">
          <ul>
            <li :class="{ on: echartHig == 0 }" @click="dataEchart('0')">
              <a href="javascript:void(0)">今天</a>
            </li>
            <li :class="{ on: echartHig == -1 }" @click="dataEchart('-1')">
              <a href="javascript:void('-1')">昨天</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="e-box"
        style="padding-right: 20px;height: 245px;width:98%"
        id="brokenEchart"
      ></div>
    </div>

    <!-- 首页连通性折线图结束-->
    <div class="monitoring-data row">
      <div class="monitoring-data-e clearfix">
        <h3 class="fl"><span></span>监测数据详情</h3>
        <div class="fl time_con">
          <p style="display: inline-block;">监测时间：</p>
          <el-date-picker
            v-model="monitorTime"
            @change="dataSearch"
            type="date"
            class="date-item"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <div class="l-con fl">
          <span
            >连接总次数：<i>{{ monitorType.connSum }}</i
            >次</span
          >
          <em>|</em>
          <span
            >不连通：<i>{{ monitorType.connHome }}</i
            >次</span
          >
          <em>|</em>
          <span
            >疑似不连通：<i>{{ monitorType.doubtNum }}</i
            >次</span
          >
          <em>|</em>
          <span
            >不连通占比：<i>{{ monitorType.connPro }}%</i></span
          >
        </div>

        <!-- <div class="btnTabListBox frt clearfix">
          	<button class="btnListDefault btnTabBlue flt">导出列表</button>
          </div> -->
      </div>
      <div class="m-d-tab row">
        <div class="Monitoring-form">
          <div class="tabListFilter clearfix">
            <div class="tabListTit flt clearfix">
              <ul>
                <li :class="{ active: activeHig == 1 }" @click="scanFun('1')">
                  <a href="javascript:;">不连通</a>
                </li>
                <li :class="{ active: activeHig == 2 }" @click="scanFun('2')">
                  <a href="javascript:;">疑似不连通</a>
                </li>
                <li :class="{ active: activeHig == 0 }" @click="scanFun('0')">
                  <a href="javascript:;">连通成功</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="Monitoring-number a-bnormalsate">
            <table class="table">
              <thead>
                <tr class="http-con1">
                  <th class="type center" style="width:5%;" rowspan="2">
                    序号
                  </th>
                  <th class="" style="width:16%;" rowspan="2">监测时间</th>
                  <th class="clearfix" style="width:12%;" rowspan="2">
                    <span class="monTit">监测结果</span>
                    <div class="tabTitMonitorResults">
                      <svg
                        class="icon svg-icon-operW16 thJcjg"
                        aria-hidden="true"
                      >
                        <use xlink:href="#icontubiaozhizuomoban5"></use>
                      </svg>
                      <div class="monResultstipCon">
                        <div class="triangle"></div>
                        <p>
                          1、任意一个监测点能够连通（http返回码为300～399）即判定此监测结果是连通；
                        </p>
                        <p>
                          2、三个监测点不连通（http返回码为400-599）并且返回码相同即判定此监测结果不连通；
                        </p>
                        <p>
                          3、三个监测点连接超时时（http返回码为-999）即判定此监测结果疑似不连通；
                        </p>
                        <p>
                          4、三个监测点不连通（http返回码为400-599）但是返回码各不相同即判定此监测结果疑似不连通；
                        </p>
                      </div>
                    </div>
                  </th>
                  <th class="" style="width:22%;" colspan="3">
                    第一次连接确认
                  </th>
                  <th class="" style="width:22%;" colspan="3">
                    第二次连接确认
                  </th>
                  <th class="" style="width:22%;" colspan="3">
                    第三次连接确认
                  </th>
                </tr>
                <tr class="http-con">
                  <th style="width: 8%;"><span>监测点</span></th>
                  <th class="center" style="width: 7%;">
                    <span>http返回码</span>
                  </th>
                  <th style="width:7%;">
                    <span class="center coll-con">耗时</span>
                  </th>
                  <th style="width: 8%;"><span>监测点</span></th>
                  <th class="center" style="width: 7%;">
                    <span>http返回码</span>
                  </th>
                  <th style="width:7%;">
                    <span class="center coll-con">耗时</span>
                  </th>
                  <th style="width: 8%;"><span>监测点</span></th>
                  <th class="center" style="width: 7%;">
                    <span>http返回码</span>
                  </th>
                  <th style="width:7%;">
                    <span class="center coll-con">耗时</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in monitorType.listConn" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ getLocalTime(new Date(item.threeScanTime)) }}</td>
                  <td>{{ monType(item.status) }}</td>
                  <td>北京</td>
                  <td>{{ item.firstHttpCode }}</td>
                  <td>{{ item.loadTime }}</td>
                  <!-- <td>{{item.monitorCity}}</td> -->
                  <td>北京</td>
                  <td>{{ item.secondHttpCode }}</td>
                  <td>{{ item.oneLoadTime }}</td>
                  <!-- <td>{{item.threeMonitorCity}}</td> -->
                  <td>北京</td>
                  <td>{{ item.threeHttpCode }}</td>
                  <td>{{ item.twoLoadTime }}</td>
                </tr>
                <tr v-if="monitorType.listConn.length == 0">
                  <td colspan="12" class="center min-h">
                    <svg class="icon svg-icon-tips" aria-hidden="true">
                      <use xlink:href="#icontubiaozhizuomoban16"></use>
                    </svg>
                    <span style="display: block;margin-top: 20px;"
                      >恭喜，{{ monitorTime }}网站没有发现连接异常</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getsiteList } from "@/api/sensitiveApi/queryCustom";
import { mapGetters } from "vuex";
import { getMonitorData, getEchartData } from "@/api/homeMonitTable/monitor";
import { TimeFormat } from "@/utils/timeFormat";
import echarts from "echarts";
import { dataHttpGet } from "@/api/common";
import { getDepts } from "@/api/system/dept";
let option = {
  title: {
    text: "",
    x: "10",
    y: "10",
    textStyle: {
      align: "right",
      fontFamily: "微软雅黑",
      color: "#676a6c",
      fontWeight: "400",
      fontSize: 12
    }
  },
  color: ["#ff622b", "#fe931f", "#4dd394"],
  legend: {
    x: "right",
    y: "15",
    padding: 20,
    itemGap: 30,
    data: ["不连通次数", "疑似不连通次数", "连通次数"]
  },
  tooltip: {
    trigger: "axis",
    borderColor: "#48b",
    // axisPointer: {
    // 	color: 'rgba(150,150,150,0.3)',
    // 	width: 'auto',
    // 	type: 'default'
    // },
    padding: 15,
    formatter: function(params) {
      console.log(params);
      var res = "";
      for (var i = 0; i < params.length; i++) {
        var param = params[i];
        var seriesName = param.seriesName;
        var name = param.name;
        var val = param.value;
        if (i == 0) {
          res += "时间 : " + name;
        }
        res += "<br/> " + seriesName + " : " + val;
      }
      return res;
    }
  },
  calculable: true,
  xAxis: [
    {
      name: "时间",
      // splitLine:false,
      // axisLine:false,
      // axisTick:false,
      type: "category",
      data: []
      // axisLabel:{
      //     rotate:1,
      //     interval:4
      // }
    }
  ],
  yAxis: [
    {
      name: "次数",
      nameTextStyle: {
        color: "black"
      },
      // splitNumber:3,
      axisLine: {
        lineStyle: {
          //color: '#ffffff',
          width: 1
        },
        type: "value",
        minInterval: 1,
        position: "-5"
      },
      max: function(value) {
        if (value.max < 10) {
          return 10;
        } else {
          return value.max + 2;
        }
      }
    }
  ],
  grid: {
    x: 40,
    x2: 40,
    borderColor: "#fff"
  },
  series: [
    {
      symbol: "emptyCircle",
      symbolSize: 4,
      name: "不连通次数",
      type: "line",
      data: []
    },
    {
      symbol: "emptyCircle",
      symbolSize: 4,
      name: "疑似不连通次数",
      type: "line",
      data: []
    },
    {
      name: "连通次数",
      type: "line",
      //: '总量',
      data: []
    }
  ]
};

export default {
  name: "deadChain",
  components: {  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      siteList: [],
      sideCodeArr: "",
      monitorTime: "",
      monitorType: {
        connHome: "",
        connSum: "",
        doubtNum: "",
        listConn: [],
        listConn2: []
      },
      activeHig: "1",
      echartHig: "0",
      deptId: '',
      mechanismList: []
    };
  },
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
    this.monitorTime = TimeFormat();
    this.deptId = this.user.deptInfo.deptId;
    this.siteFun(this.user.deptInfo.deptId);
    this.getDepts();
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    changea(index) {
      this.queryTableDate();
      this.echartDataFun();
    },
    //1:不连通 0:连通 2:疑似连不通
    monType(num) {
      if (num == 1) {
        return "不连通";
      } else if (num == 0) {
        return "连通";
      } else if (num == 2) {
        return "疑似连不通";
      }
    },
    getMechanismChecked(val){
     this.sideCodeArr = ''
     this.siteFun(val)
    },
    async getDepts() {
      await getDepts().then(res => {
        this.mechanismList = res.content || [];
      });
    },
    removeTypeTag(val) {
      if (val === "all") {
        this.mechanismList = [];
      }
    },
    async siteFun(val) {

      if(this.user.isAdmin){
        let url = "/uDatabaseInfo/getAllList";
        let params = {
          deptId: val
        }
        await dataHttpGet(url, params).then(res => {
          if (res.code == 200) {
            this.siteList = []
              res.data.forEach((val, key) => {
                //this.sideCodeArr.push(val.accoutid);
                this.siteList.push({
                  name: val.name,
                  value: val.siteCode,
                  label: val.name
                });
              });
              //this.siteList.unshift({value: '',label: '',name:'全部'});
            } else {
              this.siteList = [];
            }
        })
      }else{
        await getsiteList({ userId: this.user.id, accountType: "1" }).then(
          res => {
            if (res.code == 200) {
              this.siteList = [];
              res.data.forEach((val, key) => {
                //this.sideCodeArr.push(val.accoutid);
                this.siteList.push({
                  name: val.name,
                  value: val.accoutid,
                  label: val.name
                });
              });
              //this.siteList.unshift({value: '',label: '',name:'全部'});
            } else {
              this.siteList = [];
            }
          }
        );
      }
      
      await this.queryTableDate();

      await this.echartDataFun();
    },
    dataSearch() {
      this.monitorTime = this.formatter(this.monitorTime);
      this.queryTableDate();
    },
    formatter(time) {
      var date = "";
      if (time) {
        let dataee = new Date(time).toJSON();
        date = new Date(+new Date(dataee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, " ")
          .replace(/\.[\d]{3}Z/, "");
        date = date.split(" ")[0];
      }
      return date;
    },
    //列表接口
    queryTableDate() {
      this.monitorType.listConn = [];
      this.monitorType.listConn2 = [];
      let siteCodeList = "";
      var reg = /,$/gi;
      if (Array.isArray(this.sideCodeArr)) {
        for (var i = 0; i < this.sideCodeArr.length; i++) {
          siteCodeList += this.sideCodeArr[i] + ",";
        }
      } else {
        siteCodeList = this.sideCodeArr;
      }
      if (siteCodeList.charAt(siteCodeList.length - 1) == ",") {
        siteCodeList = siteCodeList.replace(reg, "");
      }
      getMonitorData({
        date: this.monitorTime,
        siteCodeList: siteCodeList
      }).then(res => {
        if (res.code == 200) {
          //不连通//连接总次数//疑似不连通
          this.monitorType = Object.assign(this.monitorType, res.data);
          this.monitorType.listConn = [];
          res.data.listConn.forEach((val, key) => {
            if (val.status == this.activeHig) {
              //不连通 默认不连通
              this.monitorType.listConn.push(val);
            }
            this.monitorType.listConn2 = res.data.listConn;
          });
          if (res.data.connHome == 0) {
            this.monitorType = Object.assign(this.monitorType, { connPro: 0 });
          } else {
            this.monitorType = Object.assign(this.monitorType, {
              connPro: Math.round((Number(2) / Number(4)) * 10000) / 100
            });
          }
        }
      });
    },
    getLocalTime(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    scanFun(num) {
      this.activeHig = num;
      this.monitorType.listConn = [];
      //1:不连通 0:连通 2:疑似连不通
      this.monitorType.listConn2.map((val, index) => {
        if (val.status == num) {
          //
          this.monitorType.listConn.push(val);
        }
      });
    },
    dataEchart(num) {
      this.echartHig = num;
      this.echartDataFun();
    },
    createChart(chartId, chartData) {
      let myCharts = echarts.init(document.getElementById(chartId));
      //防止越界，重绘canvas
      window.onresize = myCharts.resize;
      myCharts.setOption(chartData); //设置option
      window.addEventListener("resize", function() {
        myCharts.resize();
      });
    },
    echartDataFun() {
      let siteCodeList = "";
      var reg = /,$/gi;
      if (Array.isArray(this.sideCodeArr)) {
        for (var i = 0; i < this.sideCodeArr.length; i++) {
          siteCodeList += this.sideCodeArr[i] + ",";
        }
      } else {
        siteCodeList = this.sideCodeArr;
      }
      if (siteCodeList.charAt(siteCodeList.length - 1) == ",") {
        siteCodeList = siteCodeList.replace(reg, "");
      }
      //2301000033,bm29260003,2301000033  siteCodeList
      getEchartData({
        dayNum: this.echartHig,
        siteCodeList: siteCodeList
      }).then(res => {
        if (res.code == 200) {
          option.series = [];
          res.data.notConnList.forEach((val, index) => {
            //不连通
            option.series.push({
              symbol: "emptyCircle",
              symbolSize: 4,
              name: "不连通次数",
              type: "line",
              data: val
            });
          });

          res.data.doubtList.forEach((val, index) => {
            //疑似不连通
            option.series.push({
              symbol: "emptyCircle",
              symbolSize: 4,
              name: "疑似不连通次数",
              type: "line",
              data: val
            });
          });

          res.data.connList.forEach((val, index) => {
            //连通次数
            option.series.push({
              name: "连通次数",
              type: "line",
              symbol: "triangle",
              symbolSize: 8,
              data: val
            });
          });
          option.xAxis[0].data = res.data.timeList;
          this.createChart("brokenEchart", option);
        }
        // else{
        // 	this.$message({
        // 	message: res.message,
        // 	type: 'warning'
        // 	})
        // }
      });
    }
  }
};
</script>
<style scoped>
@import url("../../../assets/styles/common.css");
</style>
<style>
/* .el-select.filter-item.el-select--small{
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } */
.newSelect .el-input.el-input--small.el-input--suffix input {
  display: inline-block;
  width: 400px;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
