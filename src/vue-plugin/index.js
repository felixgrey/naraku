export default {
  install(Vue) {
    Vue.mixin({
      created: function (arg) {
        (!this.notBindDh) && this.$parent && this.$parent.$bindDh(this);
      }
    });
    
    Vue.prototype.$bindDh = function(_that = null) {    
      if (this.dh) {
        this.dh.bind(_that);
        return;
      }
      
      if (this.pDh) {
        this.pDh.bind(_that);
        return;
      }
      
      if (this.$parent) {
        this.$parent.$bindDh(that);
      }
    }
  }
}