import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  BackHandler,
  Animated,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TypingAnimation } from "react-native-typing-animation";
import BB from "react-native-gradient-buttons";
import Toast from "../components/Toast";
import { sendEmailWithPassword } from "../Config/auth-api";
const width = Dimensions.get("screen").width;
const { width: WIDTH } = Dimensions.get("window");
const reviewSchema = yup.object({
  Email: yup.string().email("Invalid email").required(),
});
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typing_email: false,
      animation_login: new Animated.Value(width - 45),
      enable: true,
      error: null,
      toast: false,
    };
  }
  onResetPressed = async (values) => {
    const response = await sendEmailWithPassword({
      email: values.Email,
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
        "Check your Email please",
        [
          {
            text: "Done",
            onPress: () => this.props.navigation.navigate("Home"),
          },
        ],
        { cancelable: false }
      );
      setTimeout(() => {
        this.setState({
          enable: false,
          typing_email: false,
        });
      }, 1000);
    }
  };
  _foucus(value) {
    if (value == "email") {
      this.setState({
        typing_email: true,
      });
    } else {
      this.setState({
        typing_email: false,
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

  render() {
    console.disableYellowBox = true;
    const width = this.state.animation_login;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          initialValues={{
            Email: "",
          }}
          validationSchema={reviewSchema}
          onSubmit={(values) => {
            this.onResetPressed(values);
          }}
        >
          {(props) => (
            <ImageBackground
              blurRadius={0}
              source={require("../img/3.jpg")}
              style={styles.img}
            >
              <View style={styles.txt}>
                <Text style={styles.textt}>Reset Password</Text>
              </View>

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
                    text="Confirm"
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
});
