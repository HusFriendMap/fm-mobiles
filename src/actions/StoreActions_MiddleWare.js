
// LIB

var {
  AsyncStorage,
} = require('react-native');

// var TimeoutCallback = require('timeout-callback');

//
var RDActionsTypes = require('./RDActionsTypes');


// components
// var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');

var RDActions = require('./RDActions');

/*
 * action creators
 */

const StoreActions_MiddleWare={
  name:'StoreActions_MiddleWare',
  logRes:true,
  set:function(arg={},setState=true){//key,value
    var self = this;
    var actionName = 'set';
    var argFormat={
      key:undefined,
      value:undefined,
    }
    var argTemp = Util.dataProtectAndMap(arg, argFormat);

    var {key,value}=argTemp;

    var preTextLog = self.name+':'+actionName+':';
    return (dispatch) => {
      var req = 'setItem';
      // req config
      //
      Debug.log(self.name+':'+actionName);
      if(setState) {dispatch(RDActions.StoreActions[actionName+'OnRequest']());}
      var data = {};
      var promise = new Promise((resolve,reject)=>{
        AsyncStorage[req](key,value)
          .then((res)=>{
            Debug.log(preTextLog +'success:res:');
            if (self.logRes) {
              Debug.log(res);
            }
            data={
              arg:argTemp,
              res:res,
            }
            if(setState){ dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.SUCCESS,data));}
            resolve(data);
            return;
          })
          .catch((err)=>{
            Debug.log(preTextLog +'err:');
            // Debug.log(err);
            if (err == 'Error: callback timeout') {
              Debug.log(preTextLog+'callback timeout');
            }
            data={
              arg:argTemp,
              err:err,
            }
            if(setState){dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.ERROR,data));}
            reject(data);
            return;
          }).done();
        })
      return promise;
    }
  },

  get:function( arg={},setState=true){
    var self = this;
    var actionName = 'get';
    var argFormat={
      key:undefined,
    }
    Object.keys(argFormat).forEach((key)=>{
      if (!arg.hasOwnProperty(key) ) {
        arg[key] = argFormat[key];
      }
    })

    var {key}=arg;

    var preTextLog = self.name+':'+actionName+':';
    return (dispatch) => {
      var req = 'getItem';
      // req config
      //

      Debug.log(self.name+':'+actionName);
      if(setState) {dispatch(RDActions.StoreActions[actionName+'OnRequest']());}

      var promise = new Promise((resolve,reject)=>{
        AsyncStorage[req](key)
          .then((res)=>{
            Debug.log(preTextLog +'res:');
            if (self.logRes) {
              Debug.log(res);
            }
            var data={};
            data.key=key;
            data.res=res;
            if (!res) { // null
              if(setState) {dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.ERROR,data));}
              reject(data);
              return;
            }
            if(setState) {dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.SUCCESS,data));}
            resolve(data);
            return;
          })
          .catch((err)=>{
            Debug.log(preTextLog +'err:');
            // Debug.log(err);
            if (err == 'Error: callback timeout') {
              Debug.log(preTextLog+'callback timeout');
            }
            if(setState) {dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.ERROR,err));}
            reject(err);
            return;
          }).done();
        })
      return promise;
    }
  },

  remove:function( arg={},setState=true){
    var self = this;
    var actionName = 'remove';
    var argFormat={
      key:undefined,
    }
    Object.keys(argFormat).forEach((key)=>{
      if (!arg.hasOwnProperty(key) ) {
        arg[key] = argFormat[key];
      }
    })

    var {key}=arg;

    var preTextLog = self.name+':'+actionName+':';
    return (dispatch) => {
      var req = 'removeItem';
      // req config
      //

      Debug.log(self.name+':'+actionName);
      if(setState) {dispatch(RDActions.StoreActions[actionName+'OnRequest']());}

      var promise = new Promise((resolve,reject)=>{
        AsyncStorage[req](key)
          .then((res)=>{
            Debug.log(preTextLog +'res:');
            if (self.logRes) {
              Debug.log(res);
            }
            var data={};
            data.key=key;

            if(setState) {dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.SUCCESS,data));}
            resolve(data);
            return;
          })
          .catch((err)=>{
            Debug.log(preTextLog +'err:');
            // Debug.log(err);
            if (err == 'Error: callback timeout') {
              Debug.log(preTextLog+'callback timeout');
            }
            if(setState) {dispatch(RDActions.StoreActions[actionName+'OnResult'](RDActionsTypes.REQUEST_SUBTYPE.ERROR,err));}
            reject(err);
            return;
          }).done();
        })
      return promise;
    }
  },


}

module.exports=StoreActions_MiddleWare;
