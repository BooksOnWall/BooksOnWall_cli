# Generate Books-on-wall mobile application framework

## Dependencies
[npm](https://www.npmjs.com/get-npm)

[yarn](https://yarnpkg.com/en/docs/install#debian-stable)

[react-native-cli](https://github.com/react-native-community/cli)

[react-vivo-cli](https://docs.viromedia.com/docs)

[rninit](https://github.com/jacobbubu/rninit)

[jq](https://stedolan.github.io/jq/)

## Set your nodejs environement 


nodejs v13.x reject 3 libs from installing and react-native link of the modules, therefore we need v12.x to compile correctly 


#### Determining your Node version
First off, let's figure out which version of Node is currently installed.

`node -v`

The version number displayed is the one that's currently active on your machine. Now, let's install a program called n that will let us easily switch between Node versions.

`sudo npm i -g n`

##### Upgrading to the latest stable version
Once n is installed, this simple command will update you to the latest stable version of Node.

`sudo n stable`
```
[tom@tom-desk build]$ sudo n stable 
   installed : v12.14.1 (with npm 6.13.4)

```
## Set your Android Environnement

For Android, make sure you have downloaded and installed Android Studio from here to get required SDK and platform-tools for building android apps Make sure you have the required environment variables set - $ANDROID_HOME, and added platform-tools to $PATH variable. If not,
```
export ANDROID_HOME=/YOUR_PATH_TO/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH
```
Once your application installed and builded, launch android app by executing the following from the root of the project
```
react-native run-android --variant=gvrDebug
```
More info in this other project : 
[BooksOnWall](https://git.pulsar113.org/BooksOnWall/BooksOnWall)

For iOS, in Xcode open ViroSample.xcworkspace in ios/ directory. Select the right "Team" for yout app and the app name target under General -> Signing Hit play to build and launch the app on your iOS device

## gradle install for android
multiple installation options :
[Documentation](https://gradle.org/install/)
we canot go to the ultimate 6.0.1 version , intended for android X , multiple react-native package are not ready for it , commencing by react-viro that impose react-native 59.9 ultimate step before the 60.x version that is mandatory for Android X
We are targeting gradle version 5.4.1

### Install with package manager

```
Installing with a package manager
SDKMAN! is a tool for managing parallel versions of multiple Software Development Kits on most Unix-based systems.

$ sdk install gradle 5.4.1

Homebrew is “the missing package manager for macOS”.

$ brew install gradle


Other package managers are available, but the version of Gradle distributed by them is not controlled by Gradle, Inc. Linux package managers may distribute a modified version of Gradle that is incompatible or incomplete when compared to the official version (available from SDKMAN! or below).
```
### Install with gradlewrapper
```
Upgrade with the Gradle Wrapper
If your existing Gradle-based build uses the Gradle Wrapper, you can easily upgrade by running the wrapper task, specifying the desired Gradle version:
cd android
$ ./gradlew wrapper --gradle-version=5.4.1 --distribution-type=bin
Note that it is not necessary for Gradle to be installed to use the Gradle wrapper. The next invocation of gradlew or gradlew.bat will download and cache the specified version of Gradle.

$ ./gradlew tasks
Downloading https://services.gradle.org/distributions/gradle-5.4.1-bin.zip

```

## Install


This script take 3 parameters :

The first is init

The second is the name of the mobile application

The third the URL of the server side api

let's say you want to create an app with BooksOnWall as a name

and https://api.booksonwall.art as an api url

```
$ git clone git@git.pulsar113.org:BooksOnWall/BooksOnWall_cli.git
$ cd BooksOnWall_cli
$ chmod +x react-bow
$ ./react-bow init  BooksOnWall https://api.booksonwall.art

```
This will create a directory and application android and ios named BooksOnWall using the api https://api.booksonwall.art

For **Troubleshootings** please see [that page](../../wiki/Troubleshootings) 
or contact us via github or telegram on the chan BooksOnWall DEV

As this project is intended to assemble and prepare a dedicated git managed project 
you should [read this page](../../wiki/Merge+BooksOnWall) for merging purpose