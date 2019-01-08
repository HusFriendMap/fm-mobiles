import {
  Platform,
  PermissionsAndroid
} from 'react-native';

const EventEmitter = require('EventEmitter')
const Debug = require('../../Util/Debug')
const Util = require('../../Util/Util')

class LocationManager extends EventEmitter {
  constructor() {
    super()

    // properties
    this.currentLocation = null // {lat, lng, timeUpdated}
    this.watchID = null
    this.retry = 0;
    this.firstTime = true;
    // setup methods
    // this.getCurrentLocation();
  }

  checkAndRequestPermission(){
    return new Promise((resolve,reject)=>{
      if (Platform.OS === 'android') {
        PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then((ret)=>{
          if (ret) {
            return Promise.resolve(true);
          }else{
            return PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Xin hãy cho chúng tôi biết vị trí của bạn',
                'message': 'Để  có thể sử dụng chức năng tìm kiếm xung quanh và các hỗ trợ theo vị trí khác'
              }
            )
          }
        })
        .then((granted)=>{
          if (granted) {
            resolve()
          } else {
            reject();
          }
        })
      }else{
        resolve()
      }
    })
  }

  startWatchingLocation() {
    this.checkAndRequestPermission()
    .then(()=>{
      this.watchID = navigator.geolocation.watchPosition((position) => {
          this.updateLocation(position)
      })
    })
    .catch(() => {})
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      this.checkAndRequestPermission()
      .then(()=>{
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(this.updateLocation(position))
          },
          (err) => {
            reject(err)
          },
          {enableHighAccuracy: Platform.OS !== 'android', timeout: 20000 } //, maximumAge: 30000}
        );
      })
      .catch((err) => {
        reject(err);
      })
    })
  }

  tryGetCurrentPosition(resolve,reject){
    if(Platform.OS === 'android'){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.updateLocation(position))
        },
        (err) => {
          if (this.retry<2) {
            this.retry ++;
            this.tryGetCurrentPosition(resolve,reject)
          }else{
            // console.log(err)
            // console.log(JSON.stringify( err))
            reject(err)
          }
        },
        {enableHighAccuracy: false, timeout: 20000 }//, maximumAge: 30000}
      );
    }else{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.updateLocation(position))
        },
        (err) => {
          if (this.retry<3) {
            this.retry ++;
            this.tryGetCurrentPosition(resolve,reject)
          }else{
            // console.log(err)
            // console.log(JSON.stringify( err))
            reject(err)
          }
        },
        {enableHighAccuracy: false, timeout: 20000 } //, maximumAge: 30000}
      );
    }

  }

  getImmediateLocation() {
    return this.currentLocation
  }

  stopWatchingLocation() {
    if(this.watchID) {
      navigator.geolocation.clearWatch(this.watchID)
    }
    this.currentLocation = null
  }

  updateLocation(position) {
    Debug.log2('Position: ', position)
    this.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timeUpdated: position.timestamp
    }

    return this.currentLocation;
  }
}

const locationManager = new LocationManager()

module.exports= locationManager;
