/* eslint-disable */
var DhComponent;
var declareComponent = function(Component, PropTypes) { 
  if (DhComponent) {
    return DhComponent;
  }

  DhComponent =  function(props, context) {
    Component.call(this, props, context);
		
		var oldcomponentWillMount = this.componentWillMount;
		this.componentWillMount = function dhComponentWillMount() {
			
			// 创建 pDh
			if (this.context && this.context.dataHub && !this.props.dataHub) {
				this.context.dataHub.bind(this);
			}

			// 创建 dh
			oldcomponentWillMount && oldcomponentWillMount.apply(this);

			// 创建 rDh
			if (this.context) {
				const {
					rootDh = this.rDh || this.pDh || this.dh || null,
				} = this.context;

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
		}
  }
  
  var temp = function(){};
  temp.prototype = Component.prototype;
	var newPrototype = new temp();
	
  DhComponent.prototype = newPrototype;
  
  newPrototype.getChildContext = function() {
		let rootDh = (this.context || {}).rootDh || null;
		
		if (!rootDh) {
			rootDh = this.rDh || this.pDh || this.dh || null;
		}
		
		if(rootDh && !this.rDh) {
			this.rDh = rootDh;
		}
		
    return {
      dataHub: this.dh || this.pDh,
			rootDh: rootDh,
    };
  };
  
  DhComponent.contextTypes = {
    dataHub: PropTypes.any,
		rootDh:  PropTypes.any,
  };
  
  DhComponent.childContextTypes = {
    dataHub: PropTypes.any,
		rootDh:  PropTypes.any,
  };

  return DhComponent;
};

export {
  DhComponent,
  declareComponent
};
