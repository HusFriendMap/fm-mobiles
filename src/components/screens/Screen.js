
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  InteractionManager,
  StatusBar,
  Platform
} from 'react-native';


// import { connect } from 'react-redux';
var Spinner = require('react-native-spinkit');
import LinearGradient from 'react-native-linear-gradient';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
// var Util = require('../../Util/Util');
var Include = require('../../Include');


import ReactComponent from '../ReactComponent'

// var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');


class Screen extends ReactComponent{
  static componentName = 'UnNamedScreen'
  // static defaultProps = {}
  // static propTypes = {}
  state={}
  static sceneConfig={
    hideNavBar:false,
  }
  static renderTitle(scene){
    return(
      <View style={Themes.current.screen.titleWrapNavBarCenter}>
        <Include.Text style={Themes.current.text.navBartitle}>{scene.name}</Include.Text>
      </View>
    )
  }
  constructor(props:Object){
    super(props);
    this.state={
      loading:true,
    }
    this.onRefresh = this.onRefresh.bind(this);
    this.onGetMore = this.onGetMore.bind(this);
  }
  onRefresh(){
    Debug.log(this.constructor.componentName + ':onRefresh',Debug.level.USER_TRACKER);
  }
  onGetMore(){
    Debug.log(this.constructor.componentName + ':onGetMore',Debug.level.USER_TRACKER);
  }
  shouldComponentUpdate(nextProps:Object){
    let ret = true;
    var {navigator} = nextProps;
    if (navigator.currentScreen.name !== this.constructor.componentName) {
      ret=false;
    }
    Debug.log(this.constructor.componentName + ':shouldComponentUpdate:'+ret,!nextProps.navigator? Debug.level.WARNING:null);

    return ret;
  }
  // over write by children
  renderScreenContent(){}
  renderContent(){
    var content = null;
    if (this.state.loading) {
      content=(
        <View
            pointerEvents={'auto'}
            style={[Themes.current.screen.bodyView,this.props.bodyStyle,{justifyContent: 'center', alignItems: 'center'}]}>
          <Spinner type={'ThreeBounce'} color={Themes.current.factor.spinnerColor} />
          {Platform.OS === 'android'?
            <StatusBar
              translucent={true}
              backgroundColor="rgba(0, 0, 0, 0.4)"
            />
          :null}
        </View>
      );
    }
    else{
      if (_.isFunction(this.renderScreenContent) ) {
        content = (
          <View style={{flex:1}}>
            <StatusBar
              translucent={true}
              backgroundColor="rgba(0, 0, 0, 0.4)"
            />
            {this.renderScreenContent()}
          </View>
        );
      }else{
        Debug.log(this.constructor.componentName+':no renderScreenContent',Debug.level.ERROR)
        content = null;
      }
    }
    return(content)
  }
  componentDidMount(){
    super.componentDidMount();
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading:false});
      this.onRefresh();
    });
  }

  componentWillMount() {
    super.componentWillMount();
    if(Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0, 0, 0, 0)')
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    // globalVariableManager.tracker.trackTiming('time_in_screen', Date.now() - this.time, {name: this.constructor.name});
  }
}


export default Screen
