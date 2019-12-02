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


echo 'Check dependencies ....# to do add more verification version list '
#yarn info react-native-cli
#npm install -g react-native-cli
#yarn info react-viro-cli
#npm install -g react-viro-cli
react-viro init $NAME --verbose
cd $NAME
sh setup-ide.sh android
echo 'CREATING .env'
# put here your VIRO api key , since version 2.17 outsourced free software not mandatory anymore
echo 'VIROAPIKEY="8C94EE83-76E2-4683-ADEF-985A1F266665"' >> .env
# put here your MAPBOX api key https://docs.mapbox.com/help/how-mapbox-works/access-tokens/
echo 'MAPBOX="pk.eyJ1IjoiY3JvbGwiLCJhIjoiY2p4cWVmZDA2MDA0aTNkcnQxdXhldWxwZCJ9.3pr6-2NQQDd59UBRCEeenA"' >> .env
echo $UENV >> .env

echo 'installing android arDebug'
android/gradelew install:arDebug

echo 'Installing packages'
yarn add prop-types react-dom react-native-app-intro-slider react-navigation react-navigation-transitions react-navigation-tabs react-navigation-stack react-native-reanimated react-native-screens

echo 'Installing unstable lib'
yarn add react-native-gesture-handler@~1.4.0 && react-native link react-native-gesture-handler
yarn add react-native-vector-icons && react-native link
yarn add react-native-splash-screen && react-native link react-native-splash-screen

echo 'Adding internationalization'
yarn add react-native-localize
yarn add i18n-js
react-native link

echo 'Adding react-native-make'
yarn add -D @bam.tech/react-native-make

echo 'Adding things to package.json'

#jq "./package.json"
echo 'Adding react-native-mapbox-gl'
yarn add  @react-native-mapbox-gl/maps

echo 'Adding Andoid X compatibility'
# Adding jetifier
yarn add @jumpn/react-native-jetifier -D
echo 'android.useAndroidX=true' >> android/gradle.properties
echo 'android.enableJetifier=true' >> android/gradle.properties
SCRIPTS=`jq '.scripts = { postinstall: "yarn react-native-jetifier", prestart: "./node_modules/react-viro/bin/run_ngrok.sh", start: "node node_modules/react-native/local-cli/cli.js start", android: "react-native run-android --variant=arDebug", ios: "react-native run-ios --variant=arDebug" }' package.json`
touch n.json && echo $SCRIPTS > n.json
rm package.json && touch package.json
jq . n.json > package.json && rm n.json
echo 'Running jetifier'
yarn react-native-jetifier

# copy files
echo 'Copy src directory'
cp -r ../data/src .
echo 'Copy assets'
cp -r ../data/assets .

echo 'Switch main app.js page'

mv App.js src/Ar.js
mv src/App.js App.js
mv js src/.

# icon & splash
echo 'Setting icon and splash'
react-native set-icon --path assets/icon.png
react-native set-splash --path assets/splash.png
# ENd of script
echo 'Your mobile application is ready to build'
echo 'Connect your phone to the computer'
echo 'cd ' $1
echo 'yarn start && yarn android to build'
