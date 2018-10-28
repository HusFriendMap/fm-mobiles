package com.rcpkg;

import android.util.Log;

import com.friendmap.BuildConfig;

public class FullLog {
    public final static boolean DEBUG = true;
    public final static boolean INFOR = true;
    public final static boolean ERROR = true;
    public final static boolean WARNING = true;
    public final static boolean VERBOSE = true;

    public static void d(String message) {
        if (DEBUG && BuildConfig.DEBUG) {
            String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
            String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
            String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
            int lineNumber = Thread.currentThread().getStackTrace()[3].getLineNumber();

            Log.d(className + "." + methodName + "():" + lineNumber, message);
        }
    }

    public static void i(String message) {
        if (INFOR && BuildConfig.DEBUG) {
            String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
            String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
            String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
            int lineNumber = Thread.currentThread().getStackTrace()[3].getLineNumber();

            Log.i(className + "." + methodName + "():" + lineNumber, message);
        }
    }

    public static void e(String message) {
        if (ERROR && BuildConfig.DEBUG) {
            String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
            String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
            String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
            int lineNumber = Thread.currentThread().getStackTrace()[3].getLineNumber();

            Log.e(className + "." + methodName + "():" + lineNumber, message);
        }
    }

    public static void w(String message) {
        if (WARNING && BuildConfig.DEBUG) {
            String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
            String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
            String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
            int lineNumber = Thread.currentThread().getStackTrace()[3].getLineNumber();

            Log.w(className + "." + methodName + "():" + lineNumber, message);
        }
    }

    public static void v(String message) {
        if (VERBOSE && BuildConfig.DEBUG) {
            String fullClassName = Thread.currentThread().getStackTrace()[3].getClassName();
            String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
            String methodName = Thread.currentThread().getStackTrace()[3].getMethodName();
            int lineNumber = Thread.currentThread().getStackTrace()[3].getLineNumber();

            Log.v(className + "." + methodName + "():" + lineNumber, message);
        }
    }

}
