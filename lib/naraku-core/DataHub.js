"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataHub = exports.Controller = exports.Executor = void 0;

var _Utils = require("./Utils.js");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _temp, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _class4;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let _Emitter = null;
let dataHubKey = 1;
let lagTime = 40;
const emitterMethods = ['on', 'once', 'emit', 'off'];
const statusList = ['undefined', 'loading', 'locked', 'set', 'error'];

function ifInvalid(result) {
  return function (target, name, descriptor) {
    const oldFun = target[name];

    descriptor.value = function () {
      if (this._invalid) {
        return result;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return oldFun.apply(this, args);
    };

    return descriptor;
  };
}
/*
   函数执行者，可用作过滤器
 */


let Executor = (_dec = ifInvalid(), _dec2 = ifInvalid(), _dec3 = ifInvalid(), _dec4 = ifInvalid(), _dec5 = ifInvalid(), _dec6 = ifInvalid(), (_class = class Executor {
  constructor() {
    this.myKey = dataHubKey++;
    this._invalid = false;
    this._before = {};
    this._after = {};
    this._runner = {};
  }

  register(name, fun) {
    if ((0, _Utils.noValue)(name)) {
      return;
    }

    if (fun === false) {
      this._before[name] = null;
      this._after[name] = null;
      this._runner[name] = null;
      return;
    }

    if (this._runner[name]) {
      return;
    }

    this._runner[name] = fun;
  }

  has(name) {
    return !!this._runner[name];
  }

  before(name, fun) {
    if ((0, _Utils.noValue)(name) || !this._runner[name]) {
      return;
    }

    this._before[name] = this._before[name] || [];

    this._before[name].push(fun);

    return () => {
      if (this._invalid || !this._before[name]) {
        return;
      }

      const i = this._before[name].indexOf(fun);

      if (i !== -1) {
        this._before[name].selice(i, 1);
      }
    };
  }

  after(name, fun) {
    if ((0, _Utils.noValue)(name) || !this._runner[name]) {
      return;
    }

    this._after[name] = this._after[name] || [];

    this._after[name].push(fun);

    return () => {
      if (this._invalid || !this._after[name]) {
        return;
      }

      const i = this._after[name].indexOf(fun);

      if (i !== -1) {
        this._after[name].selice(i, 1);
      }
    };
  }

  run(name) {
    if ((0, _Utils.noValue)(name) || !this._runner[name]) {
      (0, _Utils.errorLog)("unknown runner ".concat(name));
      return;
    }

    const befores = this._before[name] || [];

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    let newArgs = args;

    for (let before of befores) {
      newArgs = before && before(newArgs, args);

      if (newArgs === _Utils.stopRun) {
        return _Utils.stopRun;
      }
    }

    const result = this._runner[name](...newArgs);

    const afters = this._after[name] || [];
    let newResult = result;

    for (let after of afters) {
      newResult = after && after(newResult, result, newArgs, args);
    }

    return newResult;
  }

  destroy(name) {
    this._invalid = true;
    this._before = null;
    this._after = null;
    this._runner = null;
  }

}, (_applyDecoratedDescriptor(_class.prototype, "register", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "register"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "has", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "has"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "before", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "before"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "after", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "after"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "run", [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, "run"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "destroy", [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, "destroy"), _class.prototype)), _class));
/*
  DateHub控制器 
*/

exports.Executor = Executor;
let Controller = (_dec7 = ifInvalid(), _dec8 = ifInvalid(), _dec9 = ifInvalid(), _dec10 = ifInvalid(), _dec11 = ifInvalid(), _dec12 = ifInvalid(), _dec13 = ifInvalid(), _dec14 = ifInvalid(), _dec15 = ifInvalid(), _dec16 = ifInvalid(), _dec17 = ifInvalid(), _dec18 = ifInvalid(), _dec19 = ifInvalid(false), _dec20 = ifInvalid(false), _dec21 = ifInvalid(), _dec22 = ifInvalid(), _dec23 = ifInvalid(), _dec24 = ifInvalid(), _dec25 = ifInvalid(), _dec26 = ifInvalid(), _dec27 = ifInvalid(), _dec28 = ifInvalid(), _dec29 = ifInvalid(), _dec30 = ifInvalid(_Utils.blank), _dec31 = ifInvalid(_Utils.blank), _dec32 = ifInvalid(_Utils.blank), (_class2 = (_temp = class Controller {
  constructor(_dataHub) {
    _initializerDefineProperty(this, "register", _descriptor, this);

    _initializerDefineProperty(this, "before", _descriptor2, this);

    _initializerDefineProperty(this, "after", _descriptor3, this);

    _initializerDefineProperty(this, "on", _descriptor4, this);

    _initializerDefineProperty(this, "fetch", _descriptor5, this);

    _initializerDefineProperty(this, "once", _descriptor6, this);

    _initializerDefineProperty(this, "watch", _descriptor7, this);

    this._checkReady = name => {
      if (this._invalid) {
        return {
          ready: false
        };
      }

      let dataList = [];

      for (let _name of name) {
        if (this._dataHub.status(_name) !== 'set') {
          return {
            ready: false
          };
        }

        dataList.push(this._dataHub.get(_name));
      }

      return {
        ready: true,
        dataList
      };
    };

    _initializerDefineProperty(this, "when", _descriptor8, this);

    _initializerDefineProperty(this, "all", _descriptor9, this);

    _initializerDefineProperty(this, "_when", _descriptor10, this);

    this.myKey = dataHubKey++;
    this._dataHub = _dataHub;
    this._emitter = _dataHub._emitter;
    this._invalid = false;
    this._offList = [];
    this._runnerList = [];
  }

  get(name) {
    return this._dataHub.get(name);
  }

  hasRunner(name) {
    return this._executor.has(name);
  }

  first(name) {
    return this._dataHub.first(name);
  }

  refresh(name) {
    return this._dataHub.refresh(name);
  }

  submit(name, param) {
    return this._dataHub.submit(name, param);
  }

  set(name, value) {
    return this._dataHub.set(name, value);
  }

  assign0(name, obj) {
    return this._dataHub.assign0(name, obj);
  }

  delete(name) {
    return this._dataHub.delete(name);
  }

  emit(name) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return this._dataHub.emit(name, ...args);
  }

  snapshot(from, to) {
    return this._dataHub.snapshot(from, to);
  }

  reset(name) {
    return this._dataHub.reset(name);
  }

  status() {
    return this._dataHub.status(...arguments);
  }

  loading(list) {
    return this._dataHub.loading(list);
  }

  ready(list) {
    return this._dataHub.ready(list);
  }

  destroy() {
    this._invalid = true;
    clearTimeout(this._watchTimeoutIndex);

    this._offList.forEach(off => off());

    this._runnerList.forEach(name => {
      this._dataHub._executor && this._dataHub._executor.register(name, false);
    });

    this._runnerList = null;
    this._offList = null;
    this._dataHub = null;
    this._emitter = null;
  }

  run(name) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    return this._dataHub._executor.run(name, ...args);
  }

}, _temp), (_applyDecoratedDescriptor(_class2.prototype, "get", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "get"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "hasRunner", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "hasRunner"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "first", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "first"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "refresh", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "refresh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "submit", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "submit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "set", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "set"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "assign0", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "assign0"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "emit", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "emit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "snapshot", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "snapshot"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "reset", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "reset"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "status", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "status"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "loading", [_dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "loading"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "ready", [_dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "ready"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "destroy", [_dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "destroy"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "run", [_dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "run"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "register", [_dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      this._runnerList.push(name);

      this._dataHub._executor.register(name, callback);
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "before", [_dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      this._dataHub._executor.before(name, callback);
    };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "after", [_dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      this._dataHub._executor.after(name, callback);
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "on", [_dec26], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      if (this._invalid) {
        return;
      }

      this._emitter.on(name, callback);

      return () => {
        this._emitter.off(name, callback);
      };
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "fetch", [_dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this = this;

    return function (type) {
      let param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const tempDataName = '' + Math.random();

      _this._dataHub.doFetch(type, tempDataName, param, {});

      return new Promise(resolve => {
        _this.once('$fetchEnd:' + tempDataName, data => {
          resolve(data);

          _this._dataHub.delete(tempDataName);
        });
      });
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "once", [_dec28], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      if (this._invalid) {
        return;
      }

      this._emitter.once(name, callback);

      return () => {
        this._emitter.off(name, callback);
      };
    };
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "watch", [_dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this2 = this;

    return function (callback) {
      let _once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_this2._invalid) {
        return;
      }

      let fun = _once ? 'once' : 'on';

      const onChange = () => {
        if (_this2._invalid) {
          return;
        }

        clearTimeout(_this2._watchTimeoutIndex);
        _this2._watchTimeoutIndex = setTimeout(() => {
          callback();
        }, lagTime);
      };

      _this2[fun]('$dataChange', onChange);

      _this2[fun]('$statusChange', onChange);

      callback();
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "when", [_dec30], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function (name, callback) {
      let _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Array.isArray(name)) {
        if (name.length === 0) {
          return _Utils.blank;
        }

        let offList = [];

        const wrapedCallback = () => {
          const _this3$_checkReady = _this3._checkReady(name),
                ready = _this3$_checkReady.ready,
                dataList = _this3$_checkReady.dataList;

          if (ready) {
            callback(dataList);
          }
        };

        const _this3$_checkReady2 = _this3._checkReady(name),
              ready = _this3$_checkReady2.ready,
              dataList = _this3$_checkReady2.dataList;

        if (ready) {
          callback(dataList);

          if (_once) {
            return _Utils.blank;
          }
        }

        let fun = _once ? 'once' : 'on';
        name.forEach(_name => {
          offList.push(_this3[fun](_name, wrapedCallback));
        });
        return () => {
          offList && offList.forEach(off => off());
          offList = null;
        };
      }

      return _this3._when(name, callback, _once);
    };
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "all", [_dec31], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      name = [].concat(name);
      let offList = [];
      let stop = false;

      const infiniteOnce = () => {
        if (this._invalid) {
          return;
        }

        Promise.all(name.map(_n => new Promise(r => {
          offList.push(this.once(_n, r));
        }))).then(() => {
          callback(this._checkReady(name).dataList);
          offList = [];
          !stop && infiniteOnce();
        });
      };

      infiniteOnce();

      const _this$_checkReady = this._checkReady(name),
            ready = _this$_checkReady.ready,
            dataList = _this$_checkReady.dataList;

      if (ready) {
        callback(dataList);
      }

      return () => {
        stop = true;
        offList.forEach(off => off());
      };
    };
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_when", [_dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this4 = this;

    return function (name, callback) {
      let _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if ((0, _Utils.noValue)(name)) {
        return _Utils.blank;
      }

      let fun = _once ? 'once' : 'on';

      const wrapedCallback = () => {
        if (_this4._invalid) {
          return;
        }

        callback(_this4._dataHub.get(name));
      };

      if (_this4._dataHub.status(name) === 'set') {
        wrapedCallback();

        if (_once) {
          return _Utils.blank;
        }
      }

      return _this4[fun](name, wrapedCallback);
    };
  }
})), _class2));
exports.Controller = Controller;

function toObjParam(param) {
  if ((0, _Utils.noValue)(param)) {
    return {};
  }

  if (typeof param !== 'object') {
    return {
      data: param
    };
  }

  return param;
}

function actionPlugn(dataName, configInfo, dh) {
  let _configInfo$action = configInfo.action,
      action = _configInfo$action === void 0 ? configInfo.type : _configInfo$action,
      _configInfo$dependenc = configInfo.dependence,
      dependence = _configInfo$dependenc === void 0 ? [] : _configInfo$dependenc,
      _configInfo$lazy = configInfo.lazy,
      lazy = _configInfo$lazy === void 0 ? false : _configInfo$lazy,
      _configInfo$filter = configInfo.filter,
      filter = _configInfo$filter === void 0 ? [] : _configInfo$filter,
      _configInfo$form = configInfo.form,
      form = _configInfo$form === void 0 ? false : _configInfo$form,
      _configInfo$paginatio = configInfo.pagination,
      pagination = _configInfo$paginatio === void 0 ? false : _configInfo$paginatio;

  if ((0, _Utils.noValue)(action) || action === 'static') {
    return;
  }

  if (form) {
    lazy = true;
  }

  dependence = [].concat(dependence);

  if (pagination) {
    const dpName = dataName + 'Pagination';
    dependence = dependence.concat(dpName);

    const _ref = typeof pagination === 'object' ? pagination : DataHub.pagination,
          _ref$data = _ref.data,
          data = _ref$data === void 0 ? 'data' : _ref$data,
          _ref$total = _ref.total,
          total = _ref$total === void 0 ? 'total' : _ref$total;

    let value;

    if (dh._config[dpName] && dh._config[dpName].default) {
      value = [].concat(dh._config[dpName].default)[0];
    }

    value = Object.assign(value || {}, {
      [total]: 0
    });
    dh.set(dpName, value);

    dh._controller.after('afterFetcher', (newResult, result, newArgs, args) => {
      if (args[1] === dataName) {
        dh._data[dpName][0][total] = newResult[total];
        return newResult[data];
      }

      return newResult;
    });
  }

  filter = [].concat(filter);

  const $fetch = () => {
    const param = dh._fetchParam[dataName] = dh._fetchParam[dataName] || {};

    for (let depName of dependence) {
      const depData = dh.get(depName);

      if (depData.length === 0) {
        if (dh.get(dataName).length !== 0) {
          dh.set(dataName, []);
        }

        return;
      }

      Object.assign(param, toObjParam(depData[0]));
    }

    for (let filterName of filter) {
      const filterData = dh.get(filterName);

      if (filterData.length === 0) {
        continue;
      }

      Object.assign(param, toObjParam(filterData[0]));
    }

    dh.doFetch(action, dataName, param, {
      form,
      pagination: !!pagination
    });
  };

  dh._executor.register('$refresh:' + dataName, $fetch);

  if (!lazy) {
    if (dependence.length) {
      dh._controller.when(dependence, $fetch);
    }

    if (filter.length) {
      filter.forEach(fName => dh._controller.when(fName, $fetch));
    }

    $fetch();
  }
}

const _dataHubPlugin = {
  action: actionPlugn,
  type: actionPlugn,
  default: (dataName, configInfo, dh) => {
    let _default = configInfo.default;

    if (_default !== undefined && !dh.get(dataName).length) {
      dh.set(dataName, (0, _Utils.snapshot)(_default));
    }
  },
  reset: (dataName, configInfo, dh) => {
    let reset = configInfo.reset,
        _default = configInfo.default;

    if (reset !== undefined) {
      const doReset = _default === undefined ? () => {
        dh.set(dataName, []);
      } : () => {
        dh.set(dataName, (0, _Utils.snapshot)(_default));
      };

      dh._controller.when(reset, doReset);
    }
  },
  clear: (dataName, configInfo, dh) => {
    let clear = configInfo.clear;

    if (clear !== undefined) {
      dh._controller.when(clear, () => {
        dh.set(dataName, []);
      });
    }
  }
};

function _runDataConfigPlugn(cfg, name, info, ds) {
  _dataHubPlugin[cfg] && _dataHubPlugin[cfg](name, info, ds);
}

let DataHub = (_dec33 = ifInvalid(), _dec34 = ifInvalid(), _dec35 = ifInvalid(false), _dec36 = ifInvalid(false), _dec37 = ifInvalid(false), _dec38 = ifInvalid(), _dec39 = ifInvalid(), _dec40 = ifInvalid(), _dec41 = ifInvalid(), _dec42 = ifInvalid(), _dec43 = ifInvalid(), _dec44 = ifInvalid(), _dec45 = ifInvalid(), _dec46 = ifInvalid(), _dec47 = ifInvalid(), _dec48 = ifInvalid(), _dec49 = ifInvalid(), _dec50 = ifInvalid(), (_class4 = class DataHub {
  constructor() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let ControllerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Controller;
    let ExecutorClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Executor;

    if (!_Emitter) {
      throw new Error('must implement Emitter first');
    }

    this.myKey = dataHubKey++;
    this._ControllerClass = ControllerClass;
    this._executor = new ExecutorClass();
    this._emitter = new _Emitter();
    this._controller = this.controller();
    this._lagFetchTimeoutIndex = {};
    this._data = {};
    this._status = {};
    this._fetchParam = {};
    this._config = config;

    this._controller.register('beforeFetcher', _Utils.same);

    this._controller.register('afterFetcher', _Utils.same);

    this._init();
  }

  _init() {
    const config = this._config;

    for (let dataName in config) {
      const configInfo = config[dataName];

      for (let configName in configInfo) {
        _runDataConfigPlugn(configName, dataName, configInfo, this);
      }
    }
  }

  status() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    let name = args[0],
        value = args[1];

    if (args.length === 1) {
      return this._status[name] || 'undefined';
    }

    if (statusList.indexOf(value) === -1) {
      (0, _Utils.errorLog)("".concat(name, " status must be one of ").concat(statusList.join(','), " but it is ").concat(value));
      return;
    }

    if (value !== this._status[name]) {
      this._status[name] = value;

      this._emitter.emit('$statusChange', {
        name,
        value
      });

      this._emitter.emit('$statusChange:' + name, value);
    }
  }

  beforeSet(name, value) {
    return value;
  }

  set(name, value) {
    if (this.status(name) === 'locked') {
      (0, _Utils.errorLog)("can not ".concat(name, " when locked"));
      return;
    }

    if (!this._validate(value)) {
      value = [];
    }

    const data = [].concat(value);
    value = this.beforeSet(name, value);

    if (this._checkChange(name, data)) {
      this._data[name] = data;
      this.status(name, 'set');

      this._emitter.emit('$dataChange', {
        name,
        data
      });

      this._emitter.emit(name, data);
    } else {
      this.status(name, 'set');
    }
  }

  ready(list) {
    return [].concat(list).reduce((a, b) => a && this.status(b) === 'set', true);
  }

  loading(list) {
    return [].concat(list).reduce((a, b) => a || this.status(b) === 'loading', false);
  }

  error(list) {
    return [].concat(list).reduce((a, b) => a || this.status(b) === 'error', false);
  }

  submit(name) {
    let param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const _param$data = param.data,
          data = _param$data === void 0 ? {} : _param$data,
          _param$lock = param.lock,
          lock = _param$lock === void 0 ? [] : _param$lock,
          _param$refresh = param.refresh,
          refresh = _param$refresh === void 0 ? [] : _param$refresh,
          _param$callback = param.callback,
          callback = _param$callback === void 0 ? _Utils.blank : _param$callback;

    if (!this.ready(name) && this.status(name) !== 'undefined') {
      (0, _Utils.errorLog)("".concat(name, " is not ready, can not be submited"));
      return;
    }

    const oldStatus = [].concat(lock).concat(refresh).map(lockName => {
      let old = this.status(lockName);
      this.status(lockName, 'locked');
      return {
        name: lockName,
        status: old
      };
    });
    this.set(name, data);
    this.refresh(name);

    const afterSubmit = data => {
      callback(data);
      oldStatus.forEach((_ref2) => {
        let name = _ref2.name,
            status = _ref2.status;
        this.status(name, status);
      });
      [].concat(refresh).forEach(refreshName => {
        this.refresh(refreshName);
      });
    };

    return new Promise((resolve, reject) => {
      this._controller.once('$fetchEnd:' + name, resultData => {
        if (this.status(name) === 'error') {
          this.set(name, []);
          afterSubmit([]);
          reject([]);
        } else {
          afterSubmit(resultData);
          resolve(resultData);
        }
      });
    });
  }

  emit(name) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    this._emitter.emit(name, ...args);
  }

  bind(that) {
    return DataHub.bind(this, that);
  }

  beforeGet(name, value) {
    return value;
  }

  get(name) {
    return this.beforeGet(name, this._data[name] || []);
  }

  first(name) {
    const a = this.get(name)[0];

    if (a === undefined) {
      return {};
    }

    return a;
  }

  assign0(name, obj) {
    const newObj = Object.assign(this.first(name), obj);
    const data = this.get(name);
    data.splice(0, 1, newObj);
    this.set(name, data);
  }

  snapshot(from, to) {
    this.set(to, (0, _Utils.snapshot)(this.get(from)));
  }

  reset(name) {
    const cfg = this._config[name];

    if (!cfg || cfg.default === undefined) {
      this.delete(name);
    } else {
      this.set(name, (0, _Utils.snapshot)(cfg.default));
    }
  }

  delete(name) {
    delete this._data[name];
    delete this._status[name];
    this.status(name, 'undefined');
    this.emit('$dataChange', {
      name
    });
    this.emit('$delete', name);
  }

  refresh(name) {
    const $refresh = '$refresh:' + name;

    if (this._executor.has($refresh)) {
      this._executor.run($refresh, true);
    } else {
      this._emitter.emit(name, this.get(name));
    }
  }

  _checkChange() {
    return true;
  }

  _validate(value) {
    if (value === undefined) {
      (0, _Utils.errorLog)("".concat(value, " can not be undefined"));
      return false;
    }

    return true;
  }

  doFetch(type, name, param) {
    let extend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    clearTimeout(this._lagFetchTimeoutIndex[name]);
    this._lagFetchTimeoutIndex[name] = setTimeout(() => {
      if (this._invalid) {
        return;
      }

      if (this.status(name) === 'loading') {
        (0, _Utils.errorLog)("".concat(name, " can not be fetched when loading"));
        return;
      }

      this.status(name, 'loading');
      const param = this._fetchParam[name] || {};
      delete this._fetchParam[name];
      Promise.resolve().then(param => this._controller.run('beforeFetcher', param, name, this)).then(param => DataHub.dh._controller.run('beforeFetcher', param, name, this)).then(newParam => {
        if (newParam === _Utils.stopRun || this._invalid) {
          return Promise.reject(_Utils.stopRun);
        }

        return DataHub.dh._controller.run(type, _objectSpread({}, extend, {
          param,
          data: this.get(name)
        }));
      }).then(result => {
        return DataHub.dh._controller.run('afterFetcher', result, name, this);
      }).then(result2 => {
        return this._controller.run('afterFetcher', result2, name, this);
      }).then(newResult => {
        if (newResult === undefined) {
          newResult = [];
        } else {
          newResult = [].concat(newResult);
        }

        this.set(name, newResult);
        this.emit('$fetchEnd', newResult);
        this.emit('$fetchEnd:' + name, newResult);
      }).catch(e => {
        if (this._invalid) {
          return;
        }

        if (e === _Utils.stopRun) {
          this.status(name, 'set');
        } else {
          (0, _Utils.errorLog)(e);

          if (!this._data[name]) {
            this.set(name, []);
          }

          this.status(name, 'error');
          this.emit('$error', e);
          this.emit('$error:' + name, e);
          this.emit('$fetchEnd', e);
          this.emit('$fetchEnd:' + name, e);
        }
      });
    }, lagTime);
  }

  controller() {
    return new this._ControllerClass(this);
  }

  destroy() {
    this._invalid = true;
    Object.keys(this._lagFetchTimeoutIndex).forEach(index => {
      clearTimeout(index);
    });

    this._emitter.emit('$storeDestroy', this._emitter);

    this._controller.destroy();

    this._executor.destroy();

    this._lagFetchTimeoutIndex = null;
    this._executor = null;
    this._emitter = null;
    this._config = null;
    this._data = null;
    this._status = null;
    this._fetchParam = null;
  }

}, (_applyDecoratedDescriptor(_class4.prototype, "status", [_dec33], Object.getOwnPropertyDescriptor(_class4.prototype, "status"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "set", [_dec34], Object.getOwnPropertyDescriptor(_class4.prototype, "set"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "ready", [_dec35], Object.getOwnPropertyDescriptor(_class4.prototype, "ready"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "loading", [_dec36], Object.getOwnPropertyDescriptor(_class4.prototype, "loading"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "error", [_dec37], Object.getOwnPropertyDescriptor(_class4.prototype, "error"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "submit", [_dec38], Object.getOwnPropertyDescriptor(_class4.prototype, "submit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "emit", [_dec39], Object.getOwnPropertyDescriptor(_class4.prototype, "emit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "bind", [_dec40], Object.getOwnPropertyDescriptor(_class4.prototype, "bind"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "get", [_dec41], Object.getOwnPropertyDescriptor(_class4.prototype, "get"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "first", [_dec42], Object.getOwnPropertyDescriptor(_class4.prototype, "first"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "assign0", [_dec43], Object.getOwnPropertyDescriptor(_class4.prototype, "assign0"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "snapshot", [_dec44], Object.getOwnPropertyDescriptor(_class4.prototype, "snapshot"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reset", [_dec45], Object.getOwnPropertyDescriptor(_class4.prototype, "reset"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "delete", [_dec46], Object.getOwnPropertyDescriptor(_class4.prototype, "delete"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "refresh", [_dec47], Object.getOwnPropertyDescriptor(_class4.prototype, "refresh"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "doFetch", [_dec48], Object.getOwnPropertyDescriptor(_class4.prototype, "doFetch"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "controller", [_dec49], Object.getOwnPropertyDescriptor(_class4.prototype, "controller"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "destroy", [_dec50], Object.getOwnPropertyDescriptor(_class4.prototype, "destroy"), _class4.prototype)), _class4));
exports.DataHub = DataHub;

DataHub.addExtendPlugn = (name, callback) => {
  _dataHubPlugin.$[name] = callback;
};

DataHub.addConfigPlugn = (name, callback) => {
  _dataHubPlugin.c[name] = callback;
};

DataHub.instance = config => {
  return new DataHub(config);
};

DataHub.setEmitter = Emitter => {
  if (_Emitter) {
    (0, _Utils.errorLog)('Emitter has implemented, who care!');
  }

  const _pe = Emitter.prototype;
  emitterMethods.forEach(name => {
    if (typeof _pe[name] !== 'function') {
      throw new Error("Emitter must implement ".concat(emitterMethods.join(','), ", but the Emitter do not implement ").concat(name, "."));
    }
  });
  _Emitter = Emitter;
  DataHub.dh = DataHub.instance({});

  DataHub.dh._controller.register('beforeFetcher', _Utils.same);

  DataHub.dh._controller.register('afterFetcher', _Utils.same);

  DataHub.addBeforeFetcher = callback => {
    DataHub.dh._controller.before('beforeFetcher', callback);
  };

  DataHub.addAfterFetcher = callback => {
    DataHub.dh._controller.after('afterFetcher', callback);
  };

  DataHub.addFetcher = (name, callback) => {
    DataHub.dh._controller.register(name, callback);
  };

  ['get', 'set', 'assign0', 'first', 'emit'].forEach(funName => {
    DataHub[funName] = function () {
      return DataHub.dh[funName](...arguments);
    };
  });
  ['when', 'all', 'on', 'once'].forEach(funName => {
    DataHub[funName] = function () {
      return DataHub.dh._controller[funName](...arguments);
    };
  });
};

DataHub.inject = _Utils.blank;
DataHub.bind = _Utils.blank;
DataHub.dhName = 'dh';
DataHub.pDhName = 'pDh';
DataHub.gDhName = 'gDh';
DataHub.dhCName = 'dhController';
DataHub.pDhCName = 'pDhController';
DataHub.gDhCName = 'gDhController';
DataHub.pagination = {
  data: 'data',
  total: 'total'
};

DataHub.bindView = function (dataHub) {
  let updateView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => _Utils.blank;
  return {
    doBind: that => {
      if (that[DataHub.pDhName]) {
        (0, _Utils.errorLog)('dataHub has bound.');
        return;
      }

      that[DataHub.pDhName] = dataHub;
      that[DataHub.pDhCName] = that[DataHub.pDhName].controller();
      that[DataHub.pDhCName].watch(() => updateView.call(that));
    },
    beforeDestroy: (that, _beforeDestroy) => {
      _beforeDestroy && _beforeDestroy.apply(that);
      that[DataHub.pDhCName] && that[DataHub.pDhCName].destroy();
      that[DataHub.pDhCName] = null;
    }
  };
};

DataHub.injectView = function () {
  let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let updateView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => _Utils.blank;
  let gDh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return {
    afterCreated: (that, _afterCreated) => {
      const cfg = !(0, _Utils.noValue)(config);

      if (cfg) {
        that[DataHub.dhName] = DataHub.instance(config);
        that[DataHub.dhCName] = that[DataHub.dhName].controller();
        that[DataHub.dhCName].watch(() => updateView.call(that));
      }

      if (gDh) {
        that[DataHub.gDhName] = DataHub.dh;
        that[DataHub.gDhCName] = DataHub.dh.controller();
        that[DataHub.gDhCName].watch(() => updateView.call(that));
      }

      if (!cfg && !gDh) {
        (0, _Utils.errorLog)('not inject dataHub or globalDataHub, who care!');
      }

      _afterCreated && _afterCreated.apply(that);
    },
    beforeDestroy: (that, _beforeDestroy2) => {
      _beforeDestroy2 && _beforeDestroy2.apply(that);
      that[DataHub.gDhCName] && that[DataHub.gDhCName].destroy();
      that[DataHub.dhName] && that[DataHub.dhName].destroy();
      that[DataHub.dhName] = null;
      that[DataHub.dhCName] = null;
      that[DataHub.gDhCName] = null;
    }
  };
};

DataHub.setLagTime = v => {
  lagTime = +v || 40;
};