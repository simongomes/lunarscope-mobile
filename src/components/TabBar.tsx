import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  CalendarTabIcon,
  CompassTabIcon,
  GlobeTabIcon,
  HomeTabIcon,
  ProfileTabIcon,
} from "./Icons";
import { colors, fonts } from "../theme";

export type TabKey = "home" | "explore" | "calendar" | "skymap" | "profile";

const tabs: {
  key: TabKey;
  label: string;
  Icon: typeof HomeTabIcon;
}[] = [
  { key: "home", label: "Home", Icon: HomeTabIcon },
  { key: "explore", label: "Explore", Icon: CompassTabIcon },
  { key: "calendar", label: "Calendar", Icon: CalendarTabIcon },
  { key: "skymap", label: "Sky Map", Icon: GlobeTabIcon },
  { key: "profile", label: "Profile", Icon: ProfileTabIcon },
];

type TabBarProps = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export function TabBar({ active, onChange }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map(({ key, label, Icon }) => {
        const isActive = key === active;
        const color = isActive ? colors.gold : colors.tabInactive;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(key)}
            style={styles.item}
          >
            <Icon color={color} filled={isActive} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    minHeight: 48,
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.secondary.semibold,
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
