
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
var Themes = require('../../Themes');
import { connect } from 'react-redux';
var Define = require('../../Define');
var Themes = require('../../Themes');

class BottomTabBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = _.merge(this.state,
    {
      number:0,
    })
    this.icons = [];
    this.names = [];
    this.iconLabels = ['home','hearto', 'message1', 'user'];

  }

  componentDidMount() {
    this.setAnimationValue({value: 0})
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value, }) {
    this.icons.forEach((icon, i) => {
      const progress = (Math.abs(value - i) >= 0 && Math.abs(value - i) <= 1) ? Math.abs(value - i) : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });

    this.names.forEach((name, i) => {
      const progress = (Math.abs(value - i) >= 0 && Math.abs(value - i) <= 1) ? Math.abs(value - i) : 1;
      name.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 238 -  238 * progress;
    const green = 127  - 127 * progress;
    const blue = 25  - 25 * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  render() {
    return <View style={[styles.tabs, this.props.style, ], {flexDirection:'row'}}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <View
            style={{flexDirection:'column', alignSelf:'center', alignItems:'center', justifyContent:'center'}}
          >
            <View>
              <Icon
                name={this.iconLabels[i]}
                size={23}
                style={{'backgroundColor': 'transparent', color: '#fff', marginBottom: -5}}
                ref={(icon) => { this.icons[i] = icon; }}
              />
            </View>
            <View>
              <Text
                ref={(name) => { this.names[i] = name; }}
                style={{fontSize: 14, backgroundColor: 'transparent', color: '#fff'}}>
                {tab}</Text>
            </View>
          </View>

        </TouchableOpacity>;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 3,
  },
  tabs: {
    height: 45,
    elevation:1,
    shadowColor:'#000000',
    shadowOpacity:0.5,
    shadowOffset:{height:-1, width:0},
    borderColor:'#000'
  },
});

export default BottomTabBar;
