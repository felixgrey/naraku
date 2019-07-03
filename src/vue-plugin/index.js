export default {
  install(Vue) {
    Vue.mixin({
      created: function (arg) {
        (!this.notBindDh) && (!this.pDh) && (this.$parent) && (this.$parent.$bindDh(this));
      }
    });
    
    Vue.prototype.$bindDh = function(_that = null) {    
      if (this.dh) {
        this.dh.bind(_that);
      } else if (this.pDh) {
        this.pDh.bind(_that);
      } else if (this.$parent) {
        this.$parent.$bindDh(that);
      }
    }
  }
}