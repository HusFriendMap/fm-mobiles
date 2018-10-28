
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View
} from 'react-native';

// import { connect } from 'react-redux';

//action

//components
var Define = require('../../../Define');
var Debug = require('../../../Util/Debug');
var Themes = require('../../../Themes');
var Util = require('../../../Util/Util');
var Include = require('../../../Include');

import ReactComponent from '../../ReactComponent'

var {popupActions} = require('../../popups/PopupManager');
var {globalVariableManager}= require('../../modules/GlobalVariableManager');

class TemplateComponent extends ReactComponent{
  static componentName = 'TemplateComponent'
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
  }
  renderContent(){
    var content = null;
    return(content)
  }
}

/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
// function selectActions(state) {
//   return {}
// }

// export default connect(selectActions, undefined, undefined, {withRef: true})(TemplateComponent);
export default TemplateComponent
