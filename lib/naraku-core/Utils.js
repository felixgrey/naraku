"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noValue = noValue;
exports.Blank = Blank;
exports.snapshot = snapshot;
exports.uid18 = uid18;
exports.upperCase0 = upperCase0;
exports.paramToQuery = paramToQuery;
exports.NumberFormat = exports.stopRun = exports.localBaseUrl = exports.errorLog = exports.blank = exports.same = exports.blankNull = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable */

/*
 空值检查函数
 */
function noValue(value) {
  return value === null || value === undefined;
}
/*
 默认函数系列
 */


function Blank() {}

var blank = Blank;
exports.blank = blank;

var blankNull = function blankNull() {
  return null;
};

exports.blankNull = blankNull;

var same = function same(a) {
  return a;
};

exports.same = same;

/*
 错误警告
*/
var errorLog = blank;
exports.errorLog = errorLog;
var console = (global || {}).console;

if (process && process.env && process.env.NODE_ENV === 'development' && console && typeof console.error === 'function') {
  exports.errorLog = errorLog = function errorLog() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    console.error.apply(console, ['【naraku-WARING】:'].concat(args));
  };
}

/*
  数据快照 
*/
function snapshot(data) {
  if (noValue(data) || _typeof(data) !== 'object') {
    return data;
  }

  return JSON.parse(JSON.stringify(data));
}
/*
  18位统一Id
*/


var idIndex = 1;
var idBase = Math.random() * 10e18;

function uid18() {
  return idBase + idIndex++;
}
/*
 当前URL
 */


var localBaseUrl = function () {
  var _ref = global.location || {},
      _ref$protocol = _ref.protocol,
      protocol = _ref$protocol === void 0 ? '' : _ref$protocol,
      _ref$hostname = _ref.hostname,
      hostname = _ref$hostname === void 0 ? '' : _ref$hostname,
      _ref$port = _ref.port,
      port = _ref$port === void 0 ? '' : _ref$port;

  return "".concat(protocol, "//").concat(hostname).concat(port ? ':' + port : '');
}();

exports.localBaseUrl = localBaseUrl;

/*
 停止运行标记
 */
var stopRun = 'stop-' + Math.random() * 10e6 + '-' + Math.random() * 10e6;
exports.stopRun = stopRun;

/*
 首字母大写
 */
function upperCase0() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "".concat(text).replace(/^[a-z]{1}/, function (a) {
    return a.toUpperCase();
  });
}

/*
  数字格式化
 */
var NumberFormat = {
  percent: function percent(number) {
    var extendParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _extendParam$fixed = extendParam.fixed,
        fixed = _extendParam$fixed === void 0 ? 2 : _extendParam$fixed,
        _extendParam$forceFix = extendParam.forceFixed,
        forceFixed = _extendParam$forceFix === void 0 ? false : _extendParam$forceFix,
        _extendParam$decimal = extendParam.decimal,
        decimal = _extendParam$decimal === void 0 ? true : _extendParam$decimal,
        _extendParam$noSymbol = extendParam.noSymbol,
        noSymbol = _extendParam$noSymbol === void 0 ? false : _extendParam$noSymbol,
        _extendParam$noZero = extendParam.noZero,
        noZero = _extendParam$noZero === void 0 ? false : _extendParam$noZero,
        _extendParam$blank = extendParam.blank,
        blank = _extendParam$blank === void 0 ? '--' : _extendParam$blank;
    var percentSymbol = noSymbol ? '' : '%';

    if (noValue(number) || isNaN(+number)) {
      return blank;
    }

    number = new Number(number * (decimal ? 100 : 1)).toFixed(fixed);

    if (!forceFixed) {
      number = number.replace(/(\.\d*?)[0]*$/g, function (a, b) {
        return b.replace(/\.$/g, '');
      });
    }

    if (noZero) {
      number = number.replace(/^0\./g, '.');
    }

    return number + percentSymbol;
  },
  thsepar: function thsepar(number) {
    var extendParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _extendParam$fixed2 = extendParam.fixed,
        fixed = _extendParam$fixed2 === void 0 ? 2 : _extendParam$fixed2,
        _extendParam$forceFix2 = extendParam.forceFixed,
        forceFixed = _extendParam$forceFix2 === void 0 ? false : _extendParam$forceFix2,
        _extendParam$noZero2 = extendParam.noZero,
        noZero = _extendParam$noZero2 === void 0 ? false : _extendParam$noZero2,
        _extendParam$blank2 = extendParam.blank,
        blank = _extendParam$blank2 === void 0 ? '--' : _extendParam$blank2;

    if (noValue(number) || isNaN(+number)) {
      return blank;
    }

    var number2 = parseInt(number);
    var decimal = number - number2;

    if (isNaN(number2) || isNaN(decimal)) {
      return blank;
    }

    number2 = Array.from("".concat(number2)).reverse().map(function (c, index) {
      return index % 3 === 0 ? c + ',' : c;
    }).reverse().join('').replace(/,$/g, '');

    if (decimal) {
      number2 = number2 + new Number(decimal).toFixed(fixed).replace('0.', '.');
    }

    if (!forceFixed) {
      number2 = number2.replace(/(\.\d*?)[0]*$/g, function (a, b) {
        return b.replace(/\.$/g, '');
      });
    } else {
      if (!decimal) {
        number2 = new Number(number).toFixed(fixed);
      }
    }

    if (noZero) {
      number2 = number2.replace(/^0\./g, '.');
    }

    return number2;
  }
};
exports.NumberFormat = NumberFormat;

/*
  参数到query 
*/
function paramToQuery() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  url = url.split('#');
  var query = [];

  for (var q in param) {
    var v = param[q];

    if (!noValue(v)) {
      query.push("".concat(q, "=").concat(encodeURIComponent(v)));
    }
  }

  query = (url[0].indexOf('?') === -1 ? '?' : '&') + query.join('&') + (url.length > 1 ? '#' : '');
  url.splice(1, 0, query);
  return url.join('');
}