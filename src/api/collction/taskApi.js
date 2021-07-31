import fetch from "@/utils/fetch";
/*getCollectionTask 获取采集任务数据*/

// export const collectionTaskApi(url, params){

//     return fetch(url + '?' + qs.stringify(params,{ indices: false }),{},'GET',"");
// }

export const collectionTaskApi = (url, params) => fetch(url, params, "GET", "");

// export const getCollectionTask = (
// pageNo,
// pageSize,beginDate,
// endDate,taskName,webType,
// taskResource,entranceUrl,
// taskStatus,userId,crossTaskId,
// tag,siteCode,useSiteCode,
// queryUserId,queueId,
// ifIndex,ifRender,
// authority,ifEnglish,
// chargeFlag,
// taskStartBeginTime,
// taskStartEndTime,ifTurnOn,failedCode) =>fetch("/task/list",
// collectionData(
//     pageNo,pageSize,
//     beginDate,endDate,
//     taskName,webType,
//     taskResource,entranceUrl,
//     taskStatus,userId,
//     crossTaskId,tag,
//     siteCode,useSiteCode,
//     queryUserId,queueId,
//     ifIndex,ifRender,
//     authority,ifEnglish,
//     chargeFlag,taskStartBeginTime,taskStartEndTime,ifTurnOn,failedCode),'GET',"");
// const collectionData = (pageNo,pageSize,beginDate,endDate,taskName,webType,taskResource,entranceUrl,taskStatus,userId,crossTaskId,tag,siteCode,useSiteCode,queryUserId,queueId,ifIndex,ifRender,authority,ifEnglish,chargeFlag,taskStartBeginTime,taskStartEndTime,ifTurnOn,failedCode)=>{
// let params = {
//     pageNo: pageNo,//当前页面
//     pageSize: pageSize,//页面大小
//     taskName:taskName,
//     webType:webType,
//     taskResource:taskResource,
//     entranceUrl:entranceUrl,
//     taskStatus:taskStatus,//状态
//     userId:userId,//用户Id
//     crossTaskId:crossTaskId,
//     tag:tag,
//     siteCode:siteCode,
//     useSiteCode:useSiteCode,
//     queryUserId:queryUserId,
//     queueId:queueId,
//     ifIndex:ifIndex,
//     ifRender:ifRender,
//     authority:authority,
//     ifEnglish:ifEnglish,
//     chargeFlag:chargeFlag,
//     ifTurnOn:ifTurnOn,
//     failedCode:failedCode
// };

// if(beginDate && endDate){
//     params = Object.assign(params,{beginDate:beginDate,endDate:endDate,})
// };

// if(taskStartBeginTime && taskStartEndTime){
//     params = Object.assign(params,{taskStartBeginTime:taskStartBeginTime,taskStartEndTime:taskStartEndTime})
// }
// return params;
// };
