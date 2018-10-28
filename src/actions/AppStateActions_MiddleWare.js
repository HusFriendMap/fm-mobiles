import {
  Platform
} from 'react-native';
var DeviceInfo = require('react-native-device-info');

// var _ = require('lodash')
var RDActionsTypes = require('./RDActionsTypes');
import RDActions_MiddleWare from './RDActions_MiddleWare'
import axios from 'axios';

// LIB
var TimeoutCallback = require('timeout-callback');

// components
var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');

var {socketConnection} = require('../components/modules/ConnectionsManager');
var RDActions = require('./RDActions');

// NOTE : stuck when call getState (when dispatch another action in a action)

/*
 * action creators
 */

class AppStateActions_MiddleWare extends RDActions_MiddleWare {
  constructor(){
    super('AppStateActions_MiddleWare',true);
    this.init();
  }
  actionsList:Object={
    getConfigForUseApp: {
      query:'/app/config',
      argFormat:{
        platform:''
      },
      argMap:{},
      limitProcess:1,
      apiVersion:Define.constants.apiVersion,
      onArg:(arg,getState)=>{
        return {
          platform: Platform.OS,
          nativeVersion: DeviceInfo.getBuildNumber()
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:undefined, // (dispatch,getState,data)=>{return true},
    },
    reportLocation: {
      query:'/app/report-location',
      argFormat:{
        platform:''
      },
      argMap:{},
      limitProcess:1,
      apiVersion:Define.constants.apiVersion,
      onArg:(arg,getState)=>{
        return {
          message: arg.message,
          feed_id: arg.id,
          nameLocation: arg.nameLocation
        };
      },
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:undefined, // (dispatch,getState,data)=>{return true},
    }
  }

  setShowLoading(show) {
    const actionName = 'showLoading';

    return (dispatch: Function) => {
      return new Promise((resolve,reject)=>{
          dispatch(RDActions[this.sortName][actionName+'OnRequest']({show}))
      })
    }
  }
  getConfig(arg:Object={},setState:boolean = true){
  // return;
  var self = this;
  var url = Define.constants.proxyAddr;

  var actionName = 'getConfig';
  var argFormat={
    platform: Platform.OS,
    nativeVersion: DeviceInfo.getBuildNumber()
  }

  var argTemp = Util.dataProtectAndMap(arg, argFormat);

  var preTextLog = self.name+':'+actionName+':';

  return (dispatch: Function) => {
    return new Promise((resolve,reject)=>{
        dispatch(RDActions[this.sortName][actionName+'OnRequest'](argTemp))
        const uri = `${url}?nativeVersion=${argTemp.nativeVersion}&platform=${argTemp.platform}`;
        axios
          .get(uri)
          .then((res) => {
            let data = {
              systemError: true
            };

            if(res.status === 200 && res.data.code === 200) {
              data = res.data.data;
            }

            dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS,data));
            resolve(res);
          })
          .catch((err) => {
            let data = {
              networkError: err.message === 'Network Error' ? true : false,
              systemError: true
            }

            dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS,data));
            reject(err);
          })
        })
      }
  }
}


module.exports= new AppStateActions_MiddleWare();
