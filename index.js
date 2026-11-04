import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const app = document.querySelector("#app");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// Create a regular n-sided polygon
const n = 7;
const radius = 2;
const shape = new THREE.Shape();

for (let i = 0; i < n; i++) {
  const angle = (i / n) * Math.PI * 2;
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);

  if (i === 0) shape.moveTo(x, y);
  else shape.lineTo(x, y);
}

shape.closePath();

const geometry = new THREE.ShapeGeometry(shape);
const material = new THREE.MeshBasicMaterial({
  color: 0x44aa88,
  side: THREE.DoubleSide
});

const polygon = new THREE.Mesh(geometry, material);
scene.add(polygon);

// Draw the scene
renderer.render(scene, camera);

// Keep the canvas sized to the browser window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
