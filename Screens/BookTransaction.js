import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";
import firebase from "firebase";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookID: "",
      scannedStudentID: "",
      buttonState: "normal",
      transactionMessage: "",
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

  initiateBookIssue = async () => {
    db.collection("Transaction").add({
      StudentID: this.state.scannedStudentID,
      BookID: this.state.scannedBookID,
      Date: firebase.firestore.Timestamp.now().toDate(),
      TransactionType: "Issued",
    });
    console.log(this.state.scannedBookID);

    db.collection("Books").doc(this.state.scannedBookID).update({
      BookAvailability: false,
    });

    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        IssuedBooks: firebase.firestore.FieldValue.increment(1),
      });

    this.setState({
      scannedStudentID: "",
      scannedBookID: "",
    });
  };

  initiateBookReturn = async () => {
    db.collection("Transaction").add({
      StudentID: this.state.scannedStudentID,
      BookID: this.state.scannedBookID,
      Date: firebase.firestore.Timestamp.now().toDate(),
      TransactionType: "Returned",
    });

    db.collection("Books").doc(this.state.scannedBookID).update({
      BookAvailability: true,
    });

    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        IssuedBooks: firebase.firestore.FieldValue.increment(-1),
      });

    this.setState({
      scannedStudentID: "",
      scannedBookID: "",
    });
  };

  handleTransaction = async () => {
    var transactionType = await this.checkBookAvailibilty();
    console.log(transactionType);
    if (!transactionType) {
      alert("The Book Is Not in The Library");
      this.setState({ scannedBookID: "", scannedStudentID: "" });
    } else if (transactionType === "Issue") {
      var isStudentEligible = await this.checkStundentEligibilityIssue();
      if (isStudentEligible) {
        this.initiateBookIssue();
        alert("The Book Has Been Issued To The Student.");
      }
    } else {
      var isStudentEligible = await this.checkStundentEligibilityReturn();
      if (isStudentEligible) {
        this.initiateBookReturn();
        alert("The Book Has Been Returned By The Student.");
      }
    }
  };

  checkBookAvailibilty = async () => {
    const bookRef = await db
      .collection("Books")
      .where("BookID", "==", this.state.scannedBookID)
      .get();

    var transactionType = "";
    if (bookRef.docs.length == 0) {
      transactionType = "false";
      console.log(bookRef.docs.length);
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        if (book.BookAvailability) {
          transactionType = "Issue";
        } else {
          transactionType = "Return";
        }
      });
    }
    return transactionType;
  };

  checkStundentEligibilityIssue = async () => {
    const studentRef = await db
      .collection("Students")
      .where("StudentID", "==", this.state.scannedStudentID)
      .get();

    var isStudentEligible = "";
    if (studentRef.docs.length == 0) {
      isStudentEligible = false;
      this.setState({ scannedBookID: "", scannedStudentID: "" });
      alert("This is not an existing Student ID");
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();

        if (student.IssuedBooks < 2) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          alert("The Student has already Issued 2 Books.");
          this.setState({ scannedBookID: "", scannedStudentID: "" });
        }
      });
    }
    return isStudentEligible;
  };

  checkStundentEligibilityReturn = async () => {
    const transactionRef = await db
      .collection("Transactions")
      .where("BookID", "==", this.state.scannedBookID)
      .limit(1)
      .get();

    var isStudentEligible = "";

    transactionRef.docs.map((doc) => {
      var lastBookTransaction = doc.data();

      if (lastBookTransaction.StudentID == this.state.scannedStudentID) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        alert("The Book wasn't Issued To The Student.");
        this.setState({ scannedBookID: "", scannedStudentID: "" });
      }
    });

    return isStudentEligible;
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
        <KeyboardAvoidingView
          style={styles.container}
          behavior={"padding"}
          enabled
        >
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
                style={{
                  fontSize: 30,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
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
                onChangeText={(text) => this.setState({ scannedBookID: text })}
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
                onChangeText={(text) =>
                  this.setState({ scannedStudentID: text })
                }
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

            <TouchableOpacity
              onPress={async () => {
                var transactionMessage = await this.handleTransaction();
                this.setState({ scannedBookID: "", scannedStudentID: "" });
              }}
              style={styles.submitButton}
            >
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  submitButton: {
    alignSelf: "center",
    backgroundColor: "magenta",
    width: 130,
    borderRadius: 5,
    marginTop: 30,
    padding: 10,
  },
});
