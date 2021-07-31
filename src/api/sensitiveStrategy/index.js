import request from "@/utils/request";

export function add(data) {
  return request({
    url: "/politics/examine",
    method: "post",
    data
  });
}

export function del(data) {
  console.log(data);
  //   const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: "/politics/examine",
    method: "delete",
    data
  });
}

export function edit(data) {
  return request({
    url: "/politics/examine",
    method: "put",
    data
  });
}

export function upData(params) {
  return request({
    url: "/politics/examine/updateStatusById",
    method: "put",
    params
  });
}
export default { add, edit, del, upData };
