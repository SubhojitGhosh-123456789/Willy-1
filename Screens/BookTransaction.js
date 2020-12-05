import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scanneBookID: "",
      scannedStudentID: "",
      buttonState: "normal",
    };
  }

  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false,
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state;
    if (buttonState === "BookID") {
      this.setState({
        scannedBookID: data,
        scanned: true,
        buttonState: "normal",
      });
    } else if (buttonState === "StudentID") {
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal",
      });
    }
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== "normal" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === "normal") {
      return (
        <View style={styles.container}>
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={{
                width: 200,
                height: 200,
                alignSelf: "center",
                marginTop: 40,
              }}
            />
            <Text
              style={{ fontSize: 30, textAlign: "center", fontWeight: "bold" }}
            >
              Willy
            </Text>
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Your Wireless Library
            </Text>
          </View>

          <View style={{ flexDirection: "row", marginTop: 50 }}>
            <TextInput
              placeholder="Book ID"
              id="bookId"
              style={styles.textInput}
              value={this.state.scannedBookID}
            ></TextInput>

            <TouchableOpacity
              onPress={() => {
                this.getCameraPermissions("BookID");
              }}
              style={styles.scanButton}
            >
              <Text style={styles.buttonText}>SCAN ID</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <TextInput
              placeholder="Student ID"
              id="studentId"
              style={styles.textInput}
              value={this.state.scannedStudentID}
            ></TextInput>

            <TouchableOpacity
              onPress={() => {
                this.getCameraPermissions("StudentID");
              }}
              style={styles.scanButton}
            >
              <Text style={styles.buttonText}>SCAN ID</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanButton: {
    alignSelf: "center",
    backgroundColor: "#728cd4",
    width: 130,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },

  textInput: {
    width: 200,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    textAlign: "center",
  },
});
