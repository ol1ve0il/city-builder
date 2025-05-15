import { ref, onMounted, watch, computed, toRaw } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useBuildingsStore } from '../stores/buildings'
import { storeToRefs } from 'pinia'
import { Building } from '../models/building'
import { ObjectControls } from '../common/ObjectControls'

export function useCityScene(containerRef: any) {
  const buildingStore = useBuildingsStore()
  const { buildings } = storeToRefs(buildingStore)

  const scene = new THREE.Scene()
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const controls = ref<OrbitControls | null>(null)
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const buildingMeshes: THREE.Mesh[] = []
  const hoveredMesh = ref<THREE.Mesh | null>(null)
  const selectedBuildingID = computed(() => buildingStore.selectedBuilding?.id ?? null)

  const objectControls = ref<ObjectControls | null>(null)

  const sceneSize = { x: 50, z: 50 }
  const gridSize = 1

  function initScene() {
    const container = containerRef.value
    if (!container) return

    // Renderer
    renderer.value = new THREE.WebGLRenderer({ antialias: true })
    renderer.value.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.value.domElement)

    // Camera
    camera.value = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.value.position.set(10, 10, 10)
    scene.add(camera.value)

    // Controls
    controls.value = new OrbitControls(camera.value, renderer.value.domElement)
    controls.value.enableDamping = true
    controls.value.maxPolarAngle = Math.PI / 2.2

    // Lights
    addLights()
    addGround()
    addGridHelper()
    addBuildings()

    objectControls.value = new ObjectControls(scene, camera.value, renderer.value.domElement)
    objectControls.value.setControls(controls.value!)

    animate()
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)
  }

  function addGround() {
    const geometry = new THREE.PlaneGeometry(sceneSize.x, sceneSize.z)
    const material = new THREE.MeshStandardMaterial({ color: 0x228b22, side: THREE.DoubleSide })
    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)
  }

  function addGridHelper() {
    const grid = new THREE.GridHelper(sceneSize.x, sceneSize.z)
    grid.material.opacity = 0.25
    grid.material.transparent = true
    scene.add(grid)
  }

  function addBuildings() {
    buildingMeshes.forEach((mesh) => scene.remove(mesh))
    buildingMeshes.length = 0

    buildings.value.forEach((b: Building) => {
      const geometry = new THREE.BoxGeometry(b.width, b.height, b.depth)
      const material = new THREE.MeshStandardMaterial({ color: b.color || 0x44aa88 })
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(b.x, b.height / 2, b.z)
      mesh.rotation.y = b.rotation ?? 0

      mesh.userData = { id: b.id, width: b.width, depth: b.depth }

      scene.add(mesh)
      buildingMeshes.push(mesh)
    })

    highlightSelectedBuilding()
  }

  function highlightSelectedBuilding() {
    buildingMeshes.forEach((mesh) => {
      const isSelected = mesh.userData.id === selectedBuildingID.value
      const material = mesh.material as THREE.MeshStandardMaterial
      material.color.set(isSelected ? 0xff0000 : 0x44aa88)
  
      if (isSelected) {
        objectControls.value?.attach(mesh)
      }
    })
  
    if (selectedBuildingID.value == null) {
      objectControls.value?.detach()
    }
  }

  function handlePointerMove(event: MouseEvent) {
    if (!renderer.value || !camera.value) return

    const rect = renderer.value.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera.value)
    const intersects = raycaster.intersectObjects(buildingMeshes)

    const prev = hoveredMesh.value
    hoveredMesh.value = intersects.length > 0 ? intersects[0].object as THREE.Mesh : null

    if (prev && prev !== hoveredMesh.value) {
      (prev.material as THREE.MeshStandardMaterial).emissive.set(0x000000)
    }

    if (hoveredMesh.value) {
      (hoveredMesh.value.material as THREE.MeshStandardMaterial).emissive.set(0x333333)
    }
  }

  function handleClick(event: MouseEvent) {
    if (!renderer.value || !camera.value) return

    const rect = renderer.value.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera.value)
    const intersects = raycaster.intersectObjects(buildingMeshes)

    if (intersects.length > 0) {
      const mesh = intersects[0].object as THREE.Mesh
      buildingStore.selectBuilding(mesh.userData.id)
    } else {
      buildingStore.selectBuilding(-1)
    }
  }

  function animate() {
    requestAnimationFrame(animate)
    controls.value?.update()
    renderer.value?.render(scene, camera.value!)
  }

  watch(buildings, () => {
    addBuildings()
  }, { deep: true })

  watch(selectedBuildingID, () => {
    highlightSelectedBuilding()
  })

  onMounted(() => {
    initScene()

    window.addEventListener('resize', () => {
      if (!camera.value || !renderer.value || !containerRef.value) return
      camera.value.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
      camera.value.updateProjectionMatrix()
      renderer.value.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    })

    containerRef.value.addEventListener('click', handleClick)
    containerRef.value.addEventListener('pointermove', handlePointerMove)
  })

  return {}
}
