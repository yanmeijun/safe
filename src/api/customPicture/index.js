import request from "@/utils/request";

export function uploadOss(data) {
  return request({
    url: "/politics/customPicture/upload",
    method: "post",
    data
  });
}


export function uploadLog(data) {
  return request({
    url: "/monitor/upload",
    method: "post",
    data
  });
}