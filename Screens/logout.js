import React from "react";
import firebase from "../Config/firebaseConfig";
import { View, ActivityIndicator } from "react-native";
export default class Logout extends React.Component {
  async componentDidMount() {
    firebase.auth().signOut();
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
}
