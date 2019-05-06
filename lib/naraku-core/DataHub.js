"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataHub = exports.Controller = exports.Executor = void 0;

var _Utils = require("./Utils.js");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _class4;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    if ((0, _Utils.noValue)(name) || this._runner[name]) {
      return;
    }

    if (fun === false) {
      delete this._before[name];
      delete this._after[name];
      delete this._runner[name];
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
      return;
    }

    const befores = this._before[name] || [];

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    let newArgs = args;

    for (let before in befores) {
      newArgs = before(newArgs, args);

      if (newArgs === _Utils.stopRun) {
        return _Utils.stopRun;
      }
    }

    const result = this._runner[name](...newArgs);

    const afters = this._after[name] || [];
    let newResult = result;

    for (let after in afters) {
      newResult = after(newResult, result, newArgs, args);
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
let Controller = (_dec7 = ifInvalid(), _dec8 = ifInvalid(), _dec9 = ifInvalid(), _dec10 = ifInvalid(), _dec11 = ifInvalid(), _dec12 = ifInvalid(), _dec13 = ifInvalid(), _dec14 = ifInvalid(_Utils.blank), _dec15 = ifInvalid(false), _dec16 = ifInvalid(), _dec17 = ifInvalid(), _dec18 = ifInvalid(), _dec19 = ifInvalid(), _dec20 = ifInvalid(), _dec21 = ifInvalid(), _dec22 = ifInvalid(_Utils.blank), _dec23 = ifInvalid(_Utils.blank), (_class2 = (_temp = class Controller {
  constructor(_dataHub) {
    _initializerDefineProperty(this, "register", _descriptor, this);

    _initializerDefineProperty(this, "on", _descriptor2, this);

    _initializerDefineProperty(this, "once", _descriptor3, this);

    _initializerDefineProperty(this, "watch", _descriptor4, this);

    _initializerDefineProperty(this, "when", _descriptor5, this);

    _initializerDefineProperty(this, "_when", _descriptor6, this);

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

  emit(name) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    return this._dataHub.emit(name, ...args);
  }

  status() {
    return this._dataHub.status(...arguments);
  }

  load(name, callback) {
    return this.when(name, callback, true);
  }

  ready(list) {
    return this._dataHub.ready(list);
  }

  destroy() {
    this._invalid = true;
    clearTimeout(this._watchTimeoutIndex);

    this._offList.forEach(off => off());

    this._runnerList.forEach(name => {
      this._dataHub._executor.runner(name, false);
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

}, _temp), (_applyDecoratedDescriptor(_class2.prototype, "get", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "get"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "first", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "first"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "refresh", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "refresh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "submit", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "submit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "set", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "set"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "emit", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "emit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "status", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "status"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "load", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "load"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "ready", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "ready"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "destroy", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "destroy"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "run", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "run"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "register", [_dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    return (name, callback) => {
      this._runnerList.push(name);

      this._dataHub._executor.register(name, callback);
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "on", [_dec19], {
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
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "once", [_dec20], {
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
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "watch", [_dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this = this;

    return function (callback) {
      let _once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_this._invalid) {
        return;
      }

      let fun = _once ? 'once' : 'on';

      const onChange = () => {
        if (_this._invalid) {
          return;
        }

        clearTimeout(_this._watchTimeoutIndex);
        _this._watchTimeoutIndex = setTimeout(() => {
          callback();
        }, lagTime);
      };

      _this[fun]('$dataChange', onChange);

      _this[fun]('$statusChange', onChange);

      callback();
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "when", [_dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this2 = this;

    return function (name, callback) {
      let _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Array.isArray(name)) {
        if (name.length === 0) {
          return _Utils.blank;
        }

        let offList = [];

        const wrapedCallback = () => {
          let ready = true;
          let dataList = [];

          for (let _name of name) {
            if (_this2._dataHub.status(_name) !== 'set') {
              ready = false;
              break;
            }

            dataList.push(_this2._dataHub.get(_name));
          }

          if (ready) {
            callback(dataList);
          }
        };

        name.forEach(_name => {
          offList.push(_this2._when(_name, wrapedCallback, _once));
        });
        return () => {
          offList && offList.forEach(off => off());
          offList = null;
        };
      }

      return _this2._when(name, callback, _once);
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_when", [_dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this3 = this;

    return function (name, callback) {
      let _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if ((0, _Utils.noValue)(name)) {
        return _Utils.blank;
      }

      let fun = _once ? 'once' : 'on';

      const wrapedCallback = () => {
        if (_this3._invalid) {
          return;
        }

        callback(_this3._dataHub.get(name));
      };

      if (_this3._dataHub.status(name) === 'set') {
        wrapedCallback();

        if (_once) {
          return _Utils.blank;
        }
      }

      return _this3[fun](name, wrapedCallback);
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

function dependenceAndFilterPlugn(dataName, configInfo, dh) {
  let type = configInfo.type,
      _configInfo$dependenc = configInfo.dependence,
      dependence = _configInfo$dependenc === void 0 ? [] : _configInfo$dependenc,
      _configInfo$lazy = configInfo.lazy,
      lazy = _configInfo$lazy === void 0 ? false : _configInfo$lazy,
      _configInfo$filter = configInfo.filter,
      filter = _configInfo$filter === void 0 ? [] : _configInfo$filter,
      _configInfo$form = configInfo.form,
      form = _configInfo$form === void 0 ? false : _configInfo$form;

  if ((0, _Utils.noValue)(type) || type === 'static') {
    return;
  }

  if (form) {
    lazy = true;
  }

  dependence = [].concat(dependence);
  filter = [].concat(filter);

  const $fetch = () => {
    const param = dh._fetchParam[dataName] = dh._fetchParam[dataName] || {};

    for (let depName of dependence) {
      const depData = dh.get(depName);

      if (depData.length === 0) {
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

    dh.doFetch(type, dataName, param);
  };

  dh._executor.register('$refresh:' + dataName, $fetch);

  if (!lazy) {
    if (dependence.length === 0 && filter.length === 0) {
      $fetch();
      return;
    }

    dh._controller.when(dependence, $fetch);

    filter.forEach(fName => dh._controller.when(fName, $fetch));
  }
}

const _dataHubPlugin = {
  type: dependenceAndFilterPlugn,
  dependence: dependenceAndFilterPlugn,
  filter: dependenceAndFilterPlugn,
  default: (dataName, configInfo, dh) => {
    let _default = configInfo.default;

    if (_default !== undefined) {
      dh.set(dataName, JSON.parse(JSON.stringify(_default)));
    }
  }
};

function _runDataConfigPlugn(cfg, name, info, ds) {
  _dataHubPlugin[cfg] && _dataHubPlugin[cfg](name, info, ds);
}

let DataHub = (_dec24 = ifInvalid(), _dec25 = ifInvalid(), _dec26 = ifInvalid(false), _dec27 = ifInvalid(), _dec28 = ifInvalid(), _dec29 = ifInvalid(), _dec30 = ifInvalid(), _dec31 = ifInvalid(), _dec32 = ifInvalid(), _dec33 = ifInvalid(), _dec34 = ifInvalid(), (_class4 = class DataHub {
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

  set(name, value) {
    if (this.status(name) === 'locked') {
      (0, _Utils.errorLog)("can not ".concat(name, " when locked"));
      return;
    }

    if (!this._validate(value)) {
      value = [];
    }

    const data = [].concat(value);
    this.status(name, 'set');

    if (this._checkChange(name, data)) {
      this._data[name] = data;

      this._emitter.emit('$dataChange', {
        name,
        data
      });

      this._emitter.emit(name, data);
    }
  }

  ready(list) {
    return [].concat(list).reduce((a, b) => a && this.status(b) === 'set', true);
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
      oldStatus.forEach((_ref) => {
        let name = _ref.name,
            status = _ref.status;
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

  get(name) {
    return this._data[name] || [];
  }

  first(name) {
    const a = this.get(name)[0];

    if (a === undefined) {
      return {};
    }

    return a;
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
    clearTimeout(this._lagFetchTimeoutIndex[name]);
    this._lagFetchTimeoutIndex[name] = setTimeout(() => {
      if (this.status(name) === 'loading') {
        (0, _Utils.errorLog)("".concat(name, " can not be fetched when loading"));
        return;
      }

      this.status(name, 'loading');
      const param = this._fetchParam[name];
      delete this._fetchParam[name];
      Promise.resolve(DataHub.dh._controller.run('beforeFetcher', [param, this])).then(newParam => {
        if (newParam === _Utils.stopRun) {
          return Promise.reject(_Utils.stopRun);
        }

        return DataHub.dh._controller.run(type, {
          param,
          data: this.get(name)
        });
      }).then(result => {
        return DataHub.dh._controller.run('afterFetcher', [result, this]);
      }).then(newResult => {
        newResult = [].concat(newResult);
        this.set(name, newResult);
        this.emit('$fetchEnd', newResult);
        this.emit('$fetchEnd:' + name, newResult);
      }).catch(e => {
        if (e === _Utils.stopRun) {
          this.status(name, 'set');
        } else {
          (0, _Utils.errorLog)(e);
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

    this._executor.destroy();

    this._controller.destroy();

    this._lagFetchTimeoutIndex = null;
    this._executor = null;
    this._emitter = null;
    this._config = null;
    this._data = null;
    this._status = null;
    this._fetchParam = null;
  }

}, (_applyDecoratedDescriptor(_class4.prototype, "status", [_dec24], Object.getOwnPropertyDescriptor(_class4.prototype, "status"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "set", [_dec25], Object.getOwnPropertyDescriptor(_class4.prototype, "set"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "ready", [_dec26], Object.getOwnPropertyDescriptor(_class4.prototype, "ready"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "submit", [_dec27], Object.getOwnPropertyDescriptor(_class4.prototype, "submit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "emit", [_dec28], Object.getOwnPropertyDescriptor(_class4.prototype, "emit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "get", [_dec29], Object.getOwnPropertyDescriptor(_class4.prototype, "get"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "first", [_dec30], Object.getOwnPropertyDescriptor(_class4.prototype, "first"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "refresh", [_dec31], Object.getOwnPropertyDescriptor(_class4.prototype, "refresh"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "doFetch", [_dec32], Object.getOwnPropertyDescriptor(_class4.prototype, "doFetch"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "controller", [_dec33], Object.getOwnPropertyDescriptor(_class4.prototype, "controller"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "destroy", [_dec34], Object.getOwnPropertyDescriptor(_class4.prototype, "destroy"), _class4.prototype)), _class4));
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
    (0, _Utils.errorLog)('Emitter has implemented, who care');
  }

  const _pe = Emitter.prototype;
  emitterMethods.forEach(name => {
    if (typeof _pe[name] !== 'function') {
      throw new Error("Emitter must implement ".concat(emitterMethods.join(','), ", but the Emitter do not implement ").concat(name, "."));
    }
  });
  _Emitter = Emitter;
  DataHub.dh = DataHub.instance({});

  const bf = (_ref2) => {
    let _ref3 = _slicedToArray(_ref2, 1),
        a = _ref3[0];

    return a;
  };

  DataHub.dh._controller.register('beforeFetcher', bf);

  DataHub.dh._controller.register('afterFetcher', bf);

  DataHub.addBeforeFetcher = callback => {
    DataHub.dh._controller.before('beforeFetcher', callback);
  };

  DataHub.addAfterFetcher = callback => {
    DataHub.dh._controller.after('afterFetcher', callback);
  };

  DataHub.addFetcher = (name, callback) => {
    DataHub.dh._controller.register(name, callback);
  };
};

DataHub.inject = _Utils.blank;
DataHub.component = _Utils.blank;

DataHub.pageView = function () {
  let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let updateView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => _Utils.blank;
  return {
    afterCreated: (that, _afterCreated) => {
      that._dh = DataHub.instance(config);
      that.dhController = that._dh.controller();
      that.dhController.watch(() => updateView.call(that));
      that.globalDhController = DataHub.dh.controller();
      that.globalDhController.watch(() => updateView.call(that));
      _afterCreated && _afterCreated.apply(that);
    },
    beforeDestroy: (that, _beforeDestroy) => {
      _beforeDestroy && _beforeDestroy.apply(that);
      that.globalDhController.destroy();
      that.globalDhController = null;

      that._dh.destroy();

      that._dh = null;
      that.dhController = null;
    }
  };
};

DataHub.setLagTime = v => {
  lagTime = +v || 40;
};