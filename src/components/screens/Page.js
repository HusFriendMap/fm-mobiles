
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  InteractionManager
} from 'react-native';


// import { connect } from 'react-redux';
var Spinner = require('react-native-spinkit');
var {Actions} = require( 'react-native-router-flux');
//action

//components
// var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
// var Util = require('../../Util/Util');
// var Include = require('../../Include');

import ReactComponent from '../ReactComponent'

// var {popupActions} = require('../popups/PopupManager');
// var {globalVariableManager}= require('../modules/GlobalVariableManager');

export default class Page extends ReactComponent{
  static componentName = 'UnNamedPage'
  static defaultProps = {
    currentScreenName:'UNKNOWN',
    tabIndex:0,
    tabView:{}
  }
  static propTypes = {
    currentScreenName:React.PropTypes.string
  }
  constructor(props){
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
  shouldComponentUpdate(nextProps){
    let ret = true;
    if (nextProps.tabView.tabFocus !== nextProps.tabIndex || Actions.currentScene !== nextProps.currentScreenName) {
      ret = false;
    }
    Debug.log(this.constructor.componentName + ':shouldComponentUpdate:'+nextProps.currentScreenName+':'+ret,
                ( nextProps.currentScreenName==='UNKNOWN')?Debug.level.WARNING:null);
    return ret;
  }
  renderPageContent(){} // implement by child
  renderContent(){
    var content = null;
    if (this.state.loading) {
      content=(
        <View
            pointerEvents={'auto'}
            style={[Themes.current.screen.bodyView,this.props.bodyStyle,{justifyContent: 'center', alignItems: 'center'}]}>
          <Spinner type={'Wave'} color={Themes.current.factor.spinnerColor} />
        </View>
      ) ;
    }
    else{
      if (_.isFunction(this.renderPageContent) ) {
        content = this.renderPageContent();
      }else{
        Debug.log(this.constructor.componentName+':no renderPageContent',Debug.level.ERROR)
        content = null;
      }
    }
    return(content)
  }
  componentDidMount(){
    super.componentDidMount()
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading:false});
      this.onRefresh();
    });
  }
}
