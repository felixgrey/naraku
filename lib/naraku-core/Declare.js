"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceKeyWords = replaceKeyWords;
exports.reducKeyWords = reducKeyWords;
exports.compile = compile;

var _Utils = require("./Utils.js");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
用于定义DSL。

属性实体: 名称[@后缀1[~值]@后缀2...]。
实体：[名称属性实体]=[值属性实体]。
语句：定义实体:[[主语实体1,主语实体2...][=>[宾语实体1,宾语实体2...]]]。
语言：[语言#][语句1;语句2;...]。

返回值结构 {
  languages // 语言实体
  statements // 语句实体
}

statement结构 {
  declareEntities // 定义实体
  subjectEntities // 主语实体
  objectEntities // 宾语实体
}

entity结构 {
  name // 实体名称
  nameAttribute // 实体名称属性
  value // 实体值
  valueAttribute //实体值属性
}

*/
function nullIfBlank(value) {
  if ((0, _Utils.noValue)(value)) {
    return null;
  }

  if (typeof value === 'string') {
    return value.trim() === '' ? null : value;
  }

  if (Array.isArray(value)) {
    var length = value.filter(function (v) {
      return nullIfBlank(v) !== null;
    }).length;
    return !length ? null : value;
  }

  if (_typeof(value) === 'object') {
    return !Object.keys(value).length ? null : value;
  }

  return value;
}

function toKeyValue(sourceCode, marker) {
  var blank0Able = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  sourceCode = nullIfBlank(sourceCode);
  marker = nullIfBlank(marker);

  if (sourceCode === null || marker === null) {
    return [null, null];
  }

  if (sourceCode.indexOf(marker) === -1) {
    if (blank0Able) {
      return [null, sourceCode];
    }

    return [sourceCode, null];
  }

  var _sourceCode$split = sourceCode.split(marker),
      _sourceCode$split2 = _slicedToArray(_sourceCode$split, 2),
      v1 = _sourceCode$split2[0],
      v2 = _sourceCode$split2[1];

  v1 = nullIfBlank(v1);
  v2 = nullIfBlank(v2);

  if (v1 === null && blank0Able) {
    return [v2, null];
  }

  return [v1, v2];
}

function toList() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var marker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ',';
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (nullIfBlank(sourceCode) === null) {
    return [];
  }

  var sourceList = sourceCode.split(marker).map(function (v) {
    return v.trim();
  });
  return filter ? sourceList.filter(function (v) {
    return nullIfBlank(v) !== null;
  }) : sourceList;
}

function toOneAttribute() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (nullIfBlank(sourceCode) === null) {
    return [null, null];
  }

  var _toKeyValue = toKeyValue(sourceCode, '~'),
      _toKeyValue2 = _slicedToArray(_toKeyValue, 2),
      key = _toKeyValue2[0],
      value = _toKeyValue2[1];

  var noKey = key === null ? true : false;
  var not = !noKey && key.charAt(0) === '!';
  key = noKey ? null : not ? key.replace('!', '') : key;

  if (nullIfBlank(key) === null) {
    (0, _Utils.errorLog)('no attribute key:' + sourceCode);
    return [null, null];
  }

  value = value === null ? not ? false : true : value;
  return [key, value];
}

function toAttribute() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (nullIfBlank(sourceCode) === null) {
    return [null, null];
  }

  var _toList = toList(sourceCode, '@', false),
      _toList2 = _toArray(_toList),
      name = _toList2[0],
      attrList = _toList2.slice(1);

  var attributeObj = {};
  attrList.forEach(function (attrSource) {
    var _toOneAttribute = toOneAttribute(attrSource),
        _toOneAttribute2 = _slicedToArray(_toOneAttribute, 2),
        key = _toOneAttribute2[0],
        value = _toOneAttribute2[1];

    nullIfBlank(key) !== null && (attributeObj[key] = nullIfBlank(value));
  });
  return [name, nullIfBlank(attributeObj)];
}

var unShowChars = ["\uE000", "\uE001", "\uE002", "\uE003", "\uE004", "\uE005", "\uE006", "\uE007", "\uE008", "\uE009", "\uE010", "\uE011", "\uE012", "\uE013", "\uE014", "\uE015", "\uE016", "\uE017", "\uE018", "\uE019", "\uE020", "\uE021", "\uE022", "\uE023", "\uE014", "\uE025", "\uE026", "\uE027", "\uE028", "\uE029"];
var keyWords = ["#", ";", ":", ",", "=", "@", "~", "|", "&"];

function replaceKeyWords(sourceCode) {
  keyWords.forEach(function (word, index) {
    sourceCode = sourceCode.replace(new RegExp('&\\' + word, 'g'), unShowChars[index]);
  });
  return sourceCode;
}

function reducKeyWords(str) {
  unShowChars.forEach(function (code, index) {
    str = str.replace(new RegExp(code, 'g'), keyWords[index]);
  });
  return str;
}

function specialValue(value, valueAttribute) {
  var _ref = valueAttribute || {},
      number = _ref.number,
      int = _ref.int,
      float = _ref.float,
      boolean = _ref.boolean,
      string = _ref.string,
      json = _ref.json;

  if (!string) {
    if (value === '$undefined') {
      return undefined;
    } else if (value === '$null') {
      return null;
    } else if (value === '$blank') {
      return '';
    } else if (value === '$true') {
      return true;
    } else if (value === '$false') {
      return false;
    } else if (/^\$space(\d*)$/g.test(value)) {
      var repeat = 1;
      (value + '').replace(/^\$space(\d*)$/g, function (a, num) {
        repeat = +num;
      });
      return new Array(repeat + 1).join(' ');
    }
  }

  if (number) {
    return +value;
  } else if (int) {
    return parseInt(value);
  } else if (float) {
    return parseFloat(value);
  } else if (boolean) {
    return !!value;
  } else if (string) {
    return reducKeyWords(value + '');
  } else if (json) {
    return JSON.parse(reducKeyWords(value + ''));
  }

  return value;
}

function compileValue(value, valueAttribute) {
  if (typeof value === 'string' && value.indexOf('|') !== -1) {
    value = value.split('|').filter(function (v) {
      return v.trim() !== '';
    }).map(function (v) {
      return specialValue(v, valueAttribute);
    });
  }

  if (!Array.isArray(value)) {
    value = specialValue(value, valueAttribute);
  }

  return value;
}

function toEntity() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var nvlNameAble = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (nullIfBlank(sourceCode) === null) {
    return null;
  }

  var entityList = toList(sourceCode, ',').map(function (sourcePart) {
    var _toKeyValue3 = toKeyValue(sourcePart, '='),
        _toKeyValue4 = _slicedToArray(_toKeyValue3, 2),
        keySource = _toKeyValue4[0],
        valueSource = _toKeyValue4[1];

    var _toAttribute = toAttribute(keySource),
        _toAttribute2 = _slicedToArray(_toAttribute, 2),
        name = _toAttribute2[0],
        nameAttribute = _toAttribute2[1];

    if (nullIfBlank(name) === null && !nvlNameAble) {
      (0, _Utils.errorLog)('no entity key:' + sourcePart);
      return null;
    }

    var _toAttribute3 = toAttribute(valueSource),
        _toAttribute4 = _slicedToArray(_toAttribute3, 2),
        value = _toAttribute4[0],
        valueAttribute = _toAttribute4[1];

    value = compileValue(value, valueAttribute);
    nameAttribute = nameAttribute === null ? {} : nameAttribute;
    valueAttribute = valueAttribute === null ? {} : valueAttribute;

    for (var attr in nameAttribute) {
      nameAttribute[attr] = compileValue(nameAttribute[attr], {});
    }

    for (var _attr in valueAttribute) {
      valueAttribute[_attr] = compileValue(valueAttribute[_attr], {});
    }

    return {
      name: name,
      nameAttribute: nameAttribute,
      value: value,
      valueAttribute: valueAttribute
    };
  }).filter(function (v) {
    return nullIfBlank(v) !== null;
  });
  return entityList;
}

function compile() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  sourceCode = sourceCode.replace(/={4,}/g, '====');
  var sourceCodeList = sourceCode.split('====').filter(function (a) {
    return a.trim() !== '';
  });
  var compiled = sourceCodeList.map(function (_sourceCode) {
    return _compile(_sourceCode);
  });

  if (compiled.length === 1) {
    return compiled[0];
  }

  return compiled;
}

function _compile() {
  var sourceCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  sourceCode = replaceKeyWords(sourceCode.replace(/\n|\t/g, ' '));

  var _toKeyValue5 = toKeyValue(sourceCode, '#', true),
      _toKeyValue6 = _slicedToArray(_toKeyValue5, 2),
      languageSource = _toKeyValue6[0],
      statementsSource = _toKeyValue6[1];

  var statements = toList(statementsSource, ';').map(function (staSource) {
    var _toKeyValue7 = toKeyValue(staSource, '=>'),
        _toKeyValue8 = _slicedToArray(_toKeyValue7, 2),
        d_sSource = _toKeyValue8[0],
        objectSource = _toKeyValue8[1];

    var _toKeyValue9 = toKeyValue(d_sSource, ':'),
        _toKeyValue10 = _slicedToArray(_toKeyValue9, 2),
        declareSource = _toKeyValue10[0],
        subjectSource = _toKeyValue10[1];

    var declareEntities = toEntity(declareSource);

    if (nullIfBlank(declareEntities) === null) {
      (0, _Utils.errorLog)('no declare:' + staSource);
      return null;
    }

    return {
      declareEntities: declareEntities || [],
      subjectEntities: toEntity(subjectSource) || [],
      objectEntities: toEntity(objectSource) || []
    };
  }).filter(function (v) {
    return nullIfBlank(v) !== null;
  });
  return {
    languages: toEntity(languageSource, true) || [],
    statements: statements || []
  };
}

function destruct(data) {
  if (nullIfBlank(data) === null) {
    return null;
  }

  if (_typeof(data) === 'object') {
    if (Array.isArray(data)) {
      return data.length <= 1 ? destruct(data[0]) : data.map(function (item) {
        return destruct(item);
      });
    }

    var data2 = {};
    Object.keys(data).forEach(function (key) {
      nullIfBlank(data[key]) !== null && (data2[key] = destruct(data[key]));
    });
    var keyLength = Object.keys(data2).length;

    if (keyLength === 1 && nullIfBlank(data2.name) !== null) {
      return data2.name;
    }

    return nullIfBlank(data2);
  }

  return data;
}

compile.destruct = destruct;