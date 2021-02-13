import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BB from "react-native-gradient-buttons";
import { TypingAnimation } from "react-native-typing-animation";

import Toast from "../components/Toast";
import { change } from "../Config/auth-api";
const width = Dimensions.get("screen").width;
const { width: WIDTH } = Dimensions.get("window");
const reviewSchema = yup.object({
  Password: yup.string().required("Password is required"),
  ConfirmPassword: yup
    .string()
    .oneOf([yup.ref("Password"), null], "Passwords must match"),
});
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typing_password: false,
      typing_ConfirmPassword: false,
      showPass: true,
      showPass1: true,
      press: false,
      press1: false,
      animation_login: new Animated.Value(width - 45),
      enable: true,
      error: null,
      toast: false,
    };
  }
  onChangePressed = async (values) => {
    const response = await change({
      password: values.Password,
    });

    if (response.error) {
      this.state.error = response.error;
      setTimeout(() => {
        this.setState({
          toast: true,
        });
      }, 10);
    } else {
      Alert.alert(
        "Successful",
        "Your password  is  updated  successfully do u want to logout or Continue?",
        [
          {
            text: "Continue",
            onPress: () => this.props.navigation.navigate("Maps"),
          },
          {
            text: "logout",
            onPress: () => this.props.navigation.navigate("Logout"),
          },
        ],
        { cancelable: false }
      );
      setTimeout(() => {
        this.setState({
          enable: false,
          typing_password: false,
          typing_ConfirmPassword: false,
        });
      }, 10);
    }
  };
  _foucus(value) {
    if (value == "Password") {
      this.setState({
        typing_password: true,
        typing_ConfirmPassword: false,
      });
    } else {
      this.setState({
        typing_password: false,
        typing_ConfirmPassword: true,
      });
    }
  }

  _typing() {
    return (
      <TypingAnimation
        dotColor="#93278f"
        style={{ marginRight: 40, fontSize: 100 }}
      />
    );
  }
  showPass = () => {
    if (this.state.press == false) {
      this.setState({ showPass: false, press: true });
    } else {
      this.setState({ showPass: true, press: false });
    }
  };
  showPasss = () => {
    if (this.state.press1 == false) {
      this.setState({ showPass1: false, press1: true });
    } else {
      this.setState({ showPass1: true, press1: false });
    }
  };

  render() {
    console.disableYellowBox = true;
    const width = this.state.animation_login;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          initialValues={{
            Password: "",
            ConfirmPassword: "",
          }}
          validationSchema={reviewSchema}
          onSubmit={(values) => {
            this.onChangePressed(values);
          }}
        >
          {(props) => (
            <ImageBackground
              blurRadius={0.4}
              source={require("../img/3.jpg")}
              style={styles.img}
            >
              <View style={styles.txt}>
                <Text style={styles.textt}>Change Password</Text>
              </View>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-lock"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={"Password"}
                  secureTextEntry={this.state.showPass}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("Password")}
                  onBlur={props.handleBlur("Password")}
                  onFocus={() => this._foucus("Password")}
                  value={props.values.Password}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={this.showPass.bind(this)}
                >
                  <Icon
                    name={this.state.press == false ? "ios-eye" : "ios-eye-off"}
                    size={26}
                    color={"rgba(255,255,255,0.7)"}
                  />
                  {this.state.typing_password ? this._typing() : null}
                </TouchableOpacity>
                <Text
                  style={{
                    color: "crimson",
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  {props.touched.Password && props.errors.Password}
                </Text>
              </View>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-lock"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={"ConfirmPassword"}
                  secureTextEntry={this.state.showPass1}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("ConfirmPassword")}
                  onBlur={props.handleBlur("ConfirmPassword")}
                  onFocus={() => this._foucus("ConfirmPassword")}
                  value={props.values.ConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eye}
                  onPress={this.showPasss.bind(this)}
                >
                  <Icon
                    name={
                      this.state.press1 == false ? "ios-eye" : "ios-eye-off"
                    }
                    size={26}
                    color={"rgba(255,255,255,0.7)"}
                  />
                  {this.state.typing_ConfirmPassword ? this._typing() : null}
                </TouchableOpacity>
                <Text
                  style={{
                    color: "crimson",
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  {props.touched.ConfirmPassword &&
                    props.errors.ConfirmPassword}
                </Text>
              </View>

              <View style={styles.button_container}>
                <Animated.View
                  style={[
                    styles.textLogin,
                    {
                      width,
                    },
                  ]}
                >
                  <BB
                    style={{ left: 26, opacity: 0.6 }}
                    text="Change password"
                    width="80%"
                    pinkDarkGreen
                    impact
                    onPressAction={props.handleSubmit}
                  />
                </Animated.View>
              </View>
              {this.state.toast ? (
                <Toast
                  message={this.state.error}
                  onDismiss={() => (this.state.error = null)}
                />
              ) : (
                <Text></Text>
              )}
              <View style={styles.SignUp}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Maps")}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        </Formik>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: "rgba(0,0,0,0.35)",
    color: "rgba(255,255,255,0.7)",
    marginHorizontal: 25,
  },
  iicon: {
    position: "absolute",
    top: 8,
    left: 37,
  },
  txt: {
    alignItems: "center",
    marginBottom: 50,
  },
  wr: {
    position: "absolute",
    top: 10,
    right: 30,
  },
  eye: {
    position: "absolute",
    top: 8,
    right: 37,
  },

  img: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: null,
    height: null,
  },
  textt: {
    color: "white",
    fontSize: 40,
    fontWeight: "500",
    marginTop: 10,
    opacity: 0.5,
  },
  button_container: {
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    opacity: 0.8,
    backgroundColor: "#2c8233",
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  textLogin: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  SignUp: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
});
