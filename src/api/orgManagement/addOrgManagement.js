import request from "@/utils/request";

export function addOrgManag(data) {
  return request({
    url: "/monitor",
    method: "post",
    data
  });
}

//修改功能菜单
export function updateMenus(data){
  return request({
    url: "/monitor/updateMenus",
    method: "put",
    data
  });
}

//功能菜单编辑
export function getMenusByDeptId(deptId){
  return request({
    url: "/monitor/getMenusByDeptId/" + deptId,
    method: "get"
  });
}
