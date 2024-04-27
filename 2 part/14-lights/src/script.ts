import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
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
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
// gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);

// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
// gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
// gui.add(directionalLight.position, "x").min(0).max(3).step(0.001);
// gui.add(directionalLight.position, "y").min(0).max(3).step(0.001);
// gui.add(directionalLight.position, "z").min(0).max(3).step(0.001);
// scene.add(directionalLight);
// const pointLight = new THREE.PointLight(0xffffff, 50);

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.1);
// scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9000, 1.5);
pointLight.position.set(3, 1, -3);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1.5);
// scene.add(pointLightHelper);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1.5);
// scene.add(pointLight);
// scene.add(pointLightHelper);
// gui.add(pointLight.position, "x").min(0).max(3).step(0.001);
// gui.add(pointLight.position, "y").min(0).max(3).step(0.001);
// gui.add(pointLight.position, "z").min(0).max(3).step(0.001);
// gui.add(pointLight, "distance").min(0).max(3).step(0.001);
// gui.add(pointLight, "decay").min(0).max(3).step(0.001);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);

scene.add(rectAreaLight);
rectAreaLight.position.set(-3, 1, -3);
rectAreaLight.lookAt(new THREE.Vector3());
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);
// gui.add(rectAreaLight.position, "x").min(-3).max(3).step(0.001);
// gui.add(rectAreaLight.position, "y").min(-3).max(3).step(0.001);
// gui.add(rectAreaLight.position, "z").min(-3).max(3).step(0.001);
// gui.add(rectAreaLight, "distance").min(0).max(3).step(0.001);
// gui.add(rectAreaLight, "decay").min(0).max(3).step(0.001);
/**
 * Objects
 */
// Material

const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);

spotLight.position.set(2.677, -0.567, 2.765);
gui.add(spotLight.position, "x").min(-3).max(3).step(0.001);
gui.add(spotLight.position, "y").min(-3).max(3).step(0.001);
gui.add(spotLight.position, "z").min(-3).max(3).step(0.001);

scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
// const pointLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(pointLightHelper);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
