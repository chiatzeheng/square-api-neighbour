import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { blurhash } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";

const Header = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) return null;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.cartContainer}>
      <View style={styles.cartIconContainer}>
          <Link href={{ pathname: "/cart" }}>
            <Feather name="shopping-cart" size={20} color="black" />
          </Link>
        </View>

      </View>
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#BDBDBD" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#BDBDBD"
        />
      </View>
      <View style={styles.profileContainer}>
        <Link href={{ pathname: `/(user)/${user.id}` }}>
          <Image
            style={styles.profileImage}
            source={{ uri: user.imageUrl }}
            placeholder={blurhash}
            transition={1000}
          />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    height: 60,
    marginTop: 50,
    marginHorizontal: 16,
    borderRadius: 25,
    overflow: "hidden",
  },
  
  cartContainer: {
    paddingHorizontal: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,

  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  profileContainer: {
    paddingHorizontal: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 25,
  },
  cartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;