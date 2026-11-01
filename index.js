import "./styles.css";
import * as THREE from "three";


    // Assumes THREE is available, and scene is your THREE.Scene.
    import * as THREE from "three";

    const shape = new THREE.Shape();
    shape.moveTo(-5, -3);
    shape.lineTo(4, -3);
    shape.lineTo(6, 0);
    shape.lineTo(3, 4);
    shape.lineTo(-4, 3);
    shape.closePath();

    const geometry = new THREE.ShapeGeometry(shape);

    // ShapeGeometry creates UVs from the shape's coordinates.
    // Normalize them to the polygon's bounds so the texture fits the floor.
    const positions = geometry.attributes.position;
    const uvs = geometry.attributes.uv;

    const bounds = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      bounds.minX = Math.min(bounds.minX, x);
      bounds.maxX = Math.max(bounds.maxX, x);
      bounds.minY = Math.min(bounds.minY, y);
      bounds.maxY = Math.max(bounds.maxY, y);
    }

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      uvs.setXY(
        i,
        (x - bounds.minX) / (bounds.maxX - bounds.minX),
        (y - bounds.minY) / (bounds.maxY - bounds.minY)
      );
    }

    uvs.needsUpdate = true;

    // Create an 8×8 checkerboard texture.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const tileSize = 32;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? "#eeeeee" : "#333333";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    const floor = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
    );

    // ShapeGeometry lies in XY; rotate it to make a horizontal XZ floor.
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
