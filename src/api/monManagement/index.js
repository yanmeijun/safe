import request from "@/utils/request";

export function saveMonManagementApi(data) {
  return request({
    url: "uMonitor",
    method: "put",
    data
  });
}
export function findOneDataAPi(params) {
  return request({
    url: "uMonitor/getOne",
    method: "get",
    params
  });
}
