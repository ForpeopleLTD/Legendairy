import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const three = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe7daca);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    90,
    1000,
  );

  const canvas = document.getElementsByTagName('canvas');

  const save = function save() {
    window.open(canvas[0].toDataURL('image/png'));
  };

  const settings = {
    sugar: 100000,
    yeast: 10000,
    oxygen: false,
    save,
  };

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
  controls.enableZoom = false;
  controls.maxDistance = 600;
  controls.update();
  camera.position.z = 400;

  const loader = new THREE.FontLoader();
  loader.load('assets/fonts/BRRR_Medium.json', font => {
    const textGemetry = new THREE.TextGeometry('LEGENDAIRY', {
      font,
      size: 30,
      height: 0,
      curveSegments: 25,
    });
    textGemetry.center();
    const tesxtMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b0039,
    });
    const textMesh = new THREE.Mesh(textGemetry, tesxtMaterial);
    scene.add(textMesh);
  });

  const vertices = [];
  for (let i = 0; i < settings.sugar; i += 1) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    vertices.push(x, y, z);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  const material = new THREE.PointsMaterial({
    color: 0xdd4ff4,
    size: 1,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const animate = function animate() {
    requestAnimationFrame(animate);
    points.rotation.x += 0.001;
    points.rotation.y += 0.001;
    points.rotation.z += 0.001;
    renderer.render(scene, camera);
    controls.update();
  };
  animate();

  window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const gui = new GUI();
  const ferm = gui.addFolder('Fermentation');
  ferm
    .add(settings, 'sugar')
    .name('Sugar Quantity')
    .min(100)
    .max(100000)
    .onChange(value => {
      settings.sugar = value;
    });
  ferm
    .add(settings, 'yeast')
    .name('Yeast Quantity')
    .min(100)
    .max(10000000);
  ferm.add(settings, 'oxygen').name('Remove Oxygen');
  ferm.open();
  gui.add(settings, 'save').name('Save Image');
};

export default three;
