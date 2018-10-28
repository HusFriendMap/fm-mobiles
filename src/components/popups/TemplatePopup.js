
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  InteractionManager
} from 'react-native';

// import { connect } from 'react-redux';

//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var ButtonWrap= require('../elements/ButtonWrap');

import Popup from './Popup'

var {popupActions,popupConst} = require('./PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');

class TemplatePopup extends Popup{
  static componentName = 'TemplatePopup'
  static config=
  {
    ...Popup.config,
  }
  static containerStyle={
    ...Popup.containerStyle,
  }
  static defaultProps = {
    disableClose:true,
  }
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

// NOTE : TODO :now can't use connect ( popupManager can't read config)
/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
// function selectActions(state) {
//   return {}
// }

// export default connect(selectActions, undefined, undefined, {withRef: true})(TemplatePopup);

export default TemplatePopup
