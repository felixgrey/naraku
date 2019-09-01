/* eslint-disable */
import { EventEmitter } from 'events';
import { DataHub } from './DataHub.js';

export * from './DataHub.js';
export * from './Transformer.js';
export * from './Utils.js';
export * from './Declare.js';

class NodeEvent extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.setMaxListeners(Infinity);
  }

  off(...args) {
    return this.removeListener(...args);
  }
  
  destroy(){
    return this.removeAllListeners();
  }
  
}

DataHub.setEmitter(NodeEvent);