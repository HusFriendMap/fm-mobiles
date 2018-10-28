import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';

class BottomTabBar extends React.Component {
  icons = [];

  constructor(props) {
    super(props);
    this.icons = [];
    this.names = [];
  }

  componentDidMount() {
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
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      name.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  renderTextUnderIcon(index) {
    switch (index) {
      case 0:
        return(
          <View>
            <Text
              color={this.props.activeTab === index ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
              ref={(name) => { this.names[index] = name; }}
              style={{fontSize: 11}}>
              Trang chủ</Text>
          </View>
        )
      break;
      case 1:
        return(
          <View>
          <Text
            color={this.props.activeTab === index ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
            ref={(name) => { this.names[index] = name; }}
            style={{fontSize: 11}}>
            Đơn hàng</Text>
          </View>
        )
      break;
      case 2:
        return(
          <View>
            <Text
              color={this.props.activeTab === index ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
              ref={(name) => { this.names[index] = name; }}
              style={{fontSize: 11}}>
              chatboxes</Text>
          </View>
        )
      break;
      case 3:
        return(
          <View>
          <Text
            color={this.props.activeTab === index ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
            ref={(name) => { this.names[index] = name; }}
            style={{fontSize: 11}}>
            notifications</Text>
          </View>
        )
      break;
      case 4:
        return(
          <View>
          <Text
            color={this.props.activeTab === index ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
            ref={(name) => { this.names[index] = name; }}
            style={{fontSize: 11}}>
            list</Text>
          </View>
        )
      break;
      default:
        return null;
    }

  }
  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <View
            style={{flexDirection:'column', alignSelf:'center', alignItems:'center', justifyContent:'center'}}
          >
            <Icon
              name={tab}
              size={25}
              color={this.props.activeTab === i ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
              ref={(icon) => { this.icons[i] = icon; }}
            />
            {this.renderTextUnderIcon(i)}
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
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    paddingTop: 5,
    backgroundColor:'#edfffa',
    elevation:3
  },
});

export default BottomTabBar;
