import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/uDatabaseInfo/list",
    method: "get",
    params
  });
}

export function add(params) {
  return request({
    url: "/uDatabaseInfo/add",
    method: "post",
    params
  });
}

export function del(ids) {
  return request({
    url: "/uDatabaseInfo/delete",
    method: "post",
    data: ids
  });
}

export function edit(params) {
  return request({
    url: "/uDatabaseInfo/update",
    method: "post",
    params
  });
}

export default { add, edit, del, getMenus };
