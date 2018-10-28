
var _ = require('lodash')

//LIB
import React  from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  Image
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

var ButtonWrap = require('../elements/ButtonWrap');

import Swiper from 'react-native-swiper';
import {Icon} from 'native-base';

//screens
import Screen from './Screen'
import PickCardPriceScreen from './PickCardPriceScreen'

// popups
import DefaultPopup from '../popups/DefaultPopup';

// actions
import UserActions_MiddleWare from '../../actions/UserActions_MiddleWare'
//variable
//element
// var styles = StyleSheet.create({
//
// })

//

class PickCardTypeScreen extends Screen{
  static componentName = 'PickCardTypeScreen'
  static sceneConfig ={
    ...Screen.sceneConfig
  }
  // static defaultProps = {}
  // static propTypes = {}
  constructor(props){
    super(props);
    this.state = _.merge(this.state,{
      isRenderPrice: false,
      cardSelected: null
    });
    this.listCard=[];
    this.priceData=[];
    this.renderListCard = this.renderListCard.bind(this);
    this.renderListPrice = this.renderListPrice.bind(this);
  }

  // static renderLeftButton(scene){
  //   return (
  //     <View style={Themes.current.screen.leftButtonWrapNavBar}>
  //       <Include.Text>LeftButton</Include.Text>
  //     </View>
  //   )
  // }
  static renderBackButton(scene){
    return (
      <ButtonWrap onPress={()=>{
          Actions.pop();
        }}>
        <View style={Themes.current.screen.leftButtonWrapNavBar}>
          <Icon name='md-arrow-back' style={{color:'#fff'}}/>
        </View>
      </ButtonWrap>
    )
  }
  static renderTitle(scene){
    return(
      <View style={Themes.current.screen.titleWrapNavBarCenter}>
        <Include.Text style={Themes.current.text.navBartitle}>CHỌN LOẠI THẺ</Include.Text>
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

  renderListCard(card) {
    var {dispatch} = this.props;
    return(
      <ButtonWrap
        onPress={() => {
          dispatch(UserActions_MiddleWare.getCard({id:card._id}))
          .then((result) => {
            this.priceData = {
                "_id": "5ae952c0717365072fb43fa8",
                "icon": "http://gamecard.vn/uploads/images/appota.jpg",
                "name": "Thẻ Appota",
                "prices": [
                    {
                        "label": "50.000 VNĐ",
                        "code": "50"
                    },
                    {
                        "label": "100.000 VNĐ",
                        "code": "100"
                    },
                    {
                        "label": "100.000 VNĐ",
                        "code": "100"
                    },
                    {
                        "label": "100.000 VNĐ",
                        "code": "100"
                    },
                    {
                        "label": "100.000 VNĐ",
                        "code": "100"
                    }
                ],
                "renderConfig": {
                    "code": "Mã Thẻ",
                    "series": "Số Series"
                }
            };
            Actions.PickCardPriceScreen({data:this.priceData});
            this.setState({
              isRenderPrice: true,
              cardSelected:result.res.data._id
            })
          })
          .catch((error) => {
            console.log('ahihi error',error);
          })
        }}
      >
        <View style={{margin: 5, height:Define.constants.widthScreen/4.5+30, backgroundColor:'#ffffff', borderColor:'red',borderWidth:this.state.cardSelected === card._id ?1:0, elevation:3, padding: 10, alignItems:'center'}}>
          {this.state.cardSelected === card._id ?
            <Icon name='md-checkmark-circle' style={{zIndex:999,color:'red', fontSize: 15, position:'absolute', top:1, right:3}}/>:null
          }
          <Image style={{resizeMode:'stretch',width: Define.constants.widthScreen/4.5, height: Define.constants.widthScreen/4.5, borderRadius: 5}} source={{uri:card.icon}} />
          <Include.Text>{card.name}</Include.Text>
        </View>
      </ButtonWrap>
    )
  }
  renderListPrice(price) {
    return(
      <ButtonWrap
        onPress={() => {
        }}
      >
        <View style={{margin: 5, height:Define.constants.widthScreen/8, backgroundColor:'#ffffff', elevation:3, padding: 10, alignItems:'center', justifyContent:'center'}}>
          <Include.Text>{price.label}</Include.Text>
        </View>
      </ButtonWrap>
    )
  }
  renderScreenContent(){
    var {dispatch} = this.props;
    var content = null;
    content =(
      <View
        style={[Themes.current.screen.bodyView,this.props.bodyStyle, {backgroundColor: '#fff'}]}
      >
        <View style={{flexDirection:'column', backgroundColor:'#e0efff',margin:5,marginVertical:10,elevation:3,paddingVertical:10, flex:1}}>
          <View style={{flexDirection:'row',flexWrap: 'wrap', justifyContent: 'center',  marginTop:5}}>
            {this.listCard.map(this.renderListCard)}
          </View>
        </View>
        {this.state.isRenderPrice?
          <View style={{flexDirection:'column', backgroundColor:'#e0efff',margin:5,elevation:3, paddingVertical:10}}>
            <Include.Text style={{alignSelf:'center', fontSize:16}}>Chọn mệnh giá {this.priceData.name}</Include.Text>
            <View style={{flexDirection:'row',justifyContent: 'center',flexWrap: 'wrap', marginTop:5}}>
              {this.priceData.prices.map(this.renderListPrice)}
            </View>
          </View>
        :null}
      </View>
    )
    return content;
  }
  componentDidMount(){
    super.componentDidMount();
    var {dispatch} = this.props;
    dispatch(UserActions_MiddleWare.listCard())
    .then((result) => {
      this.listCard =[
        {
            "_id": "5ae952c0717365072fb43fa8",
            "icon": "http://gamecard.vn/uploads/images/appota.jpg",
            "name": "Thẻ Appota",
            "renderConfig": {
                "code": "Mã Thẻ",
                "series": "Số Series"
            }
        },
        {
            "_id": "5ae952c0717365072fb43fa8s",
            "icon": "http://t3.rbxcdn.com/8c975ba25dca3b55d9f13409c2424910",
            "name": "Thẻ garena",
            "renderConfig": {
                "code": "Mã Thẻ",
                "series": "Số Series"
            }
        },
        {
            "_id": "5ae952c0717365072fb43fas8",
            "icon": "https://i.ytimg.com/vi/55Yq19UKYW0/maxresdefault.jpg",
            "name": "Thẻ Viettel",
            "renderConfig": {
                "code": "Mã Thẻ",
                "series": "Số Series"
            }
        }
      ];
    })
    .catch((error) => {
      console.log('ahihi err',error);
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
    navigator:state.Navigator
  }
}

export default connect(selectActions, undefined, undefined, {withRef: true})(PickCardTypeScreen);
