
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  // InteractionManager
} from 'react-native';

// import { connect } from 'react-redux';

//action

//components
var Define = require('../../Define');
// var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
// var Util = require('../../Util/Util');
var Include = require('../../Include');

var StyleConfig = require('../../Themes/StyleConfig');
var RectButton = require('../elements/RectButton');
var ButtonWrap= require('../elements/ButtonWrap');

import Popup from './Popup'

var {popupActions,popupConst} = require('../popups/PopupManager');
// var {globalVariableManager}= require('../modules/GlobalVariableManager');

class DefaultPopup extends Popup{
  static componentName = 'DefaultPopup'
  static config=
  {
    ...Popup.config,
    group:popupConst.POPUP_GROUP,
    tapToExit : true,
    videoMotion:false,
    // movePopupIn:()=>{return new Promise((resolve)=>{resolve()});},
    // movePopupOut:()=>{return new Promise((resolve)=>{resolve()});},
  }
  static containerStyle={
    ...Popup.containerStyle,
    flexDirection:'column',
    justifyContent:'center',
  }
  static defaultProps = {
    disableClose:true,
  }
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
  }
  componentWillMount(){
    super.componentWillMount();
    if (this.props.onWillMount) {
      this.props.onWillMount();
    }
  }
  renderPopupContent(){
    var self = this;
    const {disableClose,title,description,description2,buttonTitle,onPress,buttonTitle2,onPress2,onPressPopup} = self.props;

    var description2Text = null;
    if (description2) {
      description2Text= <Include.Text style={Themes.current.text.popupDescription}>{description2}</Include.Text>
    }

    var closeButton = null;
    if (!disableClose) {
      closeButton=(
        <ButtonWrap onPress={()=>{
              popupActions.popPopup(undefined,undefined,undefined,undefined,[popupConst.INFO_GROUP]);
            }}>
          <View style={{position: 'absolute', top: 0, bottom: 0,left:0,right:0, justifyContent: 'flex-end',padding:3}}>
            <Include.Image tintColor={'#000'} style={Themes.current.image.closeIcon} source={Define.assets.Home.close}/>
          </View>
        </ButtonWrap>
      )
    }
    var button = null;
    if (buttonTitle) {
      button=(
        <RectButton
              onPress={()=>{onPress();}} text={buttonTitle}
              contentStyle={{alignSelf:'center'}}
              textStyle={{alignSelf:'center',marginLeft:0,fontSize :14,fontWeight :'bold'}}
              style={Themes.current.component.normalGreenButton}/>
      )
    }
    var button2 = null;
    if (buttonTitle2) {
      button2=(
        <RectButton
              onPress={()=>{onPress2();}} text={buttonTitle2}
              contentStyle={{alignSelf:'center'}}
              textStyle={{alignSelf:'center',marginLeft:0,fontSize :14,fontWeight :'bold'}}
              style={Themes.current.component.normalRedButton}/>
      )
    }

    if (onPressPopup && !(buttonTitle&&buttonTitle2)) {
      return(
        <ButtonWrap onPress={()=>{
            onPressPopup();
          }}>
          <View style={{backgroundColor:'#fff',padding:5,margin:5,borderRadius:4,...StyleConfig.default.shadownStyle,  ...self.props.style}}>
            <View style={[Themes.current.popup.titleWrap, {paddingLeft: 20, paddingRight: 20}]}>
              <Include.Text style={Themes.current.text.popupTitle}>{title}</Include.Text>
              {closeButton}
            </View>

            <Include.Text style={{left:0,right:0,color:'#000',marginVertical:5,alignSelf:'center',textAlign :'center'}}>{description}</Include.Text>
            {description2Text}
            {self.props.children}
            <View style={{flexDirection:'row', justifyContent: 'space-between', flex: 1}}>
              {button}
              {button2}
            </View>
          </View>
        </ButtonWrap>
      )
    }
    else{
      return(
        <View style={{backgroundColor:'#fff',padding:5,margin:5,borderRadius:4,...StyleConfig.default.shadownStyle, ...self.props.style}}>

          <View style={[Themes.current.popup.titleWrap, {paddingLeft: 20, paddingRight: 20}]}>
            <Include.Text style={Themes.current.text.popupTitle}>{title}</Include.Text>
            {closeButton}
          </View>

          <Include.Text style={{left:0,right:0,color:'#000',marginVertical:5,alignSelf:'center',textAlign :'center'}}>{description}</Include.Text>

          {description2Text}
          {self.props.children}
          <View style={{flexDirection:'row', justifyContent: 'space-around'}}>
            {button}
            {button2}
          </View>
        </View>
      )
    }
  }
  componentWillUnmount(){
    super.componentWillUnmount()
    if (this.props.onWillUnmount) {
      this.props.onWillUnmount();
    }
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

// export default connect(selectActions, undefined, undefined, {withRef: true})(DefaultPopup);
export default DefaultPopup
