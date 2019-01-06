
var Define = require('../Define'); // var Include = require('../Include');
var StyleConfig = require('./StyleConfig');
import {
  Platform,
} from 'react-native';
var X = Define.constants.X;
var paddingTopOption = Platform.OS === 'android' ? 7 : 0;
var Default ={
  init:function(){
    return (
      {
  screen:{
    appBackground:{
      flex:1,
      // backgroundColor:'transparent',
      // ...StyleConfig.default.shadownStyle,
    },
    NavBar:{
      height:Define.constants.navBarHeight,
      borderBottomWidth:0,
      padding:0,paddingTop:0,
      ...StyleConfig.default.shadownStyle,
    },
    leftButtonWrapNavBar:{
      backgroundColor: 'transparent', position:'absolute',top: paddingTopOption,left:0,paddingLeft: 10, paddingRight:10,height:Define.constants.navBarHeight, flexDirection:'row',alignItems:'center',justifyContent:'flex-start',
    },
    leftButtonIcon:{
      marginLeft:10,width:10,height:20,tintColor :'#FFF',paddingTop: paddingTopOption
    },
    rightButtonWrapNavBar:{
      backgroundColor: 'transparent', position:'absolute',top: paddingTopOption,right:10,paddingLeft:10,height:Define.constants.navBarHeight,flexDirection:'row',alignItems:'center',justifyContent:'flex-end',
    },
    titleWrapNavBarCenter:{
      backgroundColor: 'transparent', left:0,right:0,top:paddingTopOption,height:Define.constants.navBarHeight,position:'absolute',alignSelf:'center',alignItems :'center' ,justifyContent:'center',
    },
    titleWrapNavBarLeft:{
      left:40,right:0,top:paddingTopOption,height:Define.constants.navBarHeight,position:'absolute',alignSelf:'center',alignItems :'flex-start',justifyContent:'center',
    },
    bodyViewNoNavBarWrap:{
      // justifyContent: 'flex-start',
      top: 0,bottom:0,right:0,left:0,
      position: 'absolute',
      // ...StyleConfig.default.shadownStyle,
    },
    bodyViewWrap:{
      // justifyContent: 'flex-start',
      top: Define.constants.navBarHeight-5,paddingTop:5,bottom:0,right:0,left:0,
      // marginTop:X*0.2,
      position: 'absolute',
      // ...StyleConfig.default.shadownStyle,
    },
    bodyView:{
      top: Define.constants.navBarHeight-5,paddingTop:5,bottom:0,right:0,left:0,position: 'absolute',
      backgroundColor: 'transparent',
    },
    marginTopWrap:{
      marginTop:X*0.2,
    },
    marginWrap:{
      margin:X*0.2,
    },
    paddingWrap: {
      paddingLeft: X*0.2,
      paddingRight: X*0.2
    },
  },
  sideMenu:{
    container:{
      // flex:1,
      height:Define.constants.availableHeightScreen,
      width: X*7.5,//Define.constants.widthScreen,
      backgroundColor:'#2d2d2d',
      paddingLeft:X*0.2,
      // paddingTop:X*0.4,
    }
  },
  tabbar:{
    tabBlank:{
      flex: 1,alignItems: 'center',justifyContent: 'space-around'
    },
    // tabSelected: {
    //   flex: 1,alignItems: 'center',justifyContent: 'space-around',backgroundColor: '#58A153',
    // },
    // tabSelected2: {
    //   flex: 1,alignItems: 'center',justifyContent: 'space-around',backgroundColor: '#bc7905',
    // },
    tabsWrap: {
      backgroundColor: '#01cca1',
      ...StyleConfig.default.shadownStyle
    },

    tabs: {
      height: X*1.3,flexDirection: 'row',justifyContent: 'space-around',top: 0
    },
    tabs2: {
      height: X*1,flexDirection: 'row',justifyContent: 'space-around',top: 0, alignItems:'center'
    },
    icon: {
      width: X * 0.9,
      height: X * 0.8,
      position: 'relative',
      alignSelf  :'center'
    },
    menuIconRightWrap:{
      alignSelf  :'center',
      marginLeft: 5,
      marginRight: 5,
    },
    container: {
      flex: 1,
      marginTop: 0,
    },
    tabView: {
      flex: 1,
      padding: 0,
    },
  },
  page:{
    contentWrapPage:{
      flex:1,
    },
  },
  popup:{
    fadeDownContainer:{
      width:X*8.6,
      backgroundColor:'#eaeaea',
      borderBottomLeftRadius:4,
      borderBottomRightRadius :4,
      elevation:Define.constants.elevation,
      borderColor:'#000',
      justifyContent:'center',
      alignItems:'center',
      paddingVertical:10
    },
    normalContainer:{
      width:X*8,
      height:X*7.5,
      backgroundColor:'#eaeaea',
      borderRadius:4,
      elevation:Define.constants.elevation,
      borderColor:'#000',
      alignItems:'center',
      padding:X*0.2,
      justifyContent:'space-between',
    },
    titleWrap:{
      alignSelf:'stretch',
      paddingLeft: 10,
      paddingRight: 10
    },

  },
  text:{
    defaultText:{
      color:'#303030',
      fontSize:15,
    },
    normal:{
      fontSize:15,
    },
    input: {
        flex:1,
        paddingRight: 5,
        paddingLeft: 15,
        height:40,
        color: '#fff'
    },
    subNormal:{
      color:'#8b8b8b',fontSize:10,
    },
    navBartitle:{
      fontSize:17,
      fontFamily:Define.constants.fontBold,
      color:'#fff',
      fontWeight: '500'
    },
    // title:{
    //   fontSize:17,color:'#232323'
    // },
    tabbarTitle:{
      fontSize:12,fontFamily: Define.constants.fontBold,
    },
    tabbarTitle2:{
      fontSize:16,fontFamily: Define.constants.fontBold,
      textAlign:'center'
    },
    title:{
      fontSize:17,fontFamily:Define.constants.fontBold
    },
    subTitle:{
      fontSize:15,fontFamily:Define.constants.fontBold
    },
    popupTitle:{
      fontSize:16,fontFamily: Define.constants.fontBold,color:'#000',textAlign:'center', fontWeight:'500'
    },
    popupDescription:{
      left:0,right:0,color:'#000',marginVertical:5,alignSelf:'center',textAlign :'center'
    },
    tip:{
      fontSize:15,fontFamily: Define.constants.fontBold,color:'#fff',textAlign:'center'
    }
  },
  image:{
    loading:{
      position:'absolute',
      resizeMode:'stretch',
      top:(-Define.constants.heightOfStatusBarAndroid),
      bottom:0,left:0,right:0,
      width:Define.constants.widthScreen,
      height:Define.constants.heightScreen
    },
    tabsBackgroundImage: {
      position:'absolute',
      resizeMode:'stretch',
      width:Define.constants.widthScreen,
      height:X*1.3,
    },
    channelThumb:{
      resizeMode:'stretch',
      borderRadius:6,
      width:X*1.9,
      height:X*1.2,
    },
    notifyThumb:{
      borderRadius:X*0.6,
      width:X*1.2,
      height:X*1.2,
    },
    avatarThumb:{
      borderRadius:X*1.34/2,
      width:X*1.34,
      height:X*1.34,
    },
    potraitThumb:{
      resizeMode:'stretch',
      borderRadius:6,
      width:X*2.6,
      height:X*3.3,
    },
    landscapeSmallThumb:{
      resizeMode:'stretch',
      borderRadius:6,
      width:X*4.15,
      height:X*2.4,
    },
    landscapeThumb:{
      height:X*4.7,
      alignSelf:'stretch',
      resizeMode:'cover',
    },
    mainThumb:{
       height:X*4.7,
      resizeMode:'cover',
      width:Define.constants.widthScreen,
      // alignSelf:'stretch',
    },
    //
    nextArrow:{
      resizeMode:'contain',
      width:X*0.26,
      height:X*0.43,
      paddingRight:X*0.4,
    },
    backArrow:{
      resizeMode:'contain',
      width:X*0.26,
      height:X*0.43,
      paddingLeft:X*0.4,
      paddingRight:X*0.5,
    },
    smallIcon:{
      resizeMode:'contain',
      width:X*0.4,
      height:X*0.25,
    },
    smallIcon2:{
      resizeMode:'contain',
      width:X*0.4,
      height:X*0.4*(54/50),
      marginRight:X*0.2,
    },
    menuIcon:{
      resizeMode:'contain',
      width:X*0.65,
      height:X*0.65,
    },
    closeIcon:{
      height:X*0.35,
      width:X*0.35,
      // position:'absolute',
      tintColor: '#1e8668',
    },
    alertIcon: {
      height:X*0.35,
      width:X*0.35,
      // position:'absolute',
      // alignSelf:'center'
    },
  },
  component:{
    smallGreenButton:{
      width:Define.constants.widthScreen*1/4,
      height:30,
      alignSelf:'center',
    },
    normalRedButton: {
      height: 27,
      backgroundColor: '#f44336'
    },
    normalGreenButton: {
      height: 27
    },
    normalBlueButton: {
      backgroundColor: '#3498db',
      height: 27,
    },
    // swiper
    paginationStyle:{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      flex: undefined,
      alignSelf:'center',
      justifyContent: 'center',
      alignItems : 'center',
    },
    activeDot:{
        backgroundColor : '#f8bf48',
        width: 5,
        height: 5,
        borderRadius: 3,
        margin:2
    },
    dot:{
      backgroundColor: 'rgba(255,255,255,.6)',
      width: 5,
      height: 5,
      borderRadius: 3,
      margin:2
    },
  },
  // linearConfig: {
  //   start: {x: 0, y: 0},
  //   end: {x: 1, y: 0},
  //   colors: ['#01cca1', '#1795b5'],
  //   style: {flex: 1}
  // },
  factor:{
    shadownStyle:StyleConfig.default.shadownStyle,
    openSideMenuOffset:X*7.36,
    refreshingColor:['#ed1c24', '#0095da', '#fff200' , '#4279bd'],
    refreshingBackgroudColor:'#FFFFFF',
    placeholderSearchTextColor:'#939393',
    spinnerColor:'#ffffff',
    backgroundColor:'#01cca1',
    brandPrimary:'#01cca1'
  },

}
    )
  }
}


module.exports = Default;
