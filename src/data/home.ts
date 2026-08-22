export type ForecastDay = {
  day: string;
  illumination: number;
  waxing: boolean;
  rating: number;
};

export const homeData = {
  userName: "Luna",
  forecast: [
    { day: "Mon", illumination: 78, waxing: true, rating: 3 },
    { day: "Tue", illumination: 86, waxing: true, rating: 2 },
    { day: "Wed", illumination: 94, waxing: true, rating: 1 },
    { day: "Thu", illumination: 100, waxing: true, rating: 0 },
    { day: "Fri", illumination: 93, waxing: false, rating: 1 },
    { day: "Sat", illumination: 84, waxing: false, rating: 2 },
    { day: "Sun", illumination: 74, waxing: false, rating: 3 },
  ] satisfies ForecastDay[],
  eclipse: {
    type: "Partial Lunar",
    date: "Mar 14, 2026",
    countdown: "46 d  18 h  24 m",
  },
  sky: {
    visibility: "Excellent",
    planets: "3 visible",
    bestWindow: "11 PM – 2 AM",
  },
  astrology: {
    sign: "Scorpio Sun",
    blurb:
      "Intuitive currents run deep tonight. The Gibbous illumination amplifies your raw Scorpio focus—trust the silent whispers of your subconscious.",
  },
};
