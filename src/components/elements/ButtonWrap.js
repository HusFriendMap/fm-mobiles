//@flow
//LIB
import React from 'react';

import {
  Animated,
  TouchableOpacity ,
  TouchableWithoutFeedback ,
} from 'react-native';

//components
var Debug = require('../../Util/Debug');

//variable

// note children must be wrap in view (only one element in ButtonWrap)
var ButtonWrap = React.createClass({
  animationFunction(prop:Object, value:number){
    return Animated.timing(
      prop,
      {
        duration:160,
        toValue: value,
      }
    );
  },
  getDefaultProps:function(){
    return({
      noFeedback:false,
    })
  },
  componentWillMount:function(){
    // var self= this;
    // self.opacity = new Animated.Value(1);
    // self.opacity.addListener((arg)=>{
    //   Debug.log(arg);
    // })
    // self.myPosition={};
  },
  // myPosition:{},
  render:function(){
    var self=this;

    if (!self.props.onPress) {
      return self.props.children
    }

    if (Array.isArray(self.props.children ) && self.props.children.length > 1) {
      if (self.props.noFeedback) {
        return(
          <TouchableWithoutFeedback
              {...self.props}
               >
              {self.props.children}
          </TouchableWithoutFeedback>
        )
      }
      return(
        <TouchableOpacity
            {...self.props}
             >
            {self.props.children}
        </TouchableOpacity>
      )
    }
    else{
      var props = Object.assign({}, self.props.children.props);

      props.onPress = ()=>{
        Debug.log('ButtonWrap:onPress',Debug.level.DATA_USER_TRACKER);
        if (self.props.onPress) {
          self.props.onPress();
        }
      }

      // Debug.log('ButtonWrap:childrenType:'+ self.props.children.type.displayName)
      if (self.props.children.type.displayName !== 'RCTView' &&  self.props.children.type.displayName !== 'View') {
        if (self.props.noFeedback) {
          return(
            <TouchableWithoutFeedback
                {...props}
                 >
                {self.props.children}
            </TouchableWithoutFeedback>
          )
        }

        return(
          <TouchableOpacity
              {...props}
               >
              {self.props.children}
          </TouchableOpacity>
        )
      }
      else{
        if (self.props.noFeedback) {
          return(
            <TouchableWithoutFeedback
                {...props}
                 >
                {self.props.children.props.children}
            </TouchableWithoutFeedback>
          )
        }
        return(
          <TouchableOpacity
              {...props}
               >
              {self.props.children.props.children}
          </TouchableOpacity>
        )
      }
    }
  }
})

module.exports=ButtonWrap;
