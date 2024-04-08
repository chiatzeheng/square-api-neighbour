import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Image } from "expo-image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "react-native-get-random-values";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Business } from "@/utils/type";
import * as FileSystem from "expo-file-system";
import { s3 } from "@/utils/bucket";

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.string().min(1),
});

const NewBusinessForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>();

  const { mutate } = useMutation({
    mutationFn: (data: Business) => axios.post("/business", { data }),
    onError: (error) => {
      console.log(error);
    },
    onSuccess(data) {},
  });

  //USEFUL FOR MULTIPLE IMAGES
  //   const pickImage = async () => {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       setImages([...images, result.assets[0].uri]);
  //     }
  //   };

  // const removeImage = (index: number) => {
  //     const updatedImages = [...images];
  //     updatedImages.splice(index, 1);
  //     setImages(updatedImages);
  //   };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets?.[0].uri);
    }
  };

  const uploadImageToS3 = async (localUri: string) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const params = {
        Bucket: process.env.EXPO_PUBLIC_BUCKET || "",
        Key: uuidv4(),
        Body: base64Image, // Directly use the base64-encoded image string
        ContentType: "image/jpeg", // specify content type if necessary
      };

      console.log(params)
  
      const data = await s3.upload(params).promise();
  
      const uploadedImageUrl = data.Location;
      return uploadedImageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  

  const onSubmitForm = async (data: Business) => {
    setIsLoading(true);
    try {
      // Perform API calls

      uploadImageToS3(image || "")
        .then((uploadedImageUrl) => {
          data.businessID = uuidv4();
          data.image = uploadedImageUrl;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });

      // mutate(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
          {/* USE THIS FOR MULTIPLE IMAGES
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <Pressable
                style={styles.deleteButton}
                onPress={() => removeImage(index)}
              >
                <Feather name="trash-2" size={24} color="white" />
              </Pressable>
            </View>
          ))} */}
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <Pressable
                style={styles.deleteButton}
                onPress={() => setImage("")}
              >
                <Feather name="trash-2" size={24} color="white" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.addImageButton} onPress={pickImage}>
              <Text style={styles.addImageText}>Add Image</Text>
            </Pressable>
          )}
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
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSubmit(onSubmitForm)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Submitting..." : "Submit"}
          </Text>
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
