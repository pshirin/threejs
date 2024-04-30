import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
simpleShadow.colorSpace = THREE.SRGBColorSpace;
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 1.5;
directionalLight.shadow.camera.bottom = -1.5;
directionalLight.shadow.camera.left = -1.5;
directionalLight.shadow.camera.right = 1.5;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 11;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// const directionalLightHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightHelper);

// gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
// gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
// scene.add(directionalLight);

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false;
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.x = 0;
spotLight.position.y = 2;
spotLight.position.z = 2;

spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 6;
// spotLight.shadow.camera.fov = 33;
spotLight.shadow.radius = 11;

// gui.add(spotLight, "intensity").min(0).max(50).step(0.001);
// gui.add(spotLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(spotLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(spotLight.position, "z").min(-5).max(5).step(0.001);

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightHelper);
scene.add(spotLight);
spotLightHelper.visible = false;

const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(0, 2, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 6;

pointLight.shadow.radius = 11;
scene.add(pointLight);

gui.add(pointLight, "intensity").min(0).max(50).step(0.001);
gui.add(pointLight.position, "x").min(-5).max(5).step(0.001);
gui.add(pointLight.position, "y").min(-5).max(5).step(0.001);
gui.add(pointLight.position, "z").min(-5).max(5).step(0.001);

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightHelper);
pointLightHelper.visible = false;
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// cube.castShadow = true;
// cube.receiveShadow = true;
// cube.position.x = 1.5;
// cube.position.y = -0.15;
sphere.castShadow = true;
sphere.receiveShadow = true;
plane.receiveShadow = true;

scene.add(sphere, plane); //, cube

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x00000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);

sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);
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
renderer.shadowMap.enabled = false;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update the sphere

  sphere.position.z = Math.cos(elapsedTime) * 1.5;
  sphere.position.x = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  // Update the shadows

  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * .3
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
