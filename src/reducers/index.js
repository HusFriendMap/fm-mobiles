
// var Todo = require('./Todo');


var Tracker = require('./Tracker');
var AppState = require('./AppState');
var Navigator = require('./Navigator');
var Store = require('./Store');
var User = require('./User');
var AppSetting = require('./AppSetting');

/**
 * Reducer index.
 * @param {Object} state .
 * @param {Object} action .
 * @returns {null} .
 */
export default function todoApp(state = {}, action) {
  var stateRet = {
    AppState : AppState(state.AppState , action),
    Navigator : Navigator(state.Navigator , action),
    Store : Store(state.Store , action),
    User: User(state.User, action),
    AppSetting: AppSetting(state.AppSetting, action),
    // Todo : Todo(state.Todo , action),
  };

  Tracker(stateRet, action);
  return stateRet;
}


module.exports = todoApp;
