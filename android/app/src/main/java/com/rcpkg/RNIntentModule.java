package com.rcpkg;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;

/**
 * @author phuongtq
 * @file ....java
 * @brief ....java source file.
 * <p>
 * File/module comments.
 * @mobile 01684499886
 * @note No Note at the moment
 * @bug No known bugs.
 * <p>
 * <pre>
 * MODIFICATION HISTORY:
 *
 * Ver   Who  	  Date       Changes
 * ----- --------- ---------- -----------------------------------------------
 * 1.00  phuongtq   3/9/2016 First release
 *
 *
 * </pre>
 */

public class RNIntentModule extends ReactContextBaseJavaModule {
    private ReactContext _reactContext;
    public RNIntentModule(ReactApplicationContext reactContext){
        super(reactContext);
        _reactContext  =reactContext;

    }
    @Override
    public String getName(){
        return "RNIntent";
    }

    @ReactMethod
    public void getIntentExtra(String key, Promise promise){
        try {
            WritableMap map = Arguments.createMap();
            Log.d("RNIntentModule", "getIntentExtra:" + key + ":" + getCurrentActivity().getIntent().getStringExtra(key));
            map.putString(key, getCurrentActivity().getIntent().getStringExtra(key) );
            promise.resolve(map);
        }
        catch(Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void openIntent(ReadableMap options,String type ,Callback callback){

        ReadableMapKeySetIterator iterator= options.keySetIterator();


        Intent intent = new Intent(Intent.ACTION_VIEW);
        try {
            intent.setType(type);
            while (true) {
                if (iterator.hasNextKey()) {
                    String key = iterator.nextKey();
                    Log.d("RNIntentModule", "openIntent: " + key);
                    intent.putExtra(key, options.getString(key));
                } else {
                    break;
                }
            }
            getCurrentActivity().startActivity(intent);
            callback.invoke("OK");
        }
        catch(Exception ex){
            callback.invoke("ERR" + ex);
        }


    }

    @ReactMethod
    public void moveTaskToBack(){
        if (getCurrentActivity() != null)
            getCurrentActivity().moveTaskToBack(true);

    }

    @ReactMethod
    public void exit(){
        Activity activity = getCurrentActivity();
        activity.finish();
        System.exit(0);
    }


}
