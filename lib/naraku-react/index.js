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
let changeIndex = 0;

_narakuCore.DataHub.inject = config => {
  return Component => {
    const _DataHub$pageView = _narakuCore.DataHub.pageView(config, function (dataHub) {
      this.setState({
        changeIndex: changeIndex++
      });
    }),
          afterCreated = _DataHub$pageView.afterCreated,
          beforeDestroy = _DataHub$pageView.beforeDestroy; // componentWillMount


    const componentWillMount = Component.prototype.componentWillMount;

    Component.prototype.componentWillMount = function () {
      afterCreated(this, componentWillMount);
    }; // componentWillUnmount


    const componentWillUnmount = Component.prototype.componentWillUnmount;

    Component.prototype.componentWillUnmount = function () {
      beforeDestroy(this, componentWillUnmount);
    };

    return Component;
  };
};