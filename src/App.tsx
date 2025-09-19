import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddExperienceScreen from "./screens/AddExperienceScreen";
import CompanyScreen from "./screens/CompanyScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./auth/AuthContext";

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Signup: undefined;
  // App
  Home: undefined;
  Add: undefined;
  Company: { company: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return null; // İstersen splash ekleyebilirsin

  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Şeffaf Kariyer" }}
          />
          <Stack.Screen
            name="Add"
            component={AddExperienceScreen}
            options={{ title: "Deneyim Ekle" }}
          />
          <Stack.Screen
            name="Company"
            component={CompanyScreen}
            options={({ route }) => ({ title: route.params.company })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppRouter />
      </NavigationContainer>
    </AuthProvider>
  );
}
