/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View
} = ReactNative;

var SearchPage = require('./src/SearchPage');

class PropertyFinder extends React.Component {
  render() {
    return ( <ReactNative.NavigatorIOS
              style={styles.container}
              initialRoute={{
                title: 'Property Finder',
                component: SearchPage
              }}/>
  );
  }
}

const styles = StyleSheet.create({

  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('PropertyFinder', () => PropertyFinder);
