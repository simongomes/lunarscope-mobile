import { useId } from "react";
import Svg, { Circle, ClipPath, Defs, G, RadialGradient, Stop } from "react-native-svg";

type MoonPhaseIconProps = {
  illumination: number;
  waxing?: boolean;
  size?: number;
};

export function MoonPhaseIcon({
  illumination,
  waxing = true,
  size = 36,
}: MoonPhaseIconProps) {
  const uid = useId().replace(/:/g, "");
  const frac = Math.min(1, Math.max(0, illumination / 100));
  const darkCx = waxing ? 50 - frac * 100 : 50 + frac * 100;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id={`moon-${uid}`}>
          <Circle cx="50" cy="50" r="46" />
        </ClipPath>
        <RadialGradient id={`lit-${uid}`} cx="36%" cy="34%" r="70%">
          <Stop offset="0" stopColor="#F4EBD8" />
          <Stop offset="1" stopColor="#C4B496" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="46" fill="#1C1828" />
      <G clipPath={`url(#moon-${uid})`}>
        <Circle cx="50" cy="50" r="46" fill={`url(#lit-${uid})`} />
        <Circle cx={darkCx} cy="50" r="46" fill="#161320" />
      </G>
      <Circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
    </Svg>
  );
}
