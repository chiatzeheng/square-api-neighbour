import { Suspense } from "react";
import { Canvas } from "@react-three/fiber/native";
import { Box, OrbitControls, useGLTF } from "@react-three/drei/native";
// import modelPath from "./path/to/model.glb";

// function Model(props) {
//   const gltf = useGLTF(modelPath);
//   return <primitive {...props} object={gltf.scene} />;
// }

function Cart() {
  return (
    <Canvas>
      <ambientLight />
      <Suspense>
        <Box />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

export default Cart;
