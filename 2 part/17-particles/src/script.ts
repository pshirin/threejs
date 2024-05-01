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
// Particles

const particleTexture = textureLoader.load("textures/particles/4.png");

const particlesGeometry = new THREE.BufferGeometry();

const count = 100000;
const position = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

//Material
const particlesMaterial = new THREE.PointsMaterial({
  //   color: 0x00ffff,
  size: 0.1,
  transparent: true,
  alphaMap: particleTexture,
  //   alphaTest: .001,
  //   depthTest: false,
  depthWrite: false,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
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
camera.position.z = 3;
scene.add(camera);

const axiesHelper = new THREE.AxesHelper(5);
scene.add(axiesHelper);

// Controls
const controls = new OrbitControls(camera, canvas as HTMLCanvasElement);
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

  // Update particles
  //   particles.rotation.y = elapsedTime * 0.01;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = i3 + 0;
    const y = i3 + 1;
    const z = i3 + 2;
    particlesGeometry.attributes.position.array[y] = Math.sin(
      elapsedTime + particlesGeometry.attributes.position.array[x]
    );

    particlesGeometry.attributes.position.needsUpdate = true;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
