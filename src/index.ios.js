/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React,{Component}  from 'react';
import {
  AppRegistry,
  StyleSheet,
  NativeModules
} from 'react-native';

 var RNFS = require('react-native-fs');
import { createStore,applyMiddleware  } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
//
var Define = require('./Define');
var Debug = require('./Util/Debug');
var Util = require('./Util/Util');
Util.enableDebug();
var RNHotUpdate = NativeModules.HotUpdateModule;

if (!Define.constants.debug) {
  ErrorUtils.setGlobalHandler((error) => {
    var errorStack = new Error();
    Debug.log('!!!!!!!!!!!!!!GLOBAL ERROR HANDLER!!!!!!!!!!!!!!!!!!!!!!',Debug.level.ERROR);
    Debug.log(error,Debug.level.ERROR);
    Debug.log(errorStack.stack,Debug.level.ERROR);
    Debug.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',Debug.level.ERROR);
    var path = Define.constants.crashLog;
    var crashDescription = '';
    crashDescription += Util.date2String(new Date(),'mm/dd - HH:MM:SS') + ' : ' + error + ':' + JSON.stringify(error);
    crashDescription += '\r\n';
    crashDescription += '\r\n' + errorStack.stack;
    crashDescription += '\r\n';
    // write trackerLog
    Debug.trackerLog.forEach((current)=>{
      crashDescription += '\r\n' + current;
    })

    var obj2Write = {};
    obj2Write.hybridVersionCrash = Define.constants.hybridVersion;
    obj2Write.error={
      column:error.column,
      line:error.line,
      name:''+error,
    };
    obj2Write.crashDescription = crashDescription;
    var string2Write = JSON.stringify(obj2Write);
    RNFS.writeFile(path, string2Write , 'utf8')
    .then(() => {
      Debug.log('CrashLog WRITTEN!',Debug.level.ERROR);
      // NativeModules.BridgeReloader.reload();
      RNHotUpdate.reloadBundle();
    })
    .catch((err) => {
      Debug.log(err.message,Debug.level.ERROR);
      // NativeModules.BridgeReloader.reload();
      RNHotUpdate.reloadBundle();
    });
  });
}



// NOTE : must create global variable first of all
  var {globalVariableManager}= require('./components/modules/GlobalVariableManager');
globalVariableManager.init();

var App = require('./containers/App');
var todoApp = require('./reducers');

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
var store = createStoreWithMiddleware(todoApp);
// variable
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class FriendMap extends Component {
  constructor() {
    super();
    this.state = {
        loading: true,
    };
    Define.init(()=>{this.setState({loading:false})})
  }

  render() {
    if(this.state.loading){
      return (<View/>)
    }else{
      return (
          <Provider store={store}>
            <App/>
          </Provider>
        )
    }
  }
}



AppRegistry.registerComponent('FriendMap', () => FriendMap);
