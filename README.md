# Generate Books-on-wall mobile application framework 

## Dependencies
[npm](https://www.npmjs.com/get-npm) 

[yarn](https://yarnpkg.com/en/docs/install#debian-stable) 

[react-native-cli](https://github.com/react-native-community/cli)

[react-vivo-cli](https://docs.viromedia.com/docs)

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


This script take 2 parameters :

The first is the name of the mobile application 

The Second the URL of the server side api 

let's say you want to create an app with BooksOnWall as a name 

and https://api.booksonwall.art as an api url

```
$ git clone git@git.pulsar113.org:BooksOnWall/BooksOnWall_cli.git
$ cd BooksOnWall_cli
$ sh create_bow.sh BooksOnWall https://api.booksonwall.art

```
This will create a directory and application android and ios named BooksOnWall using the api https://api.booksonwall.art
