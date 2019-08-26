"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traceObject = traceObject;
exports.refReturn = refReturn;
exports.$Transform = $Transform;
exports.TransformProcess = exports.DataSetTransformer = exports.DataMap = exports.aggregates = void 0;

var _Utils = require("./Utils.js");

var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _seriesName = Math.random() * 10e6;
/*
 预定义的聚合函数
 */


var _aggregates = {
  // 求和
  'sum': function sum(_ref) {
    var field = _ref.field,
        value = _ref.value,
        item = _ref.item,
        defaultValue = _ref.defaultValue;
    var currentValue = (0, _Utils.noValue)(value) ? defaultValue : value;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    itemValue = +itemValue;
    return currentValue + itemValue;
  },
  // 平均值
  'aver': function aver(_ref2) {
    var field = _ref2.field,
        item = _ref2.item,
        defaultValue = _ref2.defaultValue,
        keyCounts = _ref2.keyCounts,
        data = _ref2.data;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    itemValue = +itemValue;
    var tempValueKey = "_currentSumValue.".concat(field);

    if (data[tempValueKey] === undefined) {
      data[tempValueKey] = defaultValue;
    }

    return (data[tempValueKey] += +itemValue) / (keyCounts + 1);
  },
  // 中位数
  'median': function median(_ref3) {
    var field = _ref3.field,
        item = _ref3.item,
        defaultValue = _ref3.defaultValue,
        keyCounts = _ref3.keyCounts,
        data = _ref3.data;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    itemValue = +itemValue;
    var tempValueKey = "_currentMedianValue.".concat(field);

    if (data[tempValueKey] === undefined) {
      data[tempValueKey] = [];
    }

    data[tempValueKey].push(+itemValue);
    data[tempValueKey].sort();

    var _keyCounts = keyCounts + 1;

    if (_keyCounts % 2) {
      return data[tempValueKey][(_keyCounts - 1) / 2];
    } else {
      var medIndex = _keyCounts / 2;
      var a = data[tempValueKey][medIndex];
      var b = data[tempValueKey][medIndex - 1];
      return (a + b) / 2;
    }
  },
  // 最大值
  'max': function max(_ref4) {
    var field = _ref4.field,
        value = _ref4.value,
        item = _ref4.item,
        defaultValue = _ref4.defaultValue;
    var currentValue = (0, _Utils.noValue)(value) ? -Infinity : value;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    itemValue = +itemValue;
    return currentValue > itemValue ? currentValue : itemValue;
  },
  // 最小值  
  'min': function min(_ref5) {
    var field = _ref5.field,
        value = _ref5.value,
        item = _ref5.item,
        defaultValue = _ref5.defaultValue;
    var currentValue = (0, _Utils.noValue)(value) ? Infinity : value;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    itemValue = +itemValue;
    return currentValue < itemValue ? currentValue : itemValue;
  },
  // 聚合条数
  'count': function count(_ref6) {
    var keyCounts = _ref6.keyCounts;
    return keyCounts + 1;
  },
  // 字符串连接
  'join': function join(_ref7) {
    var field = _ref7.field,
        value = _ref7.value,
        item = _ref7.item,
        option = _ref7.option,
        keyCounts = _ref7.keyCounts,
        defaultText = _ref7.defaultText;
    var itemValue = (0, _Utils.noValue)(item[field]) ? defaultText : item[field];
    itemValue = '' + itemValue;
    return keyCounts === 0 ? "".concat(itemValue) : "".concat(value).concat(option.$split || ',').concat(itemValue);
  },
  // 原始数据数组
  'origin': function origin(_ref8) {
    var value = _ref8.value,
        item = _ref8.item;
    value = value || [];
    value.push(item);
    return value;
  }
};

var aggregates = _objectSpread({}, _aggregates);
/*
  树形数据结构，fieldName为分组字段值，为空表示是叶子节点
 */


exports.aggregates = aggregates;

var DataMap =
/*#__PURE__*/
function (_Map) {
  _inherits(DataMap, _Map);

  function DataMap(initData) {
    var _this;

    var fieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, DataMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataMap).call(this, initData));
    _this.fieldName = fieldName;
    _this._keyCount = {};
    return _this;
  }
  /*
    set时记录同一个key被set的次数
   */


  _createClass(DataMap, [{
    key: "set",
    value: function set(key, value) {
      if (this._keyCount[key] === undefined) {
        this._keyCount[key] = 0;
      }

      this._keyCount[key]++;

      _get(_getPrototypeOf(DataMap.prototype), "set", this).call(this, key, value);
    }
    /*
       取得同一个key被set的次数
     */

  }, {
    key: "keyCounts",
    value: function keyCounts(key) {
      return this._keyCount[key] || 0;
    }
    /*
       转成普通的Objec
     */

  }, {
    key: "toObject",
    value: function toObject() {
      var obj = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          obj[key] = value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return obj;
    }
    /*
       遍历数据并转为对象数组格式
    */

  }, {
    key: "toObjectInArray",
    value: function toObjectInArray() {
      var _this2 = this;

      var _param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        _list: [],
        _item: {}
      };

      var _list = _param._list,
          _item = _param._item;
      var keys = Array.from(this.keys());

      if (this.fieldName === null) {
        keys.forEach(function (key) {
          _item[key] = _this2.get(key);
        });

        _list.push(_item);
      } else {
        keys.forEach(function (key) {
          _item[_this2.fieldName] = key;
          _param._item = _objectSpread({}, _item);
          (_this2.get(key) || new DataMap()).toObjectInArray(_param);
        });
      }

      return _param._list;
    }
  }]);

  return DataMap;
}(_wrapNativeSuper(Map));
/*
 将object转为DataMap
 */


exports.DataMap = DataMap;

function traceObj() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _dataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new DataMap();

  for (var key in obj) {
    var value = obj[key];

    if (_typeof(value) === 'object' && !Array.isArray(value)) {
      traceObj(value, _dataMap);
    } else {
      _dataMap.set(key, value);
    }
  }

  return _dataMap;
}

DataMap.fromObject = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return traceObj(obj);
};
/* 树到自连接关系 */


function treeToRelation(source) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _extend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _config$keyField = config.keyField,
      keyField = _config$keyField === void 0 ? 'id' : _config$keyField,
      _config$parentKeyFiel = config.parentKeyField,
      parentKeyField = _config$parentKeyFiel === void 0 ? 'pid' : _config$parentKeyFiel,
      _config$childrenField = config.childrenField,
      childrenField = _config$childrenField === void 0 ? 'children' : _config$childrenField,
      _config$rootParentKey = config.rootParentKeyValue,
      rootParentKeyValue = _config$rootParentKey === void 0 ? null : _config$rootParentKey,
      _config$leafField = config.leafField,
      leafField = _config$leafField === void 0 ? '_leaf' : _config$leafField,
      _config$rootField = config.rootField,
      rootField = _config$rootField === void 0 ? '_root' : _config$rootField,
      _config$changeSource = config.changeSource,
      changeSource = _config$changeSource === void 0 ? true : _config$changeSource,
      _config$trace = config.trace,
      trace = _config$trace === void 0 ? function () {} : _config$trace;

  var _extend$_pKey = _extend._pKey,
      _pKey = _extend$_pKey === void 0 ? null : _extend$_pKey,
      _extend$_list = _extend._list,
      _list = _extend$_list === void 0 ? [] : _extend$_list,
      _extend$_trace = _extend._trace,
      _trace = _extend$_trace === void 0 ? [] : _extend$_trace,
      _extend$_refs = _extend._refs,
      _refs = _extend$_refs === void 0 ? {
    leaves: [],
    roots: []
  } : _extend$_refs,
      _markerLeaf = _extend._markerLeaf,
      _markerRoot = _extend._markerRoot,
      _extend$_getItem = _extend._getItem,
      _getItem = _extend$_getItem === void 0 ? changeSource ? function (a) {
    return a;
  } : function (a) {
    return JSON.parse(JSON.stringify(a));
  } : _extend$_getItem;

  if (!_markerLeaf) {
    if (leafField !== false) {
      _markerLeaf = function _markerLeaf(item) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        item[leafField] = flag;
        flag && _refs.leaves.push(item);
      };
    } else {
      _markerLeaf = function _markerLeaf() {};
    }
  }

  if (!_markerRoot) {
    if (rootField !== false) {
      _markerRoot = function _markerRoot(item) {
        var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        item[rootField] = flag;
        flag && _refs.roots.push(item);
      };
    } else {
      _markerRoot = function _markerRoot() {};
    }
  }

  source.forEach(function (originItem) {
    var item = _getItem(originItem);

    var chlidren = originItem[childrenField] || [];
    item[parentKeyField] = _pKey === null ? rootParentKeyValue : _pKey;
    var isLeaf = !chlidren.length;

    _markerLeaf(item, isLeaf);

    var isRoot = (0, _Utils.noValue)(_pKey);

    _markerRoot(item, isRoot);

    if (isRoot) {
      _trace = [item];
    } else {
      _trace.push(item);
    }

    trace(_trace, item, originItem);
    delete item[childrenField];

    _list.push(item);

    return treeToRelation(chlidren, config, {
      _pKey: item[keyField],
      _trace: _trace,
      _list: _list,
      _refs: _refs,
      _markerLeaf: _markerLeaf,
      _markerRoot: _markerRoot
    });
  });
  return {
    data: _list,
    refs: _refs
  };
}
/*
  用于做聚合操作的数据集
 */


var DataSetTransformer =
/*#__PURE__*/
function () {
  function DataSetTransformer() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, DataSetTransformer);

    this._init(config);
  }

  _createClass(DataSetTransformer, [{
    key: "_init",
    value: function _init(config) {
      var _this3 = this;

      var _config$dataSource = config.dataSource,
          dataSource = _config$dataSource === void 0 ? [] : _config$dataSource,
          _config$groupFields = config.groupFields,
          groupFields = _config$groupFields === void 0 ? [] : _config$groupFields,
          _config$valueFields = config.valueFields,
          valueFields = _config$valueFields === void 0 ? [] : _config$valueFields,
          _config$aggregate = config.aggregate,
          aggregate = _config$aggregate === void 0 ? {} : _config$aggregate,
          _config$option = config.option,
          option = _config$option === void 0 ? {
        // 额外配置
        $defaultValue: 0,
        // 数值默认值
        $defaultText: '',
        // 字符串默认值
        $split: ',' // 字符串连接分隔符

      } : _config$option;
      Object.assign(this, {
        _dataSource: dataSource,
        _groupFields: [].concat(groupFields),
        _valueFields: [].concat(valueFields),
        _defaultValue: option.$defaultValue,
        _defaultText: option.$defaultText,
        _config: config,
        _data: new DataMap(null, groupFields[0]),
        _option: option,
        _currentCount: 0,
        _groupFieldValues: groupFields.map(function () {
          return new Set();
        })
      });
      this._aggregate = {};

      this._valueFields.forEach(function (field) {
        if (typeof aggregate[field] === 'string') {
          aggregate[field] = _aggregates[aggregate[field]];
        }

        _this3._aggregate[field] = aggregate[field] || _aggregates['sum'];
      });

      dataSource.forEach(function (item) {
        return _this3._add(item);
      });
    }
  }, {
    key: "_add",
    value: function _add() {
      var _this4 = this;

      var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this._currentCount++;
      var currentData = this._data;

      this._groupFields.forEach(function (groupField, index) {
        if (!currentData.get(item[groupField])) {
          currentData.set(item[groupField], new DataMap(null, _this4._groupFields[index + 1]));
        }

        currentData = currentData.get(item[groupField]);

        _this4._groupFieldValues[index].add(item[groupField]);
      });

      this._valueFields.forEach(function (valueField) {
        var aggregate = _this4._aggregate[valueField];
        var currentValue = aggregate({
          field: valueField,
          value: currentData.get(valueField),
          item: item,
          keyCounts: currentData.keyCounts(valueField),
          option: _this4._option,
          count: _this4._currentCount,
          defaultValue: _this4._defaultValue,
          defaultText: _this4._defaultText,
          data: currentData
        });
        currentData.set(valueField, currentValue);
      });
    }
    /*
         分组后各组值的枚举
     */

  }, {
    key: "getEnums",
    value: function getEnums() {
      var _this5 = this;

      var fields = {};

      this._groupFieldValues.forEach(function (valueSet, index) {
        fields[_this5._groupFields[index]] = Array.from(valueSet);
      });

      return fields;
    }
  }, {
    key: "getData",
    value: function getData() {
      return this._data.toObjectInArray();
    }
  }]);

  return DataSetTransformer;
}();
/*
  解析分组配置字符串
 */


exports.DataSetTransformer = DataSetTransformer;

function groupStrToConfig(config) {
  var _config;

  if (_typeof(config) === 'object') {
    if ((0, _Utils.noValue)(config.group)) {
      return config;
    }

    _config = _objectSpread({
      aggregate: {}
    }, config);
    config = config.group;
  } else {
    _config = {
      aggregate: {}
    };
  }

  var _config$replace$split = config.replace(/^\s+|\s+$/g, '').split('=>'),
      _config$replace$split2 = _slicedToArray(_config$replace$split, 2),
      _config$replace$split3 = _config$replace$split2[0],
      groupFieldStr = _config$replace$split3 === void 0 ? '' : _config$replace$split3,
      _config$replace$split4 = _config$replace$split2[1],
      valueFieldStr = _config$replace$split4 === void 0 ? '' : _config$replace$split4;

  var groupFields = groupFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(function (field) {
    return field.replace(/^\s+|\s+$/g, '');
  });
  var valueFields = valueFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(function (field) {
    field = field.replace(/^\s+|\s+$/g, '');

    var _field$split = field.split(':'),
        _field$split2 = _slicedToArray(_field$split, 2),
        fieldName = _field$split2[0],
        aggregateType = _field$split2[1];

    if (aggregateType && _aggregates[aggregateType]) {
      _config.aggregate[fieldName] = _aggregates[aggregateType];
    }

    return fieldName.replace(/^\s+|\s+$/g, '');
  });
  _config.groupFields = groupFields;
  _config.valueFields = valueFields;
  return _config;
}
/*
 根据字符串遍历objec
 */


function traceObject(item, valuePath) {
  var display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var traceCallback = arguments.length > 3 ? arguments[3] : undefined;

  var _midResult = arguments.length > 4 ? arguments[4] : undefined;

  var countField = arguments.length > 5 ? arguments[5] : undefined;

  var _currentPath = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';

  if ((0, _Utils.noValue)(item) || _typeof(item) !== 'object') {
    return [];
  }

  traceCallback = traceCallback || _Utils.blank;

  if (_currentPath.replace(/^\./g, '') === '') {
    traceCallback('', item, _midResult);
  }

  var surplusFields = valuePath.replace(_currentPath, '').replace(/^\./g, '').split('.');
  var field = surplusFields.shift();

  if (field === undefined) {
    return [];
  }

  _midResult = _midResult || {};
  var fieldValue = item[field];

  if (fieldValue === null) {
    traceCallback(fieldPath, null, null);
    return [null];
  }

  var fieldPath = (_currentPath + '.' + field).replace(/^\./g, '');

  if (Array.isArray(fieldValue) && display) {
    var newMidResultList = [];
    var count = fieldValue.length;
    fieldValue.forEach(function (v, i) {
      var clone = (0, _Utils.snapshot)(_midResult);
      traceCallback(fieldPath, v, clone);
      newMidResultList = newMidResultList.concat(traceObject(v, valuePath, display, traceCallback, clone, countField, fieldPath));
    });
    !(0, _Utils.noValue)(countField) && countField !== false && newMidResultList[0] && (newMidResultList[0][countField.replace('{field}', field)] = count);
    return newMidResultList;
  }

  if (_typeof(fieldValue) === 'object' && surplusFields.length) {
    traceCallback(fieldPath, fieldValue, _midResult);
    return traceObject(fieldValue, valuePath, display, traceCallback, _midResult, countField, fieldPath);
  }

  _midResult[field] = fieldValue;
  return [_midResult];
}

var myMethods = [];
/*
  添加反射信息，并返回新TransformProcess
 */

function refReturn(proto, name, descriptor) {
  myMethods.push(name);
  var oldFun = proto[name];

  descriptor.value = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    oldFun.apply(this, args); //  if (this.useRef) {
    //    this.refs[`${name}Data`] = this.data;
    //  }

    return new TransformProcess(this.data, this.refs, this.useRef);
  };
}
/*
  链式调用转换过程
 */


var TransformProcess = (_class =
/*#__PURE__*/
function () {
  function TransformProcess(source) {
    var initRefs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var useRef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, TransformProcess);

    this.source = source;
    this.data = null;
    this.useRef = useRef;
    this.refs = useRef ? initRefs : {};
  }

  _createClass(TransformProcess, [{
    key: "fromObject",
    value: function fromObject() {
      var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _param$key = param.key,
          key = _param$key === void 0 ? 'key' : _param$key,
          _param$value = param.value,
          value = _param$value === void 0 ? 'value' : _param$value;
      var obj = this.source;
      this.data = Object.keys(obj).map(function (_k) {
        var _ref9;

        return _ref9 = {}, _defineProperty(_ref9, key, _k), _defineProperty(_ref9, value, obj[_k]), _ref9;
      });
    }
  }, {
    key: "operate",
    value: function operate() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a) {
        return a;
      };
      this.data = callback(this.source, this.refs);
    }
  }, {
    key: "map",
    value: function map() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a) {
        return a;
      };
      this.data = [].concat(this.source).map(callback);
    }
  }, {
    key: "filter",
    value: function filter() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a) {
        return a;
      };
      this.data = [].concat(this.source).filter(callback);
    }
  }, {
    key: "fromModel",
    value: function fromModel() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _config$main = config.main,
          main = _config$main === void 0 ? '' : _config$main,
          _config$branch = config.branch,
          branch = _config$branch === void 0 ? [] : _config$branch,
          _config$originField = config.originField,
          originField = _config$originField === void 0 ? '_origin' : _config$originField,
          _config$countField = config.countField,
          countField = _config$countField === void 0 ? '_{field}Count' : _config$countField;
      var list = [].concat(this.source);
      branch = [].concat(branch).map(function (option) {
        var from, to, leaf, set;

        if (typeof option === 'string') {
          from = option;
          to = option.substr(option.lastIndexOf('.') + 1);
          leaf = to;
          set = _Utils.same;
        } else {
          from = option.from;
          leaf = from.substr(from.lastIndexOf('.') + 1);
          to = option.to || leaf;
          set = option.set || _Utils.same;
        }

        return {
          from: from,
          to: to,
          leaf: leaf,
          set: set
        };
      });
      var outPutList = [];
      var fromList = branch.map(function (a) {
        return a.from;
      });
      var buildSeed = originField === false ? function () {
        return {};
      } : function (item) {
        return _defineProperty({}, originField, item);
      };
      list.forEach(function (item) {
        // item, valuePath, display, traceCallback, _midResult, countField, _currentPath
        var expendItems = traceObject(item, main, true, function (fieldPath, v, mid) {
          fromList.forEach(function (from, index) {
            if (from.indexOf(fieldPath) === 0) {
              var field = from.replace(fieldPath, '').replace(/^\./g, '');

              if (field !== '') {
                var _branch$index = branch[index],
                    to = _branch$index.to,
                    leaf = _branch$index.leaf,
                    set = _branch$index.set;

                var _traceObject = traceObject(v, field, false),
                    _traceObject2 = _slicedToArray(_traceObject, 1),
                    value = _traceObject2[0];

                if (!(0, _Utils.noValue)(value) && !(0, _Utils.noValue)(value[leaf])) {
                  mid[to] = set(value[leaf]);
                }
              }
            }

            ;
          });
        }, buildSeed(item), countField);
        outPutList = outPutList.concat(expendItems);
      });
      this.data = outPutList;
    }
  }, {
    key: "fromMatrix",
    value: function fromMatrix() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.source.length) {
        return [];
      }

      var _config$firstIsFileds = config.firstIsFileds,
          firstIsFileds = _config$firstIsFileds === void 0 ? true : _config$firstIsFileds,
          _config$fields = config.fields,
          fields = _config$fields === void 0 ? null : _config$fields,
          _config$byFields = config.byFields,
          byFields = _config$byFields === void 0 ? true : _config$byFields;
      var first = this.source[0];

      if (!fields) {
        if (firstIsFileds) {
          fields = first;
        } else {
          fields = first.map(function (a, i) {
            return i;
          });
        }
      }

      if (firstIsFileds) {
        this.source.shift();
      }

      if (this.source.length && !byFields) {
        var fl = fields.length;
        var sl = this.source[0].length;

        if (fl < sl) {
          for (var i = fl; i < sl; i++) {
            fields.push(i);
          }
        }
      }

      this.data = this.source.map(function (arrItem) {
        var objItem = {};
        fields.forEach(function (field, i) {
          objItem[field] = arrItem[i];
        });
        return objItem;
      });

      if (this.useRef) {
        this.refs.fromMatrixFields = fields;
      }
    }
  }, {
    key: "_toFields",
    value: function _toFields() {
      if (!this.source.length) {
        return [];
      }

      var first = this.source[0];
      return Object.keys(first);
    }
  }, {
    key: "toFields",
    value: function toFields() {
      this.data = this._toFields();
    }
  }, {
    key: "toMatrix",
    value: function toMatrix() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.source.length) {
        return [];
      }

      var _config$firstIsFileds2 = config.firstIsFileds,
          firstIsFileds = _config$firstIsFileds2 === void 0 ? true : _config$firstIsFileds2,
          _config$fields2 = config.fields,
          fields = _config$fields2 === void 0 ? null : _config$fields2;

      if (!fields) {
        fields = this._toFields();
      }

      this.data = this.source.map(function (objItem) {
        return fields.map(function (field) {
          return objItem[field];
        });
      });

      if (firstIsFileds) {
        this.data.splice(0, 0, fields);
      }

      if (this.useRef) {
        this.refs.toMatrixFields = fields;
      }
    }
  }, {
    key: "fromTree",
    value: function fromTree() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _treeToRelation = treeToRelation(this.source, config),
          data = _treeToRelation.data,
          refs = _treeToRelation.refs;

      this.data = data;

      if (this.useRef) {
        this.refs.fromTreeEnums = refs;
      }
    }
  }, {
    key: "traceTree",
    value: function traceTree() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      treeToRelation(this.source, config);
      this.data = this.source;
    }
  }, {
    key: "toTree",
    value: function toTree() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _config$keyField2 = config.keyField,
          keyField = _config$keyField2 === void 0 ? 'id' : _config$keyField2,
          _config$parentKeyFiel2 = config.parentKeyField,
          parentKeyField = _config$parentKeyFiel2 === void 0 ? 'pid' : _config$parentKeyFiel2,
          _config$rootParentKey2 = config.rootParentKeyValue,
          rootParentKeyValue = _config$rootParentKey2 === void 0 ? null : _config$rootParentKey2,
          _config$blankArray = config.blankArray,
          blankArray = _config$blankArray === void 0 ? false : _config$blankArray,
          _config$childrenField2 = config.childrenField,
          childrenField = _config$childrenField2 === void 0 ? 'children' : _config$childrenField2,
          _config$trace2 = config.trace,
          trace = _config$trace2 === void 0 ? null : _config$trace2;
      var rootList = [];
      var tempMap = {};
      var doTrace = trace ? function (item) {
        var _trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _trace.push(item);

        var pkv = item[parentKeyField];

        if ((0, _Utils.noValue)(pkv) || pkv === rootParentKeyValue) {
          trace(_trace.reverse(), item);
          return;
        }

        var parent = tempMap[pkv];

        if (parent) {
          doTrace(parent, _trace);
        }
      } : function () {};

      var getBlankArray = function getBlankArray() {
        return null;
      };

      if (blankArray) {
        getBlankArray = function getBlankArray() {
          return [];
        };
      }

      this.source.forEach(function (item) {
        var pkv = item[parentKeyField];

        if ((0, _Utils.noValue)(pkv) || pkv === rootParentKeyValue) {
          rootList.push(item);
        } else {
          tempMap[item[parentKeyField]] = tempMap[item[parentKeyField]] || [];
          tempMap[item[parentKeyField]].push(item);
        }
      });
      this.source.forEach(function (item) {
        item[childrenField] = tempMap[item[keyField]] || getBlankArray();
        doTrace(item);
      });

      if (this.useRef) {
        this.refs.toTreeChildrenMap = tempMap;
      }

      this.data = rootList;
    }
  }, {
    key: "toGrouped",
    value: function toGrouped() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);
      config.aggregate = config.aggregate || {};
      config.valueFields = config.valueFields || [];

      if (config.originField !== false) {
        if ((0, _Utils.noValue)(config.originField)) {
          config.originField = '_origin';
        }

        config.aggregate = config.aggregate || {};
        config.aggregate[config.originField] = 'origin';
        config.valueFields = [].concat(config.valueFields);
        config.valueFields.push(config.originField);
      }

      config.dataSource = this.source;
      var tf = new DataSetTransformer(config);
      this.data = tf.getData();

      if (this.useRef) {
        //    this.refs.toGroupedDataMap = tf._data;
        this.refs.toGroupedEnums = tf.getEnums();
      }
    }
  }, {
    key: "toSeries",
    value: function toSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);
      this.toGrouped(config);
      var seriesField = config.groupFields[1] || _seriesName;
      var series = new Map();
      this.data.forEach(function (item) {
        if (!series.get(item[seriesField])) {
          series.set(item[seriesField], []);
        }

        series.get(item[seriesField]).push(item);
      });
      this.data = Array.from(series.keys()).map(function (name) {
        return {
          name: name,
          data: series.get(name)
        };
      });
    }
  }, {
    key: "toObject",
    value: function toObject() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var keyField = config.keyField,
          valueField = config.valueField;

      if ((0, _Utils.noValue)(keyField)) {
        throw new Error('toObject need keyField');
      }

      var obj = {};
      var getValue = (0, _Utils.noValue)(valueField) ? function (item) {
        return item;
      } : function (item) {
        return item[valueField];
      };
      var keyList = [];
      this.source.forEach(function (item) {
        keyList.push(item[keyField]);
        obj[item[keyField]] = getValue(item);
      });
      this.data = obj;

      if (this.useRef) {
        this.refs.keyListOfoObject = keyList;
      }
    }
  }, {
    key: "_toXSeries",
    value: function _toXSeries() {
      var _this6 = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var typeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Echarts';
      var getvalue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a) {
        return a;
      };
      config = groupStrToConfig(config);

      if (!this.useRef && !config.xData) {
        throw new Error("to".concat(typeName, "Series need refs or xData."));
      }

      var defaultSeriesName = (0, _Utils.noValue)(config.defaultSeriesName) ? null : config.defaultSeriesName;
      this.toSeries(config);
      var xData = config.xData ? config.xData : this.useRef ? this.refs.toGroupedEnums[config.groupFields[0]] : [];

      var setSeriesMap = function setSeriesMap() {};

      if (this.useRef) {
        this.refs["xDataOf".concat(typeName)] = xData;
        this.refs["itemMapOf".concat(typeName)] = {};

        setSeriesMap = function setSeriesMap(serIndex, dataIndex, item) {
          _this6.refs["itemMapOf".concat(typeName)][serIndex] = _this6.refs["itemMapOf".concat(typeName)][serIndex] || {};
          _this6.refs["itemMapOf".concat(typeName)][serIndex][dataIndex] = item;
        };
      }

      var min = Infinity;
      var max = -Infinity;
      this.data = this.data.map(function (series, serIndex) {
        var tempMap = {};
        series.data.forEach(function (seriesItem) {
          tempMap[seriesItem[config.groupFields[0]]] = seriesItem;
        });
        return {
          name: series.name === undefined ? defaultSeriesName : series.name,
          data: xData.map(function (xValue, dataIndex) {
            var item = tempMap[xValue];

            if (!(0, _Utils.noValue)(item)) {
              setSeriesMap(serIndex, dataIndex, item);
              var value = item[config.valueFields[0]];
              min = value < min ? value : min;
              max = value > max ? value : max;
              return getvalue(item);
            }

            return null;
          })
        };
      });

      if (this.useRef) {
        this.refs["limitValueOf".concat(typeName)] = {
          min: min,
          max: max
        };
      }
    }
  }, {
    key: "toNumSeries",
    value: function toNumSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);

      this._toXSeries(config, 'NumSeries', function (item) {
        return item[config.valueFields[0]];
      });
    }
  }, {
    key: "toPieSeries",
    value: function toPieSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);

      this._toXSeries(config, 'PieSeries', function (item) {
        return {
          name: item[config.groupFields[0]],
          value: item[config.valueFields[0]]
        };
      });

      this.data.forEach(function (series) {
        series.data = series.data.filter(function (item) {
          return item !== null;
        });
      });
    }
  }, {
    key: "toHeatSeries",
    value: function toHeatSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);

      if (!config.groupFields[1]) {
        throw new Error('toHeatSeries must has 2 groupFields');
      }

      this._toXSeries(config, 'HeatSeries', function (item) {
        return [item[config.groupFields[0]], item[config.groupFields[1]], item[config.valueFields[0]]];
      });
    }
  }, {
    key: "toScatterSeries",
    value: function toScatterSeries() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);

      if (!config.groupFields[1]) {
        throw new Error('toScatterSeries must has 2 groupFields');
      }

      this._toXSeries(config, 'ScatterSeries', function (item) {
        var result = [item[config.groupFields[0]], item[config.groupFields[1]]];
        config.valueFields.forEach(function (valueFieldName) {
          result.push(item[valueFieldName]);
        });
        return result;
      });
    }
  }, {
    key: "toRadarSeries",
    value: function toRadarSeries() {
      var _this7 = this;

      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      config = groupStrToConfig(config);
      var maxValueMap = {};

      this._toXSeries(config, 'RadarSeries', function (item) {
        var xValue = item[config.groupFields[0]];
        var value = item[config.valueFields[0]];
        var max = maxValueMap[xValue] = maxValueMap[xValue] || -Infinity;
        maxValueMap[xValue] = value > max ? value : max;
        return value;
      });

      var seriesData = this.data;
      this.data = [{
        name: null,
        data: []
      }];
      seriesData.forEach(function (series) {
        _this7.data[0].data.push({
          name: series.name,
          value: series.data
        });
      });

      if (this.useRef) {
        this.refs.indicatorOfRadarSeries = this.refs.xDataOfRadarSeries.map(function (name) {
          return {
            name: name,
            max: maxValueMap[name] || null
          };
        });
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      return (0, _Utils.noValue)(this.data) ? this.source : this.data;
    }
  }, {
    key: "getRefs",
    value: function getRefs() {
      return this.refs;
    }
  }, {
    key: "output",
    value: function output() {
      return {
        data: this.getData(),
        refs: this.getRefs()
      };
    }
  }]);

  return TransformProcess;
}(), (_applyDecoratedDescriptor(_class.prototype, "fromObject", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromObject"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "operate", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "operate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "map", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "map"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filter", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "filter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromModel", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromModel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromMatrix", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromMatrix"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toFields", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toFields"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toMatrix", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toMatrix"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "traceTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "traceTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toGrouped", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toGrouped"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toObject", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toObject"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toNumSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toNumSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toPieSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toPieSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toHeatSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toHeatSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toScatterSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toScatterSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toRadarSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toRadarSeries"), _class.prototype)), _class);
exports.TransformProcess = TransformProcess;
TransformProcess.fn = TransformProcess.prototype;
TransformProcess.myMethods = myMethods;

function $Transform(source) {
  var useRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return new TransformProcess(source, {//  $TransformOrigin: source
  }, useRef);
}