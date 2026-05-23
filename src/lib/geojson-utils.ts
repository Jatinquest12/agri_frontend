import type { GeoPoint } from "@/types/platform";

export type GeoJsonPolygonFeature = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties?: Record<string, string | number | boolean>;
};

/** Convert `{lat,lng}` points to a closed GeoJSON Polygon Feature (lon, lat order). */
export function boundaryPointsToGeoJson(
  points: GeoPoint[],
  properties?: Record<string, string | number | boolean>,
): GeoJsonPolygonFeature | null {
  if (points.length < 3) return null;

  const ring: number[][] = points.map((p) => [p.lng, p.lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  if (ring.length < 4) return null;

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
    properties: properties ?? { source: "agritrust-ui" },
  };
}

export function parseBoundaryJson(text: string): GeoPoint[] | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!Array.isArray(parsed)) return null;
    const points: GeoPoint[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as GeoPoint).lat === "number" &&
        typeof (item as GeoPoint).lng === "number"
      ) {
        points.push({
          lat: (item as GeoPoint).lat,
          lng: (item as GeoPoint).lng,
        });
      }
    }
    return points.length >= 3 ? points : null;
  } catch {
    return null;
  }
}
