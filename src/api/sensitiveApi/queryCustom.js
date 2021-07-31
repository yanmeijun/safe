import request from "@/utils/request";

export function getSensitiveNum(params) {
  return request({
    url: "sensitiveDetail/queryCustom",
    method: "get",
    params
  });
}

export function getSensitiveLevel(params) {
  return request({
    url: "sensitiveDetail/queryByLevel",
    method: "get",
    params
  });
}

export function getArticleCount(params) {
  return request({
    url: "sensitiveDetail/queryArticleCount",
    method: "get",
    params
  });
}

export function getSensitiveCount(params) {
  return request({
    url: "sensitiveDetail/count",
    method: "get",
    params
  });
}

export function getSensitiveType(params) {
  return request({
    url: "sensitiveDetail/getSensitiveType",
    method: "get",
    params
  });
}

export function getsiteList(params) {
  return request({
    url: "UUserAccount/list",
    method: "get",
    params
  });
}



export function sensitiUpdate(params, data) {
  return request({
    url: "sensitiveDetail/update",
    method: "POST",
    params,
    data
  });
}

export function del(params) {
  return request({
    url: "sensitiveDetail/audit",
    method: "post",
    params
  });
}

export function getGroupByUrlApi(params) {
  return request({
    url: "sensitiveDetail/groupByUrl",
    method: "get",
    params
  });
}

export function sensitieFindById(params) {
  return request({
    url: "sensitiveDetail/findById",
    method: "get",
    params
  });
}
