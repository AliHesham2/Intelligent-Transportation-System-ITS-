import React from "react";
import { Text, View, ImageBackground, Image, SafeAreaView } from "react-native";
import BB from "react-native-gradient-buttons";
export default class Home extends React.Component {
  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("../img/4.gif")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              opacity: 0.85,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 60,
              }}
            >
              <Image source={require("../assets/appicon.png")} />
            </View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 40,
                  color: "white",
                }}
              >
                Transportation System
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 17,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Smarter Passenger experience.
              </Text>
            </View>
            <View>
              <BB
                style={{ marginTop: 100, left: 26, opacity: 0.6 }}
                text="Login"
                width="80%"
                pinkDarkGreen
                impact
                onPressAction={() => this.props.navigation.navigate("Login")}
              />
              <BB
                style={{ marginTop: 50, left: 26, opacity: 0.6 }}
                text="Sign Up"
                width="80%"
                pinkDarkGreen
                impact
                onPressAction={() => this.props.navigation.navigate("SignUp")}
              />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
