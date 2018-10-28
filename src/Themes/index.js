
import {
  StyleSheet,
}  from 'react-native';

var Default = require('./Default');
var Define = require('../Define');
var Debug = require('../Util/Debug');

var Themes={
  init:function(){
    this.current = Default.init();
    this.default = Default.init();

    if (Define.constants.debugStyle) {
      Object.keys(this.current).forEach((key)=>{
        if (key !== 'factor') {
          var obj = this.current[key];
          Object.keys(obj).forEach((key2)=>{
            var objStyle = obj[key2];
            Object.keys(Debug.styles).forEach((debugStyleKey)=>{
              objStyle[debugStyleKey] = Debug.styles[debugStyleKey]
            })
          })
        }
      })
    }
    else{
      Object.keys(this.current).forEach((key)=>{
        if (key !== 'factor') {
          var obj = this.current[key];
          this.current[key] = StyleSheet.create(obj)
        }
      })
    }
    return this;
  },
}.init();



module.exports = Themes;
