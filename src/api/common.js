import request from "@/utils/request";
import qs from "qs";
export function dataHttpGet(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}

export function dataHttpPost(url, data) {
  return request({
    url: url,
    method: "post",
    data
  });
}

export function dataHttpPostJson(url, params) {
  return request({
    url: url,
    method: "post",
    params
  });
}

export function del(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}

export default {};
