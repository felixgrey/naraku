import { DataHub } from '../naraku-core';
export  *  from '../naraku-core';

function reactInject(Component, config, gDh) { 
  const {afterCreated, beforeDestroy} = DataHub.injectView(config, function() {
    this.forceUpdate();
  }, gDh);
  
  // componentWillMount
  const componentWillMount = Component.prototype.componentWillMount;
  Component.prototype.componentWillMount = function() {
    afterCreated(this, componentWillMount);
  }

  // componentWillUnmount
  const componentWillUnmount = Component.prototype.componentWillUnmount;
  Component.prototype.componentWillUnmount = function() {
    beforeDestroy(this, componentWillUnmount);
  }

  return Component;
};

function reactBind(dataHub, that) {
  const {doBind, beforeDestroy} = DataHub.bindView(dataHub, function() {
    this.forceUpdate();
  });
  
  doBind(that);
  
  const componentWillUnmount = that.componentWillUnmount;
  that.componentWillUnmount = function() {
    beforeDestroy(this, componentWillUnmount);
  }
}

function vueInject(Component, config, gDh) {   
  if(typeof Component === 'function'){
    Component = new Component().vue || {};
  }
  
  const {afterCreated, beforeDestroy} = DataHub.pageView(config, function() {
    this.$forceUpdate();
  }, gDh);
  
  // created
  const created = Component.created;
  Component.created = function() {
    afterCreated(this, created);
  }

  // beforeDestroy
  const _beforeDestroy = Component.beforeDestroy;
  Component.beforeDestroy = function() {
    beforeDestroy(this, _beforeDestroy);
  }

  return Component;
}

function vueBind(dataHub, that) {
  const {doBind, beforeDestroy} = DataHub.bindView(dataHub, function() {
    this.$forceUpdate();
  });
  
  doBind(that);
  
  const _beforeDestroy = that.beforeDestroy;
  that.beforeDestroy = function() {
    beforeDestroy(this, _beforeDestroy);
  }
}

DataHub.inject = (config, gDh) => {
  return Component => { 
    if(typeof Component === 'function' && Component.prototype.isReactComponent) {
      return reactInject(Component, config, gDh);
    }
    if(typeof Component === 'object' || (typeof Component === 'function' && Component.prototype.vue)) {
      return vueInject(Component);
    }
  }
}

DataHub.bind = (dataHub, that) => {
  if (that.isReactComponent) {
    return reactBind(dataHub, that);
  }  
  if(that._isVue) {
    return vueBind(dataHub, that);
  }
}

