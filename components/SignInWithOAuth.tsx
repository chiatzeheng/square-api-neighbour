import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "./useWarmUpBrowser";
import { SvgXml } from "react-native-svg";
import Toast from "@/utils/toast";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  // Warm up the android browser to improve UX
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      let { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        // @ts-ignore
        setActive({ session: createdSessionId });
        Toast.success("Success");
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
      Toast.error("Something Went Wrong");
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}> 
      <Image
        source={require("@/assets/images/appicon.png")} // Your logo image
        style={styles.logo}
      />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#A4EBD6", // Button color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    // Button text color
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignIn;
