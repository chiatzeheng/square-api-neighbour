import React from "react";
import { View, StyleSheet } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { blurhash } from "@/utils/constants";

const Header = () => {
 const { isLoaded, isSignedIn, user } = useUser();
 if (!isLoaded || !isSignedIn) return null;

 return (
   <View style={styles.headerContainer}>
     <Link href= {{ pathname: `/(user)/${user.id}`}} >
       <Image
         style={styles.image}
         source={{ uri: user.imageUrl }}
         placeholder={blurhash}
         transition={1000}
       />
     </Link>
   </View>
 );
};
const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    marginTop: 50,
    backgroundColor: "white",
    marginHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    flexDirection: "row",
  },
  image: {
    borderRadius: 25,
    height: 50,
    width: 50,
    marginRight: "auto", // Push the image to the left end of the container
    alignSelf: "center", // Center the image vertically
  },
 });


 
export default Header;