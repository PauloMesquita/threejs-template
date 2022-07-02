import { EventEmitter } from "./utils/EventEmitter";
import * as THREE from "three";
import { Camera } from "./Camera";
import { Sizes } from "./utils/Sizes";
import { Time } from "./utils/Time";
import { Renderer } from "./Renderer";
import { World } from "./world/World";

export class Experience {
  private static instance: Experience;

  eventEmitter?: EventEmitter;
  lock?: boolean; // Pointer lock state
  canvas: any;
  sizes?: Sizes;
  time?: Time;
  scene?: THREE.Scene;
  camera?: Camera;
  renderer?: Renderer;
  world?: World;

  // Singleton
  static getInstance(canvas?: Element): Experience {
    if (!this.instance && canvas) {
      this.instance = new this(canvas);
      // Call setUp here because functions from setUp getInstance of this class
      this.instance.setUp();
    }
    return this.instance;
  }

  private constructor(canvas: Element) {
    this.canvas = canvas;
  }

  setUp() {
    this.lock = false;
    this.eventEmitter = EventEmitter.getInstance();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
  }
}
