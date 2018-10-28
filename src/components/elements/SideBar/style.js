'use strict';

var React = require('react-native');

var { StyleSheet, Platform } = React;
var Define = require('../../../Define');

module.exports = {
    container: {
      flex: 1,
    },
    menuItemContainer: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      paddingBottom: 20
    },
    menuIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50
    },
    menuTextContainer: {
      paddingLeft: 10,
      justifyContent: 'center'
    },
    menuIcon: {
      color: '#fff',
      fontSize: 37
    },
    menuTextDes: {
      color:'#fff',
      fontSize: 13,
    },
    background: {
        flex: 1,
        width: null,
        height: null,
        paddingLeft: 15,
        paddingTop: 3,
    },
    profileContainer: {
      flexDirection: 'row',
      paddingTop: 20,
      paddingBottom: 10,
      alignItems: 'center'
    },
    imageProfile: {
      width: 50,
      height: 50,
      borderRadius: 25
    },
    usernameContainer: {
      justifyContent: 'center',
      backgroundColor: 'transparent',
      paddingLeft: 10
    },
    usernameText: {
      color: '#365899',
      fontSize: 17,
      fontWeight: '500',
      fontStyle: 'italic'
    }
};
