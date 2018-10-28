
var _ = require('lodash')
//LIB
import {Component}  from 'react';

//action

//components
// var Define = require('../Define');
var Debug = require('../Util/Debug');
// var Themes = require('../Themes');
// var Util = require('../Util/Util');
// var Include = require('../Include');

// var {globalVariableManager}= require('../modules/GlobalVariableManager');


export default class ReactComponent extends Component{
  static componentName = 'UnNamed'
  // static defaultProps = {}
  // static propTypes = {}
  // constructor(props:Object){
  //   super(props);
  // }
  componentWillMount(){
    Debug.log(this.constructor.componentName + ':componentWillMount');
  }
  componentWillReceiveProps(){
    Debug.log(this.constructor.componentName + ':componentWillReceiveProps');
  }
  shouldComponentUpdate(){
    Debug.log(this.constructor.componentName + ':shouldComponentUpdate');
    return true;
  }
  componentWillUpdate(){
    Debug.log(this.constructor.componentName + ':componentWillUpdate');
  }
  // over write by children
  renderContent(){}
  render(){
    Debug.log(this.constructor.componentName + ':render',Debug.level.USER_TRACKER);
    var content = null;
    if (_.isFunction(this.renderContent) ) {
      content = this.renderContent();
    }else{
      Debug.log(this.constructor.componentName+':no renderContent',Debug.level.ERROR)
      content = null;
    }
    return(content)
  }
  componentDidUpdate(){
    Debug.log(this.constructor.componentName + ':componentDidUpdate');
  }
  componentWillUnmount(){
    Debug.log(this.constructor.componentName + ':componentWillUnmount');
  }
  componentDidMount(){
    Debug.log(this.constructor.componentName + ':componentDidMount');
  }
}
