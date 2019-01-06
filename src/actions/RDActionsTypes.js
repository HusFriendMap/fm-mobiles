//@flow
/*
 * action types
 */
const RDActionsTypes={

  // Todo:{
  //   test:'TEST',
  // },

  ServerConnection:{
    connect:'SERVER_CONNECT',
    disconnect:'SERVER_DISCONNECT',
    changeNetInfo:'SERVER_CONNECT_NET_INFO_CHANGE',
  },

  Store:{
    set:'STORE_SET',
    get:'STORE_GET',
    remove:'STORE_REMOVE',
  },

  AppState:{
    set: 'APP_STATE_SET',
    setDirect : 'APP_STATE_DIRECT_SET',
    showLoading: 'APP_STATE_SHOW_LOADING',
    getConfig: 'APP_STATE_GET_CONFIG',
    constants:{
      APP_STATE_LIST:{
        LOADING:'LOADING',
        RUNNING:'RUNNING',
      },
      APP_STATE_DIRECT_LIST:{
        PORTRAIT:'PORTRAIT',
        LANDSCAPE:'LANDSCAPE',
        UNKNOWN: 'UNKNOWN'
      },
    }
  },
  User: {
    login: 'USER_LOGIN',
    logout: 'USER_LOGOUT',
    loginFacebook: 'USER_LOGIN_FACEBOOK',
    get: 'USER_GET',
    listService: 'USER_LIST_SERVICE',
    listCard:'USER_LIST_CARD',
    getCard:'USER_GET_CARD',
    placesSearch:'USER_SEARCH_PLACES',
    placeDetail:'USER_SEARCH_PLACE_DETAIL'
  },
  AppSetting:{
    setMode: 'APP_SET_MODE',
  },
  //
  constants:{
    REQUEST_SUBTYPE:{
      REQUEST:'REQUEST',
      ERROR:'ERROR',
      SUCCESS:'SUCCESS',
    },
  }

}

module.exports= RDActionsTypes
