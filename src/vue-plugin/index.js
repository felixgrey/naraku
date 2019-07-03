export default {
  install(Vue) {
    Vue.mixin({
      created: function (arg) {
        (!this.notBindDh) && this.$bindDh();
      }
    });
    
    Vue.prototype.$bindDh = function(that) {
      that = that || this;
      
      if(this.dh && that !== this) {
        this.dh.bind(that);
        return;
      }
      
      if(this.pDh && that !== this) {
        this.pDh.bind(that);
        return;
      }
      
      this.$parent && this.$parent.$bindDh(that);
    }

  }
}