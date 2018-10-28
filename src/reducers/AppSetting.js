var _ = require('lodash')
var RDActionsTypes = require( '../actions/RDActionsTypes');

// components
var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');
var RDUtil = require('./RDUtil');

function initLoading(){
  let retObj={};
  Object.keys(RDActionsTypes.AppSetting).forEach((key)=>{
    if (key === 'constants') { return;}
    retObj[key] = {loading:0};
  })
  return retObj;
}

function AppSetting(state ={
                ...initLoading(),
                mode: null,  
              } , action) {
  var stateTemp =state;
  switch (action.type) {

    case RDActionsTypes.AppSetting.setMode:{
      stateTemp = RDUtil.processReducerLoading(state,action,'setMode',
                {
                  onRequest:(stateTempIn)=>{
                    stateTempIn.mode = action.data.mode
                    return stateTempIn;
                  }

                })
      break;
    }

    default:
      // Debug.log('ServerConnection:unknown type:'+action.type);
      break;
  }

  return stateTemp;

}

module.exports= AppSetting;
