import React, { useState } from "react";
import { ScrollView, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card, CardContent } from "../../ui/card"; // your custom RN Card
import { useTailwind } from "tailwindcss-react-native";
import { Navigation, MapPin } from "lucide-react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface LocationStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ data, updateData }) => {
  const tailwind = useTailwind();
  const [locating, setLocating] = useState(false);

  const getCurrentLocation = async () => {
    setLocating(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      console.warn("Location not supported");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locationData = await response.json();

          const city =
            locationData.city || locationData.locality || locationData.countryName;

          updateData("location_city", city);
          updateData("location_lat", latitude);
          updateData("location_lng", longitude);

          console.log("✅ Location found:", city);
        } catch (error) {
          updateData("location_lat", latitude);
          updateData("location_lng", longitude);
          updateData(
            "location_city",
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );

          console.log("⚡ Using raw coordinates");
        }

        setLocating(false);
      },
      () => {
        console.warn("Location access denied");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <ScrollView style={tailwind("space-y-4 p-4") as any}>
      {/* Header */}
      <ScrollView style={tailwind("items-center space-y-2") as any}>
        <Text style={tailwind("text-xl font-semibold") as any}>Where are you located?</Text>
        <Text style={tailwind("text-gray-500 text-center") as any}>
          This helps us show you events in your area
        </Text>
      </ScrollView>

      {/* Use Current Location */}
      <Card>
        <CardContent className="p-4">
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={locating}
            style={tailwind(
              "flex-row items-center justify-center rounded-lg py-3 bg-amber-400"
            ) as any}
          >
            {locating ? (
              <ActivityIndicator size="small" color="#000" style={tailwind("mr-2") as any} />
            ) : (
              <Navigation size={18} style={tailwind("mr-2 text-black") as any} />
            )}
            <Text style={tailwind("font-medium text-black") as any}>
              {locating ? "Getting your location..." : "Use Current Location"}
            </Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* OR Divider */}
      <ScrollView style={tailwind("flex-row items-center my-2") as any}>
        <ScrollView style={tailwind("flex-1 h-px bg-gray-300") as any} />
        <Text style={tailwind("mx-2 text-gray-500 text-sm") as any}>or</Text>
        <ScrollView style={tailwind("flex-1 h-px bg-gray-300") as any} />
      </ScrollView>

      {/* Manual Input w/ Google Places */}
      <ScrollView>
        <Text style={tailwind("text-sm font-medium mb-2") as any}>Enter your city manually</Text>
        <ScrollView style={tailwind("flex-row items-center relative") as any}>
          <MapPin size={16} style={tailwind("absolute left-3 top-3 text-gray-400") as any} />
          <GooglePlacesAutocomplete
            placeholder="e.g., New York, NY"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const city = details?.name || data.description;
              const lat = details?.geometry?.location?.lat;
              const lng = details?.geometry?.location?.lng;

              if (city) updateData("location_city", city);
              if (lat && lng) {
                updateData("location_lat", lat);
                updateData("location_lng", lng);
              }
            }}
            query={{
              key: "YOUR_GOOGLE_API_KEY",
              language: "en",
              types: "(cities)",
            }}
            styles={{
              textInput: tailwind("pl-10 border border-gray-300 rounded-lg py-2 px-3"),
              container: { flex: 1 },
            }}
          />
        </ScrollView>
      </ScrollView>
    </ScrollView>
  );
};
