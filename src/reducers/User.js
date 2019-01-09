var _ = require('lodash')

var RDActionsTypes = require( '../actions/RDActionsTypes');

// components
var Define = require('../Define');
var Debug = require('../Util/Debug');
var Util = require('../Util/Util');
var RDUtil = require('./RDUtil');
// NOTE : if want to use promise of middleware action , this reducer must update state to a temp to use in then of promise
// =>no no no , only need update state variable from reduxManager in then funciton   (maybe because pointer changed)

function initLoading(){
  let retObj={};
  Object.keys(RDActionsTypes.User).forEach((key)=>{
    if (key === 'constants') { return;}
    retObj[key] = {loading:0};
  })
  return retObj;
}

var memberInfoFormat={
  member: {
    _id:'',
    phone:'',
    address:'',
    status:0,
    name:'',
    email:'',
    createdAt:'',
    updatedAt:'',
    memberToken:'',
  }
}

function User(state ={
                ...initLoading(),
                memberInfo:{}
              } , action) {
  var stateTemp =state;
  switch (action.type) {
    case RDActionsTypes.User.login:{
      stateTemp = RDUtil.processReducerLoading(state,action,'login',
                {
                  onSuccess:(stateTempIn)=>{
                    stateTempIn.memberInfo = Util.dataProtectAndMap(action.data.res.data,memberInfoFormat)
                    //console.log('hihi',stateTempIn);
                    return stateTempIn;
                  },
                  onError: (stateTempIn) => {
                    //console.log('hihi',stateTempIn);
                    return stateTempIn;
                  }
                })

      break;
    }

    case RDActionsTypes.User.get:{
      stateTemp = RDUtil.processReducerLoading(state,action,'get',
                {
                  onSuccess:(stateTempIn)=>{
                    stateTempIn.memberInfo = Util.dataProtectAndMap(action.data.res.data,memberInfoFormat)
                    return stateTempIn;
                  },
                  onError: (stateTempIn) => {
                    return stateTempIn;
                  }
                })

      break;
    }
    case RDActionsTypes.User.logout:{
      stateTemp = RDUtil.processReducerLoading(state,action,'logout',
                {
                  onSuccess:(stateTempIn)=>{
                    stateTempIn.memberInfo = {};
                    return stateTempIn;
                  },
                  onError: (stateTempIn) => {
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


module.exports= User;
