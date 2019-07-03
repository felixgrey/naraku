"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  install: function install(Vue) {
    Vue.mixin({
      created: function created(arg) {
        !this.notBindDh && !this.pDh && this.$parent && this.$parent.$bindDh(this);
      }
    });

    Vue.prototype.$bindDh = function () {
      var _that = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.dh) {
        this.dh.bind(_that);
      } else if (this.pDh) {
        this.pDh.bind(_that);
      } else if (this.$parent) {
        this.$parent.$bindDh(_that);
      }
    };
  }
};
exports.default = _default;