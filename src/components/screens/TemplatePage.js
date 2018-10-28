
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');

var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Page from './Page'

// popups
import DefaultPopup from '../popups/DefaultPopup'

// actions

//variable

// var styles = StyleSheet.create({
//
// })

//

class TemplatePage extends Page{
  static componentName = 'TemplatePage'
  // static defaultProps = {
  //   ...Page.defaultProps
  // }
  // static propTypes = {
  //   ...Page.propTypes
  // }
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
  }

  onRefresh(){
    super.onRefresh();
    var {dispatch} = this.props;
  }

  onGetMore(){
    super.onGetMore();
    var {dispatch} = this.props;
  }
  renderPageContent(){
    var {dispatch} = this.props;
    var content = null;
    // content =(
    //   <Include.ScrollView
    //       refreshing={false}
    //       onRefresh={this.onRefresh}
    //       onGetMore={this.onGetMore}
    //       >
    //     <Include.Text>Content</Include.Text>
    //   </Include.ScrollView>
    // )
    return content;
  }
}


/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(TemplatePage);
