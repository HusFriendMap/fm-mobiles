/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React,{Component}  from 'react';
import {
  AppRegistry,
  NativeModules,
  View,
  AsyncStorage
} from 'react-native';

import RNRestart from 'react-native-restart';

import { createStore,applyMiddleware ,compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import devTools from 'remote-redux-devtools'
import { autoRehydrate, persistStore } from 'redux-persist'

//

var Util = require('./Util/Util');


  var Define = require('./Define');

  // NOTE : must create global variable first of all
  var {globalVariableManager}= require('./components/modules/GlobalVariableManager');

  globalVariableManager.init();
  Util.enableDebug();
  var App = require('./containers/App');
  var todoApp = require('./reducers');

    // variable

  class FriendMap extends Component {
    constructor() {
      super();
      this.state = {
          loading: true,
      };
      const enhancer = compose(
        applyMiddleware(thunk),
        autoRehydrate(),
        // devTools({
        //   name: 'FriendMap', realtime: true ,port:8000
        // }),
        );
      this.store = createStore(todoApp, enhancer);
      console.disableYellowBox = true;
      Define.init(()=>{
        persistStore(this.store, {storage: AsyncStorage,whitelist:['AppSetting','User']},
              ()=>{this.setState({loading:false});}
            )
      })
    }

    render() {
      if(this.state.loading){
        return (<View/>)
      }else{
        return (
            <Provider store={this.store}>
              <App/>
            </Provider>
          )
      }
    }
  }



  AppRegistry.registerComponent('FriendMap', () => FriendMap);
