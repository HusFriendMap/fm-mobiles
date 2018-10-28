
//LIB

var { Actions} = require('react-native-router-flux');

//components
var Debug = require('../../Util/Debug');
// var Themes = require('../../Themes');
// var Define = require('../../Define');
// var Include = require('../../Include');


var {popupActions,popupConst} = require('../popups/PopupManager');
var {globalVariableManager} = require('./GlobalVariableManager')

// var ChannelActions_MiddleWare = require('../../actions/ChannelActions_MiddleWare');
// var MovieActions_MiddleWare = require('../../actions/MovieActions_MiddleWare');

//popup

//variable

// deepLink struct

class DeepLinkManager{
  constructor(){
    var self = this;
    self.linkActions={
      screen:function(screenName,options,extras){
        if (globalVariableManager.rootView) {
          globalVariableManager.rootView.drawSideMenu(false);
        }

        if (options.process) {
          options.process(screenName,options,extras)
          .then(()=>{
            popupActions.popAllPopup(1,true,popupConst.POPUP_GROUP);
            Actions[screenName](extras);
          });
        }
        else{
          popupActions.popAllPopup(1,true,popupConst.POPUP_GROUP);
          Actions[screenName](extras);
        }
      },
      popup:function(Popup,options,extras){
        // if (options.process) {
        //   options.process(Popup,options,extras);
        // }
        // else{
        //   popupActions.popAllPopup(1,true,2);
        //   popupActions.popAllPopup(0,true,1);
        //   popupActions.setRenderContentAndShow(()=>{
        //     return(<Popup {...extras} /> )
        //   },
        //   options.style,
        //   options.conf)
        // }
      },
      // page:function(popup,options,extras){
      // },
      sideMenu:function(sideMenu,options,extras){
        popupActions.popAllPopup(1,true,popupConst.POPUP_GROUP);
        popupActions.popAllPopup(0,true,popupConst.VIDEO_GROUP);
        self.rootView.drawSideMenu(true);
      },
    }

    self.linkList={
      screen:{
        // :{
        //   target:'',
        //   options:{
        //     process:function(screenName,options,extra){
        //       // return globalVariableManager.reduxManager.dispatch(ChannelActions_MiddleWare.listCatalog({option:'CATALOG_LIST_CHANNEL'}));
        //     }
        //   },
        //   param:{},
        // },

      },
      popup:{
        Popup:{
          // target:Popup,
          // options:{
          //   style:{
          //     flexDirection:'column',
          //     justifyContent:'flex-start',
          //     top:Define.constants.navBarHeight,
          //   },
          //   conf:{
          //     noDetectGes:true,
          //   },
          // }
        },
      },
      sideMenu:{
        sideMenu:{
          target:'sideMenu',
          options:{},
        }
      }
    }
  }
  setRootView(rootView){
    var self = this;
    self.rootView = rootView;
  }
  checkLink(link){
    var self = this;
    var ret = null;
    // for type
    Object.keys(self.linkList).forEach((key)=>{
      if (self.linkList.hasOwnProperty(key)) {
        var typeList = self.linkList[key];
        // for target of each type
        Object.keys(typeList).forEach((keyChild)=>{
          if (typeList.hasOwnProperty(keyChild)) {
            if (link === keyChild) {
              // founded
              ret = key;
            }
          }
        });
      }
    })
    if (ret) {
      return ret;
    }
    return false;
  }

  processLink(deepLink){
    var self = this;
    var argFormat = {
      link:'',
      extras:{},
    };
    Object.keys(argFormat).forEach((key)=>{
      if (!deepLink.hasOwnProperty(key)) {
        deepLink[key] = argFormat[key];
      }
    })
    var {link,extras} = deepLink;
    if (!extras) {
      extras={};
    }
    // var reduxManager= globalVariableManager.reduxManager;
    var ret = self.checkLink(link);
    Debug.log('Process DeepLink:'+ret+':'+link+':'+JSON.stringify(extras));
    if (ret) {
      // try{
        // Debug.log('Check config avaiable');
        // if ((!reduxManager.state.News.config.app_betting && link==='ExactlyPredictScreen') ||
        //     (!reduxManager.state.News.config.app_serviceScreen && link==='ServiceScreen') ||
        //     (!reduxManager.state.News.config.app_account && (link==='LoginPopup' || link==='AcountInfoScreen' || link ==='PasswordChangeScreen' || link ==='ProScreen' || link === 'HistoryScreen' ))) {
        //   Debug.log('link ' + link + ' is not enable ABORT, app_config = ' + JSON.stringify(reduxManager.state.News.config),Debug.level.ERROR);
        //   return;
        // }
        Debug.log('Check extras');
        var countExtra = 0;
        var extraKey;
        Object.keys(extras).forEach((key)=>{
          if (extras.hasOwnProperty(key)) {
            countExtra++;
            extraKey=key
            if(!self.linkList[ret][link].param.hasOwnProperty( key)){
              Debug.log('WRONG EXTRA ' + key);
            }
          }
        })

        var trueExtra = extras;
        if(countExtra===1 ){
          // check if param has only one param
          var countParam = 0;
          var paramKey;
          Object.keys(self.linkList[ret][link].param).forEach((key)=>{
            if (self.linkList[ret][link].param.hasOwnProperty(key)) {
              countParam++;
              paramKey=key;
            }
          })
          if (countParam ===1 ) {
            // so nest extras and param
            Debug.log('param has only one param => nest extras and param')
            trueExtra ={};
            trueExtra[paramKey] = extras[extraKey];
          }
        }
        // protect undefined param
        Debug.log('protect undefined param')
        if (self.linkList[ret][link].param) {
          Object.keys(self.linkList[ret][link].param).forEach((key)=>{
            if (!trueExtra[key]) {
              trueExtra[key] = self.linkList[ret][link].param[key];
            }
          });
        }


        Debug.log('Process DeepLink:linkActions:'+ret+':'+link+':'+JSON.stringify(trueExtra),Debug.level.USER_TRACKER);
        var linkStruct = self.linkList[ret][link];
        self.linkActions[ret](linkStruct.target,linkStruct.options,trueExtra);
      // }
      // catch(ex){
      //   Debug.log('Process DeepLink Error',Debug.level.ERROR);
      //   Debug.log(ex,Debug.level.ERROR);
      // }
    }
    else{
      Debug.log('DeepLink not valid',Debug.level.ERROR);
    }
  }

}
const deepLinkManager = new DeepLinkManager();
module.exports= {deepLinkManager};
