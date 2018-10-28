
class GlobalVariableManager{
  constructor(){
    this.init = this.init.bind(this);
  }
  init(){
    this.reduxManager =require('./ReduxManager').reduxManager;
    this.socketConnection =require('./ConnectionsManager').socketConnection;
    this.sQLiteManager =require('./SQLiteManager').sQLiteManager;
    this.deepLinkManager =require('./DeepLinkManager').deepLinkManager;
  }
}

const globalVariableManager = new GlobalVariableManager();

module.exports={globalVariableManager};
