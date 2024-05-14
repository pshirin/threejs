import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;
const objects = { object1, object2, object3 };
scene.add(object1, object2, object3);

/**
 * Three.js обновляет координаты объектов
 * (называемые матрицами) непосредственно перед их рендерингом.
 *  Поскольку приведение лучей мы выполняем сразу,
 *  ни один из объектов не был визуализирован.
 *  Вы можете это исправить, обновив
 * матрицы вручную перед приведением лучей:
 * */

object1.updateMatrixWorld();
object2.updateMatrixWorld();
object3.updateMatrixWorld();

// raycaster
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);
// const intersect = raycaster.intersectObject(object2);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);

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

// Mouse
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  // некоторые браузеры запускают событие mousemove чаще чем framerate
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    // Click on sphere
    Object.entries(objects).forEach(([key, value]) => {
      if (value === currentIntersect?.object) {
        console.log(key);
      }
    });
  }
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Models
let model: null | THREE.Group<THREE.Object3DEventMap> = null;

const gltfLoader = new GLTFLoader();
gltfLoader.load("models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  model = gltf.scene;
  gltf.scene.position.y = -1.7;
  scene.add(gltf.scene);
});

// lights
const ambientLight = new THREE.AmbientLight("#ffffff", 0.9);
const directionalLight = new THREE.DirectionalLight("#ffffff", 2.1);
directionalLight.position.set(1, 2, 3);
scene.add(ambientLight, directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect: THREE.Intersection<
  THREE.Object3D<THREE.Object3DEventMap>
> | null = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // animate Objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.cos(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.3) * 1.5;

  // Cast a ray

  // set direction of the ray depepending on the camera position
  raycaster.setFromCamera(mouse, camera);
  const objects = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objects);
  for (const object of objects) {
    // @ts-ignore
    object.material.color.set("#ff0000");
  }
  // const intersect = raycaster.intersectObject(object2);
  for (const obj of intersects) {
    // @ts-ignore
    obj.object.material.color.set("#0000ff");
  }
  if (intersects.length) {
    if (!currentIntersect) {
      // Mouse enter
      console.log("mouse enter");
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      // Mouse leave
      console.log("mouse leave");
    }
    currentIntersect = null;
  }

  // intersect with model
  if (model) {
    const modelIntersects = raycaster.intersectObject(model);

    if (modelIntersects.length) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // const castOrigin = new THREE.Vector3(-3, 0, 0);
  // const castDirection = new THREE.Vector3(1, 0, 0);
  // castDirection.normalize();
  // raycaster.set(castOrigin, castDirection);

  //  const intersects = raycaster.intersectObjects(objects);
  //  const intersect = raycaster.intersectObject(object2);

  // for (const object of objects) {
  //   object.material.color.set("#ff0000");
  // }

  // for (const intersect of intersects) {
  //   //@ts-ignore
  //   intersect.object.material.color.set("#0000ff");
  // }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
