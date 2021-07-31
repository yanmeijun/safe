import request from "@/utils/request";
import qs from "qs";

// export function postHttp(url, data) {
//   return request({
//     url: url,
//     method: "post",
//     data
//   });
// }
export function uWarnSendLog(params) {
  return request({
    url: "/uWarnSendLog",
    method: "get",
    params
  });
}