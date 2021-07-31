import request from "@/utils/request";
import qs from "qs";
export function edit(data) {
  return request({
    url: "/politics/data/updatePoliticsDataById",
    method: "put",
    data
  });
}
export default { edit };
