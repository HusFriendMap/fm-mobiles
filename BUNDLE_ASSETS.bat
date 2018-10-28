
if not exist "BUILD/bundle/map" mkdir "BUILD/bundle/map"
set /P vs=Enter version code:

rmdir "BUILD/bundle/assets" /s /q
mkdir "BUILD/bundle/assets"

for /r assets %%F in (*) do call :Func %%F

call react-native bundle --entry-file src/index.android.js --platform android --dev false  --bundle-output BUILD/bundle/index.android.bundle-%vs% --sourcemap-output BUILD/bundle/map/index.android.map-%vs%

cd BUILD/bundle

del index.android.bundle-%vs%.zip
7z.exe a index.android.bundle-%vs%.zip index.android.bundle-%vs%
7z.exe a index.android.bundle-%vs%.zip assets

goto :eof

:Func
  set _name=%1
  set current_path=%cd%
  rem Change the path to a relative path by replacing the current folder with ""
  set _name=%_name:D:\Code\RNProj\FriendMap\=%

  rem Replace slashes with hyphens
  set _name=%_name:\=_%

  SET _name=%_name:A=a%
  SET _name=%_name:B=b%
  SET _name=%_name:C=c%
  SET _name=%_name:D=d%
  SET _name=%_name:E=e%
  SET _name=%_name:F=f%
  SET _name=%_name:G=g%
  SET _name=%_name:H=h%
  SET _name=%_name:I=i%
  SET _name=%_name:J=j%
  SET _name=%_name:K=k%
  SET _name=%_name:L=l%
  SET _name=%_name:M=m%
  SET _name=%_name:N=n%
  SET _name=%_name:O=o%
  SET _name=%_name:P=p%
  SET _name=%_name:Q=q%
  SET _name=%_name:R=r%
  SET _name=%_name:S=s%
  SET _name=%_name:T=t%
  SET _name=%_name:U=u%
  SET _name=%_name:V=v%
  SET _name=%_name:W=w%
  SET _name=%_name:X=x%
  SET _name=%_name:Y=y%
  SET _name=%_name:Z=z%

  copy "%1" ".\BUILD\bundle\assets\%_name%"
  goto :eof
