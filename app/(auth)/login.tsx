import React from "react";
import { useAuth  } from "@clerk/clerk-expo";
import SignInWithOAuth from "@/components/SignInWithOAuth";
import { Redirect } from "expo-router";
 
export default function Login() {
  let{ isLoaded, userId } = useAuth();

  if (isLoaded || userId) return <Redirect href="/(main)/dashboard" />
  else return <SignInWithOAuth />

}

