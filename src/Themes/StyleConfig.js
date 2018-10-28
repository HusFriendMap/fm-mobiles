
import {Platform} from 'react-native';


const StyleConfig = {
  ...Platform.select({
    ios:{
      shadownStyle: {
        shadowColor:'#000000',shadowOpacity:0.5,shadowOffset:{height:1, width:0},
        shadowRadius:2,borderColor:'#000'
      },
    },
    android:{
      shadownStyle: {
        elevation:3,borderColor:'#000'
      },
    }
  }),
}

export default StyleConfig;
