"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noValue = noValue;
exports.blank = blank;
exports.blankNull = blankNull;
exports.same = same;
exports.snapShot = snapShot;
exports.uid18 = uid18;
exports.upperCase0 = upperCase0;
exports.stopRun = exports.localBaseUrl = exports.errorLog = void 0;

/*
 空值检查函数
 */
function noValue(value) {
  return value === null || value === undefined;
}
/*
 默认函数系列
 */


function blank() {}

function blankNull() {
  return null;
}

function same(a) {
  return a;
}
/*
 错误警告
*/


let errorLog = blank;
exports.errorLog = errorLog;
let console = (global || {}).console;

if (process && process.env && process.env.NODE_ENV === 'development' && console && typeof console.error === 'function') {
  exports.errorLog = errorLog = function errorLog() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    console.error('【naraku-WARING】:', ...args);
  };
}

/*
  数据快照 
*/
function snapShot(data) {
  if (noValue(data) || typeof data !== 'object') {
    return data;
  }

  return JSON.parse(JSON.stringify(data));
}
/*
  18位统一Id
*/


let idIndex = 1;
let idBase = Math.random() * 10e18;

function uid18() {
  return idBase + idIndex++;
}
/*
 当前URL
 */


const localBaseUrl = (() => {
  let _ref = global.location || {},
      _ref$protocol = _ref.protocol,
      protocol = _ref$protocol === void 0 ? '' : _ref$protocol,
      _ref$hostname = _ref.hostname,
      hostname = _ref$hostname === void 0 ? '' : _ref$hostname,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? '' : _ref$port;

  return "".concat(protocol, "//").concat(hostname).concat(port ? ':' + port : '');
})();

exports.localBaseUrl = localBaseUrl;

/*
 停止运行标记
 */
const stopRun = Math.random() * 10e6;
exports.stopRun = stopRun;

/*
 首字母大写
 */
function upperCase0() {
  let text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "".concat(text).replace(/^[a-z]{1}/, a => a.toUpperCase());
}