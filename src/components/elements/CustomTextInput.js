
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  TextInput,
  Platform
} from 'react-native';

// import { connect } from 'react-redux';

//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');

import ReactComponent from '../ReactComponent'

class CustomTextInput extends ReactComponent{
  static componentName = 'CustomTextInput'
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})

    this.valueText='';
  }

  _onChangeText(text){
    this.valueText=text;
    this.props.onChangeText && this.props.onChangeText(text)
  }
  _onFocus(event){
    let eventTemp = event;
    if (Platform.OS === 'ios') {
    }else{
      eventTemp = {nativeEvent:{text:this.valueText}}
    }
    this.props.onFocus && this.props.onFocus(eventTemp);
  }
  _onBlur(event){
    let eventTemp = event;
    if (Platform.OS === 'ios') {
    }else{
      eventTemp = {nativeEvent:{text:this.valueText}}
    }
    this.props.onBlur && this.props.onBlur(eventTemp);
    Platform.OS==='ios' && this.props.onFinishEditing && this.props.onFinishEditing(eventTemp)
  }
  _onEndEditing(event){
    this.props.onEndEditing && this.props.onEndEditing(event);
    this.props.onFinishEditing && this.props.onFinishEditing(event)
  }
  _onSubmitEditing(event){
    this.props.onSubmitEditing && this.props.onSubmitEditing(event);
    Platform.OS==='android' && this.props.onFinishEditing && this.props.onFinishEditing(event);
  }
  componentWillMount(){
    this.valueText = this.props.defaultValue;

  }
  renderContent(){

    let {onFinishEditing,ref,refProp,
        ...props} = this.props;

    Object.assign(props, {
      onChangeText : this._onChangeText.bind(this),
      onFocus:this._onFocus.bind(this),
      onBlur:this._onBlur.bind(this),
      onEndEditing:this._onEndEditing.bind(this),
      onSubmitEditing:this._onSubmitEditing.bind(this),
    });

    var content = (
      <TextInput
        ref={this.props.refProp}
        {...props}
      />
    );
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

// export default connect(selectActions, undefined, undefined, {withRef: true})(CustomTextInput);
export default CustomTextInput
