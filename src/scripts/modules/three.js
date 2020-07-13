import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const three = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe7daca);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 100;

  let controls;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.enableZoom = false;

  const vertices = [];

  for (let i = 0; i < 100000; i += 1) {
    const x = THREE.MathUtils.randFloatSpread(200);
    const y = THREE.MathUtils.randFloatSpread(200);
    const z = THREE.MathUtils.randFloatSpread(200);
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 4),
  );

  const material = new THREE.PointsMaterial({
    color: 0xfa6238,
    size: 0.1,
  });
  const material2 = new THREE.PointsMaterial({
    color: 0xe0c379,
    size: 0.1,
  });

  const points = new THREE.Points(geometry, material);
  const points2 = new THREE.Points(geometry, material2);

  scene.add(points, points2);

  const animate = function animate() {
    requestAnimationFrame(animate);
    points.rotation.x += 0.001;
    points.rotation.y += 0.001;
    points.rotation.z += 0.001;
    points2.rotation.x -= 0.001;
    points2.rotation.y -= 0.001;
    points2.rotation.z -= 0.001;
    renderer.render(scene, camera);
  };

  animate();
};

export default three;
