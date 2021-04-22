import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BottomTabNavigator from "./BottomTabNavigatorCustom";
import Login from "../screens/Login/Login";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import { firestore } from "../firebase/config";
import { setCurrentUser } from "../redux/user/actions";

function Navigation({ colorScheme }) {
  const currentUser = useSelector(({ user }) => user.currentUser);
  const dispatch = useDispatch();

  const onLogUserIn = async (shopId, userId) => {
    try {
      await firestore
        .collection(`cashiers`)
        .doc(`${shopId}`)
        .collection(`cashiers`)
        .doc(userId)
        .onSnapshot((snapShot) => {
          if (snapShot.empty) {
            return;
          }
          dispatch(setCurrentUser(snapShot.data()));
        });
    } catch (error) {}
  };
  useEffect(() => {
    currentUser && onLogUserIn(currentUser.shopId, currentUser.id);
  }, [""]);

  const renderer = () => {
    return currentUser ? <RootNavigator /> : <AuthNavigator />;
  };
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {renderer()}
    </NavigationContainer>
  );
}

const RootStack = createStackNavigator();

function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Root" component={BottomTabNavigator} />
    </RootStack.Navigator>
  );
}

const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Root"
        component={Login}
        options={{ title: "Login" }}
      />
      <AuthStack.Screen
        name="Reset"
        component={ForgotPassword}
        options={{ title: "Reset Password" }}
      />
    </AuthStack.Navigator>
  );
}

export default Navigation;
