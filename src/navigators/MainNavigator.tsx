import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TabNavigator from "./TabNavigator";
import ProfileScreen from "../screens/home/ProfileScreen";


const MainNavigator = () => {
    const Stack = createNativeStackNavigator();
    //Main tab
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Profile" component={ProfileScreen} />

        </Stack.Navigator>
    );
};
export default MainNavigator;