
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
    var descriptionText = null;
    if(description) {
      descriptionText =(
        <View style={{width:'100%', borderBottomWidth:1, borderBottomColor:'#DCDEE1', padding:10}}>
          <Include.Text style={{left:0,right:0,color:'#000',margin:5,alignSelf:'center',textAlign :'center'}}>{description}</Include.Text>
        </View>
      )
    }
    var description2Text = null;
    if (description2) {
      description2Text= <Include.Text style={Themes.current.text.popupDescription}>{description2}</Include.Text>
    }
    var titleComponent = null;
    if(title) {
      titleComponent = (
        <View style={[Themes.current.popup.titleWrap]}>
          <Include.Text style={Themes.current.text.popupTitle}>{title}</Include.Text>
          {closeButton}
        </View>
      );
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
        <ButtonWrap
          onPress={() => {onPress();}}
        >
          <View style={{backgroundColor:'#fff',flex:1,justifyContent:'center',borderBottomRightRadius:buttonTitle2===undefined?4:0, borderBottomLeftRadius:4, height:45}}>
            <Include.Text style={{alignSelf:'center',marginLeft:0,fontSize :14,fontWeight :'bold', color:'#1697B4'}}>{buttonTitle}</Include.Text>
          </View>
        </ButtonWrap>
      )
    }
    var button2 = null;
    if (buttonTitle2) {
      button2=(
          <ButtonWrap
            onPress={() => {onPress2();}}
          >
            <View style={{backgroundColor:'#fff',justifyContent:'center', flex:1,borderBottomRightRadius:4,marginLeft:1, height:45}}>
              <Include.Text style={{alignSelf:'center',marginLeft:0,fontSize :14,fontWeight :'bold', color:'#e84393'}}>{buttonTitle2}</Include.Text>
            </View>
          </ButtonWrap>
      )
    }

    if (onPressPopup && !(buttonTitle&&buttonTitle2)) {
      return(
        <ButtonWrap onPress={()=>{
            onPressPopup();
          }}>
          <View style={{backgroundColor:'#fff',borderRadius:4,...StyleConfig.default.shadownStyle,  ...self.props.style}}>
            {titleComponent}
            {descriptionText}
            {description2Text}
            {self.props.children}
            <View style={{flexDirection:'row', justifyContent: 'space-between', backgroundColor:'#EDEEF0', borderBottomLeftRadius:4, borderBottomRightRadius:4}}>
              {button}
              {button2}
            </View>
          </View>
        </ButtonWrap>
      )
    }
    else{
      return(
        <View style={{backgroundColor:'#fff',margin:15,borderRadius:4,paddingTop:20,...StyleConfig.default.shadownStyle, ...self.props.style}}>
          {titleComponent}
          {descriptionText}
          {description2Text}
          {self.props.children}
          <View style={{flexDirection:'row', justifyContent: 'space-around', backgroundColor:'#EDEEF0', borderBottomLeftRadius:4, borderBottomRightRadius:4}}>
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
