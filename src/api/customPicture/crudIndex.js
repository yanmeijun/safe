import request from "@/utils/request";

export function add(data) {
  return request({
    url: "/politics/customPicture",
    method: "post",
    data
  });
}

export function del(data) {
  console.log(data);
  //   const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: "/politics/customPicture",
    method: "delete",
    data
  });
}

export function edit(data) {
  return request({
    url: "/politics/customPicture",
    method: "put",
    data
  });
}

// 查询自定义图片
export function getCustomPictureById(params) {
  return request({
    url: "/politics/customPicture/getCustomPictureById",
    method: "get",
    params
  });
}

// 自定义图片启用禁用
export function updateStatusById(params) {
  return request({
    url: "/politics/customPicture/updateStatusById",
    method: "put",
    params
  });
}
export default { add, edit, del, getCustomPictureById, updateStatusById };
