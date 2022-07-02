import { EventEmitter } from "./utils/EventEmitter";
import * as THREE from "three";
import { Experience } from "./Experience";

export class Controls {
  eventEmitter: EventEmitter;
  experience: Experience;
  keysPressed: Record<string, boolean>;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.keysPressed = {};
    this.setUpKeysPressed();
    this.setUpListeners();
  }

  setUpKeysPressed() {
    const usedKeys: string[] = ["w", "a", "s", "d", "space", "shift", "ctrl"];
    const keysPressed: Record<string, boolean> = {};
    usedKeys.forEach((key) => (keysPressed[key] = false));
    this.keysPressed = keysPressed;
  }

  setUpListeners() {
    window.addEventListener("mousemove", this.mouseMove.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("dblclick", this.doubleClick.bind(this));
    this.eventEmitter.on("tick", this.move.bind(this));

    // Pointer lock
    this.experience.canvas.onclick = () => {
      this.experience.canvas.requestPointerLock();
      document.addEventListener(
        "pointerlockchange",
        this.pointerLockChange.bind(this)
      );
    };
  }

  mouseMove(evt: any) {
    if (!this.experience.camera || !this.experience.lock) return;
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    const deltaX = evt.movementX / 500;
    const deltaY = evt.movementY / 500;
    euler.setFromQuaternion(this.experience.camera.instance.quaternion);
    euler.y -= deltaX;
    euler.x -= deltaY;
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
    this.experience.camera.instance.quaternion.setFromEuler(euler);
  }

  keyUp(evt: any) {
    if (!this.experience.lock) return;
    if (Object.keys(this.keysPressed).includes(evt.key))
      this.keysPressed[evt.key] = false;
  }

  keyDown(evt: any) {
    if (!this.experience.lock) return;
    if (Object.keys(this.keysPressed).includes(evt.key))
      this.keysPressed[evt.key] = true;
  }

  doubleClick() {
    !document.fullscreenElement
      ? this.experience.canvas.requestFullscreen()
      : document.exitFullscreen();
  }

  pointerLockChange() {
    const locked = document.pointerLockElement === this.experience.canvas;
    this.experience.lock = locked;
    // Keyup all keys if unlock the screen
    if (!locked) {
      Object.entries(this.keysPressed).forEach(([key, value]) => {
        if (value) this.keysPressed[key] = false;
      });
    }
  }

  move() {
    Object.entries(this.keysPressed).forEach(([key, value]) => {
      if (!value || !["w", "a", "s", "d"].includes(key)) return;
      const direction = new THREE.Vector3();
      this.experience.camera?.instance?.getWorldDirection(direction);
      if (["a", "d"].includes(key))
        direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      let speed = 0.1;
      // const currentPosition = this.experience.camera.perspectiveCamera.position.clone();
      const currentPosition = new THREE.Vector3(
        this.experience.camera?.instance.position.x,
        this.experience.camera?.instance.position.y,
        this.experience.camera?.instance.position.z
      );
      currentPosition.add(
        direction.multiplyScalar(["w", "a"].includes(key) ? speed : -speed)
      );
      this.experience.camera?.instance.position.set(
        currentPosition.x,
        1,
        currentPosition.z
      );
    });
  }
}
