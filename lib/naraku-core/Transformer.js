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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const _seriesName = Math.random() * 10e6;
/*
 预定义的聚合函数
 */


const _aggregates = {
  // 求和
  'sum': (_ref) => {
    let field = _ref.field,
        value = _ref.value,
        item = _ref.item,
        defaultValue = _ref.defaultValue;
    const currentValue = (0, _Utils.noValue)(value) ? defaultValue : value;
    const itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    return currentValue + itemValue;
  },
  // 平均值
  'aver': (_ref2) => {
    let field = _ref2.field,
        item = _ref2.item,
        defaultValue = _ref2.defaultValue,
        keyCounts = _ref2.keyCounts,
        data = _ref2.data;
    const itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    const tempValueKey = "_currentSumValue.".concat(field);

    if (data[tempValueKey] === undefined) {
      data[tempValueKey] = defaultValue;
    }

    return (data[tempValueKey] += itemValue) / (keyCounts + 1);
  },
  // 最大值
  'max': (_ref3) => {
    let field = _ref3.field,
        value = _ref3.value,
        item = _ref3.item,
        defaultValue = _ref3.defaultValue;
    const currentValue = (0, _Utils.noValue)(value) ? -Infinity : value;
    const itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    return currentValue > itemValue ? currentValue : itemValue;
  },
  // 最小值  
  'min': (_ref4) => {
    let field = _ref4.field,
        value = _ref4.value,
        item = _ref4.item,
        defaultValue = _ref4.defaultValue;
    const currentValue = (0, _Utils.noValue)(value) ? Infinity : value;
    const itemValue = (0, _Utils.noValue)(item[field]) ? defaultValue : item[field];
    return currentValue < itemValue ? currentValue : itemValue;
  },
  // 聚合条数
  'count': (_ref5) => {
    let keyCounts = _ref5.keyCounts;
    return keyCounts + 1;
  },
  // 字符串连接
  'join': (_ref6) => {
    let field = _ref6.field,
        value = _ref6.value,
        item = _ref6.item,
        option = _ref6.option,
        keyCounts = _ref6.keyCounts,
        defaultText = _ref6.defaultText;
    const itemValue = (0, _Utils.noValue)(item[field]) ? defaultText : item[field];
    return keyCounts === 0 ? "".concat(itemValue) : "".concat(value).concat(option.$split || ',').concat(itemValue);
  },
  // 原始数据数组
  'origin': (_ref7) => {
    let value = _ref7.value,
        item = _ref7.item;
    value = value || [];
    value.push(item);
    return value;
  }
};

const aggregates = _objectSpread({}, _aggregates);
/*
  树形数据结构，fieldName为分组字段值，为空表示是叶子节点
 */


exports.aggregates = aggregates;

class DataMap extends Map {
  constructor(initData) {
    let fieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    super(initData);
    this.fieldName = fieldName;
    this._keyCount = {};
  }
  /*
    set时记录同一个key被set的次数
   */


  set(key, value) {
    if (this._keyCount[key] === undefined) {
      this._keyCount[key] = 0;
    }

    this._keyCount[key]++;
    super.set(key, value);
  }
  /*
     取得同一个key被set的次数
   */


  keyCounts(key) {
    return this._keyCount[key] || 0;
  }
  /*
     转成普通的Objec
   */


  toObject() {
    const obj = {};

    for (let _ref8 of this.entries()) {
      var _ref9 = _slicedToArray(_ref8, 2);

      let key = _ref9[0];
      let value = _ref9[1];
      obj[key] = value;
    }

    return obj;
  }
  /*
     遍历数据并转为对象数组格式
  */


  toObjectInArray() {
    let _param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      _list: [],
      _item: {}
    };

    const _list = _param._list,
          _item = _param._item;
    const keys = Array.from(this.keys());

    if (this.fieldName === null) {
      keys.forEach(key => {
        _item[key] = this.get(key);
      });

      _list.push(_item);
    } else {
      keys.forEach(key => {
        _item[this.fieldName] = key;
        _param._item = _objectSpread({}, _item);
        (this.get(key) || new DataMap()).toObjectInArray(_param);
      });
    }

    return _param._list;
  }

}
/*
 将object转为DataMap
 */


exports.DataMap = DataMap;

function traceObj() {
  let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  let _dataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new DataMap();

  for (let key in obj) {
    const value = obj[key];

    if (typeof value === 'object' && !Array.isArray(value)) {
      traceObj(value, _dataMap);
    } else {
      _dataMap.set(key, value);
    }
  }

  return _dataMap;
}

DataMap.fromObject = function () {
  let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return traceObj(obj);
};
/* 树到自连接关系 */


function treeToRelation(source) {
  let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  let _extend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  const _config$keyField = config.keyField,
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
        trace = _config$trace === void 0 ? () => {} : _config$trace;

  let _extend$_pKey = _extend._pKey,
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
      _getItem = _extend$_getItem === void 0 ? changeSource ? a => a : a => JSON.parse(JSON.stringify(a)) : _extend$_getItem;

  if (!_markerLeaf) {
    if (leafField !== false) {
      _markerLeaf = function _markerLeaf(item) {
        let flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        item[leafField] = flag;
        flag && _refs.leaves.push(item);
      };
    } else {
      _markerLeaf = () => {};
    }
  }

  if (!_markerRoot) {
    if (rootField !== false) {
      _markerRoot = function _markerRoot(item) {
        let flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        item[rootField] = flag;
        flag && _refs.roots.push(item);
      };
    } else {
      _markerRoot = () => {};
    }
  }

  source.forEach(originItem => {
    const item = _getItem(originItem);

    const chlidren = originItem[childrenField] || [];
    item[parentKeyField] = _pKey === null ? rootParentKeyValue : _pKey;
    const isLeaf = !chlidren.length;

    _markerLeaf(item, isLeaf);

    const isRoot = (0, _Utils.noValue)(_pKey);

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
      _trace,
      _list,
      _refs,
      _markerLeaf,
      _markerRoot
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


class DataSetTransformer {
  constructor() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this._init(config);
  }

  _init(config) {
    const _config$dataSource = config.dataSource,
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
      _groupFieldValues: groupFields.map(() => new Set())
    });
    this._aggregate = {};

    this._valueFields.forEach(field => {
      if (typeof aggregate[field] === 'string') {
        aggregate[field] = _aggregates[aggregate[field]];
      }

      this._aggregate[field] = aggregate[field] || _aggregates['sum'];
    });

    dataSource.forEach(item => this._add(item));
  }

  _add() {
    let item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._currentCount++;
    let currentData = this._data;

    this._groupFields.forEach((groupField, index) => {
      if (!currentData.get(item[groupField])) {
        currentData.set(item[groupField], new DataMap(null, this._groupFields[index + 1]));
      }

      currentData = currentData.get(item[groupField]);

      this._groupFieldValues[index].add(item[groupField]);
    });

    this._valueFields.forEach(valueField => {
      const aggregate = this._aggregate[valueField];
      const currentValue = aggregate({
        field: valueField,
        value: currentData.get(valueField),
        item,
        keyCounts: currentData.keyCounts(valueField),
        option: this._option,
        count: this._currentCount,
        defaultValue: this._defaultValue,
        defaultText: this._defaultText,
        data: currentData
      });
      currentData.set(valueField, currentValue);
    });
  }
  /*
     分组后各组值得枚举
   */


  getEnums() {
    const fields = {};

    this._groupFieldValues.forEach((valueSet, index) => {
      fields[this._groupFields[index]] = Array.from(valueSet);
    });

    return fields;
  }

  getData() {
    return this._data.toObjectInArray();
  }

}
/*
  解析分组配置字符串
 */


exports.DataSetTransformer = DataSetTransformer;

function groupStrToConfig(config) {
  let _config;

  if (typeof config === 'object') {
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

  const _config$replace$split = config.replace(/^\s+|\s+$/g, '').split('=>'),
        _config$replace$split2 = _slicedToArray(_config$replace$split, 2),
        _config$replace$split3 = _config$replace$split2[0],
        groupFieldStr = _config$replace$split3 === void 0 ? '' : _config$replace$split3,
        _config$replace$split4 = _config$replace$split2[1],
        valueFieldStr = _config$replace$split4 === void 0 ? '' : _config$replace$split4;

  const groupFields = groupFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(field => field.replace(/^\s+|\s+$/g, ''));
  const valueFields = valueFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(field => {
    field = field.replace(/^\s+|\s+$/g, '');

    const _field$split = field.split(':'),
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


function traceObject(item, leafPath, fromList, toList, setList) {
  let _currentPath = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

  let _midResult = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

  let countField = arguments.length > 7 ? arguments[7] : undefined;

  if ((0, _Utils.noValue)(item) || typeof item !== 'object') {
    return [];
  }

  const field = leafPath.replace(_currentPath, '').replace(/^\./g, '').split('.').shift();

  if (field === undefined) {
    return [];
  }

  for (let key in item) {
    let keyPath = (_currentPath + '.' + key).replace(/^\./g, '');
    let toIndex = fromList.indexOf(keyPath);
    let value = item[key];

    if (toIndex !== -1) {
      _midResult[toList[toIndex]] = value;
    }
  }

  const fieldValue = item[field];
  const fieldPath = (_currentPath + '.' + field).replace(/^\./g, '');

  if (Array.isArray(fieldValue)) {
    let newMidResultList = [];
    const count = fieldValue.length;
    fieldValue.forEach((v, i) => {
      const clone = (0, _Utils.snapShot)(_midResult);
      newMidResultList = newMidResultList.concat(traceObject(v, leafPath, fromList, toList, setList, fieldPath, clone, countField));
    });
    newMidResultList[0] && (newMidResultList[0][countField.replace('{field}', field)] = count);
    return newMidResultList;
  }

  if (typeof fieldValue === 'object') {
    return traceObject(fieldValue, leafPath, fromList, toList, setList, fieldPath, _midResult, countField);
  }

  return [_midResult];
}

const myMethods = [];
/*
  添加反射信息，并返回新TransformProcess
 */

function refReturn(proto, name, descriptor) {
  myMethods.push(name);
  const oldFun = proto[name];

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


let TransformProcess = (_class = class TransformProcess {
  constructor(source) {
    let initRefs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let useRef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    this.source = source;
    this.data = null;
    this.useRef = useRef;
    this.refs = useRef ? initRefs : {};
  }

  fromObject() {
    let field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '_key';
    let obj = this.source;
    this.data = Object.keys(obj).map(key => {
      const item = obj[key];

      if ((0, _Utils.noValue)(item) || typeof item === 'number') {
        return item;
      }

      item[field] = key;
      return item;
    });
  }

  operate() {
    let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : a => a;
    this.data = callback(this.source, this.refs);
  }

  map() {
    let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : a => a;
    this.data = [].concat(this.source).map(callback);
  }

  filter() {
    let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : a => a;
    this.data = [].concat(this.source).filter(callback);
  }

  fromModel() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let _config$leafPath = config.leafPath,
        leafPath = _config$leafPath === void 0 ? '' : _config$leafPath,
        _config$passings = config.passings,
        passings = _config$passings === void 0 ? [] : _config$passings,
        _config$originField = config.originField,
        originField = _config$originField === void 0 ? '_origin' : _config$originField,
        _config$countField = config.countField,
        countField = _config$countField === void 0 ? '_{field}Count' : _config$countField;
    const list = [].concat(this.source);
    passings = [].concat(passings).map(option => {
      let from, to, set;

      if (typeof option === 'string') {
        from = option;
        to = option.substr(option.lastIndexOf('.'));
        set = _Utils.same;
      } else {
        from = option.from;
        to = option.to;
        set = option.set;
      }

      return {
        from,
        to,
        set
      };
    });
    const fromList = [];
    const toList = [];
    const setList = passings.map((_ref10) => {
      let from = _ref10.from,
          to = _ref10.to,
          set = _ref10.set;
      fromList.push(from);
      toList.push(to);
      return set;
    });
    let outPutList = [];
    list.forEach(item => {
      outPutList = outPutList.concat(traceObject(item, leafPath, fromList, toList, setList, '', {
        [originField]: item
      }, countField));
    });
    this.data = outPutList;
  }

  fromMatrix() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.source.length) {
      return [];
    }

    let _config$firstIsFileds = config.firstIsFileds,
        firstIsFileds = _config$firstIsFileds === void 0 ? true : _config$firstIsFileds,
        _config$fields = config.fields,
        fields = _config$fields === void 0 ? null : _config$fields;
    const first = this.source[0];

    if (!fields) {
      if (firstIsFileds) {
        fields = first;
      } else {
        fields = first.map((a, i) => i);
      }
    }

    if (firstIsFileds) {
      this.source.shift();
    }

    this.data = this.source.map(arrItem => {
      const objItem = {};
      arrItem.forEach((v, i) => {
        objItem[fields[i]] = v;
      });
      return objItem;
    });

    if (this.useRef) {
      this.refs.fromMatrixFields = fields;
    }
  }

  _toFields() {
    if (!this.source.length) {
      return [];
    }

    const first = this.source[0];
    return Object.keys(first);
  }

  toFields() {
    this.data = this._toFields();
  }

  toMatrix() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!this.source.length) {
      return [];
    }

    let _config$firstIsFileds2 = config.firstIsFileds,
        firstIsFileds = _config$firstIsFileds2 === void 0 ? true : _config$firstIsFileds2,
        _config$fields2 = config.fields,
        fields = _config$fields2 === void 0 ? null : _config$fields2;

    if (!fields) {
      fields = this._toFields();
    }

    this.data = this.source.map(objItem => {
      return fields.map(field => objItem[field]);
    });

    if (firstIsFileds) {
      this.data.splice(0, 0, fields);
    }

    if (this.useRef) {
      this.refs.toMatrixFields = fields;
    }
  }

  fromTree() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const _treeToRelation = treeToRelation(this.source, config),
          data = _treeToRelation.data,
          refs = _treeToRelation.refs;

    this.data = data;

    if (this.useRef) {
      this.refs.fromTreeEnums = refs;
    }
  }

  traceTree() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    treeToRelation(this.source, config);
    this.data = this.source;
  }

  toTree() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const _config$keyField2 = config.keyField,
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
    const rootList = [];
    const tempMap = {};
    const doTrace = trace ? function (item) {
      let _trace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      _trace.push(item);

      const pkv = item[parentKeyField];

      if ((0, _Utils.noValue)(pkv) || pkv === rootParentKeyValue) {
        trace(_trace.reverse(), item);
        return;
      }

      let parent = tempMap[pkv];

      if (parent) {
        doTrace(parent, _trace);
      }
    } : () => {};

    let getBlankArray = () => null;

    if (blankArray) {
      getBlankArray = () => [];
    }

    this.source.forEach(item => {
      const pkv = item[parentKeyField];

      if ((0, _Utils.noValue)(pkv) || pkv === rootParentKeyValue) {
        rootList.push(item);
      } else {
        tempMap[item[parentKeyField]] = tempMap[item[parentKeyField]] || [];
        tempMap[item[parentKeyField]].push(item);
      }
    });
    this.source.forEach(item => {
      item[childrenField] = tempMap[item[keyField]] || getBlankArray();
      doTrace(item);
    });

    if (this.useRef) {
      this.refs.toTreeChildrenMap = tempMap;
    }

    this.data = rootList;
  }

  toGrouped() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);

    if (config.originField !== false) {
      if ((0, _Utils.noValue)(config.originField)) {
        config.originField = '_origin';
      }

      config.aggregate[config.originField] = 'origin';
      config.valueFields = [].concat(config.valueFields || []);
      config.valueFields.push(config.originField);
    }

    config.dataSource = this.source;
    const tf = new DataSetTransformer(config);
    this.data = tf.getData();

    if (this.useRef) {
      //    this.refs.toGroupedDataMap = tf._data;
      this.refs.toGroupedEnums = tf.getEnums();
    }
  }

  toSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);
    this.toGrouped(config);
    const seriesField = config.groupFields[1] || _seriesName;
    const series = new Map();
    this.data.forEach(item => {
      if (!series.get(item[seriesField])) {
        series.set(item[seriesField], []);
      }

      series.get(item[seriesField]).push(item);
    });
    this.data = Array.from(series.keys()).map(name => ({
      name,
      data: series.get(name)
    }));
  }

  toObject() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const keyField = config.keyField,
          valueField = config.valueField;

    if ((0, _Utils.noValue)(keyField)) {
      throw new Error('toObject need keyField');
    }

    const obj = {};
    const getValue = (0, _Utils.noValue)(valueField) ? item => item : item => item[valueField];
    const keyList = [];
    this.source.forEach(item => {
      keyList.push(item[keyField]);
      obj[item[keyField]] = getValue(item);
    });
    this.data = obj;

    if (this.useRef) {
      this.refs.keyListOfoObject = keyList;
    }
  }

  _toXSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let typeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Echarts';
    let getvalue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : a => a;
    config = groupStrToConfig(config);

    if (!this.useRef && !config.xData) {
      throw new Error("to".concat(typeName, "Series need refs or xData."));
    }

    const defaultSeriesName = (0, _Utils.noValue)(config.defaultSeriesName) ? null : config.defaultSeriesName;
    this.toSeries(config);
    const xData = config.xData ? config.xData : this.useRef ? this.refs.toGroupedEnums[config.groupFields[0]] : [];

    let setSeriesMap = () => {};

    if (this.useRef) {
      this.refs["xDataOf".concat(typeName)] = xData;
      this.refs["itemMapOf".concat(typeName)] = {};

      setSeriesMap = (serIndex, dataIndex, item) => {
        this.refs["itemMapOf".concat(typeName)][serIndex] = this.refs["itemMapOf".concat(typeName)][serIndex] || {};
        this.refs["itemMapOf".concat(typeName)][serIndex][dataIndex] = item;
      };
    }

    let min = Infinity;
    let max = -Infinity;
    this.data = this.data.map((series, serIndex) => {
      const tempMap = {};
      series.data.forEach(seriesItem => {
        tempMap[seriesItem[config.groupFields[0]]] = seriesItem;
      });
      return {
        name: series.name === undefined ? defaultSeriesName : series.name,
        data: xData.map((xValue, dataIndex) => {
          const item = tempMap[xValue];

          if (!(0, _Utils.noValue)(item)) {
            setSeriesMap(serIndex, dataIndex, item);
            const value = item[config.valueFields[0]];
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
        min,
        max
      };
    }
  }

  toNumSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);

    this._toXSeries(config, 'NumSeries', item => item[config.valueFields[0]]);
  }

  toPieSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);

    this._toXSeries(config, 'PieSeries', item => ({
      name: item[config.groupFields[0]],
      value: item[config.valueFields[0]]
    }));

    this.data.forEach(series => {
      series.data = series.data.filter(item => item !== null);
    });
  }

  toHeatSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);

    if (!config.groupFields[1]) {
      throw new Error('toHeatSeries must has 2 groupFields');
    }

    this._toXSeries(config, 'HeatSeries', item => [item[config.groupFields[0]], item[config.groupFields[1]], item[config.valueFields[0]]]);
  }

  toScatterSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);

    if (!config.groupFields[1]) {
      throw new Error('toScatterSeries must has 2 groupFields');
    }

    this._toXSeries(config, 'ScatterSeries', item => {
      const result = [item[config.groupFields[0]], item[config.groupFields[1]]];
      config.valueFields.forEach(valueFieldName => {
        result.push(item[valueFieldName]);
      });
      return result;
    });
  }

  toRadarSeries() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    config = groupStrToConfig(config);
    const maxValueMap = {};

    this._toXSeries(config, 'RadarSeries', item => {
      const xValue = item[config.groupFields[0]];
      const value = item[config.valueFields[0]];
      const max = maxValueMap[xValue] = maxValueMap[xValue] || -Infinity;
      maxValueMap[xValue] = value > max ? value : max;
      return value;
    });

    const seriesData = this.data;
    this.data = [{
      name: null,
      data: []
    }];
    seriesData.forEach(series => {
      this.data[0].data.push({
        name: series.name,
        value: series.data
      });
    });

    if (this.useRef) {
      this.refs.indicatorOfRadarSeries = this.refs.xDataOfRadarSeries.map(name => {
        return {
          name,
          max: maxValueMap[name] || null
        };
      });
    }
  }

  getData() {
    return (0, _Utils.noValue)(this.data) ? this.source : this.data;
  }

  getRefs() {
    return this.refs;
  }

  output() {
    return {
      data: this.getData(),
      refs: this.getRefs()
    };
  }

}, (_applyDecoratedDescriptor(_class.prototype, "fromObject", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromObject"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "operate", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "operate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "map", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "map"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "filter", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "filter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromModel", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromModel"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromMatrix", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromMatrix"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toFields", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toFields"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toMatrix", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toMatrix"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "fromTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "fromTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "traceTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "traceTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toTree", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toTree"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toGrouped", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toGrouped"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toObject", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toObject"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toNumSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toNumSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toPieSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toPieSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toHeatSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toHeatSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toScatterSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toScatterSeries"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "toRadarSeries", [refReturn], Object.getOwnPropertyDescriptor(_class.prototype, "toRadarSeries"), _class.prototype)), _class);
exports.TransformProcess = TransformProcess;
TransformProcess.fn = TransformProcess.prototype;
TransformProcess.myMethods = myMethods;

function $Transform(source) {
  let useRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return new TransformProcess(source, {//  $TransformOrigin: source
  }, useRef);
}