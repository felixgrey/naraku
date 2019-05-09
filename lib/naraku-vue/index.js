"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require("events");

var _narakuCore = require("../naraku-core");

Object.keys(_narakuCore).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _narakuCore[key];
    }
  });
});

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let changeIndex = 0;

_narakuCore.DataHub.inject = (config, gDh) => {
  return Component => {
    if (typeof Component === 'function') {
      Component = new Component().vue || {};
    }

    const _DataHub$pageView = _narakuCore.DataHub.pageView(config, function (dataHub, gDh) {
      this.changeIndex = changeIndex++;
    }),
          afterCreated = _DataHub$pageView.afterCreated,
          beforeDestroy = _DataHub$pageView.beforeDestroy; // created


    const created = Component.created;

    Component.created = function () {
      afterCreated(this, created);
    }; // beforeDestroy


    const _beforeDestroy = Component.beforeDestroy;

    Component.beforeDestroy = function () {
      beforeDestroy(this, _beforeDestroy);
    }; // data


    const oldData = Component.data || _narakuCore.blank;

    if (typeof oldData === 'function') {
      Component.data = function () {
        const result = _objectSpread({}, oldData.bind(this)(), {
          changeIndex: 0
        });

        return result;
      };
    } else {
      Component.data = _objectSpread({}, oldData, {
        changeIndex: 0
      });
    }

    return Component;
  };
};