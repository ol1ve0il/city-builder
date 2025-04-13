import { ref, onMounted, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Building } from '../models/building';

export function useCityScene(containerRef: any, buildings: any, emit: any) {
  const scene = new THREE.Scene();
  const renderer = ref<THREE.WebGLRenderer | null>(null);
  const camera = ref<THREE.PerspectiveCamera | null>(null);
  const controls = ref<OrbitControls | null>(null);
  const raycaster = ref<THREE.Raycaster | null>(null);
  const pointer = ref<THREE.Vector2 | null>(null);

  const isDragging = ref(false);

  const buildingMeshes: THREE.Mesh[] = [];
  const selectedBuildingID = ref<number | null>(null);

  const sceneSize = { x: 50, z: 50 };
  const gridSize = 1;

  function initScene() {
    const container = containerRef.value;
    if (!container) return;

    renderer.value = new THREE.WebGLRenderer({ antialias: true });
    renderer.value.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.value.domElement);

    camera.value = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.value.position.set(10, 10, 10);
    scene.add(camera.value);

    raycaster.value = new THREE.Raycaster();
    pointer.value = new THREE.Vector2();

    controls.value = new OrbitControls(camera.value, renderer.value.domElement);
    controls.value.enableDamping = true;
    controls.value.maxPolarAngle = Math.PI / 2.2;

    addLights();
    addGround();
    addGridHelper();
    addBuildings();
    animate();
  }

  function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
  }

  function addGround() {
    const geometry = new THREE.PlaneGeometry(sceneSize.x, sceneSize.z);
    const material = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
  }

  function addGridHelper() {
    const grid = new THREE.GridHelper(sceneSize.x, sceneSize.z);
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    scene.add(grid);
  }

  function addBuildings() {
    // Очистка старых зданий
    buildingMeshes.forEach((mesh) => scene.remove(mesh));
    buildingMeshes.length = 0;

    buildings.value.forEach((building: Building) => {
      const geometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
      const material = new THREE.MeshStandardMaterial({ color: building.color || 0x44aa88 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(building.x, building.height / 2, building.z);

      // Добавляем ID для кликов
      mesh.userData.id = building.id;
      mesh.userData.width = building.width;
      mesh.userData.depth = building.depth;

      scene.add(mesh);
      buildingMeshes.push(mesh);
    });
  }

  function findSelectedBuilding() {
    return buildingMeshes.find(mesh => mesh.userData.id == selectedBuildingID.value)
  }

  function highlightSelectedBuilding() {
    if (selectedBuildingID.value === null) return;
    buildingMeshes.forEach(mesh => {
      const isSelected = mesh.userData.id == selectedBuildingID.value;
      const color = isSelected ? 0xff0000 : 0x44aa88;
      (mesh.material as THREE.MeshStandardMaterial).color.set(color);
    })
  }

  function clampPositionWithSize(
    x: number,
    z: number,
    groundWidth: number,
    groundDepth: number,
    buildingWidth: number,
    buildingDepth: number
  ) {
    const halfGroundW = groundWidth / 2;
    const halfGroundD = groundDepth / 2;
    const halfBuildingW = buildingWidth / 2;
    const halfBuildingD = buildingDepth / 2;

    return {
      x: Math.max(-halfGroundW + halfBuildingW, Math.min(halfGroundW - halfBuildingW, x)),
      z: Math.max(-halfGroundD + halfBuildingD, Math.min(halfGroundD - halfBuildingD, z)),
    };
  }

  function onPointerDown(event: MouseEvent) {
    if (!selectedBuildingID.value || !renderer.value || !raycaster.value || !pointer.value || !camera.value) return;

    const rect = renderer.value.domElement.getBoundingClientRect();
    pointer.value.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.value.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.value.setFromCamera(pointer.value, camera.value);
    const intersects = raycaster.value.intersectObjects(buildingMeshes);

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh;
      if (intersected.userData.id === selectedBuildingID.value) {
        isDragging.value = true;
        controls.value!.enabled = false;
      }
    }
  }

  function onPointerMove(event: MouseEvent) {
    if (!isDragging.value || !raycaster.value || !pointer.value || !camera.value) return;

    const selectedMesh = findSelectedBuilding();

    if (!selectedMesh) return;

    const rect = renderer.value!.domElement.getBoundingClientRect();
    pointer.value.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.value.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.value.setFromCamera(pointer.value, camera.value);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.value.ray.intersectPlane(plane, intersectPoint);

    const snappedX = Math.round(intersectPoint.x / gridSize) * gridSize;
    const snappedZ = Math.round(intersectPoint.z / gridSize) * gridSize;

    const clamped = clampPositionWithSize(snappedX, snappedZ, sceneSize.x, sceneSize.z, selectedMesh.userData.width, selectedMesh.userData.depth)

    selectedMesh.position.x = clamped.x;
    selectedMesh.position.z = clamped.z;
  }

  function onPointerUp() {
    if (isDragging.value) {
      isDragging.value = false;
      controls.value!.enabled = true;

      const selectedMesh = findSelectedBuilding();
      if (selectedMesh) {
        emit('update-building', selectedBuildingID.value, {
          x: selectedMesh.position.x,
          z: selectedMesh.position.z
        });
      }
    }
  }

  function onDblClick(event: MouseEvent) {
    if (!renderer.value || !pointer.value || !raycaster.value || !camera.value) return;

    const rect = renderer.value.domElement.getBoundingClientRect();
    pointer.value.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.value.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.value.setFromCamera(pointer.value, camera.value);
    const intersects = raycaster.value.intersectObjects(buildingMeshes);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object as THREE.Mesh;
      selectedBuildingID.value = selectedObject.userData.id;
      emit('select-building', selectedBuildingID.value);

    } else {
      // Если кликнули в пустоту, сбрасываем выделение
      if (selectedBuildingID.value) {
        selectedBuildingID.value = null;
        emit('select-building', -1);
      }
    }
  }

  function animate() {
    if (!renderer.value || !camera.value) return;
    requestAnimationFrame(animate);
    controls.value?.update();
    renderer.value.render(scene, camera.value);
  }

  watch(buildings, () => {
    addBuildings();
    highlightSelectedBuilding();
  }, { deep: true });

  watch(selectedBuildingID, () => {
    highlightSelectedBuilding();
  })

  onMounted(() => {
    initScene();
    window.addEventListener("resize", () => {
      if (renderer.value && camera.value && containerRef.value) {
        camera.value.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
        camera.value.updateProjectionMatrix();
        renderer.value.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
      }
    });

    containerRef.value.addEventListener("dblclick", onDblClick);
    containerRef.value.addEventListener('pointerdown', onPointerDown);
    containerRef.value.addEventListener('pointermove', onPointerMove);
    containerRef.value.addEventListener('pointerup', onPointerUp);
  });

  return {};
}

