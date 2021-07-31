import request from "@/utils/request";

export function getMonitorData(params) {
  return request({
    url: "api/home/queryHomeTableDate",
    method: "get",
    params
  });
}

export function getEchartData(params) {
  return request({
    url: "api/home/queryHomeTrendList",
    method: "get",
    params
  });
}
