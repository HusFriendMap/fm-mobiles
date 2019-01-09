
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
  Linking,
  Text,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');
var StatusBarAndroid = require('react-native-android-statusbar');
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  LoginManager
} = FBSDK;

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
import { Hoshi } from 'react-native-textinput-effects';
import LinearGradient from 'react-native-linear-gradient';
import isEmail from 'validator/lib/isEmail';

//variable

// var styles = StyleSheet.create({
//
// })

//

class LoginScreen extends Screen{
  static componentName = 'LoginScreen'
  static sceneConfig ={
    ...Screen.sceneConfig,
    hideNavBar: true
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {
      bottom:0,
      mode:this.props.mode || 'login',
      usernameRegister:'',
      emailRegister:'',
      passwordRegister:'',
      rePasswordRegister:'',
      emailLogin:'',
      passwordLogin:'',
      usernameEdit: this.props.user.memberInfo &&  this.props.user.memberInfo.member? this.props.user.memberInfo.member.name : '',
      emailEdit: this.props.user.memberInfo &&  this.props.user.memberInfo.member ? this.props.user.memberInfo.member.email : '',
      phoneEdit: this.props.user.memberInfo &&  this.props.user.memberInfo.member? this.props.user.memberInfo.member.phone : '',
      addressEdit: this.props.user.memberInfo &&  this.props.user.memberInfo.member ? this.props.user.memberInfo.member.address : '',
    });
    this.handleLogin = this.handleLogin.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
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
  //       <Include.Text style={Themes.current.text.navBartitle}>login</Include.Text>
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
  keyboardWillShow (e) {
    const heightKeyboard = e.endCoordinates.height;
    this.setState({
      bottom: heightKeyboard
    });

    this.setState({
      keyboardShow: true
    });
  }

  keyboardWillHide (e) {

    this.setState({
      bottom: 0
    });
    this.setState({
      keyboardShow: false
    });
  }
  handleRegister() {
    const {dispatch} = this.props;
    let message = '';
    if(this.state.usernameRegister.trim() === '') {
      message+=`Họ và tên không được trống!\n`
    }
    if(this.state.emailRegister.trim() === '') {
      message+=`Email không được trống!\n`
    }
    if(this.state.passwordRegister.trim() === '') {
      message+=`Mật khẩu không được trống!\n`
    }
    if(this.state.rePasswordRegister.trim() === '') {
      message+=`Bạn chưa nhập lại mật khẩu!\n`
    }
    if(this.state.rePasswordRegister !== this.state.passwordRegister) {
      message+=`Mật khẩu nhập lại chưa trùng khớp!\n`
    }
    if(!isEmail(this.state.emailRegister)) {
      message+=`Email không đúng định dạng!\n`
    }
    if(message) {
      popupActions.setRenderContentAndShow(DefaultPopup,{
        title:'Thông báo',
        description:message,
        buttonTitle:'OK',
        onPress:() => {
          popupActions.popPopup();
        }
      })
    } else {
      dispatch(UserActions_MiddleWare.register({
        name: this.state.usernameRegister,
        email: this.state.emailRegister,
        password: this.state.passwordRegister,
        rePass: this.state.rePasswordRegister
      }))
      .then((result) => {
        this.setState({
          usernameRegister:'',
          emailRegister:'',
          passwordRegister:'',
          rePasswordRegister:''
        })
        popupActions.setRenderContentAndShow(DefaultPopup,{
          title:'Thông báo',
          description:'Đăng Ký tài khoản thành công! Bạn có muốn đăng nhập ngay?',
          buttonTitle:'Đăng Nhập',
          onPress:() => {
              this.setState({
                mode:'login'
              })
              popupActions.popPopup();
          }
        })
      })
    }

  }
  handleLoginFacebook(accessToken) {
    const self = this;
    let {dispatch,appSetting} = this.props;
    dispatch(UserActions_MiddleWare.loginFacebook())
      .then(access_token => {
        self.handleLogin(access_token)
      })
      .catch(err => {
        popupActions.setRenderContentAndShow(DefaultPopup, {
          title: 'Thông báo',
          description: 'Vui lòng kiểm tra lại kết nối mạng hoặc đã có lỗi xảy ra với quá trình đăng nhập Facebook'
        });
      });
  }

  handleUpdate() {
    let {dispatch, user} = this.props;
    let message = '';
    if(this.state.usernameEdit.trim() === '') {
      message+=`Họ và tên không được trống!\n`
    }
    if(message) {
      popupActions.setRenderContentAndShow(DefaultPopup,{
        title:'Thông báo',
        description:message,
        buttonTitle:'OK',
        onPress:() => {
          popupActions.popPopup();
        }
      })
    } else {
      let objUpdate = {};
      if(this.state.usernameEdit) {
        objUpdate.name = this.state.usernameEdit
      }
      if(this.state.phoneEdit) {
        objUpdate.phone = this.state.phoneEdit
      }
      if(this.state.addressEdit) {
        objUpdate.address = this.state.addressEdit
      }
      objUpdate._id = this.props.user.memberInfo.member._id;
      dispatch(UserActions_MiddleWare.update(objUpdate))
      .then((result) => {
        dispatch(UserActions_MiddleWare.get({_id:user.memberInfo.member._id}))
        Actions.pop();
        popupActions.setRenderContentAndShow(DefaultPopup, {
          title: 'Thông báo',
          description: 'Cập nhật thông tin thành công!',
          buttonTitle:'OK',
          onPress:() => {
            popupActions.popPopup();
          }
        });
      })
    }
  }

  handleLogin() {
    let {dispatch} = this.props;
    let message = '';
    if(this.state.emailLogin.trim() === '') {
      message+=`Email không được trống!\n`
    }
    if(this.state.passwordLogin.trim() === '') {
      message+=`Mật khẩu không được trống!\n`
    }
    if(message) {
      popupActions.setRenderContentAndShow(DefaultPopup,{
        title:'Thông báo',
        description:message,
        buttonTitle:'OK',
        onPress:() => {
          popupActions.popPopup();
        }
      })
    } else {
      dispatch(UserActions_MiddleWare.login({
        email: this.state.emailLogin,
        password: this.state.passwordLogin,
      }))
      .then((result) => {
        this.setState({
          passwordLogin:'',
        })
        Actions.pop();
      })
    }
  }
  renderScreenContent(){
    var {dispatch,user} = this.props;
    var content =(
      <Image source={Define.assets.Images.backgroundLogin}  style={{width: null, height: null, flex: 1}}>
        <ButtonWrap onPress={() => {
          if(this.state.mode === 'register') {
            this.setState({
              mode:'login'
            })
          } else {
            Actions.pop()
          }
        }}>
          <View
            style={{ justifyContent:'center', elevation:5, alignItems:'center', position:'absolute', top: 23, left:5, width: 35, height:35, borderRadius:17.5, backgroundColor:'#fff'}}>
            <Icon name='md-arrow-back' style={{ fontSize: 27, color: '#1795b5' }} />
          </View>
        </ButtonWrap>
        {this.state.mode === 'login' ?
          <View style={{position:'absolute', left:0, right:0,bottom:this.state.keyboardShow ?Define.constants.heightScreen*1/3-300: Define.constants.heightScreen*1/3-170, alignItems:'center'}}>
            <Text style={{ color:'#000', fontSize:40}}>Đăng Nhập</Text>
            <ButtonWrap
              onPress={() => {
                this.setState({mode:'register'})
              }}
            >
              <Include.Text>Bạn có tài khoản chưa?<Include.Text style={{color:'#FD5B00'}}>Đăng ký tài khoản</Include.Text></Include.Text>
            </ButtonWrap>
            <View style={{flexDirection:'row'}}>
              <AntDesign name={'user'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Email'}
                value={this.state.emailLogin}
                onChangeText={(text) => this.setState({emailLogin:text})}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <View style={{flexDirection:'row'}}>
              <AntDesign name={'lock'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                value={this.state.passwordLogin}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Mật khẩu'}
                secureTextEntry={true}
                onChangeText={(text) => this.setState({passwordLogin:text})}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <ButtonWrap
              onPress={() => {}}
            >
              <Include.Text style={{alignSelf:'flex-end', marginTop:5, marginRight:10}}>Quên mật khẩu</Include.Text>
            </ButtonWrap>
            <LinearGradient
              start={ {x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors= {['#FD5B00', '#FFB301']}
              style={{elevation:4,width: Define.constants.widthScreen-80, height: 40, marginTop:10}}>
              <TouchableOpacity
                style={{flex:1,elevation:4,  backgroundColor:'transparent', width: Define.constants.widthScreen-80, height: 40,alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  this.handleLogin();
                }}>
                <Include.Text style={{color: '#fff', fontWeight: 'bold', backgroundColor:'transparent'}}>
                  Đăng Nhập
                </Include.Text>
              </TouchableOpacity>
            </LinearGradient>
            <Text style={{alignSelf:'flex-start', marginLeft:10, marginTop:40}}>Bạn có thể đăng nhập bằng:</Text>
            <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop:15}}>
              <View style={{flexDirection:'row', borderRadius:5, elevation:4, backgroundColor:'#fff', marginRight:10, justifyContent:'center', alignItems:'center', width:'40%', height:50}}>
                  <Feather name={'facebook'} style={{color:'#1976D2', fontSize:18}}/>
                  <Text>  Facebook</Text>
              </View>
              <View style={{flexDirection:'row', borderRadius:5, elevation:4, backgroundColor:'#fff', marginLeft:10, justifyContent:'center', alignItems:'center', width:'40%', height:50}}>
                  <AntDesign name={'google'} style={{color:'#F34A38', fontSize:18}}/>
                  <Text>  Google</Text>
              </View>
            </View>
          </View>:
          <View style={{flex:1}}>
          {this.state.mode === 'register' ?
            <View style={{position:'absolute', left:0, right:0,bottom:this.state.keyboardShow ?Define.constants.heightScreen*1/3-200: Define.constants.heightScreen*1/3-150, alignItems:'center'}}>
              <Text style={{ color:'#000', fontSize:40}}>Đăng Ký</Text>
              <View style={{flexDirection:'row'}}>
                <AntDesign name={'user'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
                <Hoshi
                  underlineColorAndroid ='transparent'
                  borderColor={'#828282'}
                  value={this.state.usernameRegister}
                  labelStyle={{color: '#828282', fontSize:16}}
                  inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                  label= {'Họ và Tên'}
                  onChangeText={(text) => this.setState({usernameRegister:text})}
                  style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                  />
              </View>
              <View style={{flexDirection:'row'}}>
                <AntDesign name={'mail'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
                <Hoshi
                  underlineColorAndroid ='transparent'
                  borderColor={'#828282'}
                  value={this.state.emailRegister}
                  labelStyle={{color: '#828282', fontSize:16}}
                  inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                  label= {'Email'}
                  onChangeText={(text) => this.setState({emailRegister:text})}
                  style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                  />
              </View>
              <View style={{flexDirection:'row'}}>
                <AntDesign name={'lock'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
                <Hoshi
                  underlineColorAndroid ='transparent'
                  borderColor={'#828282'}
                  value={this.state.passwordRegister}
                  labelStyle={{color: '#828282', fontSize:16}}
                  inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                  label= {'Mật khẩu'}
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({passwordRegister:text})}
                  style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                  />
              </View>
              <View style={{flexDirection:'row'}}>
                <AntDesign name={'lock'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
                <Hoshi
                  underlineColorAndroid ='transparent'
                  borderColor={'#828282'}
                  value={this.state.rePasswordRegister}
                  labelStyle={{color: '#828282', fontSize:16}}
                  inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                  label= {'Nhập lại mật khẩu'}
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({rePasswordRegister:text})}
                  style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                  />
              </View>
              <LinearGradient
                start={ {x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors= {['#FD5B00', '#FFB301']}
                style={{elevation:4,width: Define.constants.widthScreen-80, height: 40, marginTop:20}}>
                <TouchableOpacity
                  style={{flex:1,elevation:4,  backgroundColor:'transparent', width: Define.constants.widthScreen-80, height: 40,alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    this.handleRegister();
                  }}>
                  <Include.Text style={{color: '#fff', fontWeight: 'bold', backgroundColor:'transparent'}}>
                    Đăng Ký
                  </Include.Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          :<View style={{position:'absolute', left:0, right:0,bottom:this.state.keyboardShow ?Define.constants.heightScreen*1/3-200: Define.constants.heightScreen*1/3-150, alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <AntDesign name={'user'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                value={this.state.usernameEdit}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Họ và Tên'}
                onChangeText={(text) => this.setState({usernameEdit:text})}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <View style={{flexDirection:'row'}}>
              <AntDesign name={'mail'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                value={this.state.emailEdit}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Email'}
                editable={false}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <View style={{flexDirection:'row'}}>
              <Feather name={'smartphone'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                value={this.state.phoneEdit}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Số điện thoại'}
                keyboardType={'numeric'}
                onChangeText={(text) => this.setState({phoneEdit:text})}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <View style={{flexDirection:'row'}}>
              <Feather name={'map-pin'} style={{fontSize:30, marginTop:15, marginRight:5}}/>
              <Hoshi
                underlineColorAndroid ='transparent'
                borderColor={'#828282'}
                value={this.state.addressEdit}
                labelStyle={{color: '#828282', fontSize:16}}
                inputStyle = {{fontSize: 20, color: '#393939', fontWeight:'100', left: 0, padding: 1}}
                label= {'Địa chỉ'}
                onChangeText={(text) => this.setState({addressEdit:text})}
                style={{height: 40, borderBottomColor:'#828282', borderBottomWidth:1, backgroundColor: '#fff', padding: 5, width:Define.constants.widthScreen-50}}
                />
            </View>
            <LinearGradient
              start={ {x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors= {['#FD5B00', '#FFB301']}
              style={{elevation:4,width: Define.constants.widthScreen-80, height: 40, marginTop:20}}>
              <TouchableOpacity
                style={{flex:1,elevation:4,  backgroundColor:'transparent', width: Define.constants.widthScreen-80, height: 40,alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  this.handleUpdate();
                }}>
                <Include.Text style={{color: '#fff', fontWeight: 'bold', backgroundColor:'transparent'}}>
                  Cập nhật
                </Include.Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>}
        </View>
      }
      </Image>
    )
    return content;
  }
  componentWillMount() {
    super.componentWillMount()
    Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  }
  componentWillUnmount() {
    super.componentWillUnmount()
      Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
  }
  componentDidMount(){
    super.componentDidMount();
  }
  componentWillUpdate() {
    //LayoutAnimation.easeInEaseOut();
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
      user: state.User,
      appSetting: state.AppSetting
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(LoginScreen);
