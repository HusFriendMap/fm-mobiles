
var ExtraDimensions = require('react-native-extra-dimensions-android');
var DeviceInfo = require('react-native-device-info');

import {
  Dimensions, Platform,PixelRatio
} from 'react-native';

var PlatformConfig = require('./PlatformConfig');
var RNFS = require('react-native-fs');
//variable
var widthScreen = Dimensions.get('window').width;
var heightScreen = Dimensions.get('window').height;

var screenSizeByInch = Math.sqrt(Math.pow(widthScreen,2) + Math.pow(heightScreen,2))  / (PixelRatio.get()*160) * 2;

var assets={
  Home:{
    home_icon_menu : require('../assets/Home/home_icon_menu.png'),
  },
  Menu:{
    icon_back:  require('../assets/Menu/icon_back.png'),
  },
  Images:{
    backgroundLogin: require('../assets/Images/backgroundLogin.png'),
    atm: require('../assets/Images/atm.png'),
    atm_map: require('../assets/Images/atm_map.png'),
    bank: require('../assets/Images/bank.png'),
    bank_map: require('../assets/Images/bank_map.png'),
    bus_station: require('../assets/Images/bus_station.png'),
    bus_station_map: require('../assets/Images/bus_station_map.png'),
    cafe: require('../assets/Images/cafe.png'),
    cafe_map: require('../assets/Images/cafe_map.png'),
    clothing_store: require('../assets/Images/clothing_store.png'),
    clothing_store_map: require('../assets/Images/clothing_store_map.png'),
    hair_care: require('../assets/Images/hair_care.png'),
    hair_care_map: require('../assets/Images/hair_care_map.png'),
    hospital: require('../assets/Images/hospital.png'),
    hospital_map: require('../assets/Images/hospital_map.png'),
    park: require('../assets/Images/park.png'),
    park_map: require('../assets/Images/park_map.png'),
    pet_store: require('../assets/Images/pet_store.png'),
    pet_store_map: require('../assets/Images/pet_store_map.png'),
    pharmacy: require('../assets/Images/pharmacy.png'),
    pharmacy_map: require('../assets/Images/pharmacy_map.png'),
    restaurant: require('../assets/Images/restaurant.png'),
    restaurant_map: require('../assets/Images/restaurant_map.png'),
    school: require('../assets/Images/school.png'),
    school_map: require('../assets/Images/school_map.png'),
    shopping_mall: require('../assets/Images/shopping_mall.png'),
    shopping_mall_map: require('../assets/Images/shopping_mall_map.png'),
    gas_station: require('../assets/Images/gas_station.png'),
    gas_station_map: require('../assets/Images/gas_station_map.png'),
  },
}

var mapAssets={
}


var Define = {
  assets: (__DEV__ || Platform.OS === 'ios')? assets:PlatformConfig.default.processAsset(assets,mapAssets),
  constants:{
    hybridVersion: PlatformConfig.default.hybridVersion,
    heightOfStatusBarAndroid : 0,
    heightOfSoftMenuBarAndroid: 0,
    availableHeightScreen: heightScreen,
    widthScreen:widthScreen,
    heightScreen:heightScreen,
    screenSizeByInch:screenSizeByInch,
    deviceId:DeviceInfo.getUniqueID(),

    nativeVersion:DeviceInfo.getBuildNumber(),
    currentHybridVersion:0,

    imageThumbRate:(20/9),
    smallImageThumbRate:(9/6),
    videoHeight:widthScreen<heightScreen?widthScreen:heightScreen,
    videoWidth:widthScreen<heightScreen? heightScreen:widthScreen,

    fontScale : Math.floor(4/PixelRatio.getFontScale()),

    navBarHeight: Platform.OS === 'android' ? PlatformConfig.default.navBarHeight+15 : PlatformConfig.default.navBarHeight,
    X : (widthScreen<heightScreen? widthScreen : heightScreen)/ ((screenSizeByInch<7)?9.25:12) ,

    // serverAddr :'http://sctvserver.ddns.net', // http://123.30.235.201:9697  //
    serverAddr :'http://192.168.0.106:1996',  // production // http://123.30.235.63:9696/
    // serverAddr:'http://123.30.235.201:34746',
    // serverAddr :'http://192.168.3.151:8080',
    proxyAddr: 'http://proxy.sanship.info/config',
    apiVersion:2,
    font:PlatformConfig.font,
    fontBold:PlatformConfig.fontBold,
    dataBase:'database.db',
    // crashLog: RNFS.DocumentDirectoryPath + '/CrashLog.txt',
    // trackingLog: RNFS.DocumentDirectoryPath + '/TrackingLog.txt',
    alarmListTable:'AlarmList',
    footballTeamsTable:'FootballTeams',
    signoutBeforeDisconnect:true,
    accountTest:{
      user:'',   // TODO : must = '' when release
      pass:'',
    },
    getMoreHeight:100,
    getMoreHeightMin:1,
    timeoutToHideContent:5000,
    timeoutToHideContent2:10000,
    elevation:3,
    periodOfAccelerometer:1000,
    requestTimeout:26000,
    debug:true,  // must false in release
    debugStyle:false,
    review:false,
    debugTrackerLogLength:166,
    logLevel:0,  // must be 10 when release
    funnyMode:false,
    defaultLocation: {
      latitude: 21.00540294210722,
      longitude: 105.8455963432789
    },
  },
  config:{
    properties:{
      dtid: "0",
      spid: "0",
    },
    currentHybridVersion:0,
    waitToken: true,
    token: '',
  },
  init:function(cb=()=>{}){
    var self = this;

    if (Platform.OS === 'android') {
      ExtraDimensions.getDimentions()
      .then((dimentions)=>{
        self.constants.heightOfStatusBarAndroid = dimentions.statusBarHeight;
        self.constants.heightOfSoftMenuBarAndroid =dimentions.softMenuBarHeight;

        self.constants.availableHeightScreen= heightScreen-dimentions.statusBarHeight;
        self.constants.videoWidth= widthScreen<heightScreen? heightScreen + dimentions.softMenuBarHeight:widthScreen;
      })
    }

    if (self.constants.debug) {
      self.assets = assets;
    }

    var assetsContent={};
    if (Platform.OS === 'android') {
      // get a list of files and directories in the main bundle
      RNFS.readDir(RNFS.DocumentDirectoryPath+'/ASSETS')
        .then((result) => {
          result.forEach((current)=>{
            try{
              var fileNameArray = current.name.split('.');
              assetsContent[fileNameArray[0]] = current;
            }
            catch(ex){}
          })
          self.assets = PlatformConfig.default.processAsset(assets,mapAssets,assetsContent);
          return Promise.reject();
        })
      .catch(()=>{
        if (cb && typeof cb === 'function') {
          cb();
        }
      })
    } else if(Platform.OS === 'ios') {
      const path = 'file://'+RNFS.DocumentDirectoryPath+'/assets';
      RNFS.exists(path)
        .then((isExist) => {
          if(isExist) {
            self.assets = PlatformConfig.default.processAsset(assets,mapAssets, 'assets', true);
          }
          return Promise.reject();
        })
        .catch(()=>{
          if (cb && typeof cb === 'function') {
            cb();
          }
        })
    }
    return self;
  },
};

module.exports = Define;
