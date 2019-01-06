
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Image
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
import {Icon} from 'native-base';
//action
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'
//components
import MapView from 'react-native-maps';
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');
var locationManager = require('../modules/LocationManager');


var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'
import PickCardTypeScreen from './PickCardTypeScreen'

// popups
import DefaultPopup from '../popups/DefaultPopup'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

// actions

//variable

// var styles = StyleSheet.create({
//
// })

//

class HomeScreen extends Screen{
  static componentName = 'ContainerScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,{
      listPlaces:[],
      slideIndex:0
    })
    this.renderListService = this.renderListService.bind(this);
  }
  // static renderRightButton(scene){
  //   return (
  //     <View style={Themes.current.screen.rightButtonWrapNavBar}>
  //       <Include.Text>RightButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderLeftButton(scene){
  //   return (
  //     <View style={Themes.current.screen.leftButtonWrapNavBar}>
  //       <Include.Text>LeftButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderTitle(scene){
  //   return(
  //     <View style={Themes.current.screen.titleWrapNavBarCenter}>
  //       <Include.Text style={Themes.current.text.navBartitle}>Trang chủ</Include.Text>
  //     </View>
  //   )
  // }

  onRefresh(){
    super.onRefresh();
    var {dispatch} = this.props;
  }

  onGetMore(){
    super.onGetMore();
    var {dispatch} = this.props;
  }
  renderListService(service) {
    return(
      <ButtonWrap
        onPress={() => {
          if(service._id==="5ae982b8717365072fb43faa") {
              Actions.PickCardTypeScreen();
          }
        }}
      >
        <View style={{margin: 5, height:Define.constants.widthScreen/4.5+30, backgroundColor:'#ffffff', elevation:3, padding: 10, alignItems:'center'}}>
          <Image style={{width: Define.constants.widthScreen/4.5, height: Define.constants.widthScreen/4.5, borderRadius: 5}} source={{uri:service.icon}} />
          <Include.Text>{service.name}</Include.Text>
        </View>
      </ButtonWrap>
    )
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    content =(
      <View style={{flex:1, backgroundColor:'#aaa'}}>
        <MapView
          ref = {ref => {
            this._mapView = ref;
          }}
          style={{
            flex: 1,
            zIndex: 1
          }}
          provider={MapView.PROVIDER_GOOGLE}
          showsMyLocationButton={false}
          showsUserLocation={true}
          followsUserLocation={false}
          showsPointsOfInterest={false}
          showsCompass={false}
          showsScale={false}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          cacheEnabled={false}
          loadingEnabled={true}
          initialRegion={{
            latitude: 20.9902111,
            longitude: 105.8452833,
            latitudeDelta: 0.02,
            longitudeDelta: 0.01,
          }}>
          {this.state.listPlaces.map((place) => {
              return(
                <MapView.Marker
                  coordinate={{
                    latitude: place.location.lat,
                    longitude: place.location.lng
                  }}>
                </MapView.Marker>
              )
           })}
        </MapView>
        <View style={{
              width: Define.constants.widthScreen,
              height: Define.constants.widthScreen/2+20,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              padding: 10,
              elevation: 5,
              bottom:0,
              right:0,
              left:0
            }}>
        <Carousel
               data={this.state.listPlaces}
               renderItem={this._renderItem}
               hasParallaxImages={true}
               itemWidth={Define.constants.widthScreen*0.6}
               sliderWidth={Define.constants.widthScreen}
               onSnapToItem = {(slideIndex) =>{
                  this.setState({
                   slideIndex
                  });
                  const region = {
                    latitude: this.state.listPlaces[slideIndex].location.lat,
                    longitude: this.state.listPlaces[slideIndex].location.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }
                  this._mapView && this._mapView.animateToRegion(region, 200)
               }}
           />
      </View>
      </View>
    )
    return content;
  }
  _renderItem ({item, index}, parallaxProps) {
    return (
        <View style={{backgroundColor:'#fff', elevation:10, borderRadius:6, alignItems:'center',padding:3, width:Define.constants.widthScreen/2+10, height:Define.constants.widthScreen/2}}>
            <ParallaxImage
                resizeMode={'stretch'}
                source={{ uri:item.photo ? item.photo : `http://www.wijchensnieuws.nl/wp-content/uploads/2015/10/school.gif`}}
                containerStyle={{ width:'100%', height:120, borderRadius:4}}
                style={{resizeMode:'center', borderRadius:4}}
                parallaxFactor={0.4}
                {...parallaxProps}
            />
            <View>
              <Text style={{textAlign:'center', fontSize:14, fontWeight:'bold'}} numberOfLines={1}>
                      { item.name }
              </Text>
              <Text style={{textAlign:'center'}} numberOfLines={2}>
                      { item.address }
              </Text>
            </View>

        </View>
    );
}
  componentDidMount(){
    super.componentDidMount();
    var {dispatch} = this.props;
    dispatch(UserActions_MiddleWare.placesSearch({
      "type":"school"
    }))
    .then((result) => {
      this.setState({
        listPlaces:result.res.data
      })
    })
    .catch((err)=> {
      console.log('ahihi err',result);
    })
  }
}


/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
    navigator: state.Navigator,
  }
}

module.exports=connect(selectActions, undefined, undefined, {withRef: true})(HomeScreen);
// export default HomeScreen
