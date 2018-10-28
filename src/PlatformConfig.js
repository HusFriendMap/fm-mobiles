
import {Platform, Dimensions} from 'react-native';

var RNFS = require('react-native-fs');
// var widthScreen = Dimensions.get('window').width;
// var heightScreen = Dimensions.get('window').height;

// console.log('RNFS.DocumentDirectoryPath' )
// console.log(RNFS.DocumentDirectoryPath )
// console.log(RNFS.MainBundlePath )

/**
 * [processAssetIos description]
 * @param {[type]}  assets                [description]
 * @param {[type]}  mapAssets             [description]
 * @param {String}  [parentPath='assets'] [description]
 * @param {Boolean} [hasAssetsDir=false]  [description]
 */
function processAssetIos(assets,mapAssets,parentPath='assets', hasAssetsDir = false){
  var retObj={};

  Object.keys(assets).forEach((key)=>{
    var obj1 = assets[key];
    if (typeof obj1 === 'object') {
      retObj[key] = processAssetIos(obj1,mapAssets,parentPath+'/'+key, hasAssetsDir);
    }else{
      const uri = 'file://'+RNFS.DocumentDirectoryPath+'/assets/'+parentPath +'/'+key;
      const obj = {
        uri: uri,
        isStatic: true
      }

      if (mapAssets[key]) {
        retObj[mapAssets[key]] = hasAssetsDir ? obj : assets[key];
      }
      retObj[key] = hasAssetsDir ? obj : assets[key];
    }
  });

  return retObj;
}




/**
 * [processAssetAndroid description]
 * @param {[type]} assets                [description]
 * @param {[type]} mapAssets             [description]
 * @param {Object} [assetsContent={}]    [description]
 * @param {String} [parentPath='assets'] [description]
 */
function processAssetAndroid(assets,mapAssets,assetsContent={},parentPath='assets'){

  var retObj={};

  Object.keys(assets).forEach((key)=>{
    var obj1 = assets[key];
    if (typeof obj1 === 'object') {
      retObj[key] = processAssetAndroid(obj1,mapAssets,assetsContent,parentPath+'_'+key.toLowerCase());
    }else{
      if (mapAssets[key]) {
        if (assetsContent[parentPath+'_'+key.toLowerCase()]) {
          retObj[mapAssets[key]] = {uri:'file://'+assetsContent[parentPath+'_'+key.toLowerCase()].path,isStatic:true};
          retObj[key] = {uri:'file://'+assetsContent[parentPath+'_'+key.toLowerCase()].path,isStatic:true};
        }else{
          retObj[mapAssets[key]] = {uri:parentPath+'_'+key.toLowerCase(),isStatic:true};
          retObj[key] = {uri:parentPath+'_'+key.toLowerCase(),isStatic:true};
        }
      }else{
        if (assetsContent[parentPath+'_'+key.toLowerCase()]) {
          retObj[key] = {uri:'file://'+assetsContent[parentPath+'_'+key.toLowerCase()].path,isStatic:true};
        }else{
          retObj[key] = {uri:parentPath+'_'+key.toLowerCase(),isStatic:true};
        }

      }
    }
  });
  return retObj;
}

const PlatformConfig = {
  ...Platform.select({
    ios:{
      navBarHeight: 44,
      font: 'Roboto-Regular',
      fontBold: 'Roboto-Bold',
      hybridVersion:'0.0.1',
      processAsset:processAssetIos,
    },
    android:{
      navBarHeight: 45,
      font: 'roboto-regular',
      fontBold: 'roboto-bold',
      hybridVersion:'0.0.1',
      processAsset:processAssetAndroid,
    }
  }),
}

export default PlatformConfig;
