import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "./hooks/useWarmUpBrowser";
import { Image } from "expo-image";
import { blurhash } from "@/utils/constants";

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
    
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);

    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('@/assets/images/appicon.png')}
        placeholder={blurhash}
        transition={1000}
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
