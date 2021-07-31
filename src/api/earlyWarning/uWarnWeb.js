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
    url: "/uWarnWeb",
    method: "post",
    data
  });
}

export function del(ids) {
  return request({
    url: "/uWarnWeb",
    method: "delete",
    data: ids
  });
}

export function edit(data) {
  return request({
    url: "/uWarnWeb/update",
    method: "put",
    data
  });
}

export function getOne(params) {
  return request({
    url: "/uWarnWeb/getOne",
    method: "get",
    params
  });
}

export function updateStatus(data) {
  return request({
    url: "/uWarnWeb/updateStatus",
    method: "post",
    data
  });
}

export default { add, edit, del, getMenus, updateStatus, getOne };
