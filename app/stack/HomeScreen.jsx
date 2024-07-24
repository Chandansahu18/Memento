import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserSearchTab from "../tab/UserSearchTab";
import SavedMediaTab from "../tab/SavedMediaTab";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarHideOnKeyboard:true
      }}
    >
      <Tab.Screen
        name="UserSearch"
        component={UserSearchTab}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="search" size={24} color="#435182" />
            ) : (
              <FontAwesome name="search" size={22} color="grey" />
            ),
        }}
      />
      <Tab.Screen
        name="SavedMedia"
        component={SavedMediaTab}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome6 name="photo-film" size={24} color="#435182" />
            ) : (
              <FontAwesome6 name="photo-film" size={22} color="grey" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
