#!/bin/bash

echo "Enter product flavor (1:dev/2:pro):"
read pf
echo Enter version code:
read vs

if [ $pf -eq 1 ]
then
	pf_str="dev"
  pf_str2="Dev"
fi

if [ $pf -eq 2 ]
then
	pf_str="pro"
  pf_str2="Pro"
fi

echo  $pf_str
echo  $pf_str2

cd android
rm app/build/outputs/apk/app-$(echo $pf_str)-release-unaligned.apk
rm app/build/outputs/apk/app-$(echo $pf_str)-release.apk
rm app/build/outputs/apk/FriendMap.zip
./gradlew assemble$(echo $pf_str2)Release
cd ..
mkdir -p "BUILD/APK_File"

rm BUILD/APK_File/FriendMap-$(echo $pf_str)-$(echo $vs).apk
# cp android/app/build/outputs/apk/app-$(echo $pf_str)-release.apk android/app/build/outputs/apk/FriendMap.zip
# 7z a android/app/build/outputs/apk/FriendMap.zip META-INF/
# zipalign -f -v 4 android/app/build/outputs/apk/FriendMap.zip BUILD/APK_File/FriendMap-$(echo $pf_str)-$(echo $vs).apk
cp android/app/build/outputs/apk/app-$(echo $pf_str)-release.apk BUILD/APK_File/FriendMap-$(echo $pf_str)-$(echo $vs).apk
