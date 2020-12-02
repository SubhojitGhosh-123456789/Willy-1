import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BookTransaction from './Screens/BookTransaction';
import Search from './Screens/Search';

export default class App extends React.Component{
  render(){
  return (
    <View style={styles.container}>
        <AppContainer/>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Tab = createBottomTabNavigator({
  Transaction: {
    screen: BookTransaction
  },
  Search:{
    screen : Search
  }
});

const AppContainer = createAppContainer(Tab);


