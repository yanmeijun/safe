import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/uWarnNewMedia",
    method: "get",
    params
  });
}

export function add(data) {
  return request({
    url: "/uWarnNewMedia",
    method: "post",
    data
  });
}

export function del(ids) {
  return request({
    url: "/uWarnNewMedia",
    method: "delete",
    data: ids
  });
}

export function edit(data) {
  return request({
    url: "/uWarnNewMedia/update",
    method: "put",
    data
  });
}

export function updateStatusNewMedia(data) {
  return request({
    url: "/uWarnNewMedia/updateStatus",
    method: "post",
    data
  });
}

export default { add, edit, del, getMenus, updateStatusNewMedia };
