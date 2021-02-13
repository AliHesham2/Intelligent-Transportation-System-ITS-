import React from "react";
import firebase from "../Config/firebaseConfig";
import { View, ActivityIndicator } from "react-native";
export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.props.navigation.navigate(user ? "Maps" : "Home");
    });
  }

  handleBackButton() {
    return true;
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
