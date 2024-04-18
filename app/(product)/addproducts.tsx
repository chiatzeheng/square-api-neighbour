//const [images, setImages] = useState([]);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImages([...images, result.uri]);
  //   }
  // };

//   <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
//   <Text style={styles.addImageText}>Add Image</Text>
// </TouchableOpacity>
// <ScrollView horizontal style={styles.imageContainer}>
//   {images.map((image, index) => (
//     <View key={index} style={styles.imageWrapper}>
//       <Image source={{ uri: image }} style={styles.image} />
//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => setImages(images.filter((_, i) => i !== index))}
//       >
//         <Feather name="trash-2" size={24} color="white" />
//       </TouchableOpacity>
//     </View>
//   ))}
// </ScrollView>



{/* <ScrollView horizontal contentContainerStyle={styles.imageScrollView}>
{images ? (
  images.map((image, index) => (
    <View key={index} style={styles.imageContainer}>
      <Image source={{ uri: image }} style={styles.image} />
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeImage(index)}
      >
        <Feather name="trash-2" size={24} color="white" />
      </Pressable>
    </View>
  ))
) : (
  <Pressable style={styles.addImageButton} onPress={pickImage}>
    <Text style={styles.addImageText}>Add Image</Text>
  </Pressable>
)}
</ScrollView> */}

