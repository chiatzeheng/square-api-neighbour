import React, { useState } from "react";
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
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Business } from "@/utils/type";
import { s3 } from "@/utils/bucket";
import { useRouter } from "expo-router";

const schema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.string().min(1),
});

function extractImageUrl(localUri: string) {
  const pattern = /file:\/\/\/var\/.*?\.jpg/g;
  const matches = localUri.match(pattern);
  if (matches && matches.length > 0) {
    return matches[0];
  } else {
    return null;
  }
}


const NewBusinessForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [image, setImage] = useState<string>();


  console.log(s3)
  const { mutate } = useMutation({
    mutationFn: (data: Business) =>
      axios.post(
        `http://${process.env.EXPO_PUBLIC_URL}:8080/postBusiness`, data
      ),
    onError: (error) => {
      console.log(error);
    },
    onSuccess(res) {
      router.push({
        pathname: "/(location)/location",
        params: { id: res.data.businessID },
      });
    },
  });
  
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

 // Import S3 from aws-sdk
  
  const uploadImageToS3 = async (localUri: string) => {
    try {
      // Read file content as binary data
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      const fileContent = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Convert Base64-encoded string to binary data
      const binaryData = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
  
      // Upload file to S3
      const params = {
        Bucket: process.env.EXPO_PUBLIC_BUCKET,
        Key: `${uuidv4()}.${fileInfo.uri.split('.').pop()}`,
        Body: binaryData,
        ContentType: 'image/jpeg', // Adjust content type as per your file type
      };
      const data = await s3.upload(params).promise();
  
      // Return uploaded image URL
      return data.Location;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  

  const onSubmitForm = async (data: Business) => {
    try {
      // Perform API calls

      data.businessID = uuidv4();
      data.image = image;

      if (data.image) {
        try {
          const uploadedImageUrl = await uploadImageToS3(data.image);
          data.image = uploadedImageUrl;
          await mutate(data);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      } else await mutate(data);
    } catch (error) {
      console.error("Error submitting form:", error);
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
