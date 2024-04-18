import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import GUI from "lil-gui";

// DEBUG
const gui = new GUI();
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Textures

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusinTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Objects
//MeshStandardMaterial
// const baseMaterial = new THREE.MeshStandardMaterial();
// baseMaterial.map = doorColorTexture;
// baseMaterial.aoMap = doorAmbientOcclusinTexture;
// baseMaterial.aoMapIntensity = 1;
// baseMaterial.displacementMap = doorHeightTexture;
// baseMaterial.metalnessMap = doorMetalnessTexture;
// baseMaterial.roughnessMap = doorRoughnessTexture;
// baseMaterial.normalMap = doorNormalTexture;
// baseMaterial.normalScale.set(0.5, 0.5);
// baseMaterial.displacementScale = 0.02;
// baseMaterial.transparent = true;
// baseMaterial.alphaMap = doorAlphaTexture;

//
const baseMaterial = new THREE.MeshPhysicalMaterial();
// baseMaterial.map = doorColorTexture;
// baseMaterial.aoMap = doorAmbientOcclusinTexture;
// baseMaterial.aoMapIntensity = 1;
// baseMaterial.displacementMap = doorHeightTexture;
// baseMaterial.metalnessMap = doorMetalnessTexture;
// baseMaterial.roughnessMap = doorRoughnessTexture;
// baseMaterial.normalMap = doorNormalTexture;
// baseMaterial.normalScale.set(0.5, 0.5);
// baseMaterial.displacementScale = 0.02;
// baseMaterial.transparent = true;
// baseMaterial.alphaMap = doorAlphaTexture;
// baseMaterial.alphaMap = doorAlphaTexture;
baseMaterial.metalness = 0;
baseMaterial.roughness = 0;
 gui.add(baseMaterial, "metalness").min(0).max(1).step(0.0001);
 gui.add(baseMaterial, "roughness").min(0).max(1).step(0.0001);
// gui.add(baseMaterial, "displacementScale").min(0).max(1).step(0.0001);
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// baseMaterial.gradientMap = gradientTexture;
// baseMaterial.
// baseMaterial.shininess = 55;
// baseMaterial.specular = new THREE.Color(0x1188ff);
// baseMaterial.map = doorColorTexture;
// const axiesHelper = new THREE.AxesHelper(3);
const sphereGeometry = new THREE.SphereGeometry(0.5, 128, 128);
const sphereMesh = new THREE.Mesh(sphereGeometry, baseMaterial);
sphereMesh.position.x = -2;
const planeGeometry = new THREE.PlaneGeometry(1, 1, 128, 128);
const planeMesh = new THREE.Mesh(planeGeometry, baseMaterial);
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 128, 128);
const torusMesh = new THREE.Mesh(torusGeometry, baseMaterial);
torusMesh.position.x = 2;
// Clearcoat
// baseMaterial.clearcoat = 1;
// baseMaterial.clearcoatRoughness = 0;
// gui.add(baseMaterial, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(baseMaterial, "clearcoatRoughness").min(0).max(1).step(0.0001);

//Sheen
// baseMaterial.sheen = 1
// baseMaterial.sheenRoughness = 0.25
// baseMaterial.sheenColor = new THREE.Color(0x1188ff);

// Iridescence

// baseMaterial.iridescence = 1;
// baseMaterial.iridescenceIOR = 1;
// baseMaterial.iridescenceThicknessRange = [100, 800];

//Transmission
baseMaterial.transmission = 1;
baseMaterial.ior = 1.5;
baseMaterial.thickness = 0.5;

gui.add(baseMaterial, "transmission").min(0).max(1).step(0.0001);
gui.add(baseMaterial, "ior").min(1).max(10).step(0.0001);
gui.add(baseMaterial, "thickness").min(1).max(11).step(0.0001);
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// const pointLight = new THREE.PointLight(0xffffff, 31);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 3;

// Envirenment Map
const rgbeLoader = new RGBELoader();

rgbeLoader.load("./textures/environmentMap/2k.hdr", (envirenmentMap) => {
  envirenmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envirenmentMap;
  scene.environment = envirenmentMap;
});

scene.add(
  sphereMesh,
  //   axiesHelper,
  planeMesh,
  torusMesh
  //   ambientLight,
  //   pointLight
);

// MeshNormalMaterial
const normalMaterial = new THREE.MeshNormalMaterial();

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update objects

  sphereMesh.rotation.y = 0.1 * elapsedTime;
  planeMesh.rotation.y = 0.1 * elapsedTime;
  torusMesh.rotation.y = 0.1 * elapsedTime;

  sphereMesh.rotation.x = -0.1 * elapsedTime;
  planeMesh.rotation.x = -0.1 * elapsedTime;
  torusMesh.rotation.x = -0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
