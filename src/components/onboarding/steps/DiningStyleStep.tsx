import React from "react";
import { ScrollView, Text, Pressable } from "react-native";
import { Card, CardContent } from "../../ui/card"; // ✅ your custom UI
import { UtensilsCrossed, Coffee, Wine, Users } from "lucide-react-native"; // RN version

interface DiningStyleStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const DINING_STYLES = [
  {
    id: "adventurous",
    name: "Adventurous",
    description: "Love trying new and exotic cuisines",
    icon: UtensilsCrossed,
  },
  {
    id: "foodie_enthusiast",
    name: "Foodie Enthusiast",
    description: "Passionate about fine food and cooking",
    icon: Coffee,
  },
  {
    id: "local_lover",
    name: "Local Lover",
    description: "Prefer neighborhood spots and local gems",
    icon: Users,
  },
  {
    id: "comfort_food",
    name: "Comfort Food",
    description: "Enjoy hearty, familiar dishes",
    icon: Wine,
  },
  {
    id: "health_conscious",
    name: "Health Conscious",
    description: "Focus on nutritious and organic options",
    icon: Coffee,
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Dining is all about the company",
    icon: Users,
  },
];

export const DiningStyleStep: React.FC<DiningStyleStepProps> = ({
  data,
  updateData,
}) => {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ScrollView style={{ alignItems: "center", marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#F7C992" }}>
          What's your dining style?
        </Text>
      </ScrollView>

      <ScrollView style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {DINING_STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = data.dining_style === style.id;

          return (
            <Pressable
              key={style.id}
              style={{ flexBasis: "48%", marginBottom: 12 }}
              onPress={() => updateData("dining_style", style.id)}
            >
              <Card
                className={`rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#9DC0B3] bg-[#9DC0B3]/10"
                    : "border-[#333] bg-[#1e1e1e]"
                }`}
              >
                <CardContent className="p-4 items-center">
                  <ScrollView
                    contentContainerStyle={{
                      height: 48,
                      width: 48,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                      backgroundColor: isSelected ? "#9DC0B333" : "#2a2a2a",
                    }}
                  >
                    <Icon
                      size={24}
                      color={isSelected ? "#9DC0B3" : "#F7C992"}
                    />
                  </ScrollView>
                  <Text
                    style={{ fontWeight: "600", fontSize: 16, color: "#FEFEFE" }}
                  >
                    {style.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: "center",
                      color: isSelected ? "#9DC0B3" : "rgba(239,239,239,0.6)",
                    }}
                  >
                    {style.description}
                  </Text>
                </CardContent>
              </Card>
            </Pressable>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
};
