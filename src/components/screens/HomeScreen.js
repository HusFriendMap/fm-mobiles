
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Image
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
import {Icon} from 'native-base';
//action
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'
//components
import MapView from 'react-native-maps';
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');
var locationManager = require('../modules/LocationManager');


var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'
import PickCardTypeScreen from './PickCardTypeScreen'

// popups
import DefaultPopup from '../popups/DefaultPopup'

// actions

//variable

// var styles = StyleSheet.create({
//
// })

//

class HomeScreen extends Screen{
  static componentName = 'ContainerScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,{
      listService:[]
    })
    this.renderListService = this.renderListService.bind(this);
  }
  // static renderRightButton(scene){
  //   return (
  //     <View style={Themes.current.screen.rightButtonWrapNavBar}>
  //       <Include.Text>RightButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderLeftButton(scene){
  //   return (
  //     <View style={Themes.current.screen.leftButtonWrapNavBar}>
  //       <Include.Text>LeftButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderTitle(scene){
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
  renderListService(service) {
    return(
      <ButtonWrap
        onPress={() => {
          if(service._id==="5ae982b8717365072fb43faa") {
              Actions.PickCardTypeScreen();
          }
        }}
      >
        <View style={{margin: 5, height:Define.constants.widthScreen/4.5+30, backgroundColor:'#ffffff', elevation:3, padding: 10, alignItems:'center'}}>
          <Image style={{width: Define.constants.widthScreen/4.5, height: Define.constants.widthScreen/4.5, borderRadius: 5}} source={{uri:service.icon}} />
          <Include.Text>{service.name}</Include.Text>
        </View>
      </ButtonWrap>
    )
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    content =(
      <View style={{backgroundColor:'#fff', flex:1}}>
        <View style={{height: 30, elevation:3, backgroundColor:'#c2c4c6', justifyContent:'center', flexDirection:'row'}}>
          <Text style={{alignSelf:'center'}}>Title</Text>
          <ButtonWrap
            onPress={()=>{globalVariableManager.rootView.drawSideMenu(true)}}>
            <View style={{position:'absolute',left:0, top: -5}}>
              <Icon name='ios-menu' style={{fontSize: 32, lineHeight: 36, color: '#fff'}} />
            </View>
          </ButtonWrap>
        </View>
        <View style={{flexDirection:'column', backgroundColor:'#e0efff',margin:5,elevation:3 }}>
          <View style={{flexDirection:'row',flexWrap: 'wrap', justifyContent: 'center'}}>
            {this.state.listService.map(this.renderListService)}
          </View>
        </View>
      </View>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
    var {dispatch} = this.props;
    dispatch(UserActions_MiddleWare.listService({
      "memberToken":"ed740079-39e4-42ef-a6bf-aab92e93536b",
      "region":"hn"
    }))
    .then((result) => {
      this.setState({
        listService:result.res.data
      })
    })
    .catch((err)=> {
      console.log('ahihi err',result);
    })
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
  }
}

module.exports=connect(selectActions, undefined, undefined, {withRef: true})(HomeScreen);
// export default HomeScreen