import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Business, Product } from "@/utils/type";
import { Link, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";

const Screen = ({
  business,
  products,
}: {
  business: Business[];
  products: Product[];
}) => {
  const router = useRouter();

  const addToCart = () => {
    router.push("/(cart)/cart");
  };

  const newProduct = () => {
    router.push("/(create)/addproducts");
  };

  return (
    <ScrollView>
      {business.map((item: Business) => (
        <View key={item.businessID}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.images.map((image, index) => (
              <ImageBackground
                key={index}
                source={{ uri: image }}
                style={{ width: 400, height: 300 }}
                onError={(error) => console.log("Image load error:", error)}
              >
                <View style={styles.icons}>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => router.back()}
                  >
                    <AntDesign name="back" size={20} color="black" />
                  </TouchableOpacity>
                  <View style={styles.iconRight}>
                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() => newProduct()}
                    >
                      <AntDesign name="plus" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.icon}
                      onPress={() => addToCart()}
                    >
                      <Feather name="shopping-cart" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            ))}
          </ScrollView>
        </View>
      ))}

      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Businesses</Text>
          {business.map((item: Business) => (
            <View key={item.businessID} style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.headerText}>{item.name}</Text>
                <Text style={styles.labelText}>{item.category}</Text>
                <Text style={styles.labelText}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products</Text>
          {products.map((item: Product) => (
            <View key={item.productID} style={styles.card}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.images.map((image: string, index: number) => (
                  <Image
                    key={index}
                    style={{ width: 300, height: 200 }}
                    source={{ uri: image }}
                  />
                ))}
              </ScrollView>
              <View style={styles.textContainer}>
                <Text style={styles.headerText}>{item.name}</Text>
                <Text style={styles.labelText}>{item.description}</Text>
                <Text style={styles.labelText}>{`$${item.price}`}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.header}>
          <Text style={styles.headerText}>What to Expect</Text>
          {/* Add your navigation icons or buttons here */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Good to Know</Text>
          <Text>• Try a unique cultural experience while exploring!</Text>
          <Text>• Read a review to find out more.</Text>
          <Text>• Visit a popular attraction.</Text>
          <Text>• Plan your lunch at a traditional restaurant.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 15,
    paddingBottom: 40, //  // Top border radius
  },
  iconRight: {
    flexDirection: "row",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {},
  errorText: {
    color: "white",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textContainer: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#eee",
  },
  icons: {
    marginLeft: 30,

    marginTop: 50,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 25,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
export default Screen;
