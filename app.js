import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/controls/OrbitControls.js';

const PACKAGE_PRICES = {
  starter: 11900,
  pro: 18900,
  elite: 28900,
};

const ADDON_PRICES = {
  addonTurf: 1200,
  addonCamera: 1500,
  addonLighting: 900,
  addonSound: 1400,
};

const controls = {
  roomWidth: document.getElementById('roomWidth'),
  roomDepth: document.getElementById('roomDepth'),
  ceilingHeight: document.getElementById('ceilingHeight'),
  packageTier: document.getElementById('packageTier'),
  handedness: document.getElementById('handedness'),
  addonTurf: document.getElementById('addonTurf'),
  addonCamera: document.getElementById('addonCamera'),
  addonLighting: document.getElementById('addonLighting'),
  addonSound: document.getElementById('addonSound'),
};

const values = {
  roomWidthValue: document.getElementById('roomWidthValue'),
  roomDepthValue: document.getElementById('roomDepthValue'),
  ceilingHeightValue: document.getElementById('ceilingHeightValue'),
  totalPrice: document.getElementById('totalPrice'),
  recommendations: document.getElementById('recommendations'),
};

const sceneHost = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#101722');

const camera = new THREE.PerspectiveCamera(45, sceneHost.clientWidth / sceneHost.clientHeight, 0.1, 1000);
camera.position.set(20, 16, 24);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sceneHost.clientWidth, sceneHost.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
sceneHost.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

const ambient = new THREE.AmbientLight(0xffffff, 0.8);
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(15, 25, 10);
scene.add(ambient, directional);

const floorGrid = new THREE.GridHelper(80, 80, 0x2d6a4f, 0x334155);
floorGrid.position.y = 0;
scene.add(floorGrid);

const roomGroup = new THREE.Group();
scene.add(roomGroup);

const matMaterial = new THREE.MeshStandardMaterial({ color: '#2f855a' });
const screenMaterial = new THREE.MeshStandardMaterial({ color: '#f7fafc', side: THREE.DoubleSide });
const launchMaterial = new THREE.MeshStandardMaterial({ color: '#2d3748' });
const roomMaterial = new THREE.MeshBasicMaterial({ color: '#61dafb', wireframe: true, transparent: true, opacity: 0.45 });

function money(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function clearRoom() {
  while (roomGroup.children.length) {
    roomGroup.remove(roomGroup.children[0]);
  }
}

function buildRoom(width, depth, height, handedness) {
  clearRoom();

  const shell = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), roomMaterial);
  shell.position.set(0, height / 2, 0);
  roomGroup.add(shell);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.78, height * 0.72), screenMaterial);
  screen.position.set(0, height * 0.45, -depth / 2 + 0.2);
  roomGroup.add(screen);

  const mat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.1, 5), matMaterial);
  mat.position.set(handedness === 'both' ? 0 : handedness === 'left' ? -2 : 2, 0.05, depth / 2 - 7);
  roomGroup.add(mat);

  const launch = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.3), launchMaterial);
  launch.position.set(handedness === 'both' ? 0 : handedness === 'left' ? 1 : -1, 0.25, depth / 2 - 6.2);
  roomGroup.add(launch);
}

function calculate() {
  const width = Number(controls.roomWidth.value);
  const depth = Number(controls.roomDepth.value);
  const height = Number(controls.ceilingHeight.value);
  const packageTier = controls.packageTier.value;
  const handedness = controls.handedness.value;

  values.roomWidthValue.textContent = width.toFixed(1);
  values.roomDepthValue.textContent = depth.toFixed(1);
  values.ceilingHeightValue.textContent = height.toFixed(1);

  let total = PACKAGE_PRICES[packageTier];
  const recommendations = [];

  if (width < 13) recommendations.push('⚠️ Width is tight. Consider single-handed setup or compact swing mode.');
  if (height < 9.5) recommendations.push('⚠️ Ceiling under 9.5ft may limit taller players and driver swings.');
  if (depth < 16) recommendations.push('⚠️ Depth under 16ft may require short-throw projector and rear-safe stance.');

  const projector = depth <= 18 ? 'Short-throw 4K projector' : 'Standard throw 4K projector';
  recommendations.push(`🎯 Recommended projector: ${projector}.`);

  const enclosure = width > 18 ? 'Wide impact enclosure (16:9)' : 'Standard impact enclosure (4:3/16:10)';
  recommendations.push(`🧱 Enclosure recommendation: ${enclosure}.`);

  if (handedness === 'both') {
    total += 1800;
    recommendations.push('↔️ Added ambidextrous layout adjustment for left/right-handed players.');
  }

  Object.entries(ADDON_PRICES).forEach(([key, price]) => {
    if (controls[key].checked) {
      total += price;
      recommendations.push(`✅ Included ${controls[key].parentElement.textContent.trim()} (${money(price)}).`);
    }
  });

  values.totalPrice.textContent = money(total);
  values.recommendations.innerHTML = recommendations.map((item) => `<li>${item}</li>`).join('');

  buildRoom(width, depth, height, handedness);
}

Object.values(controls).forEach((control) => {
  control.addEventListener('input', calculate);
  control.addEventListener('change', calculate);
});

window.addEventListener('resize', () => {
  camera.aspect = sceneHost.clientWidth / sceneHost.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneHost.clientWidth, sceneHost.clientHeight);
});

function animate() {
  orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

calculate();
animate();
