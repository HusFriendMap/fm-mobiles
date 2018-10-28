
var RDActionsTypes = require( '../actions/RDActionsTypes');

var Debug = require('../Util/Debug');

/**
 * [ServerConnection description]
 * @param {[type]} state      [description]
 * @param {[type]} action           [description]
 * @returns {[type]} [description]
 */
function ServerConnection(state ={
    connected:false,
    connecting:false,
    netInfo:'NONE',
    // retryTimes:0,
  } , action) {

  var stateTemp = state;
  switch (action.type) {
    case RDActionsTypes.Server.connect:{
      stateTemp = Object.assign({}, state);
      switch (action.subtype) {
        case RDActionsTypes.REQUEST_SUBTYPE.REQUEST:
          stateTemp.connecting = true;
          // stateTemp.retryTimes += 1 ;
          return  stateTemp ;
        case RDActionsTypes.REQUEST_SUBTYPE.SUCCESS:
          stateTemp.connecting = false;
          stateTemp.connected = true;
          // stateTemp.retryTimes = 0 ;
          return  stateTemp ;
        case RDActionsTypes.REQUEST_SUBTYPE.ERROR:
          stateTemp.connecting = false;
          stateTemp.connected = false;
          break;
        default:
          Debug.log('ServerConnection:unknown subtype:'+action.subtype);
          break;
      }
      break;
    }
    case RDActionsTypes.server.changeNetInfo:{
      stateTemp = Object.assign({}, state);
      switch (action.subtype) {
        case RDActionsTypes.REQUEST_SUBTYPE.REQUEST:
          stateTemp.netInfo = action.data;
          break;
        default:
          Debug.log('ServerConnection:unknown subtype:'+action.subtype);
          break;
      }
      break;
    }
    default:
      // Debug.log('ServerConnection:unknown type:'+action.type);
      break;
  }

  return  stateTemp ;
}


module.exports= ServerConnection;
