/* eslint-disable */
export default {
  install(Vue) {
    Vue.mixin({
      created: function (arg) {
				if (this.notBindDh) {
					return;
				}
				
				if (!this.dataHub && this.$parent) {
					this.$parent.$bindDh(this);
				}
				
				let rootDh = this.rootDh || null;
				
				if (!rootDh) {
					if (this.pDh) {
						rootDh = this.pDh;
					} else if (this.dh) {
						rootDh = this.dh;
					}
				}
				
				if (rootDh && !this.rDh) {
					if (rootDh === this.pDh) {
						this.rDh = this.pDh;
						this.rDhController = this.pDhController;
					} else if (rootDh === this.dh) {
						this.rDh = this.dh;
						this.rDhController = this.dhController;
					} else {
						rootDh.bind(this, 'rDh'); 
					}
				}

      }
    });
    
    Vue.prototype.$bindDh = function(_that = null) {    
      if (this.dh) {
        this.dh.bind(_that);
      } else if (this.pDh) {
        this.pDh.bind(_that);
      } else if (this.$parent) {
        this.$parent.$bindDh(_that);
      }
    }
  }
}