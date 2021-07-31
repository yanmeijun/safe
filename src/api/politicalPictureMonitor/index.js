import request from "@/utils/request";
import qs from "qs";
export function getsiteList(params) {
  return request({
    url: "UUserAccount/list",
    method: "get",
    params
  });
}

export function getlistFigure(params) {
  return request({
    url: "/politics/data/listFigure",
    method: "put",
    params
  });
}

// 查询审核策略生效策略
export function getValidExamine(params) {
  return request({
    url: "/politics/examine/getValidExamine",
    method: "get",
    params
  });
}

//查询人脸识别结果分页数据
export function getPoliticsList(params) {
  return request({
    url: "/politics/data/list",
    method: "get",
    params
  });
}

//获取人物图片 json.dumps(params)
export function getlistPicture(params) {
  //+ '?' + qs.stringify(params, { arrayFormat: 'repeat' })
  let dataArr = []
  params.labelNames.length > 0 ? dataArr = params.labelNames : []
  return request({
    url:"/politics/data/listPicture",
    method: "post",
    data:dataArr
  });
}

//修改人脸识别状态
export function updateStatuse(params) {
  return request({
    url:
      "/politics/data/updateStatusById" +
      "?" +
      qs.stringify(params, { arrayFormat: "repeat" }),
    method: "put"
  });
}

//  查询人脸识别结果详情
export function getPoliticsDataBy(params) {
  return request({
    url: "/politics/data/getPoliticsDataById",
    method: "get",
    params
  });
}

export function exportData(data){
  return request({
    url: '/politics/data/exportExcelByDto',
    method: 'post',
    responseType: 'blob',
    data
  });
}