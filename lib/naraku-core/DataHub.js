"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataHub = exports.Controller = exports.Executor = void 0;

var _Utils = require("./Utils.js");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _temp, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _class4, _temp2, _DataHub$paginationDa;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and set to use loose mode. ' + 'To use proposal-class-properties in spec mode with decorators, wait for ' + 'the next major version of decorators in stage 2.'); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var _Emitter = null;
var dataHubKey = 1;
var lagTime = 40;
var emitterMethods = ['on', 'once', 'emit', 'off', 'destroy'];
var statusList = ['undefined', 'loading', 'locked', 'set', 'error'];

function ifInvalid(result) {
  return function (target, name, descriptor) {
    var oldFun = target[name];

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


var Executor = (_dec = ifInvalid(), _dec2 = ifInvalid(), _dec3 = ifInvalid(), _dec4 = ifInvalid(), _dec5 = ifInvalid(), _dec6 = ifInvalid(), (_class =
/*#__PURE__*/
function () {
  function Executor() {
    _classCallCheck(this, Executor);

    this.myKey = dataHubKey++;
    this._invalid = false;
    this._before = {};
    this._after = {};
    this._runner = {};
  }

  _createClass(Executor, [{
    key: "register",
    value: function register(name, fun) {
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
  }, {
    key: "has",
    value: function has(name) {
      return !!this._runner[name];
    }
  }, {
    key: "before",
    value: function before(name, fun) {
      var _this = this;

      if ((0, _Utils.noValue)(name) || !this._runner[name]) {
        return;
      }

      this._before[name] = this._before[name] || [];

      this._before[name].push(fun);

      return function () {
        if (_this._invalid || !_this._before[name]) {
          return;
        }

        var i = _this._before[name].indexOf(fun);

        if (i !== -1) {
          _this._before[name].selice(i, 1);
        }
      };
    }
  }, {
    key: "after",
    value: function after(name, fun) {
      var _this2 = this;

      if ((0, _Utils.noValue)(name) || !this._runner[name]) {
        return;
      }

      this._after[name] = this._after[name] || [];

      this._after[name].push(fun);

      return function () {
        if (_this2._invalid || !_this2._after[name]) {
          return;
        }

        var i = _this2._after[name].indexOf(fun);

        if (i !== -1) {
          _this2._after[name].selice(i, 1);
        }
      };
    }
  }, {
    key: "run",
    value: function run(name) {
      var _this$_runner;

      if ((0, _Utils.noValue)(name) || !this._runner[name]) {
        (0, _Utils.errorLog)("unknown runner ".concat(name));
        return;
      }

      var befores = this._before[name] || [];

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var newArgs = args;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = befores[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var before = _step.value;
          newArgs = before && before(newArgs, args);

          if (newArgs === _Utils.stopRun) {
            return _Utils.stopRun;
          }
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

      var result = (_this$_runner = this._runner)[name].apply(_this$_runner, _toConsumableArray(newArgs));

      var afters = this._after[name] || [];
      var newResult = result;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = afters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var after = _step2.value;
          newResult = after && after(newResult, result, newArgs, args);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return newResult;
    }
  }, {
    key: "destroy",
    value: function destroy(name) {
      this._invalid = true;
      this._before = null;
      this._after = null;
      this._runner = null;
    }
  }]);

  return Executor;
}(), (_applyDecoratedDescriptor(_class.prototype, "register", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "register"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "has", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "has"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "before", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "before"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "after", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "after"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "run", [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, "run"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "destroy", [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, "destroy"), _class.prototype)), _class));
/*
  DateHub控制器 
*/

exports.Executor = Executor;
var Controller = (_dec7 = ifInvalid(), _dec8 = ifInvalid(), _dec9 = ifInvalid(), _dec10 = ifInvalid(), _dec11 = ifInvalid(), _dec12 = ifInvalid(), _dec13 = ifInvalid(), _dec14 = ifInvalid(), _dec15 = ifInvalid(), _dec16 = ifInvalid(), _dec17 = ifInvalid(), _dec18 = ifInvalid(), _dec19 = ifInvalid(), _dec20 = ifInvalid(), _dec21 = ifInvalid(), _dec22 = ifInvalid(), _dec23 = ifInvalid(false), _dec24 = ifInvalid(false), _dec25 = ifInvalid(), _dec26 = ifInvalid(), _dec27 = ifInvalid(), _dec28 = ifInvalid(), _dec29 = ifInvalid(), _dec30 = ifInvalid(), _dec31 = ifInvalid(), _dec32 = ifInvalid(_Utils.blank), _dec33 = ifInvalid(_Utils.blank), _dec34 = ifInvalid(_Utils.blank), (_class2 = (_temp =
/*#__PURE__*/
function () {
  function Controller(_dataHub) {
    var _this3 = this;

    _classCallCheck(this, Controller);

    _initializerDefineProperty(this, "run", _descriptor, this);

    _initializerDefineProperty(this, "get", _descriptor2, this);

    _initializerDefineProperty(this, "hasRunner", _descriptor3, this);

    _initializerDefineProperty(this, "hasData", _descriptor4, this);

    _initializerDefineProperty(this, "first", _descriptor5, this);

    _initializerDefineProperty(this, "refresh", _descriptor6, this);

    _initializerDefineProperty(this, "submit", _descriptor7, this);

    _initializerDefineProperty(this, "set", _descriptor8, this);

    _initializerDefineProperty(this, "assign0", _descriptor9, this);

    _initializerDefineProperty(this, "deleteData", _descriptor10, this);

    _initializerDefineProperty(this, "emit", _descriptor11, this);

    _initializerDefineProperty(this, "link", _descriptor12, this);

    _initializerDefineProperty(this, "snapshot", _descriptor13, this);

    _initializerDefineProperty(this, "reset", _descriptor14, this);

    _initializerDefineProperty(this, "status", _descriptor15, this);

    _initializerDefineProperty(this, "loading", _descriptor16, this);

    _initializerDefineProperty(this, "ready", _descriptor17, this);

    _initializerDefineProperty(this, "register", _descriptor18, this);

    _initializerDefineProperty(this, "before", _descriptor19, this);

    _initializerDefineProperty(this, "after", _descriptor20, this);

    _initializerDefineProperty(this, "on", _descriptor21, this);

    _initializerDefineProperty(this, "fetch", _descriptor22, this);

    _initializerDefineProperty(this, "once", _descriptor23, this);

    _initializerDefineProperty(this, "watch", _descriptor24, this);

    this._checkReady = function (name) {
      if (_this3._invalid) {
        return {
          ready: false
        };
      }

      var dataList = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = name[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _name = _step3.value;

          if (_this3._dataHub.status(_name) !== 'set') {
            return {
              ready: false
            };
          }

          dataList.push(_this3._dataHub.get(_name));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return {
        ready: true,
        dataList: dataList
      };
    };

    _initializerDefineProperty(this, "when", _descriptor25, this);

    _initializerDefineProperty(this, "all", _descriptor26, this);

    _initializerDefineProperty(this, "_when", _descriptor27, this);

    this.myKey = dataHubKey++;
    this._dataHub = _dataHub;
    this._emitter = _dataHub._emitter;
    this._invalid = false;
    this._offList = [];
    this._runnerList = [];
  }

  _createClass(Controller, [{
    key: "destroy",
    value: function destroy() {
      var _this4 = this;

      this._invalid = true;
      clearTimeout(this._watchTimeoutIndex);

      this._offList.forEach(function (off) {
        return off();
      });

      this._runnerList.forEach(function (name) {
        _this4._dataHub._executor && _this4._dataHub._executor.register(name, false);
      });

      this._runnerList = null;
      this._offList = null;
      this._dataHub = null;
      this._emitter = null;
    }
  }]);

  return Controller;
}(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "destroy", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "destroy"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "run", [_dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this5 = this;

    return function (name) {
      var _this5$_dataHub$_exec;

      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return (_this5$_dataHub$_exec = _this5._dataHub._executor).run.apply(_this5$_dataHub$_exec, [name].concat(args));
    };
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "get", [_dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this6 = this;

    return function (name) {
      return _this6._dataHub.get(name);
    };
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "hasRunner", [_dec10], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this7 = this;

    return function (name) {
      return _this7._dataHub._executor.has(name);
    };
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "hasData", [_dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this8 = this;

    return function (name) {
      return _this8._dataHub.hasData(name);
    };
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "first", [_dec12], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this9 = this;

    return function (name) {
      return _this9._dataHub.first(name);
    };
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "refresh", [_dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this10 = this;

    return function (name) {
      return _this10._dataHub.refresh(name);
    };
  }
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "submit", [_dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this11 = this;

    return function (name, param) {
      return _this11._dataHub.submit(name, param);
    };
  }
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "set", [_dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this12 = this;

    return function (name, value) {
      return _this12._dataHub.set(name, value);
    };
  }
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "assign0", [_dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this13 = this;

    return function (name, obj) {
      return _this13._dataHub.assign0(name, obj);
    };
  }
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "deleteData", [_dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this14 = this;

    return function (name) {
      return _this14._dataHub.delete(name);
    };
  }
}), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "emit", [_dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this15 = this;

    return function (name) {
      var _this15$_dataHub;

      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return (_this15$_dataHub = _this15._dataHub).emit.apply(_this15$_dataHub, [name].concat(args));
    };
  }
}), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "link", [_dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this16 = this;

    return function (name, dh2) {
      var dh2c = dh2.controller();
      var dh2Off = dh2c.when(name, function (data) {
        _this16.set(name, data);
      });
      var hasOff = false;

      var off = function off() {
        if (!hasOff) {
          hasOff = true;
          dh2c.destroy();

          _this16.delete(name);
        }
      };

      dh2._emitter.on('$storeDestroy', off);

      return off;
    };
  }
}), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "snapshot", [_dec20], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this17 = this;

    return function (from, to) {
      return _this17._dataHub.snapshot(from, to);
    };
  }
}), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "reset", [_dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this18 = this;

    return function (name) {
      return _this18._dataHub.reset(name);
    };
  }
}), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "status", [_dec22], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this19 = this;

    return function () {
      var _this19$_dataHub;

      return (_this19$_dataHub = _this19._dataHub).status.apply(_this19$_dataHub, arguments);
    };
  }
}), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "loading", [_dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this20 = this;

    return function (list) {
      return _this20._dataHub.loading(list);
    };
  }
}), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "ready", [_dec24], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this21 = this;

    return function (list) {
      return _this21._dataHub.ready(list);
    };
  }
}), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "register", [_dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this22 = this;

    return function (name, callback) {
      _this22._runnerList.push(name);

      _this22._dataHub._executor.register(name, callback);
    };
  }
}), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "before", [_dec26], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this23 = this;

    return function (name, callback) {
      _this23._dataHub._executor.before(name, callback);
    };
  }
}), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "after", [_dec27], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this24 = this;

    return function (name, callback) {
      _this24._dataHub._executor.after(name, callback);
    };
  }
}), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "on", [_dec28], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this25 = this;

    return function (name, callback) {
      if (_this25._invalid) {
        return;
      }

      _this25._emitter.on(name, callback);

      return function () {
        _this25._emitter.off(name, callback);
      };
    };
  }
}), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "fetch", [_dec29], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this26 = this;

    return function (type) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var tempDataName = '' + Math.random();

      _this26._dataHub.doFetch(type, tempDataName, param, {});

      return new Promise(function (resolve) {
        _this26.once('$fetchEnd:' + tempDataName, function (data) {
          resolve(data);

          _this26._dataHub.delete(tempDataName);
        });
      });
    };
  }
}), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "once", [_dec30], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this27 = this;

    return function (name, callback) {
      if (_this27._invalid) {
        return;
      }

      _this27._emitter.once(name, callback);

      return function () {
        _this27._emitter.off(name, callback);
      };
    };
  }
}), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "watch", [_dec31], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this28 = this;

    return function (callback) {
      var _once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (_this28._invalid) {
        return;
      }

      var fun = _once ? 'once' : 'on';

      var onChange = function onChange() {
        if (_this28._invalid) {
          return;
        }

        clearTimeout(_this28._watchTimeoutIndex);
        _this28._watchTimeoutIndex = setTimeout(function () {
          callback();
        }, lagTime);
      };

      _this28[fun]('$dataChange', onChange);

      _this28[fun]('$statusChange', onChange);

      callback();
    };
  }
}), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "when", [_dec32], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this29 = this;

    return function (name, callback) {
      var _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Array.isArray(name)) {
        if (name.length === 0) {
          return _Utils.blank;
        }

        var offList = [];

        var wrapedCallback = function wrapedCallback() {
          var _this29$_checkReady = _this29._checkReady(name),
              ready = _this29$_checkReady.ready,
              dataList = _this29$_checkReady.dataList;

          if (ready) {
            callback(dataList);
          }
        };

        var _this29$_checkReady2 = _this29._checkReady(name),
            ready = _this29$_checkReady2.ready,
            dataList = _this29$_checkReady2.dataList;

        if (ready) {
          callback(dataList);

          if (_once) {
            return _Utils.blank;
          }
        }

        var fun = _once ? 'once' : 'on';
        name.forEach(function (_name) {
          offList.push(_this29[fun](_name, wrapedCallback));
        });
        return function () {
          offList && offList.forEach(function (off) {
            return off();
          });
          offList = null;
        };
      }

      return _this29._when(name, callback, _once);
    };
  }
}), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "all", [_dec33], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this30 = this;

    return function (name, callback) {
      name = [].concat(name);
      var offList = [];
      var stop = false;

      var infiniteOnce = function infiniteOnce() {
        if (_this30._invalid) {
          return;
        }

        Promise.all(name.map(function (_n) {
          return new Promise(function (r) {
            offList.push(_this30.once(_n, r));
          });
        })).then(function () {
          callback(_this30._checkReady(name).dataList);
          offList = [];
          !stop && infiniteOnce();
        });
      };

      infiniteOnce();

      var _this30$_checkReady = _this30._checkReady(name),
          ready = _this30$_checkReady.ready,
          dataList = _this30$_checkReady.dataList;

      if (ready) {
        callback(dataList);
      }

      return function () {
        stop = true;
        offList.forEach(function (off) {
          return off();
        });
      };
    };
  }
}), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "_when", [_dec34], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function initializer() {
    var _this31 = this;

    return function (name, callback) {
      var _once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if ((0, _Utils.noValue)(name)) {
        return _Utils.blank;
      }

      var fun = _once ? 'once' : 'on';

      var wrapedCallback = function wrapedCallback() {
        if (_this31._invalid) {
          return;
        }

        callback(_this31._dataHub.get(name));
      };

      if (_this31._dataHub.status(name) === 'set') {
        wrapedCallback();

        if (_once) {
          return _Utils.blank;
        }
      }

      return _this31[fun](name, wrapedCallback);
    };
  }
})), _class2));
exports.Controller = Controller;

function toObjParam(param) {
  if ((0, _Utils.noValue)(param)) {
    return {};
  }

  if (_typeof(param) !== 'object') {
    return {
      data: param
    };
  }

  return param;
}

function actionPlugn(dataName, configInfo, dh) {
  var _configInfo$action = configInfo.action,
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
    var dpName = dataName + 'Pagination';
    dependence = dependence.concat(dpName);

    if (_typeof(pagination) !== 'object') {
      pagination = {};
    }

    pagination = Object.assign({}, DataHub.pagination, pagination);
    var _pagination = pagination,
        data = _pagination.data,
        total = _pagination.total,
        page = _pagination.page,
        limit = _pagination.limit;
    var value = {};

    if (dh._config[dpName] && dh._config[dpName].default) {
      var pgData = (0, _Utils.snapshot)(dh._config[dpName].default);
      value = [].concat(pgData)[0] || {};
    }

    value = Object.assign((0, _Utils.snapshot)(DataHub.paginationData), value);
    dh.set(dpName, value);

    dh._controller.after('beforeFetcher', function (newParam, param, newArgs, args) {
      if (newParam && args[1] === dataName) {
        newParam = _objectSpread({}, newParam);
        delete newParam[total];
      }

      return newParam;
    });

    dh._controller.after('afterFetcher', function (newResult, result, newArgs, args) {
      if (args[1] === dataName) {
        dh._data[dpName][0][total] = newResult[total];
        return newResult[data];
      }

      return newResult;
    });
  }

  filter = [].concat(filter);

  var $fetch = function $fetch() {
    var param = dh._fetchParam[dataName] = dh._fetchParam[dataName] || {};
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = dependence[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var depName = _step4.value;
        var depData = dh.get(depName);

        if (depData.length === 0) {
          if (dh.get(dataName).length !== 0) {
            dh.set(dataName, []);
          }

          return;
        }

        Object.assign(param, toObjParam(depData[0]));
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = filter[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var filterName = _step5.value;
        var filterData = dh.get(filterName);

        if (filterData.length === 0) {
          continue;
        }

        Object.assign(param, toObjParam(filterData[0]));
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    dh.doFetch(action, dataName, param, {
      form: form,
      pagination: !!pagination
    });
  };

  var lockList = dependence.concat(filter);
  var unlock = _Utils.blank;

  dh._controller.on('$statusChange:' + dataName, function (status) {
    if (status === 'loading') {
      unlock = dh.lock(lockList);
    } else {
      unlock();
    }
  });

  dh._executor.register('$refresh:' + dataName, $fetch);

  if (!lazy) {
    if (dependence.length) {
      dh._controller.when(dependence, $fetch);
    }

    if (filter.length) {
      filter.forEach(function (fName) {
        return dh._controller.when(fName, $fetch);
      });
    }

    $fetch();
  }
}

var _dataHubPlugin = {
  action: actionPlugn,
  type: actionPlugn,
  default: function _default(dataName, configInfo, dh) {
    var _default = configInfo.default;

    if (_default !== undefined && !dh.get(dataName).length) {
      dh.set(dataName, (0, _Utils.snapshot)(_default));
    }
  },
  reset: function reset(dataName, configInfo, dh) {
    var reset = configInfo.reset,
        _default = configInfo.default;

    if (reset !== undefined) {
      var doReset = _default === undefined ? function () {
        dh.set(dataName, []);
      } : function () {
        dh.set(dataName, (0, _Utils.snapshot)(_default));
      };

      dh._controller.when(reset, doReset);
    }
  },
  clear: function clear(dataName, configInfo, dh) {
    var clear = configInfo.clear;

    if (clear !== undefined) {
      dh._controller.when(clear, function () {
        dh.set(dataName, []);
      });
    }
  }
};

function _runDataConfigPlugn(cfg, name, info, ds) {
  _dataHubPlugin[cfg] && _dataHubPlugin[cfg](name, info, ds);
}

var DataHub = (_dec35 = ifInvalid(), _dec36 = ifInvalid(), _dec37 = ifInvalid(false), _dec38 = ifInvalid(false), _dec39 = ifInvalid(false), _dec40 = ifInvalid(false), _dec41 = ifInvalid(), _dec42 = ifInvalid(), _dec43 = ifInvalid(), _dec44 = ifInvalid(), _dec45 = ifInvalid(), _dec46 = ifInvalid(), _dec47 = ifInvalid(), _dec48 = ifInvalid(), _dec49 = ifInvalid(), _dec50 = ifInvalid(), _dec51 = ifInvalid(), _dec52 = ifInvalid(), _dec53 = ifInvalid(), _dec54 = ifInvalid(), (_class4 = (_temp2 =
/*#__PURE__*/
function () {
  function DataHub() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var ControllerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Controller;
    var ExecutorClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Executor;

    _classCallCheck(this, DataHub);

    this.deleteData = this.delete;

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

  _createClass(DataHub, [{
    key: "_init",
    value: function _init() {
      var config = this._config;

      for (var dataName in config) {
        var configInfo = config[dataName];

        for (var configName in configInfo) {
          _runDataConfigPlugn(configName, dataName, configInfo, this);
        }
      }
    }
  }, {
    key: "status",
    value: function status() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      var name = args[0],
          value = args[1];

      if (args.length === 1) {
        return this._status[name] || 'undefined';
      }

      if (statusList.indexOf(value) === -1) {
        (0, _Utils.errorLog)("".concat(name, " status must be one of ").concat(statusList.join(','), " but it is ").concat(value));
        return;
      }

      if (value !== (this._status[name] || 'undefined')) {
        this._status[name] = value;

        this._emitter.emit('$statusChange', {
          name: name,
          value: value
        });

        this._emitter.emit('$statusChange:' + name, value);
      }
    }
  }, {
    key: "beforeSet",
    value: function beforeSet(name, value) {
      return value;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      if (this.status(name) === 'locked') {
        (0, _Utils.errorLog)("can not ".concat(name, " when locked"));
        return;
      }

      if (!this._validate(value)) {
        value = [];
      }

      var data = [].concat(value);
      value = this.beforeSet(name, value);

      if (this._checkChange(name, data)) {
        this._data[name] = data;
        this.status(name, 'set');

        this._emitter.emit('$dataChange', {
          name: name,
          data: data
        });

        this._emitter.emit(name, data);
      } else {
        this.status(name, 'set');
      }
    }
  }, {
    key: "ready",
    value: function ready(list) {
      var _this32 = this;

      return [].concat(list).reduce(function (a, b) {
        return a && _this32.status(b) === 'set';
      }, true);
    }
  }, {
    key: "loading",
    value: function loading(list) {
      var _this33 = this;

      return [].concat(list).reduce(function (a, b) {
        return a || _this33.status(b) === 'loading';
      }, false);
    }
  }, {
    key: "error",
    value: function error(list) {
      var _this34 = this;

      return [].concat(list).reduce(function (a, b) {
        return a || _this34.status(b) === 'error';
      }, false);
    }
  }, {
    key: "hasData",
    value: function hasData(name) {
      return this.status(name) !== 'undefined';
    }
  }, {
    key: "lock",
    value: function lock(names) {
      var _this35 = this;

      var oldStatus = [];
      var unlock = false;
      names = [].concat(names);
      names.forEach(function (name) {
        oldStatus.push(_this35.status(name));

        _this35.status(name, 'locked');
      });
      return function () {
        if (!unlock) {
          unlock = true;
          names.forEach(function (name, index) {
            _this35.status(name, oldStatus[index]);
          });
        }
      };
    }
  }, {
    key: "submit",
    value: function submit(name) {
      var _this36 = this;

      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _param$data = param.data,
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

      var unlock = this.lock([].concat(lock).concat(refresh));
      this.set(name, data);
      this.refresh(name);

      var afterSubmit = function afterSubmit(data) {
        callback(data);
        unlock();
        [].concat(refresh).forEach(function (refreshName) {
          _this36.refresh(refreshName);
        });
      };

      return new Promise(function (resolve, reject) {
        _this36._controller.once('$fetchEnd:' + name, function (resultData) {
          if (_this36.status(name) === 'error') {
            _this36.set(name, []);

            afterSubmit([]);
            reject([]);
          } else {
            afterSubmit(resultData);
            resolve(resultData);
          }
        });
      });
    }
  }, {
    key: "emit",
    value: function emit(name) {
      var _this$_emitter;

      for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
        args[_key6 - 1] = arguments[_key6];
      }

      (_this$_emitter = this._emitter).emit.apply(_this$_emitter, [name].concat(args));
    }
  }, {
    key: "bind",
    value: function bind(that) {
      return DataHub.bind(this, that);
    }
  }, {
    key: "beforeGet",
    value: function beforeGet(name, value) {
      return value;
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.beforeGet(name, this._data[name] || []);
    }
  }, {
    key: "first",
    value: function first(name) {
      var a = this.get(name)[0];

      if (a === undefined) {
        return {};
      }

      return a;
    }
  }, {
    key: "assign0",
    value: function assign0(name, obj) {
      var newObj = Object.assign(this.first(name), obj);
      var data = this.get(name);
      data.splice(0, 1, newObj);
      this.set(name, data);
    }
  }, {
    key: "snapshot",
    value: function snapshot(from, to) {
      this.set(to, (0, _Utils.snapshot)(this.get(from)));
    }
  }, {
    key: "reset",
    value: function reset(name) {
      var cfg = this._config[name];

      if (!cfg || cfg.default === undefined) {
        this.delete(name);
      } else {
        this.set(name, (0, _Utils.snapshot)(cfg.default));
      }
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      delete this._data[name];
      this.status(name, 'undefined');
      delete this._status[name];
      this.emit('$dataChange', {
        name: name
      });
      this.emit('$delete:' + name);
    }
  }, {
    key: "refresh",
    value: function refresh(name) {
      var $refresh = '$refresh:' + name;

      if (this._executor.has($refresh)) {
        this._executor.run($refresh, true);
      } else {
        this._emitter.emit(name, this.get(name));
      }
    }
  }, {
    key: "_checkChange",
    value: function _checkChange() {
      return true;
    }
  }, {
    key: "_validate",
    value: function _validate(value) {
      if (value === undefined) {
        (0, _Utils.errorLog)("".concat(value, " can not be undefined"));
        return false;
      }

      return true;
    }
  }, {
    key: "doFetch",
    value: function doFetch(action, name) {
      var _this37 = this;

      var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var extend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      clearTimeout(this._lagFetchTimeoutIndex[name]);
      this._lagFetchTimeoutIndex[name] = setTimeout(function () {
        if (_this37._invalid) {
          return;
        }

        if (_this37.status(name) === 'loading') {
          (0, _Utils.errorLog)("".concat(name, " can not be fetched when loading"));
          return;
        }

        _this37.status(name, 'loading');

        delete _this37._fetchParam[name];
        param = (0, _Utils.snapshot)(param);
        Promise.resolve(param).then(function (param) {
          return _this37._controller.run('beforeFetcher', param, name, _this37);
        }).then(function (param) {
          return DataHub.dh._controller.run('beforeFetcher', param, name, _this37);
        }).then(function (newParam) {
          if (newParam === _Utils.stopRun || _this37._invalid) {
            return Promise.reject(_Utils.stopRun);
          }

          return DataHub.dh._controller.run(action, _objectSpread({}, extend, {
            param: newParam,
            data: (0, _Utils.snapshot)(_this37.get(name))
          }));
        }).then(function (result) {
          return DataHub.dh._controller.run('afterFetcher', result, name, _this37);
        }).then(function (result2) {
          return _this37._controller.run('afterFetcher', result2, name, _this37);
        }).then(function (newResult) {
          if (newResult === undefined) {
            newResult = [];
          } else {
            newResult = [].concat(newResult);
          }

          _this37.set(name, newResult);

          _this37.emit('$fetchEnd', newResult);

          _this37.emit('$fetchEnd:' + name, newResult);
        }).catch(function (e) {
          if (_this37._invalid) {
            return;
          }

          if (e === _Utils.stopRun) {
            _this37.status(name, 'set');
          } else {
            (0, _Utils.errorLog)(e);

            if (!_this37._data[name]) {
              _this37.set(name, []);
            }

            _this37.status(name, 'error');

            _this37.emit('$error', e);

            _this37.emit('$error:' + name, e);

            _this37.emit('$fetchEnd', e);

            _this37.emit('$fetchEnd:' + name, e);
          }
        });
      }, lagTime);
    }
  }, {
    key: "controller",
    value: function controller() {
      return new this._ControllerClass(this);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._invalid = true;
      Object.keys(this._lagFetchTimeoutIndex).forEach(function (index) {
        clearTimeout(index);
      });

      this._emitter.emit('$storeDestroy', this._emitter);

      this._controller.destroy();

      this._executor.destroy();

      this._emitter.destroy();

      this._lagFetchTimeoutIndex = null;
      this._executor = null;
      this._emitter = null;
      this._config = null;
      this._data = null;
      this._status = null;
      this._fetchParam = null;
    }
  }]);

  return DataHub;
}(), _temp2), (_applyDecoratedDescriptor(_class4.prototype, "status", [_dec35], Object.getOwnPropertyDescriptor(_class4.prototype, "status"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "set", [_dec36], Object.getOwnPropertyDescriptor(_class4.prototype, "set"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "ready", [_dec37], Object.getOwnPropertyDescriptor(_class4.prototype, "ready"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "loading", [_dec38], Object.getOwnPropertyDescriptor(_class4.prototype, "loading"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "error", [_dec39], Object.getOwnPropertyDescriptor(_class4.prototype, "error"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "hasData", [_dec40], Object.getOwnPropertyDescriptor(_class4.prototype, "hasData"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "lock", [_dec41], Object.getOwnPropertyDescriptor(_class4.prototype, "lock"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "submit", [_dec42], Object.getOwnPropertyDescriptor(_class4.prototype, "submit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "emit", [_dec43], Object.getOwnPropertyDescriptor(_class4.prototype, "emit"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "bind", [_dec44], Object.getOwnPropertyDescriptor(_class4.prototype, "bind"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "get", [_dec45], Object.getOwnPropertyDescriptor(_class4.prototype, "get"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "first", [_dec46], Object.getOwnPropertyDescriptor(_class4.prototype, "first"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "assign0", [_dec47], Object.getOwnPropertyDescriptor(_class4.prototype, "assign0"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "snapshot", [_dec48], Object.getOwnPropertyDescriptor(_class4.prototype, "snapshot"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "reset", [_dec49], Object.getOwnPropertyDescriptor(_class4.prototype, "reset"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "delete", [_dec50], Object.getOwnPropertyDescriptor(_class4.prototype, "delete"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "refresh", [_dec51], Object.getOwnPropertyDescriptor(_class4.prototype, "refresh"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "doFetch", [_dec52], Object.getOwnPropertyDescriptor(_class4.prototype, "doFetch"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "controller", [_dec53], Object.getOwnPropertyDescriptor(_class4.prototype, "controller"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "destroy", [_dec54], Object.getOwnPropertyDescriptor(_class4.prototype, "destroy"), _class4.prototype)), _class4));
exports.DataHub = DataHub;

DataHub.addExtendPlugn = function (name, callback) {
  _dataHubPlugin.$[name] = callback;
};

DataHub.addConfigPlugn = function (name, callback) {
  _dataHubPlugin.c[name] = callback;
};

DataHub.instance = function (config) {
  return new DataHub(config);
};

DataHub.setEmitter = function (Emitter) {
  if (_Emitter) {
    (0, _Utils.errorLog)('Emitter has implemented, who care!');
  }

  var _pe = Emitter.prototype;
  emitterMethods.forEach(function (name) {
    if (typeof _pe[name] !== 'function') {
      throw new Error("Emitter must implement ".concat(emitterMethods.join(','), ", but the Emitter do not implement ").concat(name, "."));
    }
  });
  _Emitter = Emitter;
  DataHub.dh = DataHub.instance({});

  DataHub.dh._controller.register('beforeFetcher', _Utils.same);

  DataHub.dh._controller.register('afterFetcher', _Utils.same);

  DataHub.addBeforeFetcher = function (callback) {
    DataHub.dh._controller.before('beforeFetcher', callback);
  };

  DataHub.addAfterFetcher = function (callback) {
    DataHub.dh._controller.after('afterFetcher', callback);
  };

  DataHub.addFetcher = function (name, callback) {
    DataHub.dh._controller.register(name, callback);
  };

  ['get', 'set', 'assign0', 'first', 'emit'].forEach(function (funName) {
    DataHub[funName] = function () {
      var _DataHub$dh;

      return (_DataHub$dh = DataHub.dh)[funName].apply(_DataHub$dh, arguments);
    };
  });
  ['when', 'all', 'on', 'once'].forEach(function (funName) {
    DataHub[funName] = function () {
      var _DataHub$dh$_controll;

      return (_DataHub$dh$_controll = DataHub.dh._controller)[funName].apply(_DataHub$dh$_controll, arguments);
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
  total: 'total',
  page: 'page',
  limit: 'limit'
};
DataHub.paginationData = (_DataHub$paginationDa = {}, _defineProperty(_DataHub$paginationDa, DataHub.pagination.page, 1), _defineProperty(_DataHub$paginationDa, DataHub.pagination.limit, 10), _defineProperty(_DataHub$paginationDa, DataHub.pagination.total, 0), _DataHub$paginationDa);

DataHub.bindView = function (dataHub) {
  var updateView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return _Utils.blank;
  };
  return {
    doBind: function doBind(that) {
      if (that[DataHub.pDhName]) {
        (0, _Utils.errorLog)('dataHub has bound.');
        return;
      }

      that[DataHub.pDhName] = dataHub;
      that[DataHub.pDhCName] = that[DataHub.pDhName].controller();
      that[DataHub.pDhCName].watch(function () {
        return updateView.call(that);
      });
    },
    beforeDestroy: function beforeDestroy(that, _beforeDestroy) {
      _beforeDestroy && _beforeDestroy.apply(that);
      that[DataHub.pDhCName] && that[DataHub.pDhCName].destroy();
      that[DataHub.pDhCName] = null;
    }
  };
};

DataHub.injectView = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var updateView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return _Utils.blank;
  };
  var gDh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return {
    afterCreated: function afterCreated(that, _afterCreated) {
      var cfg = !(0, _Utils.noValue)(config);

      if (cfg) {
        that[DataHub.dhName] = DataHub.instance(config);
        that[DataHub.dhCName] = that[DataHub.dhName].controller();
        that[DataHub.dhCName].watch(function () {
          return updateView.call(that);
        });
      }

      if (gDh) {
        that[DataHub.gDhName] = DataHub.dh;
        that[DataHub.gDhCName] = DataHub.dh.controller();
        that[DataHub.gDhCName].watch(function () {
          return updateView.call(that);
        });
      }

      if (!cfg && !gDh) {
        (0, _Utils.errorLog)('not inject dataHub or globalDataHub, who care!');
      }

      _afterCreated && _afterCreated.apply(that);
    },
    beforeDestroy: function beforeDestroy(that, _beforeDestroy2) {
      _beforeDestroy2 && _beforeDestroy2.apply(that);
      that[DataHub.gDhCName] && that[DataHub.gDhCName].destroy();
      that[DataHub.dhName] && that[DataHub.dhName].destroy();
      that[DataHub.dhName] = null;
      that[DataHub.dhCName] = null;
      that[DataHub.gDhCName] = null;
    }
  };
};

DataHub.setLagTime = function (v) {
  lagTime = +v || 40;
};