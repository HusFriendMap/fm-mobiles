
var RDRDActionsTypes = require('./RDRDActionsTypes');

//LIB
//COMPONENTS
// var Define = require('../Define');
var Debug = require('../Util/Debug');

var {socketConnection} = require('../components/modules/ConnectionsManager');
var RDActions = require('./RDRDActions');
var {popupActions} = require('../components/popups/PopupManager');

/*
 * action creators
 */

const ServerConnection_MiddleWare={
  autoReconnectTime:2,
  autoReconnectCount:0,
  intervalTimeout:null,
  connectToServer:function(){
    var self = this;
    return (dispatch, getState) => {
      if (getState().ServerConnection.connecting) {
        return new Promise(()=>{});
      }
      dispatch(RDActions.ServerConnection.connectOnRequest());
      var promise = new Promise((resolve,reject)=>{
        socketConnection.connect();
        // var dispatchReturn;
        socketConnection.on('connect', ()=>{
          Debug.log('RDRDActions.ServerConnection_MiddleWare:connectToServer:connected',Debug.level.USER_TRACKER);

          dispatch(RDActions.ServerConnection.connectOnResult(RDRDActionsTypes.constants.REQUEST_SUBTYPE.SUCCESS,null));
          self.autoReconnectCount = 0;
          popupActions.popAllPopup(2,true,2);
          clearTimeout(self.intervalTimeout);

          resolve();
        });
        socketConnection.on('connect_timeout', ()=>{
          Debug.log('RDRDActions.ServerConnection_MiddleWare:connectToServer:connect_timeout',Debug.level.USER_TRACKER);
          dispatch(RDActions.ServerConnection.connectOnResult(RDRDActionsTypes.constants.REQUEST_SUBTYPE.ERROR,null));

          clearTimeout(self.intervalTimeout);
          reject();
        });

        self.intervalTimeout = setTimeout(()=>{
            // intervalTimeout connect timeout
            Debug.log('RDActions.ServerConnection_MiddleWare:connectToServer:connect_timeout:intervalTimeout',Debug.level.USER_TRACKER);
            dispatch(RDActions.ServerConnection.connectOnResult(RDRDActionsTypes.constants.REQUEST_SUBTYPE.ERROR,null));

            clearTimeout(self.intervalTimeout);
            reject();
        },4000);


        socketConnection.on('disconnect', ()=>{
          Debug.log('RDActions.ServerConnection_MiddleWare:connectToServer:disconnect',Debug.level.USER_TRACKER);

          dispatch(RDActions.ServerConnection.connectOnResult(RDRDActionsTypes.constants.REQUEST_SUBTYPE.ERROR,null));

          // if (self.autoReconnectCount < self.autoReconnectTime) {
          //   Debug.log('RDActions.ServerConnection_MiddleWare:connectToServer:disconnect:auto reconnect '+self.autoReconnectCount);
          //   dispatch(self.connectToServer());
          //   self.autoReconnectCount++;
          // }
          // else{
          // }

        });
      })
      return promise;
    }
  },

  disconnectToServer:function(){
    // var self = this;
    return () => {
      socketConnection.disconnect();
    }
  },

  tryConnectToServer:function(){
    var self = this;
    self.autoReconnectCount = 0;
    return (dispatch, getState) => {
      if (getState().ServerConnection.netInfo !=='NONE') {
        return dispatch(self.autoTryConnectToServer());
      }else{
        return new Promise((resolve,reject)=>{reject({type:'NO_INTERNET'})});
      }

    }
  },

  autoTryConnectToServer:function(){
    var self = this;

    return (dispatch) => {
      return new Promise((resolve,reject)=>{
        dispatch(self.connectToServer()).
        then(()=>{
          self.autoReconnectCount = 0;
          resolve();
        })
        .catch(()=>{
          if (self.autoReconnectCount < self.autoReconnectTime) {
            self.autoReconnectCount += 1;
            dispatch(self.autoTryConnectToServer())
            .then(()=>{resolve()})
            .catch(()=>{
              reject()
            });
          }else{
            reject();
          }
        })
      })

    }
  }
}

module.exports=ServerConnection_MiddleWare;
