import request from "@/utils/request";
import qs from "qs";

export function del(ids) {
  return request({
    url: "/monitor",
    method: "delete",
    data: ids
  });
}


export function edit(data) {
  return request({
    url: "/monitor",
    method: "put",
    data
  });
}

// 编辑返显
export function editDetail(deptId) {
  return request({
    url: "/monitor/" + deptId,
    method: "get",
  });
}


//修改生效状态
export function updateEnabledById(params){
  return request({
    url: "/monitor/updateEnabledById",
    method: "put",
    params
  });
}
export default { del, edit, updateEnabledById, editDetail };