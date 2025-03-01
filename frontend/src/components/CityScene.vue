<script setup>
import { ref, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const threeContainer = ref(null);
const props = defineProps(['buildings'])

let scene, camera, renderer, controls, ground;

const ghostBuilding = ref(null);

const createScene = () => {
  // Сцена, камера и рендерер
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeContainer.value.appendChild(renderer.domElement);

  // Земля
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Освещение
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  light.castShadow = true;
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040); // Мягкое освещение
  scene.add(ambientLight);

  // Камера
  camera.position.z = 20;

  // Управление камерой
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Плавное замедление вращения
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.maxPolarAngle = Math.PI / 2; // Ограничение угла (не даем камере уходить вниз)
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

const createBuildings = () => {
  props.buildings.forEach((building) => {
    const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth); // Размер здания
    const material = new THREE.MeshStandardMaterial({ color: building.color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(building.x, building.height / 2, building.z); // Размещение на земле
    scene.add(mesh);
  });
};

const createGhostBuilding = (position) => {
  if (ghostBuilding.value) {
    // Обновляем позицию существующего здания
    ghostBuilding.value.position.set(position.x, position.y, position.z);
  } else {
    // Создаём новое "призрачное" здание
    const geometry = new THREE.BoxGeometry(5, 5, 5); // Стандартный размер
    const material = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.5 }); // Прозрачный цвет
    ghostBuilding.value = new THREE.Mesh(geometry, material);
    ghostBuilding.value.position.set(position.x, position.y, position.z);
    scene.add(ghostBuilding.value);
  }
};

const onClick = (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  // Преобразуем координаты мыши в нормализованные
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Устанавливаем луч
  raycaster.setFromCamera(mouse, camera);

  // Находим пересечение с землёй
  const intersects = raycaster.intersectObject(ground);
  if (intersects.length > 0) {
    const intersection = intersects[0].point;
    createGhostBuilding(intersection);
  }
};

// Добавляем обработчик клика
window.addEventListener('click', onClick);

watch(props.buildings, () => {
  createBuildings(); 
});

onMounted(() => {
  createScene();
  animate();
  createBuildings();
});
</script>

<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>