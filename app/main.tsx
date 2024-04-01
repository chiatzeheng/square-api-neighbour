import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import * as ExpoSensors from 'expo-sensors';

export default function Main() {
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const cubeRef = useRef(null);

  useEffect(() => {
    const subscribe = () => {
      const subscription = ExpoSensors.motionSubscribe(updateCube);
      return subscription;
    };

    subscribe();
  }, []);

  const updateCube = ({ rotation }) => {
    if (cubeRef.current) {
      const { alpha, beta, gamma } = rotation;
      cubeRef.current.rotation.set(
        THREE.Math.degToRad(alpha),
        THREE.Math.degToRad(beta),
        THREE.Math.degToRad(gamma)
      );
    }
  };

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(
      70,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.01,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;

    const render = () => {
      requestAnimationFrame(render);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    render();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <GLView
        style={{ width: 300, height: 300 }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}