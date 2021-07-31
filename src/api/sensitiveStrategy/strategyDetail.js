import request from "@/utils/request";

export function getStrategyDetail(params) {
  return request({
    url: "/politics/examine",
    method: "get",
    params
  });
}
