
import React from 'react';

var {
  View,
  ListView,
  Image,
  InteractionManager
} = require('react-native');

var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Include = require('../../Include');

var ButtonWrap = require('./ButtonWrap');

// var


var MyListView = React.createClass({
  propTypes: {
    /** infos is array container of info object
    *   info.title
    *             subInfo
    *             thumb
    *             data:{}
    */
    infos:React.PropTypes.array.isRequired,
    //renderDescription
    // renderTopInfo:,
    // renderAdditionAction:
    // renderPostAdditionAction:
    // style:
  },
  getDefaultProps:function(){
    return{
      containerStyle:{
        flex:1,
        justifyContent: 'space-around',
        flexDirection: 'column',
        flexWrap: 'wrap'
      },
      contentWrapStyle:{
        flexDirection :'row',
        padding:4,
      },
      contentThumbStyle:{

      },
      descriptionWrapStyle:{

      },
    }
  },
  getInitialState :function(){
    const self = this;
    const dataSource = new ListView.DataSource({rowHasChanged: self.props.rowHasChanged ? self.props.rowHasChanged : (r1, r2) => r1 !== r2});

    return({
      ds: dataSource.cloneWithRows(self.props.infos?self.props.infos:[])
    })
  },

  renderDescription:function(rowData:any, sectionID: number, rowID: number){
    var self = this;
    if (!rowData.title && !rowData.subInfo) {
      return null;
    }

    var rowDataContent = null;
    if (rowData.subInfo) {
      rowDataContent = <Include.Text numberOfLines={1} >{rowData.subInfo}</Include.Text>;
    }
    return(
      <View style={self.props.descriptionWrapStyle}>
        <Include.Text numberOfLines={3} >{rowData.title}</Include.Text>
        {rowDataContent}
      </View>
    )
  },

  _renderRow: function(rowData, sectionID: number, rowID: number) {
    var self = this;
    var thumbElement = null;
    if (rowData.thumb) {
      if (self.props.renderTopInfo) {
        thumbElement=(
          <View>
            <Include.Image style={self.props.contentThumbStyle} source={rowData.thumb?rowData.thumb:undefined}/>
            {self.props.renderTopInfo(rowData,sectionID,rowID)}
          </View>
        )
      }else{
        thumbElement = <Include.Image style={self.props.contentThumbStyle} source={rowData.thumb?rowData.thumb:undefined}/>
      }
    }


    if (self.props.renderAdditionAction || self.props.renderPostAdditionAction) {
      return (
        <View style={[self.props.contentWrapStyle,rowData.style]}>
          {self.props.renderAdditionAction?self.props.renderAdditionAction(rowData, sectionID, rowID):null}
          <ButtonWrap onPress={rowData.onPress}>
            <View style={[self.props.contentWrapStyle,{flex:1}]}>
              {thumbElement}
              {self.props.renderDescription?self.props.renderDescription(rowData,sectionID,rowID)  : self.renderDescription(rowData,sectionID,rowID)}
            </View>
          </ButtonWrap>
          {self.props.renderPostAdditionAction?self.props.renderPostAdditionAction(rowData, sectionID, rowID):null}
        </View>
      );
    }else{
      return (
        <ButtonWrap onPress={rowData.onPress}>
          <View style={[self.props.contentWrapStyle,rowData.style]}>
            {thumbElement}
            {self.props.renderDescription?self.props.renderDescription(rowData,sectionID,rowID,self.props.descriptionWrapStyle)  : self.renderDescription(rowData,sectionID,rowID)}
          </View>
        </ButtonWrap>
      );
    }
  },

  componentWillReceiveProps: function(nextProps:Object) {
    const self = this;
    self.setState({
      ds: self.state.ds.cloneWithRows(nextProps.infos?nextProps.infos:[])
    });
  },
  render: function(){

    var self = this;
    // var dataSource=[];

    var scrollPropsList=[
      'refreshControl',
      'scrollEventThrottle',
      'onScroll',
      'onContentSizeChange',
      'showsHorizontalScrollIndicator',
      'showsVerticalScrollIndicator',
      'horizontal',
      'onLayout',
      'scrollEnabled',
    ]

    var scrollProps ={
      showsHorizontalScrollIndicator:false,
      showsVerticalScrollIndicator:false,
    };
    scrollPropsList.forEach((currentValue,index)=>{
      if (self.props[currentValue] !== undefined) {
        scrollProps[currentValue] = self.props[currentValue];
      }
    })

    var listViewPropsList=[
      'renderFooter',
      'initialListSize'
    ]

    var listViewProps={
      initialListSize:1,
    };
    listViewPropsList.forEach((currentValue,index)=>{
      if (self.props[currentValue] !== undefined) {
        listViewProps[currentValue] = self.props[currentValue];
      }
    })

    return(
      <ListView
        style={[ {padding:2 },self.props.style? self.props.style :null]}
        ref={self.props.refProp}
        enableEmptySections ={true}
        {...scrollProps}
        {...listViewProps}
        contentContainerStyle={self.props.containerStyle}
        dataSource={self.state.ds}
        renderRow={self.props.renderRow?self.props.renderRow: self._renderRow}
        pageSize={6}
        scrollRenderAheadDistance={660}
        removeClippedSubviews={self.props.removeClippedSubviews !== undefined ? self.props.removeClippedSubviews :  true}
      />
    )
  },

  scrollTo: function(obj) {
    const self = this;
    InteractionManager.runAfterInteractions(() => {
      if(self._list){
        self._list.scrollTo(obj);
      }
    });
  }
})



module.exports = MyListView;
