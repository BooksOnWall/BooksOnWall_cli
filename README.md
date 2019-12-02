# Generate Books-on-wall mobile application framework 

## Dependencies
[npm](https://www.npmjs.com/get-npm) 

[yarn](https://yarnpkg.com/en/docs/install#debian-stable) 

[react-native-cli](https://github.com/react-native-community/cli)

[react-vivo-cli](https://docs.viromedia.com/docs)

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
