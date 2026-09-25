import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

import pspAsset from "@/assets/nerd-psp.glb.asset.json";

function PspModel() {
  const { scene } = useGLTF(pspAsset.url);
  const model = useMemo(() => {
    const object = scene.clone(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const scale = 8.4 / Math.max(size.x, size.y, size.z, 1);
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

  return <primitive object={model} rotation={[Math.PI / 2 - 0.08, -0.08, 0.02]} />;
}

export function PspScene() {
  return (
    <div className="relative h-[58svh] min-h-[360px] w-full cursor-grab active:cursor-grabbing sm:h-[66svh]">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0.35, 10.5], fov: 40, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#030303"]} />
        <ambientLight intensity={1.1} color="#a9bdc8" />
        <spotLight
          position={[-5, 6, 6]}
          color="#ccefff"
          intensity={85}
          angle={0.38}
          penumbra={0.85}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[4.5, -1, 3]} color="#75bad7" intensity={38} />
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[-3, 5, 3]} scale={[3, 3, 1]} />
          <Lightformer intensity={0.9} color="#8bc5df" position={[5, 0, 1]} rotation-y={Math.PI / 2} scale={[8, 1, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <PspModel />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
          rotateSpeed={0.55}
          dampingFactor={0.055}
          enableDamping
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-[12%] bottom-[7%] h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent blur-[1px]" />
    </div>
  );
}
