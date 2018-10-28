var _ = require('lodash')
import React  from 'react';
var {
  View,
  Animated,
} = require('react-native');
import { connect } from 'react-redux';
//Components
// var Debug= require('../../Util/Debug');
var Themes = require('../../Themes');
// var Define = require('../../Define');
var Include = require('../../Include');

import ReactComponent from '../ReactComponent'

// var {globalVariableManager}=require('../modules/GlobalVariableManager')

var ButtonWrap = require('../elements/ButtonWrap')


class ScrollableTabBar extends ReactComponent{
  static componentName = 'ScrollableTabBar'
  // static defaultProps = {}
  static propTypes = {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  }
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
    this.renderTabOption = this.renderTabOption.bind(this);
  }
  renderTabOption(name, page) {
    // var isTabActive = this.props.activeTab === page;
    var style ;
    var styleText={};
    // var styleTextSelect={};
    // var icon = null;
    style = Themes.current.tabbar.tabBlank;

    styleText.color='#000';
    // icon =<Include.Image style={[Themes.current.tabbar.icon,{}]} source={Define.assets.Home['home_icon'+(page+1)]}/>;

    // var opacity = this.props.scrollValue.interpolate({
    //   inputRange: [0+page-1,0+page, 1+page], outputRange: [1,0, 1]
    // });
    //
    var color = this.props.scrollValue.interpolate({
      inputRange: [0+page-2,0+page-1,0+page, 1+page,2+page], outputRange: ['#eaeaea','#eaeaea', '#f8c632','#eaeaea','#eaeaea']
    });

    // <View style={[style,{position:'absolute',top:0,left:0,right:0,bottom:0}]}>
    //   <Include.Text style={[ Themes.Current.text.tabbarTitle2,styleTextSelect]}>{name}</Include.Text>
    // </View>
    //
    var TextAnimated = Animated.createAnimatedComponent(Include.Text)
    return (
      <ButtonWrap key={page} onPress={() => this.props.goToPage(page)} >
        <View style={style}>
          {/*<TextAnimated style={[ Themes.current.text.tabbarTitle,styleText,{color:color}]}>{name}</TextAnimated>*/}
          <Include.Text style={[ Themes.current.text.tabbarTitle,styleText]}>{name}</Include.Text>
        </View>
      </ButtonWrap>
    );
  }
  containerWidth=0
  componentWillMount(){
    super.componentWillMount();
    this.containerWidth = this.props.containerWidth;
  }
  renderContent(){
    var self = this;
    var containerWidth = self.props.containerWidth;
    var numberOfTabs = self.props.tabs.length;
    var tabBackGroundStyle;
    var paddingLeft = 0;
    var paddingRight =0;
    if (self.props.style) {
      paddingLeft = self.props.style.paddingLeft || 0;
      paddingRight = self.props.style.paddingRight || 0;
    }

    var tabBackGroundWrapStyle = {
      width: (containerWidth / (numberOfTabs)) - ((paddingLeft + paddingRight)/2)
    };
    tabBackGroundStyle = {
      width: tabBackGroundWrapStyle.width,
    };

    if (self.props.backgroundSelectedColor) {
      tabBackGroundStyle.backgroundColor = self.props.backgroundSelectedColor;
    }

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, numberOfTabs - 1], outputRange: [paddingLeft, containerWidth*(1 - (1/numberOfTabs))]
    });
    return (
      <View
        onLayout={()=>{
          if (self.containerWidth !== self.props.containerWidth) {
            self.containerWidth = self.props.containerWidth;
            self.forceUpdate()
          }
        }}
       style={[ Themes.current.tabbar.tabsWrapNoShadow, {borderColor:'#2b2b2b',borderBottomWidth:1},this.props.backgroundColor?{backgroundColor : this.props.backgroundColor}:null,this.props.style]}>
        {/*<Animated.View style={[Themes.current.tabbar.underlineWrap,tabBackGroundWrapStyle , {left}]}>
          <View style={[Themes.current.tabbar.underline ,tabBackGroundStyle]}/>
        </Animated.View>*/}
        <View style={Themes.current.tabbar.tabs2}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
    );
  }
}

/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
    // user: todos.User,
    appState:state.AppState,
  }
}

export default connect(selectActions)(ScrollableTabBar);
