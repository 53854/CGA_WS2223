import * as THREE from 'three';

export default class Floor extends THREE.Group {

  constructor() {
    super();
    const floorGeometry = new THREE.PlaneGeometry(250, 250);
    const floorMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.8});

    const floorTexture = new THREE.TextureLoader().load('src/images/grass.png');
    floorTexture.repeat.set(20, 20);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorMaterial.map = floorTexture;

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.name  = "floor";
    floor.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    floor.receiveShadow = true;
    this.add(floor);
  }
}