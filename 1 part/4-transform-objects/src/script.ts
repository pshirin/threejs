import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const group = new THREE.Group();
scene.add(group);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
  })
);

cube2.position.set(-2, 0, 0);
cube3.position.set(2, 0, 0);
group.add(cube1, cube2, cube3);
group.position.set(0, 1, 0);
group.rotation.y = 1;
group.scale.y = 2;
// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.y = 1;
// camera.position.x = 1;

scene.add(camera);
// camera.lookAt(cube1.position);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

let lookAtX = 0;
let lookAtY = 0;
window.addEventListener("keypress", (e) => {
  camera.position.z -= camera.position.z / 100;
  renderer.render(scene, camera);
});

window.addEventListener("mousemove", (e) => {
  lookAtX += e.movementX;
  lookAtY += e.movementY;
  camera.lookAt(lookAtX / 100, -lookAtY / 100, 0);
  renderer.render(scene, camera);
});
