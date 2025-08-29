import React from 'react';
import { ScrollView, Text, } from 'react-native';
import { useTailwind } from "tailwindcss-react-native";
import { Check } from 'lucide-react-native'; // Use lucide-react-native for RN
import { Card, CardContent } from '../../ui/card';

interface DietaryPreferencesStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const DIETARY_OPTIONS = [
  { id: 'vegetarian', name: 'Vegetarian', description: 'No meat or fish' },
  { id: 'vegan', name: 'Vegan', description: 'No animal products' },
  { id: 'gluten_free', name: 'Gluten-Free', description: 'No gluten-containing foods' },
  { id: 'dairy_free', name: 'Dairy-Free', description: 'No dairy products' },
  { id: 'keto', name: 'Keto', description: 'Low-carb, high-fat diet' },
  { id: 'paleo', name: 'Paleo', description: 'Whole foods, no processed items' },
  { id: 'halal', name: 'Halal', description: 'Islamic dietary laws' },
  { id: 'kosher', name: 'Kosher', description: 'Jewish dietary laws' },
  { id: 'no_restrictions', name: 'No Restrictions', description: 'I eat everything!' }
];

export const DietaryPreferencesStep: React.FC<DietaryPreferencesStepProps> = ({ data, updateData }) => {
  const tailwind = useTailwind();
  const togglePreference = (preference: string) => {
    const currentPreferences = data.dietary_preferences || [];

    if (preference === 'no_restrictions') {
      updateData('dietary_preferences', ['no_restrictions']);
      return;
    }

    let newPreferences;
    if (currentPreferences.includes(preference)) {
      newPreferences = currentPreferences.filter((p: string) => p !== preference);
    } else {
      newPreferences = [
        ...currentPreferences.filter((p: string) => p !== 'no_restrictions'),
        preference
      ];
    }

    updateData('dietary_preferences', newPreferences);
  };

  const isSelected = (preference: string) => {
    return (data.dietary_preferences || []).includes(preference);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ScrollView style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#F7C992' }}>
          Dietary Preferences
        </Text>
        <Text style={{ color: '#FEFEFE', opacity: 0.7, marginTop: 4 }}>
          Select any dietary restrictions or preferences you have
        </Text>
      </ScrollView>

      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {DIETARY_OPTIONS.map((option) => {
          const selected = isSelected(option.id);

          return (
            <Card
              key={option.id}
              onPress={() => togglePreference(option.id)} // use onPress for RN
              className={`w-[48%] mb-4 rounded-lg border ${
                selected
                  ? 'border-[#9DC0B3] bg-[#9DC0B3]/10'
                  : 'border-[#333] hover:border-[#9DC0B3]/50 hover:bg-[#1f1f1f]'
              }`}
            >
              <CardContent className="p-3 flex-row items-center space-x-3">
                <ScrollView
                  style={tailwind(`h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selected
                      ? 'border-[#9DC0B3] bg-[#9DC0B3]'
                      : 'border-[#666]'
                  }`) as any}
                >
                  {selected && <Check size={14} color="#121212" />}
                </ScrollView>
                <ScrollView style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '500', color: '#FEFEFE' }}>{option.name}</Text>
                  <Text style={{ fontSize: 12, color: '#9DC0B3', opacity: 0.8 }}>
                    {option.description}
                  </Text>
                </ScrollView>
              </CardContent>
            </Card>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
};
