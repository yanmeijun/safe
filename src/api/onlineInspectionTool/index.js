import request from "@/utils/request";

export function wordsCheckTooApi(data) {
  return request({
    url: "contSafe/wordsCheckTool",
    method: "post",
    data
  });
}

export function segmentCheckToolApi(data) {
  return request({
    url: "contSafe/segmentCheckTool",
    method: "post",
    data
  });
}
