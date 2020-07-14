import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const three = () => {
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xe7daca);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    80,
    2000,
  );

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
  controls.enableZoom = true;
  controls.minDistance = 300;
  controls.maxDistance = 2000;
  controls.autoRotate = false;
  camera.position.z = -500;
  controls.update();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

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

  const fontSize = 20;

  let textGroup;
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

  const loader = new THREE.FontLoader();
  loader.load('assets/fonts/BRRR_Medium.json', font => {
    const textMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b0039,
    });

    const workshopGemetry = new THREE.TextGeometry('WORKSHOP', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    workshopGemetry.center();
    const workshopMesh = new THREE.Mesh(workshopGemetry, textMaterial);
    workshopMesh.position.x = -350;
    workshopMesh.position.y = 0;
    workshopMesh.position.z = 350;
    workshopMesh.lookAt(0, 0, 0);

    const brandGemetry = new THREE.TextGeometry('BRAND NARRATIVE', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    brandGemetry.center();
    const brandMesh = new THREE.Mesh(brandGemetry, textMaterial);
    brandMesh.position.x = 350;
    brandMesh.position.y = -50;
    brandMesh.position.z = 350;
    brandMesh.lookAt(0, 0, 0);

    const guidelinesGemetry = new THREE.TextGeometry('BRAND GUIDELINES', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    guidelinesGemetry.center();
    const guidelinesMesh = new THREE.Mesh(guidelinesGemetry, textMaterial);
    guidelinesMesh.position.x = 350;
    guidelinesMesh.position.y = 0;
    guidelinesMesh.position.z = -350;
    guidelinesMesh.lookAt(0, 0, 0);

    const strategyGemetry = new THREE.TextGeometry('BRAND STRATEGY', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    strategyGemetry.center();
    const strategyMesh = new THREE.Mesh(strategyGemetry, textMaterial);
    strategyMesh.position.x = -350;
    strategyMesh.position.y = 20;
    strategyMesh.position.z = -350;
    strategyMesh.lookAt(0, 0, 0);

    textGroup = new THREE.Group();
    textGroup.add(workshopMesh, brandMesh, guidelinesMesh, strategyMesh);
    textGroup.rotation.z = 0.2;
    scene.add(textGroup);
  });

  const purple = new THREE.TextureLoader().load('assets/images/test2.svg');
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
      size: 7,
      sizeAttenuation: false,
      map: purple,
      alphaTest: 0.5,
      transparent: true,
    });
    sugarPoints = new THREE.Points(sugarGeometry, sugarMaterial);
    scene.add(sugarPoints);
  };

  const orange = new THREE.TextureLoader().load('assets/images/test.svg');
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
      size: 6,
      sizeAttenuation: false,
      map: orange,
      alphaTest: 0.5,
      transparent: true,
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

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children[2].children);
    for (let i = 0; i < intersects.length; i += 1) {
      if (intersects[i].object.name === 'hover') {
        intersects[i].object.scale.set(1, 1, 1);
        intersects[i].object.name = 'target';
      } else {
        intersects[i].object.scale.set(2, 2, 2);
        intersects[i].object.name = 'hover';
      }
    }
    window.addEventListener('mousemove', onMouseMove, false);

    controls.update();
    renderer.render(scene, camera);
  };

  // GUI Controls
  const gui = new GUI();
  const ferm = gui.addFolder('Fermentation');
  ferm
    .add(settings, 'sugar')
    .name('Sugar Quantity')
    .min(0)
    .max(50000)
    .onChange(value => {
      scene.remove(sugarPoints);
      settings.sugar = value;
      generateSugar();
    });
  ferm
    .add(settings, 'yeast')
    .name('Yeast Quantity')
    .min(0)
    .max(50000)
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
  generateSugar();
  generateYeast();
  animate();
};

export default three;
