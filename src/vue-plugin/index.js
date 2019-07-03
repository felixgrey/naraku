export default {
  install(Vue) {
    Vue.mixin({
      created: function (arg) {
        (!this.notBindDh) && this.$bindDh();
      }
    });
    
    Vue.prototype.$bindDh = function(_that = null) {

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

    }

  }
}