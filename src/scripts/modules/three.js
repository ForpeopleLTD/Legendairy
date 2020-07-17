import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const three = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe7daca);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    100,
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
  controls.minDistance = 200;
  controls.maxDistance = 700;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  camera.position.z = -500;
  controls.update();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onMouseUp(event) {
    console.log(event);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log(mouse);
  }

  function touchEnd(event) {
    console.log(event);
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
    console.log(mouse);
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
    a.remove();
  };

  const fontSize = 20;

  let textGroup;
  let sugarVertices;
  let sugarPoints;
  let yeastVertices;
  let yeastPoints;
  let waterVertices;
  let waterPoints;

  const settings = {
    sugar: 30000,
    yeast: 20000,
    water: 10000,
    oxygen: false,
    save,
  };

  const loader = new THREE.FontLoader();
  loader.load('assets/fonts/BRRR_Medium.json', font => {
    const textMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const workshopGeometry = new THREE.TextGeometry('WORKSHOP', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    workshopGeometry.center();
    const workshopMesh = new THREE.Mesh(workshopGeometry, textMaterial);
    workshopMesh.name = 'workshop';
    workshopMesh.position.x = -350;
    workshopMesh.position.y = 0;
    workshopMesh.position.z = 350;
    workshopMesh.lookAt(0, 0, 0);

    const narrativeGemetry = new THREE.TextGeometry('BRAND NARRATIVE', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    narrativeGemetry.center();
    const narrativeMesh = new THREE.Mesh(narrativeGemetry, textMaterial);
    narrativeMesh.name = 'brand-narrative';
    narrativeMesh.position.x = 350;
    narrativeMesh.position.y = -50;
    narrativeMesh.position.z = 350;
    narrativeMesh.lookAt(0, 0, 0);

    const identityGeometry = new THREE.TextGeometry('BRAND IDENTITY', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    identityGeometry.center();
    const identityMesh = new THREE.Mesh(identityGeometry, textMaterial);
    identityMesh.name = 'brand-identity';
    identityMesh.position.x = 350;
    identityMesh.position.y = 0;
    identityMesh.position.z = -350;
    identityMesh.lookAt(0, 0, 0);

    const strategyGemetry = new THREE.TextGeometry('BRAND STRATEGY', {
      font,
      size: fontSize,
      height: 0,
      curveSegments: 25,
    });
    strategyGemetry.center();
    const strategyMesh = new THREE.Mesh(strategyGemetry, textMaterial);
    strategyMesh.name = 'brand-strategy';
    strategyMesh.position.x = -350;
    strategyMesh.position.y = 20;
    strategyMesh.position.z = -350;
    strategyMesh.lookAt(0, 0, 0);

    textGroup = new THREE.Group();
    textGroup.add(workshopMesh, narrativeMesh, identityMesh, strategyMesh);
    textGroup.rotation.z = 0.2;
    scene.add(textGroup);
  });

  const sugar = new THREE.TextureLoader().load('assets/images/sugar.svg');
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
      size: 1.5,
      sizeAttenuation: true,
      map: sugar,
      alphaTest: 0.5,
      transparent: true,
    });
    sugarPoints = new THREE.Points(sugarGeometry, sugarMaterial);
    scene.add(sugarPoints);
  };

  const yeast = new THREE.TextureLoader().load('assets/images/yeast.svg');
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
      size: 1.5,
      sizeAttenuation: true,
      map: yeast,
      alphaTest: 0.5,
      transparent: true,
    });
    yeastPoints = new THREE.Points(yeastGeometry, yeastMaterial);
    scene.add(yeastPoints);
  };

  const water = new THREE.TextureLoader().load('assets/images/water.svg');
  const generateWater = function generateWater() {
    waterVertices = [];
    for (let i = 0; i < settings.water; i += 1) {
      const x = THREE.MathUtils.randFloatSpread(1000);
      const y = THREE.MathUtils.randFloatSpread(1000);
      const z = THREE.MathUtils.randFloatSpread(1000);
      waterVertices.push(x, y, z);
    }
    const waterGeometry = new THREE.BufferGeometry();
    waterGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(waterVertices, 3),
    );
    const waterMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      map: water,
      alphaTest: 0.5,
      transparent: true,
    });
    waterPoints = new THREE.Points(waterGeometry, waterMaterial);
    scene.add(waterPoints);
  };

  const animate = function animate() {
    requestAnimationFrame(animate);
    sugarPoints.rotation.x += 0.0001;
    sugarPoints.rotation.y += 0.001;
    sugarPoints.rotation.z += 0.001;
    yeastPoints.rotation.x -= 0.001;
    yeastPoints.rotation.y -= 0.0001;
    yeastPoints.rotation.z -= 0.001;
    waterPoints.rotation.x -= 0.0001;
    waterPoints.rotation.y += 0.0001;
    waterPoints.rotation.z += 0.0001;

    raycaster.setFromCamera(mouse, camera);
    const sceneObejects = scene.children;
    const sceneText = sceneObejects[3].children;
    const intersects = raycaster.intersectObjects(sceneText);
    for (let i = 0; i < intersects.length; i += 1) {
      const pageLink = intersects[i].object.name;
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      const url = `https://legendairy.forpeople.com/${pageLink}`;
      a.href = url;
      a.target = '_parent';
      a.click();
      a.remove();
    }
    controls.update();
    renderer.render(scene, camera);
  };

  // GUI Controls
  const gui = new GUI();
  const ferm = gui.addFolder('Fermentation');
  ferm
    .add(settings, 'sugar')
    .name('Sugar Quantity')
    .min(1000)
    .max(50000)
    .onChange(value => {
      scene.remove(sugarPoints);
      settings.sugar = value;
      generateSugar();
    });
  ferm
    .add(settings, 'yeast')
    .name('Yeast Quantity')
    .min(1000)
    .max(50000)
    .onChange(value => {
      scene.remove(yeastPoints);
      settings.yeast = value;
      generateYeast();
    });
  ferm.add(settings, 'oxygen').name('Remove Oxygen');
  ferm.open();
  gui.add(settings, 'save').name('Save Image');
  gui.hide();

  window.addEventListener('click', onMouseUp, false);
  window.addEventListener('touchend', touchEnd, false);

  window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  generateSugar();
  generateYeast();
  generateWater();
  animate();
};

export default three;
