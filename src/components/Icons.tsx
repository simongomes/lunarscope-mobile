import Svg, { Circle, Line, Path } from "react-native-svg";

type IconProps = {
  color?: string;
  size?: number;
  filled?: boolean;
};

export function PinIcon({ color = "#D4B15A", size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s7-5.4 7-11.2A7 7 0 1 0 5 9.8C5 15.6 12 21 12 21Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="9.5" r="2.2" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function BellIcon({ color = "#C5C1D1", size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9.5A6 6 0 0 1 18 9.5c0 7 2 8 2 8H4s2-1 2-8Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 20a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ArrowUpRightIcon({ color = "#D4B15A", size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 17 17 7M9 7h8v8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArrowDownRightIcon({ color = "#9AA3B5", size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 7 17 17M17 9v8H9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClockIcon({ color = "#D4B15A", size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 8.5V12l3 2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EyeIcon({ color = "#D4B15A", size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2.6" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

export function SparkleIcon({ color = "#C4B5FD", size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5 13.6 9.2 19 10.5 13.6 11.8 12 17.5 10.4 11.8 5 10.5 10.4 9.2 12 3.5Z"
        fill={color}
      />
      <Path d="M18.2 15.2 19 17.4 21.2 18.2 19 19 18.2 21.2 17.4 19 15.2 18.2 17.4 17.4 18.2 15.2Z" fill={color} />
    </Svg>
  );
}

export function ChevronRightIcon({ color = "#B794F6", size = 14 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StarIcon({
  filled,
  color = "#D4B15A",
  size = 10,
}: IconProps & { filled: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.4 14.6 9l6.2.7-4.6 4.2 1.3 6.1L12 16.8 6.5 20l1.3-6.1L3.2 9.7 9.4 9 12 3.4Z"
        fill={filled ? color : "none"}
        stroke={filled ? color : "#6E6A7C"}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HomeTabIcon({ color, size = 22, filled }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11.2 12 4.5l8 6.7V20a1 1 0 0 1-1 1h-5.2v-6.2H10.2V21H5a1 1 0 0 1-1-1v-8.8Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CompassTabIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={color} strokeWidth={1.8} />
      <Path
        d="m14.8 9.2-1.4 4.2-4.2 1.4 1.4-4.2 4.2-1.4Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarTabIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 7.5h14v12.2H5V7.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path d="M5 11.2h14" stroke={color} strokeWidth={1.8} />
      <Path d="M8.2 5.2v3.2M15.8 5.2v3.2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function GlobeTabIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.2" stroke={color} strokeWidth={1.8} />
      <Path d="M3.8 12h16.4" stroke={color} strokeWidth={1.6} />
      <Path
        d="M12 3.8c2.4 2.4 3.6 5.2 3.6 8.2s-1.2 5.8-3.6 8.2C9.6 17.8 8.4 15 8.4 12s1.2-5.8 3.6-8.2Z"
        stroke={color}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function ProfileTabIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8.2" r="3.3" stroke={color} strokeWidth={1.8} />
      <Path
        d="M5.2 19.4c1.2-3.2 3.6-4.8 6.8-4.8s5.6 1.6 6.8 4.8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SunArcIcon({ size = 42 }: { size?: number }) {
  const height = size * 0.48;
  return (
    <Svg width={size} height={height} viewBox="0 0 48 22" fill="none">
      <Path
        d="M4 18C8 8 16 4 24 4s16 4 20 14"
        stroke="#D4B15A"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <Circle cx="40" cy="9" r="4.2" fill="#E8C547" />
    </Svg>
  );
}

export function ScorpioGlyph({ color = "#C4B5FD", size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5c0-2 1.4-3.5 3.2-3.5S10.4 8.5 10.4 10.5V16M10.4 10.5c0-2 1.4-3.5 3.2-3.5s3.2 1.5 3.2 3.5V16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M16.8 16h3.2l-1.8 2.4M16.8 16l1.8 2.4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="10.4" y1="16" x2="16.8" y2="16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
