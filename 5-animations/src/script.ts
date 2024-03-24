import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animations

// Time
gsap.to(mesh.position, {
  duration: 1,
  delay: 1,
  x: 2,
});

const gsapTick = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(gsapTick);
};
gsapTick();

const customAnimationTicker = () => {
  let time = Date.now();
  const tick = () => {
    // Time
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
    // Update object
    mesh.rotation.y += 0.001 * deltaTime;
    // Render
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};
// customAnimationTicker();
// Clock

const threeJsAnimationTicker = () => {
  const clock = new THREE.Clock();

  const tick = () => {
    // Time
    const elapseTime = clock.getElapsedTime();
    // Update object
    camera.position.y = -Math.sin(elapseTime);
    camera.position.x = -Math.cos(elapseTime);
    camera.lookAt(mesh.position);
    // Render

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();
};
renderer.render(scene, camera);
