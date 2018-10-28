
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');

var ButtonWrap = require('../elements/ButtonWrap');
var ScrollableTabView = require('react-native-scrollable-tab-view');
import HomeScreen from './HomeScreen';
import SecondScreen from './SecondScreen';
import BottomTabBar from './BottomTabBar';

//screens
import Screen from './Screen'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions

//variable

// var styles = StyleSheet.create({
//
// })

//

class ContainerScreen extends Screen{
  static componentName = 'ContainerScreen'
  static sceneConfig ={
    ...Screen.sceneConfig,
    hideNavBar:true,
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
  // static renderTitle(scene){
  //   console.log('ahihi',scene);
  //   return(
  //     <View style={Themes.current.screen.titleWrapNavBarCenter}>
  //       <Include.Text style={Themes.current.text.navBartitle}>Trang chủ</Include.Text>
  //     </View>
  //   )
  // }

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
      <ScrollableTabView
      style={{ backgroundColor:'#ffff' }}
      initialPage={0}
      tabBarPosition={'bottom'}
      renderTabBar={() => <BottomTabBar />}
    >
      <HomeScreen tabLabel="ios-home"/>
      <SecondScreen tabLabel="ios-cart" />
      <ScrollView tabLabel="ios-chatboxes"  style={styles.tabView}>
        <View style={styles.card}>
          <Text>Messenger</Text>
        </View>
      </ScrollView>
      <ScrollView tabLabel="ios-notifications"  style={styles.tabView}>
        <View style={styles.card}>
          <Text>Notifications</Text>
        </View>
      </ScrollView>
      <ScrollView tabLabel="ios-list"  style={styles.tabView}>
        <View style={styles.card}>
          <Text>Other nav</Text>
        </View>
      </ScrollView>
    </ScrollableTabView>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
  }
}
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
    navigator: state.Navigator,
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(ContainerScreen);
