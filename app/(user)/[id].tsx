import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { blurhash } from "@/utils/constants";
import { Link, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    try {
      signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: user?.imageUrl }}
          placeholder={blurhash}
          transition={1000}
        />
        <Text style={styles.name}>{`${user?.firstName} ${
          user?.lastName || ""
        }`}</Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
        <Text style={styles.divider}></Text>
        <Link to="/(page)/[id]">
         <Text style={styles.additionalInfo}>Apply for a Business?</Text>
        </Link>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

ProfileScreen.navigationOptions = ({ navigation }: any) => ({
  headerShown: true,
  headerLeft: () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,

  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666666",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#CCCCCC",
    marginVertical: 10,
  },
  additionalInfo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoItem: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 3,
  },
  logoutButton: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  backButton: {
    marginLeft: 10,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: "#333333",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
