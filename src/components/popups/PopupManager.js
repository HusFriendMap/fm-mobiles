
import React from 'react';
var {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  InteractionManager
} = require('react-native');
import * as Animatable from 'react-native-animatable';
var _ = require('lodash');
var Orientation = require('react-native-orientation');
//

var Debug = require('../../Util/Debug')
var Util = require('../../Util/Util')
var Define = require('../../Define')
var Include = require('../../Include')
var StyleConfig = require('../../Themes/StyleConfig')

var RDActionsTypes = require( '../../actions/RDActionsTypes');
// var StatusBarAndroid = require('react-native-android-statusbar');

var {globalVariableManager}= require('../modules/GlobalVariableManager');
//variable



var SCREEN_GROUP = 0;
var VIDEO_GROUP = 1;
var POPUP_GROUP = 2;
var INFO_GROUP = 3;
/**********************/

class RenderContentInfo{
  constructor(level={},options={},animate={}){
    // var self = this;
    var levelFormat={
      group:POPUP_GROUP,    // 0 : popup Like screen , 1: popup like video popup , 2 : normal popup , 10: popup prevent program
      priority:0,
    }
    var optionsFormat={
      namePopup:'',
      noDetectGes: false,
      tapToExit:true,
      videoMotion:false,
      pointerEvents:undefined,
    }
    var animateFormat={
      movePopupIn:undefined,
      movePopupOut:undefined,
    }

    var {group,priority} = Util.formatObject(level,levelFormat);
    var {namePopup,noDetectGes,tapToExit,videoMotion,pointerEvents} = Util.formatObject(options,optionsFormat);
    var {movePopupIn,movePopupOut,animationType} = Util.formatObject(animate,animateFormat);

    this.group = group;

    this.priority = priority;

    this.namePopup=namePopup;
    this.tapToExit = tapToExit;
    this.noDetectGes = noDetectGes;
    this.videoMotion = videoMotion;
    this.videoPopupState='NORMAL';
    this.pointerEvents = pointerEvents;

    this.movePopupIn = movePopupIn;
    this.movePopupOut = movePopupOut;

    this.startFlag = true;
  }
}

var EmptyPopup = React.createClass({
  render:function(){
    return(
      <View style={{backgroundColor:'#FFF',borderWidth:1,borderRadius:4 ,borderColor:'#000'}}>
        <TouchableOpacity
          onPress={() => {this.popPopup()}}>
          <Include.Text>THIS IS EMPTY POPUP</Include.Text>
         </TouchableOpacity>
       </View>
     )
  }
})

class PopupActions{
  constructor(){
    this.popup = undefined;

    this.renderStack = [[],[],[],[]];

    this.accelerometerListener= null;
    this.accelerometerDirect=90;
    this.numberChildOfEachGroup=[0,1,0,1];  // 0 is unlimit , larger is 0
  }

  getContentObject(groupIn=-1,indexIn=-1){
    var self = this;
    var group =0;
    if (groupIn<0) {group = self.getTopGroup();}
    else{
      // TODO : check
      group=groupIn;
    }
    var renderGroupStack =  self.renderStack[group];
    var index=0;
    if (indexIn<0) {index = renderGroupStack.length-1;}
    else{
      // TODO : check
      index=indexIn;
    }
    return renderGroupStack[index];
  }
  movePopupIn(groupIn=-1,indexIn=-1){
    var self = this;
    var contentObject = self.getContentObject(groupIn,indexIn);
    if (!contentObject || !contentObject.objRef) {
      return new Promise((resolve)=>{resolve()});
    }

    var promise;
    if (contentObject.info.movePopupIn) {
      promise = contentObject.info.movePopupIn(contentObject)
    }else{
      var contentRefObject =  contentObject.objRef;
      promise = contentRefObject.bounceIn(600);
    }


    return promise;
  }
  movePopupOut(groupIn=-1,indexIn=-1){
    var self = this;
    var contentObject = self.getContentObject(groupIn,indexIn);
    if (!contentObject || !contentObject.objRef) {
      return new Promise((resolve)=>{resolve()});
    }

    var promise;
    if (contentObject.info.movePopupOut) {
      promise = contentObject.info.movePopupOut(contentObject)
    }else{
      var contentRefObject =  contentObject.objRef;
      promise = contentRefObject.bounceOut(200);
    }
    return promise;
  }

  processAccelerometer(data){
    var self = this;
    if (!globalVariableManager.rotageVideo) {
      return;
    }
    if (data.x>7 && (((self.getVideoPopupState()==='FULLSCREEN') &&(self.accelerometerDirect !== 90)) || (self.getVideoPopupState()==='NORMAL') )) {
      self.accelerometerDirect = 90;
      self.setVideoPopupState('FULLSCREEN');
    }
    else if(data.x<-7 && (((self.getVideoPopupState()==='FULLSCREEN') &&(self.accelerometerDirect !== -90)) || (self.getVideoPopupState()==='NORMAL'))) {
      self.accelerometerDirect = -90;
      self.setVideoPopupState('FULLSCREEN');
    }
    else if (data.y>7 && (self.getVideoPopupState()==='FULLSCREEN')) {
      self.setVideoPopupState('NORMAL');
    }
  }
  moveVideoPopup(state,group) {
    var self = this;
    var contentInfoObject =  self.renderStack[group][self.renderStack[group].length-1].info;
    if (Platform.OS === 'android') {
      StatusBarAndroid.showStatusBar();
    }
    var stateTemp;
    if (!state) {
      stateTemp = contentInfoObject.videoPopupState;
    }else if(Define.constants.widthScreen>Define.constants.heightScreen && state === 'NORMAL'){
      if (contentInfoObject.videoPopupState === 'ACTIVE') {
          stateTemp = 'FULLSCREEN';
      }else{
          stateTemp='ACTIVE';
      }

    }else{
      stateTemp=state;
    }

    // if(Define.constants.widthScreen<Define.constants.heightScreen && stateTemp === 'FULLSCREEN'){
    //   stateTemp = 'NORMAL';
    // }

    Debug.log('moveVideoPopup ' + contentInfoObject.namePopup + ' to ' + stateTemp ,Debug.level.USER_TRACKER)
    try{
      var  videoHeight = (((Define.constants.widthScreen<Define.constants.heightScreen?
        Define.constants.widthScreen:Define.constants.heightScreen)/Define.constants.videoWidth)
        *Define.constants.videoHeight );

      var widthTemp;
      var heightTemp;

      if (stateTemp === 'NORMAL') {
        globalVariableManager.rootView.hideContent(false);

        contentInfoObject.priority = -1;
        if(Platform.OS === 'android') {
          Orientation.unlockAllOrientations();
        }
        var currentScreenName = globalVariableManager.reduxManager.state.Navigator.currentScreen.name;
        self.renderStack[group][self.renderStack[group].length-1].direction = null;
        InteractionManager.runAfterInteractions(() => {
          self.renderStack[group][self.renderStack[group].length-1].objRef.transitionTo({
            top:Define.constants.navBarHeight,
            scale:1,
            width:Define.constants.widthScreen,
            height:videoHeight,
            translateX:0,
            translateY:0,
            rotate:'0deg',
            opacity: 1,
          }, 300)
        });
      }
      else if(stateTemp === 'ACTIVE'){
        globalVariableManager.rootView.hideContent(false);
        let scale = 0.5;
        contentInfoObject.priority = 1;
        if(Platform.OS === 'android') {
          Orientation.unlockAllOrientations();
        }

        var videoWidth;
        var additionX=0;
        if (Define.constants.widthScreen<Define.constants.heightScreen) {
          videoWidth = Define.constants.widthScreen;
        }else{
          additionX = (Define.constants.widthScreen/2) - (Define.constants.heightScreen/2);
          videoWidth = videoHeight / Define.constants.videoHeight * Define.constants.videoWidth;
        }

        // Debug.log2('contentObject', self.renderStack[group][self.renderStack[group].length-1].instance);
        InteractionManager.runAfterInteractions(() => {
          self.renderStack[group][self.renderStack[group].length-1].objRef.transitionTo({
            top:Define.constants.navBarHeight,
            scale:scale,
            width:videoWidth,
            height:videoHeight,
            translateX:( additionX + (Define.constants.widthScreen/2) - ((videoWidth*scale)/2) -15)/scale ,
            translateY:(Define.constants.availableHeightScreen - videoHeight -15) /scale ,
            rotate:'0deg',
            opacity: 1,
          }, 300);
        });
      }
      else if(stateTemp === 'FULLSCREEN' ) {
        globalVariableManager.rootView.hideContent(true);
        contentInfoObject.priority = 1;
        if (Platform.OS === 'android') {
          StatusBarAndroid.fullScreen();
        }




        if (Define.constants.widthScreen<Define.constants.heightScreen) {
          widthTemp=Define.constants.widthScreen;
          heightTemp=Define.constants.heightScreen;
        }else{
          widthTemp=Define.constants.videoWidth;
          heightTemp=Define.constants.videoHeight;
        }
        InteractionManager.runAfterInteractions(() => {
          self.renderStack[group][self.renderStack[group].length-1].objRef.transitionTo({
            scale:1,
            width:widthTemp,
            height:heightTemp,
            translateX:0,
            translateY:0,
            top:0,
            rotate:'0deg',
            opacity: 1
            // rotate:''+self.accelerometerDirect+'deg',
          }, 300)
        });
        Orientation.getOrientation((err, orientation)=>{
          Debug.log2('PopupManager:Orientation.getOrientation',err,Debug.level.ERROR)
          if (orientation !== 'LANDSCAPE' && orientation !== 'UNKNOWN') {
            Orientation.lockToLandscape();
            if(Platform.OS === 'android') {
              Orientation.getOrientationConfig((orientationConfig)=>{
                // if orientationConfig is on , unlock after 4 second
                if (orientationConfig) {
                  clearTimeout(globalVariableManager.unlockAllOrientations )
                  globalVariableManager.unlockAllOrientations = setTimeout(()=>{
                    // unlock after 4 second
                    Orientation.unlockAllOrientations();
                  },2000)
                }
              });
            }
          }
        })
      } else if(stateTemp === 'FORCE_FULLSCREEN') {
          globalVariableManager.rootView.hideContent(true);
          var rotate;
          var translateY;
          var translateX;

          if (Define.constants.widthScreen<Define.constants.heightScreen) {
            widthTemp=Define.constants.heightScreen;
            heightTemp=Define.constants.widthScreen;
            translateX = -(Define.constants.heightScreen/2) + (Define.constants.widthScreen/2);
            translateY = (Define.constants.heightScreen/2) - (Define.constants.widthScreen/2);
            rotate = '-90deg';
          }else{
            widthTemp=Define.constants.widthScreen;
            heightTemp=Define.constants.heightScreen;
            translateX = 0;
            translateY = 0;
            rotate = '0deg';
          }

          self.renderStack[group][self.renderStack[group].length-1].objRef.transitionTo({
            scale:1,
            width:widthTemp,
            height:heightTemp,
            translateX: translateX,
            translateY: translateY,
            top:0,
            rotate: rotate
          });

      } else {
        globalVariableManager.rootView.hideContent(false);
        Orientation.unlockAllOrientations();
      }
      self.renderStack[group][self.renderStack[group].length-1].instance.getWrappedInstance().updateControlBar();
    }
    catch(ex){
      globalVariableManager.rootView.hideContent(false);
      Debug.log(ex,Debug.level.ERROR);
    }
    contentInfoObject.videoPopupState=stateTemp;
  }

  getVideoPopupState(){
    var self=this;

    // var group = self.getTopGroup();
    var group = VIDEO_GROUP;
    var renderGroupStack =  self.renderStack[group];

    if (!renderGroupStack[renderGroupStack.length-1]) {
      return '';
    }
    var contentInfoObject =  renderGroupStack[renderGroupStack.length-1].info;
    if (contentInfoObject && contentInfoObject.videoMotion) {
      return contentInfoObject.videoPopupState;
    }
  }
  setVideoPopupState(state){
    var self = this;
    // var group = self.getTopGroup();
    var group = VIDEO_GROUP;
    if (!self.renderStack[group] || !(self.renderStack[group][self.renderStack[group].length-1]) ||  !(self.renderStack[group][self.renderStack[group].length-1].info)) {
      return
    }
    Debug.log('setVideoPopupState', state);
    var contentInfoObject =  self.renderStack[group][self.renderStack[group].length-1].info;
    if (contentInfoObject.videoMotion) {
      self.moveVideoPopup(state,group);
    }
  }


  requireRenderContent(){
    var self=this;
    var returnElementArray = [];
    self.renderStack.forEach((current)=>{
      current.forEach((current2)=>{
        if (current2.content) {
          returnElementArray.push(current2.content)
        }
      })
    })
    Debug.log('returnElementArray ' + returnElementArray.length);
    return  returnElementArray ;
  }

  setPopupContainer(popup){
    this.popup = popup;
  }


  popAllPopup(force = 0,ignore = true,group){
    var self = this;
    return self.popPopup(force,ignore,group,true);
  }


  popPopup(force = 0,ignore = true,group=-1,allFlag=false,ignoreGroup=[]){
    var self = this;
    var ret = false;
    Debug.log('popPopup',Debug.level.USER_TRACKER);
    Debug.log(' ' + force + ' ' + ignore+ ' ' + group+ ' ' + allFlag)
    Debug.log2('ignoreGroup',ignoreGroup);
    self.renderStack.forEach((current,index)=>{
      Debug.log('Group '+ index + ':' + current.length );
    })

    var breakFlag = false;
    var startI = self.renderStack.length-1;
    var minI = 0;
    if (group>=0) {
      startI = group;
      minI = group;
      if (!self.renderStack[group]) {
        Debug.log('popup group empty '+ group)
        return;
      }
    }

    for (var i = startI; i >= minI ; i--) {
      if(ignoreGroup.find((current)=>{return (current === i);})){
        continue;
      }
      if (breakFlag && !allFlag) { break;}
      var groupArray = self.renderStack[i];
      for (var j = groupArray.length-1; j >=0; j--) {
        var element = groupArray[j];

        if (element.info.videoMotion && element.info.videoPopupState=== 'FULLSCREEN' && force<10) {
          Orientation.unlockAllOrientations();
          globalVariableManager.rootView.hideContent(false);
          var currentScreenName = globalVariableManager.reduxManager.state.Navigator.currentScreen.name;
          //if (currentScreenName==='FilmDetailScreen' || currentScreenName==='ChannelScreen') {
          //  self.moveVideoPopup('NORMAL',VIDEO_GROUP);
          //}else{
            self.moveVideoPopup('ACTIVE',VIDEO_GROUP);
          //}

          ret = true;
          breakFlag = true;
          if (!allFlag) {
            break;
          }
        }

        if (force >= element.info.priority) {
          // InteractionManager.runAfterInteractions(() => {
            self.movePopupOut(i,j).then(()=>{
                self.popup.forceUpdate();
            });
          // })

          Debug.log('pop ' + element.info.namePopup,Debug.level.USER_TRACKER);
          groupArray.splice(j,1);
          Debug.log(element.info.priority);
          if (element.info.priority>=0) {
            ret = true;
          }
          breakFlag = true;
          if (!allFlag) {
            break;
          }
        }
        else if (!ignore) {
          breakFlag = true;
          if (!allFlag) {
            break;
          }
        }
      }
    }

    Debug.log('popPopup done');
    self.renderStack.forEach((current,index)=>{
      Debug.log('Group '+ index + ':' + current.length );
    })
    return ret;
  }

  shiftPopupByGroup(group){
    var self = this;
    Debug.log('shiftPopup',Debug.level.USER_TRACKER);
    Debug.log('Group '+ group + ':' + self.renderStack[group].length );

    if (group === VIDEO_GROUP) {
      self.moveVideoToNormalAtMount=true;
    }
    // InteractionManager.runAfterInteractions(() => {
      self.movePopupOut(group,0).then(()=>{
          self.popup.forceUpdate();
      });
    // });
    self.renderStack[group].splice(0,1);

    Debug.log('shiftPopup done');
    Debug.log('Group '+ group + ':' + self.renderStack[group].length );

    return true;
  }

  getTopGroup(){
    var self = this;
    var group = 0;
    self.renderStack.forEach((current,index)=>{
      if (current.length > 0) {
        group = index;
      }
    })
    return group;
  }

  onPan(direct){
    var self = this;

    var group = self.getTopGroup();
    var renderGroupStack =  self.renderStack[group];
    if (!renderGroupStack || (!Array.isArray(renderGroupStack)) ||  (Array.isArray(renderGroupStack) && (renderGroupStack.length < 1) )) {
      return;
    }
    if (!renderGroupStack[renderGroupStack.length-1]) {
      return;
    }
    var contentInfoObject =  renderGroupStack[renderGroupStack.length-1].info;

    Debug.log('PopupActions:' + direct);
    Debug.log(contentInfoObject.videoMotion);
    Debug.log(contentInfoObject.videoPopupState);
    switch (direct) {
      case 'UP':
        if (contentInfoObject.videoMotion) {
          // this is video popup => animated popup
          if (contentInfoObject.videoPopupState === 'ACTIVE') {
            self.moveVideoPopup('NORMAL',group);
          }
        }
        break;
      case 'DOWN':
        if (contentInfoObject.videoMotion) {
          // this is video popup => animated popup
          if (contentInfoObject.videoPopupState === 'NORMAL') {

            self.moveVideoPopup('ACTIVE',group);
          }
        }
        break;
      case 'LEFT':
        if (contentInfoObject.videoMotion) {
          // this is video popup => animated popup
          if (contentInfoObject.videoPopupState === 'ACTIVE') {
            self.popPopup(1,true,VIDEO_GROUP);
          }
        }
        break;
      case 'RIGHT':
        if (contentInfoObject.videoMotion) {
          // this is video popup => animated popup
          if (contentInfoObject.videoPopupState === 'ACTIVE') {
            self.popPopup(1,true,VIDEO_GROUP);
          }
        }
        break;
      default:
    }
  }

  // setRenderContentAndShow(renderContent=null,containerStyle=null,argIn={}){
  // TODO : support RenderContent is redux connected
  setRenderContentAndShow(
                          RenderContent={},
                          renderContentProps={},
                          renderContentFunc=null,
                          containerStyleIn=null,
                          argIn={}){
    var self = this;
    var argFormat={
      group:POPUP_GROUP,
      priority:0,

      movePopupIn:undefined, // function
      movePopupOut:undefined, // function
      animationType:'flash',

      pointerEvents:undefined,
      noDetectGes:false,
      tapToExit : true,
      videoMotion: false,
    }

    var RenderContentTemp = RenderContent;
    if (RenderContent.WrappedComponent) {
      RenderContentTemp = RenderContent.WrappedComponent;
    }

    var config = Object.assign({}, RenderContentTemp.config);
    var containerStyle = _.merge(RenderContentTemp.containerStyle,containerStyleIn) ;
    var configTemp = _.merge( Util.formatObject(config,argFormat) , argIn);
    var {
      group,
      priority,

      movePopupIn,
      movePopupOut,

      pointerEvents,
      noDetectGes,
      tapToExit,
      videoMotion
    } = configTemp;

    if (videoMotion) {
      priority = -1;
    }


    // check limit number Child of group popup
    while(group > self.renderStack.length - 1){
      self.renderStack.push([]);
    }

    var oldVideoState='NORMAL';
    if ((group <= self.numberChildOfEachGroup.length) && (self.numberChildOfEachGroup[group] > 0) && (self.renderStack[group].length >= self.numberChildOfEachGroup[group])) {
      // so pop oldest popup of this group
      oldVideoState = self.getVideoPopupState();
      self.shiftPopupByGroup(group);
      globalVariableManager.needRenderControlVideoPopup = true;
    }


    Debug.log2('pushPopup',RenderContentTemp.componentName,Debug.level.USER_TRACKER);
    Debug.log2('configTemp',configTemp);
    Debug.log2('containerStyle',containerStyle);
    self.renderStack.forEach((current,index)=>{
      Debug.log('Group '+ index + ':' + current.length );
    })

    self.renderStack[group].push({
                            info: new RenderContentInfo(
                                {
                                  group:group,
                                  priority:priority
                                },
                                {
                                  pointerEvents:pointerEvents,
                                  namePopup:RenderContentTemp.componentName,
                                  noDetectGes:noDetectGes,
                                  tapToExit:tapToExit,
                                  videoMotion:videoMotion,
                                },
                                {
                                  movePopupIn:movePopupIn,
                                  movePopupOut:movePopupOut,
                                })
                              })

    var renderGroupStack =  self.renderStack[group];
    var contentObject = renderGroupStack[renderGroupStack.length-1];
    var contentInfoObject =  renderGroupStack[renderGroupStack.length-1].info;
    var containerStyleParent = Object.assign({}, StyleSheet.flatten(containerStyle));

    delete containerStyleParent.width;
    delete containerStyleParent.height;
    if (contentInfoObject.videoMotion) {
      delete containerStyleParent.top;
      delete containerStyleParent.bottom;
      delete containerStyleParent.left;
      delete containerStyleParent.right;
    }

    var containerStyleTemp = Object.assign({}, StyleSheet.flatten(containerStyle));
    if (!contentInfoObject.videoMotion) {
      delete containerStyleTemp.top;
      delete containerStyleTemp.bottom;
      delete containerStyleTemp.left;
      delete containerStyleTemp.right;
    }

    var renderContentTemp ;
    if(RenderContent !== null){
      renderContentTemp= <RenderContent ref={(ref)=>{contentObject.instance = ref}} {...renderContentProps}/>;
    }
    else{
      renderContentTemp= <EmptyPopup/>;
    }

    if (renderContentFunc) {
      renderContentTemp = renderContentFunc();
    }
    var popup =
    <View
        onLayout={()=>{
          Debug.log('PopupManager: onLayout')
        }}
        ref={(objContainRef)=>{
          Debug.log('PopupManager: ref')
          if (contentObject) {
              contentObject.objContainRef = objContainRef;
              if (contentObject.info.startFlag) {
                InteractionManager.runAfterInteractions(() => {
                  self.movePopupIn(group)
                  .then(()=>{
                    var currentScreenName = globalVariableManager.reduxManager.state.Navigator.currentScreen.name;
                    var currentDirect = globalVariableManager.reduxManager.state.AppState.currentDirect;
                    // if (contentObject.info.videoMotion &&
                    //   ( (currentDirect===RDActionsTypes.APP_STATE_DIRECT_LIST.LANDSCAPE) || (self.getVideoPopupState()!=='FULLSCREEN' ) && (currentScreenName==='FilmDetailScreen' || currentScreenName==='ChannelScreen' ))
                    //   && self.moveVideoToNormalAtMount) {
                    //   self.moveVideoToNormalAtMount = false;
                    //   self.setVideoPopupState('NORMAL');
                    // }
                    if(contentObject.info.videoMotion) {
                      if (currentDirect===RDActionsTypes.APP_STATE_DIRECT_LIST.LANDSCAPE &&  (currentScreenName==='FilmDetailScreen' || currentScreenName==='ChannelScreen' )) {
                        self.setVideoPopupState('FULLSCREEN');
                      } else if(currentDirect===RDActionsTypes.APP_STATE_DIRECT_LIST.PORTRAIT &&  (currentScreenName==='FilmDetailScreen' || currentScreenName==='ChannelScreen' )) {
                        self.setVideoPopupState('NORMAL');
                      }
                    }
                  });

                  if (contentObject.objContainRef) {
                      contentObject.objContainRef.setNativeProps({style:{opacity:1}});
                  }

                });
                contentObject.info.startFlag = false;
              }else{
                if (contentObject.objContainRef) {
                    contentObject.objContainRef.setNativeProps({style:{opacity:1}});
                }
              }
          }
        }}
        pointerEvents ={contentInfoObject.videoMotion? 'box-none':contentInfoObject.pointerEvents? contentInfoObject.pointerEvents : 'auto'}
        key={(group*100)+renderGroupStack.length}
        style={[
          {position:'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:contentInfoObject.namePopup === 'HotNewsPopup'?'rgba(0,0,0,0.7)':'rgba(0,0,0,0.2)',alignItems:'center',justifyContent:'center'},
          containerStyleParent,
          {opacity :0}

        ]}>
      <Animatable.View
          ref={(objRef)=>{
            Debug.log('PopupManager: Animatable.View ref')
            if (contentObject) {
                contentObject.objRef = objRef;

                if (contentInfoObject.videoMotion && oldVideoState!=='NORMAL') {
                  self.setVideoPopupState(oldVideoState);
                }
            }

            }}
          style={StyleSheet.flatten([
           {position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'},
           contentObject.info.videoMotion?{...StyleConfig.default.shadownStyle}:undefined,
           containerStyleTemp
           ])}
          pointerEvents ={'auto'}
          onMoveShouldSetResponderCapture   ={(evt)=>{
            var touchHistory = Platform.OS ==='ios' ? evt.touchHistory.touchBank[1] : evt.touchHistory.touchBank[0];
            if (!touchHistory) {return false;}

            if (!contentObject || !contentObject.info.videoMotion) {
              return false;
            }

            if (contentObject.info.videoPopupState === 'FULLSCREEN') {
              return false;
            }
            if ((  (touchHistory.currentPageX - touchHistory.startPageX > 20 )||
              (touchHistory.currentPageX - touchHistory.startPageX < -20 )) &&
             (contentObject.info.videoPopupState === 'NORMAL')){
               return false;
             }

            if ((  (touchHistory.currentPageY - touchHistory.startPageY> 20 )||
              (touchHistory.currentPageY - touchHistory.startPageY < -20 )) &&
             (contentObject.info.videoPopupState === 'FULLSREEN')){
               return false;
             }

            if ((touchHistory.currentPageY - touchHistory.startPageY > 20 ) ||
              (touchHistory.currentPageY - touchHistory.startPageY < -20 ) ||
              (touchHistory.currentPageX - touchHistory.startPageX > 20 )||
              (touchHistory.currentPageX - touchHistory.startPageX < -20 )){
              Debug.log('onMoveShouldSetResponderCapture  ') ;
              return true;
            }
            else{
              return false;
            }
          }}

          onStartShouldSetResponder  ={()=>{
            if (contentObject && contentObject.info.noDetectGes) {
              return false;
            }
            Debug.log('onStartShouldSetResponder ') ;
            return true;
          }}

          // onResponderMove ={(evt)=>{
          //   return;
          //   if(contentObject.info.videoMotion) {
          //     const currentStateVideo = self.getVideoPopupState();
          //     const currentScreenName = globalVariableManager.reduxManager.state.Navigator.currentScreen.name;
          //     const heightStatusBar = (currentScreenName === 'FilmDetailScreen' || currentScreenName === 'ChannelScreen') ? Define.constants.navBarHeight : 0;
          //
          //     const addBottom = 50;
          //     const addRight = 20;
          //     const widthScreen = Define.constants.widthScreen;
          //
          //     let translateX = 0;
          //     let translateY = 0;
          //     let opacity = 1;
          //     let scale = 1;
          //     var touchHistory = Platform.OS ==='ios' ? evt.touchHistory.touchBank[1] : evt.touchHistory.touchBank[0];
          //
          //     const currentX = touchHistory.currentPageX;
          //     const startX = touchHistory.startPageX;
          //     const currentY = touchHistory.currentPageY;
          //     const startY = touchHistory.startPageY;
          //     const previousPageX = touchHistory.previousPageX;
          //     const previousPageY = touchHistory.previousPageY;
          //
          //     var videoSize={
          //       width: Define.constants.widthScreen<Define.constants.heightScreen?
          //               Define.constants.widthScreen:Define.constants.heightScreen,
          //       height:  (((Define.constants.widthScreen<Define.constants.heightScreen?
          //         Define.constants.widthScreen:Define.constants.heightScreen)/Define.constants.videoWidth)
          //         *Define.constants.videoHeight ),
          //     }
          //
          //     if(currentStateVideo === 'NORMAL') {
          //       if(currentY > startY) {
          //         scale = 1 - 0.5*(currentY - startY)/(Define.constants.availableHeightScreen - heightStatusBar - addBottom - videoSize.height/2);
          //         if(scale < 0.5) {
          //           return;
          //         }
          //         const widthLost = videoSize.width*(1-scale);
          //         const heightLost = videoSize.height*(1-scale);
          //         translateY = (currentY - startY)/scale;
          //         translateX = (widthLost/2 - addRight*(1-scale))/scale;
          //       }
          //     } else if (currentStateVideo === 'ACTIVE') {
          //       const type = '';
          //       scale = 0.5;
          //       const deltaX = currentX - startX;
          //       const deltaY = currentY - startY;
          //
          //       if(!contentObject.direction) {
          //         if(Math.abs(deltaX) >= Math.abs(deltaY)) {
          //           contentObject.direction = 'X';
          //         } else {
          //           contentObject.direction = 'Y';
          //         }
          //       }
          //
          //       if(contentObject.direction === 'X') {
          //         const widthLost = videoSize.width*(1-scale);
          //         const heightLost = videoSize.height*(1-scale);
          //         const temp1 = Define.constants.widthScreen < Define.constants.heightScreen ? 0 : (Define.constants.widthScreen - videoSize.width);
          //         translateX = (temp1 + widthLost/2 + deltaX - addRight)/scale;
          //         translateY = (Define.constants.availableHeightScreen - videoSize.height -15) /scale;
          //         const temp = Define.constants.widthScreen < Define.constants.heightScreen ? Define.constants.widthScreen : Define.constants.heightScreen;
          //         opacity = 1 - Math.abs(deltaX)/(temp - addRight);
          //       } else {
          //         scale = 0.5 + 0.5*(startY - currentY)/(Define.constants.availableHeightScreen - heightStatusBar - addBottom - videoSize.height/2);
          //
          //         if(currentY >= startY || scale >= 1 || (Define.constants.widthScreen > Define.constants.heightScreen)) {
          //           if(Define.constants.widthScreen > Define.constants.heightScreen && contentObject.direction === 'Y') {
          //             contentObject.direction = 'X';
          //           }
          //           return;
          //         }
          //
          //         const widthLost = videoSize.width*(1-scale);
          //         translateY = (Define.constants.availableHeightScreen - heightStatusBar - addBottom - videoSize.height/2 + currentY - startY)/scale;
          //         translateX = (widthLost/2 - addRight*(1-scale))/scale;
          //       }
          //
          //     } else {
          //       return;
          //     }
          //     contentObject.objRef.transitionTo({
          //       translateY: translateY,
          //       translateX: translateX,
          //       scale: scale,
          //       opacity: opacity
          //     },10) ;
          //   }
          //   // console.log('onResponderMove');
          //   // // console.log(evt.nativeEvent);
          //   // // console.log(evt.timeStamp);
          //   // console.log(evt);
          //   //
          //   // console.log(evt.nativeEvent);
          //   // console.log(_.merge({}, evt.touchHistory));
          //   // const data = evt.touchHistory.touchBank[1];
          //   // var temp = evt.touchHistory.touchBank[0];
          //   // // console.log(contentObject.objRef)
          //   //
          //   //
          //   //
          //   // if (contentObject) {
          //   //   var temp1 = (contentObject.objRef.state.transitionValues.translateX?contentObject.objRef.state.transitionValues.translateX._value:0) + temp.currentPageX-temp.previousPageX;
          //   //   var temp2 = (contentObject.objRef.state.transitionValues.translateY?contentObject.objRef.state.transitionValues.translateY._value:0) + temp.currentPageY-temp.previousPageY;
          //   //
          //   //   console.log(temp1);
          //   //   console.log(temp2)
          //   //
          //   //   // var scale = contentObject.objRef.state.transitionValues.scale?contentObject.objRef.state.transitionValues.scale._value:1;
          //   //
          //   //   // temp1 *= scale;
          //   //   // temp2 *= scale;
          //   //   //
          //
          //
          //   // }
          // }}
          onResponderRelease={(evt)=>{
            var direct = null;
            var touchHistory = Platform.OS ==='ios' ? evt.touchHistory.touchBank[1] : evt.touchHistory.touchBank[0];
            if ((touchHistory.currentPageY - touchHistory.startPageY > 20 )) {direct='DOWN';}
            else if ((touchHistory.currentPageY - touchHistory.startPageY < -40 )) {direct='UP';}
            if (direct !== null) {
              self.onPan(direct);
            }
            else if ((touchHistory.currentPageX - touchHistory.startPageX > 20 )) {direct='RIGHT';}
            else if ((touchHistory.currentPageX - touchHistory.startPageX < -20 )) {direct='LEFT';}
            if (direct !== null) {self.onPan(direct);}
            else {
              // self.setVideoPopupState(self.getVideoPopupState());
            }
            // Debug.log(self.renderContentInfoStack[self.renderContentInfoStack.length-1].tapToExit)
            if ((evt.target === evt.currentTarget) && (contentObject) &&  (contentObject.info.tapToExit)) {
              self.popPopup(10);
            }
          }}
          type={contentInfoObject.animationType}
           >
        {renderContentTemp}
      </Animatable.View>
    </View>


    contentObject.content = popup;

    // if (contentInfoObject.videoMotion && oldVideoState!=='NORMAL') {
    //   self.setVideoPopupState(oldVideoState);
    // }

    self.popup.forceUpdate();

    Debug.log('pushPopup done ');
    self.renderStack.forEach((current,index)=>{
      Debug.log('Group '+ index + ':' + current.length );
    })
  }

  getPopupStackSize(group=-1){
    var self = this;
    var number = 0;
    if (group<0) {
      self.renderStack.forEach((current)=>{
        number += current.length;
      })
    }
    else{
      number = self.renderStack[group] ? self.renderStack[group].length : 0;
    }
    return number;
  }
}

//
const popupActions = new PopupActions();
//
var PopupManager = React.createClass({
  containerStyle:null,

  getInitialState:function(){
    return({

    })
  },
  componentWillMount:function(){
    popupActions.setPopupContainer(this);
  },

  render:function(){
    var self = this;
    return(
        <View
          pointerEvents={'box-none'}
          style={{position:'absolute',top:0,bottom:0,left:0,right:0,alignItems:'center',justifyContent:'center'}}>
          {popupActions.requireRenderContent(self)}
        </View>
    )
  }
})


var popupConst={
  SCREEN_GROUP : SCREEN_GROUP,
  VIDEO_GROUP : VIDEO_GROUP,
  POPUP_GROUP : POPUP_GROUP,
  INFO_GROUP: INFO_GROUP,
}

globalVariableManager.popupActions=popupActions;
module.exports = {PopupManager,popupActions,popupConst};
