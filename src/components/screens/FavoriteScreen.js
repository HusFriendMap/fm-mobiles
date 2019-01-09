
let _ = require('lodash')

//LIB
import React from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  LayoutAnimation,
  Platform,
  Image,
  TouchableOpacity
} from 'react-native';

let { Actions } = require('react-native-router-flux');
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'native-base';
var MyListView = require('../elements/MyListView');
import AntIcon from 'react-native-vector-icons/AntDesign';
//action
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare';
import StarRating from 'react-native-star-rating';

//components
let Define = require('../../Define');
let Debug = require('../../Util/Debug');
let Themes = require('../../Themes');
let Util = require('../../Util/Util');
let Include = require('../../Include');

let { popupActions } = require('../popups/PopupManager');
let { globalVariableManager } = require('../modules/GlobalVariableManager');

let ButtonWrap = require('../elements/ButtonWrap');

//screens
import Screen from './Screen'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions

//letiable

// let styles = StyleSheet.create({
//
// })

//

class FavoriteScreen extends Screen {
  static componentName = 'ContainerScreen'
  static sceneConfig = {
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props) {
    super(props);
    this.state = _.merge(this.state,
      {
        favoriteList: [],
        isScroll: false
      })
    this._renderItem = this._renderItem.bind(this)
    this.rowHasChanged = this.rowHasChanged.bind(this)
    this.isGettingMore = false;
    this.onRefresh = this.onRefresh.bind(this)
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
  static renderTitle(scene) {
    return (
      <View style={Themes.current.screen.titleWrapNavBarCenter}>
        <Include.Text style={Themes.current.text.navBartitle}>ĐÁNH GIÁ</Include.Text>
      </View>
    )
  }
  onRefresh() {
    super.onRefresh();
    this.setState({isScroll:false})
    this.setState({
      favoriteList: []
    })
    this.getFavorite();
  }
  getFavorite(from) {
    let { dispatch, user } = this.props;
    const userId = user.memberInfo && user.memberInfo.member ? user.memberInfo.member._id : ''
    this.isGettingMore = true;
    dispatch(UserActions_MiddleWare.listFavorite({ userId:userId,from : from}))
      .then((result) => {
        this.isGettingMore = false;
        let favoriteListArr = this.state.favoriteList;
        if(!from) {
          favoriteListArr = []
        }
        result.res.data.map(reason => {
          favoriteListArr.push(reason);
        })
        this.setState({
          favoriteList : favoriteListArr
        })
        if(result.res.data.length < 10) {
          this.isGettingMore = true;
        } else {
          this.isGettingMore = false;
        }
      })
      .catch(err => {
        this.isGettingMore = false;
      });
  }

  onGetMore() {
    super.onGetMore();

    if(this.isGettingMore) {
      return;
    }
    if(this.state.favoriteList.length > 0) {
      this.getFavorite(this.state.favoriteList[this.state.favoriteList.length - 1].createdAt);
    }
  }

  _renderItem(rowData){
    return(
      <TouchableOpacity
        onPress = {() => {
          let objSend = {
            placeId: rowData.placeId
          }
          if(this.props.user.memberInfo && this.props.user.memberInfo.member) {
            objSend.userId = this.props.user.memberInfo.member._id
          }

          this.props.dispatch(UserActions_MiddleWare.placeDetail(objSend))
          .then((result) => {
            Actions.DetailPlaceScreen({
              data: result.res.data,
              avartar: rowData.photo,
            })
          })
        }}
        style={{marginHorizontal:5,elevation:2,flexDirection:'row', borderRadius:5, backgroundColor:'#FFF', padding:10, marginBottom:5, alignItems:'center'}}>
        <Image style={{width: 60, height: 60, borderRadius: 30}} source={ rowData.photo? {uri: rowData.photo} : Define.assets.Images.defaultSlider} />
        <View style={{flex:1, flexDirection:'column'}}>
          <Include.Text style={{marginLeft:10, fontWeight:'bold'}}>{rowData.name}</Include.Text>
          <View style={{ flexDirection:'row'}}>
            <StarRating
              containerStyle={{alignSelf:'flex-start', marginLeft:5, paddingRight:3}}
              buttonStyle={{ paddingHorizontal: 3 }}
              starStyle={{backgroundColor: 'transparent'}}
              disabled={true}
              maxStars={5}
              starSize={20}
              halfStarEnabled={true}
              halfStar='md-star-half'
              halfStarColor={'#EE7F19'}
              emptyStar='md-star-outline'
              fullStar='md-star'
              iconSet={'Ionicons'}
              rating={rowData.rating}
              fullStarColor={'#EE7F19'}
            />
            <Include.Text>({rowData.rating})</Include.Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', marginTop:3}}>
            <AntIcon name={'enviromento'} style={{ fontSize:16, color:'#000', marginTop:2}}/>
            <Include.Text style={{marginLeft:3}}>{rowData.address}</Include.Text>
          </View>
        </View>

      </TouchableOpacity>
    )
  }
  rowHasChanged(r1, r2) {
    return true;
  }
  renderScreenContent() {
    let { dispatch, user, appSetting } = this.props;
    let content = null;
    content = (
      <View style={[Themes.current.screen.bodyView, this.props.bodyStyle], {justifyContent:'center', paddingTop:25}}>
        <View style={{backgroundColor:'#fff', elevation:4}}>
          <Include.Text style={{textAlign:'center', color:'#000', fontSize:18, fontWeight:'bold', marginHorizontal:5}}>Địa điểm yêu thích</Include.Text>
          <View style={{width:80, height:4, borderRadius:2, alignSelf:'center', backgroundColor:'#FD5B00', marginBottom:5}}></View>
        </View>
        {this.state.favoriteList.length !== 0 ?
          <MyListView
            style={{ padding: 5, backgroundColor: '#f7f7f7', paddingBottom: 10}}
            containerStyle={{
              justifyContent: 'space-around',
              flexDirection: 'column',
               marginBottom:10,
               marginRight:-10
            }}
            refProp={(listView)=>{this.listView=listView}}
            infos={this.state.favoriteList}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
              />}
            removeClippedSubviews={false}
            renderRow={this._renderItem}
            onEndReached={this.onGetMore}
            initialListSize = {6}
            scrollEventThrottle={200}
            onEndReachedThreshold={120}
            rowHasChanged={this.rowHasChanged}
          /> :
          <View style={{ flex: 1, padding: 5, backgroundColor: '#f7f7f7', paddingBottom: 10 }}>
            <Include.Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 20 }}>Bạn chưa có địa điểm yêu thích nào!</Include.Text>
          </View>
        }
      </View>
    )
    return content;
  }
  componentDidMount() {
    super.componentDidMount();
    this.getFavorite();
  }
  componentWillUpdate() {
    super.componentWillUpdate();
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
    user: state.User
  }
}

export default connect(selectActions, undefined, undefined, { withRef: true })(FavoriteScreen);
