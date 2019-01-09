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
    placesSearch:'USER_SEARCH_PLACES',
    placeDetail:'USER_SEARCH_PLACE_DETAIL',
    listAvailableService:'USER_LIST_SERVICE',
    getLocationName:'USER_GET_LOCATION_NAME',
    register:'USER_REGISTER',
    update:'USER_UPDATE',
    addFavorite:'USER_ADD_FAVORITE',
    removeFavorite:'USER_REMOVE_FAVORITE',
    listFavorite:'USER_LIST_FAVORITE'
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
