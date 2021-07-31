import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/api/batchDeadLink",
    method: "get",
    params
  });
}

export function del(params) {
  return request({
    url: "/api/batchDeadLink/delete",
    method: "get",
    params
  });
}

export default { del, getMenus };
