import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/uMediaInfo/list",
    method: "get",
    params
  });
}

export function add(params) {
  return request({
    url: "/uMediaInfo/add",
    method: "post",
    params
  });
}

export function del(ids) {
  return request({
    url: "/uMediaInfo/delete",
    method: "post",
    data: ids
  });
}

export function edit(params) {
  return request({
    url: "/uMediaInfo/update",
    method: "post",
    params
  });
}
export function getHttp(url, params) {
  return request({
    url: url,
    method: "get",
    params
  });
}

export function postHttp(url, params) {
  return request({
    url: url,
    method: "post",
    params
  });
}

export default { add, edit, del, getMenus };
