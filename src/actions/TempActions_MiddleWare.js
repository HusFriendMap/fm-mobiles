
// var _ = require('lodash')
var RDActionsTypes = require('./RDActionsTypes');
import RDActions_MiddleWare from './RDActions_MiddleWare'

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

class TempActions_MiddleWare extends RDActions_MiddleWare {
  constructor(){
    super('TempActions_MiddleWare',true);
    this.init();
  }
  actionsList:Object={
    action:{
      query:'',
      argFormat:{},
      argMap:{},
      limitProcess:1,
      onArg:undefined, //(arg,getState)=>{return arg;},
      onError:undefined, // (dispatch,getState,data)=>{return true},
      onDone:undefined, // (dispatch,getState,data)=>{return true},
    },
  }

  // tempFunction(arg:Object={},setState:boolean = true){
  //   var self = this;
  //   var actionName = '...';
  //   var query = '....';
  //   var argFormat={
  //     fetchOption:{
  //       dt: {
  //       },
  //     },
  //   }
  //   var argTemp = Util.dataProtectAndMap(arg, argFormat);
  //   var {fetchOption} = argTemp;
  //
  //   var preTextLog = self.name+':'+actionName+':';
  //
  //   return (dispatch: Function) => {
  //     var req = fetchOption;
  //     // req config
  //     //
  //     Debug.log(preTextLog+':'+query+':'+JSON.stringify(req));
  //     var data = {};
  //     var promise = new Promise((resolve,reject)=>{
  //       if (socketConnection.getConnectState()) {
  //         if(setState) {dispatch(RDActions[this.sortName][actionName+'OnRequest']())}
  //           socketConnection.emit(query,req,
  //               TimeoutCallback(Define.constants.requestTimeout,(err,res) => {
  //                 Debug.log(preTextLog+':callback:'+query+':'+JSON.stringify(req));
  //                 if (err){
  //                   Debug.log(preTextLog +'err:',Debug.level.ERROR);
  //                   // Debug.log(err);
  //                   if (err == 'Error: callback timeout') {
  //                     Debug.log(preTextLog+'callback timeout',Debug.level.ERROR);
  //                   }
  //                   data={
  //                     arg:argTemp,
  //                     err:err,
  //                   }
  //                   if(setState) {dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.ERROR,data));}
  //                   reject(data);
  //                 }
  //                 else{
  //                   Debug.log(preTextLog +'res:');
  //                   if (self.logRes) {
  //                     Debug.log(res);
  //                    }
  //                   data={
  //                     arg:argTemp,
  //                     res:res,
  //                   }
  //                   if(setState) {dispatch(RDActions[this.sortName][actionName+'OnResult'](RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS,data));}
  //                   resolve(data);
  //                 }
  //               }
  //             )
  //           );
  //       }
  //       else{reject()}
  //     })
  //     return promise;
  //   }
  // }
}


module.exports= new TempActions_MiddleWare();
