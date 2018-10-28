
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

// import { connect } from 'react-redux';

//action

//components
// var Define = require('../../Define');
// var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
// var Util = require('../../Util/Util');
// var Include = require('../../Include');

import ReactComponent from '../ReactComponent'

// var {popupActions} = require('../popups/PopupManager');
// var {globalVariableManager}= require('../modules/GlobalVariableManager');

class CustomScrollView extends ReactComponent{
  static componentName = 'CustomScrollView'
  static defaultProps = {
    onGetMore: () => {},
    refreshing: false,
    onRefresh: () => {},
    getMoreHeight: 1000,
  }
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
  }
  isGetMore = false;
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    if(!nextProps.refreshing && this.isGetMore) {
      this.isGetMore = false;
    }
  }
  renderContent(){
    var content = null;
    content =(
      <ScrollView
          style={this.props.style}
          ref={this.props.refProp}
          removeClippedSubviews ={false}
          refreshControl ={ this.props.disableRefresh?
            undefined:
            (<RefreshControl
              refreshing={this.props.refreshing && !this.isGetMore}
              onRefresh={this.props.onRefresh}
              colors={Themes.current.factor.refreshingColor}
              progressBackgroundColor={Themes.current.factor.refreshingBackgroudColor}/>)
          }
          scrollEventThrottle={200}
          onScroll={ (event) => {
              let getMoreHeight = this.props.getMoreHeight;
              let layoutMeasurementSize = event.nativeEvent.layoutMeasurement.height;
              let contentSize = event.nativeEvent.contentSize.height;
              let contentOffset = event.nativeEvent.contentOffset.y;

              if(layoutMeasurementSize > contentSize) {
                if(contentOffset > getMoreHeight) {
                  this.isGetMore = true;
                  this.props.onGetMore();
                }
              } else {
                if(contentOffset > (contentSize  - layoutMeasurementSize + getMoreHeight)) {
                  this.isGetMore = true;
                  this.props.onGetMore();
                }
              }
            }}
          {...this.props} >
        {this.props.children}

        {this.isGetMore ?
          <ActivityIndicator />
        : null}

      </ScrollView>
    )
    return(content)
  }

}

/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
// function selectActions(state) {
//   return {}
// }

// export default connect(selectActions, undefined, undefined, {withRef: true})(CustomScrollView);
export default CustomScrollView
