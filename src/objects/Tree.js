import * as THREE from "three";

export default class Tree extends THREE.Group {
  constructor() {
    super();
    this.animations = [];
    this.loadingDone = false;
    this.addParts();
  }

  addParts() {
    var trunkGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
    var foliageGeometry = new THREE.CylinderGeometry(.25,5, 15, 32);

    var trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b5e3c });
    var foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });

    var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    var foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

    trunk.position.y = trunkGeometry.parameters.height / 2;
    foliage.position.y = trunkGeometry.parameters.height + foliageGeometry.parameters.height /2;

    this.add(trunk);
    this.add(foliage);

    this.loadingDone = true;
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addCylinder(this, 2, 5, 5, 20, 12,0,10,0);
    }
  }
}
