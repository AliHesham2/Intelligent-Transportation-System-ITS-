import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  SafeAreaView,
  BackHandler,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { TypingAnimation } from "react-native-typing-animation";
import Toast from "../components/Toast";
import firebase from "../Config/firebaseConfig";
import BB from "react-native-gradient-buttons";
const width = Dimensions.get("screen").width;
const { width: WIDTH } = Dimensions.get("window");
const reviewSchema = yup.object({
  Displayname: yup.string().required().min(3),
});
export default class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      displayname: null,
      Loading: false,
      typing_FirstName: false,
      typing_Displayname: false,
      press: false,
      animation_login: new Animated.Value(width - 45),
      error: null,
      toast: false,
    };
  }
  async componentDidMount() {
    const user = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    await db
      .collection("Users")
      .doc(user)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          this.setState({
            Loading: true,
            displayname: doc.data().LastName,
            firstname: doc.data().FirstName,
          });
        }
      })
      .catch((err) => {
        console.log("Error getting document", err);
      });
  }
  onEditPressed = async (values) => {
    try {
      const user = firebase.auth().currentUser.uid;
      const db = firebase.firestore();
      await db.collection("Users").doc(user).update({
        FirstName: values.FirstName,
        LastName: values.Displayname,
      });
      this.setState({
        Loading: false,
      });
      Alert.alert(
        "Successful",
        "Your profile data is updated successfully",
        [
          {
            text: "Done",
            onPress: () => this.props.navigation.navigate("Maps"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      this.setState({
        toast: true,
      });
      switch (error.code) {
        case "auth/too-many-requests": {
          this.setState({
            error: "Too many request. Try again in a minute.",
          });
        }
        default: {
          this.setState({
            error: "Check your internet connection.",
          });
        }
      }
    }
  };

  _foucus(value) {
    if (value == "Displayname") {
      this.setState({
        typing_FirstName: false,
        typing_Displayname: true,
      });
    } else {
      this.setState({
        typing_FirstName: true,
        typing_Displayname: false,
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
    if (this.state.Loading) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Formik
            initialValues={{
              Displayname: this.state.displayname,
              FirstName: this.state.firstname,
            }}
            validationSchema={reviewSchema}
            onSubmit={(values) => {
              this.onEditPressed(values);
            }}
          >
            {(props) => (
              <ImageBackground
                blurRadius={0.4}
                source={require("../img/3.jpg")}
                style={styles.img}
              >
                <View style={styles.txt}>
                  <Text style={styles.textt}>Edit Profile</Text>
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
                    marginTop: -1,
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
                    placeholderTextColor={"rgba(255,255,255,0.7)"}
                    underlineColorAndroid="transparent"
                    onChangeText={props.handleChange("Displayname")}
                    onBlur={props.handleBlur("Displayname")}
                    onFocus={() => this._foucus("Displayname")}
                    value={props.values.Displayname}
                  />
                  <View style={styles.wr}>
                    {this.state.typing_Displayname ? this._typing() : null}
                  </View>
                </View>
                <Text
                  style={{
                    color: "crimson",
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: -1,
                    textAlign: "center",
                  }}
                >
                  {props.touched.Displayname && props.errors.Displayname}
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
    } else {
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
