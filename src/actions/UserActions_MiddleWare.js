var _ = require('lodash')
var RDActionsTypes = require('./RDActionsTypes');
import RDActions_MiddleWare from './RDActions_MiddleWare'
import {Actions} from 'react-native-router-flux'

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  LoginManager
} = FBSDK;
import {
  Platform,
  NativeModules
} from 'react-native';

var RNIntent = NativeModules.RNIntent;
//LIB
var TimeoutCallback = require('timeout-callback');
var DeviceInfo = require('react-native-device-info');

//components
var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');

var {socketConnection} = require('../components/modules/ConnectionsManager');
var RDActions = require('./RDActions');
var {globalVariableManager}= require('../components/modules/GlobalVariableManager');

// NOTE : stuck when call getState (when dispatch another action in a action)

/*
 * action creators
 */

 class UserActions_MiddleWare extends RDActions_MiddleWare {
   constructor() {
     super('UserActions_MiddleWare',true);
     this.init();
   }
   actionsList:Object={
     login:{
      query:'/member/login',
      argFormat:{},
      argMap:{},
      showLoading: true,
      apiVersion:Define.constants.apiVersion,
      limitProcess:1,
      onArg:(arg,getState)=>{
        return {
          access_token:arg.access_token
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone: undefined, // (dispatch,getState,data)=>{return true},
    },
    get:{
      query:'/member/get',
      argFormat:{},
      argMap:{},
      apiVersion:Define.constants.apiVersion,
      limitProcess:1,
      onArg:(arg,getState)=>{
        return {
          memberToken: getState().User.memberInfo.data.memberToken,
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
    listService:{
      query:'/app/list-service',
      argFormat:{},
      argMap:{},
      apiVersion:Define.constants.apiVersion,
      limitProcess:1,
      onArg:(arg,getState)=>{
        return {
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
    listCard:{
      query:'/card/list',
      serverAddr:'http://103.63.109.105:9999',
      argFormat:{},
      argMap:{},
      apiVersion:1.0,
      limitProcess:1,
      methode:'get',
      onArg:(arg,getState)=>{
        return {
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
    getCard:{
      query:'/card/get',
      serverAddr:'http://103.63.109.105:9999',
      argFormat:{},
      argMap:{},
      apiVersion:1.0,
      limitProcess:1,
      showLoading:true,
      onArg:(arg,getState)=>{
        return {
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
    placesSearch:{
      query:'/google/search-places',
      argFormat:{},
      argMap:{},
      apiVersion:1.0,
      limitProcess:1,
      showLoading:true,
      onArg:(arg,getState)=>{
        return {
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
    placeDetail:{
      query:'/google/place-detail',
      argFormat:{},
      argMap:{},
      apiVersion:1.0,
      limitProcess:1,
      showLoading:true,
      onArg:(arg,getState)=>{
        return {
          ...arg
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:(dispatch,getState,data)=>{
        return true
      },
    },
   }
   loginFacebook(arg:Object={},setState:boolean = true){
    var self = this;
    var actionName = 'loginFacebook';
    var preTextLog = self.name+':'+actionName+':';

    return (dispatch: Function) => {
      var data = {};
      return new Promise((resolve,reject)=>{
        Debug.log2(`${preTextLog}:OnRequest:`, arg);

        LoginManager
          .logInWithReadPermissions(['public_profile', 'email'])
          .then(result => {
            if(result.isCancelled) {
              Debug.log(`${preTextLog}:UserCanceled:`);
              return new Promise.reject();
            }
            Debug.log2(`${preTextLog}:OnSuccess:`, result);
            return AccessToken
                .getCurrentAccessToken()
          }).then(data => {
            Debug.log2(`${preTextLog}:getAccessToken:`, data);
            if(data) {
              let accessToken = data.accessToken.toString();
              return resolve(accessToken);
            }

            return Promise.reject(new Error(`Can't get accessToken after loginFacebook success`));
          }).catch(err => {
            Debug.log2(`${preTextLog}:OnError:`, err);
            data = {
              arg:arg,
              err:err,
            }
            // if(setState) {dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.ERROR, data));}
            reject(err);
          }
        );
      })
    }
  }
    logout(arg:Object = {},setState:boolean = true) {
    const memberToken = _.get(globalVariableManager, 'reduxManager.state.User.memberInfo.member.memberToken', '');
    var self = this;
    var actionName = 'logout';
    var preTextLog = self.name+':'+actionName+':';
    //Debug.log(`${preTextLog}:logOut:`, arg);
    return (dispatch: Function) => {
      let data = {};
      if(setState) {dispatch(RDActions[this.sortName][actionName+'OnRequest']());}

      return new Promise((resolve, reject) => {
        // Logout facebook
        LoginManager
          .logOut();


        if(setState) {dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS,data));}
        resolve();
      });
    }
  }

 }
module.exports= new UserActions_MiddleWare();
