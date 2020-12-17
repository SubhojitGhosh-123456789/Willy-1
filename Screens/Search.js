import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import db from "../config";
import { Card } from "react-native-elements";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastTransaction: null,
      search: "",
    };
  }

  componentDidMount = async () => {
    const query = await db.collection("Transaction").get();

    query.docs.map((doc) => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastTransaction: doc,
      });
    });
  };

  searchTransaction = async (text) => {
    var searchText = text.split("");
    var checkText = text.toUpperCase();

    if (searchText[0].toUpperCase() == "I") {
      const transaction = await db
        .collection("Transaction")
        .where("BookID", "==", checkText)
        .get();

      transaction.docs.map((doc) => {
        console.log(doc);
        console.log(doc.data());
        this.setState({
          allTransactions: [doc.data()],
          lastTransaction: doc,
        });
      });
    } else if (searchText[0].toUpperCase() == "S") {
      const transaction = await db
        .collection("Transaction")
        .where("StudentID", "==", checkText)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [doc.data()],
          lastTransaction: doc,
        });
      });
    }
  };

  fetchTransaction = async () => {
    var searchText = this.state.search.split("");
    var checkText = searchText.toUpperCase();

    if (searchText[0].toUpperCase() == "I") {
      const transaction = await db
        .collection("Transaction")
        .where("BookID", "==", checkText)
        .startAfter(this.state.lastTransaction)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    } else if (searchText[0].toUpperCase() == "S") {
      const transaction = await db
        .collection("Transaction")
        .where("StudentID", "==", checkText)
        .startAfter(this.state.lastTransaction)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <TextInput
            style={styles.bar}
            placeholder="Type Book ID or Student ID"
            placeholderTextColor="white"
            onChangeText={(text) => {
              this.setState({ search: text });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.searchTransaction(this.state.search);
            }}
          >
            <Image
              source={require("../assets/search.png")}
              style={{ width: 50, height: 50, marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item, index }) => {
            return (
              <View key={index} style={{ marginTop: 20 }}>
                <Card>
                  <Text>{"Book Id:  " + item.BookID}</Text>
                  <Text>{"Student Id:  " + item.StudentID}</Text>
                  <Text>{"Transaction Type:  " + item.TransactionType}</Text>
                  <Text>{"Date:  " + item.date.toDate()}</Text>
                </Card>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchTransaction}
          onEndReachedThreshold={0.7}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    flexDirection: "row",
    height: 60,
    width: "100%",
    borderWidth: 0.5,
    backgroundColor: "rgb(0,0,10)",
    marginTop: 25,
  },
  bar: {
    borderWidth: 0.5,
    borderColor: "white",
    height: 50,
    width: "80%",
    color: "white",
    borderRadius: 5,
    textAlign: "center",
  },
});
