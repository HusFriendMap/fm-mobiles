
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
  DeviceEventEmitter,
  PixelRatio,
  Keyboard,
  StatusBar
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
//action

//components
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
import MapView from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import { Icon } from 'native-base';
var Define = require('../../Define');
var Include = require('../../Include');
var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');
var locationManager = require('../modules/LocationManager');
var Themes = require('../../Themes');
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

var ButtonWrap = require('../elements/ButtonWrap');
//screens
import Screen from './Screen'
import RDActions from '../../actions/RDActions'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'
import LinearGradient from 'react-native-linear-gradient';

//variable

// var styles = StyleSheet.create({
//
// })

//

class PickLocationScreen extends Screen{
  static componentName = 'PickLocationScreen'
  static sceneConfig ={
    ...Screen.sceneConfig,
    hideNavBar: true
  }
  // static propTypes = {}
  constructor(props){
    super(props)

    let initialRegion = this.props.initialRegion
    this.state = _.merge(this.state,
    {
      location: null,
      name: '',
      initialRegion,
      loading: false,
      height: Platform.OS === 'android' ? 43 : 0,
      showMap:false,
    })

    this.renderMapTime = 0
    this.firstTime = true;

    this.renderFormSearch = this.renderFormSearch.bind(this);
  }

  // static renderLeftButton(scene){
  //   return (
  //     <View style={Themes.current.screen.leftButtonWrapNavBar}>
  //       <Include.Text>LeftButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderRightButton(scene){
  //   return (
  //     <View style={Themes.current.screen.rightButtonWrapNavBar}>
  //       <Include.Text>RightButton</Include.Text>
  //     </View>
  //   )
  // }
  // static renderTitle(scene){
  //   return(
  //     <View style={Themes.current.screen.titleWrapNavBarCenter}>
  //       <Include.Text style={Themes.current.text.navBartitle}>title</Include.Text>
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

  renderButtonChoose() {
    let getTouch = false;
    if(this.state.name) {
      getTouch = true
    }

    return (
      <ButtonWrap
        ref={(ref) => this._confirm_button = ref}
        onPress={() => {
          if(getTouch) {
            this.props.setLocation(this.state.location,this.state.name);
            Actions.pop();
          }
        }}>
        <View
          style={{alignItems: 'center', position: 'absolute', left: 100, right: 100, bottom: 15,backgroundColor: 'transparent'}}>
          <View style={{alignItems:'center', backgroundColor:getTouch ? '#1697B4' : '#5095A7', justifyContent:'center', width:50, height:50, borderColor:'#1795B5', borderRadius:25, borderWidth:1}}>
            <Include.Text style={{fontSize: 23, color: getTouch ? '#fff' : '#DADCE0',}}>OK</Include.Text>
          </View>
        </View>
      </ButtonWrap>
    )
  }
  renderFormSearch() {
    return (
      <View
        ref={ref => this._form_search = ref}
        pointerEvents={'box-none'}
        style={[{flexDirection: 'row', elevation:4, zIndex: 1, height: Platform.OS === 'android' ? this.state.height : 44},
              Platform.OS==='android'?
                      {position:'absolute',backgroundColor:'transparent',
                      top:StatusBar.currentHeight,left:0,right:0,
                      height:Define.constants.heightScreen}:{}]}>
        <GooglePlacesAutocomplete
          ref = {ref => this._place = ref}
          enablePoweredByContainer = {false}
          timeoutShowListView = {500}
          limitTextSearch = {3}
          styles = {{
            container: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              shadowColor: 'red'
            },
            textInput: {
              fontStyle: 'italic',
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              paddingTop: 0,
              marginLeft: 0,
              marginRight: 10,
              marginBottom: 0,
              marginTop: 0,
              backgroundColor:'transparent',
              height: this.state.showMap ? 40*PixelRatio.getFontScale() : 28*PixelRatio.getFontScale(),
              fontSize: 15*PixelRatio.getFontScale(),
              color: this.state.showMap ? '#fff' :'#000'
            },
            row: {
              height: 44*PixelRatio.getFontScale(),
            },
            textInputContainer: {
              marginLeft: 50,
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              justifyContent: 'center'
            },
            description: {
              fontWeight: 'normal'
            },
            listView: {
              backgroundColor: '#fff',
              marginTop: 9,
              borderRadius: 5,
              marginHorizontal:3,
              borderWidth: 0,
              borderColor: '#bdc3c7'
            }
          }}
          placeholder={this.state.showMap ? null :this.props.placeholder}
          minLength={2} // minimum length of text to search
          autoFocus={false}
          fetchDetails={true}
          textInputProps={{
            underlineColorAndroid:'transparent',
            multiline: this.state.showMap,
            numberOfLines : this.state.showMap ? 2 : 1,
            editable : !this.state.showMap,
          }}
          renderDescription={(row) => {
            if(!row.isCurrentLocation && !row.isPredefinedPlace) {
              return row.description
            }
          }}
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            if(!this.state.showMap) {
              this.props.setLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                },details.formatted_address);
              Actions.pop();
            } else {
              const region = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                ...Define.constants.defaultLocationDelta
              }
              this.renderMapTime++;
              this.setState({
                showMap:true
              })
              setTimeout(() => {
                this._mapView.animateToRegion(region, 200);
              },500)

              let name = details.formatted_address
              this.setState({
                location: {
                  location: details.geometry.location.lat,
                  location: details.geometry.location.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                },
                name
              })
              this._place.setAddressText(name)
            }
          }}

          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyD92LkYFGGtvn_KiggUA2oPgrRqxIIOpw8',
            language: 'vi', // language of the results
            types: 'address', // default: 'geocode',
            components: 'country:VN',
            token: 'c87e427c-76fb-409e-a08a-c6405c8a35c6',
            region: 'hn'
          }}
        />

        <ButtonWrap
          onPress={() => {
            if(this.state.showMap) {
              this.setState({showMap:false, name:''})
              this._place.setAddressText("");
              this._place.triggerFocus();
              setTimeout(() => {
                  this.setState({
                    height: 44.1
                  })
              }, 500);
              StatusBar.setBarStyle('dark-content');
            } else {
              Keyboard.dismiss();
              setTimeout(() => {
                Actions.pop()
              }, 200);
            }
          }}>
          <View style={[{position: 'absolute', left: 0, top: 0, bottom: 0, width: 50, alignItems: 'center', justifyContent: 'center'},
                      Platform.OS==='android'? {bottom:undefined,height:44}:{}]}>
              <Icon name = {'md-arrow-back'} style={{color: this.state.showMap ? '#fff' : '#000', fontSize: 23}}/>
          </View>
        </ButtonWrap>
      </View>
    )
  }
  showLoading() {
    if (this.isLoading) {
      return (
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{paddingVertical: 10, backgroundColor: '#000', borderRadius: 5, paddingHorizontal: 30, opacity: 0.5}}>
            <ActivityIndicator
              color = {'#fff'}
              size = 'large'/>
          </View>
        </View>
      )
    }
    return null
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    content =(
      <View style={{flex: 1, backgroundColor:'#ecf0f1',padding: this.state.showMap ? 0 : 5, paddingTop:this.state.showMap ? 0 : StatusBar.currentHeight}}>
        {this.state.showMap ?
          <View style={{elevation:3}}>
            <LinearGradient
              start={ {x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors= {['#FD5B00', '#FFB301']}
              style={{height:this.state.height*2,width:Define.constants.widthScreen, alignItems:'center', justifyContent:'center'}}>
              {this.state.name === '' ?
                <View style={{height:this.state.height*2,width:Define.constants.widthScreen, alignSelf:'center', justifyContent:'center', alignItems:'center'}}>
                  <View style={{marginTop:10, marginLeft:-15}}>
                    <Include.Text style={{color:'#fff', fontSize:19,}}>Chọn điểm lấy hàng</Include.Text>
                    <Include.Text style={{color:'#fff', fontSize:15,}}>Kéo bản đồ để ghim địa chỉ</Include.Text>
                  </View>
                </View>:
                <View style={{height:this.state.height*2,width:Define.constants.widthScreen, alignSelf:'center', justifyContent:'center', alignItems:'center'}}/>}
            </LinearGradient>
          </View>
          :<View style={{elevation:3,height:this.state.height,backgroundColor:'#fff',justifyContent:'center',width:Define.constants.widthScreen-10, alignSelf:'center'}}/>
        }

      {this.state.showMap?
        <Animatable.View
          animation='fadeIn'
          duration={750}
          style={{flex:1}}>
        <MapView
          style={{
            flex: 1
          }}
          ref={ref => this._mapView = ref}
          provider={MapView.PROVIDER_GOOGLE}
          showsMyLocationButton={true}
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
          initialRegion={this.state.initialRegion}
          onRegionChangeComplete={(region) => {
            if(this.renderMapTime <= 2) {
              this.renderMapTime ++;
              return;
            }

            if(this.firstTime) {
              this.firstTime = false;
              return;
            }

            if(Platform.OS === 'android' && Math.abs(this.state.initialRegion.latitude - region.latitude) < 0.0002 &&
                Math.abs(this.state.initialRegion.longitude == region.longitude) < 0.0002 ){
              return;
            }

            dispatch(UserActions_MiddleWare.getLocationName({lat: region.latitude, lng: region.longitude}))
            .then((data) => {
              const name = data.res.data;
              this._place.setAddressText(name)
              this.setState({
                name,
                location: {
                  latitude: region.latitude,
                  longitude: region.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              })
            })
            .catch((err) => {
              this._place.setAddressText('')
              this.setState({
                name: '',
                location: null
              })
            })
            // googleUtils
            // .getLocationName(region.latitude, region.longitude)
            //   .then((name) => {
            //     this._place.setAddressText(name)
            //     this.isLoading = false
            //     this.setState({
            //       name,
            //       location: {
            //         lat: region.latitude,
            //         lng: region.longitude
            //       }
            //     })
            //   })
            //   .catch((err) => {
            //     this.isLoading = false
            //     this._place.setAddressText('')
            //     this.setState({
            //       loading: false,
            //       name: '',
            //       location: null
            //     })
            //   })
          }}/>
          </Animatable.View>:
        <Animatable.View
          animation='fadeInUpBig'
          duration={500}>
          <ButtonWrap
            onPress={() => {
              this.renderMapTime = 3
              setTimeout(() => {
                  this.setState({
                    height: 44
                  })
              }, 500);
              StatusBar.setBarStyle('light-content');
              this.setState({showMap:true})
              Keyboard.dismiss();
            }}
          >
            <View style={{backgroundColor:'#fff', marginBottom:5, elevation:2, height: 44, borderRadius: 3, flexDirection: 'row', marginTop: 10, alignItems: 'center', marginHorizontal:2}}>
              <FontAwesome5 name={'map-marked-alt'} style={{fontSize:20, marginLeft:5, marginRight:3}} />
              <Include.Text style={{fontSize:16}}>Chọn trên bản đồ</Include.Text>
            </View>
          </ButtonWrap>
        </Animatable.View>
      }
      {this.state.showMap?
        <View
          ref={(ref) => this._point_location = ref}
          pointerEvents= {'none'}
          style={{top: 44 + StatusBar.currentHeight*2, left: 0, bottom: 40, right: 0, position: 'absolute', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
          <Include.Image
            source={this.props.pinIcon} style={{width: 40, height: 40}}
          />
        </View>
      :null}

      {this.state.showMap?this.renderButtonChoose():null}
      {this.showLoading()}
      {this.renderFormSearch()}
    </View>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
    const {dispatch} = this.props;
    setTimeout(() => {
      this._place.triggerFocus();
    },300)
  }
}


/**
 * [selectActions description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function selectActions(state) {
  return {
    navigator: state.Navigator
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(PickLocationScreen);
