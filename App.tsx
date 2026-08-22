import { useEffect, useRef, useState } from "react";
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
import { useAstronomy } from "./src/hooks/useAstronomy";
import { useCurrentPlace } from "./src/hooks/useCurrentPlace";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LunarScopeSplash } from "./src/screens/LunarScopeSplash";
import { PlaceholderScreen } from "./src/screens/PlaceholderScreen";
import { colors } from "./src/theme";

const MIN_SPLASH_MS = 2200;

const placeholderTitles: Record<Exclude<TabKey, "home">, string> = {
  explore: "Explore",
  calendar: "Calendar",
  skymap: "Sky Map",
  profile: "Profile",
};

SplashScreen.preventAutoHideAsync();

export default function App() {
  const splashStartedAt = useRef(Date.now());
  const [tab, setTab] = useState<TabKey>("home");
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [loaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Geist_400Regular,
    Geist_600SemiBold,
    Geist_700Bold,
  });
  const { place, loading: locating, error: locationError } = useCurrentPlace();
  const {
    astronomy,
    error: astronomyError,
    loading: astronomyLoading,
  } = useAstronomy(
    place
      ? { latitude: place.latitude, longitude: place.longitude }
      : null,
  );

  const fontsReady = loaded || Boolean(fontError);
  const hasDashboardData = astronomy != null;
  const cannotLoadDashboard =
    (!locating && locationError != null && place == null) ||
    (!astronomyLoading && astronomyError != null && astronomy == null);

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady || (!hasDashboardData && !cannotLoadDashboard)) {
      return;
    }

    const remaining = Math.max(
      0,
      MIN_SPLASH_MS - (Date.now() - splashStartedAt.current),
    );
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [cannotLoadDashboard, fontsReady, hasDashboardData]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {isSplashVisible ? (
        <LunarScopeSplash />
      ) : (
        <View style={styles.root}>
          {tab === "home" ? (
            <HomeScreen
              place={place}
              locating={locating}
              astronomy={astronomy}
            />
          ) : (
            <PlaceholderScreen title={placeholderTitles[tab]} />
          )}
          <TabBar active={tab} onChange={setTab} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
