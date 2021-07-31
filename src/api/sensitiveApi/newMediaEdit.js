import request from "@/utils/request";

export function edit(data) {
  let params = { id: data.id, tableType: 1 };
  return request({
    url: "sensitiveDetail/update",
    method: "post",
    params,
    data
  });
}
export default { edit };
