"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.declareComponent = exports.DhComponent = void 0;
var DhComponent;
exports.DhComponent = DhComponent;

var declareComponent = function declareComponent(Component, PropTypes) {
  if (DhComponent) {
    return DhComponent;
  }

  exports.DhComponent = DhComponent = function DhComponent(props, context) {
    Component.call(this, props, context);

    if (context && context.DataHub && !this.pDh) {
      var oldcomponentWillMount = this.componentWillMount;

      this.componentWillMount = function dhComponentWillMount() {
        context.DataHub.bind(this);
        oldcomponentWillMount && oldcomponentWillMount.apply(this);
      };
    }
  };

  var temp = function temp() {};

  temp.prototype = Component.prototype;
  DhComponent.prototype = new temp();

  DhComponent.prototype.getChildContext = function () {
    return {
      DataHub: this.dh
    };
  };

  DhComponent.contextTypes = {
    DataHub: PropTypes.any
  };
  DhComponent.childContextTypes = {
    DataHub: PropTypes.any
  };
  return DhComponent;
};

exports.declareComponent = declareComponent;