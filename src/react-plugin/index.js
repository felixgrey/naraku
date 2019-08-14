/* eslint-disable */
var DhComponent;
var declareComponent = function(Component, PropTypes) { 
  if (DhComponent) {
    return DhComponent;
  }

  DhComponent =  function(props, context) {
    Component.call(this, props, context);
    if (context && context.dataHub && !this.props.dataHub) {
      var oldcomponentWillMount = this.componentWillMount;
      
      this.componentWillMount = function dhComponentWillMount() {
        context.dataHub.bind(this);
        oldcomponentWillMount && oldcomponentWillMount.apply(this);
      };     
    }
  }
  
  var temp = function(){};
  temp.prototype = Component.prototype;
  DhComponent.prototype = new temp();
  
  DhComponent.prototype.getChildContext = function() {
    return {
      dataHub: this.dh,
    };
  };
  
  DhComponent.contextTypes = {
    dataHub: PropTypes.any
  };
  
  DhComponent.childContextTypes = {
    dataHub: PropTypes.any
  };

  return DhComponent;
};

export {
  DhComponent,
  declareComponent
};
