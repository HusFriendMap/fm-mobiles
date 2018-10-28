
// var React = require('react-native');
// var {
//   StyleSheet,
// } = React;

var _ = require('lodash');

var Util = {
  debug:{
    log:()=>{},
    level:{},
  },
  enableDebug:function(){
    this.debug = require('./Debug');
  },

  timeToHours: function(time) {
    const dateInstance = new Date(time);
    let hours = dateInstance.getHours();
    if(hours < 10) {
      hours = '0' + hours;
    }

    let minutes = dateInstance.getMinutes();
    if(minutes < 10) {
      minutes = '0' + minutes;
    }

    return hours + ":" + minutes;
  },
  sctvTime: function(date) { // Date Object from 00:00:00 of a date
    const current = Date.now();
    const time = date.getTime(); // miliseconds

    let prefix = '';
    const delta = current - time;
    if( delta >= 0 && delta <= 86400000) {
      prefix = 'Hôm nay ';
    } else if ( delta < 0 && delta >= -86400000) {
      prefix = 'Ngày mai ';
    } else if ( delta > 86400000 && delta <= 2*86400000) {
      prefix = 'Hôm qua ';
    } else {
      prefix = 'Ngày ';
    }

    let dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    return {
      prefix,
      dateString
    }
  },
  formatDateFromNow : function(timeIn)
  {
      var time = timeIn;
      switch (typeof time)
      {
          case 'number':
          {
              break;
          }
          case 'string':
          {
              time = +new Date(time);
              break;
          }
          case 'object':
          {
              if (time.constructor === Date)
              {
                  time = time.getTime();
              }
              break;
          }
          default:
          {
              time = +new Date();
          }
      }

      var timeNow = new Date();
      var time_formats =
      [
          [60, 'giây', 1], // 60
          [120, '1 phút trước', '1 phút nữa'], // 60*2
          [3600, 'phút', 60], // 60*60, 60
          [7200, '1 giờ trước', '1 giờ nữa'], // 60*60*2
          [86400, 'giờ', 3600], // 60*60*24, 60*60
          [604800, 'ngày', 86400], // 60*60*24*7, 60*60*24
          [1209600, 'Tuần trước', 'tuần nữa'], // 60*60*24*7*4*2
          [2419200, 'tuần', 604800], // 60*60*24*7*4, 60*60*24*7
          [4838400, 'Tháng trước', 'tháng nữa'], // 60*60*24*7*4*2
          [29030400, 'tháng', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
          [58060800, 'Năm ngoái', 'năm nữa'], // 60*60*24*7*4*12*2
          [2903040000, 'năm', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
          [5806080000, 'Thế kỷ trước', 'thế kỷ nữa'], // 60*60*24*7*4*12*100*2
          [58060800000, 'Thế kỷ', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];

      var seconds     = (+new Date() - time) / 1000;
      var token       = 'trước';
      var list_choice = 1;

      if (seconds < 60)
      {
          return 'Vừa xong'
      }

      if (seconds < 0)
      {
          seconds     = Math.abs(seconds);
          token       = 'nữa';
          list_choice = 2;
      }

      var i = 0;
      var format;

      while (format = time_formats[i++])
      {
          if (seconds < format[0])
          {
              if (typeof format[2] == 'string')
              {
                  return format[list_choice];
              }
              else
              {
                  return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
              }
          }
      }
      return time;
  },

  timeAgoTranslate:function(timeAgo) {

    let newTimeAgo = timeAgo;

    if(timeAgo.indexOf('a minute ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'a minute ago', '1 phút trước')
    }

    if(timeAgo.indexOf('an hour ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'an hour ago', '1 giờ trước')
    }

    if(timeAgo.indexOf('a few seconds ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'a few seconds ago', 'Vừa xong')
    }

    if(timeAgo.indexOf('a day ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'a day ago', '1 ngày trước')
    }

    if(timeAgo.indexOf('days ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'days ago', 'ngày trước')
    }

    if(timeAgo.indexOf('minutes ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'minutes ago', 'phút trước')
    }

    if(timeAgo.indexOf('hours ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'hours ago', 'giờ trước')
    }

    if(timeAgo.indexOf('a month ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'a month ago', '1 tháng trước')
    }

    if(timeAgo.indexOf('months ago') >= 0) {
        newTimeAgo =  _.replace(timeAgo, 'months ago', 'tháng trước')
    }
    return newTimeAgo;
  },

  second2String:function(second){
    var stringReturn = '';
    var timeDu = Math.floor( second/60/60);
    if (timeDu>0) {
      stringReturn+=timeDu.toString();
      stringReturn+=':';
    }
    timeDu = Math.floor(second%(60*60)/60);

    stringReturn+=timeDu.toString();
    stringReturn+=':';

    timeDu = (second%60);

    stringReturn+='0'.repeat(2-timeDu.toString().length) + timeDu.toString();

    return stringReturn;
  },

  stringDate2Date:function(stringDate,format='HH:MM:SS-yyyy-mm-dd'){
    var date= new Date();
    if (!stringDate) {
      return date;
    }
    var indexHours= format.indexOf('HH');
    var indexMinutes= format.indexOf('MM');
    var indexSecond= format.indexOf('SS');
    var indexYear= format.indexOf('yyyy');
    var indexMonth= format.indexOf('mm');
    var indexDay= format.indexOf('dd');


    var temp = parseInt(stringDate.slice(indexYear,indexYear+4));
    if (indexYear>=0 && !isNaN(temp)) {date.setYear(temp);}
    temp = parseInt(parseInt(stringDate.slice(indexMonth,indexMonth+2))-1);
    if (indexMonth>=0 && !isNaN(temp)) {date.setMonth(temp);}
    temp = parseInt(stringDate.slice(indexDay,indexDay+2));
    if (indexDay>=0 && !isNaN(temp)) {date.setDate(temp);}

    temp = parseInt(stringDate.slice(indexHours,indexHours+2));
    if (indexHours>=0 && !isNaN(temp)) {date.setHours(temp);}
    temp = parseInt(stringDate.slice(indexMinutes,indexMinutes+2));
    if (indexMinutes>=0 && !isNaN(temp)) {date.setMinutes(temp);}
    temp = parseInt(stringDate.slice(indexSecond,indexSecond+2));
    if (indexSecond>=0 && !isNaN(temp)) {date.setSeconds(temp);}

    return date;
  },


  date2String:function(date,formatString='HH:MM - Ngày dd/mm'){
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
  },

  formatNumber:function(number,c, d, t){
    var n = number,
    c = isNaN(c = Math.abs(c)) ? 0 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 },

 //
 formatObject:function(org,format={}){
   if (org === null || org === undefined ) {
     return format;
   }
   Object.keys(format).forEach((key)=>{
     if ( !org.hasOwnProperty(key)) {
       org[key] = format[key];
     }
     else if((org[key] === undefined || org[key] === null) && (format[key] !== undefined)){
       org[key] = format[key];
     }
   })
   return org;

 },

 dataProtectAndMap:function(orgIn,format={},map={}){
   let org=orgIn;
   if ( Array.isArray(format) && !Array.isArray(org)) {
     this.debug.log('1 : WRONG TYPE',this.debug.level.WARN)
     org = [];
   }else if (typeof(format) === 'object'  &&  typeof(org) !== 'object') {
     this.debug.log('2 : WRONG TYPE',this.debug.level.WARN)
      org = {};
   }
   else{
    if (org === null || org === undefined) {
      return format;
    }
   }


   Object.keys(format).forEach((key)=>{

     if ((!org.hasOwnProperty(key) || ( (format[key] !== undefined) && (typeof(org[key]) !== typeof(format[key])) )) && (typeof(format[key]) !== 'object') ) {
       this.debug.log('3 : WRONG TYPE ' + key,this.debug.level.WARN)
       if (map[key]) {
         org[map[key]] = Array.isArray(format[key]) ? [] : format[key];
       }
       else{
         org[key] = Array.isArray(format[key]) ? [] : format[key];
       }
     }
     else if((org[key] === undefined || org[key] === null) && (format[key] !== undefined) && (typeof(format[key]) !== 'object') ){
       this.debug.log('4 : VALUE UNDEFINED '+ key,this.debug.level.WARN)
       if (map[key]) {
         org[map[key]] = Array.isArray(format[key]) ? [] : format[key];
       }
       else{
         org[key] = Array.isArray(format[key]) ? [] : format[key];
       }
     }
     else{
       var temp;
       if(Array.isArray(format[key]) && (format[key].length===0)  ){
         if ((org[key]===undefined) || (!Array.isArray(org[key])) ){
           this.debug.log('5 : WRONG TYPE ' + key,this.debug.level.WARN)
           temp =[];
         }else {
           temp = org[key];
         }
       }
       else if(Array.isArray(format[key]) && (format[key].length>0)  ){
         temp = [];
         if (!org[key] || (!Array.isArray(org[key]))) {
           this.debug.log('7 : WRONG TYPE OR UNDEFINED '+key,this.debug.level.WARN)
           org[key]=[];
           if (typeof(format[key][0]) === 'object') {
             temp = [this.dataProtectAndMap(undefined,format[key][0],map)]
           }

         }else{
           org[key].forEach((current)=>{
             if (typeof(format[key][0]) === 'object') {
               temp.push(this.dataProtectAndMap(current,format[key][0],map));
             }else{
               if ((format[key][0] !== undefined) && (typeof(current) !== typeof(format[key][0]))) {
                 temp.push(format[key][0]);
               }else{
                 temp.push(current);
               }
             }
           })
         }

       }
       else if ((typeof(format[key]) === 'object') && (!Array.isArray(format[key])) ) {
         temp = this.dataProtectAndMap(org[key],format[key],map);
       }
       else{
         temp = org[key];
       }

       if (map[key]) {
         org[map[key]] = temp;
         org[key] = undefined;
       }
       else{
         org[key] = temp;
       }

     }
   })
   return org;
 },
 // dataProtectAndMap:function(org,format={},map={}){
 //   var dataRet = {};
 //   if (org === null || org === undefined) {
 //     if (typeof(format) === 'object') {
 //        org = new Object();
 //     }
 //     else{
 //      return format;
 //     }
 //   }
 //   Object.keys(format).forEach((key)=>{
 //
 //     if (!org.hasOwnProperty(key) || ((format[key] !== undefined) && (typeof(org[key]) !== typeof(format[key])))) {
 //       if (map[key]) {
 //         dataRet[map[key]] = Array.isArray(format[key]) ? [] : format[key];
 //       }
 //       else{
 //         dataRet[key] = Array.isArray(format[key]) ? [] : format[key];
 //       }
 //     }
 //     else if((org[key] === undefined || org[key] === null) && (format[key] !== undefined)){
 //       if (map[key]) {
 //         dataRet[map[key]] = Array.isArray(format[key]) ? [] : format[key];
 //       }
 //       else{
 //         dataRet[key] = Array.isArray(format[key]) ? [] : format[key];
 //       }
 //     }
 //     else{
 //       var temp ;
 //
 //       if(Array.isArray(format[key]) && (format[key].length>0) && (typeof(format[key][0]) === 'object') ){
 //         temp = [];
 //         org[key].forEach((current)=>{
 //           temp.push(this.dataProtectAndMap(current,format[key][0]));
 //         })
 //       }
 //       else if ((typeof(format[key]) === 'object') && (!Array.isArray(format[key])) ) {
 //         temp = this.dataProtectAndMap(org[key],format[key]);
 //       }
 //       else{
 //         temp = org[key];
 //       }
 //
 //       if (map[key]) {
 //         dataRet[map[key]] = temp;
 //       }
 //       else{
 //         dataRet[key] = temp;
 //       }
 //
 //     }
 //   })
 //   return dataRet;
 // }
  change_alias:function( alias )
  {
      var str = alias;
      str= str.toLowerCase();
      str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
      str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
      str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
      str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
      str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
      str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
      str= str.replace(/đ/g,"d");
      str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"");
      /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
      // str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
      // str= str.replace(/^\-+|\-+$/g,"");
      //cắt bỏ ký tự - ở đầu và cuối chuỗi
      return str;
  },
  searchText:function(text2Search,str){
    let text2SearchArray = text2Search.split(',')
    let strTemp = this.change_alias(str)
    return text2SearchArray.some((current)=>{
      let text2SearchTemp = this.change_alias(current);
      if (!text2SearchTemp || text2SearchTemp === '') {
        return false;
      }
      return (strTemp.search(text2SearchTemp) > -1)
    })
  },
  searchTextQuick:function(text2Search,str){
    let text2SearchArray = text2Search.split(',')
    // let strTemp = this.change_alias(str)
    return text2SearchArray.some((current)=>{
      let text2SearchTemp = this.change_alias(current);
      if (!text2SearchTemp || text2SearchTemp === '') {
        return false;
      }
      return (str.search(text2SearchTemp) > -1)
    })
  },
  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371.008; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  },

  getRandomInt:function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },

  // for track log location

  printAndroidLogs:function(logEntries) {
    var COLORS = Object();
    COLORS['ERROR'] = 'background:white;color:red';
    COLORS['WARN'] = 'background:black;color:yellow';
    COLORS['INFO'] = 'background:white;color:blue';
    COLORS['TRACE'] = 'background:white;color:black';
    COLORS['DEBUG'] = 'background:white;color:black';

    var logFormatter = function(logEntry) {
      var d = new Date(logEntry.timestamp);
      var dateStr = [d.getFullYear(), padLeft(d.getMonth()+1,2), padLeft(d.getDate(),2)].join('/');
      var timeStr = [padLeft(d.getHours(),2), padLeft(d.getMinutes(),2), padLeft(d.getSeconds(),2)].join(':');
      return ['%c[', dateStr, ' ', timeStr, '] %c', logEntry.logger, ':', logEntry.message].join('');
    }

    return printLogs(logEntries, logFormatter, COLORS);
  },

  printIosLogs:function(logEntries) {
    var COLORS = Array();
    COLORS[1] = 'background:white;color:red';
    COLORS[2] = 'background:black;color:yellow';
    COLORS[4] = 'background:white;color:blue';
    COLORS[8] = 'background:white;color:black';
    COLORS[16] = 'background:white;color:black';

    var logFormatter = function(logEntry) {
      var d = new Date(logEntry.timestamp * 1000);
      var dateStr = [d.getFullYear(), padLeft(d.getMonth()+1,2), padLeft(d.getDate(),2)].join('/');
      var timeStr = [padLeft(d.getHours(),2), padLeft(d.getMinutes(),2), padLeft(d.getSeconds(),2)].join(':');
      return ['%c[', dateStr, ' ', timeStr, '] %c', logEntry.logger, ':', logEntry.message].join('');
    }

    return printLogs(logEntries, logFormatter, COLORS);
  }

}

function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

function printLogs(logEntries, logFormatter, COLORS, MAX_LINES) {
  MAX_LINES = MAX_LINES || 100; // maximum lines to print per batch
  var batch = Math.ceil(logEntries.length / MAX_LINES);
  var logLines = Array(MAX_LINES); //preallocate memory prevents GC
  var logLinesColor = Array(MAX_LINES * 2);

  for (var i = 0; i < batch; i++) {
    var it = 0;
    var logEntriesPart = logEntries.slice((i * MAX_LINES), (i + 1) * MAX_LINES);
    for (var j = 0; j < logEntriesPart.length; j++) {
      var logEntry = logEntriesPart[j];
      logLines[j] = logFormatter(logEntry);
      logLinesColor[it++] = ('background:white;color:black');
      logLinesColor[it++] = (COLORS[logEntry.level]);
    }
    if (logEntriesPart.length < MAX_LINES) {
      console.log.apply(console, [logLines.slice(0,logEntriesPart.length).join('\n')]
        .concat(logLinesColor.slice(0,logEntriesPart.length*2)));
    } else {
      console.log.apply(console, [logLines.join('\n')].concat(logLinesColor));
    }
  }

}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
module.exports = Util;
