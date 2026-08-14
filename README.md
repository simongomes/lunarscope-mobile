# Lunar Scope

A mobile app that shows the current lunar phase of the moon.

Built with [Expo](https://expo.dev) SDK 57 and React Native. iOS, Android, and web from a single TypeScript codebase.

> **Status:** early development. The app currently shows a landing screen; moon-phase data and the rest of the product are still being built.

## Features

Planned for the first release:

- Current moon phase and illumination
- Moonrise, moonset, and best viewing windows
- Sunrise and sunset for your location
- Countdown to the next full moon and eclipse
- 7-day celestial forecast

See [plan.md](./plan.md) for the full product roadmap.

## Tech stack

| | |
| --- | --- |
| Framework | Expo SDK 57 |
| UI | React Native 0.86, React 19 |
| Language | TypeScript |
| Layout | `react-native-safe-area-context` |

## Prerequisites

- [Node.js LTS](https://nodejs.org/)
- npm (comes with Node)
- [Expo Go](https://expo.dev/go) on a physical device, or an iOS Simulator / Android Emulator

For native iOS builds you need a Mac with Xcode. For Android builds you need Android Studio. See [Expo’s environment setup](https://docs.expo.dev/get-started/set-up-your-environment/).

## Getting started

```bash
git clone https://github.com/<your-org>/lunarscope-mobile.git
cd lunarscope-mobile
npm install
npx expo start
```

Then:

- Scan the QR code with **Expo Go** (same Wi-Fi as your computer)
- Press `i` for the iOS Simulator
- Press `a` for the Android Emulator
- Press `w` to open in a browser

If the QR code does not load on a public or guest network, start with a tunnel:

```bash
npx expo start --tunnel
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run ios` | Build and run on iOS (`expo run:ios`) |
| `npm run android` | Build and run on Android (`expo run:android`) |
| `npm run web` | Start the app in a browser |

## Project structure

```text
├── App.tsx          # Root UI
├── index.ts         # Expo entry point
├── app.json         # Expo config (name, icons, platforms)
├── package.json     # Dependencies and scripts
├── assets/          # App icon, splash, and favicon
└── plan.md          # Product roadmap
```

Expo config lives in `app.json`. The JavaScript package name is `moon-phases`; the product name shown in the app is **Lunar Scope**.

## License

This project currently uses the MIT license from the Expo project template. See [LICENSE](./LICENSE).
