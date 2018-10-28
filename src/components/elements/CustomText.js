//@flow
import React from 'react';
import {Animated,Text} from 'react-native';
import * as Animatable from 'react-native-animatable';

var Define = require('../../Define');
var Themes = require('../../Themes');


class CustomText extends React.Component {
  defaultProps = {
  };
  rotate=new Animated.Value(0);
  translateX=new Animated.Value(0);
  runAnimation(){
    var self =this;

    if (self.AnimatableText) {
      self.AnimatableText.tada();
    }

    // if (Define.constants.funnyMode || this.props.funny) {
    //   Animated.sequence([
    //     Animated.delay(100),
    //     Animated.timing(this.rotate,{
    //       toValue: 10,
    //       duration:100,
    //     }),
    //     Animated.timing(this.rotate,{
    //       toValue: -10,
    //       duration:100,
    //     }),
    //     Animated.timing(this.rotate,{
    //       toValue: 0,
    //       duration:100,
    //     })
    //   ]).start(()=>{
    //       this.runAnimation();
    //   });
    // }
    // else if(self.props.running){
    //   Animated.sequence([
    //     Animated.delay(800),
    //     Animated.timing(this.translateX,{
    //       toValue: 0,
    //       duration:800,
    //     }),
    //     Animated.delay(1600),
    //     Animated.timing(this.translateX,{
    //       toValue: -(self.props.offset?self.props.offset:10),
    //       duration:800,
    //     }),
    //     Animated.delay(800),
    //     Animated.timing(this.translateX,{
    //       toValue: 0,
    //       duration:800,
    //     }),
    //     Animated.timing(this.translateX,{
    //       toValue: (self.props.offset?self.props.offset:10),
    //       duration:800,
    //     }),
    //   ]).start(()=>{
    //       this.runAnimation();
    //   });
    // }
  }
  animateStyle = null;
  componentWillMount(){
    var self = this;
    // if (Define.constants.funnyMode || this.props.funny){
    //   self.animateStyle = {transform:[{rotate:this.rotate.interpolate({inputRange:[-180,0,180],outputRange:['-180deg','0deg','180deg'] }) }]}
    // }
    // else if(self.props.running){
    //   self.animateStyle = {transform:[{translateX:self.translateX}]};
    // }
    // else{
      self.animateStyle = null
    // }
  }
  render() {
    var self =this;
    var props = Object.assign({}, this.props);

    // if (this.props.custom) {
    //   return super.render();
    // }
    //
    // if (this.props.style) {
    //   if (this.props.style.fontFamily) {
    //     return super.render();
    //   }
    // }


    if (!(this.props.style && this.props.style.fontFamily)) {
      if (Array.isArray(this.props.style)){
        props.style.push({fontFamily: Define.constants.font});

      } else if (props.style) {
        props.style = [props.style, {fontFamily: Define.constants.font}];
      } else {
        props.style = {fontFamily: Define.constants.font};
      }
    }

    if (Array.isArray(props.style)){
      props.style.unshift(Themes.current.text.defaultText);
      // props.style.push(this.animateStyle);
    } else if (props.style) {
      props.style = [Themes.current.text.defaultText,props.style/*,this.animateStyle*/];
    } else {
      props.style = [Themes.current.text.defaultText/*,this.animateStyle*/];
    }

    // if (props.running !== undefined) {
    //   delete props.running;
    // }

    if (Define.constants.funnyMode || self.props.running || this.props.funny) {
      return (
        <Animatable.Text ref={(ref)=>{self.AnimatableText = ref}} {...props}/>
      );
    }
    else{
      return (
        <Text {...props}/>
      );
    }
  }

  componentDidMount(){
    var self = this;
    if (Define.constants.funnyMode || self.props.running || this.props.funny) {
      self.animationInterval = setInterval(()=>{
        this.runAnimation();
      },2000)

    }
  }

  componentWillUnmount(){
    clearInterval(this.animationInterval);
  }
}

module.exports = CustomText;
