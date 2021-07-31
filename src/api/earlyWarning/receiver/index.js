import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/uWarnUser",
    method: "get",
    params
  });
}

export function add(data) {
  return request({
    url: "/uWarnUser",
    method: "post",
    data
  });
}

export function del(ids) {
  return request({
    url: "/uWarnUser",
    method: "delete",
    data: ids
  });
}

export function edit(data) {
  return request({
    url: "/uWarnUser/update",
    method: "put",
    data
  });
}
export function getHttp(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}

export function postHttp(url, data) {
  return request({
    url: url,
    method: "post",
    data
  });
}

export default { add, edit, del, getMenus };
