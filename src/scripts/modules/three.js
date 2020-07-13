import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const three = () => {
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xe7daca);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    90,
    1000,
  );

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.1, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.maxDistance = 600;
  controls.update();
  camera.position.z = 100;

  const vertices = [];
  for (let i = 0; i < 100000; i += 1) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 4),
  );

  const material = new THREE.PointsMaterial({
    color: 0xfa6238,
    size: 0.5,
  });
  const material2 = new THREE.PointsMaterial({
    color: 0xe1bd61,
    size: 0.5,
  });

  const points = new THREE.Points(geometry, material);
  const points2 = new THREE.Points(geometry, material2);

  scene.add(points, points2);

  const animate = function animate() {
    requestAnimationFrame(animate);
    points.rotation.x += 0.001;
    points.rotation.y += 0.001;
    points.rotation.z += 0.002;
    points2.rotation.x -= 0.001;
    points2.rotation.y -= 0.002;
    points2.rotation.z -= 0.001;
    renderer.render(scene, camera);
    controls.update();
  };
  animate();
};

export default three;
