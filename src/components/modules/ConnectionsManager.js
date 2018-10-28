
//LIB
if (window.navigator) {
  window.navigator.userAgent = "react-native";
}
var SocketIO = require("../../../node_modules/socket.io-client/socket.io");

//components
var Debug = require('../../Util/Debug');
var Define = require('../../Define');

// var Actions.ServerConnection=require('../../actions/Actions.ServerConnection');

// var {globalVariableManager} = require('./GlobalVariableManager')

//variable

//
//TODO : try auto reconnect once times before popup to users
class ConnectionsManager{
  constructor(){

    var self = this;
    var args = Array.prototype.slice.call(arguments);
    self.args = args;
    self.firstTime = true;
    self.connectState=false;

    self.registedEvent={};

    self.callbackPoolStableEpic={
    //   notification:,
    };

    self.callbackPoolStable={
      connect:[],
      disconnect:[],
      connect_timeout:[],
      notification:[],
    };
    self.callbackPool={
      connect:[],
      disconnect:[],
      connect_timeout:[],
      notification:[],
    };
    self.socket = SocketIO.apply(SocketIO,args);
    self.init();
  }

  reConstructor(){

    var self = this;
    var args = Array.prototype.slice.call(arguments);
    self.args = args;

    self.registedEvent={};

    self.callbackPoolStableEpic={
    //   notification:[],
    };

    self.callbackPoolStable={
      connect:[],
      disconnect:[],
      connect_timeout:[],
    };
    self.callbackPool={
      connect:[],
      disconnect:[],
      connect_timeout:[],
    };
    self.socket = SocketIO.apply(SocketIO,args);
    self.init();
  }

  init(){
    var self = this;
    var tempKey = Object.keys(self.callbackPool);
    tempKey= tempKey.concat(tempKey,Object.keys(self.callbackPoolStable))
    tempKey= tempKey.concat(tempKey,Object.keys(self.callbackPoolStableEpic))
    tempKey.forEach((key)=>{
      self.regisSocketEvent(key);
    })
  }

  regisSocketEvent(key){
    var self = this;
    if (self.registedEvent[key]) {
      return;
    }
    self.registedEvent[key] = true;

    self.socket.on(key, (data)=>{
      Debug.log('ConnectionsManager:'+key+':'+data);
      switch (key) {
        case 'disconnect':
          self.connectState = false;
          if (self.serverConnectChange) {
            self.serverConnectChange('disconnect');
          }
          // globalVariableManager.reduxManager.dispatch(Actions.ServerConnection.disconnectFromServer());
          break;
        case 'connect':
          self.connectState = true;
          if (self.serverConnectChange) {
            self.serverConnectChange('connect');
          }
          break;
        default:
          break;
      }
      Debug.log(self.callbackPool);
      if (self.callbackPool[key]) {
        var numberCallback = self.callbackPool[key].length;
        for (let id = 0; id < numberCallback; id++) {
          Debug.log('ConnectionsManager:callback:'+key+':callBack'+id+':'+data);
          let callback = self.callbackPool[key].shift();
          setTimeout(()=>{callback(data);});
        }
      }

      if (self.callbackPoolStable[key]) {
        Debug.log(self.callbackPoolStable);
        if (self.callbackPoolStable[key]) {
          var numberCallbackStable = self.callbackPoolStable[key].length;
          for (let id = 0; id < numberCallbackStable; id++) {
            Debug.log('ConnectionsManager:callbackStable:'+key+':callBack'+id+':'+data);
            let callback = self.callbackPoolStable[key][id];
            setTimeout(()=>{callback(data);});
          }
        }
      }


      if (self.callbackPoolStableEpic[key]) {
        Debug.log('ConnectionsManager:callbackStableEpic:'+key +':'+data);
        let callback=self.callbackPoolStableEpic[key];
        setTimeout(()=>{callback(data);});
      }
    });
  }

  unregisSocketEvent(key){
    var self = this;
    self.registedEvent[key] = false;
    self.socket.off(key)
  }

  getConnectState(){
    return this.connectState;
  }


  emit(){
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    // if (args.length > 2) {
    //   if (globalVariableManager.reduxManager.state.News.config.inReview) {
    //     if (!args[1]) {
    //       args[1]={};
    //     }
    //     if (!args[1].query) {
    //         args[1].query={};
    //     }
    //     args[1].query.inReview = globalVariableManager.reduxManager.state.News.config.inReview;
    //   }
    // }
    if (self.connectState) {
      self.socket.emit.apply(self.socket,args);
    }
  }

  on(event,callback){
    var self = this;
    Debug.log('ConnectionsManager:regis:'+ event +':callback');
    self.regisSocketEvent(event);
    self.callbackPool[event].push(callback);
  }

  onStable(event,callback){
    var self = this;
    Debug.log('ConnectionsManager:regis:'+ event +':callback');
    self.regisSocketEvent(event);
    self.callbackPoolStable[event].push(callback);
  }

  onStableEpic(event,callback){
    var self = this;
    Debug.log('ConnectionsManager:regis:'+ event +':callback');
    self.regisSocketEvent(event);
    self.callbackPoolStableEpic[event] = callback;
  }

  removeStableEpic(event){
    var self = this;
    Debug.log('ConnectionsManager:remove:'+ event );
    self.unregisSocketEvent(event);
    self.callbackPoolStableEpic[event] = undefined;
  }

  onServerConnectChange(callback){
    var self =this;
    self.serverConnectChange = callback;
  }
  removeServerConnectChange(){
    var self =this;
    self.serverConnectChange=undefined;
  }

  connect(){
    var self = this;
    // if (self.firstTime) {
        self.firstTime = false;
        self.socket.open();
    // }
    // else{
    //   // create new
    //   delete self.socket;
    //   self.socket = SocketIO.apply(SocketIO,self.args);
    //   self.init();
    //   self.socket.open();
    // }

    // console.log(self.socket)
  }

  disconnect(){
    var self = this;
    Debug.log('ConnectionsManager:DisconnectToServer',Debug.level.USER_TRACKER);
    self.socket.close();
  }

}

const socketConnection = new ConnectionsManager(Define.constants.serverAddr,{jsonp: false,timeout :12000,reconnection :false,autoConnect:false,transports: ['websocket'] });

module.exports={socketConnection};
