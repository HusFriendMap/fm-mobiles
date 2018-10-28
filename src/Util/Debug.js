
// var React = require('react-native');
// var {
//   StyleSheet,
// } = React;

var Define = require('../Define');
var styles ={
  borderColor:'#000',
  // borderColor:'#FFF',
  borderWidth:1,
  borderRadius:4,
  // margin :1,
}
var trackerLog = [];

/**
 * [date2String description]
 * @param  {[type]} date                 [description]
 * @param  {String} [formatString='HH:MM -             Ng�y dd/mm'] [description]
 * @return {[type]}                      [description]
 */
function date2String(date,formatString='HH:MM - Ng�y dd/mm'){
  var stringReturn = 'unknown';
  try{
    stringReturn= formatString.replace(/HH/, '0'.repeat(2-date.getHours().toString().length) +  date.getHours().toString() );
    stringReturn= stringReturn.replace(/MM/,'0'.repeat(2-date.getMinutes().toString().length) +date.getMinutes().toString());
    stringReturn= stringReturn.replace(/SS/,'0'.repeat(2-date.getSeconds().toString().length) +date.getSeconds().toString());

    stringReturn= stringReturn.replace(/yyyy/,'0'.repeat(4-date.getFullYear().toString().length) +date.getFullYear().toString());
    stringReturn= stringReturn.replace(/mm/,'0'.repeat(2-(date.getMonth()+1).toString().length) +(date.getMonth()+1).toString());
    stringReturn= stringReturn.replace(/dd/,'0'.repeat(2-date.getDate().toString().length) +date.getDate().toString());
  }
  catch(ex){}
  return stringReturn;
}

var Debug={
  level:{
    VERBOSE:0,
    DATA:1,
    PROCESS:2,
    MARK:9, // mark for higher level
    DATA_USER_TRACKER:10,
    USER_TRACKER:11,
    WARNING:12,
    DATA_ERROR:13,
    ERROR:14,
  },
  styles:styles,
  trackerLog:trackerLog,
  log:(text,level=2)=> {
    if (Define.constants.debug && (level >= Define.constants.logLevel)) {
      //console.log(text);
    }
    else if (level >= Define.constants.logLevel){
      trackerLog.push(date2String(new Date(),'mm/dd - HH:MM:SS') + ' : ' + /*((typeof(text)==='object')? JSON.stringify(text):*/text /*)*/);
      if (trackerLog.length > Define.constants.debugTrackerLogLength) {
        trackerLog.shift();
      }
    }
  },
  log2:(arg1,arg2,level=2)=> {
    if (Define.constants.debug && (level >= Define.constants.logLevel)) {
      //console.log(arg1,arg2);
    }
    else if (level >= Define.constants.logLevel){
      trackerLog.push(date2String(new Date(),'mm/dd - HH:MM:SS') + ' : ' + /*((typeof(text)==='object')? JSON.stringify(text):*/arg1 + ' ' + arg2 /*)*/);
      if (trackerLog.length > Define.constants.debugTrackerLogLength) {
        trackerLog.shift();
      }
    }
  },
}

module.exports = Debug;
