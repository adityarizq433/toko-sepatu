import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function ShoeModel({ color, ...props }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/shoe.glb');

  // Apply color to the main materials
  useEffect(() => {
    if (materials) {
      // Loop through all materials and change the main body color
      // MaterialsVariantsShoe has specific materials, we'll try to target the main ones
      Object.values(materials).forEach((material) => {
        // Only change specific materials so the sole/laces stay white/black if possible
        // But for a magical effect, we tint everything slightly or just the main mesh
        if (material.name && material.name.toLowerCase().includes('shoe')) {
            material.color = new THREE.Color(color);
            material.needsUpdate = true;
        } else {
             // Fallback: just tint the material if it doesn't have a specific name
            material.color = new THREE.Color(color);
        }
      });
    }
  }, [color, materials]);

  return (
    <group ref={group} {...props} dispose={null}>
      {/* We render the whole scene of the glTF */}
      <primitive object={nodes.Scene || nodes.scene || nodes[Object.keys(nodes)[0]]} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/shoe.glb');
