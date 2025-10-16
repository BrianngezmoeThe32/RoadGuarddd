import * as Location from "expo-location";

class LocationService {
  static async requestLocationPermission() {
    try {
      console.log("📍 Requesting location permission...");

      let { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();
      console.log(
        "📍 Current permission status:",
        status,
        "Can ask again:",
        canAskAgain
      );

      // If permission is already granted, return true
      if (status === "granted") {
        return true;
      }

      // If we can ask again, request permission
      if (canAskAgain) {
        const { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        console.log("📍 New permission status:", newStatus);
        return newStatus === "granted";
      }

      // If we can't ask again and permission isn't granted, show instructions
      if (status !== "granted" && !canAskAgain) {
        throw new Error(
          "Location permission denied. Please enable location permissions for Roadguard in your device settings."
        );
      }

      return false;
    } catch (error) {
      console.warn("Location permission error:", error);
      throw error;
    }
  }

  static async getCurrentPosition() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) throw new Error("Location permission required.");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const address = await this.getAddressFromCoords(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp),
        address, // <- add this
      };
    } catch (error) {
      throw error;
    }
  }

  // Simplified version without watching for now
  static async getLocationOnce() {
    return await this.getCurrentPosition();
  }

  static async getAddressFromCoords(latitude, longitude) {
    try {
      const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (geo) {
        const formattedAddress = `${geo.name || ""} ${geo.street || ""}, ${
          geo.subregion || ""
        }, ${geo.city || ""}, ${geo.region || ""}, ${geo.country || ""}`;

        return formattedAddress;
      }

      return "Unknown address";
    } catch (error) {
      console.warn("❌ Reverse geocoding error:", error);
      return "Unable to get address";
    }
  }
}

export default LocationService;
