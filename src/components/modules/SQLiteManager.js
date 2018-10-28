
//LIB
// var SQLite = require('react-native-sqlite-storage');
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
//components
// var Debug = require('../../Util/Debug');
// var Themes = require('../../Themes');
// var Define = require('../../Define');

// var Actions.ServerConnection=require('../../actions/Actions.ServerConnection');

// var {reduxManager}=  require('./ReduxManager');

//variable

//
class SQLiteManager{
  constructor(){
    var self = this;
    self.db = null;

    // SQLite.openDatabase(Define.constants.dataBase, '1.0', 'SQLite SCTV Database', 200000).then((DB) => {
    //   self.db = DB;
    // }).catch((error) => {
    //   Debug.log(error);
    // });
  }

  getState(){
    return true;
  }

  getDB(){
    var self=this;
    return self.db;
  }
}

const sQLiteManager = new SQLiteManager();
module.exports={sQLiteManager};
