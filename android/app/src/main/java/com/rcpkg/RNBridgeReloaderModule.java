package com.rcpkg;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
 * 1.00  phuongtq   3/10/2016 First release
 *
 *
 * </pre>
 */

public class RNBridgeReloaderModule extends ReactContextBaseJavaModule {
    private ReactContext _reactContext;
    public RNBridgeReloaderModule(ReactApplicationContext reactContext){
        super(reactContext);
        _reactContext  =reactContext;
    }
    @Override
    public String getName(){
        return "BridgeReloader";
    }

    @ReactMethod
    public void reload(){
        Activity activity = getCurrentActivity();
        Intent intent = activity.getIntent();
        activity.finish();
        activity.startActivity(intent);
    }

}
