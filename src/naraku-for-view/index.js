/* eslint-disable */
import { DataHub, errorLog, Blank} from '../naraku-core';
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

function reactBind(dataHub, that, dhName, dhCName) {
  const {doBind, beforeDestroy} = DataHub.bindView(dataHub, function() {
    this.forceUpdate();
  }, dhName, dhCName);
  
  doBind(that);
  
  const componentWillUnmount = that.componentWillUnmount;
  that.componentWillUnmount = function() {
    beforeDestroy(this, componentWillUnmount);
  }
}

function vueInject(Component, config, gDh) {   

  const {afterCreated, beforeDestroy} = DataHub.injectView(config, function() {
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

function vueBind(dataHub, that, dhName, dhCName) {
  const {doBind, beforeDestroy} = DataHub.bindView(dataHub, function() {
    this.$forceUpdate();
  }, dhName, dhCName);
  
  doBind(that);
  
  const _beforeDestroy = that.beforeDestroy;
  that.beforeDestroy = function() {
    beforeDestroy(this, _beforeDestroy);
  }
}

DataHub.inject = (config, gDh) => {
  return Component => { 
    
    if (DataHub.viewType === 'React' ) {
      return reactInject(Component, config, gDh);
    }
    
    if (DataHub.viewType === 'Vue' ) {
      if (typeof Component === 'function' && Component.prototype instanceof Blank) {
        return vueInject((new Component()).vue || {}, config, gDh);
      }
      return vueInject(Component, config, gDh);
    }
    
    if (typeof Component === 'function') {
      
      if (Component.prototype.isReactComponent) {
        return reactInject(Component, config, gDh);
      }
      
      if (Component.prototype instanceof Blank) {
        return vueInject((new Component()).vue || {}, config, gDh);
      }
    }

    if (typeof Component === 'object') {
      return vueInject(Component, config, gDh);
    }

    errorLog('unknown Component(not Vue or React component)');
    return Component;
  }
}

DataHub.bind = (dataHub, that, dhName, dhCName) => {
  if (DataHub.viewType === 'React' || that.isReactComponent) {
    return reactBind(dataHub, that, dhName, dhCName);
  }  
  if(DataHub.viewType === 'Vue' || that._isVue) {
    return vueBind(dataHub, that, dhName, dhCName);
  }
}

