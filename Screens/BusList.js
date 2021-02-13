import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  FlatList,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import firebase from "../Config/firebaseConfig";
import BB from "react-native-gradient-buttons";
var Type, FirstTripCode, SecondTripCode, TripNumber, Nearpoint, SNearpoint;
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      Loading: false,
      EmptyTrips: false,
    };
    this.GetItem = this.GetItem.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.FlatListItemSeparator = this.FlatListItemSeparator.bind(this);
  }

  async componentDidMount() {
    Type = this.props.navigation.getParam("Type");
    FirstTripCode = this.props.navigation.getParam("Firstcode");
    if (Type === "Simple") {
      await firebase
        .firestore()
        .collection("vehicles")
        .where("activeTrip", "==", FirstTripCode.toString())
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.state.vehicles.push({
              key: doc.id,
              TripCode: doc.data().activeTrip,
              PlateNumber: doc.data().PlateNumber,
              Location: doc.data().Location,
            });
          });
          this.GetLocation();
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    } else {
      SecondTripCode = this.props.navigation.getParam("Secondcode");
      TripNumber = this.props.navigation.getParam("TripNumber");
      if (TripNumber === 1) {
        await firebase
          .firestore()
          .collection("vehicles")
          .where("activeTrip", "==", FirstTripCode.toString())
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.state.vehicles.push({
                key: doc.id,
                TripCode: doc.data().activeTrip,
                PlateNumber: doc.data().PlateNumber,
                Location: doc.data().Location,
              });
            });
            this.GetLocation();
          })
          .catch((err) => {
            console.log("Error getting documents", err);
          });
      } else if (TripNumber === 2) {
        await firebase
          .firestore()
          .collection("vehicles")
          .where("activeTrip", "==", SecondTripCode.toString())
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              this.state.vehicles.push({
                key: doc.id,
                TripCode: doc.data().activeTrip,
                PlateNumber: doc.data().PlateNumber,
                Location: doc.data().Location,
              });
            });
            this.GetLocation();
          })
          .catch((err) => {
            console.log("Error getting documents", err);
          });
      }
    }
  }

  async GetLocation() {
    if (this.state.vehicles.length > 0) {
      for (var i = 0; i < this.state.vehicles.length; i++) {
        await axios
          .get(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
              this.state.vehicles[i].Location.lat +
              "," +
              this.state.vehicles[i].Location.lng +
              "&key=AIzaSyBEA31tD3pv-F9ST9rd_Tt3wGiOjzT1HmE"
          )
          .then((response) => {
            var Tempvehicles = this.state.vehicles;
            Tempvehicles[i].Location =
              response.data.results[0].address_components[1].long_name;
            this.setState({
              vehicles: Tempvehicles,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      this.setState({ EmptyTrips: true });
    }
    this.setState({ Loading: true });
  }

  GetItem(item) {
    Nearpoint = this.props.navigation.getParam("Nearpoint");
    SNearpoint = this.props.navigation.getParam("SNearPoint");
    if (Type === "Complex") {
      TripNumber = this.props.navigation.getParam("TripNumber");
      if (TripNumber === 1) {
        this.props.navigation.pop(2);
        this.props.navigation.push("Maps", {
          Type: Type,
          FirstTripCode: FirstTripCode,
          SecondTripCode: SecondTripCode,
          PlateNumber: item.PlateNumber,
          NearPoint: Nearpoint,
          SNearPoint: SNearpoint,
          coor: this.props.navigation.getParam("coor"),
          Scoor: this.props.navigation.getParam("Scoor"),
          button: true,
          TripEnd: false,
          flag: true,
        });
      } else {
        this.props.navigation.pop(1);
        this.props.navigation.push("Maps", {
          Type: Type,
          FirstTripCode: FirstTripCode,
          SecondTripCode: SecondTripCode,
          PlateNumber: item.PlateNumber,
          NearPoint: Nearpoint,
          SNearPoint: SNearpoint,
          coor: this.props.navigation.getParam("coor"),
          Scoor: this.props.navigation.getParam("Scoor"),
          button: false,
          TripEnd: true,
          flag: true,
        });
      }
    } else {
      if (Nearpoint) {
        this.props.navigation.pop(1);
        this.props.navigation.push("Maps", {
          Type: Type,
          PlateNumber: item.PlateNumber,
          NearPoint: Nearpoint,
          coor: this.props.navigation.getParam("coor"),
          button: false,
          TripEnd: true,
          flag: true,
        });
      } else {
        this.props.navigation.pop(1);
        this.props.navigation.push("Maps", {
          Type: Type,
          PlateNumber: item.PlateNumber,
          coor: this.props.navigation.getParam("coor"),
          button: false,
          TripEnd: true,
          flag: true,
        });
      }
    }
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  handleBack() {
    var PreviousScreen = this.props.navigation.getParam("PreviousScreen");
    if (PreviousScreen === "Maps") {
      this.props.navigation.pop(1);
      this.props.navigation.push("Maps", {
        button: false,
        TripEnd: true,
        flag: true,
      });
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    console.disableYellowBox = true;
    if (this.state.Loading) {
      if (this.state.EmptyTrips) {
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
              source={require("../img/alert.jpg")}
              style={{ flex: 1 }}
              resizeMode="cover"
            >
              <BB
                style={{
                  marginVertical: 700,
                  marginHorizontal: 20,
                  opacity: 0.6,
                }}
                text="Back"
                width="90%"
                deepBlue
                impact
                onPressAction={this.handleBack}
              />
            </ImageBackground>
          </SafeAreaView>
        );
      } else {
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: "black", flex: 1 }}>
              <View style={styles.MainContainer}>
                <FlatList
                  data={this.state.vehicles}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity onPress={this.GetItem.bind(this, item)}>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.item}>
                            Trip: {item.TripCode}
                            &nbsp;&nbsp;|&nbsp;&nbsp;Plate Number:&nbsp;
                            {item.PlateNumber}
                          </Text>
                          <Text style={styles.item}>
                            Location: {item.Location}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
                <View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#C8C8C8",
                  }}
                />
                <TouchableOpacity onPress={this.handleBack}>
                  <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        );
      }
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
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  item: {
    color: "white",
    padding: 10,
    fontSize: 17,
    height: 43,
  },
});
