import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTailwind } from 'tailwindcss-react-native';

interface GenderStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const GENDER_OPTIONS = [
  { id: 'female', name: 'Female' },
  { id: 'male', name: 'Male' },
  { id: 'non_binary', name: 'Non-binary' },
  { id: 'prefer_not_to_say', name: 'Prefer not to say' }
];

export const GenderStep: React.FC<GenderStepProps> = ({ data, updateData }) => {
  const tailwind = useTailwind();
  const handleGenderSelect = (genderId: string) => {
    updateData('gender_identity', genderId);
  };

  return (
    <ScrollView style={tailwind("space-y-4") as any}>
      <ScrollView style={tailwind("text-center space-y-2") as any}>
        <Text style={tailwind("text-xl font-semibold") as any}>Gender Identity</Text>
        <Text style={tailwind("text-muted-foreground") as any}>
          This helps us create a comfortable environment for everyone
        </Text>
      </ScrollView>
      
      <ScrollView style={tailwind("grid grid-cols-1 gap-3") as any}>
        {GENDER_OPTIONS.map((option) => {
          const isSelected = data.gender_identity === option.id;
          
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-card ${
                isSelected 
                  ? 'border-peach-gold bg-peach-gold/10' 
                  : 'border-border hover:border-peach-gold/50'
              }`}
              onPress={() => handleGenderSelect(option.id)}
            >
              <CardContent className="p-4">
                <ScrollView style={tailwind("flex items-center space-x-3") as any}>
                  <ScrollView style={tailwind(`h-4 w-4 rounded-full border-2 ${
                    isSelected 
                      ? 'border-peach-gold bg-peach-gold' 
                      : 'border-muted-foreground'
                  }`) as any} />
                  <span className="font-medium">{option.name}</span>
                </ScrollView>
              </CardContent>
            </Card>
          );
        })}
      </ScrollView>

    </ScrollView>
  );
};