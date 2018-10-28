
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

// var StyleConfig = require('../../Themes/StyleConfig');
var RectButton = require('../elements/RectButton');
var ButtonWrap= require('../elements/ButtonWrap');

import Popup from './Popup'

var {popupActions,popupConst} = require('../popups/PopupManager');
// var {globalVariableManager}= require('../modules/GlobalVariableManager');

class FadeDownDefaultPopup extends Popup{
  static componentName = 'FadeDownDefaultPopup'
  static config=
  {
    ...Popup.config,
    pointerEvents:'none',
    group:popupConst.INFO_GROUP,
    movePopupIn:(contentObject)=>{
      var contentRefObject =  contentObject.objRef;
      return contentRefObject.fadeInDown(600);
    },
    movePopupOut:(contentObject)=>{
      var contentRefObject =  contentObject.objRef;
      return contentRefObject.fadeOutUp(200);
    }
  }
  static containerStyle={
    ...Popup.containerStyle,
    backgroundColor:'transparent',
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    alignSelf:'stretch',
    // width: Define.constants.widthScreen,
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
  renderPopupContent(){
    var self = this;
    const {disableClose,description,buttonTitle,onPress,onPressPopup} = self.props;

    var closeButton = null;
    if (!disableClose) {
      closeButton=(
        <ButtonWrap onPress={()=>{popupActions.popPopup(undefined,undefined,popupConst.INFO_GROUP)}}>
          <View style={{flexDirection:'row',alignSelf:'flex-end',padding:2}}>
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
              style={{flex:1,margin :5,alignSelf:'center',borderRadius:4}}/>
      )
    }
    if (onPressPopup && !buttonTitle) {
      return(
        <ButtonWrap onPress={()=>{
            onPressPopup();
          }}>
          <View style={Themes.current.popup.fadeDownContainer}>
            {closeButton}
            {/*<Include.Text style={{left:0,right:0,fontSize :16,color:'#e89614',marginVertical:0,alignSelf:'center'}}>{title}</Include.Text>*/}
            <Include.Text style={Themes.current.text.fadeDownPopup}>{description}</Include.Text>
            {self.props.children}
            {button}
          </View>
        </ButtonWrap>
      )
    }
    else{
      return(
        <View style={Themes.current.popup.fadeDownContainer}>
          {closeButton}
          {/*<Include.Text style={{left:0,right:0,fontSize :20,color:'#e89614',marginVertical:0,alignSelf:'center'}}>{title}</Include.Text>*/}
          <Include.Text style={Themes.current.text.fadeDownPopup}>{description}</Include.Text>
          {self.props.children}
          {button}
        </View>
      )
    }
  }
  componentDidMount(){
    super.componentDidMount();
    const {time2Close} = this.props;
    this.timeout = setTimeout(()=>{
      popupActions.popPopup(undefined,undefined,popupConst.INFO_GROUP);
    },time2Close?time2Close:3000)
  }
  componentWillUnmount() {
    clearTimeout(this.timeout)
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
export default FadeDownDefaultPopup
