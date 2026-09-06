import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";
import type { WorldKey } from "../game/types";
import { SHIRT_MODEL_BASE_PATH, SHIRT_MODEL_PATH, WORLD_ASSETS } from "../game/worlds";

interface WorldCanvasProps {
  world: WorldKey;
  showShirt?: boolean;
  shirtX?: number;
  shirtY?: number;
  shirtZ?: number;
  shirtScale?: number;
}

const SHIRT_DEFAULT_SCALE = 0.01;

export function WorldCanvas({
  world,
  showShirt = false,
  shirtX = 0,
  shirtY = 1,
  shirtZ = -1,
  shirtScale = SHIRT_DEFAULT_SCALE,
}: WorldCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const assets = WORLD_ASSETS[world];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      1000,
    );
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);

    const spark = new SparkRenderer({ renderer });
    scene.add(spark);

    const environment = new SplatMesh({ url: assets.environment });
    scene.add(environment);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(assets.collider, (gltf) => {
      // Kept in the scene graph (not rendered) so raycasting/collision
      // against it still works — Object3D.visible only affects rendering.
      gltf.scene.visible = false;
      scene.add(gltf.scene);
    });

    let shirt: THREE.Group | null = null;
    if (showShirt) {
      const fbxLoader = new FBXLoader();
      fbxLoader.setPath(SHIRT_MODEL_BASE_PATH);
      fbxLoader.load(SHIRT_MODEL_PATH.replace(SHIRT_MODEL_BASE_PATH, ""), (object) => {
        object.scale.setScalar(shirtScale);
        object.position.set(shirtX, shirtY, shirtZ);
        scene.add(object);
        shirt = object;
      });
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      if (shirt) scene.remove(shirt);
      container.removeChild(renderer.domElement);
    };
  }, [world, showShirt, shirtX, shirtY, shirtZ, shirtScale]);

  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
