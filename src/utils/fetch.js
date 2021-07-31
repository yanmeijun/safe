import { getSign } from "@/utils/util";
//let baseUrl = process.env.VUE_APP_BASE_API
let baseUrl = "/clo";
//  let signConfig = {
//    module:"cloudapi",
//    appKey:"cloudapi",
//    signSecret:"99999"
//  }

let signConfig = {
  module: "cloudapi",
  appKey: "cloudApi",
  signSecret: "1566370949467"
};

// export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
// 	type = type.toUpperCase();
// 	url = baseUrl + url;
//
//
// 	if (type == 'GET') {
// 		let dataStr = ''; //数据拼接字符串
// 		Object.keys(data).forEach(key => {
// 			dataStr += key + '=' + data[key] + '&';
// 		})
//
// 		if (dataStr !== '') {
// 			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
// 			url = url + '?' + dataStr;
// 		}
// 	}
// 	if (window.fetch && method == 'fetch') {
// 		let requestConfig = {
// 			credentials: 'include',
// 			method: type,
// 			headers: {
// 				'Accept': 'application/json',
// 				'Content-Type': 'application/json'
// 			},
// 			mode: "cors",
// 			cache: "force-cache"
// 		}
//
// 		if (type == 'POST') {
// 			Object.defineProperty(requestConfig, 'body', {
// 				value: JSON.stringify(data)
// 			})
// 		}
//
// 		try {
// 			const response = await fetch(url, requestConfig);  // await 后面可以跟 Promise 对象，表示等待 Promise resolve() 才会继续向下执行，如果 Promise 被 reject() 或抛出异常则会被外面的 try...catch 捕获。
// 			const responseJson = await response.json();
// 			return responseJson
// 		} catch (error) {
// 			throw new Error(error)
// 		}
// 	} else {
// 		return new Promise((resolve, reject) => {
// 			let requestObj;
// 			if (window.XMLHttpRequest) {
// 				requestObj = new XMLHttpRequest();
// 			} else {
// 				requestObj = new ActiveXObject;
// 			}
// 			let sendData = '';
// 			if (type == 'POST') {
// 				sendData = JSON.stringify(data);
// 			}
//
//
// 			requestObj.open(type, url, true);
// 			requestObj.setRequestHeader("Content-type", "application/json");
// 			if(window.document.cookie){
//         //requestObj.setRequestHeader("Authorization",window.document.cookie.slice(3,4));  //设置请求头
//         requestObj.setRequestHeader("userId",window.document.cookie.slice(3,4));  //设置请求头
//       }
//       //requestObj.withCredentials = true; //支持跨域发送cookies
//       requestObj.send(JSON.stringify(data));
//
// 			requestObj.onreadystatechange = () => {
// 				if (requestObj.readyState == 4) {
// 					if (requestObj.status == 200) {
//
// 						//let obj = requestObj.response
// 						let obj = requestObj;
// 						if (typeof obj !== 'object') {
// 							obj = JSON.parse(obj);
// 						}
// 						resolve(obj)
// 					} else {
// 						reject(requestObj)
// 					}
// 				}
// 			}
// 		})
// 	}
// }

// 网关工具包使用说明 soul
/*
 * 工具包提供了调用网关的方法，有带鉴权的方法和不带鉴权的方法，目前支持GET和POST两种请求，下面是带鉴权的方法的参数说明以及举例
 *
 *  module "cloudApiWithSign"
 *  appKey "localGroup"
 *  signSecret "1566283171583"
 *  rpcType  "http"
 *  httpMethod  "get"
 *  method  "api接口"
 *  params
 *  timestamp "时间戳"
 */
function formatDateTime(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}
export default async (
  urlApi = "",
  data = {},
  type = "GET",
  method = "fetch"
) => {
  type = type.toUpperCase();
  let url = baseUrl;
  return new Promise((resolve, reject) => {
    let requestObj;
    if (window.XMLHttpRequest) {
      requestObj = new XMLHttpRequest();
    } else {
      requestObj = new ActiveXObject();
    }

    let sendData = "";
    if (type == "POST") {
      sendData = JSON.stringify(data);
    }
    requestObj.open(type == "FORMDATA" ? "POST" : type, url, true);
    // get设置请求头开始
    requestObj.setRequestHeader("module", signConfig.module);
    requestObj.setRequestHeader("method", urlApi);
    requestObj.setRequestHeader("appKey", signConfig.appKey);
    requestObj.setRequestHeader("rpcType", "http");
    //var timestamp = formatDateTime(new Date());
    var timestamp = formatDateTime(new Date());
    requestObj.setRequestHeader(
      "sign",
      getSign({
        module: signConfig.module,
        rpcType: "http",
        timestamp: timestamp,
        method: urlApi
      })
    );
    requestObj.setRequestHeader("timestamp", timestamp);
    // get设置请求头结束
    if (type == "GET") {
      requestObj.setRequestHeader("httpMethod", "get");
      if (JSON.stringify(data) != "{}") {
        requestObj.setRequestHeader("extInfo", JSON.stringify(data));
      }
    } else {
      requestObj.setRequestHeader("httpMethod", "post");
    }
    if (type == "FORMDATA") {
      requestObj.setRequestHeader(
        "Content-type",
        "multipart/form-data; boundary=----WebKitFormBoundary1zktNGBpAl6DAAV5"
      );
      requestObj.send(data);
    } else {
      requestObj.setRequestHeader("Content-type", "application/json");
      requestObj.send(JSON.stringify(data));
    }

    requestObj.onreadystatechange = () => {
      if (requestObj.readyState == 4) {
        if (requestObj.status == 200) {
          //let obj = requestObj.response
          let obj = requestObj;
          if (typeof obj !== "object") {
            obj = JSON.parse(obj);
          }
          resolve(obj);
        } else {
          reject(requestObj);
        }
      }
    };
  });
};

function stringToByte(str) {
  var bytes = new Array();
  var len, c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}

function byteToString(arr) {
  if (typeof arr === "string") {
    return arr;
  }
  var str = "",
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

export const getHeadRes = (formData, _this) => {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", baseUrl, true);
  xhr.setRequestHeader("module", signConfig.module);
  xhr.setRequestHeader("method", "/task/import");
  xhr.setRequestHeader("appKey", signConfig.appKey);
  xhr.setRequestHeader("rpcType", "http");
  var timestamp = formatDateTime(new Date());
  xhr.setRequestHeader(
    "sign",
    getSign({
      module: signConfig.module,
      rpcType: "http",
      timestamp: timestamp,
      method: "/task/import"
    })
  );
  xhr.setRequestHeader("timestamp", timestamp);
  xhr.setRequestHeader("httpMethod", "post");
  xhr.send(formData);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        this.isUpload = false;
        //let obj = requestObj.response
        let obj = xhr;
        if (typeof obj !== "object") {
          obj = JSON.parse(obj);
        }
        var res = JSON.parse(obj.response);
        if (res.code == 1 || res.code == "1") {
          alert("上传成功");
          _this.$emit("listenToChildEvent", false);
        } else {
          alert(res.message);
        }
      } else {
        console.log(xhr);
      }
    }
  };
};
