
var DhComponent;
var declareComponent = function(Component, PropTypes) { 
  if (DhComponent) {
    return DhComponent;
  }

  DhComponent =  function(props, context) {
    Component.call(this, props, context);
    if (context && context.DataHub && !this.pDh) {
      var oldcomponentWillMount = this.componentWillMount;
      
      this.componentWillMount = function dhComponentWillMount() {
        context.DataHub.bind(this);
        oldcomponentWillMount && oldcomponentWillMount.apply(this);
      };     
    }
  }
  
  var temp = function(){};
  temp.prototype = Component.prototype;
  DhComponent.prototype = new temp();
  
  DhComponent.prototype.getChildContext = function() {
    return {
      DataHub: this.dh,
    };
  };
  
  DhComponent.contextTypes = {
    DataHub: PropTypes.any
  };
  
  DhComponent.childContextTypes = {
    DataHub: PropTypes.any
  };

  return DhComponent;
};

export {
  DhComponent,
  declareComponent
};
