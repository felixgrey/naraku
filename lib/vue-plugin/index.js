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

    Vue.prototype.$bindDh = function () {
      let _that = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!this.$parent) {
        return;
      }

      if (!_that) {
        this.$parent.$bindDh(this);
        return;
      }

      if (this.dh) {
        this.dh.bind(_that);
        return;
      }

      if (this.pDh) {
        this.pDh.bind(_that);
        return;
      }
    };
  }

};
exports.default = _default;