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
    2000,
  );

  const canvas = document.getElementsByTagName('canvas');
  const save = function save() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    const url = canvas[0].toDataURL('image/png');
    const filename = 'fermentation.png';
    a.href = url;
    a.download = filename;
    a.click();
  };

  let sugarVertices;
  let sugarPoints;
  let yeastVertices;
  let yeastPoints;

  const settings = {
    sugar: 10000,
    yeast: 10000,
    oxygen: false,
    save,
  };

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
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

    const brandGemetry = new THREE.TextGeometry('BRAND ESSENCE', {
      font,
      size: 20,
      height: 0,
      curveSegments: 25,
    });
    brandGemetry.center();
    const brandMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b0039,
    });
    const brandMesh = new THREE.Mesh(brandGemetry, brandMaterial);
    brandMesh.position.z = 50;
    brandMesh.position.y = 150;
    brandMesh.position.x = 250;

    scene.add(textMesh, brandMesh);
  });

  const generateSugar = function generateSugar() {
    sugarVertices = [];
    for (let i = 0; i < settings.sugar; i += 1) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);
      sugarVertices.push(x, y, z);
    }
    const sugarGeometry = new THREE.BufferGeometry();
    sugarGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(sugarVertices, 3),
    );
    const sugarMaterial = new THREE.PointsMaterial({
      color: 0xdd4ff4,
      size: 0.75,
    });
    sugarPoints = new THREE.Points(sugarGeometry, sugarMaterial);
    scene.add(sugarPoints);
  };

  const generateYeast = function generateYeast() {
    yeastVertices = [];
    for (let i = 0; i < settings.yeast; i += 1) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);
      yeastVertices.push(x, y, z);
    }
    const yeastGeometry = new THREE.BufferGeometry();
    yeastGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(yeastVertices, 3),
    );
    const yeastMaterial = new THREE.PointsMaterial({
      color: 0xfa6238,
      size: 0.75,
    });
    yeastPoints = new THREE.Points(yeastGeometry, yeastMaterial);
    scene.add(yeastPoints);
  };

  const animate = function animate() {
    requestAnimationFrame(animate);
    sugarPoints.rotation.x += 0.0001;
    sugarPoints.rotation.y += 0.001;
    sugarPoints.rotation.z += 0.001;
    yeastPoints.rotation.x -= 0.001;
    yeastPoints.rotation.y -= 0.0001;
    yeastPoints.rotation.z -= 0.001;
    renderer.render(scene, camera);
    controls.update();
  };

  generateSugar();
  generateYeast();
  animate();

  // GUI Controls
  const gui = new GUI();
  const ferm = gui.addFolder('Fermentation');
  ferm
    .add(settings, 'sugar')
    .name('Sugar Quantity')
    .min(100)
    .max(250000)
    .onChange(value => {
      scene.remove(sugarPoints);
      settings.sugar = value;
      generateSugar();
    });
  ferm
    .add(settings, 'yeast')
    .name('Yeast Quantity')
    .min(100)
    .max(250000)
    .onChange(value => {
      scene.remove(yeastPoints);
      settings.yeast = value;
      generateYeast();
    });
  ferm.add(settings, 'oxygen').name('Remove Oxygen');
  ferm.open();
  gui.add(settings, 'save').name('Save Image');

  window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
};

export default three;
