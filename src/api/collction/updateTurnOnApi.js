import request from "@/utils/request";
import qs from "qs";

export function startStopApi(params) {
  return request({
    url: "api/task/updateTurnOn",
    method: "get",
    params
  });
}

export function findByIdApi(params) {
  return request({
    url: "api/task/findById",
    method: "get",
    params
  });
}

export function getOneList(params) {
  return request({
    url: "api/task/getHistory",
    method: "get",
    params
  });
}
