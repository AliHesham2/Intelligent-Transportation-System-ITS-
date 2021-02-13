import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../Screens/Home";
import Login from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";
import Reset from "../Screens/ResetPassword";
import Loading from "../Screens/Start";
import Maps from "../Screens/Map";
import Logout from "../Screens/logout";
import Edit from "../Screens/Edit";
import ChangePassword from "../Screens/ChangePassword";
import TripList from "../Screens/TripList";
import BusList from "../Screens/BusList";
const screens = {
  Loading: {
    screen: Loading,
    navigationOptions: {
      headerShown: false,
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerShown: false,
    },
  },
  Reset: {
    screen: Reset,
    navigationOptions: {
      headerShown: false,
    },
  },
  Maps: {
    screen: Maps,
    navigationOptions: {
      headerShown: false,
    },
  },
  Logout: {
    screen: Logout,
    navigationOptions: {
      headerShown: false,
    },
  },
  Edit: {
    screen: Edit,
    navigationOptions: {
      headerShown: false,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      headerShown: false,
    },
  },
  TripList: {
    screen: TripList,
    navigationOptions: {
      headerShown: false,
    },
  },
  BusList: {
    screen: BusList,
    navigationOptions: {
      headerShown: false,
    },
  },
};

const HomeStack = createStackNavigator(screens, {
  initialRouteName: "Loading",
  unmountInactiveRoutes: true,
});

export default createAppContainer(HomeStack);
