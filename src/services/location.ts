import * as Location from "expo-location";

export class LocationPermissionError extends Error {
  constructor() {
    super("Location permission was denied");
    this.name = "LocationPermissionError";
  }
}

export type CurrentPlace = {
  latitude: number;
  longitude: number;
  city: string | null;
  region: string | null;
  country: string | null;
  isoCountryCode: string | null;
  label: string;
};

const US_STATE_ABBREVIATIONS: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

function isUnitedStates(address: Location.LocationGeocodedAddress) {
  const code = address.isoCountryCode?.toUpperCase();
  return code === "US" || address.country === "United States";
}

function toUsStateAbbreviation(region: string | null) {
  if (!region) {
    return null;
  }

  const trimmed = region.trim();

  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return US_STATE_ABBREVIATIONS[trimmed] ?? trimmed;
}

function firstPresent(...values: (string | null | undefined)[]) {
  return values.find((value) => value != null && value.trim().length > 0) ?? null;
}

function joinLabel(primary: string | null, secondary: string | null) {
  if (primary && secondary && primary !== secondary) {
    return `${primary}, ${secondary}`;
  }

  return primary ?? secondary ?? "Unknown location";
}

export function formatPlaceLabel(
  address?: Location.LocationGeocodedAddress | null,
) {
  if (!address) {
    return "Unknown location";
  }

  const city = firstPresent(address.city, address.subregion, address.district);
  const secondary = isUnitedStates(address)
    ? toUsStateAbbreviation(address.region)
    : address.country;

  return joinLabel(city, secondary);
}

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function toCurrentPlace(
  coords: Coordinates,
  address?: Location.LocationGeocodedAddress | null,
): CurrentPlace {
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    city: address?.city ?? null,
    region: address?.region ?? null,
    country: address?.country ?? null,
    isoCountryCode: address?.isoCountryCode ?? null,
    label: address ? formatPlaceLabel(address) : "Current location",
  };
}

export async function getCurrentCoordinates(): Promise<Coordinates> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new LocationPermissionError();
  }

  const position =
    (await Location.getLastKnownPositionAsync()) ??
    (await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }));

  if (!position) {
    throw new Error("Unable to determine current location");
  }

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export async function getCurrentPlace(): Promise<CurrentPlace> {
  const coords = await getCurrentCoordinates();

  try {
    const [address] = await Location.reverseGeocodeAsync(coords);
    return toCurrentPlace(coords, address);
  } catch {
    return toCurrentPlace(coords);
  }
}
