import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Animated,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { blurhash } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Fuse from "fuse.js"; // Import Fuse

import Search from "./SearchBar";

const Header = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showExtensions, setShowExtension] = useState(false); // State for extension visibility
  const [extensionItems, setExtensionItems] = useState([]); // State for extension items

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  // Your array of objects to search through
  const data = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    // Add more objects as needed
  ];

  // Fuse options
  const fuseOptions = {
    keys: ["name"], // Specify the keys to search in
    threshold: 0.3, // Adjust this as needed
  };

  // Initialize Fuse
  const fuse = new Fuse(data, fuseOptions);

  // Search function
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (!text) {
      setSearchResults([]);
      hideExtension(); // Hide extension if search term is empty
      return;
    }
    const results = fuse.search(text);
    const items = results.map((result) => result.item);
    setSearchResults(items);
    showExtension(items); // Show extension with search results
    setExtensionItems(items);
  };

  const showExtension = (items) => {
    setShowExtension(true);
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: items.length * 30, // Adjust height based on content
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideExtension = () => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowExtension(false);
    });
  };

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
      <View style={styles.headerContent}>
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
            onChangeText={handleSearch} // Call handleSearch on text change
            value={searchTerm}
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

      {showExtension && ( // Render extension if showExtension is true
        <Animated.View
          style={[
            styles.extensionContainer,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            },
          ]}
        >
          {extensionItems.map((item) => (
            <Text key={item.id}>{item.name}</Text>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
    marginTop: 50,
    marginHorizontal: 16,
    borderRadius: 25,
    overflow: "hidden", // Add padding to accommodate the extension
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 60, // Default height of the header
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
  extensionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    overflow: "hidden", // Hide overflow content when collapsed
    elevation: 3, // Add elevation for shadow
  },
});

export default Header;
