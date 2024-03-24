import * as THREE from "three";
import "./global.css";

//Canvas
const canvas = THREE.createCanvasElement();
document.body.append(canvas);

//Scene
const scene = new THREE.Scene();

//Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(10);
mesh.rotateY(10);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
scene.add(camera);
camera.position.z = 5;
camera.position.y = 0;
camera.position.x = 0;
// Renderer

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
