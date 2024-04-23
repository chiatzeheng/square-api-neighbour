import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { blurhash } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Fuse from "fuse.js";
import { Business, Product } from "@/utils/type";

const Header = ({
  businesses,
  products,
}: {
  businesses: Business;
  products: Product;
}) => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [extensionItems, setExtensionItems] = useState([]);
  const [showExtension, setShowExtension] = useState(false);

  const extensionScaleY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (searchResults.length > 0) {
      showExtensionWithAnimation(searchResults);
    } else {
      hideExtension();
    }
  }, [searchResults]);

  const fuseOptions = {
    keys: ["name", "description", "category"],
    threshold: 0.3,
  };

  const searchData = [...businesses, ...products];
  const fuse = new Fuse(searchData, fuseOptions);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    if (!text) {
      setSearchResults([]);
      hideExtension();
      return;
    }
    const results = fuse.search(text);
    const items = results.map((result) => result.item);
    setSearchResults(items);
  };

  const showExtensionWithAnimation = (items) => {
    setShowExtension(true);
    setExtensionItems(items);
    Animated.timing(extensionScaleY, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideExtension = () => {
    Animated.timing(extensionScaleY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowExtension(false);
      setExtensionItems([]);
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
              <Feather name="shopping-cart" size={20} color="grey" />
            </Link>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#BDBDBD"
          onChangeText={handleSearch}
          value={searchTerm}
        />

        <Pressable style={styles.profileContainer} onPress={route}>
          <Image
            style={styles.profileImage}
            source={{ uri: user.imageUrl }}
            placeholder={blurhash}
            transition={1000}
          />
        </Pressable>
      </View>
      <Animated.ScrollView style={{ maxHeight: 200 }}>
        {extensionItems.map((item, index) => (
          <View key={index} style={styles.resultItem}>
            <Image
              source={{ uri: item?.images[0] }}
              style={styles.resultImage}
            />
            <Text style={styles.resultText}>{item?.name}</Text>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "white",
    marginTop: 50,
    marginHorizontal: 16,
    borderRadius: 25,
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
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
    paddingVertical: 10,
    elevation: 3,
    position: "absolute",
    top: 90,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  resultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  resultText: {
    fontSize: 16,
    color: "#333333",
  },
});

export default Header;
