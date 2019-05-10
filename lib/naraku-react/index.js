"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Utils = require("../naraku-core/Utils.js");

var _narakuReactVue = require("../naraku-react-vue");

Object.keys(_narakuReactVue).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _narakuReactVue[key];
    }
  });
});
(0, _Utils.errorLog)("this package is deprecated , please use [import 'naraku'] replace [import 'naraku/lib/naraku-react']");