import request from "@/utils/request";
import qs from "qs";

export function getMenus(params) {
  return request({
    url: "/api/reviewHarmfulLink",
    method: "get",
    params
  });
}

export function getOneList(params) {
  return request({
    url: "/api/reviewHarmfulLink/getReviewHarmfulLinkReferenceList",
    method: "get",
    params
  });
}

export function updateWriteList(params) {
  return request({
    url: "/api/reviewHarmfulLink/updateWriteList",
    method: "get",
    params
  });
}

export default { getMenus, getOneList, updateWriteList };
