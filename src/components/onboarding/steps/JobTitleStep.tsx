import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card, CardContent } from "../../ui/card"; // ✅ your custom RN Card
import { useTailwind } from "tailwindcss-react-native";

interface JobTitleStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const COMMON_JOBS = [
  "Software Engineer",
  "Marketing Manager",
  "Designer",
  "Teacher",
  "Doctor",
  "Lawyer",
  "Consultant",
  "Entrepreneur",
  "Student",
  "Other",
];

export const JobTitleStep: React.FC<JobTitleStepProps> = ({
  data,
  updateData,
}) => {
  const tailwind = useTailwind();
  const handleJobSelect = (job: string) => {
    if (job === "Other") {
      updateData("job_title", "");
    } else {
      updateData("job_title", job);
    }
  };

  return (
    <ScrollView style={tailwind("space-y-4") as any}>
      {/* Header */}
      <ScrollView style={tailwind("text-center space-y-2") as any}>
        <Text style={tailwind("text-xl font-semibold") as any}>What do you do?</Text>
        <Text style={tailwind("text-muted-foreground") as any}>
          Share your profession to connect with like-minded people
        </Text>
      </ScrollView>

      {/* Input field */}
      <ScrollView style={tailwind("space-y-4") as any}>
        <ScrollView>
          <Text style={styles.label}>Job Title or Profession</Text>
          <TextInput
            style={tailwind("mt-2") as any}
            placeholder="Enter your job title or profession"
            value={data.job_title || ""}
            onChangeText={(text) => updateData("job_title", text)}
          />
        </ScrollView>

      {/* Common job options */}
      <ScrollView>
        <Text style={tailwind("text-sm text-muted-foreground mb-3") as any}>Or choose from common options:</Text>
        <ScrollView style={tailwind("grid grid-cols-2 md:grid-cols-3 gap-2") as any}>
          {COMMON_JOBS.map((job) => (
            <Card
              key={job}
              className={`cursor-pointer transition-all hover:shadow-card ${
                data.job_title === job
                  ? 'border-sage-green bg-sage-green/10' 
                  : 'border-border hover:border-sage-green/50'
                }`}
              onPress={() => handleJobSelect(job)}
            >
                <CardContent className="p-3 text-center">
                  <Text
                    style={tailwind("text-sm font-medium") as any}
                  >
                    {job}
                  </Text>
                </CardContent>
            </Card>
          ))}
        </ScrollView>
      </ScrollView>
            </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 4,
  },
  inputWrapper: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  optionText: {
    fontSize: 13,
    color: "gray",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardSelected: {
    borderColor: "#2e7d32",
    backgroundColor: "rgba(46, 125, 50, 0.1)",
  },
  cardContent: {
    padding: 12,
    alignItems: "center",
  },
  cardText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  cardTextSelected: {
    color: "#2e7d32",
  },
});
