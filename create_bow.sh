#!/bin/bash
if [[ $# -eq 0 ]] ; then
    echo 'Please indicate your project name: ex sh create_bow.sh MyProject'
    exit 0
fi

NAME=$1
echo 'Creating project:' $NAME
echo 'Check dependencies ....# to do add more verification version list '
#yarn info react-native-cli
#npm install -g react-native-cli
#yarn info react-viro-cli
#npm install -g react-viro-cli
react-viro init $NAME --verbose
cd $NAME
sh setup-ide.sh android
echo 'CREATING .env'
echo 'VIROAPIKEY="8C94EE83-76E2-4683-ADEF-985A1F266665"' >> .env
echo 'MAPBOX="pk.eyJ1IjoiY3JvbGwiLCJhIjoiY2p4cWVmZDA2MDA0aTNkcnQxdXhldWxwZCJ9.3pr6-2NQQDd59UBRCEeenA"' >> .env

echo 'installing android arDebug'
cd android
./gradelew install:arDebug

echo 'Installing packages'
yarn add prop-types react-dom react-native-app-intro-slider react-navigation react-navigation-stack react-native-reanimated react-native-screens 
echo 'Installing unstable lib'
yarn add react-native-gesture-handler@~1.4.0 && react-native link react-native-gesture-handler 
yarn add react-native-vector-icons && react-native link react-native-vector-icon
yarn add react-native-splash-screen && react-native link react-native-splash-screen 

echo 'Adding react-native-make'
yarn add -D @bam.tech/react-native-make

echo 'Adding things to package.json'

#jq "./package.json"
echo 'Adding react-native-mapbox-gl'
yarn add  @react-native-mapbox-gl/maps


