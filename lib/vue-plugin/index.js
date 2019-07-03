"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  install(Vue) {
    Vue.mixin({
      created: function created(arg) {
        !this.notBindDh && this.$bindDh();
      }
    });

    Vue.prototype.$bindDh = function (that) {
      that = that || this;

      if (this.dh && that !== this) {
        this.dh.bind(that);
        return;
      }

      if (this.pDh && that !== this) {
        this.pDh.bind(that);
        return;
      }

      this.$parent && this.$parent.$bindDh(that);
    };
  }

};
exports.default = _default;