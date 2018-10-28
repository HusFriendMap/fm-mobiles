
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Button,
  Image,
  ActivityIndicator ,
  Modal,
  Platform,
  AppState
} from 'react-native';

var DeviceInfo = require('react-native-device-info');
var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';

//components
import RDActionsTypes from '../../actions/RDActionsTypes'
import RDActions from '../../actions/RDActions'
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');

var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'
import AppStateActions_MiddleWare from '../../actions/AppStateActions_MiddleWare'

//variable

// var styles = StyleSheet.create({
//
// })

//

class TemplateScreen extends Screen{
  static componentName = 'TemplateScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
  }

  // static renderLeftButton(scene){
  //   return (
  //     <View style={Themes.current.screen.leftButtonWrapNavBar}>
  //       <Include.Text>LeftButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderRightButton(scene){
  //   return (
  //     <View style={Themes.current.screen.rightButtonWrapNavBar}>
  //       <Include.Text>RightButton</Include.Text>
  //     </View>
  //   )
  // }
  static renderTitle(scene){
    return(
      <View style={Themes.current.screen.titleWrapNavBarCenter}>
        <Include.Text style={Themes.current.text.navBartitle}>title</Include.Text>
      </View>
    )
  }

  onRefresh(){
    super.onRefresh();
    var {dispatch} = this.props;
  }

  onGetMore(){
    super.onGetMore();
    var {dispatch} = this.props;
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    content =(
      <Include.ScrollView
        style={[Themes.current.screen.bodyView,this.props.bodyStyle]}
        refreshing={false}
        onRefresh={this.onRefresh}
        onGetMore={this.onGetMore}
      >
        <Include.Text>Content</Include.Text>
      </Include.ScrollView>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
  }
}


/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(TemplateScreen);
