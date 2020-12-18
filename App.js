import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import BookTransaction from "./Screens/BookTransaction";
import Search from "./Screens/Search";
import LoginScreen from "./Screens/Login";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AppContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(0,0,50)",
  },
});

const Tab = createBottomTabNavigator(
  {
    Transaction: {
      screen: BookTransaction,
    },
    Search: {
      screen: Search,
    },
  },

  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const routeName = navigation.state.routeName;
        if (routeName === "Transaction") {
          return (
            <Image
              source={require("./assets/book.png")}
              style={{ width: 30, height: 30 }}
            />
          );
        } else if (routeName === "Search") {
          return (
            <Image
              source={require("./assets/searchingbook.png")}
              style={{ width: 30, height: 30 }}
            />
          );
        }
      },
    }),
  }
);

const screen = createSwitchNavigator({
  LoginScreen: {
    screen: LoginScreen,
  },
  Tab: {
    screen: Tab,
  },
});

const AppContainer = createAppContainer(screen);
