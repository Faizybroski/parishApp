import React, { useState } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Switch } from "react-native";
import { Button } from "./ui/button"; // your RN Button
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/cards";
import { Checkbox } from "./ui/checkbox";
import ParishLogo from "../ui/logo";
import { Link } from "expo-router";
// import { ChevronLeft, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from "../../contexts/AuthContext";
// import { toast } from "../../hooks/use-toast";
import { useTailwind } from 'tailwindcss-react-native'; // Uncomment if using Tailwind CSS
import { useNavigation } from "@react-navigation/native";

const onboardingCards = [
  { id: 0, type: "intro-logo" },
  { id: 1, type: "intro-title", title: "Parish", description: "UNIQUE DINING EXPERIENCES EVERY WEEK", image: null },
  { id: 2, title: "Join Our Weekly Mystery Dinners", description: "Every Thursday RSVP...", image: require("../../../assets/images/Carousel 1.png") },
  { id: 3, title: "Create Your Own Dining Events", description: "Host your own event...", image: require("../../../assets/images/Carousel 2.png") },
  { id: 4, title: "Find Your Dining Companion", description: "We’ll help you connect...", image: require("../../../assets/images/Carousel 3.png") },
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

  const handleNext = () => { if (currentStep < onboardingCards.length - 1) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password, "user");
        if (error) alert("Error: " + error.message); // Replace with your error handling
          // toast({ title: "Error", description: error.message, variant: "destructive" });
        else alert("Login successful!"); // Replace with your success handling
          // toast({ title: "Welcome back!", description: "Signed in successfully." });
      } else {
        if (!isLogin && !linkedin && !instagram) {
          alert("Social Media is Required\nPlease Enter Instagram or Linkedin ");
          return;
        }
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          instagram_username: instagram,
          linkedin_username: linkedin,
          role: "user",
        });
        if (error) alert("Error: " + error.message); // Replace with your error handling
          // toast({ title: "Error", description: error.message, variant: "destructive" });
        else {Alert.alert("Account created!",
          "You will now be redirected to waiting page until approval",[
        {
          text: "OK",
          onPress: () => navigation.navigate("WaitingApproval"), // redirect here
        }
      ]);} // Replace with your success handling
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
      alert("Unexpected error: " + err.message); // Replace with your error handling
      // toast({ title: "Error", description: "Unexpected error occurred.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const currentCard = onboardingCards[currentStep];

  if (currentStep === onboardingCards.length - 1) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <View style={tailwind('flex flex-row items-center justify-center mb-6')}>
            <Button onPress={handleBack} variant="ghost" size="icon">
              <Icon name="chevron-left" style={tailwind('w-5 h-5')} size={24} color="#3b82f6" />
            </Button>
            <View style={tailwind('flex items-center')}>
            <ParishLogo />
            <Text style={styles.title}>Parish</Text>
            </View>
            <View style={tailwind("w-6")} />
          </View>

                <View style={tailwind("flex mb-6 bg-secondary/20 rounded-full p-1")}>
            <Button
              onPress={() => setIsLogin(true)}
              style={tailwind(`flex-1 py-2 rounded-full text-sm font-medium ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`)}
            >
              Login
            </Button>
            <Button
              onPress={() => setIsLogin(false)}
              style={tailwind(`flex-1 py-2 rounded-full text-sm font-medium ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`)}
            >
              Sign Up
            </Button>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#6b7280" />
              </TouchableOpacity>
            }
          />
          {!isLogin && (
            <>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
              <Input
                label="Instagram Username"
                value={instagram}
                onChangeText={setInstagram}
                placeholder="Enter your Instagram username"
              />
              <Input
                label="LinkedIn Username"
                value={linkedin}
                onChangeText={setLinkedin}
                placeholder="Enter your LinkedIn username"
              />
      <Text>I agree to the{" "}<Link href="#" style={tailwind("text-primary underline")}>Terms & Conditions</Link></Text>
      <Switch
        value={agreeToTerms}
        onValueChange={(checked) =>
                      setAgreeToTerms(checked === true)
                    }
      />
            </>
          )}


          {isLogin && (
            <View style={tailwind("text-right")}>
                  <Button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        alert("Enter your email first\nPlease enter your email in the field above.");
                        return;
                      }
                      const { error } = await resetPassword(email);
                      if (error) {
                        alert(`Error ${error.message}`);
                      } else {
                        alert("Check your email\nPassword reset link sent.",);
                      }
                    }}
                    style={tailwind("text-primary text-sm underline")}
                  >
                    Forgot Password?
                  </Button>
              </View>
)}
          <Button onPress={handleEmailLogin} disabled={!agreeToTerms || loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </Button>

          <Button variant="secondary" onPress={() => signInWithGoogle()}>
            Sign in with Google
          </Button>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        {currentCard.type === "intro-logo" && (
          <ParishLogo />
        )}
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
        <View style={styles.navigation}>
          <Button onPress={handleBack} disabled={currentStep === 0}>
            {/* <ChevronLeft width={16} height={16} /> Back */}
            <Icon name="chevron-left" size={24} color="#3b82f6" /> Back
          </Button>
          <Button onPress={handleNext}>
            {currentStep === onboardingCards.length - 1 ? "Get Started" : "Continue"}
            {/* <ChevronRight width={16} height={16} /> */}
            <Icon name="chevron-right" size={24} color="#3b82f6" />
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  card: { width: "100%", maxWidth: 400, padding: 16, borderRadius: 12 },
  logo: { width: "50%", height: undefined, aspectRatio: 1, marginVertical: 120 },
  logoSmall: { width: "30%", height: undefined, aspectRatio: 1, marginVertical: 90 },
  title: { fontSize: 32, fontWeight: "800", textAlign: "center", color: "#3b82f6", marginBottom: 8 },
  description: { fontSize: 18, textAlign: "center", color: "#6b7280", marginBottom: 24 },
  carouselImage: { width: "100%", height: 200, resizeMode: "contain", marginBottom: 16 },
  navigation: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
});
