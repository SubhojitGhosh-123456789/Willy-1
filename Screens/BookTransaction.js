import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";

export default class BookTransaction extends React.Component {
  constructor() {
    super();
    this.state = {
      output: "",
      scanned: false,
      hasCameraPermissions: null,
      buttonState: "normal",
    };
  }

  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA); //Asking Camera Permisions
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: "clicked",
      scanned: "false",
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({
      scanned: true,
      output: data,
      buttonState: "normal",
    });
  };

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState === "clicked" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else if (buttonState === "normal") {
      return (
        <View style={styles.container}>
          <Text>Book QR Code Scanner</Text>
          <Text>
            {hasCameraPermissions === true
              ? this.state.output
              : "Request Camera Permission"}
          </Text>
          <TouchableOpacity
            style={{
              margin: 50,
              backgroundColor: "blue",
              color: "white",
              fontWeight: "bold",
              alignItems: "center",
            }}
            onPress={this.getCameraPermissions}
          >
            <Text> Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
