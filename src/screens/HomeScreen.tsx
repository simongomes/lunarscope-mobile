import { useEffect, useState } from "react";
import {
  AppState,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  PinIcon,
  ScorpioGlyph,
  SparkleIcon,
  StarIcon,
  SunArcIcon,
} from "../components/Icons";
import { MoonPhaseIcon } from "../components/MoonPhaseIcon";
import { homeData } from "../data/home";
import { useCurrentPlace } from "../hooks/useCurrentPlace";
import { colors, fonts, radius, spacing } from "../theme";
import { greetingForNow } from "../utils/greeting";

const moonImage = require("../../assets/images/moon-phases/moon_phase_new_moon.webp");

export function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [greeting, setGreeting] = useState(() =>
    greetingForNow(homeData.userName),
  );
  const { place, loading: locating } = useCurrentPlace();
  const locationLabel =
    place?.label ?? (locating ? "Locating…" : "Location unavailable");

  useEffect(() => {
    const refresh = () => setGreeting(greetingForNow(homeData.userName));
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    const interval = setInterval(refresh, 60_000);
    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <NebulaBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.locationRow}>
              <PinIcon />
              <Text style={styles.location}>{locationLabel}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={styles.bellButton}
          >
            <BellIcon />
          </Pressable>
        </View>

        <View style={styles.moonCard}>
          <View style={styles.moonCardTop}>
            <View style={styles.moonMeta}>
              <Text style={styles.kicker}>ILLUMINATION</Text>
              <Text style={styles.illumination}>
                {homeData.moon.illumination}%
              </Text>
              <Text style={styles.phaseName}>{homeData.moon.phase}</Text>
            </View>
            <View style={styles.moonVisual}>
              <MoonHalo />
              <Image source={moonImage} style={styles.moonImage} />
            </View>
          </View>
          <View style={styles.moonTimes}>
            <View style={styles.moonTimeCol}>
              <ArrowUpRightIcon />
              <View>
                <Text style={styles.moonTimeLabel}>Moonrise</Text>
                <Text style={styles.moonTimeValue}>
                  {homeData.moon.moonrise}
                </Text>
              </View>
            </View>
            <View style={styles.moonTimeCol}>
              <ArrowDownRightIcon />
              <View>
                <Text style={styles.moonTimeLabel}>Moonset</Text>
                <Text style={styles.moonTimeValue}>
                  {homeData.moon.moonset}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sunCard}>
          <View style={styles.sunCol}>
            <Text style={styles.kicker}>SUNRISE</Text>
            <Text style={styles.sunValue}>{homeData.sun.sunrise}</Text>
          </View>
          <View style={[styles.sunCol, styles.sunColCenter]}>
            <Text style={[styles.kicker, styles.goldKicker]}>GOLDEN HOUR</Text>
            <Text style={styles.sunValue}>{homeData.sun.goldenHour}</Text>
          </View>
          <View style={[styles.sunCol, styles.sunsetCol]}>
            <SunArcIcon />
            <Text style={[styles.kicker, styles.sunsetKicker]}>SUNSET</Text>
            <Text style={styles.sunValue}>{homeData.sun.sunset}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>7-Day Celestial Forecast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forecastRow}
        >
          {homeData.forecast.map((day, index) => {
            const selected = index === selectedDay;
            return (
              <Pressable
                key={day.day}
                onPress={() => setSelectedDay(index)}
                style={[
                  styles.forecastCard,
                  selected && styles.forecastCardSelected,
                ]}
              >
                <Text style={styles.forecastDay}>{day.day}</Text>
                <MoonPhaseIcon
                  illumination={day.illumination}
                  waxing={day.waxing}
                  size={34}
                />
                <Text style={styles.forecastPct}>{day.illumination}%</Text>
                <View style={styles.stars}>
                  {[0, 1, 2].map((star) => (
                    <StarIcon key={star} filled={star < day.rating} />
                  ))}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View>
              <View style={styles.infoHeader}>
                <ClockIcon />
                <Text style={styles.infoHeaderGold}>Next Eclipse</Text>
              </View>
              <Text style={styles.eclipseType}>{homeData.eclipse.type}</Text>
              <Text style={styles.eclipseDate}>{homeData.eclipse.date}</Text>
            </View>
            <Text style={styles.countdown}>{homeData.eclipse.countdown}</Text>
          </View>

          <View style={styles.infoCard}>
            <View>
              <View style={styles.infoHeader}>
                <EyeIcon />
                <Text style={styles.infoHeaderWhite}>Tonight's Sky</Text>
              </View>
              <Text style={styles.skyLine}>
                Visibility:{" "}
                <Text style={styles.skyExcellent}>
                  {homeData.sky.visibility}
                </Text>
              </Text>
              <Text style={styles.skyLine}>
                Planets:{" "}
                <Text style={styles.skyStrong}>{homeData.sky.planets}</Text>
              </Text>
            </View>
            <View>
              <Text style={styles.bestWindowLabel}>BEST WINDOW</Text>
              <Text style={styles.bestWindow}>{homeData.sky.bestWindow}</Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={["#B794F6", "#6D28D9", "#A78BFA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.astrologyBorder}
        >
          <LinearGradient
            colors={["#24183A", "#15101F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.astrologyInner}
          >
            <View style={styles.astrologyHeader}>
              <View style={styles.astrologyTitleRow}>
                <View style={styles.sparkleBadge}>
                  <SparkleIcon />
                </View>
                <View>
                  <Text style={styles.kicker}>YOUR ASTROLOGY</Text>
                  <Text style={styles.astrologySign}>
                    {homeData.astrology.sign}
                  </Text>
                </View>
              </View>
              <View style={styles.scorpioBadge}>
                <ScorpioGlyph />
              </View>
            </View>
            <Text style={styles.astrologyBlurb}>
              {homeData.astrology.blurb}
            </Text>
            <Pressable style={styles.horoscopeLink} accessibilityRole="link">
              <Text style={styles.horoscopeText}>Read Daily Horoscope</Text>
              <ChevronRightIcon />
            </Pressable>
          </LinearGradient>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoonHalo() {
  const size = 260;
  const cx = size / 2;

  return (
    <Svg
      width={size}
      height={size}
      style={styles.moonGlow}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <Stop offset="0.28" stopColor="#FFF3C4" stopOpacity="0.55" />
          <Stop offset="0.42" stopColor="#F0D070" stopOpacity="0.32" />
          <Stop offset="0.58" stopColor="#D4B15A" stopOpacity="0.14" />
          <Stop offset="0.78" stopColor="#C4A050" stopOpacity="0.05" />
          <Stop offset="1" stopColor="#C4A050" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cx} r={cx} fill="url(#moonHalo)" />
    </Svg>
  );
}

function NebulaBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={["#1A1030", "#0B0814", "#05040A"]}
        locations={[0, 0.28, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowMoon} />
      <View style={styles.glowPurple} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 28,
  },
  glowMoon: {
    position: "absolute",
    top: 90,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(180, 140, 70, 0.14)",
  },
  glowPurple: {
    position: "absolute",
    top: 420,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(110, 70, 180, 0.12)",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 18,
  },
  headerText: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: colors.text,
    fontFamily: fonts.primary.bold,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  location: {
    color: colors.goldMuted,
    fontFamily: fonts.secondary.regular,
    fontSize: 14,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  moonCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    overflow: "visible",
  },
  moonCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moonMeta: {
    flex: 1,
    paddingRight: 8,
  },
  kicker: {
    color: colors.textMuted,
    fontFamily: fonts.secondary.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  illumination: {
    color: colors.goldText,
    fontFamily: fonts.primary.bold,
    fontSize: 52,
    letterSpacing: -1.2,
    marginTop: 2,
  },
  phaseName: {
    color: colors.text,
    fontFamily: fonts.primary.semibold,
    fontSize: 20,
    marginTop: 2,
  },
  moonVisual: {
    width: 148,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -10,
    marginTop: -6,
    overflow: "visible",
  },
  moonGlow: {
    position: "absolute",
  },
  moonImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  moonTimes: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 14,
    gap: 24,
  },
  moonTimeCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  moonTimeLabel: {
    color: colors.textMuted,
    fontFamily: fonts.secondary.regular,
    fontSize: 13,
  },
  moonTimeValue: {
    color: colors.text,
    fontFamily: fonts.primary.semibold,
    fontSize: 16,
    marginTop: 1,
  },
  sunCard: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  sunCol: {
    flex: 1,
    paddingHorizontal: 4,
  },
  sunColCenter: {
    alignItems: "center",
  },
  sunsetCol: {
    alignItems: "flex-end",
  },
  goldKicker: {
    color: colors.goldMuted,
  },
  sunsetKicker: {
    marginTop: 2,
  },
  sunValue: {
    color: colors.text,
    fontFamily: fonts.primary.semibold,
    fontSize: 15,
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.primary.bold,
    fontSize: 18,
    marginTop: 22,
    marginBottom: 12,
  },
  forecastRow: {
    gap: 10,
    paddingRight: 8,
  },
  forecastCard: {
    width: 72,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
  },
  forecastCardSelected: {
    borderColor: colors.goldBorder,
  },
  forecastDay: {
    color: colors.textSecondary,
    fontFamily: fonts.secondary.semibold,
    fontSize: 13,
  },
  forecastPct: {
    color: colors.text,
    fontFamily: fonts.primary.semibold,
    fontSize: 13,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 14,
    minHeight: 148,
    justifyContent: "space-between",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  infoHeaderGold: {
    color: colors.gold,
    fontFamily: fonts.secondary.semibold,
    fontSize: 13,
  },
  infoHeaderWhite: {
    color: colors.text,
    fontFamily: fonts.secondary.semibold,
    fontSize: 13,
  },
  eclipseType: {
    color: colors.goldText,
    fontFamily: fonts.primary.bold,
    fontSize: 17,
  },
  eclipseDate: {
    color: colors.textMuted,
    fontFamily: fonts.secondary.regular,
    fontSize: 13,
    marginTop: 2,
  },
  countdown: {
    color: colors.text,
    fontFamily: fonts.primary.bold,
    fontSize: 16,
    paddingTop: 12,
  },
  skyLine: {
    color: colors.textMuted,
    fontFamily: fonts.secondary.regular,
    fontSize: 13,
    marginBottom: 4,
  },
  skyExcellent: {
    color: colors.green,
    fontFamily: fonts.primary.bold,
  },
  skyStrong: {
    color: colors.text,
    fontFamily: fonts.primary.semibold,
  },
  bestWindowLabel: {
    color: colors.textDim,
    fontFamily: fonts.secondary.bold,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  bestWindow: {
    color: colors.goldText,
    fontFamily: fonts.primary.bold,
    fontSize: 15,
    marginTop: 2,
  },
  astrologyBorder: {
    marginTop: 12,
    borderRadius: radius.lg,
    padding: 1.5,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  astrologyInner: {
    borderRadius: radius.lg - 1,
    padding: 16,
  },
  astrologyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  astrologyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  sparkleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(139, 92, 246, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
  astrologySign: {
    color: colors.text,
    fontFamily: fonts.primary.bold,
    fontSize: 20,
    marginTop: 2,
  },
  scorpioBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  astrologyBlurb: {
    color: colors.textSecondary,
    fontFamily: fonts.primary.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  horoscopeLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 2,
  },
  horoscopeText: {
    color: colors.purpleBright,
    fontFamily: fonts.primary.semibold,
    fontSize: 14,
  },
});
