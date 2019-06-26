"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _narakuForView = require("./naraku-for-view");

Object.keys(_narakuForView).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _narakuForView[key];
    }
  });
});