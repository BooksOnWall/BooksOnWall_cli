#!/bin/bash
if [[ $# -eq 0 ]] ; then
    echo 'Please indicate your project name and api url: ex sh create_bow.sh MyProject https://api.booksonwall.art'
    exit 0
fi

NAME=$1
URL=$2
UENV='URL='$URL
echo 'Creating project:' $NAME
echo 'Api URL:' $URL
echo 'Checking local OS'
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac
echo "System" ${machine}

echo "Looking if a previous ${NAME} project exist ..."
DIR=$NAME
if [ -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo "Previous project ${DIR} exist"

  echo "Backup config files from ${DIR} to data ..."
  cp -r $DIR/.git data/.
  #cp -r $DIR/assets data/assets
  #cp -r $DIR/src data/src
  cp $DIR/README.md data/.
  cp $DIR/.gitignore data/.
  echo "Backup complete"
  cd $DIR
  rm -rf node_modules
  git rm -r * && git commit -m "fresh cleaning from BooksOnWall_cli" && git push
  cd ..
  rm -rf $DIR
  echo 'Previous project destroyed and git cleaned'
fi

echo 'Check dependencies ....'
# to do add more verification version list '
RN=`npm list -g react-native-cli`
RNMATCH='react-native-cli@2.0.1'
RN=${RN:19}
#if [[ -z "$RN" || $RN != $RNMATCH ]]
#if [[ $RN != $RNMATCH ]]
if [[ -z "$RN" ]]
then
  echo $RN
  echo $RNMATCH
	sudo npm install -g react-native-cli@2.0.1
else
	echo 'React-native installed version:' $RN
fi

RV=`npm list -g react-viro-cli`
RV=${RV:19}
RVMATCH='react-viro-cli@2.17.1'

#if [[ -z "$RV" || $RV != $RVMATCH ]]
if [[ -z "$RV" ]]
then
    echo $RV
    echo $RVMATCH
	  sudo npm install -g react-viro-cli@2.17.1
else
	echo 'React-viro installed version:' $RV
fi

react-viro init $NAME

cd $NAME
sh setup-ide.sh android
echo 'CREATING .env'
# put here your VIRO api key , since version 2.17 outsourced free software not mandatory anymore
echo 'VIROAPIKEY="8C94EE83-76E2-4683-ADEF-985A1F266665"' >> .env
# put here your MAPBOX api key https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
echo 'MAPBOX="pk.eyJ1IjoiY3JvbGwiLCJhIjoiY2p4cWVmZDA2MDA0aTNkcnQxdXhldWxwZCJ9.3pr6-2NQQDd59UBRCEeenA"' >> .env
echo $UENV >> .env



echo 'Installing packages'
yarn add prop-types react-dom react-native-app-intro-slider react-navigation react-navigation-transitions react-navigation-tabs react-navigation-stack react-native-reanimated

echo 'Installing unstable lib'
yarn add react-native-screens@~1.0.0-alpha.23 && react-native link react-native-screens
yarn add react-native-gesture-handler@^1.4.0 && react-native link react-native-gesture-handler
yarn add react-native-vector-icons && react-native link
yarn add react-native-splash-screen && react-native link react-native-splash-screen

echo 'Adding internationalization'
yarn add react-native-localize
react-native link react-native-localize
# yarn add react-native-intl react-int intl
# react-native link react-native-intl
yarn add i18n-js

echo 'Adding react-native-make used by setIcon and setSplash'
yarn add -D @bam.tech/react-native-make


echo 'Adding react-native-mapbox-gl'
#yarn add  @react-native-mapbox-gl/maps
yarn add https://github.com/react-native-mapbox-gl/maps#7.0.1
react-native link @react-native-mapbox-gl/maps
yarn add @react-native-community/geolocation
react-native link @react-native-community/geolocation
yarn add react-native-easy-downloader
react-native link react-native-easy-downloader
#RNFB_ANDROID_PERMISSION=true react-native link
echo 'Adding netinfo to check connectivity'
yarn add @react-native-community/netinfo
react-native link @react-native-community/netinfo

echo 'Adding Andoid X compatibility'
# Adding jetifier
yarn add @jumpn/react-native-jetifier -D
echo 'installing android arDebug'
cd android
sh gradelew install:arDebug

echo 'android.useAndroidX=true' >> gradle.properties
echo 'android.enableJetifier=true' >> gradle.properties
cd ../
pwd
echo 'Running jetifier'
yarn react-native-jetifier

echo 'Adding things to package.json'
pwd
SCRIPTS=`jq '.scripts = { link: "react-native link", setIcon: "react-native set-icon --path", setSplash: "react-native set-splash --path", postinstall: "yarn react-native-jetifier", prestart: "./node_modules/react-viro/bin/run_ngrok.sh", start: "node node_modules/react-native/local-cli/cli.js start", android: "react-native run-android --variant=arDebug", ios: "react-native run-ios --variant=arDebug" }' package.json`
touch n.json && echo $SCRIPTS >> n.json
rm package.json && touch package.json
jq . n.json > package.json && rm n.json
SCRIPTS=`jq '.jest = {preset: "react-native", setupFiles: [ "./node_modules/react-native-gesture-handler/jestSetup.js" ] }' package.json `
touch n.json && echo $SCRIPTS >> n.json
rm package.json && touch package.json
jq . n.json > package.json && rm n.json
#jq "./package.json"
# copy files
echo 'Copy src directory'
cp -r ../data/src .
echo 'Copy assets'
cp -r ../data/assets .

echo 'Switch main app.js page'

mv App.js src/Ar.js
mv src/App.js App.js
mv js src/.
cp ../data/README.md .
#comment cp .git if you want to commit in another git repository
cp -r ../data/.git .
cp -r ../data/.gitignore .

# icon & splash
echo 'Setting icon and splash'
react-native set-icon --path assets/icon/bow_adaptive-icon_1024x1024.png
react-native set-splash --path assets/splash/bow_splash-3000x2171-transparent.png --resize center 

# echo 'git add && git commit && git push'
# git add .buckconfig .flowconfig .gitattributes .gitignore .watchmanconfig App.js README.md __tests__/ android/ app.json assets/ babel.config.js bin/ index.android.js index.ios.js index.js ios/ jetificableGroups.json metro.config.js package.json rn-cli.config.js setup-ide.sh src/
# git commit -m "new BooksOnWall_cli build"
# git push

# End of script
echo 'Your mobile application is ready to build'
echo 'Connect your phone to the computer'
echo 'cd' $1
echo 'yarn start && yarn android to build'
