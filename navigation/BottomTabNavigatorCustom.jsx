import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";
import Svg, { Path } from "react-native-svg";
import { isIphoneX } from "react-native-iphone-x-helper";

import Home from "../screens/Home/Home";
import Scan from "../screens/Scan/Scan";
import Transactions from "../screens/Transactions/Transactions";
import TransactionView from "../screens/TransactionView/TransactionView";
import MakeSale from "../screens/MakeSale/MakeSale";

import { Icons } from "../constants/icons";
import { cxlxrs } from "../constants/Colors";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({
  accessibilityLabel,
  accessibilityState,
  children,
  onPress,
}) => {
  const isSelected = accessibilityState.selected;
  if (isSelected) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            top: 0,
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}></View>
          <Svg width={75} height={61} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={"#ffffff"}
            />
          </Svg>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}></View>
        </View>

        <TouchableOpacity
          style={[styles.tabIconContainer, styles.shadow]}
          onPress={onPress}
        >
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.tabIconContainerInactive}
        activeOpacity={1}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
};

const CustomTabBar = (props) => {
  if (isIphoneX()) {
    return (
      <View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            backgroundColor: cxlxrs.white,
          }}
        ></View>
        <BottomTabBar {...props.props} />
      </View>
    );
  } else {
    return <BottomTabBar {...props.props} />;
  }
};
function getTabBarVisible(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case "EditProfile":
      return false;
      break;
    case "Profile":
      return false;
      break;
    case "MakeSale":
      return false;
      break;
    case "ProductView":
      return false;
      break;
    case "TransactionView":
      return false;
      break;
    case "About":
      return false;
      break;
    default:
      return true;
      break;
  }
}
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          elevation: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar props={props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarIcon: ({ focused }) => (
            //   IMAGE OR ICON
            <Image
              source={Icons.more}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? cxlxrs.white : cxlxrs.textColor,
              }}
            />
          ),
          tabBarButton: (props) =>
            getTabBarVisible(route) && <TabBarCustomButton {...props} />,
        })}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarIcon: ({ focused }) => (
            <Image
              source={Icons.scan}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? cxlxrs.white : cxlxrs.textColor,
              }}
            />
          ),
          tabBarButton: (props) =>
            getTabBarVisible(route) && <TabBarCustomButton {...props} />,
        })}
      />
      <Tab.Screen
        name="Transaction"
        component={TransactionScreenNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisible(route),
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="retweet"
              size={23}
              color={focused ? cxlxrs.white : cxlxrs.textColor}
            />
          ),
          tabBarButton: (props) =>
            getTabBarVisible(route) && <TabBarCustomButton {...props} />,
        })}
      />
    </Tab.Navigator>
  );
};

const ScreenStack = createStackNavigator();

function HomeScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="MakeSale"
        component={MakeSale}
        options={{
          headerShown: false,
        }}
      />
      {/* <ScreenStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      /> */}
    </ScreenStack.Navigator>
  );
}
function ScanScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="Scan"
        component={Scan}
        options={{
          headerShown: false,
        }}
      />
    </ScreenStack.Navigator>
  );
}
function TransactionScreenNavigator() {
  return (
    <ScreenStack.Navigator>
      <ScreenStack.Screen
        name="Transactions"
        component={Transactions}
        options={{
          headerShown: false,
        }}
      />
      <ScreenStack.Screen
        name="TransactionView"
        component={TransactionView}
        options={{
          headerShown: false,
        }}
      />
    </ScreenStack.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: cxlxrs.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  tabIconContainer: {
    top: -22.5,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: cxlxrs.black,
  },
  tabIconContainerInactive: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    backgroundColor: cxlxrs.white,
  },
});

export default BottomTabNavigator;
