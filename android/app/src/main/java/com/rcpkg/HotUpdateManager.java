package com.rcpkg;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.heyu.R;

import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

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

public class HotUpdateManager {
    private static HotUpdateManager _instance;
    private HotUpdateManager(){}
    private Context _context;
    private ReactInstanceManager _reactInstanceManager=null;
    private final String RESOURCES_BUNDLE = "resources.arsc";
    private boolean _state = false;

    public void init(Context context_){
        _context = context_;
    }
    public void initReact( ReactInstanceManager reactInstanceManager){
        _reactInstanceManager = reactInstanceManager;
    }

//    private long _nativeVersionGet =0;
    private long _hybridVersionGet =0;
    private String _hybridVersionNameGet ="";
    private boolean _mandatoryGet =false;
    private String _descriptionGet ="";
    private String _downloadUrlGet ="";

    public long currentHybridVersion=0;

    public static HotUpdateManager getInstance() {
        if (_instance == null){
            _instance = new HotUpdateManager();
        }
        return _instance;
    }
    /** function get bundle file for react-native
     *
     * @return : String : available bundle file path
     */
    public String getPathAvailableBundleFile(){
        String binaryJsBundleUrl = Define.ASSETS_BUNDLE_PREFIX + Define.ASSETS_BUNDLE_FILENAME;
        String avaiableBundlePath = null;
        long hybridVersion = getHybridVersion();
        currentHybridVersion = hybridVersion;
        if (hybridVersion!=0){
            avaiableBundlePath = getPathBundleFile()+"/"+ Long.toString(hybridVersion);
        }
        if (avaiableBundlePath != null) {
            File bundleDownloadFile = new File(avaiableBundlePath);
            if (bundleDownloadFile.exists()) {
                // have download bundle file
                FullLog.d("avaiableBundlePath:" + avaiableBundlePath);
                return avaiableBundlePath;
            }
        }

        FullLog.d("binaryJsBundleUrl:" + binaryJsBundleUrl);
        return binaryJsBundleUrl;
    }

    public String getPathBundleFile(){
        String dir =  _context.getFilesDir().getAbsolutePath();
        String filePath = dir + "/" + Define.ASSETS_BUNDLE_DIR;
        FullLog.d("getPathBundleFile:" + filePath);
        File bunderDir = new File(filePath);
        if (!bunderDir.exists() ) {
            // if file doesnt exists, then create it
            bunderDir.mkdirs();
        }
        return filePath;
    }

    public String getPathResourceFile(){
        String dir =  _context.getFilesDir().getAbsolutePath();
        String filePath = dir + "/" + Define.RESOURCE_BUNDLE_DIR;
        FullLog.d("getPathBundleFile:" + filePath);
        File bunderDir = new File(filePath);
        if (!bunderDir.exists() ) {
            // if file doesnt exists, then create it
            bunderDir.mkdirs();
        }
        return filePath;
    }

    public String getPathBundleTempFile(){
        String dir =  _context.getFilesDir().getAbsolutePath();
        String filePath = dir + "/" + Define.ASSETS_BUNDLE_TEMP_DIR;
        FullLog.d("getPathBundleFile:" + filePath);
        File bunderDir = new File(filePath);
        if (!bunderDir.exists() ) {
            // if file doesnt exists, then create it
            bunderDir.mkdirs();
        }
        return filePath;
    }
    public long getBinaryResourcesModifiedTime() {
        ApplicationInfo ai = null;
        ZipFile applicationFile = null;

//        File applicationAPKFile = null;
        long binaryResourcesModifiedTime = 0;
        try {
            ai = _context.getPackageManager().getApplicationInfo(_context.getPackageName(), 0);
            applicationFile = new ZipFile(ai.sourceDir);
            ZipEntry classesDexEntry = applicationFile.getEntry(RESOURCES_BUNDLE);

//            applicationAPKFile = new File(ai.sourceDir);
//            binaryResourcesModifiedTime = applicationAPKFile.lastModified();
            binaryResourcesModifiedTime = classesDexEntry.getTime();

        } catch ( Exception e) {
            FullLog.e("Error in getting file information " + e.getMessage());
        }
        return binaryResourcesModifiedTime;

    }
    public int getNativeVersion(){
        int verCode = 0;
        try {
            PackageInfo pInfo = _context.getPackageManager().getPackageInfo(_context.getPackageName(), 0);
            verCode = pInfo.versionCode;
        }
        catch(Exception ex){
            FullLog.e(ex.getMessage());
        }
        return verCode;
    }
    public long getHybridVersion(){
        String dir =  getPathBundleFile();
        File bunderDir = new File(dir);
        File bundle[] = bunderDir.listFiles();
        FullLog.d(" bundle dir : " + bundle.length);
        long lastestBundle =0;
        for (int i=0; i < bundle.length; i++)
        {
            FullLog.d("FileName:" + bundle[i].getName());
            long bundleVersion = Long.parseLong(bundle[i].getName());
            if (lastestBundle <=bundleVersion) lastestBundle = bundleVersion;
        }

        // find max
        long binaryResourcesModifiedTime = getBinaryResourcesModifiedTime();
        if(lastestBundle < binaryResourcesModifiedTime){
            lastestBundle = binaryResourcesModifiedTime;
        }
        FullLog.d(" lastestBundle : " + lastestBundle);
        return lastestBundle;
    }
    public long checkUpdate(String url_){
        long ret = 0;
        if (_reactInstanceManager != null) {
            if (_reactInstanceManager.getCurrentReactContext()!= null)
                _reactInstanceManager.getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("HotUpdateManager:checkUpdate",null);
        }

        try {
            URL url = new URL(url_ + "?nativeVersion="+getNativeVersion() +
                                "&hybridVersion=" + getHybridVersion() +
                                "&platform=ANDROID");
            FullLog.d("checkUpdate url: " + url);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

            InputStream in = new BufferedInputStream(urlConnection.getInputStream());

            byte[] contents = new byte[1024];
            int bytesRead=0;
            String strFileContents="";
            while( (bytesRead = in.read(contents)) != -1){
                strFileContents += new String(contents, 0, bytesRead);
            }
            FullLog.d(strFileContents);
            _hybridVersionGet =0;
            _mandatoryGet =false;
            _descriptionGet ="";
            _downloadUrlGet ="";

            try {
                JSONObject obj = new JSONObject(strFileContents);
                FullLog.d(obj.toString());
                // check native version
                JSONObject result = obj.getJSONObject("result");
                JSONObject data = result.getJSONObject("data");
//                _nativeVersionGet = data.getInt("nativeVersion");
                _hybridVersionNameGet = data.getString("hybridVersion");
                _hybridVersionGet = data.getLong("createdAt");
                _mandatoryGet = true;
                _descriptionGet = data.getString("description");
                String updateServerStatic = _context.getResources().getString(R.string.update_server_static);
                _downloadUrlGet = updateServerStatic + "/" + _hybridVersionNameGet ;

                if ((_hybridVersionGet>getHybridVersion())){
                    ret = _hybridVersionGet;
                }
            } catch (Exception ex) {
                FullLog.e( ex.getMessage());
                ex.printStackTrace();
            }

            in.close();
            urlConnection.disconnect();


        }
        catch(Exception ex){
            FullLog.e(ex.getMessage());
            ex.printStackTrace();
        }

        if (_reactInstanceManager != null) {
            if (_reactInstanceManager.getCurrentReactContext()!= null) {
                boolean mandatory = getMandatory();
                String description = getDescription();
                WritableMap map = Arguments.createMap();

                map.putInt("currentNativeVersion", getNativeVersion());
                map.putDouble("currentHybridVersion", getHybridVersion());

//            map.putInt("requireNativeVersion", getRequireNativeVersion());
                map.putDouble("newHybridVersion", getNewHybridVersion());
                map.putString("newHybridVersionUrl", getNewHybridVersionUrl());

                map.putBoolean("mandatory", mandatory );
                map.putString("description", description );

                _reactInstanceManager.getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("HotUpdateManager:checkUpdateDone", map);
            }
        }


        return ret;
    }

    public boolean getMandatory(){
        return _mandatoryGet;
    }

    public String getDescription(){
        return _descriptionGet;
    }

//    public int getRequireNativeVersion(){
//        return _nativeVersionGet;
//    }

    public long getNewHybridVersion(){
        return _hybridVersionGet;
    }

    public String getNewHybridVersionUrl(){
        return _downloadUrlGet;
    }

    public boolean update(){
        boolean ret = false;
        boolean mandatory = getMandatory();
        String description = getDescription();
        double hybridVersion = getHybridVersion();
        double newHybridVersion  = getNewHybridVersion();


        if (_reactInstanceManager != null) {
            if (_reactInstanceManager.getCurrentReactContext()!= null) {
				WritableMap map = Arguments.createMap();

		        map.putInt("currentNativeVersion", getNativeVersion());
                map.putDouble("currentHybridVersion", hybridVersion);

		//            map.putInt("requireNativeVersion", getRequireNativeVersion());
                map.putDouble("newHybridVersion", newHybridVersion);
		        map.putString("newHybridVersionUrl", getNewHybridVersionUrl());

		        map.putBoolean("mandatory", mandatory );
		        map.putString("description", description );
                _reactInstanceManager.getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("HotUpdateManager:download",map);
            }
        }
        try {
            long currentBundleFile = getHybridVersion();

            URL url = new URL(_downloadUrlGet);
            FullLog.d("update url: " + url);

            //
            File bundleTempDownloadFile = new File(getPathBundleTempFile() + "/" + Long.toString(getNewHybridVersion()));
            FullLog.d("bundle temp file to save "+ bundleTempDownloadFile.getAbsolutePath());

            if (!bundleTempDownloadFile.exists()) {
                // if file doesnt exists, then create it
                bundleTempDownloadFile.createNewFile();
            }
            else{
                // delete file
                bundleTempDownloadFile.delete();
                bundleTempDownloadFile.createNewFile();
            }
            OutputStream fop = new BufferedOutputStream(new FileOutputStream(bundleTempDownloadFile));

            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

            InputStream in = new BufferedInputStream(urlConnection.getInputStream());

            byte[] contents = new byte[262144];
            int bytesRead=0;
            long bytesDownload=0;
            long time= System.currentTimeMillis();
            while( (bytesRead = in.read(contents)) != -1){
                fop.write(contents, 0, bytesRead);
                bytesDownload += bytesRead;
                FullLog.d(" download bundleFile : " + bytesRead + " byte");

                if (System.currentTimeMillis() - time > 500) {
                    if (_reactInstanceManager != null) {
                        if (_reactInstanceManager.getCurrentReactContext() != null) {
                            WritableMap map2JS = new WritableNativeMap();
                            map2JS.putDouble("byte", bytesDownload);
                            _reactInstanceManager.getCurrentReactContext()
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("HotUpdateManager:downloading", map2JS);
                        }
                    }

                    time = System.currentTimeMillis();
                }
            }

            if (_reactInstanceManager != null) {
                if (_reactInstanceManager.getCurrentReactContext()!= null)
                    _reactInstanceManager.getCurrentReactContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("HotUpdateManager:downloadDone",null);
            }

            FullLog.d(" download bundleTempFile : done ");
            fop.close();
            in.close();
            urlConnection.disconnect();
            ///////////////////////////////////
            FullLog.d(" unZip bundleTempFile  ");
            // clear old unZip folder
            deleteRecursive(new File(getPathBundleTempFile()+"/"+Define.ASSETS_BUNDLE_TEMP_UNZIP_DIR));

            unZip(bundleTempDownloadFile.getAbsolutePath(),getPathBundleTempFile()+"/"+Define.ASSETS_BUNDLE_TEMP_UNZIP_DIR);
            FullLog.d(" unZip bundleTempFile : done ");

            /////////////////////////////////////////
            FullLog.d(" check unzip folder");

            File unzipDir = new File(getPathBundleTempFile()+"/"+Define.ASSETS_BUNDLE_TEMP_UNZIP_DIR);
            File contentFiles[] = unzipDir.listFiles();

            boolean haveAssets = false;
            boolean haveBundle = false;
            String assetsSubfolderName = "";
            String bundleFileName="";
            for (int i=0; i < contentFiles.length; i++)
            {
                FullLog.d("FileName:" + contentFiles[i].getName());
                if (contentFiles[i].getName().toUpperCase().equals("ASSETS") && contentFiles[i].isDirectory()){
                    assetsSubfolderName = contentFiles[i].getName();
                    haveAssets = true;
                }else if(contentFiles[i].isFile()){
                    String[] separated = contentFiles[i].getName().split("\\.");
                    if (separated.length >0 && separated[0].equals("index")){
                        bundleFileName = contentFiles[i].getName();
                        haveBundle = true;
                    }
                }
            }

            FullLog.d(" check unzip folder done: bundlejs : " + haveBundle + ": assets " + haveAssets);

            if (!haveBundle && !haveAssets){
                _state = true;
                return ret;
            }

            ////////////////////////////////////

            if (haveBundle) {
                FullLog.d(" copy bundleTempFile  ");
                File bundleDownloadFile = new File(getPathBundleFile() + "/" + Long.toString(getNewHybridVersion()));
                File bundleFileToSave = new File(getPathBundleTempFile()+"/"+Define.ASSETS_BUNDLE_TEMP_UNZIP_DIR + "/" + bundleFileName);
                FullLog.d("bundle file to save " + bundleFileToSave.getAbsolutePath());
                copy(bundleFileToSave, bundleDownloadFile);
                FullLog.d(" copy bundleTempFile : done ");
            }

            if (haveAssets) {
                FullLog.d(" copy resource   ");
                File resourceDownloadFile = new File(getPathResourceFile());

                File assetsDir = new File(getPathBundleTempFile()+"/"+Define.ASSETS_BUNDLE_TEMP_UNZIP_DIR + "/" + assetsSubfolderName);

                //make sure source exists
                if(!assetsDir.exists()){
                    System.out.println("Directory does not exist.");
                }else{
                    try{
                        copyFolder(assetsDir,resourceDownloadFile);
                    }catch(IOException e){
                        e.printStackTrace();
                    }
                }

                FullLog.d(" copy resource : done ");
            }
            /////////////////////////////////////////////////
            FullLog.d(" clear old bundleFile ");


            String dir =  getPathBundleFile();
            File bunderDir = new File(dir);
            File bundle[] = bunderDir.listFiles();
            if(bundle.length > 2){
                for (int i=0; i < bundle.length; i++)
                {
                    long bundleVersion = Long.parseLong(bundle[i].getName());
                    if (currentBundleFile > bundleVersion){
                        bundle[i].delete();
                    }
                }
            }


            FullLog.d(" clear old bundleFile : done ");

            FullLog.d(" clear bundleTemp   ");
            File bundleTempDir = new File(getPathBundleTempFile());
            if(bundleTempDir.isDirectory()) {
                File bundleTemp[] = bundleTempDir.listFiles();
                for (int i = 0; i < bundleTemp.length; i++) {
                    bundleTemp[i].delete();
                }
            }
            FullLog.d(" clear bundleTemp  : done ");

        }
        catch(Exception ex){
            FullLog.e(ex.getMessage());
            _state = true;
            return ret;
        }

        if (_reactInstanceManager != null) {
            if (_reactInstanceManager.getCurrentReactContext()!= null) {
                WritableMap map = Arguments.createMap();

                map.putInt("currentNativeVersion", getNativeVersion());
                map.putDouble("currentHybridVersion", hybridVersion);

//            map.putInt("requireNativeVersion", getRequireNativeVersion());
                map.putDouble("newHybridVersion", newHybridVersion);
                map.putString("newHybridVersionUrl", getNewHybridVersionUrl());

                map.putBoolean("mandatory", mandatory );
                map.putString("description", description );
                _reactInstanceManager.getCurrentReactContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("HotUpdateManager:updateDone",map);
            }
        }

        _state = true;

        return ret;
    }

    public boolean getState(){
      return _state;
    }

    public void setState(boolean state){
        this._state = state;
    }

    void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory())
            for (File child : fileOrDirectory.listFiles())
                deleteRecursive(child);

        fileOrDirectory.delete();
    }

    public void copy(File src, File dst) throws IOException {
        InputStream in = new FileInputStream(src);
        OutputStream out = new FileOutputStream(dst);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
    }


    public static void copyFolder(File src, File dest)
            throws IOException{

        if(src.isDirectory()){

            //if directory not exists, create it
            if(!dest.exists()){
                dest.mkdir();
                FullLog.d("Directory copied from "
                        + src + "  to " + dest);
            }

            //list all the directory contents
            String files[] = src.list();

            for (String file : files) {
                //construct the src and dest file structure
                File srcFile = new File(src, file);
                File destFile = new File(dest, file);
                //recursive copy
                copyFolder(srcFile,destFile);
            }

        }else{
            //if file, then copy it
            //Use bytes stream to support all file types
            InputStream in = new FileInputStream(src);
            OutputStream out = new FileOutputStream(dest);

            byte[] buffer = new byte[1024];

            int length;
            //copy the file content in bytes
            while ((length = in.read(buffer)) > 0){
                out.write(buffer, 0, length);
            }

            in.close();
            out.close();
            FullLog.d("File copied from " + src + " to " + dest);
        }
    }

    /**
     * Unzip it
     * @param zipFile input zip file
     * @param outputFolder zip file output folder
     */
    public void unZip(String zipFile, String outputFolder){

        byte[] buffer = new byte[1024];

        try{

            //create output directory is not exists
            File folder = new File(outputFolder);
            if(!folder.exists()){
                folder.mkdir();
            }

            //get the zip file content
            ZipInputStream zis =
                    new ZipInputStream(new FileInputStream(zipFile));
            //get the zipped file list entry
            ZipEntry ze = zis.getNextEntry();

            while(ze!=null){

                String fileName = ze.getName();

                File newFile = new File(outputFolder + File.separator + fileName);

                FullLog.d("file unzip : "+ newFile.getAbsoluteFile());

                if (ze.isDirectory()) {
                    ze = zis.getNextEntry();
                    continue;
                }

                //create all non exists folders
                //else you will hit FileNotFoundException for compressed folder
                new File(newFile.getParent()).mkdirs();

                FileOutputStream fos = new FileOutputStream(newFile);

                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }

                fos.close();
                ze = zis.getNextEntry();
            }

            zis.closeEntry();
            zis.close();

            FullLog.d("Done");

        }catch(IOException ex){
            ex.printStackTrace();
        }
    }
}
