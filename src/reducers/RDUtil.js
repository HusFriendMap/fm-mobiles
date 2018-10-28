
var _ = require('lodash')

var RDActionsTypes = require( '../actions/RDActionsTypes');

// components
var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');

var RDUtil = {

  processReducerLoading(state,action,nameAction,process={onRequest:undefined,onSuccess:undefined,onError:undefined}){
    let stateTemp = Object.assign({}, state);
    switch (action.subtype) {
      case RDActionsTypes.constants.REQUEST_SUBTYPE.REQUEST:{
        stateTemp[nameAction].loading++;
        if(process.onRequest) { stateTemp = process.onRequest(stateTemp)}
        break;
      }
      case RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS:{
        if (stateTemp[nameAction].loading>0) {stateTemp[nameAction].loading--;}
        if(process.onSuccess) {stateTemp = process.onSuccess(stateTemp)}
        break;
      }
      case RDActionsTypes.constants.REQUEST_SUBTYPE.ERROR:{
        if (stateTemp[nameAction].loading>0) {stateTemp[nameAction].loading--;}
        if(process.onError) {stateTemp = process.onError(stateTemp)}
        break;
      }
      default:
        break;
    }
    return stateTemp
  },
}




module.exports = RDUtil;
