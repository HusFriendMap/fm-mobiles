var _ = require('lodash');
// LIB
var {
  Platform,
} = require('react-native');

var {Actions, ActionConst} = require('react-native-router-flux');
var DeviceInfo = require('react-native-device-info');
var RNFS = require('react-native-fs');
// components
var Define = require('../Define');
var Debug = require('../Util/Debug');

var {socketConnection} = require('../components/modules/ConnectionsManager');


//

var RDActionsTypes = require( '../actions/RDActionsTypes');
var UserActions_MiddleWare = require( '../actions/UserActions_MiddleWare');
var RDActionsTypes = require( '../actions/RDActionsTypes');
var {popupActions} = require('../components/popups/PopupManager');
import DefaultPopup from '../components/popups/DefaultPopup';
var FadeDownDefaultPopup = require('../components/popups/FadeDownDefaultPopup');

//var
var {globalVariableManager} = require('../components/modules/GlobalVariableManager');

// var styles={
//   error:{
//     backgroundColor:'fff',
//     borderWidth:1,
//     borderColor:'#000',
//     borderRadius:4,
//     width:Define.constants.widthScreen*2/3,
//     alignItems:'center',
//   },
//   success:{
//     backgroundColor:'fff',
//     borderWidth:1,
//     borderColor:'#000',
//     borderRadius:4,
//     width:Define.constants.widthScreen*2/3,
//     alignItems:'center',
//   },
// }


/**
 * Reducer Tracker.
 * @param {Object} state .
 * @param {Object} action .
 * @returns {null} .
 */
function Tracker(state ={} , action) {
  Debug.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv',Debug.level.MARK);
  Debug.log('Reducers:Tracker:'+action.type+':'+action.subtype+':',Debug.level.USER_TRACKER);

  switch (action.subtype) {
    case RDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS:
      break;
    case RDActionsTypes.constants.REQUEST_SUBTYPE.ERROR:
      Debug.log(JSON.stringify(action.data),Debug.level.DATA_ERROR);

      switch (action.type) {
        // case RDActionsTypes.USER_USETOKENFROMSTORE:
        // break;
        default:
          // display popup error
          if (action.data) {
            if (Define.constants.debug) {
              popupActions.setRenderContentAndShow(
                DefaultPopup,
                {
                  title:'ERROR:'+action.type,
                  description:JSON.stringify(action.data),
                  onPressPopup:()=>{popupActions.popPopup()}
                })
            }
          }
      }

      break;

    default:
  }

  var info =undefined;
  if (action.data&&action.data.res&&action.data.res.message && action.data.res.message!=='callback timeout') {
    info = action.data.res.message;
  }
  else if (action.data &&action.data.message && action.data.message!=='callback timeout') {
    info =action.data.message;
  }
  else if(action.data && action.data.errObj && action.data.errObj.data && action.data.errObj.data.message ){
    info= action.data.errObj.data.message;
  }
  // else if(action.data && action.data.body){
  //   info= action.data;
  // }
  //
  //
  if (info !== undefined) {
  popupActions.setRenderContentAndShow(
    DefaultPopup,
    {
      title:info.head,
      description:info.body,
      onPress:() => {
        popupActions.popPopup();
      },
      buttonTitle:'OK'
    })
  }

  //
  Debug.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',Debug.level.MARK);

  // firstRunTracker=false;
  globalVariableManager.reduxManager.setState(state);

  return state;
}



module.exports= Tracker;
