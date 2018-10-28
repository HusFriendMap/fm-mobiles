
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import { Container, Content, Text, Icon, List, ListItem, Thumbnail } from 'native-base';
var {Actions, ActionConst} = require('react-native-router-flux');
import { connect } from 'react-redux';

//action
import UserActions_MiddleWare from '../../../actions/UserActions_MiddleWare'
const FBSDK = require('react-native-fbsdk');
const {
  LikeView,
  AppInviteDialog
} = FBSDK;
//components
var Define = require('../../../Define');
var Debug = require('../../../Util/Debug');
var Themes = require('../../../Themes');
var Util = require('../../../Util/Util');
var Include = require('../../../Include');

import ReactComponent from '../../ReactComponent'

import styles from './style';
import ButtonWrap from '../ButtonWrap'


var {popupActions} = require('../../popups/PopupManager');
import DefaultPopup from '../../popups/DefaultPopup'

var {globalVariableManager}= require('../../modules/GlobalVariableManager');

class SideBar extends ReactComponent {
  static componentName = 'SideBar'
  constructor(props) {
    super(props);
    this.state = _.merge(this.state,
    {})
    this.renderMenu = this.renderMenu.bind(this);
  }
  initMenu() {
    const self = this;
    this.config = []
    const commonMenus = [
      {
        icon: 'ios-log-out-outline',
        text: 'Đăng xuất',
        onPress: () => {
          let {dispatch} = this.props;
          dispatch(UserActions_MiddleWare.logout());
          this.props.rootView.drawSideMenu(false);
          Actions.LoginScreen({
            type: 'reset'
          })
        }
      }
    ];
    this.config = [
      commonMenus[0]
    ];
  }
  renderMenu() {
    return this.config.map((item, index) => {
      return (
        <ButtonWrap
          key={index}
          onPress = {item.onPress}>
          <View style={styles.menuItemContainer}>
            <View style={styles.menuIconContainer}>
              <Icon name={item.icon} style={{...styles.menuIcon, ...(item.style ||{})}}/>
            </View>
            <View style={[styles.menuTextContainer]}>
              <Include.Text style={[styles.menuTextDes]}>{item.text}</Include.Text>
            </View>
          </View>
        </ButtonWrap>
      )
    })
  }
  renderContent(){
    this.initMenu()
    var self = this;
    var {dispatch} = this.props;
    var content = null;
    content=(
      <Include.Image source={Define.assets.Images.backgroundLogin} style={styles.background} >
        <Include.ScrollView>
          {this.renderMenu()}
        </Include.ScrollView>
      </Include.Image>
    )
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
    navigator: state.Navigator,
    appState: state.AppState,
    user: state.User,
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(SideBar);
