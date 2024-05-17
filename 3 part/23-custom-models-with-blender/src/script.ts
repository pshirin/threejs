import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl") as HTMLElement;

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

let burger: THREE.Object3D[] | null = null;
let burgerInitialPositions: null | THREE.Vector3[] = null;
let burgerInitialRotations: null | THREE.Euler[] = null;
gltfLoader.load("/models/hamburgerCompressed.glb", (gltf) => {
  burger = [...gltf.scene.children];

  burgerInitialPositions = burger.map((m, i) => {
    return new THREE.Vector3(...m.position.toArray().slice(0, 3));
  });
  //@ts-ignore
  burgerInitialRotations = burger.map((m, i) => {
    return new THREE.Vector3(...m.rotation.toArray().slice(0, 3));
  });
  gltf.scene.children.forEach((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  scene.add(gltf.scene);
});
/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0.9,
    roughness: 0.7,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
  new THREE.Color("#3f43f4"),
  11
);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2024, 2024);
directionalLight.shadow.camera.far = 25;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-8, 4, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const mouse = new THREE.Vector2(-100, -100);
window.addEventListener("mousemove", (e) => {
  // некоторые браузеры запускают событие mousemove чаще чем framerate
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const raycaster = new THREE.Raycaster();

const maxPositions = [
  {
    x: 0,
    y: 0,
    z: 0,
  },
  {
    x: 0,
    y: 3,
    z: 1,
  },
  {
    x: 0,
    y: 6,
    z: 3,
  },
  {
    x: 0,
    y: 10,
    z: 9,
  },
];

const maxRotations = [
  {
    x: 0,
    y: 0,
    z: 0,
  },
  {
    x: 0.1,
    y: 0,
    z: 0,
  },
  {
    x: 0.2,
    y: 0,
    z: 0,
  },
  {
    x: -2.9,
    y: 0,
    z: 0,
  },
];

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  raycaster.setFromCamera(mouse, camera);
  if (burger) {
    const intersects = raycaster.intersectObjects(burger);
    if (intersects.length > 0) {
      burger.map((m, i) => {
        const mesh = m as THREE.Mesh;
        if (maxPositions[i].y > mesh.position.y) {
          mesh.position.y += 0.03 * i;
        }

        if (maxPositions[i].z < mesh.position.z) {
          mesh.position.z += 0.01 * i ** 2;
        }

        // mesh.position.y += 0.03 * i;
        // mesh.position.z += 0.01 * i ** 2;

        if (maxRotations[i].x > mesh.rotation.x) {
          mesh.rotation.x += 0.001 * (i + i ** 2 + i);
        }
      });
    } else {
      burger.map((m, i) => {
        const mesh = m as THREE.Mesh;
        if (
          burgerInitialPositions &&
          burgerInitialPositions[i].y < mesh.position.y
        ) {
          mesh.position.y -= 0.03 * i;
        }
        if (
          burgerInitialRotations &&
          burgerInitialRotations[i].x < mesh.rotation.x
        ) {
          mesh.rotation.x -= 0.001 * (i + i ** 2 + i);
        }
        if (
          burgerInitialPositions &&
          burgerInitialPositions[i].z < mesh.position.z
        ) {
          mesh.position.z -= 0.01 * i ** 2;
        }
        // if (
        //   burgerInitialPositions &&
        //   burgerInitialPositions[i].x < mesh.position.x
        // ) {
        //   mesh.position.x -= 0.001 * i;
        // }
      });
    }
  }
  if (mixer) {
    (mixer as THREE.AnimationMixer).update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
