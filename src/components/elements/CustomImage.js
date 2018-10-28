//@flow
import React from 'react';
import {Image,StyleSheet} from 'react-native';

var Define = require('../../Define');

// var Spinner = require('react-native-spinkit');
import GiftedSpinner from 'react-native-gifted-spinner';

var CustomImage= React.createClass({
  getInitialState:function(){
    return({
      state:0, // 0 ;loading , 1 : done , -1 error
    })
  },
  onLoad:function(){
    var self = this;
    self.setState({state:1});
  },
  onLoadEnd:function(){
    var self= this;
    if (self.state.state===0) {
        self.setState({state:-1});
    }

  },
  // onLoadStart:function(){
  // },
  render:function(){
    var self = this;
    if ((self.props.source && self.props.source.isStatic ) ||
      (!self.props.style || !StyleSheet.flatten(self.props.style).width || !StyleSheet.flatten(self.props.style).height)) {
      return(
        <Image {...self.props}>
          {self.props.children}
        </Image>
      )
    }

    var styleForView={
      width:StyleSheet.flatten(self.props.style).width,
      height:StyleSheet.flatten(self.props.style).height,
    }


    var children = null;
    if (self.state.state === 0) {
      // children = (<Spinner type={'WanderingCubes'} color={'#ffffff'} style={styleForView} />  )
      children = (<GiftedSpinner styleAttr={'Inverse'} style={styleForView} />)
    }

    if (self.state.state === -1) {
      children=<Image
          source ={Define.assets.defaultIcon}
          resizeMode={'stretch'}
          style={self.props.style}/>
    }


    return(
      <Image
          renderToHardwareTextureAndroid={true}
          onLoad={self.onLoad}
          onLoadEnd={self.onLoadEnd}
          {...self.props}>
        {children}
      </Image>
    )
  }
})


module.exports = CustomImage;
