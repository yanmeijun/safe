import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/uDatabaseInfo/list",
    method: "post",
    params
  });
}

export function add(data) {
  return request({
    url: "/uDatabaseInfo/add",
    method: "post",
    data
  });
}

export function del(ids) {
  return request({
    url: "/uDatabaseInfo/delete",
    method: "post",
    data: ids
  });
}

export function edit(data) {
  return request({
    url: "/uDatabaseInfo/update",
    method: "post",
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
