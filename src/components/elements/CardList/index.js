
var _ = require('lodash')
//LIB
import React  from 'react';
import {
  View
} from 'react-native';

 import { connect } from 'react-redux';

//action

//components
var Define = require('../../../Define');
var Debug = require('../../../Util/Debug');
var Themes = require('../../../Themes');
var Util = require('../../../Util/Util');
var Include = require('../../../Include');

import ReactComponent from '../../ReactComponent'
var Table = require('../Table');
var {popupActions} = require('../../popups/PopupManager');
var {globalVariableManager}= require('../../modules/GlobalVariableManager');

class CardList extends ReactComponent{
  static componentName = 'CardList'
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
    this.renderCell = this.renderCell.bind(this);
  }
  componentDidMount() {

  }
  renderCell(cellData) {
    console.log('ahihi',cellData);
    return(
      <View style={{}}>
        <Include.Text>ahihi</Include.Text>
      </View>
    )
  }
  renderContent(){
    var content = (
      <Table
        renderCell={this.renderCell}
        data = {this.props.data}
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
function selectActions(state) {
  return {}
}

export default connect(selectActions, undefined, undefined, {withRef: true})(CardList);
//export default CardList
