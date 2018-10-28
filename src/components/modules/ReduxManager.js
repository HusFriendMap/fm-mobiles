//LIB


//components

//variable

//

class ReduxManager{
  // constructor(){
  // }

  setDispatchAndState(dispatch,state){
    var self = this;
    self.dispatch=dispatch;
    self.state=state;
  }
  setState(state){
    var self = this;
    self.state=state;
  }
}
const reduxManager = new ReduxManager();
module.exports={reduxManager};
