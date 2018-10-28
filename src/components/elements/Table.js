//LIB
import React  from 'react';
var {
  StyleSheet,
  View,
  ListView,
} = require('react-native');

//components
// var Debug = require('../../Util/Debug');
var Include = require('../../Include');

//variable

var styles = StyleSheet.create({
  col: {
    flex:1,
    // justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems:'center',
    flexWrap: 'wrap'
  },
  row: {
    // flex:1,
    // justifyContent: 'space-around',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  content:{
    flexDirection :'row',
    paddingBottom:1,
  }
})

//

var Table = React.createClass({
  propTypes:{
    // title of table (need render function)
    title:React.PropTypes.string,
    rowStyle:React.PropTypes.object,
    // stylemap ?
    /** array 2 dimensions contain data
    *
    *  each elements is a object have data field and style field
    */
    data:React.PropTypes.array,
    renderCell:React.PropTypes.func,
    renderTitle:React.PropTypes.func,
    style:React.PropTypes.any,
  },
  // getDefaultProps:function(){
  // },

  getInitialState :function(){
    const self = this;
    const dataSource = new ListView.DataSource({rowHasChanged: self.props.rowHasChanged ? self.props.rowHasChanged : (r1, r2) => r1 !== r2});

    return({
      ds: dataSource.cloneWithRows([])
    })
  },

  renderTitle:function(){
    var self = this;
    if (self.props.renderTitle) {
      return self.props.renderTitle(self.props.title);
    }
    else{
      return self.defaultRenderTitle();
    }
  },

  defaultRenderTitle:function(){
    var self = this;
    return(
      <View style={{backgroundColor:'#303030'}}>
        <Include.Text style={{color:'#FFF'}}>{self.props.title}</Include.Text>
      </View>
    )
  },
  defaultRenderCell:function(colData, sectionID: number, colID: number,highlightRow,rowID:number){
    var self= this;
    var cellStyle={};
    var textStyle={};

    if (rowID === 0) {
      cellStyle={
        backgroundColor:'#5e7f4a',
      };
      textStyle={
        color:'#FFF',
      }
    }

    if ((rowID > 0) && (colID === 0)) {
      cellStyle={
        backgroundColor:'#9a764b',
      };
      textStyle={
        color:'#FFF',
      }
    }

    var columnFlexValue=Array(self.props.data[0].length).fill(1);
    var columnRightMarginValue=Array(self.props.data[0].length-1).fill(1);
    columnRightMarginValue[self.props.data[0].length-1] = 0;

    return(
      <View style={[{flex:columnFlexValue[colID],
                      marginRight:columnRightMarginValue[colID],
                      alignItems:'center',
                      justifyContent:'center'},
                    cellStyle]}>
        <Include.Text style={textStyle}>{colData}</Include.Text>
      </View>
    )
  },

  _renderColumn:function (colData, sectionID: number, colID: number,highlightRow,rowID:number){
    var self = this;

    if (self.props.renderCell) {
      return self.props.renderCell(colData, sectionID, colID,highlightRow,rowID,self.props.data);
    }
    else{
      return self.defaultRenderCell(colData, sectionID, colID,highlightRow,rowID);
    }
  },
  _renderRow: function(rowData, sectionID: number, rowID: number) {
    var self = this;

    // fix column of data follow number column of first row in data
    var rowDataTemp = [];
    if (rowData.length < self.props.data[0].length) {
      rowDataTemp = rowData;
      for (let i = rowData.length; i < self.props.data[0].length; i++) {
        rowDataTemp[i] = ' ';
      }
    }
    else if(rowData.length > self.props.data[0].length){
      rowDataTemp= rowData.slice(0,self.props.data[0].length);
    }
    else{
      rowDataTemp = rowData;
    }

    //
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource=ds.cloneWithRows(rowDataTemp);
    return (
      <ListView
        style={[styles.content,self.props.rowStyle,
                (Array.isArray(self.props.rowStyleArray) && self.props.rowStyleArray[rowID])? self.props.rowStyleArray[rowID]:{}]}
        contentContainerStyle={styles.col}
        dataSource={dataSource}
        renderRow={(colData, sectionIDCol, colID, highlightRow)=>{return(self._renderColumn(colData, sectionIDCol, colID, highlightRow,rowID))}}
        pageSize={self.props.data.length}
        scrollEnabled={false}
      />
    );
  },

  render:function(){
    var self = this;

    // var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var dataSource=self.state.ds.cloneWithRows(self.props.data? self.props.data:[]);

    return(
      <View style={self.props.style}>
        {self.renderTitle()}
        <ListView
          removeClippedSubviews ={true}
          refreshControl={self.props.refreshControl}
          onScroll={self.props.onScroll}
          contentContainerStyle={styles.row}
          dataSource={dataSource}
          renderRow={self._renderRow}
          pageSize={self.props.data.length}
          scrollEnabled={false}
        />
      </View>
    )
  }
})



module.exports=Table;
