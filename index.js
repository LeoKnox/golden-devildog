const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202633);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(8, 7, 10);
camera.lookAt(0, 1.5, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x465064, 2));

const light = new THREE.DirectionalLight(0xffffff, 2.5);
light.position.set(-4, 9, 6);
light.castShadow = true;
scene.add(light);

// Regular hexagon centered at the origin
const sides = 6;
const radius = 5;
const wallHeight = 4;
const vertices = [];

for (let i = 0; i < sides; i++) {
  const angle = (i / sides) * Math.PI * 2 + Math.PI / 6;
  vertices.push(new THREE.Vector2(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius
  ));
}

const roomShape = new THREE.Shape();
roomShape.moveTo(vertices[0].x, vertices[0].y);

for (let i = 1; i < vertices.length; i++) {
  roomShape.lineTo(vertices[i].x, vertices[i].y);
}

roomShape.closePath();

// Create the checkerboard texture
const pixelsPerTile = 64;
const checkerCanvas = document.createElement("canvas");
checkerCanvas.width = checkerCanvas.height = pixelsPerTile * 2;
const ctx = checkerCanvas.getContext("2d");

for (let y = 0; y < 2; y++) {
  for (let x = 0; x < 2; x++) {
    ctx.fillStyle = (x + y) % 2 === 0 ? "#eeeeee" : "#30343b";
    ctx.fillRect(
      x * pixelsPerTile,
      y * pixelsPerTile,
      pixelsPerTile,
      pixelsPerTile
    );
  }
}

const checkerTexture = new THREE.CanvasTexture(checkerCanvas);
checkerTexture.colorSpace = THREE.SRGBColorSpace;
checkerTexture.wrapS = THREE.RepeatWrapping;
checkerTexture.wrapT = THREE.RepeatWrapping;
checkerTexture.repeat.set(0.5, 0.5);

// Map the floor texture in room-space units
const floorGeometry = new THREE.ShapeGeometry(roomShape);
const positions = floorGeometry.attributes.position;
const uvs = [];

for (let i = 0; i < positions.count; i++) {
  uvs.push(positions.getX(i) / 2, positions.getY(i) / 2);
}

floorGeometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(uvs, 2)
);

const floor = new THREE.Mesh(
  floorGeometry,
  new THREE.MeshStandardMaterial({
    map: checkerTexture,
    roughness: 0.9,
    side: THREE.DoubleSide
  })
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Add a wall along each polygon edge
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xc5d4e8,
  roughness: 0.85,
  side: THREE.DoubleSide
});

for (let i = 0; i < vertices.length; i++) {
  const a = vertices[i];
  const b = vertices[(i + 1) % vertices.length];

  const dx = b.x - a.x;
  const dz = b.y - a.y;
  const length = Math.hypot(dx, dz);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(length, wallHeight, 0.15),
    wallMaterial
  );

  wall.position.set(
    (a.x + b.x) / 2,
    wallHeight / 2,
    (a.y + b.y) / 2
  );
  wall.rotation.y = -Math.atan2(dz, dx);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);
}

scene.add(new THREE.GridHelper(30, 30, 0x647084, 0x3b4350));

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
