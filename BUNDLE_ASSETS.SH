#!/bin/bash

mkdir -p "BUILD/bundle/map"
echo "Enter version code:"
read vs

rm -rf "BUILD/bundle/assets"
mkdir -p "BUILD/bundle/assets"

folder='assets';
for i in `find $folder -name '*'`;
  do if [[ -f $i ]]; then
    y=${i,,}
    a="${y////_}"
    cp "$(echo $i)" "./BUILD/bundle/assets/$(echo $a)"
fi; done

react-native bundle --entry-file src/index.android.js --platform android --dev false  --bundle-output BUILD/bundle/index.android.bundle-$(echo $vs) --sourcemap-output BUILD/bundle/map/index.android.map-$(echo $vs)

cd BUILD/bundle

rm index.android.bundle-$(echo $vs).zip
7z a "index.android.bundle-$(echo $vs).zip" "index.android.bundle-$(echo $vs)"
7z a "index.android.bundle-$(echo $vs).zip" assets
