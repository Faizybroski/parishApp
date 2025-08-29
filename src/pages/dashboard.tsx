import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../integrations/supabase/client";
// import EventsCarousel from "../components/events/EventsCarousel";
import { useMyUpcomingEvents } from "../hooks/useMyUpcomingEvents";
import { useTailwind } from "tailwindcss-react-native";
import { ScrollView, View, Text } from "react-native";


interface CrossedPath {
  id: string;
  matched_at: string;
  location_name: string;
  is_active: boolean;
  user1_id: string;
  user2_id: string;
  total_crosses: number;
  locations: string[];
  location_details?: Array<{
    name: string;
    address?: string;
    cross_count: number;
  }>;
  matched_user: {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    profile_photo_url: string;
    job_title: string;
    location_city: string;
    dining_style: string;
    dietary_preferences: string[];
    gender_identity: string;
  };
}
const Dashboard = () => {
  const tailwind = useTailwind();
  const navigate = useNavigation();
  const { myUpcomingEvents, loading } = useMyUpcomingEvents();
  const [crossedLoading, setCrossedLoading] = useState(true);
  const { user } = useAuth();
  const [crossedPaths, setCrossedPaths] = useState<CrossedPath[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    CrossedPath["matched_user"] | null
  >(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCrossedPath, setSelectedCrossedPath] =
    useState<CrossedPath | null>(null);
  const { profile } = useProfile();
  const [walletPayments, setWalletPayments] = useState<WalletPayment[]>([]);
  useEffect(() => {
    if (profile) {
      fetchCrossedPaths();
      fetchWalletPayments();
    }
  }, [profile]);
  const fetchWalletPayments = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("events_payments")
        .select(
          `
        id,
        creator_id,
        event_id,
        created_at,
        withdraw_status,
        events:event_id (
          id,
          name,
          event_fee,
          date_time,
          location_name
        )
      `
        )
        .eq("creator_id", profile.user_id)
        .eq("withdraw_status", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWalletPayments(data || []);
    } catch (err) {
      console.error("Error fetching wallet payments:", err);
      alert("Error\nFailed to load wallet payments");
    }
  };
  const fetchCrossedPaths = async () => {
    if (!profile) return;

    try {
      // First get basic crossed paths using proper foreign key joins
      const { data: crossedPathsData, error } = await supabase
        .from("crossed_paths")
        .select(
          `
          *,
          user1:profiles!crossed_paths_user1_id_fkey(
            id, user_id, first_name, last_name, profile_photo_url, job_title, 
            location_city, dining_style, dietary_preferences, gender_identity
          ),
          user2:profiles!crossed_paths_user2_id_fkey(
            id, user_id, first_name, last_name, profile_photo_url, job_title, 
            location_city, dining_style, dietary_preferences, gender_identity
          )
        `
        )
        .or(`user1_id.eq.${profile.user_id},user2_id.eq.${profile.user_id}`)
        .eq("is_active", true)
        .order("matched_at", { ascending: false })
        .limit(2);

      if (error) {
        console.error("Error fetching crossed paths:", error);
        setCrossedPaths([]);
        return;
      }

      // Now get aggregated data from crossed_paths_log for each pair
      const enrichedPaths = await Promise.all(
        (crossedPathsData || []).map(async (path: any) => {
          const otherUserId =
            path.user1_id === profile.user_id
              ? path.user2.user_id
              : path.user1.user_id;
          const userAId =
            profile.user_id < otherUserId ? profile.user_id : otherUserId;
          const userBId =
            profile.user_id < otherUserId ? otherUserId : profile.user_id;

          // Get all crossed path logs for this user pair
          const { data: logData } = await supabase
            .from("crossed_paths_log")
            .select("restaurant_name, cross_count")
            .eq("user_a_id", userAId)
            .eq("user_b_id", userBId);

          const locations =
            logData?.map((log) => log.restaurant_name).filter(Boolean) || [];
          const totalCrosses =
            logData?.reduce((sum, log) => sum + (log.cross_count || 1), 0) || 1;

          // Create location_details array with proper structure
          const locationDetails =
            logData?.reduce((acc, log) => {
              if (!log.restaurant_name) return acc;

              const existing = acc.find(
                (item) => item.name === log.restaurant_name
              );
              if (existing) {
                existing.cross_count += log.cross_count || 1;
              } else {
                acc.push({
                  name: log.restaurant_name,
                  cross_count: log.cross_count || 1,
                });
              }
              return acc;
            }, [] as Array<{ name: string; cross_count: number }>) || [];

          return {
            ...path,
            matched_user:
              path.user1_id === profile.user_id ? path.user2 : path.user1,
            total_crosses: totalCrosses,
            locations: [...new Set(locations)], // Remove duplicates
            location_details: locationDetails,
          };
        })
      );

      setCrossedPaths(enrichedPaths);
    } catch (error: any) {
      console.error("Error in fetchCrossedPaths:", error);
      setCrossedPaths([]);
      alert("Error\nFailed to load crossed paths");
    } finally {
      setCrossedLoading(false);
    }
  };

  const handleInviteToDinner = (path: CrossedPath) => {
    setSelectedCrossedPath(path);
    setShowInviteModal(true);
  };

  const viewProfile = (user: CrossedPath["matched_user"]) => {
    setSelectedUserProfile(user);
    setShowProfileModal(true);
  };
  return (
    // <ScrollView style={tailwind("min-h-screen bg-background px-4 py-6") as any}>
    //   <ScrollView style={tailwind("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8") as any}>
    //     <ScrollView style={tailwind("space-y-8") as any}>
    //       {/* Header */}
    //       <ScrollView style={tailwind("flex flex-col sm:flex-row sm:items-center sm:justify-between") as any}>
    //         <ScrollView>
    //           <Text style={tailwind("text-3xl font-bold text-foreground") as any}>
    //             Welcome back!
    //           </Text>
    //           <Text style={tailwind("text-muted-foreground mt-1")as any}>
    //             Ready for your next dining adventure?
    //           </Text>
    //         </ScrollView>
    //         <ScrollView style={tailwind("justify-end") as any}>
    //           <Button
    //             className="bg-peach-gold hover:bg-peach-gold/90 mt-4 sm:mt-0 me-2"
    //             // onPress={() => navigate.navigate("/explore")}
    //           >
    //             {" "}
    //             ScrollView All Events
    //           </Button>
    //           <Button
    //             // onPress={() => navigate.navigate("create-event")}
    //             className="bg-peach-gold hover:bg-peach-gold/90 mt-4 sm:mt-0"
    //           >
    //             Create Event
    //           </Button>
    //         </ScrollView>
    //       </ScrollView>

    //       {/* Featured Admin Events Carousel */}
    //       {/* <EventsCarousel /> */}
    //       <Card className="shadow-card border-border mt-6">
    //         <CardHeader>
    //           <CardTitle className="flex items-center justify-between">
    //             My Wallet
    //             <Button
    //               variant="outline"
    //               size="sm"
    //               // onPress={() => navigate.navigate("/wallet/withdraw")}
    //             >
    //               Request Withdrawal
    //             </Button>
    //           </CardTitle>
    //         </CardHeader>
    //         <CardContent className="overflow-auto">
    //           {walletPayments?.length === 0 ? (
    //             <Text style={("text-muted-foreground") as any}>
    //               No payments received yet.
    //             </Text>
    //           ) : (
    //             <table className="min-w-full text-sm text-left border border-border rounded-lg overflow-hidden">
    //               <thead className="bg-muted text-muted-foreground">
    //                 <tr>
    //                   <th className="Text-3 whitespace-nowrap">Event</th>
    //                   <th className="Text-3 whitespace-nowrap">Date</th>
    //                   <th className="Text-3 whitespace-nowrap">Gross</th>
    //                   <th className="Text-3 whitespace-nowrap">Admin Fee (15%)</th>
    //                   <th className="Text-3 whitespace-nowrap">You Got</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {walletPayments.map((payment) => {
    //                   const gross = payment.events?.event_fee || 0;
    //                   const fee = gross * 0.15;
    //                   const net = gross - fee;
    //                   return (
    //                     <tr
    //                       key={payment.id}
    //                       className="border-t border-border hover:bg-muted/50 transition"
    //                     >
    //                       <td className="Text-3">
    //                         {payment.events?.name || "Unknown Event"}
    //                       </td>
    //                       <td className="Text-3">
    //                         {payment.events?.date_time
    //                           ? format(
    //                               new Date(payment.events.date_time),
    //                               "MMM dd, yyyy"
    //                             )
    //                           : "-"}
    //                       </td>
    //                       <td className="Text-3">${gross}</td>
    //                       <td className="Text-3 text-red-500">
    //                         -${fee.toFixed(2)}
    //                       </td>
    //                       <td className="Text-3 text-green-600">
    //                         ${net.toFixed(2)}
    //                       </td>
    //                     </tr>
    //                   );
    //                 })}
    //               </tbody>
    //             </table>
    //           )}
    //         </CardContent>
    //       </Card>

    //       {/* Main Content Grid */}
    //       <ScrollView style={tailwind("grid grid-cols-1 lg:grid-cols-2 gap-8") as any}>
    //         <Card className="shadow-card border-border">
    //           <CardHeader>
    //             <CardTitle className="flex items-center justify-between">
    //               <Text>My Upcoming Events</Text>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 // onPress={() => navigate.navigate("/events")}
    //               >
    //                 <Text>View All</Text>
    //               </Button>
    //             </CardTitle>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             {loading ? (
    //               <Text style={tailwind("text-muted-foreground") as any}>
    //                 Loading your events...
    //               </Text>
    //             ) : myUpcomingEvents.length === 0 ? (
    //               <Text style={("text-muted-foreground") as any}>
    //                 No upcoming events found.
    //               </Text>
    //             ) : (
    //               myUpcomingEvents.map((event) => (
    //                 // <Link to={`/event/${event.id}/details`} key={event.id}>
    //                   <ScrollView style={tailwind("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 Text-4 bg-dark-surface rounded-lg hover:bg-muted transition-colors duration-200") as any}>
    //                     <ScrollView style={tailwind("flex flex-col space-y-1 min-w-0") as any}>
    //                       <Text style={tailwind("font-semibold text-lg text-foreground truncate") as any}>
    //                         {event.name}
    //                       </Text>
    //                       <ScrollView style={tailwind("flex flex-wrap items-center gap-4 text-sm text-muted-foreground") as any}>
    //                         <Text style={tailwind("flex items-center gap-1") as any}>
    //                           {format(new Date(event.date_time), "MMM dd")}
    //                         </Text>
    //                         <Text style={tailwind("flex items-center gap-1") as any}>
    //                           {format(new Date(event.date_time), "hh:mm a")}
    //                         </Text>
    //                         <Text style={tailwind("flex items-center gap-1 truncate max-w-[200px]") as any}>
    //                           {event.location_name}
    //                         </Text>
    //                       </ScrollView>
    //                     </ScrollView>
    //                     <ScrollView style={tailwind("flex flex-wrap items-center gap-2 sm:shrink-0") as any}>

    //                         <Text>{event.creator_id === user?.id
    //                           ? "Creator"
    //                           : "Attending"}
    //                         </Text>
    //                       <Text style={tailwind("text-sm text-muted-foreground") as any}>
    //                         {event.rsvp_count || 0} attending
    //                       </Text>
    //                     </ScrollView>
    //                   </ScrollView>
    //                 // </Link>
    //               ))
    //             )}
    //           </CardContent>
    //         </Card>

    //         <Card className="shadow-card border-border">
    //           <CardHeader>
    //             <CardTitle className="flex items-center justify-between">
    //               <Text style={tailwind("flex items-center") as any}>
    //                 Crossed Paths
    //               </Text>
    //               <Button
    //                 variant="outline"
    //                 size="sm"
    //                 // onPress={() => navigate.navigate("/crossed-paths")}
    //               >
    //                 ScrollView All
    //               </Button>
    //             </CardTitle>
    //             <CardDescription>
    //               <Text>People you've encountered at similar places</Text>
    //             </CardDescription>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             {crossedPaths.map((path) => (
    //               <ScrollView
    //                 key={path.id}
    //                 style={tailwind("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 Text-2 bg-dark-surface rounded-lg") as any}
    //               >
    //                 <ScrollView style={tailwind("flex items-center space-x-4 min-w-0") as any}>
    //                   <ScrollView style={tailwind("h-10 w-10 bg-sage-green/20 rounded-full flex items-center justify-center") as any}>
    //                     <Text style={tailwind("text-sage-green font-semibold") as any}>
    //                       {path.matched_user.first_name?.[0]}
    //                       {path.matched_user.last_name?.[0]}
    //                     </Text>
    //                   </ScrollView>
    //                   <ScrollView style={tailwind("min-w-0") as any}>
    //                     <Text style={tailwind("font-semibold text-foreground truncate") as any}>
    //                       {path.matched_user.first_name}{" "}
    //                       {path.matched_user.last_name}
    //                     </Text>
    //                     <ScrollView style={tailwind("flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground") as any}>
    //                       {path.locations.length > 0 && (
    //                         <Text style={tailwind("truncate max-w-[180px]") as any}>
    //                           {path.locations.join(", ")}
    //                         </Text>
    //                       )}
    //                       {/* <Badge
    //                         variant="outline"
    //                         className="text-xs font-medium"
    //                       > */}
    //                         <Text>{path.total_crosses} x</Text> 
    //                       {/* </Badge> */}
    //                       <Text>•</Text>
    //                       <Text>
    //                         {new Date(path.matched_at).toLocaleDateString()}
    //                       </Text>
    //                     </ScrollView>
    //                   </ScrollView>
    //                 </ScrollView>
    //                 <ScrollView style={tailwind("flex gap-2 sm:shrink-0") as any}>
    //                   <Button
    //                     onPress={() => handleInviteToDinner(path)}
    //                     variant="outline"
    //                     size="sm"
    //                     className="border-sage-green text-sage-green hover:bg-sage-green/10"
    //                   >
    //                     Invite
    //                   </Button>
    //                   <Button
    //                     onPress={() => viewProfile(path.matched_user)}
    //                     variant="outline"
    //                     size="sm"
    //                   >
    //                     {/* <User className="h-4 w-4" /> */}
    //                     User
    //                   </Button>
    //                 </ScrollView>
    //               </ScrollView>
    //             ))}
    //           </CardContent>
    //         </Card>
    //       </ScrollView>

    //       {/* Quick Actions */}
    //       <ScrollView style={tailwind("grid grid-cols-1 md:grid-cols-3 gap-4") as any}>
    //         <Card className="shadow-card border-border cursor-pointer hover:shadow-glow transition-shadow">
    //           {/* <Link to={`/create-event/`}> */}
    //             <CardContent className="Text-6 text-center">
    //               <ScrollView style={tailwind("h-12 w-12 bg-peach-gold/20 rounded-full flex items-center justify-center mx-auto mb-4") as any}>
    //                 {/* <Plus className="h-6 w-6 text-peach-gold" /> */}
    //                 <Text>+</Text>
    //               </ScrollView>
    //               <Text style={tailwind("font-semibold mb-2") as any}>Create Event</Text>
    //               <Text style={tailwind("text-sm text-muted-foreground") as any}>
    //                 Host your own dining experience
    //               </Text>
    //             </CardContent>
    //           {/* </Link> */}
    //         </Card>

    //         <Card
    //           className="shadow-card border-border cursor-pointer hover:shadow-glow transition-shadow"
    //           // onPress={() => navigate.navigate("/explore")}
    //         >
    //           <CardContent className="Text-6 text-center">
    //             <ScrollView style={tailwind("h-12 w-12 bg-sage-green/20 rounded-full flex items-center justify-center mx-auto mb-4") as any}>
    //               {/* <Search className="h-6 w-6 text-sage-green" /> */}
    //               <Text>Search</Text>
    //             </ScrollView>
    //             <Text style={tailwind("font-semibold mb-2") as any}>Explore Events</Text>
    //             <Text style={tailwind("text-sm text-muted-foreground") as any}>
    //               Find dining events near you
    //             </Text>
    //           </CardContent>
    //         </Card>

    //         <Card className="shadow-card border-border cursor-pointer hover:shadow-glow transition-shadow">
    //           {/* <Link to={`/feedback/`}> */}
    //             <CardContent className="Text-6 text-center">
    //               <ScrollView style={tailwind("h-12 w-12 bg-mystery-purple/20 rounded-full flex items-center justify-center mx-auto mb-4") as any}>
    //                 {/* <Star className="h-6 w-6 text-mystery-purple" /> */}
    //                 *
    //               </ScrollView>
    //               <Text style={tailwind("font-semibold mb-2") as any}>Give Feedback</Text>
    //               <Text style={tailwind("text-sm text-muted-foreground") as any}>
    //                 Rate your recent experiences
    //               </Text>
    //             </CardContent>
    //           {/* </Link> */}
    //         </Card>
    //       </ScrollView>
    //     </ScrollView>
    //   </ScrollView>
    // </ScrollView>
    <ScrollView style={tailwind(`min-h-screen bg-background px-4 py-6`) as any}>
      {/* Header */}
      <View style={tailwind(`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6`) as any}>
        <View>
          <Text style={tailwind(`text-3xl font-bold text-foreground`) as any}>Welcome back!</Text>
          <Text style={tailwind(`text-muted-foreground mt-1`) as any}>
            Ready for your next dining adventure?
          </Text>
        </View>
        <View style={tailwind(`flex-row mt-4 sm:mt-0`) as any}>
          <Button className="bg-peach-gold mr-2">All Events</Button>
          <Button className="bg-peach-gold">Create Event</Button>
        </View>
      </View>

      {/* Wallet */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex-row justify-between items-center">
            <Text>My Wallet</Text>
            <Button variant="outline" size="sm">Request Withdrawal</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {walletPayments.length === 0 ? (
            <Text style={tailwind(`text-muted-foreground`) as any}>No payments received yet.</Text>
          ) : (
            walletPayments.map((payment) => {
              const gross = payment.events?.event_fee || 0;
              const fee = gross * 0.15;
              const net = gross - fee;
              return (
                <View key={payment.id} style={tailwind(`flex-row justify-between py-3 border-b border-border`) as any}>
                  <Text style={tailwind(`flex-1`) as any}>{payment.events?.name || "Unknown Event"}</Text>
                  <Text style={tailwind(`flex-1`) as any}>
                    {payment.events?.date_time ? format(new Date(payment.events.date_time), "MMM dd, yyyy") : "-"}
                  </Text>
                  <Text style={tailwind(`flex-1`) as any}>${gross}</Text>
                  <Text style={tailwind(`flex-1 text-red-500`) as any}>-${fee.toFixed(2)}</Text>
                  <Text style={tailwind(`flex-1 text-green-600`) as any}>${net.toFixed(2)}</Text>
                </View>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className='mt-8'>
        <CardHeader>
          <CardTitle className='flex-row justify-between items-center'>
            <Text>My Upcoming Events</Text>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Text style={tailwind(`text-muted-foreground`) as any}>Loading your events...</Text>
          ) : myUpcomingEvents.length === 0 ? (
            <Text style={tailwind(`text-muted-foreground`) as any}>No upcoming events found.</Text>
          ) : (
            myUpcomingEvents.map((event) => (
              <View
                key={event.id}
                style={tailwind(`flex-row justify-between items-center p-4 bg-dark-surface rounded-lg mb-3`) as any}
              >
                <View style={tailwind(`flex-1`) as any}>
                  <Text style={tailwind(`font-semibold text-lg text-foreground`) as any} numberOfLines={1}>
                    {event.name}
                  </Text>
                  <Text style={tailwind(`text-muted-foreground text-sm`) as any}>
                    {format(new Date(event.date_time), "MMM dd")} •{" "}
                    {format(new Date(event.date_time), "hh:mm a")} • {event.location_name}
                  </Text>
                </View>
                <View>
                  <Text>{event.creator_id === user?.id ? "Creator" : "Attending"}</Text>
                  <Text style={tailwind(`text-sm text-muted-foreground`) as any}>
                    {event.rsvp_count || 0} attending
                  </Text>
                </View>
              </View>
            ))
          )}
        </CardContent>
      </Card>

      {/* Crossed Paths */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex-row justify-between items-center">
            <Text>Crossed Paths</Text>
            <Button variant="outline" size="sm">See All</Button>
          </CardTitle>
          <CardDescription>
            <Text>People you’ve encountered at similar places</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {crossedPaths.map((path) => (
            <View
              key={path.id}
              style={tailwind(`flex-row justify-between items-center p-4 bg-dark-surface rounded-lg mb-3`) as any}
            >
              <View style={tailwind(`flex-row items-center flex-1`) as any}>
                <View style={tailwind(`h-10 w-10 bg-sage-green/20 rounded-full items-center justify-center mr-3`) as any}>
                  <Text style={tailwind(`text-sage-green font-semibold`) as any}>
                    {path.matched_user.first_name?.[0]}
                    {path.matched_user.last_name?.[0]}
                  </Text>
                </View>
                <View style={tailwind(`flex-1`) as any}>
                  <Text style={tailwind(`font-semibold text-foreground`) as any} numberOfLines={1}>
                    {path.matched_user.first_name} {path.matched_user.last_name}
                  </Text>
                  <Text style={tailwind(`text-muted-foreground text-sm`) as any} numberOfLines={1}>
                    {path.locations.join(", ")} • {path.total_crosses}x •{" "}
                    {new Date(path.matched_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={tailwind(`flex-row`) as any}>
                <Button onPress={() => handleInviteToDinner(path)} variant="outline" size="sm">
                  Invite
                </Button>
                <Button onPress={() => viewProfile(path.matched_user)} variant="outline" size="sm" className="ml-2">
                  User
                </Button>
              </View>
            </View>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <View style={tailwind(`mt-8 flex-row flex-wrap gap-4`) as any}>
        <Card className="flex-1">
          <CardContent className="items-center p-6">
            <View style={tailwind(`h-12 w-12 bg-peach-gold/20 rounded-full items-center justify-center mb-3`) as any}>
              <Text style={tailwind(`text-peach-gold text-xl`) as any}>+</Text>
            </View>
            <Text style={tailwind(`font-semibold`) as any}>Create Event</Text>
            <Text style={tailwind(`text-sm text-muted-foreground`) as any}>Host your own dining experience</Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="items-center p-6">
            <View style={tailwind(`h-12 w-12 bg-sage-green/20 rounded-full items-center justify-center mb-3`) as any}>
              <Text style={tailwind(`text-sage-green`) as any}>Search</Text>
            </View>
            <Text style={tailwind(`font-semibold`) as any}>Explore Events</Text>
            <Text style={tailwind(`text-sm text-muted-foreground`) as any}>Find dining events near you</Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="items-center p-6">
            <View style={tailwind(`h-12 w-12 bg-mystery-purple/20 rounded-full items-center justify-center mb-3`) as any}>
              <Text style={tailwind(`text-mystery-purple`) as any}>★</Text>
            </View>
            <Text style={tailwind(`font-semibold`) as any}>Give Feedback</Text>
            <Text style={tailwind(`text-sm text-muted-foreground`) as any}>Rate your recent experiences</Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
