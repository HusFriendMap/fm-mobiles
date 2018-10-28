
// var RDActionsTypes = require( '../actions/RDActionsTypes');
var {ActionConst} = require( 'react-native-router-flux');
var Debug = require('../Util/Debug');

/**
 * Reducer for Navigator.
 * @param {Object} state .
 * @param {Object} action .
 * @returns {null} .
 */
function Navigator(state ={
      stack: [],
      currentScreen:{},
      navigating:false,
      dstScreenName:'',
    } , action) {

  Debug.log('Navigator',action)
  var stateTemp =state;
  switch (action.type) {
    case ActionConst.FOCUS:{
      stateTemp = Object.assign({}, state);
      stateTemp.navigating = false;
      stateTemp.currentScreen.name = action.scene.name;
      Debug.log('Navigator:FOCUS : '+action.scene.name,Debug.level.USER_TRACKER);
      return  stateTemp ;
    }
    case ActionConst.PUSH:{
      stateTemp = Object.assign({}, state);
      stateTemp.navigating = true;
      stateTemp.dstScreenName = action.key;
      stateTemp.stack.push(action.key);
      Debug.log('Navigator:PUSH : '+action.key,Debug.level.USER_TRACKER);
      return  stateTemp ;
    }
    case ActionConst.JUMP:{
      stateTemp = Object.assign({}, state);
      Debug.log('Navigator:JUMP : '+action.key,Debug.level.USER_TRACKER);

      return  stateTemp ;
    }
    case ActionConst.REPLACE:{
      stateTemp = Object.assign({}, state);
      Debug.log('Navigator:REPLACE : '+action.key,Debug.level.USER_TRACKER);

      return  stateTemp ;
    }
    case ActionConst.BACK:{
      stateTemp = Object.assign({}, state);
      Debug.log('Navigator:BACK : '+action.key,Debug.level.USER_TRACKER);

      return  stateTemp ;
    }
    case ActionConst.BACK_ACTION:{
      stateTemp = Object.assign({}, state);
      stateTemp.stack.pop();
      Debug.log('Navigator:BACK_ACTION : '+action.key,Debug.level.USER_TRACKER);
      Debug.log2('Data:', action);

      return  stateTemp ;
    }
    case ActionConst.POP_TO:{
      stateTemp = Object.assign({}, state);
      Debug.log('Navigator:POP_TO : '+action.key,Debug.level.USER_TRACKER);

      return  stateTemp ;
    }
    case ActionConst.REFRESH:{
      stateTemp = Object.assign({}, state);
      Debug.log('Navigator:REFRESH : '+action.key,Debug.level.USER_TRACKER);

      return  stateTemp ;
    }


    default:
      // Debug.log('ServerConnection:unknown type:'+action.type);
      return stateTemp
  }
}


module.exports= Navigator;
