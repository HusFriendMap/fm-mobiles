
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native';

var {Actions} = require('react-native-router-flux');
import { connect } from 'react-redux';
//action

//components
var Define = require('../../Define');
var Debug = require('../../Util/Debug');
var Themes = require('../../Themes');
var Util = require('../../Util/Util');
var Include = require('../../Include');

var {popupActions} = require('../popups/PopupManager');
var {globalVariableManager}= require('../modules/GlobalVariableManager');
var {mapGuideManager} = require('../modules/MapGuideManager');

var ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog
} = FBSDK;
//variable

// var styles = StyleSheet.create({
//
// })

//

class DetailPlaceScreen extends Screen{
  static componentName = 'DetailPlaceScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,
    {})
    this._renderItem = this._renderItem.bind(this);
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
  static renderTitle(scene){
    return(
      <View style={Themes.current.screen.titleWrapNavBarCenter}>
        <Include.Text style={Themes.current.text.navBartitle}>Chi Tiết</Include.Text>
      </View>
    )
  }

  onRefresh(){
    super.onRefresh();
    var {dispatch} = this.props;
  }

  onGetMore(){
    super.onGetMore();
    var {dispatch} = this.props;
  }
  _renderItem({item, index}, parallaxProps) {
    return (
      <ButtonWrap
        onPress={() => {
          this.showFullPic(item)
        }}
      >
        <View style={{alignItems:'center',padding:3, width:Define.constants.widthScreen/2+10, height:120}}>
            <ParallaxImage
                source={{ uri: item}}
                containerStyle={{ width:'100%', height:120, borderRadius:4}}
                style={{resizeMode:'stretch', borderRadius:4}}
                parallaxFactor={0.4}
                {...parallaxProps}
            />
        </View>
      </ButtonWrap>
    );
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    const {data} = this.props;
    const rating = data.rating ? data.rating : 5;
    let ratings = []
    for (let i = 0; i < rating; i++) {
      ratings.push(1);
    }
    content =(
      <Include.ScrollView
        style={[Themes.current.screen.bodyView,this.props.bodyStyle],{ marginTop:70, backgroundColor:'#fff'}}
        refreshing={false}
        onRefresh={this.onRefresh}
        onGetMore={this.onGetMore}
      >
        <View style={{elevation:3,flexDirection:'row', backgroundColor:'#FFF', padding:10, marginBottom:10}}>
          <Image style={{width: 60, height: 60, borderRadius: 30}} source={{uri: this.props.avartar}} />
          <View style={{flex:1, flexDirection:'column'}}>
            <Include.Text style={{marginLeft:10, fontWeight:'bold'}}>{data.name}</Include.Text>
            <View style={{marginLeft:10, flexDirection:'row', marginTop:3}}>
              {ratings.map(() => {
                return(
                  <AntIcon name={'star'} style={{fontSize:16, color:'#EE7F19'}}/>
                )
              })}
            </View>
            <View style={{marginLeft:10, flexDirection:'row', marginTop:3}}>
              <AntIcon name={'enviromento'} style={{ fontSize:16, color:'#000', marginTop:2}}/>
              <Include.Text style={{marginLeft:3}}>{data.address}</Include.Text>
            </View>
          </View>

        </View>
        {data.photos ?
          <Carousel
                 data={data.photos}
                 renderItem={this._renderItem}
                 hasParallaxImages={true}
                 itemWidth={Define.constants.widthScreen*0.6}
                 sliderWidth={Define.constants.widthScreen}
                 firstItem={data.photos.length > 1 ? 1 : 0}
             />
        :null}
        <View style={{flexDirection:'row', paddingBottom:10, marginHorizontal:10, paddingHorizontal:5, flex:1, alignItems:'center',backgroundColor:'#fff', borderRadius:4,justifyContent:'space-between', marginTop:10}}>
          <TouchableOpacity style={{flexDirection:'column', marginTop:5, borderRadius:4, elevation:3, width:95, height:60, paddingVertical:10,backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
            <AntIcon name={'hearto'} style={{fontSize:16, color:'#000'}}/>
            <Include.Text>Yêu thích</Include.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const shareLinkContent = {
                contentType: 'link',
                contentUrl:data.linkShare,
                contentDescription:data.name,
              };
              ShareDialog.canShow(shareLinkContent).then(
                function(canShow) {
                  if (canShow) {
                    return ShareDialog.show(shareLinkContent);
                  }
                }
              ).then(
                function(result) {
                },
                function(error) {
                }
              );
            }}
            style={{flexDirection:'column', marginTop:5,width:95, elevation:3, height:60,paddingVertical:10,backgroundColor:'#fff',borderRadius:4, alignItems:'center', justifyContent:'center'}}>
            <EvilIcon name={'share-google'} style={{fontSize:20, color:'#000'}}/>
            <Include.Text>Chia sẻ</Include.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              mapGuideManager.hintPlace(data.location.lat, data.location.lng);
            }}
            style={{flexDirection:'column', marginTop:5,width:95,height:60, elevation:3,backgroundColor:'#fff', paddingVertical:10,borderRadius:4, alignItems:'center', justifyContent:'center'}}>
            <FontAwesome5 name={'directions'} style={{fontSize:16, color:'#0652DD'}}/>
            <Include.Text>Chỉ đường</Include.Text>
          </TouchableOpacity>
        </View>
        {data.openingHour ?
          <View style={{ marginLeft:10, flexDirection:'row'}}>
            <FontAwesome name={'circle'} style={{ marginTop:5, color:data.openingHour.open_now ?'#4cd137':'#EA2027'}}/>
            <Include.Text style={{fontWeight:'bold', marginLeft:3}}>Giờ mở cửa:{data.openingHour.hours}</Include.Text>
          </View>
        :null}
        <View style={{ marginLeft:10}}>
          <Include.Text style={{fontWeight:'bold'}}>Địa chỉ:</Include.Text>
          <Include.Text style={{}}>{data.fullAddress}</Include.Text>
        </View>
        <View style={{ marginLeft:10}}>
          <Include.Text style={{fontWeight:'bold'}}>Nhận xét:</Include.Text>
          <Include.Text style={{fontSize:13, fontStyle:'italic', textAlign:'center'}}>(Chưa có nhận xét nào về địa điểm này)</Include.Text>
        </View>
        <TouchableOpacity
          style={{alignItems:'center', justifyContent:'center',paddingVertical:10, marginTop:10 }}
        >
          <Include.Text style={{color:'#0abde3', padding:10, fontSize:16, elevation:4, borderRadius:4,backgroundColor:'#fff'}}>Để lại cảm nhận của bạn</Include.Text>
        </TouchableOpacity>
      </Include.ScrollView>
    )
    return content;
  }
  showFullPic(uri) {
    popupActions.setRenderContentAndShow(
      {}, {},
      () => {
        return (
          <ButtonWrap
            onPress={() => { popupActions.popPopup() }}>
            <Include.Image
              style={{
                resizeMode: 'stretch',
                height: Define.constants.heightScreen * 0.8,
                width: Define.constants.widthScreen * 0.8
              }}
              source={{ uri: uri }}
            />
          </ButtonWrap>
        )
      }
    )
  }
  componentDidMount(){
    super.componentDidMount();
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

export default connect(selectActions, undefined, undefined, {withRef: true})(DetailPlaceScreen);
