import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fonts } from "../theme";

const backgroundImage = require("../../assets/images/splash/lunarscope-space-background.webp");
const logoImage = require("../../assets/images/splash/lunarscope-logo.png");

export function LunarScopeSplash() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const contentTranslateY = useRef(new Animated.Value(16)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const loaderRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const entranceAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 12,
          stiffness: 90,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.stagger(160, [
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.7,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const loaderAnimation = Animated.loop(
      Animated.timing(loaderRotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    entranceAnimation.start();
    glowAnimation.start();
    loaderAnimation.start();

    return () => {
      entranceAnimation.stop();
      glowAnimation.stop();
      loaderAnimation.stop();
    };
  }, [
    contentTranslateY,
    glowOpacity,
    loaderRotation,
    logoOpacity,
    logoScale,
    taglineOpacity,
    titleOpacity,
  ]);

  const loaderRotate = loaderRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.brandContainer,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { translateY: contentTranslateY },
                ],
              },
            ]}
          >
            <Image
              source={logoImage}
              resizeMode="contain"
              style={styles.logo}
              accessibilityLabel="LunarScope"
            />
          </Animated.View>

          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: contentTranslateY }],
              },
            ]}
          >
            Explore the night sky
          </Animated.Text>
        </View>

        <Animated.View
          accessibilityLabel="Loading"
          style={[
            styles.loader,
            {
              transform: [{ rotate: loaderRotate }],
            },
          ]}
        >
          <View style={styles.loaderCutout} />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B1D",
  },

  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backgroundImage: {
    backgroundColor: "#070B1D",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(3, 6, 22, 0.22)",
  },

  centerGlow: {
    position: "absolute",
    top: "28%",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(88, 75, 255, 0.18)",

    ...Platform.select({
      ios: {
        shadowColor: "#604DFF",
        shadowOpacity: 0.75,
        shadowRadius: 80,
        shadowOffset: {
          width: 0,
          height: 0,
        },
      },
      android: {
        elevation: 12,
      },
    }),
  },

  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    transform: [{ translateY: -30 }],
  },

  brandContainer: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  titleLunar: {
    color: "#F7F8FF",
  },

  titleScope: {
    color: "#7F7CFF",
  },

  tagline: {
    marginTop: -50,
    color: "#B3BDDC",
    fontSize: 18,
    letterSpacing: 4,
    textAlign: "center",
    fontFamily: fonts.secondary.regular,
    fontWeight: "300",
  },

  loader: {
    position: "absolute",
    bottom: 70,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 4,
    borderTopColor: "#8B7CFF",
    borderRightColor: "#5DD8FF",
    borderBottomColor: "rgba(93, 216, 255, 0.15)",
    borderLeftColor: "rgba(139, 124, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  loaderCutout: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#070B1D",
  },
});
