"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function reactInject(Component, config, gDh) {
  var _DataHub$injectView = _narakuCore.DataHub.injectView(config, function () {
    this.forceUpdate();
  }, gDh),
      afterCreated = _DataHub$injectView.afterCreated,
      beforeDestroy = _DataHub$injectView.beforeDestroy; // componentWillMount


  var componentWillMount = Component.prototype.componentWillMount;

  Component.prototype.componentWillMount = function () {
    afterCreated(this, componentWillMount);
  }; // componentWillUnmount


  var componentWillUnmount = Component.prototype.componentWillUnmount;

  Component.prototype.componentWillUnmount = function () {
    beforeDestroy(this, componentWillUnmount);
  };

  return Component;
}

;

function reactBind(dataHub, that) {
  var _DataHub$bindView = _narakuCore.DataHub.bindView(dataHub, function () {
    this.forceUpdate();
  }),
      doBind = _DataHub$bindView.doBind,
      beforeDestroy = _DataHub$bindView.beforeDestroy;

  doBind(that);
  var componentWillUnmount = that.componentWillUnmount;

  that.componentWillUnmount = function () {
    beforeDestroy(this, componentWillUnmount);
  };
}

function vueInject(Component, config, gDh) {
  var _DataHub$injectView2 = _narakuCore.DataHub.injectView(config, function () {
    this.$forceUpdate();
  }, gDh),
      afterCreated = _DataHub$injectView2.afterCreated,
      beforeDestroy = _DataHub$injectView2.beforeDestroy; // created


  var created = Component.created;

  Component.created = function () {
    afterCreated(this, created);
  }; // beforeDestroy


  var _beforeDestroy = Component.beforeDestroy;

  Component.beforeDestroy = function () {
    beforeDestroy(this, _beforeDestroy);
  };

  return Component;
}

function vueBind(dataHub, that) {
  var _DataHub$bindView2 = _narakuCore.DataHub.bindView(dataHub, function () {
    this.$forceUpdate();
  }),
      doBind = _DataHub$bindView2.doBind,
      beforeDestroy = _DataHub$bindView2.beforeDestroy;

  doBind(that);
  var _beforeDestroy = that.beforeDestroy;

  that.beforeDestroy = function () {
    beforeDestroy(this, _beforeDestroy);
  };
}

_narakuCore.DataHub.inject = function (config, gDh) {
  return function (Component) {
    if (typeof Component === 'function') {
      if (Component.prototype.isReactComponent) {
        return reactInject(Component, config, gDh);
      }

      if (Component.prototype instanceof _narakuCore.Blank) {
        var _ref = new Component(),
            vue = _ref.vue;

        if (vue) {
          return vueInject(vue, config, gDh);
        }
      }
    }

    if (_typeof(Component) === 'object') {
      return vueInject(Component, config, gDh);
    }

    (0, _narakuCore.errorLog)('unknown Component(not Vue or React component)');
    return Component;
  };
};

_narakuCore.DataHub.bind = function (dataHub, that) {
  if (that.isReactComponent) {
    return reactBind(dataHub, that);
  }

  if (that._isVue) {
    return vueBind(dataHub, that);
  }
};