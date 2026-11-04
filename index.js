import "./styles.css";
// Assumes THREE is available, and scene is your THREE.Scene.
import * as THREE from "three";
const scene = new THREE.Scene();
const n = 7; // number of sides
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
  side: THREE.DoubleSide,
});

const polygon = new THREE.Mesh(geometry, material);
scene.add(polygon);
