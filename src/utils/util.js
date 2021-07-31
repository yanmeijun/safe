import crypto from "crypto";
let signConfig = {
  module: "cloudapi",
  appKey: "cloudapi",
  signSecret: "99999",
  target: "http://47.111.170.170/apis"
};
/**
 * 使用md5加密
 */
export const getmd5 = str => {
  if (!str) {
    return str;
  }
  var md5 = crypto.createHash("md5");
  md5.update(str);
  str = md5.digest("hex");
  return str;
};

/*md5加密*/
var hexcase = 0;
var b64pad = "";
var chrsz = 8;
export const hex_md5 = a => {
  return binl2hex(core_md5(str2binl(a), a.length * chrsz));
};
function b64_md5(a) {
  return binl2b64(core_md5(str2binl(a), a.length * chrsz));
}
function str_md5(a) {
  return binl2str(core_md5(str2binl(a), a.length * chrsz));
}
function hex_hmac_md5(a, b) {
  return binl2hex(core_hmac_md5(a, b));
}
function b64_hmac_md5(a, b) {
  return binl2b64(core_hmac_md5(a, b));
}
function str_hmac_md5(a, b) {
  return binl2str(core_hmac_md5(a, b));
}
function md5_vm_test() {
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}
function core_md5(p, k) {
  p[k >> 5] |= 128 << k % 32;
  p[(((k + 64) >>> 9) << 4) + 14] = k;
  var o = 1732584193;
  var n = -271733879;
  var m = -1732584194;
  var l = 271733878;
  for (var g = 0; g < p.length; g += 16) {
    var j = o;
    var h = n;
    var f = m;
    var e = l;
    o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
    l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
    m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
    n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
    o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
    l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
    m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
    n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
    o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
    l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
    m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
    n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
    o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
    l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
    m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
    n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
    o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
    l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
    m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
    n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
    o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
    l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
    m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
    n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
    o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
    l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
    m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
    n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
    o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
    l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
    m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
    n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
    o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
    l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
    m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
    n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
    o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
    l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
    m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
    n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
    o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
    l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
    m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
    n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
    o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
    l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
    m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
    n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
    o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
    l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
    m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
    n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
    o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
    l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
    m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
    n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
    o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
    l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
    m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
    n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
    o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
    l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
    m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
    n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
    o = safe_add(o, j);
    n = safe_add(n, h);
    m = safe_add(m, f);
    l = safe_add(l, e);
  }
  return Array(o, n, m, l);
}
function md5_cmn(h, e, d, c, g, f) {
  return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d);
}
function md5_ff(g, f, k, j, e, i, h) {
  return md5_cmn((f & k) | (~f & j), g, f, e, i, h);
}
function md5_gg(g, f, k, j, e, i, h) {
  return md5_cmn((f & j) | (k & ~j), g, f, e, i, h);
}
function md5_hh(g, f, k, j, e, i, h) {
  return md5_cmn(f ^ k ^ j, g, f, e, i, h);
}
function md5_ii(g, f, k, j, e, i, h) {
  return md5_cmn(k ^ (f | ~j), g, f, e, i, h);
}
function core_hmac_md5(c, f) {
  var e = str2binl(c);
  if (e.length > 16) {
    e = core_md5(e, c.length * chrsz);
  }
  var a = Array(16),
    d = Array(16);
  for (var b = 0; b < 16; b++) {
    a[b] = e[b] ^ 909522486;
    d[b] = e[b] ^ 1549556828;
  }
  var g = core_md5(a.concat(str2binl(f)), 512 + f.length * chrsz);
  return core_md5(d.concat(g), 512 + 128);
}
function safe_add(a, d) {
  var c = (a & 65535) + (d & 65535);
  var b = (a >> 16) + (d >> 16) + (c >> 16);
  return (b << 16) | (c & 65535);
}
function bit_rol(a, b) {
  return (a << b) | (a >>> (32 - b));
}
function str2binl(d) {
  var c = Array();
  var a = (1 << chrsz) - 1;
  for (var b = 0; b < d.length * chrsz; b += chrsz) {
    c[b >> 5] |= (d.charCodeAt(b / chrsz) & a) << b % 32;
  }
  return c;
}
function binl2str(c) {
  var d = "";
  var a = (1 << chrsz) - 1;
  for (var b = 0; b < c.length * 32; b += chrsz) {
    d += String.fromCharCode((c[b >> 5] >>> b % 32) & a);
  }
  return d;
}
function binl2hex(c) {
  var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var d = "";
  for (var a = 0; a < c.length * 4; a++) {
    d +=
      b.charAt((c[a >> 2] >> ((a % 4) * 8 + 4)) & 15) +
      b.charAt((c[a >> 2] >> ((a % 4) * 8)) & 15);
  }
  return d;
}
function binl2b64(d) {
  var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var f = "";
  for (var b = 0; b < d.length * 4; b += 3) {
    var e =
      (((d[b >> 2] >> (8 * (b % 4))) & 255) << 16) |
      (((d[(b + 1) >> 2] >> (8 * ((b + 1) % 4))) & 255) << 8) |
      ((d[(b + 2) >> 2] >> (8 * ((b + 2) % 4))) & 255);
    for (var a = 0; a < 4; a++) {
      if (b * 8 + a * 6 > d.length * 32) {
        f += b64pad;
      } else {
        f += c.charAt((e >> (6 * (3 - a))) & 63);
      }
    }
  }
  return f;
}

/**
 * 功能描述：
 * 签名算法举例：
 * 【参数为f=hello，b=world，a=my,
 * 秘钥为：123456，
 * 排序后为，a=my,b=world,f=hello,
 * 最终需要加密的字符串为myworldhello123456，
 * 最后MD5加密字符串myworldhello123456，
 * 得到签名sign】
 * 假设传入的情况
 * 是数组,返回数组按字母顺序升序
 * 秘钥（signSecret）: 1566283171583
 * @author ymj
 * @function  [getObjectKey] 得到对象得属性
 * @parames [strArr]
 * @mainFunction [getSign]
 * */

//let signSecret = "1566283171583";//秘钥
const getObjectKey = obj => {
  return Object.keys(obj);
};
/*
 * 功能描述：输入数组，按照首字母排序，升序
 * 冒泡排序
 * */
const getKeySort = strArr => {
  var count = 0;
  var compareInt = 0;
  for (var i = 0; i < strArr.length; i++) {
    for (var j = 0; j < strArr.length - 1 - i; j++) {
      /*if(strArr [j].substring(0,1) > strArr[j + 1].substring(0,1)){
        var temp = strArr[j + 1];
        strArr[j + 1] = strArr[j];
        strArr[j] = temp;
      }
      if(strArr [j].substring(0,1) == strArr[j + 1].substring(0,1)){
        if(strArr [j].substring(1,2) > strArr[j + 1].substring(1,2)){
          var temp = strArr[j + 1];
          strArr[j + 1] = strArr[j];
          strArr[j] = temp;
        }
      }*/
      compareToIndexValue(strArr, compareInt, j);
      count++;
    }
  }
  /*console.log("遍历次数:"+count);*/
  /*console.log(strArr);*/
  return strArr;
};
/**
 *  根据首字母 排序,如果首字母相同则根据第二个字母排序...直到排出大小
 */
function compareToIndexValue(arr, int, arrIndex) {
  if (
    arr[arrIndex].substring(int, int + 1) ==
    arr[arrIndex + 1].substring(int, int + 1)
  ) {
    compareToIndexValue(arr, int + 1, arrIndex); //如果第一位相等,则继续比较第二个字符
  } else if (
    arr[arrIndex].substring(int, int + 1) >
    arr[arrIndex + 1].substring(int, int + 1)
  ) {
    var temp = arr[arrIndex + 1];
    arr[arrIndex + 1] = arr[arrIndex];
    arr[arrIndex] = temp;
  } /*else if(arr[arrIndex].substring(int,int+1) < arr[arrIndex + 1].substring(int,int+1)) return;*/
  return;
}
/**
 * 输入排序过后的key=value 值数组
 */
function getKeyValueSortStr(oldArr, strArr) {
  var longStr = "";
  for (var str in strArr) {
    longStr += strArr[str] + oldArr[strArr[str]];
  }
  return longStr;
}
// console.log(getObjectKey(sing))
// console.log(getKeySort(getObjectKey(sing)))
// console.log(getKeyValueSortStr(sing,getKeySort(getObjectKey(sing)))+signSecret)

// var str = getKeyValueSortStr(sing,getKeySort(getObjectKey(sing)))+signSecret
// console.log(binl2hex(core_md5(str2binl(str),str.length*chrsz)).toUpperCase())

export const getSign = obj => {
  let strObj =
    getKeyValueSortStr(obj, getKeySort(getObjectKey(obj))) +
    signConfig.signSecret;
  return binl2hex(
    core_md5(str2binl(strObj), strObj.length * chrsz)
  ).toUpperCase();
};

/*
 *功能：修改时间格式
 *【function】 format
 *@params [paramTime] 时间 字符串
 */
export const format = paramTime => {
  if (!paramTime) {
    return "";
  }
  let d = new Date(paramTime);
  let youWant, yue, date;
  //youWant=d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  d.getMonth() + 1 >= 10
    ? (yue = d.getMonth() + 1)
    : (yue = "0" + (d.getMonth() + 1));
  d.getDate() >= 10 ? (date = d.getDate()) : (date = "0" + d.getDate());
  // return youWant=d.getFullYear() + '/' + yue + '/' + date;
  return (youWant = d.getFullYear() + "/" + yue + "/" + date + " ");
};
/*
 * 高级搜索 时间格式
 */
export const format2 = paramTime => {
  if (!paramTime) {
    return "";
  }
  let d = new Date(paramTime);
  let youWant, yue, date;
  //youWant=d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
  d.getMonth() + 1 >= 10
    ? (yue = d.getMonth() + 1)
    : (yue = "0" + (d.getMonth() + 1));
  d.getDate() >= 10 ? (date = d.getDate()) : (date = "0" + d.getDate());
  // return youWant=d.getFullYear() + '/' + yue + '/' + date;
  return (youWant = d.getFullYear() + "-" + yue + "-" + date + " ");
};

export const formatter = time => {
  var date = "";
  if (time) {
    let dataee = new Date(time).toJSON();
    date = new Date(+new Date(dataee) + 8 * 3600 * 1000)
      .toISOString()
      .replace(/T/g, " ")
      .replace(/\.[\d]{3}Z/, "");
  }
  return date;
};

export const activeH = () => {
  var secondValue = JSON.parse(sessionStorage.getItem("tmpDataSecond"));
  var nodeChilds = document.getElementsByClassName("number");
  for (var i = 0; i < nodeChilds.length; i++) {
    if (nodeChilds[i].classList.contains("active")) {
      nodeChilds[i].classList.remove("active");
    }
    if (Number(nodeChilds[i].innerHTML) == secondValue.page) {
      nodeChilds[i].classList.add("active");
    }
  }
  this.page = secondValue.page;
  document.getElementsByClassName(
    "tmpMonitor-pagination"
  )[0].childNodes[3].childNodes[1].childNodes[1].value = this.page;
};

export const formatDateTime = date => {
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
};

export const getCurrentMonthFirst = () => {
  var timeFormat = [];
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  timeFormat.push(date.getFullYear() + "-" + month + "-" + day);

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = new Date(year, month, 0);
  timeFormat.push(year + "-" + month + "-" + day.getDate());
  return timeFormat;
};
