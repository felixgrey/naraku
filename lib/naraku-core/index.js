"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require("events");

var _DataHub = require("./DataHub.js");

Object.keys(_DataHub).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _DataHub[key];
    }
  });
});

var _Transformer = require("./Transformer.js");

Object.keys(_Transformer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Transformer[key];
    }
  });
});

var _Utils = require("./Utils.js");

Object.keys(_Utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Utils[key];
    }
  });
});

class NodeEvent extends _events.EventEmitter {
  constructor() {
    super(...arguments);
    this.setMaxListeners(Infinity);
  }

  off() {
    return this.removeListener(...arguments);
  }

  destroy() {
    return this.removeAllListeners();
  }

}

_DataHub.DataHub.setEmitter(NodeEvent);