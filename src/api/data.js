import request from "@/utils/request";
import qs from "qs";

export function initData(url, params) {
  if (url === "/uWarnSendLog/list") {
    return request({
      url: url,
      method: "post",
      data: params
    });
  } else {
    return request({
      url: url + "?" + qs.stringify(params, {
        indices: false
      }),
      method: "get"
    });
  }
}

export function download(url, params) {
  return request({
    url: url + "?" + qs.stringify(params, {
      indices: false
    }),
    method: "get",
    responseType: "blob"
  });
}

export function newInitData(url, params) {
  if (url === "/politics/data/list" || url === "/uWarnSendLog/list") {
    //+ '?' + qs.stringify(params, { arrayFormat: 'repeat' })
    return request({
      url: url,
      method: "post",
      data: params
    });
  } else {
    return request({
      url: url + "?" + qs.stringify(params, {
        arrayFormat: "repeat"
      }),
      method: "get"
    });
  }
}
