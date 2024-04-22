import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useForm, Controller, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "react-native-get-random-values";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Business } from "@/utils/type";
import { s3 } from "@/utils/bucket";
import { useRouter } from "expo-router";
import { businessSchema } from "@/utils/constants";
import { atob } from "react-native-quick-base64";

const NewBusinessForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(businessSchema),
  });

  const router = useRouter();
  const [images, setImages] = useState<any>([]);

  const { mutate } = useMutation({
    mutationFn: (data: Business) =>
      axios.post(
        `http://${process.env.EXPO_PUBLIC_URL}:8080/postBusiness`,
        data
      ),
    onError: (error) => {
      console.log(error);
    },
    onSuccess(res) {
      console.log("Sucess ", res);
      router.push({
        pathname: "/(create)/location",
        params: { id: res.data.businessID },
      });
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      selectionLimit: 6,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    //@ts-ignore
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data: Business) => {
    try {
      let uri = [];
      data.businessID = uuidv4();

      if (images) {
        for (let image of images) {
          const img = await fetchImageFromUri(image);
          let file = { uri: img, name: uuidv4() };
          await s3(file);
          uri.push(`${process.env.EXPO_PUBLIC_LINK}${file.name}` || "");
        }
      }
      data.images = uri;
      await mutate(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}> Ready for Something New? 👀</Text>
        <Text style={styles.subHeaderText}>Show us something!</Text>

        <ScrollView horizontal contentContainerStyle={styles.imageScrollView}>
          {images
            ? images.map((image: string, index: number) => (
                <>
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => removeImage(index)}
                    >
                      <Feather name="trash-2" size={24} color="white" />
                    </Pressable>
                  </View>
                </>
              ))
            : null}
          <Pressable style={styles.addImageButton} onPress={pickImage}>
            <Text style={styles.addImageText}>Add Image</Text>
          </Pressable>
        </ScrollView>

        <Text style={styles.labelText}>Name</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="name"
          defaultValue=""
        />
        {errors.name && (
          <Text style={styles.errorText}>
            Name is required (max 255 characters).
          </Text>
        )}

        <Text style={styles.labelText}>Description</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.largeInput]} // Added textAlignVertical
              multiline={true}
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="description"
          defaultValue=""
        />
        {errors.description && (
          <Text style={styles.errorText}>Description is required.</Text>
        )}

        <Text style={styles.labelText}>Category</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder=""
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              value={value}
            />
          )}
          name="category"
          defaultValue=""
        />
        {errors.category && (
          <Text style={styles.errorText}>Category is required.</Text>
        )}

        <Pressable
          style={[styles.button, isSubmitting && styles.disabledButton]}
          //@ts-ignore
          onPress={handleSubmit(onSubmitForm)}
          disabled={isSubmitting} // Disable the button when isLoading is true
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 10,
    backgroundColor: "white",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  largeInput: {
    height: 160,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 350,
    height: 300,
    borderRadius: 10,
  },
  imageScrollView: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
  addImageButton: {
    marginVertical: 10,
    width: 350,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderStyle: "dashed",
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    color: "grey",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewBusinessForm;
