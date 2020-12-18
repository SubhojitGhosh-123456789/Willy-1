import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  userLogin = () => {
    if (this.state.email === "" && this.state.password === "") {
      alert("Please Enter Your Details to Signin");
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          alert("You have Logged In successfully!!");

          this.setState({
            isLoading: false,
            email: "",
            password: "",
          });
          this.props.navigation.navigate("Tab");
        })
        .catch((error) => alert(error.message));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginTop: 40,
                marginBottom: 20,
                borderRadius: 100,
              }}
            />
            <Text
              style={{
                fontSize: 30,
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Willy
            </Text>
            <Text style={{ fontSize: 20, textAlign: "center", color: "white" }}>
              Your Wireless Library
            </Text>
          </View>
          <TextInput
            placeholder="Email"
            style={{
              borderWidth: 2,
              borderColor: "blue",
              backgroundColor: "white",
              borderRadius: 25,
              height: 50,
              width: "75%",
              textAlign: "center",
              marginTop: 50,
            }}
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
          />
          <TextInput
            secureTextEntry
            style={{
              borderWidth: 2,
              borderColor: "blue",
              backgroundColor: "white",
              borderRadius: 25,
              height: 50,
              width: "75%",
              textAlign: "center",
              marginTop: 30,
            }}
            placeholder="Password"
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.userLogin()}
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputView: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    width: 200,
    backgroundColor: "#fb5b5a",
    height: 38,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    borderWidth: 2,
    borderColor: "white",
  },
  loginText: {
    color: "white",
    fontSize: 20,
  },

  wText: {
    color: "white",
    fontSize: 15,
  },
  logot: {
    fontWeight: "bold",
    fontSize: 25,
    color: "yellow",
    textAlign: "center",
    marginTop: 15,
  },
});
