package com.rcpkg;

import android.app.Activity;

import com.facebook.react.ReactPackage;

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

public class RNIntentPackageWrap {
    private RNIntentPackage _RNIntentPackage;
    private Activity _mainActivity;

    public RNIntentPackageWrap(Activity mainActivity){
        _mainActivity = mainActivity;
    }

    public ReactPackage getReactPackage() {
        if (_RNIntentPackage == null) {
            _RNIntentPackage = new RNIntentPackage();
        }
        return _RNIntentPackage;
    }

}
