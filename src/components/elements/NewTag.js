
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View
} from 'react-native';

import { connect } from 'react-redux';

//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

import ReactComponent from '../ReactComponent'

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');

// actions
import RDActions from '../../actions/RDActions'

class NewTag extends ReactComponent{
  static componentName = 'NewTag'
  static defaultProps = {
    ...ReactComponent.defaultProps,
    tagName:'Unnamed'
  }
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
    this.oldNewFlag = false;
  }
  componentWillMount(){
    var {appSetting,tagName} = this.props;
      super.componentWillMount();
      this.oldNewFlag= appSetting.newFlags[tagName];
  }
  shouldComponentUpdate(nextProps, nextState){
    super.shouldComponentUpdate(nextProps, nextState);
    var {appSetting,tagName} = nextProps;
    if (appSetting.newFlags[tagName] !== this.oldNewFlag) {
      return true;
    }else{
      return false;
    }
  }
  renderContent(){
    var {dispatch,appSetting} = this.props;
    var content= null;
    return null;
    if (appSetting.newFlags[this.props.tagName]) {
      content = (
        <View
          style={{position:'absolute',top:0,right:0,bottom:0,left:0,justifyContent:'flex-start',alignItems:'center',
                  borderWidth:0}}
          onStartShouldSetResponder={()=>{
            if (this.props.tagName === 'Unnamed') {
              Debug.log('NewTag Unnamed',Debug.level.WARNING)
            }else{
              let newFlagsObj = {};
              newFlagsObj[this.props.tagName] = false;
              dispatch(RDActions.AppSetting.setNewFlags(newFlagsObj))
              globalVariableManager.saveSettingTimeout && clearTimeout(globalVariableManager.saveSettingTimeout);
              if (this.props.updateInstance) {
                dispatch(RDActions.AppSetting.saveSetting({}))
              }else{
                globalVariableManager.saveSettingTimeout = setTimeout(()=>{
                  dispatch(RDActions.AppSetting.saveSetting({}))
                },3000)
              }
            }
            return false
          }}
          >
          <Include.Text funny={true} style={{color:'#ff0000',fontSize:15,fontFamily:Define.constants.fontBold}}>new</Include.Text>
        </View>
      );
    }
    return(content)
  }
}

/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
    appSetting:state.AppSetting,
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(NewTag);
// export default NewTag
