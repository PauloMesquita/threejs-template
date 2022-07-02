import * as THREE from "three";
import { Experience } from "../Experience";

export class World {
  experience: Experience;

  constructor() {
    this.experience = Experience.getInstance();
    this.setUp();
  }

  setUp() {
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial()
    );
    testMesh.position.y = 1;
    this.experience.scene?.add(testMesh);
    console.log("testMesh", testMesh.geometry);
  }
}
