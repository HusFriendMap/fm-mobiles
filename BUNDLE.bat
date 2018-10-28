if not exist "BUILD/bundle/map" mkdir "BUILD/bundle/map"
set /P vs=Enter version code:
call react-native bundle --entry-file src/index.android.js --platform android --dev false --minify true --bundle-output BUILD/bundle/index.android.bundle-%vs% --sourcemap-output BUILD/bundle/map/index.android.map-%vs%

cd BUILD/bundle
del index.android.bundle-%vs%.zip
7z.exe a index.android.bundle-%vs%.zip index.android.bundle-%vs%
