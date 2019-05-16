import {noValue, same, snapShot} from './Utils.js';

const _seriesName = Math.random() * 10e6;

/*
 预定义的聚合函数
 */
const _aggregates = {
  // 求和
  'sum': ({field, value, item, defaultValue}) => { 
    const currentValue = noValue(value) ? defaultValue: value;
    const itemValue = noValue(item[field]) ? defaultValue : item[field]; 
    return currentValue + itemValue;
  },
  // 平均值
  'aver': ({field, item, defaultValue, keyCounts, data}) => { 
    const itemValue = noValue(item[field]) ? defaultValue : item[field];    
    const tempValueKey = `_currentSumValue.${field}`;
    if (data[tempValueKey] === undefined) {
      data[tempValueKey] = defaultValue;
    }
    return (data[tempValueKey] += itemValue) / (keyCounts + 1);
  },
  // 中位数
  'median': ({field, item, defaultValue, keyCounts, data}) => {
    const itemValue = noValue(item[field]) ? defaultValue : item[field];    
    const tempValueKey = `_currentMedianValue.${field}`;
    if (data[tempValueKey] === undefined) {
      data[tempValueKey] = [];
    }
    data[tempValueKey].push(itemValue);
    data[tempValueKey].sort();
    const _keyCounts = (keyCounts + 1);
    if (_keyCounts % 2) {
      return data[tempValueKey][(_keyCounts - 1) / 2];
    } else {
      const medIndex = _keyCounts / 2;
      const a = data[tempValueKey][medIndex];
      const b = data[tempValueKey][medIndex -1];
      return (a + b) / 2;
    }
  },
  // 最大值
  'max': ({field, value, item, defaultValue}) => { 
    const currentValue = noValue(value) ? -Infinity: value;
    const itemValue = noValue(item[field]) ? defaultValue : item[field];  
    return currentValue > itemValue ? currentValue : itemValue;
  },
  // 最小值  
  'min': ({field, value, item, defaultValue}) => { 
    const currentValue = noValue(value) ? Infinity: value;
    const itemValue = noValue(item[field]) ? defaultValue : item[field];
    return currentValue < itemValue ? currentValue : itemValue;
  },
   // 聚合条数
  'count': ({keyCounts}) => keyCounts + 1,
   // 字符串连接
  'join': ({field, value, item, option, keyCounts, defaultText}) => {
    const itemValue = noValue(item[field]) ? defaultText : item[field];
    return keyCounts === 0 ? `${itemValue}` : `${value}${option.$split || ','}${itemValue}`;
  },
  // 原始数据数组
  'origin': ({value, item}) => {
    value = value || [];
    value.push(item);
    return value;
  },
};

export const aggregates = {..._aggregates};

/*
  树形数据结构，fieldName为分组字段值，为空表示是叶子节点
 */
export class DataMap extends Map {
  constructor(initData, fieldName = null) {
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
    for (let [key, value] of this.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  
  /*
     遍历数据并转为对象数组格式
  */
  toObjectInArray(_param = {_list: [], _item: {}}) {
    const {_list, _item } = _param;   
    const keys = Array.from(this.keys());  
    
    if (this.fieldName === null) {
      keys.forEach(key => {
        _item[key] = this.get(key);
      });
      _list.push(_item);      
    } else {
      keys.forEach(key => {
        _item[this.fieldName] = key;
        _param._item = {..._item};
        (this.get(key) || new DataMap()).toObjectInArray(_param);
      });
    } 
    
    return _param._list;
  }
}

/*
 将object转为DataMap
 */
function traceObj(obj = {}, _dataMap = new DataMap()) {
  for (let key in obj) {
    const value = obj[key];
    if(typeof value === 'object' && !Array.isArray(value)) {
      traceObj(value, _dataMap);
    } else {
      _dataMap.set(key, value);
    }
  }
  return _dataMap;
}
DataMap.fromObject = function(obj = {}) {
  return traceObj(obj);
};

/* 树到自连接关系 */
function treeToRelation(source, config = {}, _extend = {}) {
  const {
    keyField = 'id',
    parentKeyField = 'pid',
    childrenField = 'children',
    rootParentKeyValue = null,
    leafField = '_leaf',
    rootField = '_root',
    changeSource = true,
    trace = () => {}
  } = config;
  
  let {
    _pKey = null,
    _list = [],
    _trace = [],
    _refs = {
      leaves: [],
      roots: []
    },
    _markerLeaf,
    _markerRoot,
    _getItem = (changeSource ? a => a : a => JSON.parse(JSON.stringify(a)))
  } = _extend;

  if (!_markerLeaf) {
    if(leafField !== false){
      _markerLeaf= (item, flag = false) => {
        item[leafField] = flag;
        flag && _refs.leaves.push(item);
      }
    } else {
      _markerLeaf = () => {};
    }
  }

  if (!_markerRoot) {
    if(rootField !== false){
      _markerRoot= (item, flag = false) => {
        item[rootField] = flag;
        flag && _refs.roots.push(item);
      }
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
    const isRoot = noValue(_pKey);
    _markerRoot(item, isRoot);
    if (isRoot) {
      _trace = [item];
    } else {
      _trace.push(item);
    }
    trace(_trace, item, originItem);
    delete item[childrenField];
    _list.push(item);   
    return treeToRelation(chlidren, config, {_pKey: item[keyField], _trace, _list, _refs, _markerLeaf, _markerRoot});
  });
  
  return {
    data: _list,
    refs: _refs
  };
}

/*
  用于做聚合操作的数据集
 */
export class DataSetTransformer {
  constructor(config = {}) {
    this._init(config);
  }
  
  _init(config) {
    const {
      dataSource = [], // 数据源
      groupFields = [], // 分组字段
      valueFields = [], // 聚合字段
      aggregate = {}, // 聚合函数
      option = { // 额外配置
        $defaultValue: 0, // 数值默认值
        $defaultText: '', // 字符串默认值
        $split : ',' // 字符串连接分隔符
      }
    } = config;

    Object.assign(this, {
      _dataSource: dataSource,
      _groupFields: [].concat(groupFields),
      _valueFields:[].concat(valueFields) ,
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
  
  _add(item = {}) {
    this._currentCount++;
    
    let currentData = this._data;
    this._groupFields.forEach((groupField, index) => {
      if (!currentData.get(item[groupField])) {
        currentData.set(item[groupField], new DataMap(null, this._groupFields[index + 1]));
      }
      currentData = currentData.get(item[groupField]);
      this._groupFieldValues[index].add(item[groupField]);
    });

    this._valueFields.forEach((valueField) => {
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
       分组后各组值的枚举
   */
  getEnums(){
    const fields = {};
    this._groupFieldValues.forEach((valueSet, index) => {
      fields[this._groupFields[index]] = Array.from(valueSet) ;
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
function groupStrToConfig(config) {
  let _config;
  if (typeof config === 'object') {
    if(noValue(config.group)) {
      return config;
    }
    
    _config = {
      aggregate: {},
      ...config
    };
    
    config = config.group;
  } else {
    _config = {
      aggregate: {},
    };
  }
  
  const [groupFieldStr = '', valueFieldStr = ''] = config.replace(/^\s+|\s+$/g,'').split('=>');
  const groupFields = groupFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(field => field.replace(/^\s+|\s+$/g,''));
  const valueFields = valueFieldStr.replace(/^\s+|\s+$/g, '').split(',').map(field => {
    field = field.replace(/^\s+|\s+$/g, '');
    const [fieldName, aggregateType] = field.split(':');
    if(aggregateType && _aggregates[aggregateType]) {
      _config.aggregate[fieldName] = _aggregates[aggregateType];
    }
    return fieldName.replace(/^\s+|\s+$/g,'');
  });
  
  _config.groupFields = groupFields;
  _config.valueFields = valueFields;
  
  return _config;
}

/*
 根据字符串遍历objec
 */
export function traceObject(item, leafPath, fromList, toList, setList, _currentPath = '', _midResult = {}, countField) {
    
  if(noValue(item) || typeof item !== 'object') {
    return [];
  }
  
  const field = leafPath.replace(_currentPath, '').replace(/^\./g, '').split('.').shift();
  
  if(field === undefined) {
    return [];
  }

  for (let key in item) {
    let keyPath = (_currentPath + '.' + key).replace(/^\./g, ''); 
    let toIndex = fromList.indexOf(keyPath);    
    let value = item[key];
    if(toIndex!== -1) {
      _midResult[toList[toIndex]] = value;
    }
  }
  
  const fieldValue = item[field];
  const fieldPath = (_currentPath + '.' +  field).replace(/^\./g, '');
  if(Array.isArray(fieldValue)) {  
    let newMidResultList = [];
    const count = fieldValue.length;
    fieldValue.forEach((v, i) => {
      const clone = snapShot(_midResult);
      newMidResultList = newMidResultList.concat(
        traceObject(v, leafPath, fromList, toList, setList, fieldPath, clone, countField))
    });
    (newMidResultList[0]) && (newMidResultList[0][countField.replace('{field}', field)] = count);
    return newMidResultList;
  }
  if(typeof fieldValue === 'object'){
    return traceObject(fieldValue, leafPath, fromList, toList, setList, fieldPath, _midResult, countField);
  }
  
  return  [_midResult];
}

const myMethods = [];

/*
  添加反射信息，并返回新TransformProcess
 */
export function refReturn(proto, name, descriptor) {
  myMethods.push(name);
  const oldFun = proto[name];
  descriptor.value = function(...args) {   
    oldFun.apply(this, args);
//  if (this.useRef) {
//    this.refs[`${name}Data`] = this.data;
//  }
    return new TransformProcess(this.data, this.refs, this.useRef);
  }  
}

/*
  链式调用转换过程
 */
export class TransformProcess {
  constructor(source, initRefs = {}, useRef = true) {
    this.source = source;
    this.data = null;
    this.useRef = useRef;
    this.refs = useRef ? initRefs : {};
  }
  
  @refReturn
  fromObject(field = '_key') {  
    let obj = this.source;
    this.data = Object.keys(obj).map(key => {
      const item = obj[key];
      if(noValue(item) || typeof item === 'number') {
        return item;
      }
      item[field] = key;
      return item;
    });
  }
  
  @refReturn
  operate(callback = a => a){
    this.data = callback(this.source, this.refs);
  }
  
  @refReturn
  map(callback = a => a){
    this.data = ([].concat(this.source)).map(callback);
  }
  
  @refReturn
  filter(callback = a => a){
    this.data = ([].concat(this.source)).filter(callback);
  }

  @refReturn
  fromModel(config= {}) {
    
    let {
      leafPath = '',
      passings = [],
      originField = '_origin',
      countField = '_{field}Count'
    } = config;
    
    const list = [].concat(this.source);
    passings = [].concat(passings).map(option => {
      let from, to, set;
      if(typeof option === 'string'){
        from = option
        to = option.substr(option.lastIndexOf('.'));
        set = same;
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
    const setList = passings.map(({from, to, set}) => {
      fromList.push(from);
      toList.push(to);
      return set;
    })
    
    let outPutList = [];

    list.forEach(item => {
      outPutList = outPutList.concat(traceObject(item, leafPath, fromList, toList, setList, '', {[originField]: item}, countField));    
    });

    this.data = outPutList;
  }
  
  @refReturn
  fromMatrix(config = {}) {
    if(!this.source.length){
      return [];
    }
    
    let {
      firstIsFileds = true,
      fields = null
    } = config;
    
    const first = this.source[0];
    if(!fields) {
      if(firstIsFileds) {
        fields = first;
      } else {
        fields = first.map((a,i) => i);
      } 
    }
    
    if(firstIsFileds){
      this.source.shift();
    }
    
    this.data = this.source.map(arrItem => {
      const objItem = {};
      arrItem.forEach((v, i) => {
        objItem[fields[i]] = v;
      });
      return objItem;
    });
    
    if(this.useRef){
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
  
  @refReturn
  toFields() {
    this.data = this._toFields();
  }
  
  @refReturn
  toMatrix(config = {}) {
    if (!this.source.length) {
      return [];
    }
    
    let {
      firstIsFileds = true,
      fields = null
    } = config;
    
    if(!fields) {
      fields = this._toFields();
    }
    
    this.data = this.source.map(objItem => {
      return fields.map(field => objItem[field]);
    });
    
    if (firstIsFileds) {
      this.data.splice(0,0, fields);
    }
    
    if (this.useRef) {
      this.refs.toMatrixFields = fields;
    }    
  }
  
  @refReturn
  fromTree(config = {}) {
    const {data, refs} = treeToRelation(this.source, config);
    this.data = data;
    if(this.useRef) {
      this.refs.fromTreeEnums = refs;
    }
  }
  
  @refReturn
  traceTree(config = {}) {
    treeToRelation(this.source, config);
    this.data = this.source;
  }
  
  @refReturn
  toTree(config = {}) {
    const {
      keyField = 'id',
      parentKeyField = 'pid',
      rootParentKeyValue = null,
      blankArray = false,
      childrenField = 'children',
//    changeSource = true,
      trace = null
    } = config;
    
    const rootList = [];
    const tempMap = {};
    
    const doTrace = trace ? (item, _trace = []) => {
      _trace.push(item);
      const pkv = item[parentKeyField];
      if (noValue(pkv) || pkv === rootParentKeyValue) {
        trace(_trace.reverse(), item);
        return;
      }
      let parent = tempMap[pkv];
      if (parent) {
        doTrace(parent, _trace);
      }
    } : () => {};
    
    let getBlankArray = () => null;
    if(blankArray){
      getBlankArray = () => [];
    }
    
    this.source.forEach(item => {
      const pkv = item[parentKeyField];
      if (noValue(pkv) || pkv === rootParentKeyValue) {
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
    
    if(this.useRef) {
      this.refs.toTreeChildrenMap = tempMap;
    } 
    
    this.data = rootList;
  }

  @refReturn
  toGrouped(config = {}){
    config = groupStrToConfig(config);
    
    if(config.originField !== false){
      if(noValue(config.originField)) {
        config.originField = '_origin';
      }
      
      config.aggregate[config.originField] = 'origin';
      config.valueFields = [].concat(config.valueFields || []);
      config.valueFields.push(config.originField); 
    }

    config.dataSource = this.source;
    
    const tf = new DataSetTransformer(config);
    this.data = tf.getData();
    if(this.useRef){
//    this.refs.toGroupedDataMap = tf._data;
      this.refs.toGroupedEnums = tf.getEnums();
    }
  }
  
  @refReturn
  toSeries(config = {}){
    config = groupStrToConfig(config);
    this.toGrouped(config);
    const seriesField = config.groupFields[1] || _seriesName;
    const series = new Map();
    this.data.forEach(item => {
      if(!series.get(item[seriesField])){
         series.set(item[seriesField], []);
      }
      series.get(item[seriesField]).push(item);
    });
    this.data = Array.from(series.keys()).map((name) => ({name, data: series.get(name)}));
  }
  
  @refReturn
  toObject(config = {}) {
    const {
      keyField,
      valueField
    } = config;
    
    if(noValue(keyField)){
      throw new Error('toObject need keyField');
    }
    
    const obj = {};
    const getValue = noValue(valueField) ? item => item : item => item[valueField];
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
  
  _toXSeries(config = {}, typeName = 'Echarts', getvalue = a => a){
    config = groupStrToConfig(config);
    if(!this.useRef && !config.xData) {
      throw new Error(`to${typeName}Series need refs or xData.`);
    }
    const defaultSeriesName = noValue(config.defaultSeriesName) ? null : config.defaultSeriesName;
    
    this.toSeries(config);  
    const xData = config.xData ? config.xData : this.useRef ? this.refs.toGroupedEnums[config.groupFields[0]] : [];  
    let setSeriesMap = () => {};
    if(this.useRef) {
      this.refs[`xDataOf${typeName}`] = xData;
      this.refs[`itemMapOf${typeName}`] = {};
      setSeriesMap = (serIndex, dataIndex, item) => {
        this.refs[`itemMapOf${typeName}`][serIndex] = this.refs[`itemMapOf${typeName}`][serIndex] || {};
        this.refs[`itemMapOf${typeName}`][serIndex][dataIndex] = item;
      }
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
          if(!noValue(item)) {
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
    
    if(this.useRef) {
      this.refs[`limitValueOf${typeName}`] = {min, max};
    }
  }

  @refReturn
  toNumSeries(config = {}) {
    config = groupStrToConfig(config);
    this._toXSeries(config, 'NumSeries',
      item => item[config.valueFields[0]]);
  }
  
  @refReturn
  toPieSeries(config = {}) { 
    config = groupStrToConfig(config);
    this._toXSeries(config, 'PieSeries',
      item => ({name: item[config.groupFields[0]], value: item[config.valueFields[0]]}));
    this.data.forEach(series => {
      series.data = series.data.filter(item => item !== null);
    });
  }
  
  @refReturn
  toHeatSeries(config = {}) {
    config = groupStrToConfig(config);
    if(!config.groupFields[1]){
      throw new Error('toHeatSeries must has 2 groupFields');
    }
    this._toXSeries(config, 'HeatSeries',
      item => ([
      item[config.groupFields[0]],
      item[config.groupFields[1]],
      item[config.valueFields[0]]]));
  }
  
  @refReturn
  toScatterSeries(config = {}) {
    config = groupStrToConfig(config);
    if(!config.groupFields[1]){
      throw new Error('toScatterSeries must has 2 groupFields');
    } 
    this._toXSeries(config, 'ScatterSeries',
      item => {
        const result = [
          item[config.groupFields[0]],
          item[config.groupFields[1]]
        ];      
        config.valueFields.forEach(valueFieldName => {
          result.push(item[valueFieldName]);
        });        
        return result;
      }
    );
    
  }
  
  @refReturn
  toRadarSeries(config = {}) {
    config = groupStrToConfig(config);
    const maxValueMap = {}  
    this._toXSeries(config, 'RadarSeries',
      item => {
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
      })
    });
    
    if(this.useRef) {
      this.refs.indicatorOfRadarSeries = this.refs.xDataOfRadarSeries.map(name => {
        return {
          name,
          max: maxValueMap[name] || null
        }
      });
    }
  }
  
  getData() {
    return noValue(this.data) ? this.source : this.data;
  }
  
  getRefs() {
    return this.refs;
  }
  
  output() {
    return {
      data: this.getData(),
      refs: this.getRefs()
    }
  } 
}

TransformProcess.fn = TransformProcess.prototype;
TransformProcess.myMethods = myMethods;

export function $Transform(source, useRef = true) {
  return new TransformProcess(source, {
//  $TransformOrigin: source
  }, useRef);
}