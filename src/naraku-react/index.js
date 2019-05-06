import { EventEmitter } from 'events';
import { DataHub } from '../naraku-core';
export  *  from '../naraku-core';

let changeIndex = 0;

DataHub.inject = config => {
  return Component => {   
    const {afterCreated, beforeDestroy} = DataHub.pageView(config, function(dataHub) {
      this.setState({changeIndex: changeIndex++});
    });
    
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
};
