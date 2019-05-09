import { EventEmitter } from 'events';
import { DataHub, blank } from '../naraku-core';
export  *  from '../naraku-core';

let changeIndex = 0;

DataHub.inject = (config, gDh) => {
  return Component => {      
    if(typeof Component === 'function'){
      Component = new Component().vue || {};
    }
    
    const {afterCreated, beforeDestroy} = DataHub.pageView(config, function(dataHub, gDh) {
      this.changeIndex = changeIndex++;
    });
    
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

    // data
    const oldData = Component.data || blank;
    if(typeof oldData === 'function') {
      Component.data = function (){
        const result = {...oldData.bind(this)(), changeIndex: 0};
        return result;
      }
    } else {
      Component.data = {...oldData, changeIndex: 0};
    }

    return Component;
  }; 
};
