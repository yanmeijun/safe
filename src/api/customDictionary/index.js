import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/customTypos/list",
    method: "get",
    params
  });
}

export function add(params) {
  return request({
    url: "/customTypos/add",
    method: "post",
    params
  });
}

export function del(ids) {
  return request({
    url: "/customTypos/delete",
    method: "post",
    data: ids
  });
}

export function edit(data) {
  return request({
    url: "/customTypos/update",
    method: "post",
    data
  });
}

export default { add, edit, del, getMenus };
