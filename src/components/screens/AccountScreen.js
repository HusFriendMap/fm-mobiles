
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'

// popups
import DefaultPopup from '../popups/DefaultPopup';
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'

// actions

//variable

// var styles = StyleSheet.create({
//
// })

//

class AccountScreen extends Screen{
  static componentName = 'ContainerScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {
      name: this.props.user.memberInfo &&  this.props.user.memberInfo.member? this.props.user.memberInfo.member.name : '',
      email: this.props.user.memberInfo &&  this.props.user.memberInfo.member ? this.props.user.memberInfo.member.email : '',
      phone: this.props.user.memberInfo &&  this.props.user.memberInfo.member? this.props.user.memberInfo.member.phone : '',
      address: this.props.user.memberInfo &&  this.props.user.memberInfo.member ? this.props.user.memberInfo.member.address : '',
    })
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
  //   return(
  //     <View style={Themes.current.screen.titleWrapNavBarCenter}>
  //       <Include.Text style={Themes.current.text.navBartitle}>title</Include.Text>
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
    var {dispatch, user} = this.props;
    var content = null;
    content =(
        <Include.ScrollView
          style={[Themes.current.screen.bodyView,this.props.bodyStyle],{marginTop:0}}
          refreshing={false}
          onRefresh={this.onRefresh}
          onGetMore={this.onGetMore}
        >
          <Image source={Define.assets.Images.defaultBackgroundImg} style={{width:'100%', height:Define.constants.heightScreen/3, alignItems:'center', justifyContent:'center'}} resizeMode={'stretch'}>
            <View style={{width:85, height:85, borderRadius:42.5, justifyContent:'center', alignItems:'center', borderColor:'#fff', borderWidth:1.5}}>
              <Image source={Define.assets.Images.noAvt} style={{width:80, height:80, borderRadius:40}} resizeMode={'stretch'}/>
            </View>
            <Text style={{fontSize: 20, fontWeight:'bold', color:'#000'}}>{this.state.name}</Text>
          </Image>
          <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:5, borderBottomWidth:1, borderBottomColor:'#D5D5D5'}}>
            <AntDesign name={'mail'} style={{fontSize:30, paddingRight:5, marginTop:12}}/>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:15}}>Email</Text>
              <Text style={{fontSize:18, color:'#000'}}>{this.state.email}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:5, borderBottomWidth:1, borderBottomColor:'#D5D5D5',  marginTop:5}}>
            <Feather name={'smartphone'} style={{fontSize:30, paddingRight:5, marginTop:12}}/>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:15}}>Số điện thoại</Text>
              <Text style={{fontSize:18, color:'#000'}}>{this.state.phone}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:5, borderBottomWidth:1, borderBottomColor:'#D5D5D5', marginTop:5}}>
            <Feather name={'map-pin'} style={{fontSize:30, paddingRight:5, marginTop:12}}/>
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:15}}>Địa chỉ</Text>
              <Text style={{fontSize:18, color:'#000'}}>{this.state.address}</Text>
            </View>
          </View>
          <LinearGradient
            start={ {x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors= {['#FFB301','#FD5B00' ]}
            style={{elevation:4, borderRadius:5, alignSelf:'center',width: Define.constants.widthScreen-80, height: 40, marginTop:20}}>
            <TouchableOpacity
              style={{flex:1,elevation:4,  backgroundColor:'transparent', width: Define.constants.widthScreen-80, height: 40,alignItems: 'center', justifyContent: 'center', flexDirection:'row'}}
              onPress={() => {
                Actions.LoginScreen({
                  mode:'edit'
                })
              }}>
              <AntDesign name={'edit'} style={{fontSize:20, color:'#fff', marginRight:4}}/>
              <Include.Text style={{color: '#fff', fontWeight: 'bold', backgroundColor:'transparent'}}>
                Cập nhật thông tin tài khoản
              </Include.Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity
            style={{flex:1, borderRadius:5, alignSelf:'center',elevation:4,  backgroundColor:'#fff', width: Define.constants.widthScreen/2, height: 40,alignItems: 'center', justifyContent: 'center', flexDirection:'row', marginTop:50, marginBottom:15}}
            onPress={() => {
              this.props.scrollToTab(0);
              dispatch(UserActions_MiddleWare.logout());
            }}>
            <AntDesign name={'logout'} style={{fontSize:20, color:'#d63031', marginRight:4}}/>
            <Include.Text style={{color: '#d63031', fontWeight: 'bold', backgroundColor:'transparent'}}>
              Đăng xuất
            </Include.Text>
          </TouchableOpacity>
        </Include.ScrollView>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.user.memberInfo && nextProps.user.memberInfo.member) {
      if(this.state.name !== nextProps.user.memberInfo.member.name) {
        this.setState({
          name:nextProps.user.memberInfo.member.name
        })
      }
      if(this.state.email !== nextProps.user.memberInfo.member.email) {
        this.setState({
          email:nextProps.user.memberInfo.member.email
        })
      }
      if(this.state.phone !== nextProps.user.memberInfo.member.phone) {
        this.setState({
          phone:nextProps.user.memberInfo.member.phone
        })
      }
      if(this.state.address !== nextProps.user.memberInfo.member.address) {
        this.setState({
          address:nextProps.user.memberInfo.member.address
        })
      }
    }
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
    user: state.User
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(AccountScreen);
