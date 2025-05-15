import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class ObjectControls {
  private camera: THREE.Camera
  private domElement: HTMLElement
  private scene: THREE.Scene
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  private dragOffset = new THREE.Vector3()
  private isDragging = false
  private draggedObject: THREE.Object3D | null = null
  private rotationStartX = 0
  private controls?: OrbitControls
  private gridSize = 1

  constructor(scene: THREE.Scene, camera: THREE.Camera, domElement: HTMLElement) {
    this.scene = scene
    this.camera = camera
    this.domElement = domElement

    this.initEvents()
  }

  setControls(controls: OrbitControls) {
    this.controls = controls
  }

  attach(object: THREE.Object3D) {
    this.draggedObject = object
  }

  detach() {
    this.draggedObject = null
  }

  private initEvents() {
    this.domElement.addEventListener('pointerdown', this.onPointerDown)
    this.domElement.addEventListener('pointermove', this.onPointerMove)
    this.domElement.addEventListener('pointerup', this.onPointerUp)
    this.domElement.addEventListener('contextmenu', this.onRightClick)
  }

  private onPointerDown = (event: PointerEvent) => {
    if (!this.draggedObject) return

    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersection = new THREE.Vector3()
    if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
      this.dragOffset.subVectors(intersection, this.draggedObject.position)
      this.isDragging = true

      this.rotationStartX = event.clientX

      if (this.controls) this.controls.enabled = false
    }
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.isDragging || !this.draggedObject) return

    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersectPoint = new THREE.Vector3()
    if (this.raycaster.ray.intersectPlane(this.plane, intersectPoint)) {
      const targetPos = intersectPoint.sub(this.dragOffset)

      this.draggedObject.position.x = Math.round(targetPos.x / this.gridSize) * this.gridSize
      this.draggedObject.position.z = Math.round(targetPos.z / this.gridSize) * this.gridSize
    }
  }

  private onPointerUp = () => {
    if (this.isDragging) {
      this.isDragging = false
      if (this.controls) this.controls.enabled = true
    }
  }

  private onRightClick = (event: MouseEvent) => {
    if (!this.draggedObject) return

    event.preventDefault()

    const deltaX = event.clientX - this.rotationStartX
    const rotationStep = Math.PI / 8 // 22.5 degrees
    const rotationAmount = Math.round(deltaX / 30) * rotationStep

    this.draggedObject.rotation.y += rotationAmount
    this.rotationStartX = event.clientX
  }

  private updatePointer(event: PointerEvent) {
    const rect = this.domElement.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  dispose() {
    this.domElement.removeEventListener('pointerdown', this.onPointerDown)
    this.domElement.removeEventListener('pointermove', this.onPointerMove)
    this.domElement.removeEventListener('pointerup', this.onPointerUp)
    this.domElement.removeEventListener('contextmenu', this.onRightClick)
  }
}
