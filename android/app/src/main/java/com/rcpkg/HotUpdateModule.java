package com.rcpkg;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * @author phuongtq
 * @file ....java
 * @brief ....java source file.
 * <p/>
 * File/module comments.
 * @mobile 01684499886
 * @note No Note at the moment
 * @bug No known bugs.
 * <p/>
 * <pre>
 * MODIFICATION HISTORY:
 *
 * Ver   Who  	  Date       Changes
 * ----- --------- ---------- -----------------------------------------------
 * 1.00  phuongtq   3/23/2016 First release
 *
 *
 * </pre>
 */

public class HotUpdateModule extends ReactContextBaseJavaModule {
    private ReactContext _reactContext;
    public HotUpdateModule(ReactApplicationContext reactContext){
        super(reactContext);

        _reactContext  =reactContext;
    }
    @Override
    public String getName(){
        return "RNHotUpdate";
    }

    @ReactMethod
    public void checkUpdate(String url_, Promise promise_){
        try {
            HotUpdateManager.getInstance().checkUpdate(url_);
            boolean mandatory = HotUpdateManager.getInstance().getMandatory();
            String description = HotUpdateManager.getInstance().getDescription();
            WritableMap map = Arguments.createMap();

            map.putInt("currentNativeVersion", HotUpdateManager.getInstance().getNativeVersion());
            map.putDouble("currentHybridVersion", HotUpdateManager.getInstance().getHybridVersion());

//            map.putInt("requireNativeVersion", HotUpdateManager.getInstance().getRequireNativeVersion());
            map.putDouble("newHybridVersion", HotUpdateManager.getInstance().getNewHybridVersion());
            map.putString("newHybridVersionUrl", HotUpdateManager.getInstance().getNewHybridVersionUrl());

            map.putBoolean("mandatory", mandatory );
            map.putString("description", description );

            promise_.resolve(map);
        }
        catch(Exception e){
            promise_.reject(e);
        }
    }

    @ReactMethod
    public void getVersion( Promise promise_){
        try {

            WritableMap map = Arguments.createMap();

            map.putInt("currentNativeVersion", HotUpdateManager.getInstance().getNativeVersion());
            map.putDouble("currentHybridVersion", HotUpdateManager.getInstance().getHybridVersion());


            promise_.resolve(map);
        }
        catch(Exception e){
            promise_.reject(e);
        }
    }

    @ReactMethod
    public void getCheckUpdateInfo( Promise promise_){
      try {
          FullLog.d("getCheckUpdateInfo");
        // if (HotUpdateManager.getInstance().getState()) {
          boolean mandatory = HotUpdateManager.getInstance().getMandatory();
          String description = HotUpdateManager.getInstance().getDescription();
          WritableMap map = Arguments.createMap();

          map.putInt("currentNativeVersion", HotUpdateManager.getInstance().getNativeVersion());
          map.putDouble("currentHybridVersion", HotUpdateManager.getInstance().currentHybridVersion);

//            map.putInt("requireNativeVersion", HotUpdateManager.getInstance().getRequireNativeVersion());
          map.putDouble("newHybridVersion", HotUpdateManager.getInstance().getNewHybridVersion());
          map.putString("newHybridVersionUrl", HotUpdateManager.getInstance().getNewHybridVersionUrl());

          map.putBoolean("mandatory", mandatory );
          map.putString("description", description );

          if(HotUpdateManager.getInstance().getState()){
              promise_.resolve(map);
          }
         else{
           promise_.reject("WAIT_FOR_EVENT");
         }
      }
      catch(Exception e){
          promise_.reject(e);
      }
    }

    @ReactMethod
    public void update( Promise promise_){
        try {

            HotUpdateManager.getInstance().update();

            WritableMap map = Arguments.createMap();
//            map.putInt("currentNativeVersion", HotUpdateManager.getInstance().getNativeVersion());
//            map.putInt("currentHybridVersion", HotUpdateManager.getInstance().getHybridVersion());


            promise_.resolve(map);
        }
        catch(Exception e){
            promise_.reject(e);
        }
    }

}
