
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
  Linking
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
    {});
    this.handleLogin = this.handleLogin.bind(this);
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
  handleLoginFacebook(accessToken) {
    const self = this;
    Debug.log2(`handleLogin`, accessToken);
    let {dispatch,appSetting} = this.props;
    dispatch(UserActions_MiddleWare.loginFacebook())
      .then(access_token => {
        console.log('ahihi',access_token);
        self.handleLogin(access_token)
      })
      .catch(err => {
        console.log('hehe',err);
        popupActions.setRenderContentAndShow(DefaultPopup, {
          title: 'Thông báo',
          description: 'Vui lòng kiểm tra lại kết nối mạng hoặc đã có lỗi xảy ra với quá trình đăng nhập Facebook'
        });
      });
  }
  handleLogin(access_token) {
    let {dispatch, appSetting} = this.props;

    dispatch(UserActions_MiddleWare.login({access_token}))
      .then(res => {
        const info = res.res;
        screenName = 'HomeScreen';
        Actions[screenName]({
          type: 'reset'
        });
      })
      .catch(err => {
        // catch network problemlại
        console.log(`loginError2`, err);
        Debug.log2(`loginError2`, err);
        if(err.errObj.message === 'Network Error') {
          popupActions.setRenderContentAndShow(DefaultPopup, {
            title: 'Thông báo',
            description: 'Vui lòng kiểm tra lại kết nối mạng trước khi thử '
          });
        }
      });
  }
  renderScreenContent(){
    var {dispatch,user} = this.props;
    var content =(
      <Image source={Define.assets.Images.backgroundLogin}  style={{width: null, height: null, flex: 1}}>

        <Animatable.View
          animation="fadeIn"
          easing="linear"
          duration={1700}
          style={{
              position:'absolute',
              bottom: 20,
              left:0,
              right:0,
              justifyContent:'center',
              alignItems:'center',
              flex: 1
            }}>
          <ButtonWrap
            onPress={() => {
              Linking.openURL(`sanshipvietnam://?momoappversion=2.0.25&appSource=com.mservice.com.vn.MoMoTransfer&phonenumber=0900123128&data=v2/QmF39Hava6OYkEATUOVWQXm1qJhlcpUNmoOzDGeDR7J0T8nGH0kjd3r32XNFwxTP3rv6dBsKE6qgEZk1CmB2dObDo5VBg6WC07xcKh7KFi60T0ZOPrim9jiDQ5uSW74tr2gcSoVxkFg4Cpj+32KSMPk6tMOGf9qSKqME5EH8ZXUiUKFRxbrc9hVL6PJKenQ5GJeg+1GLk/o8674305vniIoiiQJargPjOZFGlJK7S0kZZnIxLXzlkn3MMslazRHJpKIK4O4ppJg3tkqZQSng1T0HEjHf8U0RZYsk3IQYoJnKdmUZmhSVHjIIyEcR6kdgocN8AoHww1sVULKeR0hQv1e2Gp7767edw/V8zCggNVjk1oGlssSqA4SE6OKbE6hFgfw0RRgXrzI+TyT2dCc8QWocHv5C5jovHEVbUE9LeXy58CilLfYWNHGIAhuKZRp9VkiHlQdk+4AeAoBRfaWGkEXt8J+FmpZGvAVDLrAHWvhSflv6mmY+YvyU8jSXL2OCkG7oQGQ0WZrQyUfpaHrLawG2Unsw2iZDo0XM8+M0vZo+wEWu6R+Rz5r5byB/p/YhjAwxyXJq1tYIcrbcsw98IpkqNsiYI9ArZJ2ifm2bLVuDsDGo+sMXitS92iEvxaK0&status=0&message=Successful&fromapp=momotransfer`);
            }}>
            <View style={{backgroundColor: 'white', borderRadius: 25, height: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
              <Include.Text style={{color: '#000', fontWeight: 'bold'}}>
                Đăng nhập qua Facebook
              </Include.Text>
            </View>
          </ButtonWrap>
        </Animatable.View>
      </Image>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
  }
  componentWillMount() {
    super.componentWillMount();
    var {dispatch,user,appSetting} = this.props;
    if(Platform.OS === 'android'){
      StatusBarAndroid.setHexColor('#000105');
    }
    //dispatch(AppStateActions_MiddleWare.getConfigForUseApp())
    console.log('ahihiU',user);
    if (user.memberInfo.data && user.memberInfo.data.memberToken && user.memberInfo.data.memberToken.length>0) {
      console.log('sucessfully');
      dispatch(UserActions_MiddleWare.get())
      .then((info)=>{
          let screenName = 'ContainerScreen';
          Actions[screenName]({
            type: 'reset'
          });
      })

    }
  }
  componentWillUnmount(){
    if(Platform.OS === 'android'){
      StatusBarAndroid.setHexColor(Themes.current.factor.backgroundColor)
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
      user: state.User,
      appSetting: state.AppSetting
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(LoginScreen);
