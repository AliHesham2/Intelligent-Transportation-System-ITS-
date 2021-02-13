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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TypingAnimation } from "react-native-typing-animation";
import Toast from "../components/Toast";
import { signInUser } from "../Config/auth-api";
import BB from "react-native-gradient-buttons";
const width = Dimensions.get("screen").width;
const { width: WIDTH } = Dimensions.get("window");
const reviewSchema = yup.object({
  FirstName: yup.string().required().min(3),
  LastName: yup.string().required().min(3),
  Phone: yup.string().required().min(11).max(11),
  Email: yup.string().email("Invalid email").required(),
  Password: yup.string().required().min(6),
});
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typing_FirstName: false,
      typing_email: false,
      typing_password: false,
      typing_LastName: false,
      typing_Phone: false,
      showPass: true,
      press: false,
      animation_login: new Animated.Value(width - 45),
      enable: true,
      error: null,
      toast: false,
    };
  }
  onSignUpPressed = async (values) => {
    const response = await signInUser({
      first: values.FirstName,
      name: values.LastName,
      email: values.Email,
      password: values.Password,
      phone: values.Phone,
    });
    if (response.error) {
      this.state.error = response.error;
      setTimeout(() => {
        this.setState({
          toast: true,
        });
      }, 10);
    } else {
      Animated.timing(this.state.animation_login, {
        toValue: 40,
        duration: 250,
      }).start();

      setTimeout(() => {
        this.setState({
          enable: false,
          typing_FirstName: false,
          typing_email: true,
          typing_password: false,
          typing_Phone: false,
          typing_LastName: false,
        });
      }, 1000);
    }
  };
  _foucus(value) {
    if (value == "email") {
      this.setState({
        typing_FirstName: false,
        typing_email: true,
        typing_password: false,
        typing_Phone: false,
        typing_LastName: false,
      });
    } else if (value == "LastName") {
      this.setState({
        typing_FirstName: false,
        typing_email: false,
        typing_password: false,
        typing_Phone: false,
        typing_LastName: true,
      });
    } else if (value == "FirstName") {
      this.setState({
        typing_FirstName: true,
        typing_email: false,
        typing_password: false,
        typing_Phone: false,
        typing_LastName: false,
      });
    } else if (value == "Phone") {
      this.setState({
        typing_FirstName: false,
        typing_email: false,
        typing_password: false,
        typing_Phone: true,
        typing_LastName: false,
      });
    } else {
      this.setState({
        typing_FirstName: false,
        typing_email: false,
        typing_password: true,
        typing_Phone: false,
        typing_LastName: false,
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

  render() {
    console.disableYellowBox = true;
    const width = this.state.animation_login;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          initialValues={{
            FirstName: "",
            LastName: "",
            Email: "",
            Phone: "",
            Password: "",
          }}
          validationSchema={reviewSchema}
          onSubmit={(values) => {
            this.onSignUpPressed(values);
          }}
        >
          {(props) => (
            <ImageBackground
              blurRadius={0.4}
              source={require("../img/3.jpg")}
              style={styles.img}
            >
              <View style={styles.txt}>
                <Text style={styles.textt}>Sign Up</Text>
              </View>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-person"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={"FirstName"}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("FirstName")}
                  onBlur={props.handleBlur("FirstName")}
                  onFocus={() => this._foucus("FirstName")}
                  value={props.values.FirstName}
                />
                <View style={styles.wr}>
                  {this.state.typing_FirstName ? this._typing() : null}
                </View>
              </View>
              <Text
                style={{
                  color: "crimson",
                  fontWeight: "bold",
                  marginBottom: 10,
                  marginTop: -10,
                  textAlign: "center",
                }}
              >
                {props.touched.FirstName && props.errors.FirstName}
              </Text>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-person"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={"LastName"}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("LastName")}
                  onBlur={props.handleBlur("LastName")}
                  onFocus={() => this._foucus("LastName")}
                  value={props.values.LastName}
                />
                <View style={styles.wr}>
                  {this.state.typing_LastName ? this._typing() : null}
                </View>
              </View>
              <Text
                style={{
                  color: "crimson",
                  fontWeight: "bold",
                  marginBottom: 10,
                  marginTop: -10,
                  textAlign: "center",
                }}
              >
                {props.touched.LastName && props.errors.LastName}
              </Text>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-mail"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={"Email"}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("Email")}
                  onBlur={props.handleBlur("Email")}
                  onFocus={() => this._foucus("email")}
                  value={props.values.Email}
                />
                <View style={styles.wr}>
                  {this.state.typing_email ? this._typing() : null}
                </View>
              </View>
              <Text
                style={{
                  color: "crimson",
                  fontWeight: "bold",
                  marginBottom: 10,
                  marginTop: -10,
                  textAlign: "center",
                }}
              >
                {props.touched.Email && props.errors.Email}
              </Text>

              <View style={styles.emaill}>
                <Icon
                  name={"ios-phone-portrait"}
                  size={28}
                  color={"rgba(255,255,255,0.7)"}
                  style={styles.iicon}
                />
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder={"Phone"}
                  placeholderTextColor={"rgba(255,255,255,0.7)"}
                  underlineColorAndroid="transparent"
                  onChangeText={props.handleChange("Phone")}
                  onBlur={props.handleBlur("Phone")}
                  onFocus={() => this._foucus("Phone")}
                  value={props.values.Phone}
                />
                <View style={styles.wr}>
                  {this.state.typing_Phone ? this._typing() : null}
                </View>
              </View>
              <Text
                style={{
                  color: "crimson",
                  fontWeight: "bold",
                  marginBottom: 10,
                  marginTop: -10,
                  textAlign: "center",
                }}
              >
                {props.touched.Phone && props.errors.Phone}
              </Text>

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
                  onFocus={() => this._foucus("password")}
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
                    text="Sign Up"
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
                  onPress={() => this.props.navigation.navigate("Login")}
                >
                  <Text style={{ color: "white", fontSize: 20 }}>
                    have account ?Login
                  </Text>
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
    fontSize: 50,
    fontWeight: "500",
    marginTop: 10,
    opacity: 0.6,
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
