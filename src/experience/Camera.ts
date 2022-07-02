import { EventEmitter } from "./utils/EventEmitter";
import * as THREE from "three";
import { Experience } from "./Experience";
import { Controls } from "./Controls";

export class Camera {
  eventEmitter: EventEmitter;
  experience: Experience;
  instance: THREE.PerspectiveCamera;
  controls: Controls;

  constructor() {
    this.eventEmitter = EventEmitter.getInstance();
    this.experience = Experience.getInstance();
    this.instance = new THREE.PerspectiveCamera();
    this.configureCamera();
    this.controls = new Controls();
    this.eventEmitter.on("resize", this.resize.bind(this));
  }

  configureCamera() {
    if (!this.experience.sizes || !this.experience.scene) return;
    this.instance.fov = 75;
    this.instance.aspect =
      this.experience.sizes.width / this.experience.sizes.height;
    this.instance.near = 0.1;
    this.instance.far = 1000;
    this.instance.position.set(0, 1, 3);
    this.instance.updateProjectionMatrix();
    this.experience.scene.add(this.instance);
  }

  resize() {
    if (!this.experience.sizes) return;
    this.instance.aspect =
      this.experience.sizes.width / this.experience.sizes.height;
    this.instance.updateProjectionMatrix();
  }
}
