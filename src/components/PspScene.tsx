import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { createElement, Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

import pspAsset from "@/assets/nerd-psp.glb.asset.json";

function PspModel() {
  const { scene } = useGLTF(pspAsset.url);
  const model = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const scale = 10.2 / Math.max(size.x, size.y, size.z, 1);
    object.scale.setScalar(scale);
    object.updateWorldMatrix(true, true);
    const normalized = new THREE.Box3().setFromObject(object);
    const center = normalized.getCenter(new THREE.Vector3());
    object.position.sub(center);
    return object;
  }, [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model]);

  return createElement(
    "group",
    { position: [0, 3.1, 0], rotation: [0, -0.08, -0.035] },
    createElement("primitive", { object: model, rotation: [Math.PI / 2 - 0.3, 0, 0] }),
  );
}

export function PspScene() {
  return (
    <div className="relative h-[58svh] min-h-[360px] w-full cursor-grab active:cursor-grabbing sm:h-[66svh]">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0.45, 8.8], fov: 40, near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMappingExposure: 1.55 }}
      >
        {createElement("color", { attach: "background", args: ["#030303"] })}
        {createElement("ambientLight", { intensity: 2.8, color: "#d4e7ee" })}
        {createElement("hemisphereLight", { args: ["#dff6ff", "#21343d", 2.2] })}
        {createElement("spotLight", { position: [0, 2.5, 8], color: "#f2fbff", intensity: 120, angle: 0.75, penumbra: 0.92 })}
        {createElement("spotLight", {
          position: [-4, 5, 7],
          color: "#d9f5ff",
          intensity: 155,
          angle: 0.52,
          penumbra: 0.72,
          castShadow: true,
          "shadow-mapSize-width": 1024,
          "shadow-mapSize-height": 1024,
        })}
        {createElement("spotLight", { position: [4, 2, 6], color: "#8edcff", intensity: 95, angle: 0.62, penumbra: 0.9 })}
        {createElement("pointLight", { position: [-4, 1, -2], color: "#5ca9cb", intensity: 58 })}
        {createElement(
          Environment,
          { resolution: 128 },
          createElement(Lightformer, { intensity: 4.2, position: [-3, 5, 4], scale: [4, 4, 1] }),
          createElement(Lightformer, { intensity: 2.4, color: "#a6ddf2", position: [5, 0, 2], rotation: [0, Math.PI / 2, 0], scale: [8, 2, 1] }),
        )}
        {createElement(Suspense, { fallback: null }, createElement(PspModel))}
        {createElement(OrbitControls, {
          makeDefault: true,
          target: [0, 3.1, 0],
          enablePan: false,
          enableZoom: false,
          minPolarAngle: Math.PI * 0.3,
          maxPolarAngle: Math.PI * 0.7,
          rotateSpeed: 0.55,
          dampingFactor: 0.055,
          enableDamping: true,
        })}
      </Canvas>
      <div className="pointer-events-none absolute inset-x-[12%] bottom-[7%] h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent blur-[1px]" />
    </div>
  );
}
