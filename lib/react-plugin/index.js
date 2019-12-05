"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.declareComponent = exports.DhComponent = void 0;

/* eslint-disable */
var DhComponent;
exports.DhComponent = DhComponent;

var declareComponent = function declareComponent(Component, PropTypes) {
  if (DhComponent) {
    return DhComponent;
  }

  exports.DhComponent = DhComponent = function DhComponent(props, context) {
    Component.call(this, props, context);

    if (context && context.dataHub && !this.props.dataHub) {
      var oldcomponentWillMount = this.componentWillMount;

      this.componentWillMount = function dhComponentWillMount() {
        context.dataHub.bind(this);
        oldcomponentWillMount && oldcomponentWillMount.apply(this);
      };
    }
  };

  var temp = function temp() {};

  temp.prototype = Component.prototype;
  DhComponent.prototype = new temp();

  DhComponent.prototype.getChildContext = function () {
    return {
      dataHub: this.dh || this.pDh
    };
  };

  DhComponent.contextTypes = {
    dataHub: PropTypes.any
  };
  DhComponent.childContextTypes = {
    dataHub: PropTypes.any
  };
  return DhComponent;
};

exports.declareComponent = declareComponent;