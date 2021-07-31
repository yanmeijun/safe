import request from "@/utils/request";
import qs from "qs";

export function updateCollectionTaskApi(params) {
  return request({
    url: "api/task/updateCollectionTask",
    method: "get",
    params
  });
}

export function add(params) {
  return request({
    url: "api/task/addCollectionTask",
    method: "post",
    params
  });
}

export function del(params) {
  return request({
    url: "api/task/batchDelete",
    method: "get",
    params
  });
}

export function edit(params) {
  return request({
    url: "api/task/updateCollectionTask",
    method: "post",
    params
  });
}

export default { add, edit, del, updateCollectionTaskApi };
