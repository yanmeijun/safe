import fetch from "@/utils/fetch";

// 登录接口
export const loginApi = (password, loginName) =>
  fetch(
    "/user/login",
    {
      password: password,
      loginName: loginName
    },
    "POST",
    ""
  );

/**获取用户列表*/
export const userList = (sort, page, rows, loginName, startTime, endTime) =>
  fetch(
    "/user/list",
    parameters(sort, page, rows, loginName, startTime, endTime),
    "GET",
    ""
  );
/**添加用户列表接口*/
export const addUser = (
  loginName,
  username,
  password,
  signKey,
  role,
  authority,
  userType
) =>
  fetch(
    "/user",
    {
      loginName: loginName,
      username: username,
      password: password,
      signKey: signKey,
      role: role,
      authority: authority,
      userType: userType
    },
    "POST",
    ""
  );
/*用户详情接口*/
export const getUserDetail = id => fetch(`/user/${id}`, {}, "get", "");
/*任务进度列表接口*/
export const taskProgressApi = (
  pageNo,
  pageSize,
  userId,
  taskName,
  entranceUrl,
  queryUserId,
  field,
  asc,
  authority
) =>
  fetch(
    "/task/list",
    {
      pageNo: pageNo,
      pageSize: pageSize,
      userId: userId,
      taskName: taskName,
      entranceUrl: entranceUrl,
      queryUserId: queryUserId,
      field: field,
      asc: asc,
      authority: authority
    },
    "get",
    ""
  );

/**获取用户列表*/
const parameters = (sort, page, rows, loginName, startTime, endTime) => {
  var params;
  if (startTime && endTime) {
    params = {
      state: sort, //用户状态
      pageNo: page, //当前页面
      pageSize: rows, //
      loginName: loginName, //登录名
      startTime: startTime,
      endTime: endTime
    };
  } else {
    params = {
      state: sort, //用户状态
      pageNo: page, //当前页面
      pageSize: rows, //
      loginName: loginName //登录名
    };
  }
  return params;
};
/*角色列表接口*/
export const getRoleList = () => fetch("/role", {}, "get", "");
/*getCollectionTask 获取采集任务数据*/
export const getCollectionTask = (
  pageNo,
  pageSize,
  beginDate,
  endDate,
  taskName,
  webType,
  taskResource,
  entranceUrl,
  taskStatus,
  userId,
  crossTaskId,
  tag,
  siteCode,
  useSiteCode,
  queryUserId,
  queueId,
  ifIndex,
  ifRender,
  authority,
  ifEnglish,
  chargeFlag,
  taskStartBeginTime,
  taskStartEndTime,
  ifTurnOn,
  failedCode
) =>
  fetch(
    "/task/list",
    collectionData(
      pageNo,
      pageSize,
      beginDate,
      endDate,
      taskName,
      webType,
      taskResource,
      entranceUrl,
      taskStatus,
      userId,
      crossTaskId,
      tag,
      siteCode,
      useSiteCode,
      queryUserId,
      queueId,
      ifIndex,
      ifRender,
      authority,
      ifEnglish,
      chargeFlag,
      taskStartBeginTime,
      taskStartEndTime,
      ifTurnOn,
      failedCode
    ),
    "GET",
    ""
  );
const collectionData = (
  pageNo,
  pageSize,
  beginDate,
  endDate,
  taskName,
  webType,
  taskResource,
  entranceUrl,
  taskStatus,
  userId,
  crossTaskId,
  tag,
  siteCode,
  useSiteCode,
  queryUserId,
  queueId,
  ifIndex,
  ifRender,
  authority,
  ifEnglish,
  chargeFlag,
  taskStartBeginTime,
  taskStartEndTime,
  ifTurnOn,
  failedCode
) => {
  let params = {
    pageNo: pageNo, //当前页面
    pageSize: pageSize, //页面大小
    taskName: taskName,
    webType: webType,
    taskResource: taskResource,
    entranceUrl: entranceUrl,
    taskStatus: taskStatus, //状态
    userId: userId, //用户Id
    crossTaskId: crossTaskId,
    tag: tag,
    siteCode: siteCode,
    useSiteCode: useSiteCode,
    queryUserId: queryUserId,
    queueId: queueId,
    ifIndex: ifIndex,
    ifRender: ifRender,
    authority: authority,
    ifEnglish: ifEnglish,
    chargeFlag: chargeFlag,
    ifTurnOn: ifTurnOn,
    failedCode: failedCode
  };

  if (beginDate && endDate) {
    params = Object.assign(params, { beginDate: beginDate, endDate: endDate });
  }

  if (taskStartBeginTime && taskStartEndTime) {
    params = Object.assign(params, {
      taskStartBeginTime: taskStartBeginTime,
      taskStartEndTime: taskStartEndTime
    });
  }
  return params;
};

/*获取采集方式*/
export const getTagData = () => fetch("/tag", {}, "get", "");
export const getTagsGroup = () =>
  fetch("/eurekaCentre/getTagsGroup/sublink", {}, "get", "");

/*获取网站类型接口*/
export const getWebType = () => fetch("/webType", {}, "get", "");
export const searchTaskKey = (taskName, userId, limit, authority) =>
  fetch(
    "/task/by-name",
    {
      taskName: taskName,
      userId: userId,
      limit: limit,
      authority: authority
    },
    "get",
    ""
  );
/*新增和编辑任务接口*/
export const addCollecctionTask = (
  taskType,
  entranceUrl,
  userId,
  depth,
  ufrequency,
  domains,
  taskName,
  webType,
  ext,
  crossTaskId,
  siteCode,
  useSiteCode,
  tag,
  blackDomains,
  ifIndex,
  ifRender,
  articleStartTime,
  articleEndTime,
  articleKeywords,
  dailyCollection,
  limitFlag,
  allLinks,
  ifEnglish
) =>
  fetch(
    "/task/add",
    {
      taskType: taskType,
      entranceUrl: entranceUrl,
      userId: userId,
      depth: Number(depth),
      ufrequency: ufrequency,
      domains: domains,
      taskName: taskName,
      webType: webType,
      ext: ext,
      crossTaskId: crossTaskId,
      siteCode: siteCode,
      useSiteCode: useSiteCode,
      tag: tag,
      blackDomains: blackDomains,
      ifIndex: ifIndex,
      ifRender: ifRender,
      articleStartTime: articleStartTime,
      articleEndTime: articleEndTime,
      articleKeywords: articleKeywords,
      dailyCollection: dailyCollection,
      limitFlag: limitFlag,
      allLinks: allLinks,
      ifEnglish: ifEnglish
    },
    "POST",
    ""
  );
export const editCollecctionTask = (
  taskId,
  entranceUrl,
  userId,
  depth,
  ufrequency,
  domains,
  taskName,
  taskResource,
  webType,
  allLinks
) =>
  fetch(
    "/task/update",
    {
      id: taskId,
      depth: Number(depth),
      entranceUrl: entranceUrl,
      domains: domains,
      taskName: taskName,
      userId: userId,
      ufrequency: ufrequency,
      taskResource: taskResource,
      webType: webType,
      allLinks: allLinks
    },
    "POST",
    ""
  );
export const Data4ExcelDTO = (userId, taskId, dataId, attributes, pageSize) =>
  fetch(
    "/task/excel",
    {
      userId: userId,
      taskId: taskId,
      dataId: dataId,
      attributes: attributes,
      pageSize: pageSize
    },
    "POST",
    ""
  );
/**启用或停用采集用户站点*/
export const startOrstopApi = taskId =>
  fetch(`/task/republish/${taskId}`, {}, "post", "");
/*查看任务进度详情接口*/
export const getTaskDetailApi = taskId =>
  fetch(`/task/get/${taskId}`, {}, "GET", "");

/*文章数据列表接口*/
export const dataListApi = (
  userId,
  taskName,
  keywords,
  startDate,
  endDate,
  pageSize,
  pageNo,
  url,
  authority
) =>
  fetch(
    "/data/user-list",
    getDataList(
      userId,
      taskName,
      keywords,
      startDate,
      endDate,
      pageSize,
      pageNo,
      url,
      authority
    ),
    "GET",
    ""
  );
const getDataList = (
  userId,
  taskName,
  keywords,
  startDate,
  endDate,
  pageSize,
  pageNo,
  url,
  authority
) => {
  var params;
  if (startDate && endDate) {
    params = {
      userId: userId, //用户状态
      taskName: taskName, //当前页面
      keywords: keywords, //
      startDate: startDate,
      endDate: endDate,
      pageSize: pageSize,
      pageNo: pageNo,
      url: url,
      orderFlag: "0",
      authority: authority
    };
  } else {
    params = {
      userId: userId, //用户状态
      taskName: taskName, //当前页面
      keywords: keywords, //
      pageSize: pageSize,
      pageNo: pageNo,
      url: url,
      orderFlag: "0",
      authority: authority
    };
  }
  return params;
};

export const articleDetailApi = datailId =>
  fetch(`/data/${datailId}`, {}, "GET", "");

export const updateApi = params =>
  fetch("/task/update", JSON.parse(params), "POST", "");
export const stopTaskApi = startOrStopId =>
  fetch(`/task/stop/${startOrStopId}`, {}, "POST", "");

export const oneReissue = params =>
  fetch("/task/batchReSendMsg", JSON.parse(params), "GET", "");

export const getViewHistory = taskId =>
  fetch(`/progress/${taskId}`, {}, "GET", "");

export const batchStopApi = checkedUserIDArr =>
  fetch(
    `/task/stop/list`,
    {
      idList: checkedUserIDArr
    },
    "POST",
    ""
  );
// 模板更新接口
export const modifytmpApi = params =>
  fetch("/template/update", JSON.parse(params), "POST", "");
// 模板删除接口
export const deleteTmpApi = tmpID =>
  fetch(`/template/${tmpID}`, {}, "POST", "");
// 用户删除
export const deleteUserApi = currentUserId =>
  fetch(`/user/${currentUserId}`, {}, "POST", "");
// 用户更新
export const userUpdateApi = params =>
  fetch("/user/update", JSON.parse(params), "POST", "");
// 用户重置密码
export const resetPwdApi = params =>
  fetch("/user/pwd-reset", JSON.parse(params), "POST", "");
//用户重置秘钥
export const resetSignApi = params =>
  fetch("/user/signKey", JSON.parse(params), "POST", "");

export const importTaskApi = (userId, files) =>
  fetch("/task/import", getImport(userId, files), "formData", "");
const getImport = (userId, files) => {
  var formData = new FormData();
  formData.append("userId", userId);
  formData.append("file", files);
  return formData;
};

/*模板列表接口*/
export const getTmpApi = (
  userId,
  pageNo,
  pageSize,
  testPath,
  taskId,
  type,
  startTime,
  endTime,
  field,
  asc,
  siteCode,
  url,
  domain,
  firstCloumn,
  deptId
) =>
  fetch(
    "/template/list",
    getTmpListApi(
      userId,
      pageNo,
      pageSize,
      testPath,
      taskId,
      type,
      startTime,
      endTime,
      field,
      asc,
      siteCode,
      url,
      domain,
      firstCloumn,
      deptId
    ),
    "GET",
    ""
  );
const getTmpListApi = (
  userId,
  pageNo,
  pageSize,
  testPath,
  taskId,
  type,
  startTime,
  endTime,
  field,
  asc,
  siteCode,
  url,
  domain,
  firstCloumn,
  deptId
) => {
  var params;
  if (startTime && endTime) {
    params = {
      userId: userId,
      pageNo: pageNo,
      pageSize: pageSize,
      testUrl: testPath,
      taskId: taskId,
      type: type,
      startTime: startTime,
      endTime: endTime,
      field: field,
      asc: asc,
      siteCode: siteCode,
      url: url,
      domain: domain,
      firstCloumn: firstCloumn,
      deptId: deptId
    };
  } else {
    params = {
      userId: userId,
      pageNo: pageNo,
      pageSize: pageSize,
      testUrl: testPath,
      taskId: taskId,
      type: type,
      field: field,
      asc: asc,
      siteCode: siteCode,
      url: url,
      domain: domain,
      firstCloumn: firstCloumn,
      deptId: deptId
    };
  }
  return params;
};

/*添加模板接口*/
export const addTmpApi = (
  userId,
  taskId,
  regexs,
  testPath,
  type,
  linkScript,
  contentScript,
  implicitlyWait,
  pageLoadTimeout,
  asyn,
  render,
  domains,
  scriptTimeout,
  image,
  handless,
  firstCloumn,
  siteCode
) =>
  fetch(
    "/template",
    {
      userId: userId,
      taskId: taskId,
      regexs: regexs,
      testPath: testPath,
      type: type,
      linkScript: linkScript,
      contentScript: contentScript,
      implicitlyWait: implicitlyWait,
      pageLoadTimeout: pageLoadTimeout,
      asyn: asyn,
      render: render,
      domains: domains,
      scriptTimeout: scriptTimeout,
      image: image,
      handless: handless,
      firstCloumn: firstCloumn,
      siteCode: siteCode
    },
    "POST",
    ""
  );
/*获取模板详情接口*/
export const tmpDetailApi = id => fetch(`/template/${id}`, {}, "GET", "");
/*模板测试接口*/
export const checkTmpApi = id =>
  fetch(
    "/check/template",
    {
      templateId: id
    },
    "GET",
    ""
  );

export const checkTaskApi = (taskId, url) =>
  fetch(
    "/check/task",
    {
      taskId: taskId,
      url: url
    },
    "GET",
    ""
  );

//http://47.111.170.170:8080/check/template?templateId=5d0073c5c28f9f0284a9506c

/*export const checkTmpApi = (id) =>fetch("/check/url?url=http://www.changchun.gov.cn/zw/yw/zwdt_74/zwdt/",{
},'GET',"");*/

/*批量启用接口*/
export const batchStartAip = idList =>
  fetch(
    "/task/republish/list",
    {
      idList: idList
    },
    "POST",
    ""
  );

/*获取用户角色列表*/
export const getUserRoleList = () => fetch("/user/list-all", {}, "GET", "");

export const linkChainsApi = (taskId, url, lastId, limit) =>
  fetch(
    "/link/chains",
    {
      taskId: taskId,
      url: url,
      lastId: lastId,
      limit: limit
    },
    "GET",
    ""
  );

export const issueImmediatelyApi = (taskId, url) =>
  fetch(
    "/task/addLinkAndSend",
    {
      taskId: taskId,
      url: url
    },
    "GET",
    ""
  );

// 推送目标接口
export const pushTagApi = () => fetch("/tag/push-tags", {}, "GET", "");
export const getGroupTypeApi = () => fetch("/link/groupTypes", {}, "GET", "");
export const taskStatisticApi = (taskId, groupType, pageNo, pageSize) =>
  fetch(
    "/link/count-list",
    {
      taskId: taskId,
      groupType: groupType,
      pageNo: pageNo,
      pageSize: pageSize
    },
    "GET",
    ""
  );

export const taskBatchApi = idList =>
  fetch(
    "/task/batch",
    {
      idList: idList
    },
    "POST",
    ""
  );

export const deleteTaskApi = taskIdDetel =>
  fetch(`/task/delete/${taskIdDetel}`, {}, "POST", "");

//链接相关接口
export const linkRequestApi = (
  taskId,
  lastId,
  limit,
  url,
  groupType,
  groupKey
) =>
  fetch(
    url,
    getParamsLink(taskId, lastId, limit, url, groupType, groupKey),
    "GET",
    ""
  );
const getParamsLink = (taskId, lastId, limit, url, groupType, groupKey) => {
  var params;
  if (url == "/link/group-list") {
    params = {
      taskId: taskId,
      lastId: lastId,
      limit: limit,
      groupType: groupType,
      groupKey: groupKey
    };
  } else {
    params = {
      taskId: taskId,
      lastId: lastId,
      limit: limit
    };
  }
  return params;
};

export const exportTmpApi = () => fetch("/task/template", {}, "Get", "");

/**
 *
 * 清除任务关联数据
 * @paramers
 *
 */
export const eliminateTaskApi = taskId =>
  fetch(`/task/clear-data/${taskId}`, {}, "POST", "");
export const taskBatchClearApi = idList =>
  fetch(
    "/task/clear-batch",
    {
      idList: idList
    },
    "POST",
    ""
  );

/**
 *
 * 补发消息
 * @paramers
 *
 */
export const reSendMsgApi = LinkId =>
  fetch(
    `/task/reSendMsg/${LinkId}`,
    {
      LinkId: LinkId
    },
    "POST",
    ""
  );

export const getSiteCode = (sitecode, url) =>
  fetch(
    `/check/listInfo`,
    {
      sitecode: sitecode,
      url: url
    },
    "POST",
    ""
  );
