import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker"; // easier for RN than <input type="file" />
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Button as BButton } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Camera, Upload, User } from "lucide-react-native"; // RN version
import { supabase } from "../../../integrations/supabase/client";
import { useAuth } from "../../../contexts/AuthContext";
import { useTailwind } from "tailwindcss-react-native";

interface PhotoUploadStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({ data, updateData }) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const tailwind = useTailwind();

  const handleFileUpload = async () => {
    if (!user) return;

    // ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission Denied\nYou need to allow access to your photos.");
      return;
    }

    // open picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    setUploading(true);

    try {
      const fileExt = file.uri.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      // upload file
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(filePath);

      updateData("profile_photo_url", publicUrl);

      alert("Photo uploaded!\nYour profile photo has been saved successfully.");
    } catch (error: any) {
      alert(`Upload failed\n${error.message  || "Failed to upload photo"}`);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ScrollView style={{ alignItems: "center", marginBottom: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Add a profile photo</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>
          Help others recognize you at events (optional)
        </Text>
      </ScrollView>

      <ScrollView style={{ alignItems: "center" }}>
        <Avatar className="h-32 w-32 border-4 border-border">
          <AvatarImage src={data.profile_photo_url} />
          <AvatarFallback>
            {data.profile_photo_url ? <User size={48} /> : getInitials()}
          </AvatarFallback>
        </Avatar>

        <ScrollView style={{ marginTop: 16, width: "100%", alignItems: "center" }}>
          <Button
            onPress={handleFileUpload}
            disabled={uploading}
            className="bg-sage-green hover:bg-sage-green/90"
          >
            {uploading ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
                Uploading...
              </>
            ) : (
              <>
                <Camera size={18} style={{ marginRight: 8 }} />
                {data.profile_photo_url ? "Change Photo" : "Upload Photo"}
              </>
            )}
          </Button>

          {data.profile_photo_url && (
            <BButton
              variant="outline"
              onPress={() => updateData("profile_photo_url", "")}
              className="w-full"
            >
              Remove Photo
            </BButton>
          )}
        </ScrollView>

        <Card className="w-full border-border bg-muted/20 mt-6">
          <CardContent className="p-4">
            <ScrollView style={{ flexDirection: "row" }}>
              <Camera size={20} color="#888" style={{ marginRight: 8 }} />
              <ScrollView>
                <Text style={{ fontWeight: "600", marginBottom: 4 }}>Photo Tips:</Text>
                <Text style={{ fontSize: 12 }}>• Use a clear, recent photo of yourself</Text>
                <Text style={{ fontSize: 12 }}>• Make sure your face is visible</Text>
                <Text style={{ fontSize: 12 }}>• Avoid group photos or heavily filtered images</Text>
              </ScrollView>
            </ScrollView>
          </CardContent>
        </Card>
      </ScrollView>
    </ScrollView>
  );
};
