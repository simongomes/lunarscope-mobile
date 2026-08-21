import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_600SemiBold } from "@expo-google-fonts/outfit/600SemiBold";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";

import { TabBar, type TabKey } from "./src/components/TabBar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PlaceholderScreen } from "./src/screens/PlaceholderScreen";
import { colors } from "./src/theme";

const placeholderTitles: Record<Exclude<TabKey, "home">, string> = {
  explore: "Explore",
  calendar: "Calendar",
  skymap: "Sky Map",
  profile: "Profile",
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [tab, setTab] = useState<TabKey>("home");
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Geist_400Regular,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>
        {tab === "home" ? (
          <HomeScreen />
        ) : (
          <PlaceholderScreen title={placeholderTitles[tab]} />
        )}
        <TabBar active={tab} onChange={setTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
