import {
  Platform,
  PermissionsAndroid,
  Linking
} from 'react-native';

const Debug = require('../../Util/Debug')
const Util = require('../../Util/Util')

class MapGuideManager  {
  constructor() {
    this.hintPlace = this.hintPlace.bind(this);
  }
  hintPlace(latitude,longitude){
    if(Platform.OS === 'ios') {
      const linkGooglemaps = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
      Linking
        .canOpenURL(linkGooglemaps)
        .then((supported) => {
          if (!supported) {
            Linking.openURL(`http://maps.apple.com/?daddr=${latitude},${longitude}`)
          } else {
            return Linking.openURL(linkGooglemaps);
          }
        })
        .catch((err) => {
        });
    } else {
      Linking.openURL(`http://maps.google.com/maps?daddr=${latitude},${longitude}`)
    }
  }
}

const mapGuideManager = new MapGuideManager()

module.exports= {mapGuideManager};
