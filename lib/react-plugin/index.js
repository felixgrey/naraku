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
    var oldcomponentWillMount = this.componentWillMount;

    this.componentWillMount = function dhComponentWillMount() {
      // 创建 pDh
      if (this.context && this.context.dataHub && !this.props.dataHub) {
        this.context.dataHub.bind(this);
      } // 创建 dh


      oldcomponentWillMount && oldcomponentWillMount.apply(this); // 创建 rDh

      if (this.context) {
        var _this$context$rootDh = this.context.rootDh,
            rootDh = _this$context$rootDh === void 0 ? this.rDh || this.pDh || this.dh || null : _this$context$rootDh;

        if (rootDh) {
          if (rootDh === this.pDh) {
            this.rDh = this.pDh;
            this.rDhController = this.pDhController;
          } else if (rootDh === this.dh) {
            this.rDh = this.dh;
            this.rDhController = this.dhController;
          }

          if (!this.rDhController) {
            delete this.rDh;
            rootDh.bind(this, 'rDh');
          }
        }
      }
    };
  };

  var temp = function temp() {};

  temp.prototype = Component.prototype;
  var newPrototype = new temp();
  DhComponent.prototype = newPrototype;

  newPrototype.getChildContext = function () {
    var rootDh = (this.context || {}).rootDh || null;

    if (!rootDh) {
      rootDh = this.rDh || this.pDh || this.dh || null;
    }

    if (rootDh && !this.rDh) {
      this.rDh = rootDh;
    }

    return {
      dataHub: this.dh || this.pDh,
      rootDh: rootDh
    };
  };

  DhComponent.contextTypes = {
    dataHub: PropTypes.any,
    rootDh: PropTypes.any
  };
  DhComponent.childContextTypes = {
    dataHub: PropTypes.any,
    rootDh: PropTypes.any
  };
  return DhComponent;
};

exports.declareComponent = declareComponent;