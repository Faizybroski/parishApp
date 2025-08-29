import React, { useState } from "react";
import {
  Alert,
  // Button,
  ScrollView,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleProp, 
  View,
  ViewStyle, 
  TextStyle,
  StyleSheet,
  Switch,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Button as BButton } from "./ui/button"; // your RN Button
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/cards";
import { Checkbox } from "./ui/checkbox";
import ParishLogo from "../ui/logo";
import { Link } from "expo-router";
// import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react-native";
import Icon from "react-native-vector-icons/Feather";
import { useAuth } from "../../contexts/AuthContext";
// import { toast } from "../../hooks/use-toast";
import { useTailwind } from "tailwindcss-react-native"; // Uncomment if using Tailwind CSS
import { useNavigation } from "@react-navigation/native";

const onboardingCards = [
  { id: 0, type: "intro-logo" },
  {
    id: 1,
    type: "intro-title",
    title: "Parish",
    description: "UNIQUE DINING EXPERIENCES EVERY WEEK",
    image: null,
  },
  {
    id: 2,
    title: "Join Our Weekly Mystery Dinners",
    description: "Every Thursday RSVP...",
    image: require("../../../assets/images/Carousel 1.png"),
  },
  {
    id: 3,
    title: "Create Your Own Dining Events",
    description: "Host your own event...",
    image: require("../../../assets/images/Carousel 2.png"),
  },
  {
    id: 4,
    title: "Find Your Dining Companion",
    description: "We’ll help you connect...",
    image: require("../../../assets/images/Carousel 3.png"),
  },
];

export const OnboardingCarousel = () => {
  const tailwind = useTailwind();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();

  const handleNext = () => {
    if (currentStep < onboardingCards.length - 1)
      setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error)
          alert(`Error: \n${error.message}`); // Replace with your error handling
        // toast({ title: "Error", description: error.message, variant: "destructive" });
        else alert("Login successful!"); // Replace with your success handling
        // toast({ title: "Welcome back!", description: "Signed in successfully." });
      } else {
        if (!isLogin && !linkedin && !instagram) {
          alert(
            "Social Media is Required\nPlease Enter Instagram or Linkedin "
          );
          return;
        }
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          instagram_username: instagram,
          linkedin_username: linkedin,
          role: "user",
        });
        if (error)
          alert(`Error: \n${error.message}`); // Replace with your error handling
        // toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
          Alert.alert(
            "Account created!",
            "You will now be redirected to waiting page until approval",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("WaitingApproval"), // redirect here
              },
            ]
          );
        } // Replace with your success handling
        // toast({ title: "Account Created!", description: "Check your email for verification." });
        if (!error) {
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
          setLinkedin("");
          setInstagram("");
        }
      }
    } catch (err) {
      alert(`Unexpected Error: \n${err.message}`); // Replace with your error handling
      // toast({ title: "Error", description: "Unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const currentCard = onboardingCards[currentStep];

  if (currentStep === onboardingCards.length - 1) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <ScrollView
            style={tailwind("flex flex-row items-center justify-center mb-6") as StyleProp<ViewStyle>}
          >
            <BButton onPress={handleBack} variant="ghost" size="icon">
              <Icon
                name="chevron-left"
                style={tailwind("w-5 h-5")  }
                size={24}
                color="#3b82f6"
              />
            </BButton>
            <ScrollView style={tailwind("flex items-center") as StyleProp<ViewStyle>}>
              <ParishLogo />
              <Text style={styles.title}>Parish</Text>
            </ScrollView>
            <ScrollView style={tailwind("w-6") as StyleProp<ViewStyle>} />
          </ScrollView>

          <ScrollView style={tailwind("flex mb-6 bg-secondary/20 rounded-full p-1") as StyleProp<ViewStyle>}>

            <TouchableOpacity
              onPress={() => setIsLogin(true)}
              style={tailwind(
              `flex-1 py-2 rounded-full text-sm font-medium ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`
              ) as StyleProp<ViewStyle>}
            >
            <Text
              style={tailwind(
                !isLogin
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              ) as StyleProp<TextStyle>}
            >
              Login
            </Text>
            </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsLogin(false)}
            style={tailwind(
              `flex-1 py-2 rounded-full text-sm font-medium ${
                !isLogin
                  ? "bg-primary"
                  : "bg-transparent"
              }`
            ) as StyleProp<ViewStyle>}
          >
            <Text
              style={tailwind(
                !isLogin
                  ? "text-primary-foreground"
                  : "text-muted-foreground"
              ) as StyleProp<TextStyle>}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          </ScrollView>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {!isLogin && (
            <>
              <Input
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
              <Input
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
              <Input
                value={instagram}
                onChangeText={setInstagram}
                placeholder="Enter your Instagram username"
              />
              <Input
                value={linkedin}
                onChangeText={setLinkedin}
                placeholder="Enter your LinkedIn username"
              />
              <Text>
                I agree to the{" "}
                <Link href="#" style={tailwind("text-primary underline") as StyleProp<TextStyle>}>
                  Terms & Conditions
                </Link>
              </Text>
              <Switch
                value={agreeToTerms}
                onValueChange={(checked) => setAgreeToTerms(checked === true)}
              />
            </>
          )}

          {isLogin && (
            <ScrollView style={tailwind("text-right") as StyleProp<ViewStyle>}>
              <TouchableOpacity
                onPress={async () => {
                  if (!email) {
                    alert("Enter your email first\nPlease enter your email in the field above.");
                    return;
                  }
                  const { error } = await resetPassword(email);
                  if (error) {
                    alert(`Error: \n${error.message}`);
                  } else {
                    alert("Check your email\nPassword reset link sent.");
                  }
                }}
              >
                <Text style={tailwind("text-primary text-sm underline") as StyleProp<TextStyle>}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
          <BButton
            onPress={handleEmailLogin}
            disabled={(!isLogin && !agreeToTerms) || loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </BButton>

          <BButton variant="secondary" onPress={() => signInWithGoogle()}>
            Sign in with Google
          </BButton>
        </Card>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        {currentCard.type === "intro-logo" && <ParishLogo />}
        {currentCard.type === "intro-title" && (
          <>
            <ParishLogo />
            <Text style={styles.title}>{currentCard.title}</Text>
            <Text style={styles.description}>{currentCard.description}</Text>
          </>
        )}
        {currentCard.type === undefined && (
          <>
            <Text style={styles.title}>{currentCard.title}</Text>
            <Image source={currentCard.image} style={styles.carouselImage} />
            <Text style={styles.description}>{currentCard.description}</Text>
          </>
        )}

        {/* Navigation Buttons */}
        <ScrollView contentContainerStyle={styles.navigation}>
          <BButton onPress={handleBack} disabled={currentStep === 0}>
            <Icon name="chevron-left" size={24} color="black" /> Back
          </BButton>
          <BButton onPress={handleNext}>
            {currentStep === onboardingCards.length - 1
              ? "Get Started"
              : "Continue"}
            <Icon name="chevron-right" size={24} color="black" />
          </BButton>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: { width: "100%", maxWidth: 400, padding: 16, borderRadius: 12 },
  logo: {
    width: "50%",
    height: undefined,
    aspectRatio: 1,
    marginVertical: 120,
  },
  logoSmall: {
    width: "30%",
    height: undefined,
    aspectRatio: 1,
    marginVertical: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#3b82f6",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  carouselImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
