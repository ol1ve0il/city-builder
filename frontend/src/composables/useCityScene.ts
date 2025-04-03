import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function useCityScene(containerRef: any, buildings: any) {
  const scene = new THREE.Scene();
  const renderer = ref<THREE.WebGLRenderer | null>(null);
  const camera = ref<THREE.PerspectiveCamera | null>(null);
  const controls = ref<OrbitControls | null>(null);
  const buildingMeshes: THREE.Mesh[] = [];

  function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
  }

  function initScene() {
    const container = containerRef.value;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.value = new THREE.WebGLRenderer({ antialias: true });
    renderer.value.setSize(width, height);
    container.appendChild(renderer.value.domElement);

    camera.value = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.value.position.set(10, 10, 10);
    scene.add(camera.value);

    controls.value = new OrbitControls(camera.value, renderer.value.domElement);
    controls.value.enableDamping = true;

    addLights();
    animate();
  }

  function addBuildings() {
    buildingMeshes.forEach((mesh) => scene.remove(mesh));
    buildingMeshes.length = 0;

    buildings.value.forEach((building: any) => {
      const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
      const material = new THREE.MeshStandardMaterial({ color: building.color || 0x44aa88 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(building.x, building.height / 2, building.z);
      scene.add(mesh);
      buildingMeshes.push(mesh);
    });
  }

  function animate() {
    if (!renderer.value || !camera.value) return;

    requestAnimationFrame(animate);
    controls.value?.update();
    renderer.value.render(scene, camera.value);
  }

  watch(buildings, () => {
    if (buildings.value.length > 0) {
      addBuildings();
    }
  }, { deep: true });

  onMounted(() => {
    initScene();
    if (buildings.value.length > 0) {
      addBuildings();
    }
  });

  onUnmounted(() => {
    if (renderer.value) renderer.value.dispose();
  });

  return { scene, camera, controls };
}
