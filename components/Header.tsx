import React from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { blurhash } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn) return null;
  const route = () =>
    router.push({
      pathname: `/(user)/user`,
      params: {
        name: `${user.firstName}`,
        image: user.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      },
    });

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
        <Feather
          name="search"
          size={18}
          color="#BDBDBD"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#BDBDBD"
        />
      </View>
      <Pressable style={styles.profileContainer} onPress={route}>
        <Image
          style={styles.profileImage}
          source={{ uri: user.imageUrl }}
          placeholder={blurhash}
          transition={1000}
        />
      </Pressable>
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
