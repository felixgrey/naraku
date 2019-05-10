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

function reactInject(Component, config, gDh) {
  const _DataHub$injectView = _narakuCore.DataHub.injectView(config, function () {
    this.forceUpdate();
  }, gDh),
        afterCreated = _DataHub$injectView.afterCreated,
        beforeDestroy = _DataHub$injectView.beforeDestroy; // componentWillMount


  const componentWillMount = Component.prototype.componentWillMount;

  Component.prototype.componentWillMount = function () {
    afterCreated(this, componentWillMount);
  }; // componentWillUnmount


  const componentWillUnmount = Component.prototype.componentWillUnmount;

  Component.prototype.componentWillUnmount = function () {
    beforeDestroy(this, componentWillUnmount);
  };

  return Component;
}

;

function reactBind(dataHub, that) {
  const _DataHub$bindView = _narakuCore.DataHub.bindView(dataHub, function () {
    this.forceUpdate();
  }),
        doBind = _DataHub$bindView.doBind,
        beforeDestroy = _DataHub$bindView.beforeDestroy;

  doBind(that);
  const componentWillUnmount = that.componentWillUnmount;

  that.componentWillUnmount = function () {
    beforeDestroy(this, componentWillUnmount);
  };
}

function vueInject(Component, config, gDh) {
  if (typeof Component === 'function') {
    Component = new Component().vue || {};
  }

  const _DataHub$injectView2 = _narakuCore.DataHub.injectView(config, function () {
    this.$forceUpdate();
  }, gDh),
        afterCreated = _DataHub$injectView2.afterCreated,
        beforeDestroy = _DataHub$injectView2.beforeDestroy; // created


  const created = Component.created;

  Component.created = function () {
    afterCreated(this, created);
  }; // beforeDestroy


  const _beforeDestroy = Component.beforeDestroy;

  Component.beforeDestroy = function () {
    beforeDestroy(this, _beforeDestroy);
  };

  return Component;
}

function vueBind(dataHub, that) {
  const _DataHub$bindView2 = _narakuCore.DataHub.bindView(dataHub, function () {
    this.$forceUpdate();
  }),
        doBind = _DataHub$bindView2.doBind,
        beforeDestroy = _DataHub$bindView2.beforeDestroy;

  doBind(that);
  const _beforeDestroy = that.beforeDestroy;

  that.beforeDestroy = function () {
    beforeDestroy(this, _beforeDestroy);
  };
}

_narakuCore.DataHub.inject = (config, gDh) => {
  return Component => {
    if (typeof Component === 'function' && Component.prototype.isReactComponent) {
      return reactInject(Component, config, gDh);
    }

    if (typeof Component === 'object' || typeof Component === 'function' && Component.prototype.vue) {
      return vueInject(Component);
    }
  };
};

_narakuCore.DataHub.bind = (dataHub, that) => {
  if (that.isReactComponent) {
    return reactBind(dataHub, that);
  }

  if (that._isVue) {
    return vueBind(dataHub, that);
  }
};