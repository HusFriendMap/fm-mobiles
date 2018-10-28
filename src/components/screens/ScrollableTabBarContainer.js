var _ = require('lodash')
//LIB
import React  from 'react';
var {
  View,
  Platform,
  InteractionManager
} = require('react-native');

var ScrollableTabView = require('react-native-scrollable-tab-view');

//Components
var Debug= require('../../Util/Debug');
var Themes= require('../../Themes');
var Define = require('../../Define');
var Include = require('../../Include');
var {globalVariableManager} = require('../modules/GlobalVariableManager');

import ReactComponent from '../ReactComponent'
import ScrollableTabBar from './ScrollableTabBar'

//page
import TemplatePage from './TemplatePage'
var pageList=[
  TemplatePage,
  TemplatePage
];
//variable


//
class ScrollableTabBarContainer extends ReactComponent{
  static componentName = 'ScrollableTabBarContainer'
  static defaultProps = {
    currentScreenName:'UNKNOWN',
    initialPage:0,
    renderTabBar:() => <ScrollableTabBar/>
  }
  static propTypes = {
    currentScreenName:React.PropTypes.string.isRequired,
    renderTabBar:React.PropTypes.func,
    pageList:React.PropTypes.array,
  }
  tabFocus=0
  countNoScroll=0
  pages= []
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
    this.createPage=this.createPage.bind(this);
  }
  pageList=[]
  createPage(){
    let pageListTemp = [];
    if (this.props.pageList) {
      pageListTemp=this.props.pageList;
    }else{
      pageListTemp = pageList;
    }
    this.pageList= pageListTemp.map((Current,index)=>{
      return(
        <View
            key={index}
            tabLabel={Current.WrappedComponent?Current.WrappedComponent.componentName :Current.componentName }
            style={Themes.current.tabbar.tabView}>
          <Current
            {...this.props}
            currentScreenName={this.props.currentScreenName}
            tabIndex = {index}
            ref={(ref) => {this.pages[index] = ref}}
            tabView={this}
          />
        </View>
      )
    })
  }
  componentWillMount(){
    super.componentWillMount();
    this.createPage();
    if (this.props.initialPage) {
      this.tabFocus = this.props.initialPage;
    }
  }
  renderContent(){
    this.countNoScroll=0;
    return(
      <View style={Themes.current.tabbar.container}>
        <ScrollableTabView ref={'ScrollableTabView'}
                            initialPage={this.tabFocus}
                            onScroll={(value)=>{
                              if (Platform.OS === 'android') {
                                if (this.tabFocus===0 && value===0) {
                                  this.countNoScroll += 1;
                                  if (this.countNoScroll > 4) {
                                    this.countNoScroll=0;
                                    if (this.props.onTryScrollLeft) {
                                      this.props.onTryScrollLeft();
                                    }
                                  }
                                }
                              }
                            }}
                            onChangeTab={(arg)=>{
                              Debug.log(this.constructor.componentName + ':onChangeTab '+ arg.i,Debug.level.USER_TRACKER);
                              if(this.tabFocus !== arg.i) {
                                this.tabFocus = arg.i;
                                InteractionManager.runAfterInteractions(() => {
                                  this.pages[arg.i].getWrappedInstance().forceUpdate();
                                });
                              }
                            }}
                            tabBarPosition ={'top'}
                            renderTabBar={this.props.renderTabBar}>
          {this.pageList}
        </ScrollableTabView>
      </View>
    )
  }
  componentDidMount(){
    super.componentDidMount();
    globalVariableManager.ScrollableTabBarContainer = this;
  }
}


export default ScrollableTabBarContainer;
